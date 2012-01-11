(function() {
	var root = this;
	var $ = root.jQuery;
	
	/**
	 * Handles reading data from a shapefile
	 */
	ShpJS.DbfReader = function(options) {		
		this.initialize.call(this,arguments);
	};
	
	$.extend(ShpJS.DbfReader.prototype, {
		_zipFile: null,
		
		_dbfBuffer: null,
		_dbfData: null,
		
		_numFeatures: -1,
		_headerLength: -1,
		_recordSize: -1,
	
		fields: [],
	
		initialize: function() {
		},
		
		/**
		 * Reads features from the supplied content string
		 */
		read: function(content) {
			// Read the content string into an array buffer
			this._dbfBuffer = new ArrayBuffer(content.length);
			this._dbfData = new DataView(this._dbfBuffer);
			for (var i=0; i<content.length; i++)
				this._dbfData.setUint8(i, content.charCodeAt(i));
				
			// Get the field information from the header
			this._parseHeader();
		},
		
		/**
		 * Reads attributes at the specified index and returns as a javascript object
		 */
		getAttributes: function(idx) {
			var attrs = {};
			
			// Set the offset to begin the read
			var offset = this._headerLength + idx*this._recordSize + 1;
			
			// Read all the fields, one at a time
			for (var i=0; i<this.fields.length; i++) {
				var f = this.fields[i];
				var ft = f.type;
				
				var s = '';
				if (ft == 'esriFieldTypeOID' || ft == 'esriFieldTypeInteger') {
					s = this._readString(offset, ShpJS.Constants.INTEGER_LENGTH);
					attrs[f.name] = parseInt(s);
					offset += ShpJS.Constants.INTEGER_LENGTH;
				} else if (ft == 'esriFieldTypeSmallInteger') {
					s = this._readString(offset, ShpJS.Constants.SHORT_INTEGER_LENGTH);
					attrs[f.name] = parseInt(s);
					offset += ShpJS.Constants.SHORT_INTEGER_LENGTH;
				} else if (ft == 'esriFieldTypeDouble') {
					s = this._readString(offset, ShpJS.Constants.DOUBLE_LENGTH);
					var arr = s.split('e+');
					if (arr == null || arr.length < 1 || arr.length > 2) {
						attrs[f.name] = null;
					} else {
						if (arr.length == 0) {
							// Weird case, should never happen, but lets treat it as a double
							attrs[f.name] = parseFloat(arr[0]);
						} else if (arr.length == 2) {
							attrs[f.name] = parseFloat(arr[0]) * Math.pow(10, parseInt(arr[1]));
						}
					}
					offset += ShpJS.Constants.DOUBLE_LENGTH;
				} else if (ft == 'esriFieldTypeSingle') {
					s = this._readString(offset, ShpJS.Constants.SINGLE_LENGTH);
					var arr = s.split('+e');
					if (arr == null || arr.length < 1 || arr.length > 2) {
						attrs[f.name] = null;
					} else {
						if (arr.length == 0) {
							// Weird case, should never happen, but lets treat it as a double
							attrs[f.name] = parseFloat(arr[0]);
						} else if (arr.length == 2) {
							attrs[f.name] = Math.pow(parseFloat(arr[0]), parseInt(arr[1]));
						}
					}
					offset += ShpJS.Constants.SINGLE_LENGTH;
				} else if (ft == 'esriFieldTypeString') {
					s = this._readString(offset, f.length);
					attrs[f.name] = s;
					offset += f.length;
				} else if (ft == 'esriFieldTypeDate') {
					s = this._readString(offset, ShpJS.Constants.DATE_LENGTH);
					attrs[f.name] = s.length == 8 ? new Date(parseInt(s.substr(0,4)), parseInt(s.substr(4,2)), parseInt(s.substr(6,2))) : null;
					offset += ShpJS.Constants.DATE_LENGTH;
				}
			}
			
			return attrs;
		},
		
		/**
		 * Reads the important information from the DBF header.
		 * 
		 * Bytes        Type    Endian          Name
		 * 4-7          int32   little          Number of records in the table
		 * 8-9          int16   little          Size of the header, in bytes
		 * 10-11        int16   little          Size of each individual record, in bytes
		 *
		 *
		 * Field Descriptor Headers (start at byte 33):
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
		_parseHeader: function() {
			// Get the info about size of DBF
			this._numFeatures = this._dbfData.getInt32(4, true);
			this._headerLength = this._dbfData.getInt16(8, true);
			this._recordSize = this._dbfData.getInt16(10, true);
			
			// Parse the field descriptors from the header
			var b = -1;
			for (var i=32; i<this._headerLength-1; i+=32) {
				var fname = '',
					ftype = '',
					length = -1;
				
				// Read the name (11 bytes)
				for (var j=0; j<11; j++) {
					b = this._dbfData.getUint8(i+j, true);
					if (b === ShpJS.Constants.PAD)
						break;
					fname += String.fromCharCode(b);
				}
				
				ftype = String.fromCharCode(this._dbfData.getUint8(i+11, true));
				length = this._dbfData.getUint8(i+16, true);
				
				var field = {
					'name': fname,
					'alias': fname
				};
				
				// Set the field type
				if (fname.toLowerCase() == 'objectid' && ftype == 'N') {
					field.type = 'esriFieldTypeOID';
					oidFound = true;
				} else if (ftype == 'N' && length == ShpJS.Constants.INTEGER_LENGTH) {
					field.type = 'esriFieldTypeInteger';
				} else if (ftype == 'N' && length == ShpJS.Constants.SHORT_INTEGER_LENGTH) {
					field.type = 'esriFieldTypeSmallInteger';
				} else if (ftype == 'F' && length == ShpJS.Constants.DOUBLE_LENGTH) {
					field.type = 'esriFieldTypeDouble';
				} else if (ftype == 'F' && length == ShpJS.Constants.SINGLE_LENGTH) {
					field.type = 'esriFieldTypeSingle';
				} else if (ftype == 'C') {
					field.type = 'esriFieldTypeString';
					field.length = length;
				} else if (ftype == 'D') {
					field.type = 'esriFieldTypeDate';
				}
				
				// Add the field to the field array
				this.fields.push(field);
			}
		},
		
		/**
		 * Reads a string from the offset of a specified length.
		 * any PAD values (0x20) will be ignored.
		 */
		_readString: function(offset, length) {
			var s = '';
			for (var i=0; i<length; i++) {
				var c = this._dbfData.getUint8(offset+i, true);
				// Skip 0x0 values
				if (c > 0x0)
					s += String.fromCharCode(c);
			}
			return $.trim(s);
		}
	});
	
}).call(this);
