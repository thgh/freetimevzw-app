angular.module('ftController', [])

.controller('mainController', ['$scope', 'People', 'Tasks',
  function($scope, People, Tasks) {
    $scope.peopleForm = {};
    $scope.tasksForm = {};
    $scope.grid = [{
      name: 'Maandag',
      morning: [{
        name: 'First',
        people: [{
          text: 'Iedereeen!'
        }]
      }]
    }, {
      name: 'Dinsdag'
    }, {
      name: 'Woensdag'
    }, {
      name: 'Donderdag'
    }, {
      name: 'Vrijdag'
    }];

    // Highlight current day
    var d = new Date();
    $scope.weekday = d.getDay()-1;

    $scope.fillGrid = function(id) {
      if (!$scope.people) return false;
      if ($scope.people.length < 4) return false;
      if (!$scope.tasks) return false;
      if ($scope.tasks.length < 2) return false;

      console.log($scope.people)
      console.log($scope.people.length)
      console.log($scope.tasks)
      console.log($scope.tasks.length)

      var numPeople = $scope.people.length;
      var numTasks = $scope.tasks.length;


      var i = numPeople,
        pool1 = [],
        pool2 = [];
      while (i) {
        i && pool1.push($scope.people[--i].text);
        i && pool2.push($scope.people[--i].text);
      }

      var shifts = 1,
        shiftInverse = false,
        poolSwitch = false;

      angular.forEach($scope.grid, function(v, g) {

        // Reset grid
        $scope.grid[g].morning = [];
        $scope.grid[g].afternoon = [];
        $scope.grid[g].morningPeople = poolSwitch ? pool1 : pool2;
        $scope.grid[g].afternoonPeople = poolSwitch ? pool2 : pool1;

        // Shift array for each day like this: +1 -2 +3 -4 +5 ...
        for (var i = 0; i < (shiftInverse ? pool1.length - shifts : shifts); i++) {
          pool1.push(pool1.shift());
          pool2.push(pool2.shift());
        }
        shifts++;
        shifts %= numPeople;
        shiftInverse = !shiftInverse;
        // Add tasks
        angular.forEach($scope.tasks, function(v, t) {
          $scope.grid[g].morning.push({
            name: v.text,
            people: []
          });
          $scope.grid[g].afternoon.push({
            name: v.text,
            people: []
          });
        });

        // Add morning people
        var curTask = 0;
        angular.forEach((poolSwitch ? pool1 : pool2), function(person, p) {
          $scope.grid[g].morning[curTask].people.push(person);
          curTask = (curTask + 1) % numTasks;
        });
        // Add afternoon people
        var curTask = 0;
        angular.forEach((poolSwitch ? pool2 : pool1), function(person, p) {
          $scope.grid[g].afternoon[curTask].people.push(person);
          curTask = (curTask + 1) % numTasks;
        });

        poolSwitch = !poolSwitch;
      });
      /*
      $scope.grid[0].morning.unshift({
        name: 'Opbouw',
        people: [{
          text: 'Iedereen'
        }]
      });
      $scope.grid[4].afternoon.unshift({
        name: 'Opkuis',
        people: [{
          text: 'Iedereen'
        }]
      });*/
    };



    People.get()
      .success(function(data) {
        $scope.people = data;
        $scope.fillGrid();
      });

    $scope.createPerson = function() {
      if ($scope.peopleForm.text != undefined) {
        People.create($scope.peopleForm)
          .success(function(data) {
            $scope.peopleForm = {};
            $scope.people = data;
            $scope.fillGrid();
          });
      }
    };

    $scope.deletePerson = function(id) {
      People.delete(id)
        .success(function(data) {
          $scope.people = data;
          $scope.fillGrid();
        });
    };


    Tasks.get()
      .success(function(data) {
        $scope.tasks = data;
        $scope.fillGrid();
      });

    $scope.createTask = function() {
      if ($scope.tasksForm.text != undefined) {
        Tasks.create($scope.tasksForm)
          .success(function(data) {
            $scope.tasksForm = {};
            $scope.tasks = data;
            $scope.fillGrid();
          });
      }
    };

    $scope.deleteTask = function(id) {
      Tasks.delete(id)
        .success(function(data) {
          $scope.tasks = data;
          $scope.fillGrid();
        });
    };
  }
]);


function rint(exclmax) {
  return Math.floor(Math.random() * exclmax);
}
