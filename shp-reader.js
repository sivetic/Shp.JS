(function() {
	var root = this;
	var $ = root.jQuery;
	
	/**
	 * Handles reading data from a shapefile
	 */
	ShpJS.ShpReader = function(options) {		
		this.initialize.call(this,arguments);
	};
	
	$.extend(ShpJS.ShpReader.prototype, {
		_zipFile: null,
		
		_shpBuffer: null,
		_shpData: null,
		
		_shxReader: null,
		_dbfReader: null,
		
		_features: null,
		
		onparsecomplete: null,
		
		shapeTypeCode: -1,
	
		initialize: function() {
		},
		
		/**
		 * Reads features from the supplied file (zip file) and
		 * returns a FeatureSet containing the read features.
		 */
		read: function(file) {
			var scope = this;			
			var reader = new FileReader();
			
			// Called when the zip file finishes loading
			reader.onload = function(e) {
				// Convert the loaded array buffer to a string so it can be read by ZipFile
				var buffer = e.target.result;
				var arr = new Uint8Array(buffer);
				var sArr = '';
				for (var i=0; i<buffer.byteLength; i++)
					sArr += String.fromCharCode(arr[i]);

				// Create the ZipFile instance
				scope._zipFile = new ZipFile(sArr);
				
				// Find indices of shp/shx/dbf files
				var shpIdx = -1,
					shxIdx = -1,
					dbfIdx = -1;
					
				for (var idx=0; idx<scope._zipFile.filelist.length; idx++) {
					var fname = scope._zipFile.filelist[idx].filename;
					if (fname.match(/\.shp$/))
						shpIdx = idx;
					else if (fname.match(/\.shx$/))
						shxIdx = idx;
					else if (fname.match(/\.dbf$/))
						dbfIdx = idx;
				}

				if (shpIdx === -1 || shxIdx === -1 || dbfIdx === -1) {
					console.error('Could not find one or more required files');
					return;
				}
				
				// Get the file references
				var fShp = scope._zipFile.filelist[shpIdx];
				var fShx = scope._zipFile.filelist[shxIdx];
				var fDbf = scope._zipFile.filelist[dbfIdx];
				
				// Convert the string into an array buffer
				var content = scope._zipFile.extract(fShp.filename);
				scope._shpBuffer = new ArrayBuffer(content.length);
				scope._shpData = new DataView(scope._shpBuffer);
				for (var i=0; i<content.length; i++)
					scope._shpData.setUint8(i, content.charCodeAt(i));
					
				// Create the SHX reader, required to parse the SHP
				scope._shxReader = new ShpJS.ShxReader();
				scope._shxReader.read.call(scope._shxReader, scope._zipFile.extract(fShx.filename));
				
				// Create the DBF reader, and parse the DBF
				scope._dbfReader = new ShpJS.DbfReader();
				scope._dbfReader.read.call(scope._dbfReader, scope._zipFile.extract(fDbf.filename));
				
				// Parse the SHP
				scope._parse.call(scope);
				
				// Call the event handler, if one is present
				if (scope.onparsecomplete || typeof scope.onparsecomplete == 'function') {
					scope.onparsecomplete.call(scope, scope._features);
				}
			};
			
			reader.readAsArrayBuffer(file);
		},
		
		_parse: function() {
			this._features = new esri.tasks.FeatureSet();
			
			// Read and set the shapetype code
			this.shapeTypeCode = this._shpData.getInt32(32, true);
			if (this.shapeTypeCode == ShpJS.Constants.POINT_SHAPE_TYPE)
				this._features.geometryType = 'esriGeometryPoint';
			else if (this.shapeTypeCode == ShpJS.Constants.POLYLINE_SHAPE_TYPE)
				this._features.geometryType = 'esriGeometryPolyline';
			else if (this.shapeTypeCode == ShpJS.Constants.POLYGON_SHAPE_TYPE)
				this._features.geometryType = 'esriGeometryPolygon';
			else if (this.shapeTypeCode == ShpJS.Constants.MULTIPOINT_SHAPE_TYPE)
				this._features.geometryType = 'esriGeometryMultipoint';
				
			for (var i=0; i<this._shxReader.featureIndices.length; i++) {
				var fidx = this._shxReader.featureIndices[i].offset;
				var flen = this._shxReader.featureIndices[i].length;
				
				// Sanity check - make sure feature type is correct
				if (this._shpData.getInt32(fidx+8, true) != this.shapeTypeCode) {
					// TODO: Throw error here
					console.error('Shape type mismatch, aborting parse!');
					this._features = null;
					return;
				}
				
				// Advance the offset to skip record #, content length, and shape type
				fidx += 12;
				var g;
				if (this.shapeTypeCode == ShpJS.Constants.POINT_SHAPE_TYPE)
					g = this._parsePoint(fidx);
				else if (this.shapeTypeCode == ShpJS.Constants.MULTIPOINT_SHAPE_TYPE)
					g = this._parseMultipoint(fidx);
				else if (this.shapeTypeCode == ShpJS.Constants.POLYLINE_SHAPE_TYPE)
					g = this._parsePolyline(fidx);
				else if (this.shapeTypeCode == ShpJS.Constants.POLYGON_SHAPE_TYPE)
					g = this._parsePolygon(fidx);
				
				// Get the attributes from DBF
				var attrs = this._dbfReader.getAttributes(i);
				
				// Create the Graphics object and push into features array
				var gfx = new esri.Graphic(g, null, attrs, null);
				this._features.features.push(gfx);
			}
			
			console.debug('features parsed: ', this._features);
		},
		
		_parsePoint: function(idx) {
			return new esri.geometry.Point(
				this._shpData.getFloat64(idx, true),
				this._shpData.getFloat64(idx+8, true)
			);
		},
		
		_parseMultipoint: function(idx) {
			var nump = this._shpData.getInt32(idx+32, true);
			var mp = new esri.geometry.Multipoint();
			
			idx+=36;
			for (var i=0; i<nump; i++) {
				mp.addPoint([this._shpData.getFloat64(idx, true), this._shpData.getFloat64(idx+8, true)]);
				idx += 16;
			}
			
			return mp;
		},
		
		_parsePolyline: function(idx) {
			var numpaths = this._shpData.getInt32(idx+32, true);
			var numpoints = this._shpData.getInt32(idx+36, true);
			
			idx += 40;
			
			var pathIdxs = [];
			for (var i=0; i<numpaths; i++) {
				pathIdxs.push(this._shpData.getInt32(idx, true));
				idx += 4;
			}
			
			var pline = new esri.geometry.Polyline();
			
			// Read the points for each individual part
			for (var i=0; i<numpaths; i++) {
				// Current part index
				var pidx = pathIdxs[i];
				// Loop through the points starting at the current part index and
				// either ending at the next part index, or at numpoints which is the
				// last point index.  Add all the read points to the path
				var path = [];
				for (var j=pidx; j< (i < numpaths-1 ? pathIdxs[i+1] : numpoints); j++) {
					path.push([
						this._shpData.getFloat64(idx, true), 
						this._shpData.getFloat64(idx+8, true)
					]);
					
					idx += 16;
				}
				
				pline.addPath(path);
			}
			
			return pline;
		},
		
		_parsePolygon: function(idx) {
			var numrings = this._shpData.getInt32(idx+32, true);
			var numpoints = this._shpData.getInt32(idx+36, true);
			
			idx += 40;
			
			var ringIdxs = [];
			for (var i=0; i<numrings; i++) {
				ringIdxs.push(this._shpData.getInt32(idx, true));
				idx += 4;
			}
			
			var pgon = new esri.geometry.Polygon();
			
			// Read the points for each individual part
			for (var i=0; i<numrings; i++) {
				// Current part index
				var pidx = ringIdxs[i];
				// Loop through the points starting at the current part index and
				// either ending at the next part index, or at numpoints which is the
				// last point index.  Add all the read points to the ring
				var ring = [];
				for (var j=pidx; j< (i < numrings-1 ? ringIdxs[i+1] : numpoints); j++) {
					ring.push([
						this._shpData.getFloat64(idx, true), 
						this._shpData.getFloat64(idx+8, true)
					]);
					
					idx += 16;
				}
				
				pgon.addRing(ring);
			}
			
			return pgon;
		}
		
	});
	
}).call(this);
