app.directive('myFilesDirective', function() {
	console.log("like directive");
  return function(scope, element, attrs) {

    if (scope.$last){
      checkIfFilesAreLiked(CURRENT_FILES);
			window.alert("success");
    }
  };
});
