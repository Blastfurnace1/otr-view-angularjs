
function OTRDetailsCTRL($scope, $http, $routeParams, OTRSystemData) {
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
	    	var deletedObj = OTRSystemData.discard({method: 'delete', id: $routeParams.detailsId });
	    	console.log(deletedObj);
	    	
	    };
	    
	    $scope.findFile = function() {
	    	var deletedObj = OTRSystemData.findFile({method: 'findFile', id: $routeParams.detailsId });
	    	console.log(deletedObj);
	    	
	    };

	    // Define a register function, which adds the member using the REST service,
	    // and displays any error messages
	    $scope.update = function() {
	        $scope.successMessages = '';
	        $scope.errorMessages = '';
	        $scope.errors = {};

	        OTRSystemData.save($scope.otrItem, function(data) {

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