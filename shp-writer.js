(function() {
	var root = this;
	var $ = root.jQuery;
	
	/**
	 * Handles writing data to the shapefile
	 */
	ShpJS.ShpWriter = function(options) {		
		this.initialize.call(this,arguments);
	};
	
	$.extend(ShpJS.ShpWriter.prototype, {
		_features: null,
		_shapeTypeCode: 0,
		
		_shpBuffer: null,
		_shpData: null,
		
		_shxWriter: null,
		_dbfWriter: null,
		
		initialize: function() {
		},
		
		/**
		 * Writes the features to a set of files (shp, shx, dbf, prj)
		 * required to create a shapefile.  Compresses all the written
		 * files to a zip file, and returns a reference of it to the user.
		 */
		write: function(filename, features) {			
			this._features = features;
			
			var len = this._features.features.length;
						
			// SHP buffer length depends on type of feature
			var shpBufLen = 0;
			if (this._features.geometryType == 'esriGeometryPoint') {
				this.shapeTypeCode = ShpJS.Constants.POINT_SHAPE_TYPE;
				// 100 bytes for SHP header + 28 bytes per point
				shpBufLen = 100 + len * 28;
			}
			else if (this._features.geometryType == 'esriGeometryPolyline') {
				this.shapeTypeCode = ShpJS.Constants.POLYLINE_SHAPE_TYPE;
			
				this._writePolylines();
			}
			else if (this._features.geometryType == 'esriGeometryPolygon') {
				this.shapeTypeCode = ShpJS.Constants.POLYGON_SHAPE_TYPE;
				
				this._writePolygons();
			}
			else if (this._features.geometryType == 'esriGeometryMultipoint') {
				this.shapeTypeCode = ShpJS.Constants.MULTIPOINT_SHAPE_TYPE;
				
				this._writeMultipoints();
			}
			
			// Initialize the shapefile buffer
			this._shpBuffer = new ArrayBuffer(shpBufLen);
			this._shpData = new DataView(this._shpBuffer);
			
			// Create the SHX writer
			this._shxWriter = new ShpJS.ShxWriter({ shapeTypeCode: this.shapeTypeCode, numFeatures: len });
			this._shxWriter.initHeader();
			this._dbfWriter = new ShpJS.DbfWriter({ numFeatures: len, fields: this._features.fields });
			this._dbfWriter.initHeader();
		
			this._initHeader();
			
			if (this._features.geometryType == 'esriGeometryPoint')
				this._writePoints();
			else if (this._features.geometryType == 'esriGeometryPolyline')
				this._writePolylines();
			else if (this._features.geometryType == 'esriGeometryPolygon')
				this._writePolygons();
			else if (this._features.geometryType == 'esriGeometryMultipoint')
				this._writeMultipoints();
				
			this._dbfWriter.finishDbf();
		},
		
		/**
		 * Launches the saveAs dialog box to save the compressed
		 * shapefile data that was written.
		 *
		 * TODO: Is there any way to increase efficiency?
		 * 		 Right now the work flow is:
		 * 		 ArrayBuffer -> compress -> binary string -> array buffer -> blob
		 */
		save: function(filename) {
			// Create the zip and add the necessary files to it
			var zip = new JSZip("DEFLATE");
			zip.add('jszip_test.shp', ShpJS.Base64Util.encodeBuffer(this._shpBuffer), {base64: true});
			zip.add('jszip_test.shx', ShpJS.Base64Util.encodeBuffer(this._shxWriter._shxBuffer), {base64: true});
			zip.add('jszip_test.dbf', ShpJS.Base64Util.encodeBuffer(this._dbfWriter._dbfBuffer), {base64: true});
			zip.add('jszip_test.prj', ShpJS.WktStrings[this._features.spatialReference.wkid]);
			
			// Generate the zip content as a binary string
			var content = zip.generate(true);
			
			// Create a Uint8Array from the binary string so we can get a blob out of it
			var ab = new ArrayBuffer(content.length);
			var ia = new Uint8Array(ab);
			for (var i=0; i<content.length; i++)
				ia[i] = content.charCodeAt(i);
			
			// Create a blob from the Uint8Array
			var BB = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
			var bb = new BB();
			bb.append(ab);
			saveAs(bb.getBlob('application/zip'), 'test.zip');
		},
		
		/**
		 * Initializes the shapefile header
		 */
		_initHeader: function() {
			// Header start code
			this._shpData.setInt32(0, ShpJS.Constants.HEADER_START_CODE);
			
			// 20 unused/empty bytes
			for (var i=0; i<5; i++)
				this._shpData.setInt32(4+i*4, 0x00);
			
			// File length, in 16-bit words
			this._shpData.setInt32(24, this._shpBuffer.byteLength/2);
			
			// The rest of the header info gets written in little endian mode
			this._shpData.setInt32(28, ShpJS.Constants.VERSION_CODE, true);
			
			this._shpData.setInt32(32, this.shapeTypeCode, true);
				
			// Enclosing bounds, set to 0.0 temporarily
			this._shpData.setFloat64(36, 0.0, true);
			this._shpData.setFloat64(44, 0.0, true);
			this._shpData.setFloat64(52, 0.0, true);
			this._shpData.setFloat64(60, 0.0, true);
			
			// 32 unused/empty bytes
			for (var i=0; i<8; i++)
				this._shpData.setInt32(68+i*4, 0x00);
		},
	
		/**
		 * Writes an array of points to the shapefile
		 * 
		 * Each point record is composed of a header plus contents.
		 * 
		 * Header:
		 * 
		 * Bytes        Type    Endian          Name
		 * 0-3          int32   big             Record Number (record numbers start at 1)
		 * 4-8          int32   big             Content Length
		 * 
		 * Contents:
		 * 
		 * Bytes        Type    Endian          Name
		 * 0-3          int32   little          Shape Type (1 for points)
		 * 4-11         double  little          X Coordinate
		 * 12-19        double  little          Y Coordinate
		 * 
		 */
		_writePoints: function() {
			var fs = this._features.features;		
			var f = fs[0];
			var g = f.geometry;
			var bb = new esri.geometry.Extent(g.x, g.y, g.x, g.y, this._features.spatialReference);
			var offset = 100;
			
			// Loop through all points and write them to the dataview
			for (var i=0; i<fs.length; i++) {
				f = fs[i];
				g = f.geometry;
				
				// Header - record number
				this._shpData.setInt32(offset, i+1);
				// Header - content length in 16-bit words
				// (20 bytes: 4 for shape type + 2x8 for x/y = TEN 16 bit words)
				this._shpData.setInt32(offset+4, 10);
				
				// ShapeType, X/Y, all in little endian
				this._shpData.setInt32(offset+8, ShpJS.Constants.POINT_SHAPE_TYPE, true);
				this._shpData.setFloat64(offset+12, g.x, true);
				this._shpData.setFloat64(offset+20, g.y, true);
				
				// Update the extent to include the current point
				bb.xmin = Math.min(bb.xmin, g.x);
				bb.ymin = Math.min(bb.ymin, g.y);
				bb.xmax = Math.max(bb.xmax, g.x);
				bb.ymax = Math.max(bb.ymax, g.y);
				
				// Add the record to SHX/DBF
				this._shxWriter.addRecord(offset, 20);
				this._dbfWriter.addRecord(f.attributes);
				
				// Increment the offset by length of current record
				offset += 28;
			}
			
			console.debug('bb: ', bb);
			this.setExtent(bb);
			this._shxWriter.setExtent(bb);
		},
		
		_writeMultipoints: function() {
			console.error('Writing multipoints not supported yet');
		},
		
		_writePolylines: function() {
			console.error('Writing polylines not supported yet');
		},
		
		_writePolygons: function() {
			console.error('Writing polygons not supported yet');
		},
		
		/**
		 * Updates extent stored in the header.  Extent is stored in little endian mode.
		 */
		setExtent: function(extent) {
			this._shpData.setFloat64(ShpJS.Constants.HEADER_BBOX_INDEX, extent.xmin, true);
			this._shpData.setFloat64(ShpJS.Constants.HEADER_BBOX_INDEX+8, extent.ymin, true);
			this._shpData.setFloat64(ShpJS.Constants.HEADER_BBOX_INDEX+16, extent.xmax, true);
			this._shpData.setFloat64(ShpJS.Constants.HEADER_BBOX_INDEX+24, extent.ymax, true);
		},
		
		/**
		 * Pretty-prints the contents of the shapefile buffer.  Useful
		 * for debugging
		 */
		printShpContents: function() {
			this.printHeader();
			
			if (this._features.geometryType == 'esriGeometryPoint')
				this.printShpPoints();
			
		},
		
		/**
		 * Pretty-prints the header of the shapefile buffer.
		 */
		printHeader: function() {
			console.debug('SHAPEFILE HEADER:');
			console.debug('');
			console.debug('Header Start Code: ', this._shpData.getInt32(0), ' | expecting ', ShpJS.Constants.HEADER_START_CODE);
			console.debug('20 empty bytes: ', 
				(this._shpData.getInt32(4) === 0 && this._shpData.getInt32(8) === 0 && this._shpData.getInt32(12) === 0 && 
				this._shpData.getInt32(16) === 0&& this._shpData.getInt32(20) === 0) ? 'TRUE' : 'FALSE');
			console.debug('File length (16-bit words): ', _shpData.getInt32(24));
			console.debug('Version code: ', this._shpData.getInt32(28, true), ' | expecting ', ShpJS.Constants.VERSION_CODE);
			console.debug('Shape type: ',this. _shpData.getInt32(32, true), ' | expecting ', this.shapeTypeCode);
			console.debug('Enclosing bounds: [', this._shpData.getFloat64(36, true), ', ', this._shpData.getFloat64(44, true), ', ',
				this._shpData.getFloat64(52, true), ', ', this._shpData.getFloat64(60, true), ']');
			console.debug('32 empty bytes: ', 
				(this._shpData.getInt32(68) === 0 && this._shpData.getInt32(72) === 0 && this._shpData.getInt32(76) === 0 && this._shpData.getInt32(80) === 0 &&
				this._shpData.getInt32(84) === 0 && this._shpData.getInt32(88) === 0 && this._shpData.getInt32(92) === 0 && this._shpData.getInt32(96) === 0) ? 'TRUE' : 'FALSE');
				
			console.debug('');
		},
		
		/**
		 * Pretty-prints the points from the shapefile
		 */
		printShpPoints: function() {
			console.debug('SHAPEFILE POINTS');
			// Loop through the buffer in 28-byte blocks starting at byte 100
			for (var i=0; i<this._features.features.length; i++) {
				var offset = 100 + i*28;
				console.debug('Record #: ', this._shpData.getInt32(offset), '  Length: ', this._shpData.getInt32(offset+4),
					' Shape Type: ', this._shpData.getInt32(offset+8, true), '  Point: [',
					this._shpData.getFloat64(offset+12, true), ', ', this._shpData.getFloat64(offset+20, true), ']');
			}
		}
	});
	
}).call(this);