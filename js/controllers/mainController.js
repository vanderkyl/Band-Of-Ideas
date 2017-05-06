app.controller('mainController', ['$scope',
function($scope) {
  $scope.login = function(form) {

  };
  $scope.joinTheBand = function(form) {

  };
  $scope.openBandForm = function() {
    displayElementById("startBandForm");
    hideElementById("signInForm");
  };
}]);
function signIn() {
  hideElementById("signIn");
  displayElementById("signOut");
};
function signOut() {
  hideElementById("signOut");
  displayElementById("signIn");
};
function login(form) {
  var user = getItemFromLocalStorage(form.email.value);
  console.log(form.email.value);
  console.log(user);
  if (user && user.password === form.password) {
    getElementById("accountOutput").innerHTML = "You are now logged in " + user.firstName + "!";
    signIn();
  } else {
    getElementById("accountOutput").innerHTML = "Sorry, that didn't work.";
  }
};
function joinTheBand(form) {
  var newUser = {
    firstName: form.firstName.value,
    lastName: form.lastName.value,
    email: form.email.value,
    password: form.pswrd.value
  };
  saveItemToLocalStorage(newUser.email, newUser);
  getElementById("accountOutput").innerHTML = "Added new user: " + newUser.firstName + " " + newUser.lastName;
};
