ShpJS.Data = function() {
	return {
		points: new esri.tasks.FeatureSet({
		  "displayFieldName" : "OBJECTID",
		  "fieldAliases" : {
			"OBJECTID" : "OBJECTID",
			"WorkOrderId" : "WorkOrderId",
			"JobType" : "JobType",
			"Description" : "Description",
			"StartDate" : "StartDate",
			"EndDate" : "EndDate",
			"CreatedDate" : "CreatedDate",
			"LastUpdated" : "LastUpdated",
			"Status" : "Status",
			"Creator" : "Creator",
			"AssignedTo" : "AssignedTo",
			"Department" : "Department",
			"WORelateId" : "WORelateId"
		  },
		  "geometryType" : "esriGeometryPoint",
		  "spatialReference" : {
			"wkid" : 26914
		  },
		  "fields" : [
			{
			  "name" : "OBJECTID",
			  "type" : "esriFieldTypeOID",
			  "alias" : "OBJECTID"
			},
			{
			  "name" : "WorkOrderId",
			  "type" : "esriFieldTypeInteger",
			  "alias" : "WorkOrderId"
			},
			{
			  "name" : "JobType",
			  "type" : "esriFieldTypeString",
			  "alias" : "JobType",
			  "length" : 128
			},
			{
			  "name" : "Description",
			  "type" : "esriFieldTypeString",
			  "alias" : "Description",
			  "length" : 1073741822
			},
			{
			  "name" : "StartDate",
			  "type" : "esriFieldTypeDate",
			  "alias" : "StartDate",
			  "length" : 36
			},
			{
			  "name" : "EndDate",
			  "type" : "esriFieldTypeDate",
			  "alias" : "EndDate",
			  "length" : 36
			},
			{
			  "name" : "CreatedDate",
			  "type" : "esriFieldTypeDate",
			  "alias" : "CreatedDate",
			  "length" : 36
			},
			{
			  "name" : "LastUpdated",
			  "type" : "esriFieldTypeDate",
			  "alias" : "LastUpdated",
			  "length" : 36
			},
			{
			  "name" : "Status",
			  "type" : "esriFieldTypeString",
			  "alias" : "Status",
			  "length" : 128
			},
			{
			  "name" : "Creator",
			  "type" : "esriFieldTypeString",
			  "alias" : "Creator",
			  "length" : 255
			},
			{
			  "name" : "AssignedTo",
			  "type" : "esriFieldTypeString",
			  "alias" : "AssignedTo",
			  "length" : 255
			},
			{
			  "name" : "Department",
			  "type" : "esriFieldTypeString",
			  "alias" : "Department",
			  "length" : 255
			},
			{
			  "name" : "WORelateId",
			  "type" : "esriFieldTypeInteger",
			  "alias" : "WORelateId"
			},
			{
			  "name" : "GlobalID",
			  "type" : "esriFieldTypeGlobalID",
			  "alias" : "GlobalID",
			  "length" : 38
			}
		  ],
		  "features" : [
			{
			  "attributes" : {
				"OBJECTID" : 2,
				"WorkOrderId" : 2,
				"JobType" : "Road Issue",
				"Description" : "Buckling",
				"StartDate" : 1294725600000,
				"EndDate" : 1295330400000,
				"CreatedDate" : 1294937037000,
				"LastUpdated" : 1294937037000,
				"Status" : "InProgress",
				"Creator" : "denns",
				"AssignedTo" : "jplatt",
				"Department" : "Public Works",
				"WORelateId" : 8,
				"GlobalID" : "{6B044BED-27DE-42EE-9C35-B1C481610B9C}"
			  },
			  "geometry" : {
				"x" : 643416.86609201226,
				"y" : 5538612.7879397459
			  }
			},
			{
			  "attributes" : {
				"OBJECTID" : 3,
				"WorkOrderId" : 3,
				"JobType" : "Building Without a Permit",
				"Description" : "Shed erected without proper permit.",
				"StartDate" : null,
				"EndDate" : null,
				"CreatedDate" : 1294937342000,
				"LastUpdated" : 1294937342000,
				"Status" : "New",
				"Creator" : "denns",
				"AssignedTo" : "ccampbell",
				"Department" : "Planning",
				"WORelateId" : 9,
				"GlobalID" : "{F7952AD1-DC6C-41A7-8E39-4EB4A20732A2}"
			  },
			  "geometry" : {
				"x" : 641926.72977840435,
				"y" : 5540137.3201554809
			  }
			},
			{
			  "attributes" : {
				"OBJECTID" : 4,
				"WorkOrderId" : 4,
				"JobType" : "Building Without a Permit",
				"Description" : "Small barn",
				"StartDate" : null,
				"EndDate" : null,
				"CreatedDate" : 1294937437000,
				"LastUpdated" : 1294937437000,
				"Status" : "New",
				"Creator" : "denns",
				"AssignedTo" : "ben",
				"Department" : "Planning",
				"WORelateId" : 10,
				"GlobalID" : "{8BD153DE-8369-43B0-A15B-A3A35B0D4B67}"
			  },
			  "geometry" : {
				"x" : 641818.77956250496,
				"y" : 5540406.1373597812
			  }
			},
			{
			  "attributes" : {
				"OBJECTID" : 5,
				"WorkOrderId" : 5,
				"JobType" : "House Fire",
				"Description" : "Residential Fire with extensive damage to surrounding areas.",
				"StartDate" : null,
				"EndDate" : null,
				"CreatedDate" : 1294937528000,
				"LastUpdated" : 1294937528000,
				"Status" : "Completed",
				"Creator" : "denns",
				"AssignedTo" : "ajewell",
				"Department" : "Fire",
				"WORelateId" : 11,
				"GlobalID" : "{AF80C2AF-4A3F-4394-8E87-9225642C1F1A}"
			  },
			  "geometry" : {
				"x" : 641014.44462050218,
				"y" : 5539553.118987076
			  }
			},
			{
			  "attributes" : {
				"OBJECTID" : 6,
				"WorkOrderId" : 10,
				"JobType" : "Road Repair",
				"Description" : "Road and Curb damage during traffic accident.",
				"StartDate" : 1296021600000,
				"EndDate" : null,
				"CreatedDate" : 1296075203000,
				"LastUpdated" : 1296075203000,
				"Status" : "New",
				"Creator" : "stanway",
				"AssignedTo" : "stanway",
				"Department" : "Public Works",
				"WORelateId" : 16,
				"GlobalID" : "{3AB723BA-1B9D-4118-90B8-C239E2FBD45E}"
			  },
			  "geometry" : {
				"x" : 642680.33616690896,
				"y" : 5537923.9565137476
			  }
			}
		  ]
		}),
		
		multipoints: new esri.tasks.FeatureSet({
		  "displayFieldName" : "OBJECTID",
		  "fieldAliases" : {
			"OBJECTID" : "OBJECTID",
			"WorkOrderId" : "WorkOrderId",
			"JobType" : "JobType",
			"Description" : "Description",
			"StartDate" : "StartDate",
			"EndDate" : "EndDate",
			"CreatedDate" : "CreatedDate",
			"LastUpdated" : "LastUpdated",
			"Status" : "Status",
			"Creator" : "Creator",
			"AssignedTo" : "AssignedTo",
			"Department" : "Department",
			"WORelateId" : "WORelateId"
		  },
		  "geometryType" : "esriGeometryMultipoint",
		  "spatialReference" : {
			"wkid" : 26914
		  },
		  "fields" : [
			{
			  "name" : "OBJECTID",
			  "type" : "esriFieldTypeOID",
			  "alias" : "OBJECTID"
			},
			{
			  "name" : "WorkOrderId",
			  "type" : "esriFieldTypeInteger",
			  "alias" : "WorkOrderId"
			},
			{
			  "name" : "JobType",
			  "type" : "esriFieldTypeString",
			  "alias" : "JobType",
			  "length" : 128
			},
			{
			  "name" : "Description",
			  "type" : "esriFieldTypeString",
			  "alias" : "Description",
			  "length" : 1073741822
			},
			{
			  "name" : "StartDate",
			  "type" : "esriFieldTypeDate",
			  "alias" : "StartDate",
			  "length" : 36
			},
			{
			  "name" : "EndDate",
			  "type" : "esriFieldTypeDate",
			  "alias" : "EndDate",
			  "length" : 36
			},
			{
			  "name" : "CreatedDate",
			  "type" : "esriFieldTypeDate",
			  "alias" : "CreatedDate",
			  "length" : 36
			},
			{
			  "name" : "LastUpdated",
			  "type" : "esriFieldTypeDate",
			  "alias" : "LastUpdated",
			  "length" : 36
			},
			{
			  "name" : "Status",
			  "type" : "esriFieldTypeString",
			  "alias" : "Status",
			  "length" : 128
			},
			{
			  "name" : "Creator",
			  "type" : "esriFieldTypeString",
			  "alias" : "Creator",
			  "length" : 255
			},
			{
			  "name" : "AssignedTo",
			  "type" : "esriFieldTypeString",
			  "alias" : "AssignedTo",
			  "length" : 255
			},
			{
			  "name" : "Department",
			  "type" : "esriFieldTypeString",
			  "alias" : "Department",
			  "length" : 255
			},
			{
			  "name" : "WORelateId",
			  "type" : "esriFieldTypeInteger",
			  "alias" : "WORelateId"
			}
		  ],
		  "features" : [
			{
			  "attributes" : {
				"OBJECTID" : 2,
				"WorkOrderId" : 2,
				"JobType" : "Road Issue",
				"Description" : "Buckling",
				"StartDate" : 1294725600000,
				"EndDate" : 1295330400000,
				"CreatedDate" : 1294937037000,
				"LastUpdated" : 1294937037000,
				"Status" : "InProgress",
				"Creator" : "denns",
				"AssignedTo" : "jplatt",
				"Department" : "Public Works",
				"WORelateId" : 8
			  },
			  "geometry" : {
				"points" : [ [643416.86609201226, 5538612.7879397459 ], [ 641926.72977840435, 5540137.3201554809 ] , [ 641818.77956250496, 5540406.1373597812] ]
			  }
			},
			{
			  "attributes" : {
				"OBJECTID" : 5,
				"WorkOrderId" : 5,
				"JobType" : "House Fire",
				"Description" : "Residential Fire with extensive damage to surrounding areas.",
				"StartDate" : null,
				"EndDate" : null,
				"CreatedDate" : 1294937528000,
				"LastUpdated" : 1294937528000,
				"Status" : "Completed",
				"Creator" : "denns",
				"AssignedTo" : "ajewell",
				"Department" : "Fire",
				"WORelateId" : 11
			  },
			  "geometry" : {
				"points" : [ [ 641014.44462050218, 5539553.118987076 ], [ 642680.33616690896, 5537923.9565137476 ] ]
			  }
			},
			{
			  "attributes" : {
				"OBJECTID" : 6,
				"WorkOrderId" : 10,
				"JobType" : "Road Repair",
				"Description" : "Road and Curb damage during traffic accident.",
				"StartDate" : 1296021600000,
				"EndDate" : null,
				"CreatedDate" : 1296075203000,
				"LastUpdated" : 1296075203000,
				"Status" : "New",
				"Creator" : "stanway",
				"AssignedTo" : "stanway",
				"Department" : "Public Works",
				"WORelateId" : 16
			  },
			  "geometry" : {
				"points" : [ [ 642681.33616690896, 5537925.9565137476 ] ]
			  }
			}
		  ]
		}),

		polylines: new esri.tasks.FeatureSet({
		  "displayFieldName" : "StreetName",
		  "fieldAliases" : {
			"OBJECTID" : "OBJECTID",
			"StreetName" : "StreetName",
			"DateInstalled" : "DateInstalled",
			"NumberOfLanes" : "# of Lanes",
			"Condition" : "Condition",
			"SHAPE_Length" : "SHAPE_Length",
			"SurfaceType" : "SurfaceType",
			"MedianDivider" : "MedianDivider",
			"LabelPriority" : "LabelPriority",
			"GovernmentBody" : "GovernmentBody"
		  },
		  "geometryType" : "esriGeometryPolyline",
		  "spatialReference" : {
			"wkid" : 26914
		  },
		  "fields" : [
			{
			  "name" : "OBJECTID",
			  "type" : "esriFieldTypeOID",
			  "alias" : "OBJECTID"
			},
			{
			  "name" : "StreetName",
			  "type" : "esriFieldTypeString",
			  "alias" : "StreetName",
			  "length" : 50
			},
			{
			  "name" : "DateInstalled",
			  "type" : "esriFieldTypeDate",
			  "alias" : "DateInstalled",
			  "length" : 8
			},
			{
			  "name" : "NumberOfLanes",
			  "type" : "esriFieldTypeSmallInteger",
			  "alias" : "# of Lanes"
			},
			{
			  "name" : "Condition",
			  "type" : "esriFieldTypeString",
			  "alias" : "Condition",
			  "length" : 50
			},
			{
			  "name" : "SHAPE_Length",
			  "type" : "esriFieldTypeDouble",
			  "alias" : "SHAPE_Length"
			},
			{
			  "name" : "SurfaceType",
			  "type" : "esriFieldTypeString",
			  "alias" : "SurfaceType",
			  "length" : 50
			},
			{
			  "name" : "MedianDivider",
			  "type" : "esriFieldTypeString",
			  "alias" : "MedianDivider",
			  "length" : 5
			},
			{
			  "name" : "LabelPriority",
			  "type" : "esriFieldTypeSmallInteger",
			  "alias" : "LabelPriority"
			},
			{
			  "name" : "GovernmentBody",
			  "type" : "esriFieldTypeString",
			  "alias" : "GovernmentBody",
			  "length" : 50
			}
		  ],
		  "features" : [
			{
			  "attributes" : {
				"OBJECTID" : 541,
				"StreetName" : " KRISTINE PL",
				"DateInstalled" : null,
				"NumberOfLanes" : null,
				"Condition" : "2",
				"SHAPE_Length" : 54.132253343338483,
				"SurfaceType" : " ",
				"MedianDivider" : null,
				"LabelPriority" : 3,
				"GovernmentBody" : "Municipal"
			  },
			  "geometry" : {
				"paths" : [
				  [
					[
					  643080.81240000017,
					  5538191.9933000002
					],
					[
					  643050.8984000003,
					  5538146.8772999998
					]
				  ]
				]
			  }
			},
			{
			  "attributes" : {
				"OBJECTID" : 546,
				"StreetName" : "LORNE HILL RD",
				"DateInstalled" : null,
				"NumberOfLanes" : null,
				"Condition" : "2",
				"SHAPE_Length" : 2.5134217706638013,
				"SurfaceType" : null,
				"MedianDivider" : null,
				"LabelPriority" : 3,
				"GovernmentBody" : "Municipal"
			  },
			  "geometry" : {
				"paths" : [
				  [
					[
					  646473.35639999993,
					  5539409.9023000002
					],
					[
					  646473.52139999997,
					  5539407.3943000007
					]
				  ]
				]
			  }
			},
			{
			  "attributes" : {
				"OBJECTID" : 548,
				"StreetName" : "CAMSELL AVE",
				"DateInstalled" : null,
				"NumberOfLanes" : null,
				"Condition" : "2",
				"SHAPE_Length" : 844.41430487431933,
				"SurfaceType" : null,
				"MedianDivider" : null,
				"LabelPriority" : 2,
				"GovernmentBody" : "Municipal"
			  },
			  "geometry" : {
				"paths" : [
				  [
					[
					  643283.08019999973,
					  5536918.2920999993
					],
					[
					  643391.9852,
					  5536920.4780999999
					],
					[
					  643718.86919999961,
					  5536927.7810999993
					],
					[
					  644078.74220000021,
					  5536933.2101000007
					],
					[
					  644126.55869999994,
					  5536941.9453999996
					]
				  ]
				]
			  }
			},
			{
			  "attributes" : {
				"OBJECTID" : 551,
				"StreetName" : "WAUGH RD",
				"DateInstalled" : null,
				"NumberOfLanes" : null,
				"Condition" : "2",
				"SHAPE_Length" : 279.43126539905592,
				"SurfaceType" : null,
				"MedianDivider" : null,
				"LabelPriority" : 2,
				"GovernmentBody" : "Municipal"
			  },
			  "geometry" : {
				"paths" : [
				  [
					[
					  646087.55099999998,
					  5538774.3529000003
					],
					[
					  646083.46740000043,
					  5538845.3398000002
					],
					[
					  646070.94319999963,
					  5539053.2899999991
					]
				  ]
				]
			  }
			},
			{
			  "attributes" : {
				"OBJECTID" : 557,
				"StreetName" : "NORRIS RD",
				"DateInstalled" : null,
				"NumberOfLanes" : null,
				"Condition" : "2",
				"SHAPE_Length" : 1410.9819282416149,
				"SurfaceType" : null,
				"MedianDivider" : null,
				"LabelPriority" : 2,
				"GovernmentBody" : "Municipal"
			  },
			  "geometry" : {
				"paths" : [
				  [
					[
					  641208.90639999975,
					  5534462.3713000007
					],
					[
					  641258.35240000021,
					  5534575.6262999997
					],
					[
					  641326.78639999963,
					  5534643.0653000008
					],
					[
					  641463.34640000015,
					  5534699.5053000003
					],
					[
					  641581.11239999998,
					  5534725.4173000008
					],
					[
					  641683.41640000045,
					  5534714.2093000002
					],
					[
					  641816.29839999974,
					  5534654.3072999995
					],
					[
					  641964.28440000024,
					  5534560.8752999995
					],
					[
					  642050.09539999999,
					  5534497.6193000004
					],
					[
					  642123.79640000034,
					  5534420.0252999999
					],
					[
					  642134.65739999991,
					  5534416.5313000008
					],
					[
					  642145.01040000003,
					  5534418.6963
					],
					[
					  642190.97339999955,
					  5534474.9823000003
					],
					[
					  642204.80939999968,
					  5534481.1333000008
					],
					[
					  642227.37440000009,
					  5534480.2852999996
					],
					[
					  642268.15039999969,
					  5534466.7923000008
					],
					[
					  642319.68740000017,
					  5534437.3422999997
					],
					[
					  642349.1484000003,
					  5534395.7363000009
					]
				  ]
				]
			  }
			}
		  ]
		}),
		
		polygons: new esri.tasks.FeatureSet({
		  "displayFieldName" : "SURVEY",
		  "fieldAliases" : {
			"OBJECTID" : "OBJECTID",
			"ROLL" : "ROLL",
			"SURVEY" : "SURVEY",
			"DWLLNG" : "DWLLNG",
			"ADDRESS" : "ADDRESS",
			"AREA" : "AREA",
			"Notes" : "Notes",
			"Utilities" : "Utilities",
			"CNTCPRSN" : "Primary Contact",
			"ADDRESS1" : "Mailing Address",
			"ADDRESS2" : "Mailing Address 2",
			"CITY" : "Mailing City",
			"STATE" : "Mailing Prov",
			"ZIP" : "Mailing Postal",
			"CNTCPRSN_1" : "Secondary Contact",
			"Shape_Length" : "Shape_Length",
			"Shape_Area" : "Shape_Area"
		  },
		  "geometryType" : "esriGeometryPolygon",
		  "spatialReference" : {
			"wkid" : 26914
		  },
		  "fields" : [
			{
			  "name" : "OBJECTID",
			  "type" : "esriFieldTypeOID",
			  "alias" : "OBJECTID"
			},
			{
			  "name" : "ROLL",
			  "type" : "esriFieldTypeDouble",
			  "alias" : "ROLL"
			},
			{
			  "name" : "SURVEY",
			  "type" : "esriFieldTypeString",
			  "alias" : "SURVEY",
			  "length" : 30
			},
			{
			  "name" : "DWLLNG",
			  "type" : "esriFieldTypeInteger",
			  "alias" : "DWLLNG"
			},
			{
			  "name" : "ADDRESS",
			  "type" : "esriFieldTypeString",
			  "alias" : "ADDRESS",
			  "length" : 30
			},
			{
			  "name" : "AREA",
			  "type" : "esriFieldTypeDouble",
			  "alias" : "AREA"
			},
			{
			  "name" : "Notes",
			  "type" : "esriFieldTypeString",
			  "alias" : "Notes",
			  "length" : 250
			},
			{
			  "name" : "Utilities",
			  "type" : "esriFieldTypeString",
			  "alias" : "Utilities",
			  "length" : 2
			},
			{
			  "name" : "CNTCPRSN",
			  "type" : "esriFieldTypeString",
			  "alias" : "Primary Contact",
			  "length" : 61
			},
			{
			  "name" : "ADDRESS1",
			  "type" : "esriFieldTypeString",
			  "alias" : "Mailing Address",
			  "length" : 61
			},
			{
			  "name" : "ADDRESS2",
			  "type" : "esriFieldTypeString",
			  "alias" : "Mailing Address 2",
			  "length" : 61
			},
			{
			  "name" : "CITY",
			  "type" : "esriFieldTypeString",
			  "alias" : "Mailing City",
			  "length" : 35
			},
			{
			  "name" : "STATE",
			  "type" : "esriFieldTypeString",
			  "alias" : "Mailing Prov",
			  "length" : 29
			},
			{
			  "name" : "ZIP",
			  "type" : "esriFieldTypeString",
			  "alias" : "Mailing Postal",
			  "length" : 11
			},
			{
			  "name" : "CNTCPRSN_1",
			  "type" : "esriFieldTypeString",
			  "alias" : "Secondary Contact",
			  "length" : 61
			},
			{
			  "name" : "Shape_Length",
			  "type" : "esriFieldTypeDouble",
			  "alias" : "Shape_Length"
			},
			{
			  "name" : "Shape_Area",
			  "type" : "esriFieldTypeDouble",
			  "alias" : "Shape_Area"
			}
		  ],
		  "features" : [
			{
			  "attributes" : {
				"OBJECTID" : 1,
				"ROLL" : 41008,
				"SURVEY" : "1-3-44248",
				"DWLLNG" : 0,
				"ADDRESS" : "760 BOWEN AVE",
				"AREA" : 16199.99206,
				"Notes" : " ",
				"Utilities" : "NA",
				"CNTCPRSN" : "SMITH BARTON ALEXANDER",
				"ADDRESS1" : "840 BOWEN AVENUE",
				"ADDRESS2" : " ",
				"CITY" : "EAST ST PAUL",
				"STATE" : "MB",
				"ZIP" : "R2E 1B4",
				"CNTCPRSN_1" : "SMITH JOY ANN",
				"Shape_Length" : 626.08567506752081,
				"Shape_Area" : 16199.997267206953
			  },
			  "geometry" : {
				"rings" : [
				  [
					[
					  643312.36070000008,
					  5541433.4964000005
					],
					[
					  643105.02240000013,
					  5541568.8717999998
					],
					[
					  643140.80590000004,
					  5541623.6754000001
					],
					[
					  643348.11290000007,
					  5541488.2520000003
					],
					[
					  643312.36070000008,
					  5541433.4964000005
					]
				  ]
				]
			  }
			},
			{
			  "attributes" : {
				"OBJECTID" : 2,
				"ROLL" : 41002,
				"SURVEY" : "2-1-44248",
				"DWLLNG" : 0,
				"ADDRESS" : "560 BOWEN AVE",
				"AREA" : 16721.205695000001,
				"Notes" : " ",
				"Utilities" : "NA",
				"CNTCPRSN" : "BUKSAK STANLEY FRANK",
				"ADDRESS1" : "4144 HENDERSON HWY",
				"ADDRESS2" : " ",
				"CITY" : "EAST ST PAUL",
				"STATE" : "MB",
				"ZIP" : "R2E 1B4",
				"CNTCPRSN_1" : "BUKSAK MARIANNE",
				"Shape_Length" : 641.10099485877743,
				"Shape_Area" : 16721.213922157753
			  },
			  "geometry" : {
				"rings" : [
				  [
					[
					  642333.02329999954,
					  5542151.3650000002
					],
					[
					  642549.19489999954,
					  5542010.1493999995
					],
					[
					  642507.48080000002,
					  5541959.0231999997
					],
					[
					  642297.11820000038,
					  5542096.3736000005
					],
					[
					  642333.02329999954,
					  5542151.3650000002
					]
				  ]
				]
			  }
			},
			{
			  "attributes" : {
				"OBJECTID" : 3,
				"ROLL" : 41004,
				"SURVEY" : "1-2-44248",
				"DWLLNG" : 0,
				"ADDRESS" : "600 BOWEN AVE",
				"AREA" : 15048.8897015,
				"Notes" : " ",
				"Utilities" : "NA",
				"CNTCPRSN" : "ADDISON ROBERT WILLIAM",
				"ADDRESS1" : "600 BOWEN AVENUE",
				"ADDRESS2" : " ",
				"CITY" : "EAST ST PAUL",
				"STATE" : "MB",
				"ZIP" : "R2E 1C7",
				"CNTCPRSN_1" : "ADDISON KELLY DAWN",
				"Shape_Length" : 684.77530678614107,
				"Shape_Area" : 15048.896695144584
			  },
			  "geometry" : {
				"rings" : [
				  [
					[
					  642877.47140000015,
					  5541717.4447000008
					],
					[
					  642746.30069999956,
					  5541803.0911999997
					],
					[
					  642729.86899999995,
					  5541828.7239999995
					],
					[
					  642659.93709999975,
					  5541937.8059999999
					],
					[
					  642913.25800000038,
					  5541772.3236999996
					],
					[
					  642877.47140000015,
					  5541717.4447000008
					]
				  ]
				]
			  }
			},
			{
			  "attributes" : {
				"OBJECTID" : 4,
				"ROLL" : 41010,
				"SURVEY" : "2-3-44248",
				"DWLLNG" : 1,
				"ADDRESS" : "840 BOWEN AVE",
				"AREA" : 16185.806369800001,
				"Notes" : " ",
				"Utilities" : "NA",
				"CNTCPRSN" : "SMITH BARTON ALEXANDER",
				"ADDRESS1" : "840 BOWEN AVENUE",
				"ADDRESS2" : " ",
				"CITY" : "EAST ST PAUL",
				"STATE" : "MB",
				"ZIP" : "R2E 1B4",
				"CNTCPRSN_1" : "SMITH JOY ANN",
				"Shape_Length" : 625.97092972747998,
				"Shape_Area" : 16185.812732503571
			  },
			  "geometry" : {
				"rings" : [
				  [
					[
					  643519.69900000002,
					  5541298.1209999993
					],
					[
					  643312.36070000008,
					  5541433.4964000005
					],
					[
					  643348.11290000007,
					  5541488.2520000003
					],
					[
					  643555.41980000027,
					  5541352.8286000006
					],
					[
					  643555.33650000021,
					  5541352.7009999994
					],
					[
					  643536.92129999958,
					  5541324.4969999995
					],
					[
					  643526.51620000042,
					  5541308.5610000007
					],
					[
					  643519.69900000002,
					  5541298.1209999993
					]
				  ]
				]
			  }
			},
			{
			  "attributes" : {
				"OBJECTID" : 5,
				"ROLL" : 500,
				"SURVEY" : "*RL95PA-12761",
				"DWLLNG" : 1,
				"ADDRESS" : "3161 HENDERSON HWY",
				"AREA" : -7714.6007695199996,
				"Notes" : " ",
				"Utilities" : "NA",
				"CNTCPRSN" : "GOODWIN ROSEMARY E.",
				"ADDRESS1" : "3161 HENDERSON HWY",
				"ADDRESS2" : " ",
				"CITY" : "EAST T PAUL",
				"STATE" : "MB",
				"ZIP" : "R2E 0J3",
				"CNTCPRSN_1" : "GOODWIN RAYMOND W.",
				"Shape_Length" : 428.59252487111246,
				"Shape_Area" : 7714.602061379167
			  },
			  "geometry" : {
				"rings" : [
				  [
					[
					  640350.49469999969,
					  5539298.2703000009
					],
					[
					  640375.23460000008,
					  5539336.8849999998
					],
					[
					  640453.67219999991,
					  5539286.5702999998
					],
					[
					  640491.05470000021,
					  5539262.5861000009
					],
					[
					  640514.10859999992,
					  5539247.8006999996
					],
					[
					  640494.77649999969,
					  5539205.7072999999
					],
					[
					  640350.49469999969,
					  5539298.2703000009
					]
				  ]
				]
			  }
			},
			{
			  "attributes" : {
				"OBJECTID" : 6,
				"ROLL" : 800,
				"SURVEY" : "*RL95PA-12761",
				"DWLLNG" : 2,
				"ADDRESS" : "220 HODDINOTT RD",
				"AREA" : -1040.15674999,
				"Notes" : " ",
				"Utilities" : "S",
				"CNTCPRSN" : "LOEWEN MICHAEL LYNN",
				"ADDRESS1" : "220 HODDINOTT ROAD",
				"ADDRESS2" : " ",
				"CITY" : "EAST ST PAUL",
				"STATE" : "MB",
				"ZIP" : "R2E 0H8",
				"CNTCPRSN_1" : "LOEWEN CHRISTINE",
				"Shape_Length" : 134.54188215895101,
				"Shape_Area" : 1040.1548340021452
			  },
			  "geometry" : {
				"rings" : [
				  [
					[
					  640514.10859999992,
					  5539247.8006999996
					],
					[
					  640491.05470000021,
					  5539262.5861000009
					],
					[
					  640514.10950000025,
					  5539298.5232999995
					],
					[
					  640532.06859999988,
					  5539287.0040000007
					],
					[
					  640514.10859999992,
					  5539247.8006999996
					]
				  ]
				]
			  }
			}
		  ]
		})
		
	};
}();