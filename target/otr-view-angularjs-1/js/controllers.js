/*
 * JBoss, Home of Professional Open Source
 * Copyright 2013, Red Hat, Inc. and/or its affiliates, and individual
 * contributors by the @authors tag. See the copyright.txt in the
 * distribution for a full listing of individual contributors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function setTitleData(title, sort, sortDir, isSorting, filter, size, wildcard) {
    var titleObject = new Object();
    titleObject.title = title;
    titleObject.sortField = sort;
    titleObject.sortDirectionASC = sortDir;
    titleObject.isSorting = isSorting;
    titleObject.filter = filter;
    titleObject.isFiltering = false;
    titleObject.isWildCard = wildcard;
    titleObject.size = size;
    return titleObject;
}

var audiofileResultsShown = 20;


function OTRSummaryCtrl($log, $scope, OTRAudioData, OTRAudioDataCount) {
	
    $scope.totalCount = 693850;  // Total number of items in all pages. initialize as a zero  
    $scope.pageIndex = 1;   // Current page number. First page is 1.-->  
    $scope.pageSizeSelected = audiofileResultsShown; 
    $scope.shown= audiofileResultsShown;
    $scope.otrdata = new Array();
    $scope.titles = new Array();
    $scope.addResults = true;
    
    
    
    // Titles control information on sorting and filtering the data
    $scope.setTitles = function() {
    	$scope.titles.push(setTitleData("Series", "seriesName", true, false, "",  10, false));
    	$scope.titles.push(setTitleData("Episode", "episodeName", true, false, "",  10, true));
    	$scope.titles.push(setTitleData("Broadcast Date", "broadcastDate", true, false, "",  10, true));
    	// set the default sort column
    	$scope.sortTitle = setTitleData("File Name", "filename", true, true, "", 10, true);   	
    	$scope.titles.push($scope.sortTitle);
    	$scope.titles.push(setTitleData("Type", "fileType", true, false, "",  5, false));
    	$scope.titles.push(setTitleData("Bit Rate", "bitrate", true, false, "",  5, false));
    	$scope.titles.push(setTitleData("Sampling Rate", "audioSamplingRate", true, false, "",  8, false));
    	$scope.titles.push(setTitleData("Channels", "audioChannels", true, false, "",  2, false));
    	$scope.titles.push(setTitleData("Duration", "preciseDuration", true, false, "",  10, false));
    	$scope.titles.push(setTitleData("File Length", "fileLength", true, false, "",  10, false));
       
    }
    
    // Set the sort and direction
    $scope.setSort = function(title) {    	
    	if (title.isSorting) {  		
    		title.sortDirectionASC = !title.sortDirectionASC;
    	} else {
    		for (i=0; i < $scope.titles.length; i++) {
    			if ($scope.titles[i] === title) {
    				$scope.titles[i].isSorting = true;
    			} else {
    				$scope.titles[i].isSorting = false;  	    		
    			}
    			$scope.titles[i].sortDirectionASC = true
    	    }
    	}
    	$scope.addResults = false;
    	$scope.sortTitle = title;
    	$scope.refresh();
    }
    
    $scope.setFilter = function(title) {
    	$scope.shown = audiofileResultsShown;
    	if (title.filter != "") {
    		$scope.addResults = false;
    		title.isFiltering = true;
    		$scope.refresh();
    	} else {
    		if (title.isFiltering) {
    			$scope.addResults = false;
    			title.isFiltering = false;
        		$scope.refresh();
    		}
    	}
    }
    
    $scope.showSortDirection = function(title) {
    	return title.sortDirectionASC;
    }
    
    // set the items selected
	$scope.setSelected = function() {
		for (i=0; i < $scope.otrdata.length; i++) {
			$scope.otrdata[i].selected = $scope.masterCheckBox.checked;
		}
	}

	// load more records
    $scope.loadMore = function() {
    	$scope.pageIndex++;
    	$scope.shown += $scope.pageSizeSelected;
    	$scope.refresh();
    }
    
    $scope.getNonDisplayedColumns = function() {
    	var columnNames = "id";
    	return columnNames;
    }
    
    $scope.getDisplayedColumns = function() {
    	var columnNames = "";
    	for (i=0; i < $scope.titles.length; i++) {
    		columnNames = columnNames + $scope.titles[i].sortField +";";
    	}
    	return columnNames;
    }
    
    $scope.getColumns = function(query) {
    	query["requestColumns"] = $scope.getDisplayedColumns() + $scope.getNonDisplayedColumns();
    }
    
    $scope.getFilter = function(query) {
    	for (i=0; i < $scope.titles.length; i++) {
    		if ($scope.titles[i].filter !== "") {
    			if ($scope.titles[i].isWildCard) {
    			  query[$scope.titles[i].sortField] = "%" + $scope.titles[i].filter;
    			} else {
    			  query[$scope.titles[i].sortField] = $scope.titles[i].filter;
    			}
    		}
    	}
    }
    
    // Set the query parameters
    $scope.queryParams = function() {
    	var query = new Object();
        query.page = $scope.pageIndex;
    	query.size = $scope.pageSizeSelected;
    	query.sort = $scope.sortTitle.sortField;
    	query.sortASC = $scope.sortTitle.sortDirectionASC;
    	$scope.getFilter(query);
    	$scope.getColumns(query);
    	return query;
    }
    
    // when the data is retrieved from the server - load it
    $scope.$watch('lastCount', function (newValue, oldValue, scope) {
    	console.log($scope.lastCount);
    	$scope.totalCount = $scope.lastCount[0].payload;
    }, true);
    
    $scope.getCount = function() {
    	$scope.lastCount = OTRAudioDataCount.query($scope.queryParams());
    }
    
    // Define a refresh function, that updates the data from the REST service
    $scope.refresh = function() {
    	$scope.otrdataold = OTRAudioData.query($scope.queryParams());
    };
    
    // when the data is retrieved from the server - load it
    $scope.$watch('otrdataold', function (newValue, oldValue, scope) {
    	$scope.processRefresh();
    }, true);

    $scope.processRefresh = function() {
    	
    	if ($scope.addResults) {
    		$scope.otrdata = $scope.otrdata.concat($scope.otrdataold[0].payload);
    		for (i=0; i < $scope.otrdata.length; i++) {
    			$scope.otrdata.selected = false;
    		}
    	} else {
    		$scope.otrdata = $scope.otrdataold[0].payload;
    	}
    	$scope.getCount();
    	$scope.addResults = true;
    }
    

    // initialize the page
    $scope.intialize = function() {
    	 $scope.setTitles();
    	 $scope.refresh();
    }
    
    $scope.intialize();
    
}


function OTRDetailsCTRL($scope, $http, $routeParams, OTRAudioData, OTRFileServices) {
	 	$scope.fileId = $routeParams.detailsId;
	 	
	 	 $scope.$watch('otrItemRequest', function (newValue, oldValue, scope) {
	 		$scope.otrItem = $scope.otrItemRequest.payload;
	 		if (($scope.otrItem.audioSamplingRate > 0) == true) {
	    		document.getElementById("otrPlayerDiv").innerHTML = "<audio id='otrPlayer' controls src='/otr-services-audio-data-1/FileServer?id=" + $scope.fileId + "'> Your browser does not support the <code>audio</code> element.  </audio>";
	    	} else {
	    		document.getElementById("otrPlayerDiv").innerHTML = "<a href='/otr-services-audio-data-1/FileServer?id=" + $scope.fileId + "'><button>Download!</button></a>";
	    	}
	     }, true);
	 	 
	    // Define a reset function, that clears the prototype newMember object, and
	    // consequently, the form
	    $scope.load = function() {
	    	$scope.otrItemRequest = OTRAudioData.get({method: 'get', id: $routeParams.detailsId });
	    };
	    
	    $scope.deleteItem = function() {
	    	var deletedObj = OTRAudioData.get({method: 'delete', id: $routeParams.detailsId });
	    	console.log(deletedObj);
	    	
	    };
	    
	    $scope.findFile = function() {
	    	var deletedObj = OTRFileServices.get({method: 'fileExists', id: $routeParams.detailsId });
	    	console.log(deletedObj);
	    	
	    };

	    // Define a register function, which adds the member using the REST service,
	    // and displays any error messages
	    $scope.update = function() {
	        $scope.successMessages = '';
	        $scope.errorMessages = '';
	        $scope.errors = {};

	        OTRAudioData.save($scope.otrItem, function(data) {

	            // mark success on the registration form
	            $scope.successMessages = [ 'Member Registered' ];

	           
	            // Clear the form
	            $scope.reset();
	        }, function(result) {
	            if ((result.status == 409) || (result.status == 400)) {
	                $scope.errors = result.data;
	            } else {
	                $scope.errorMessages = [ 'Unknown  server error' ];
	            }
	            $scope.$apply();
	        });

	    };
	    
	    
	    $scope.load();
}