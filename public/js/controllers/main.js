angular.module('ftController', [])

.controller('mainController', ['$scope', 'People', 'Tasks',
  function($scope, People, Tasks) {
    $scope.peopleForm = {};
    $scope.editTaskForm = {};
    $scope.addTaskForm = {};
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
    var d = new Date().getDay();
    if (d === 0 || d === 6) d = 1;
    $scope.weekday = --d;

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

        // Add tasks
        angular.forEach($scope.tasks, function(v, t) {
          $scope.grid[g].morning.push({
            text: v.text,
            long: [],
            short: []
          });
          $scope.grid[g].afternoon.push({
            text: v.text2 || v.text,
            long: [],
            short: []
          });
        });

        // Shift array for each day like this: +1 -2 +3 -4 +5 ...
        for (var i = 0; i < (shiftInverse ? pool1.length - shifts : shifts); i++) {
          pool1.push(pool1.shift());
          pool2.push(pool2.shift());
        }
        shifts++;
        shifts %= numPeople;
        shiftInverse = !shiftInverse;

        // Add morning
        // Long shift
        var curTask = 0;
        angular.forEach((poolSwitch ? pool1 : pool2), function(person, p) {
          $scope.grid[g].morning[curTask].long.push(person);
          curTask = (curTask + 1) % numTasks;
        });
        // Short shift
        var curTask = 0;
        angular.forEach((poolSwitch ? pool2 : pool1), function(person, p) {
          $scope.grid[g].morning[curTask].short.push(person);
          curTask = (curTask + 1) % numTasks;
        });

        // Shift array for each day like this: +1 -2 +3 -4 +5 ...
        for (var i = 0; i < (shiftInverse ? pool1.length - shifts : shifts); i++) {
          pool1.push(pool1.shift());
          pool2.push(pool2.shift());
        }
        shifts++;
        shifts %= numPeople;
        shiftInverse = !shiftInverse;

        // Add afternoon
        // Long shift
        var curTask = 0;
        angular.forEach((poolSwitch ? pool1 : pool2), function(person, p) {
          $scope.grid[g].afternoon[curTask].long.push(person);
          curTask = (curTask + 1) % numTasks;
        });
        // Short shift
        var curTask = 0;
        angular.forEach((poolSwitch ? pool2 : pool1), function(person, p) {
          $scope.grid[g].afternoon[curTask].short.push(person);
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

    $scope.taskLong = function() {
      var count = 0;
      angular.forEach($scope.tasks, function(v, k) {
        count += v.long;
      });
      return count;
    };

    $scope.taskShort = function() {
      var count = 0;
      angular.forEach($scope.tasks, function(v, k) {
        count += v.short;
      });
      return count;
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
      if ($scope.addTaskForm.text) {
        Tasks.create($scope.addTaskForm)
          .success(function(data) {
            $scope.addTaskForm = {};
            $scope.tasks = data;
            $scope.fillGrid();
          });
      }
    };

    $scope.editTask = function(t, task) {
      $scope.editTaskForm = angular.copy(task);
      $scope.editTaskForm.show = true;
    };

    $scope.updateTask = function(task) {
      Tasks.update($scope.editTaskForm)
        .success(function(data) {
          $scope.editTaskForm = {};
          $scope.tasks = data;
          $scope.fillGrid();
        });
    };

    $scope.deleteTask = function() {
      angular.forEach($scope.tasks, function(v, k) {
        if (v._id === $scope.editTaskForm._id) {
          console.log('delete')
          console.log($scope.tasks[k]);
          $scope.tasks.splice(k, 1);
          $scope.fillGrid();
        }
      });
      Tasks.delete($scope.editTaskForm._id)
        .success(function(data) {
          $scope.editTaskForm = {};
          $scope.tasks = data;
          $scope.fillGrid();
        });
    };
  }
]);


function rint(exclmax) {
  return Math.floor(Math.random() * exclmax);
}
