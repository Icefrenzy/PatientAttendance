// Author: Jan Kevin Munar
// ID: 300702645
// Course: COMP308-062

var app = angular.module('patientAttendance', []);

// Date and time Stamp functionality
var ctime = new Date();

// Local controller for the web app
app.controller("patientController", function ($scope, patientService) {
    $scope.editing = false;
    $scope.currentPage = 0;
    $scope.validfirstname = false;
    $scope.validlastname = false;
    $scope.validage = false;
    $scope.patientArray = []; // Declare patient array
    $scope.filterPatients = []; // Declare filtered patient array
    $scope.totalPages = function () {
        return Math.ceil($scope.patientArray.length / 10);
    }
    
    $scope.editPatient = function (cPatient){
        $scope.firstname = cPatient.first_name;
        $scope.lastname = cPatient.last_name;
        $scope.age = cPatient.age;
        $scope.editing = true;
        $scope.selectedid = cPatient._id;
        $scope.selectedidcreated = cPatient.created;
    }
    
    $scope.canceleditPatient = function () {
        $scope.firstname = '';
        $scope.lastname = '';
        $scope.age = '';
        $scope.editing = false;
        $scope.selectedid = '';
        $scope.selectedidcreated = '';
    }
    

    $scope.overridePatient = function (cPatient, firstname,lastname,newage){
        var today = getDate();

        var data = {
            _id: $scope.selectedid,
            first_name: firstname,
            last_name: lastname,
            age: newage,
            created: $scope.selectedidcreated,
            modified: today.toString()
        }

        patientService.updatePatient(data);
        init();
        $scope.canceleditPatient();
    }

    $scope.deletePatient = function (cPatient) {
        console.log("Deleting Patient: " + cPatient._id);
        var data = {
            _id: cPatient._id,
            first_name: cPatient.first_name,
            last_name: cPatient.last_name,
            age: cPatient.age,
            created: cPatient.created,
            modified: cPatient.modified
        }

        patientService.deletePatient(data);
        init();
    }
    
    $scope.savePatient = function (firstname, lastname, newage){
        
        var today = getDate();
        var data = {
            first_name: firstname,
            last_name: lastname,
            age: newage,
            created: today.toString(),
            modified: today.toString()
        }

        if (firstname != null && firstname != '' &&
            lastname != null && lastname != '' &&
            newage != null && newage != '') {
            var data = {
                first_name: firstname,
                last_name: lastname,
                age: newage,
                created: today.toString(),
                modified: today.toString()
            };
            
            console.log(data);
            patientService.postPatient(data);
        } else {
            console.log("Unable to update due to null data fields!");
        }
    }

    // Search Button Main Meat
    $scope.searchPatient = function (firstname, lastname, age) {
        function checkInputBoxes(){
            if (firstname == null || firstname == '') {
                $scope.validfirstname = false;
                firstname = '';
            } else {
                $scope.validfirstname = true;
            }

            if (lastname == null || lastname == '') {
                lastname = '';
                $scope.validlastname = false;
            } else {
                $scope.validlastname = true;
            }

            if (age == null || age == '') {
                age = '';
                $scope.validage = false;
            } else {
                $scope.validage = true;
            }
        }

        // Get the patient using the service
        patientService.pullPatient().success(function (data) {
            $scope.patientArray = data; // Assign data to an array
            // Check what function will the search do
            checkInputBoxes();
            // Skim through the array and filter it
            if (!$scope.validfirstname && !$scope.validlastname && !$scope.validage) {
                console.log(data);
            } else {
                for (var x = 0; x < $scope.patientArray.length; x++) {
                    // Lower case all characters and compare the search to array data
                    if ($scope.validfirstname || $scope.validlastname || $scope.validage) {
                        if (($scope.patientArray[x].first_name).toLowerCase() == firstname.toLowerCase() ||
                        ($scope.patientArray[x].last_name).toLowerCase() == lastname.toLowerCase() ||
                        ($scope.patientArray[x].age).toLowerCase() == age.toLowerCase()) {
                            $scope.filterPatients.push($scope.patientArray[x]); // Add filtered data to filtered list
                        }
                    }
                }
                $scope.patientArray = $scope.filterPatients; // Use the new filtered list as the default list
                $scope.filterPatients = []; // Wipe out the filtered list for future use.
            }
        });
    }
    
    var getDate = function () {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd
        }
        
        if (mm < 10) {
            mm = '0' + mm
        }
        today = mm + '/' + dd + '/' + yyyy;
        return today;
    }

    var init = function () {
        patientService.pullPatient().success(function (data) {
            $scope.patientArray = data;
            console.log("Current Page:" + $scope.currentPage + " Total Pages:" + $scope.totalPages());
        });
    };
    init();
    
});

app.filter('startFrom', function () {
    return function (input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});



// Main Service
app.service("patientService", ['$http', function ($http) {
    
        // Pull service used to communicate a Get transaction with the server
        this.pullPatient = function () {
                return $http.get('/getPatient'
                );
        };
        
        // Post service used to communicate a Update transaction with the server
        this.updatePatient = function (data) {
            return $http({
                method: "POST",
                url: "/updatePatient",
                data: data,
                header: { "Content-type": "application/json" },
                cache: true
            });
        };
        
        // Post service used to communicate a Add transaction with the server
        this.postPatient = function (data) {
            return $http({
                method: "POST",
                url: "/savePatient",
                data: data,
                header: { "Content-type": "application/json" },
                cache:true
            });
        };

        // Post service used to communicate a Delete transaction with the server
        this.deletePatient = function (data) {
            return $http({
                method: "POST",
                url: "/deletePatient",
                data: data,
                header: { "Content-type": "application/json" },
                cache: true
            });
        };
}]);