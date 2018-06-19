
function OTRDetailsCTRL($scope, $http, $routeParams, OTRAudioData, OTRFileServices) {
	 	$scope.fileId = $routeParams.detailsId;
	 	
	 	 $scope.$watch('otrItemRequest', function (newValue, oldValue, scope) {
	 		$scope.otrItem = $scope.otrItemRequest.payload;
	 		if (($scope.otrItem.audioSamplingRate > 0) == true) {
	    		document.getElementById("otrPlayerDiv").innerHTML = "<audio id='otrPlayer' controls src='/otr-file-services/FileServer?id=" + $scope.fileId + "'> Your browser does not support the <code>audio</code> element.  </audio>";
	    	} else {
	    		document.getElementById("otrPlayerDiv").innerHTML = "<a href='/otr-file-services/FileServer?id=" + $scope.fileId + "'><button>Download!</button></a>";
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