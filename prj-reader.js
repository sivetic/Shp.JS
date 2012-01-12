ShpJS.PrjReader = function() {
	return {
		/**
		 * Tries to determine WKID based on supplied PRJ string by
		 * comparing the string to a list of known PRJ strings
		 */
		prjToWkid: function(prjString) {
			var wkid = null;
			$.each(ShpJS.WktStrings, function(k, v) {
				if (v == prjString) {
					wkid = parseInt(k);
					return true;
				}
			});
			
			return wkid === null ? 
				new esri.SpatialReference({'wkt': prjStrng}) :
				new esri.SpatialReference({'wkid': wkid});
		}		
	};
}();