(function() {
	var root = this;
	var $ = root.jQuery;
	
	/**
	 * Handles reading data from a shapefile
	 */
	ShpJS.ShxReader = function(options) {		
		this.initialize.call(this,arguments);
	};
	
	$.extend(ShpJS.ShxReader.prototype, {
		_zipFile: null,
		
		_shxBuffer: null,
		_shxData: null,
		
		featureIndices: [],
	
		initialize: function() {
		},
		
		/**
		 * Reads features from the supplied content string
		 */
		read: function(content) {
			console.debug('this: ', this);
			// Read the content string into an array buffer
			this._shxBuffer = new ArrayBuffer(content.length);
			this._shxData = new DataView(this._shxBuffer);
			for (var i=0; i<content.length; i++)
				this._shxData.setUint8(i, content.charCodeAt(i));
				
			// Parse the SHX file to get indexes of all features in the SHP file
			for (var i=100; i<this._shxBuffer.byteLength-1; i+=8) {
				this.featureIndices.push(
					{
						offset: this._shxData.getInt32(i) * 2,
						length: this._shxData.getInt32(i+4) * 2
					}
				);
			}
		}
	});
	
}).call(this);
