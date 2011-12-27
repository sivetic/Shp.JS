(function() {
	var root = this;
	var $ = root.jQuery;
	
	/**
	 * Handles writing data to the shapefile index (shx)
	 */
	ShpJS.DbfWriter = function(options) {
		this._numFeats = options.numFeatures,
		this._fields = options.fields,
		
		this.supportedFieldTypes = {
			esriFieldTypeOID: { type: 'N', length: ShpJS.Constants.INTEGER_LENGTH, precision: 0 },
			esriFieldTypeInteger: { type: 'N', length: ShpJS.Constants.INTEGER_LENGTH, precision: 0 },
			esriFieldTypeSmallInteger: { type: 'N', length: ShpJS.Constants.SHORT_INTEGER_LENGTH, precision: 0 },
			esriFieldTypeDouble: { type: 'F', length: ShpJS.Constants.DOUBLE_LENGTH, precision: ShpJS.Constants.DOUBLE_PRECISION },
			esriFieldTypeSingle: { type: 'F', length: ShpJS.Constants.SINGLE_LENGTH, precision: ShpJS.Constants.SINGLE_PRECISION },
			esriFieldTypeString: { type: 'C', length: -1, precision: 0 },
			esriFieldTypeDate: { type: 'D', length: ShpJS.Constants.DATE_LENGTH, precision: 0 },
			esriFieldTypeGUID: { type: 'C', length: ShpJS.Constants.GUID_LENGTH, precision: 0 }
		};
		
		this.initialize.apply(this, arguments);
	};
	
	$.extend(ShpJS.DbfWriter.prototype, {
		_dbfBuffer: null,
		_dbfData: null,
		
		_recordSize: 0,
		_recIdx: 0,
		
		initialize: function() {
			
		},
		
		/**
		 * Initializes the header.  Base DBF header is composed of 32 
		 * bytes.  The rest of the header is composed of the Field Descriptor
		 * array
		 * 
		 * Note: Unlike SHP/SHX files, DBF files are entirely stored in little
		 * endian mode.
		 * 
		 * Base Header:
		 * 
		 * Bytes        Type    Endian          Name
		 * 0            byte    little          Bits 0 to 2 indicate version number (3 for 
		 *                                        level 5, 4 for dBase level 7)
		 *                                        Bits 3 and 7 indicate presence of a dBase IV or
		 *                                        dBzse for windows memo file.
		 *                                        Bits 4-6 indicate presence of a dBase IV SQL table
		 *                                        Bit 7 indicate presence of any .DBT memo file
		 *                                        For ESRI purposes, we set this to 0x3, indicating
		 *                                        level 5, and setting rest of the bits to empty.
		 * 1-3          byte    little          Date of last updated in YYMMDD format.  YY is added to
		 *                                        1900 to determine the actual year.
		 * 4-7          int32   little          Number of records in the table
		 * 8-9          int16   little          Size of the header, in bytes
		 * 10-11        int16   little          Size of each individual record, in bytes
		 * 12-13        byte    little          Reserved, fill with 0
		 * 14           byte    little          Flag indicating incomplete dBase IV transaction
		 * 15           byte    little          dBase IV encryption flag
		 * 16-27        byte    little          Reserved for multi-user processing
		 * 28           byte    little          Produtin MDX flag. 0x01 if a production .MDX exists, 0x00 otherwise
		 * 29           byte    little          Language driver ID
		 * 30-31        byte    little          Reserved, filled with 0s
		 * 
		 */
		initHeader: function() {
			// Determine the size of the DBF file based on the fields
			var f;
			this._recordSize = 1; // Each record begins with a 'deleted' flag of 1 byte
			for (var i=0; i<this._fields.length; i++) {
				f = this._fields[i];
				if (!this._isFieldSupported(f)) {
					console.warn('Encountered an unsupported field: ', f);
					continue;
				}
				
				// Increase the size of the record by field type size
				// For strings, increase it by field length (string limit is 254 chars)
				var ft = this.supportedFieldTypes[f.type];
				this._recordSize += (ft.length > 0) ? ft.length : Math.min(f.length, 254);
			}
			
			var dbfSize = 32 + // 32 byte header
				32 * this._fields.length + 1 + // 32 bytes per field plus terminator byte
				this._recordSize * this._numFeats + 1; // _recordSize bytes per feature plus terminator byte
			
			// Create the buffers
			this._dbfBuffer = new ArrayBuffer(dbfSize);
			this._dbfData = new DataView(this._dbfBuffer);
			
			// Version Information
			this._dbfData.setInt8(0, 0x3, true);
			// Date of last updated in YYMMDD
			var dt = new Date();
			this._dbfData.setInt8(1, dt.getFullYear() - ShpJS.Constants.START_YEAR, true);
			this._dbfData.setInt8(2, dt.getMonth()+1, true);
			this._dbfData.setInt8(3, dt.getDate(), true);
			// Number of records in the table
			this._dbfData.setInt32(4, this._numFeats, true);
			// Number of bytes in the header (32 header + 32 per field + 1 terminator)
			this._dbfData.setInt16(8, 32 + 32*this._fields.length+1, true);
			// Record size
			this._dbfData.setInt16(10, this._recordSize, true);
			// Reserved (2 bytes)
			this._dbfData.setInt16(12, 0x0, true);
			// dBASE IV transaction
			this._dbfData.setInt8(14, 0x0, true);
			// dBASE IV encryption flag
			this._dbfData.setInt8(15, 0x0, true);
			// 12 bytes for multi-user (0s)
			this._dbfData.setFloat64(16, 0x0, true);
			this._dbfData.setInt32(24, 0x0, true);
			// 1 byte for MDX flag
			this._dbfData.setInt8(28, 0x0, true);
			// Language driver ID
			this._dbfData.setInt8(29, ShpJS.Constants.LANGUAGE_DRIVER_ID, true);
			// Reserved (2 bytes)
			this._dbfData.setInt16(30, 0x0, true);
			
			this._writeFieldDescriptors();
		},

		/**
		 * Writes inidivual field descriptors to the dbf
		 * 
		 * Field Descriptor Headers:
		 * 
		 * Bytes        Type    Endian          Name
		 * 0-10         byte    little          Field name in ASCII (zero-filled)
		 * 11           byte    little          Field type in ASCII (C, D, L, M, or N)
		 * 12-15        byte    little  Field data address (address is in memory, not useful on disk)
		 * 16           byte    Field length in binary
		 * 17           byte    Field decimal count in binary
		 * 18-19        byte    Reserved
		 * 20           byte    Work area ID (null bytes)
		 * 21-22        byte    Reserved
		 * 23           byte    SET FIELDS flag (null bytes)
		 * 24-31        byte    Reserved
		 * 
		 * Allowable data types:
		 * C - Character
		 * D - Date.  Stored as 8 digits in YYYYMMDD format,
		 * N - Numeric.
		 * F - Float.
		 * L - Logical.  Stored as ? Y y N n T t F f (? when not initialized)
		 * M - Memo.  Unused?
		 */
		_writeFieldDescriptors: function() {
			var f, ft, fn;
			var dbfFNames = [];
			var offset = 32; // Start writing information at 33rd byte
			for (var i=0; i<this._fields.length; i++) {
				f = this._fields[0];
				if (!this._isFieldSupported(f))
					continue;
				
				fn = f.name;				
				// Field names are limited to 10 chars, trim if neccessary
				if (fn.length > ShpJS.Constants.MAX_FIELD_NAME_LENGTH) {
					fn = fn.substr(0, ShpJS.Constants.MAX_FIELD_NAME_LENGTH);
					var tfn = fn;
					var idx = 0;
					while (dbfFNames.indexOf(fn) >= 0)
						tfn = fn.substr(0, ShpJS.Constants.MAX_FIELD_NAME_LENGTH - idx.toString().length - 1) + '_' + idx++;
						
					fn = tfn;
				}
				
				// Add current field name to list so we can test for dupes
				dbfFNames.push(fn);
				
				// Write the field descriptor to the header
				// Field name, padded with 0s at the end
				for (var j=0; j<ShpJS.Constants.MAX_FIELD_NAME_LENGTH; j++) {
					if (fn.length > j)
						this._dbfData.setInt8(offset++, fn.charCodeAt(j), true);
					else
						this._dbfData.setInt8(offset++, 0x0, true); // pad with 0s
				}
				this._dbfData.setInt8(offset++, 0x0, true);
				
				// Write the field information based on type
				ft = this.supportedFieldTypes[f.type];
				this._dbfData.setInt8(offset++, ft.type.charCodeAt(0), true); // Data type
				this._dbfData.setInt32(offset, 0x0, true); // Data address - null
				offset += 4;
				// Field length, grab from actual field in case of strings
				this._dbfData.setInt8(offset++, ft.length > -1 ? ft.length : Math.min(f.length, ShpJS.Constants.MAX_STRING_LENGTH), true);
				this._dbfData.setInt8(offset++, ft.precision, true); // Precision
				
				// 14 reserved bytes
				for (var j=0; j<7; j++)
					this._dbfData.setInt16(offset+j*2, 0x0, true);
				offset += 14;
				
				// Header terminator
				this._dbfData.setInt8(offset, ShpJS.Constants.HEADER_TERMINATOR, true);
			}
		},
		
		/**
		 * Adds the feature attributes to the DBF file.
		 */
		addRecord: function(attributes) {
			var f, ft, a;
			var offset = 32 + 32*this._fields.length + this._recIdx*this._recordSize + 1;
			
			// Deleted flag - record OK
			this._dbfData.setInt8(offset, ShpJS.Constants.PAD, true);
			offset++;
			
			for (var i=0; i<this._fields.length; i++) {
				f = this._fields[i];
				ft = this.supportedFieldTypes[f.type];
				a = attributes[f.name];
				if (!this._isFieldSupported(f))
					continue;
					
				if (f.type == 'esriFieldTypeOID' || f.type == 'esriFieldTypeInteger') {
					this._writeInteger(offset, a, ShpJS.Constants.INTEGER_LENGTH);
				} else if (f.type == 'esriFieldTypeSmallInteger') {
					this._writeInteger(offset, a, ShpJS.Constants.SHORT_INTEGER_LENGTH);
				} else if (f.type == 'esriFieldTypeDouble') {
					this._writeDecimal(offset, a, ShpJS.Constants.DOUBLE_LENGTH, ShpJS.Constants.DOUBLE_PRECISION);
				} else if (f.type == 'esriFieldTypeSingle') {
					this._writeDecimal(offset, a, ShpJS.Constants.SINGLE_LENGTH, ShpJS.Constants.SINGLE_PRECISION);
				} else if (f.type == 'esriFieldTypeString') {
					this._writeString(offset, a, f.length);
				} else if (f.type == 'esriFieldTypeDate') {
					this._writeDate(offset, a);
				} else if (f.type == 'esriFieldTypeGuid') {
					this._writeGuid(offset, a);
				}
				
				offset += ft.length > -1 ? ft.length : Math.min(f.length, ShpJS.Constants.MAX_STRING_LENGTH);
			}
			
			this._recIdx++;
		},
		
		finishDbf: function() {
			var offset = 32 + 32*this._fields.length + this._recIdx*this._recordSize + 1;
			this._dbfData.setInt8(offset, ShpJS.Constants.EOF_TERMINATOR, true);
		},
		
		/**
		 * Writes a short/long integer (NO decimal places)
		 */
		_writeInteger: function(offset, value, length) {
		},
		
		/**
		 * Writes a single/double value.
		 */
		_writeDecimal: function(offset, value, length, precision) {
		},
		
		/**
		 * Writes a string value.  Strings are limited to 255 characters.
		 * If the supplied string is longer, it will be trimmed.
		 */
		_writeString: function(offset, value, length) {
			if (length > ShpJS.Constants.MAX_STRING_LENGTH)
				length = ShpJS.Constants.MAX_STRING_LENGTH;
			
			if (value == null) {
				this._pad(length);
			} else {
				// Trim stirng if necessary
				value = value.substr(0, ShpJS.Constants.MAX_STRING_LENGTH);
				// Write string out, one byte at a time
				for (var i=0; i<value.length; i++)
					this._dbfData.setInt8(offset+i, value.charCodeAt(i), true);
				this._pad(offset+value.length, length-value.length);
			}
		},
		
		/**
		 * Writes a date to the DBF
		 */
		_writeDate: function(offset, value) {
		},
		
		/**
		 * Writes a guid to the DBF
		 */
		_writeGuid: function(offset, value) {
		},
		
		/**
		 * Checks if the supplied field is supported by the shapefile format
		 */
		_isFieldSupported: function(f) {
			return f.type in this.supportedFieldTypes;
		},
		
		/**
		 * Adds a specified number of empty characters to pad
		 * pad a value in the buffer
		 */
		_pad: function(offset, length) {
			for (var i=0; i<length; i++)
				this._dbfData.setInt8(offset+i, ShpJS.Constants.PAD, true);
		}
	});
	
}).call(this);