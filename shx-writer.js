(function() {
	var root = this;	
	var $ = root.jQuery;	
	
	/**
	 * Handles writing data to the shapefile index (shx)
	 */
	ShpJS.ShxWriter = function(options) {
		this._numFeats = options.numFeatures;
		this._shapeTypeCode = options.shapeTypeCode;
		
		this.initialize.apply(this, arguments);
	};
	
	$.extend(ShpJS.ShxWriter.prototype, {	
		_shxBuffer: null,
		_shxData: null,
		
		_recIdx: 0,
		
		initialize: function() {
			// Total buffer size is 100 bytes for header + 8 bytes per feature
			this._shxBuffer = new ArrayBuffer(100 + this._numFeats*8);
			this._shxData = new DataView(this._shxBuffer);
		},
		
		/**
		 * Populates the header byte array.
		 * Header is always 100 bytes long, and is as follows:
		 * 
		 * Bytes        Type    Endian          Name
		 * 0-3          int32   big                     File Code (0x0000270A)
		 * 4-23         int32   big                     Unused
		 * 24-27        int32   big                     File length (in 16-bit words, including header)
		 * 28-31        int32   little          Version (always 1000)
		 * 32-35        int32   little          Shape type (see ShpConstants)
		 * 36-67        double  little          Minimum bounding rectangle (extent as four doubles:
		 *                                                              minX, minY, maxX, maxY)
		 * 68-83        double  little          Range of Z (two doubles: minZ, maxZ).  Empty in our case.
		 * 84-99        double  little          Range of M (two doubles: minM, maxM).  Empty in our case.
		 */
		initHeader: function() {
			// Header start code
			this._shxData.setInt32(0, ShpJS.Constants.HEADER_START_CODE);
			
			// 20 unused/empty bytes
			for (var i=0; i<5; i++)
				this._shxData.setInt32(4+i*4, 0x00);
			
			// File length, in 16-bit words
			this._shxData.setInt32(24, this._shxBuffer.byteLength/2);
			
			// The rest of the header info gets written in little endian mode
			this._shxData.setInt32(28, ShpJS.Constants.VERSION_CODE, true);
			
			this._shxData.setInt32(32, this.shapeTypeCode, true);
				
			// Enclosing bounds, set to 0.0 temporarily
			this._shxData.setFloat64(36, 0.0, true);
			this._shxData.setFloat64(44, 0.0, true);
			this._shxData.setFloat64(52, 0.0, true);
			this._shxData.setFloat64(60, 0.0, true);
			
			// 32 unused/empty bytes
			for (var i=0; i<8; i++)
				this._shxData.setInt32(68+i*4, 0x00);
		},
		
		/**
		 * Adds a record to the index file at the specified index.
		 * 
		 * Index Record:
		 * 
		 * Bytes        Type    Endian          Name
		 * 0-3          int32   big             Offset as number of 16-bit words from start of the file
		 *                                        First record has offset 50, second record has offset 
		 *                                        50+1st record length, etc
		 * 4-7          int32   big             Content Length of the shapefile record (same as written to SHP)
		 */
		addRecord: function(offset, recordLength) {
			var o = 100 + this._recIdx*8; // Offset in the buffer for current feature
			this._shxData.setInt32(o, offset/2);
			this._shxData.setInt32(o+4, recordLength/2);			
			this._recIdx++;
		},
		
		/**
		 * Updates extent stored in the header.  Extent is stored in little endian mode.
		 */
		setExtent: function(extent) {
			this._shxData.setFloat64(ShpJS.Constants.HEADER_BBOX_INDEX, extent.xmin, true);
			this._shxData.setFloat64(ShpJS.Constants.HEADER_BBOX_INDEX+8, extent.ymin, true);
			this._shxData.setFloat64(ShpJS.Constants.HEADER_BBOX_INDEX+16, extent.xmax, true);
			this._shxData.setFloat64(ShpJS.Constants.HEADER_BBOX_INDEX+24, extent.ymax, true);
		}
	});
	
}).call(this);
