var $ = require('jquery');
var Parse = require('parse');
Parse.initialize("ShiftsId");
Parse.serverURL = 'http://10.0.0.7:8888/parse';

export default function ($scope) {
    $scope.passwordConfirmation = ""
    $scope.registerData = {};
    $scope.passwrodStrengthDict = {0: {text: "", className: "progress-bar-danger", width: "0%" },
                                   1: {text: "Weak", className: "progress-bar-danger", width: "33%"},
                                   2: {text: "Medium", className: "progress-bar-warning", width: "66%"},
                                   3: {text: "Strong", className: "progress-bar-success", width: "100%"}};
    $scope.passwordStrength = 0;
    $scope.register = function() {
        if (validateRegisterFields()) {
            registerNewParseUser();
        } else {
            registerError();

        }
    };

    $scope.$watch('registerData.password', val => {
        $scope.passwordStrength = 0;

        if (val) {
            // password is more the 6 chars.
            if (val.length >= 6) {
                $scope.passwordStrength++
            }
            // password contains at least 1 number.
            if (val.match(/\d+/g) != null) {
                $scope.passwordStrength++
            }
            // password contains at least 1 alphabet character.
            if (val.match(/[a-zA-Z]/g) != null) {
                $scope.passwordStrength++
            }
        }

        var passwordStrengthProperties = $scope.passwrodStrengthDict[$scope.passwordStrength];
        var passwordProgressBarElement = $("#passwordProgressBar");
        // setting progressbar width accordingly to the passwordStrength
        $(passwordProgressBarElement).animate({
            width: passwordStrengthProperties["width"]
        }, 400);

        // setting progressbar text accordingly to the passwordStrength
        $("#passwordProgressBarText").text(passwordStrengthProperties["text"]);

        // setting progressbar color accordingly to passwordStrength with bootstrap classes
        var lastProgressBarColorClass = $(passwordProgressBarElement).attr('class').split(' ').pop();
        $(passwordProgressBarElement).removeClass(lastProgressBarColorClass);
        $(passwordProgressBarElement).addClass(passwordStrengthProperties["className"])

    });




    /**
     * validates the register input Fields
     * 1) checks the all the fields are not empty.
     * 2) checks that the password field value matches the passwordConfirm field value.
     * 3) checks that the password is "strong" enough.
     */
    function validateRegisterFields() {
        $scope.registerData["errorMessage"] = "\n";
        var isValid = true;
        /* 1 */
        var registerInputFieldsList = $("#Registration").find("input");
        isValid = highlightEmptyInputs(registerInputFieldsList, isValid);

        /* 2 */
        if ($scope.registerData.password != $scope.passwordConfirmation) {
            // if at least on of the password fields is not empty
            if ($scope.registerData.password || $scope.passwordConfirmation) {
                $scope.registerData["errorMessage"] += "* Passwords don't match!\n";
            }
            isValid = false;
            $("#registerPassword").parent().addClass("has-error");
            $("#registerPasswordConfirmation").parent().addClass("has-error");
            // set "registerInputFieldsList" function to start with a 1 second delay
            setTimeout(function () {
                removeRedColor([$("#registerPassword"),  $("#registerPasswordConfirmation")]);
            }, 1000);
            return isValid;
        }

        /* 3 */
        if ($scope.passwordStrength != 3) {
            isValid = false;
            // if register password is not empty
            if ($scope.registerData.password != "") {
                $scope.registerData["errorMessage"] += "* Password is not strong!\n";
            }
        }
        return isValid
    }

    function highlightEmptyInputs(InputFieldsList, isValid) {
        // iterates over all the inputs in the registrationModal
        var first = true;
        for (var index = 0; index < InputFieldsList.length; index++) {
            var fieldInputElement = InputFieldsList[index];
            // if the input's value is "", the registration is not valid and the input highlighted (red color)
            if ($(fieldInputElement).val() == "") {
                if (first) {
                    $scope.registerData["errorMessage"] += "* Please fill all the fields!\n";
                    first = false;
                }
                isValid = false;
                $(fieldInputElement).parent().addClass("has-error");
            }
        }
        // set "registerInputFieldsList" function to start with a 1 second delay
        setTimeout(function () {
            removeRedColor(InputFieldsList);
        }, 1000);
        return isValid;
    }

    /**
     * iterated over a given listOfInput and remove the highlight
     * (red color => "has-error" class from the inputs' parents if exists).
     *
     * @param listOfInput
     */
    function removeRedColor(listOfInput) {
        for (var index = 0; index < listOfInput.length; index++) {
            var fieldInputElement = listOfInput[index];
            var parentClass = $(fieldInputElement).parent().attr("class");
            if (parentClass.includes("has-error"))
                $(fieldInputElement).parent().removeClass("has-error");
        }
    }

    function registerNewParseUser() {
        var user = new Parse.User();
        user.set("username", $scope.registerData.username);
        user.set("password", $scope.registerData.password);
        user.set("email", $scope.registerData.email);
        user.set("fullName", $scope.registerData.name);

        user.signUp(null, {
            success: function(user) {
                console.log(user.getUsername());
                user.fetch().then(function(fetchedUser){
                    var name = fetchedUser.getUsername();
                    console.log(name)
                }, function(error){
                    alert("Error: " + error.code + " " + error.message)
                });
            },
            error: function(user, error) {
                // Show the error message somewhere and let the user try again.
                alert("Error: " + error.code + " " + error.message);
            }
        });
    }

    function registerError() {
        var errorMessage = $scope.registerData.errorMessage;
        var errorAlertTemplate = '<div class="alert alert-danger alert-dismissable fade in" id="registerErrorAlert" style="width:60%;">\
                                      <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>\
                                      <strong>Error!</strong> ' + errorMessage.replace("\n", "<br/>") + '</div>';
        $("#tabLayoutRow").before(errorAlertTemplate);
        $("#registerErrorAlert").fadeIn("slow");
        setTimeout(function () {
            $("#registerErrorAlert").fadeOut("slow");
            $("#registerErrorAlert").remove();
        }, 3000);



    }




}

