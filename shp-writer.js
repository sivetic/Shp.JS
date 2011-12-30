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
		 * files to a zip file.  Once write is called, save can be called
		 * to save the file to user's selected location.
		 */
		write: function(featureSet) {			
			this._features = featureSet;
			
			var len = this._features.features.length;
						
			// SHP buffer length depends on type of feature, but each
			// shapefile has the 100 byte header
			var shpBufLen = 100;
			if (this._features.geometryType == 'esriGeometryPoint') {
				this.shapeTypeCode = ShpJS.Constants.POINT_SHAPE_TYPE;
				// 28 bytes per point
				shpBufLen += len * 28;
			}
			else if (this._features.geometryType == 'esriGeometryPolyline' || this._features.geometryType == 'esriGeometryPolygon') {
				// Polygons and Polylines are essentially written the same way
				this.shapeTypeCode = this._features.geometryType == 'esriGeometryPolyline' ? ShpJS.Constants.POLYLINE_SHAPE_TYPE : ShpJS.Constants.POLYGON_SHAPE_TYPE;
				var partName = this._features.geometryType == 'esriGeometryPolyline' ? 'paths' : 'rings';
				
				// 8 bytes for record header + 44 bytes for record contents (per record)
				shpBufLen += len * (8 + 44);

				// Loop through all features
				var g;
				for (var i=0; i<len; i++) {
					g = this._features.features[i].geometry;
					
					// 4 bytes per path (for path indices)
					shpBufLen += 4*g[partName].length;
					
					// Loop through all the paths
					for (var j=0; j<g[partName].length; j++) {
						// 16 bytes per point in current path
						shpBufLen += 16*g[partName][j].length;
					}
				}
			}
			else if (this._features.geometryType == 'esriGeometryMultipoint') {
				this.shapeTypeCode = ShpJS.Constants.MULTIPOINT_SHAPE_TYPE;
				
				// 8 bytes for record header + 40 bytes for record contents (per record)
				shpBufLen += len * (8 + 40);
				
				var g;
				for (var i=0; i<len; i++) {
					g = this._features.features[i].geometry;
					
					// 16 bytes per point
					shpBufLen += g.points.length * 16;
				}
				
				console.debug('shpBufLen: ', shpBufLen);
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
				this._writePolys('paths');
			else if (this._features.geometryType == 'esriGeometryPolygon')
				this._writePolys('rings');
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
			zip.add(filename + '.shp', ShpJS.Base64Util.encodeBuffer(this._shpBuffer), {base64: true});
			zip.add(filename + '.shx', ShpJS.Base64Util.encodeBuffer(this._shxWriter._shxBuffer), {base64: true});
			zip.add(filename + '.dbf', ShpJS.Base64Util.encodeBuffer(this._dbfWriter._dbfBuffer), {base64: true});
			zip.add(filename + '.prj', ShpJS.WktStrings[this._features.spatialReference.wkid]);
			
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
			saveAs(bb.getBlob('application/zip'), filename + '.zip');
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
			var fs = this._features.features,
				f = fs[0],
				g = f.geometry,
				bb = new esri.geometry.Extent(g.x, g.y, g.x, g.y, this._features.spatialReference),
				offset = 100;
			
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
				this._shpData.setInt32(offset+8, this.shapeTypeCode, true);
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
			
			this.setExtent(bb);
			this._shxWriter.setExtent(bb);
		},
		
		/**
		 * Writes an array of multipoints to the shapefile
		 * 
		 * Each multipoint record is composed of a header plus contents.
		 * 
		 * Header:
		 * 
		 * Bytes        Type    Endian          Name
		 * 0-3          int32   big                     Record Number (record numbers start at 1)
		 * 4-8          int32   big                     Content Length
		 * 
		 * Contents:
		 * 
		 * Bytes        Type    Endian          Name
		 * 0-3          int32   little          Shape Type (8 for multipoints)
		 * 4-35         double  little          Bounding box for the multipoint
		 * 36-39        int32   little          Number of points contained by the geometry
		 * 40-n         double  little          Array of length NumPoints.  Stores, all the points
		 *                                                              contained by the multipoint (each point is composed
		 *                                                              of an X and a Y value).
		 * 
		 * 
		 */
		_writeMultipoints: function() {
			var fs = this._features.features,
				f = fs[0],
				g = f.geometry,
				e = g.getExtent(),
				pt = g.points,
				npt = pt.length,
				rl = 0,
				bb = g.getExtent(),
				offset = 100;
				
			// Loop through all the multipoints and write them to the dataview
			for (var i=0; i<fs.length; i++) {
				f = fs[i];
				g = f.geometry;
				e = g.getExtent();
				pt = g.points;
				npt = pt.length;
				
				// Calculate the record length: 4 bytes for shape type,
				// 32 bytes for bounding box, 4 bytes for # pts, 16 bytes per point
				rl = 4 + 32 + 4 + 16*npt;
				
				// Add the record to SHX/DBF
				this._shxWriter.addRecord(offset, rl);
				this._dbfWriter.addRecord(f.attributes);
				
				// Header - record number
				this._shpData.setInt32(offset, i+1);
				// Divide by 2 to get len in 16-bit words
				this._shpData.setInt32(offset+4, rl/2);
				offset += 8; // 4 for record number, 4 for record length
				
				// Content = Shape Type
				this._shpData.setInt32(offset, this.shapeTypeCode, true);
				offset += 4;
				
				// Bounding box
				this._shpData.setFloat64(offset, e.xmin, true);
				this._shpData.setFloat64(offset+8, e.ymin, true);
				this._shpData.setFloat64(offset+16, e.xmax, true);
				this._shpData.setFloat64(offset+24, e.ymax, true);
				offset += 32;
				
				// Number of number of points
				this._shpData.setInt32(offset, npt, true);
				offset += 4;
				
				for (var j=0; j<npt; j++) {
					this._shpData.setFloat64(offset, pt[j][0], true);
					this._shpData.setFloat64(offset+8, pt[j][1], true);
					offset += 16;
				}
				
				bb = bb.union(e);
			}
				
			this.setExtent(bb);
			this._shxWriter.setExtent(bb);
		},
		
		/**
		 * Writes an array of polylines or polygons to the shapefile
		 * 
		 * Each polyline record is composed of a header plus contents.
		 * 
		 * Header:
		 * 
		 * Bytes        Type    Endian          Name
		 * 0-3          int32   big                     Record Number (record numbers start at 1)
		 * 4-8          int32   big                     Content Length
		 * 
		 * Contents:
		 * 
		 * Bytes        Type    Endian          Name
		 * 0-3          int32   little          Shape Type (3 for polylines)
		 * 4-35         double  little          Bounding box for the polyline
		 * 36-39        int32   little          Total number of parts in the polyline
		 * 40-43        int32   little          Total number of points for all parts
		 * 44-n         double  little          Array of length NumParts.  Stores, for each polyline,
		 *                                                              the index of its first point in the points array (0-based)
		 * n-m          double  little          Array of length NumPoints, stores all the points for all
		 *                                                              the parts.  Points for part 1 are the first X points,
		 *                                                              followed by points for part 2, part 3, etc.             
		 */		
		_writePolys: function(partsName) {
			var fs = this._features.features,
				f = fs[0], // Feature
				g = f.geometry, // Geometry
				e = g.getExtent(), // Current geometry extent
				p = g[partsName], // Paths
				np = p.length, // Number of Parts
				npt = 0, // Number of points
				rl = 0, // Record length
				bb = g.getExtent(), // Total shapefile extent
				offset = 100; // Current offset
			
			// Loop through all polylines and write them to the dataview
			for (var i=0; i<fs.length; i++) {
				f = fs[i];
				g = f.geometry;
				e = g.getExtent();
				p = g[partsName];
				np = p.length;
				
				// Header - content length in 16-bit words
				// 4 bytes for shape type, 32 bytes for bbox, 4 bytes for NumParts,
				// 4 bytes for NumPoints, 4*NumParts bytes for Parts,
				// 16*NumPoints bytes for Points 
				npt = 0;
				for (var j=0; j<np; j++)
					npt += p[j].length;
				
				// Calculate the record length
				rl = 4 + 32 + 4 + 4 + 4*np + 16*npt;
				
				// Add the record to SHX/DBF
				this._shxWriter.addRecord(offset, rl);
				this._dbfWriter.addRecord(f.attributes);
				
				// Header - record number
				this._shpData.setInt32(offset, i+1);
				// Divide by 2 to get len in 16-bit words
				this._shpData.setInt32(offset+4, rl/2);
				offset += 8; // 4 for record number, 4 for record length
				
				// Content = Shape Type
				this._shpData.setInt32(offset, this.shapeTypeCode, true);
				offset += 4;
				
				// Bounding box
				this._shpData.setFloat64(offset, e.xmin, true);
				this._shpData.setFloat64(offset+8, e.ymin, true);
				this._shpData.setFloat64(offset+16, e.xmax, true);
				this._shpData.setFloat64(offset+24, e.ymax, true);
				offset += 32;
				
				// Number of parts/number of points
				this._shpData.setInt32(offset, np, true);
				this._shpData.setInt32(offset+4, npt, true);
				offset += 8;
				
				// Write indices for all the parts
				var partIdx = 0;
				this._shpData.setInt32(offset, 0, true); // first index is 0
				for (var j=1; j<np; j++) {
					partIdx += j*p[j-1].length;
					this._shpData.setInt32(offset + j*4, partIdx, true);
				}
				offset += np*4;

				// Write out the points
				for (var j=0; j<np; j++) {
					for (var k=0; k<p[j].length; k++) {
						this._shpData.setFloat64(offset, p[j][k][0], true);
						this._shpData.setFloat64(offset+8, p[j][k][1], true);
						offset += 16;
					}
				}
				
				bb = bb.union(e);
			}
			
			this.setExtent(bb);
			this._shxWriter.setExtent(bb);
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