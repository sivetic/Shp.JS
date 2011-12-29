/**
 * Constants used by the Shp/Shx/Dbf/etc writers.
 */
//ShpJS.Constants = {
ShpJS.Constants = function() {
	return {
		/* DBF CONSTANTS */
			
		/* Initial start year, used for header */
		START_YEAR: 1900,
		
		/* Language Driver ID - 0x57 */
		LANGUAGE_DRIVER_ID: 87, /*
		
		/* Maximum length of a field name */
		MAX_FIELD_NAME_LENGTH: 10,
		
		/* Index in the header storing the number of records in the table */
		NUM_RECORDS_IN_TABLE_INDEX: 4,
		
		/* Index in the header storing the size (in bytes) of the header */
		NUM_BYTES_IN_HEADER_INDEX: 8,
		
		/* Index in the header storing the size (in bytes) of the record */
		NUM_BYTES_IN_RECORD_INDEX: 10,
		
		/* Header termination character - 0x0D */
		HEADER_TERMINATOR: 13,
		
		/* EOF marker */
		EOF_TERMINATOR: 26,
		
		/* Padding character used by DBFs - 0x20 */
		PAD: 32,
		
		/* ESRI defined default data type lengths */
		
		SHORT_INTEGER_LENGTH: 4,
		INTEGER_LENGTH: 9,
		SINGLE_LENGTH: 13,
		SINGLE_PRECISION: 11,
		DOUBLE_LENGTH: 19,
		DOUBLE_PRECISION: 11,
		DATE_LENGTH: 8,
		GUID_LENGTH: 38,
		MAX_STRING_LENGTH: 254,
		
		
		/* SHAPEFILE CONSTANTS */
		
		/* Header length, in bytes */
		HEADER_LENGTH: 100,
		
		/* File code (header always starts with this - 0x270A*/
		HEADER_START_CODE: 9994,
		
		/* Shapefile version */
		VERSION_CODE: 1000,
		
		/* Index of the file length in the shapefile header */
		HEADER_FILE_LENGTH: 24,
		
		/* Index of the bounding box in the shapefile header */
		HEADER_BBOX_INDEX: 36,
		
		/* SHP Geometry types */
		POINT_SHAPE_TYPE: 1,
		POLYLINE_SHAPE_TYPE: 3,
		POLYGON_SHAPE_TYPE: 5,
		MULTIPOINT_SHAPE_TYPE: 8
	};
}();
