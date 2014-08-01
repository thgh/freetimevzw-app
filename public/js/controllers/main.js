angular.module('ftController', [])

.controller('mainController', ['$scope', 'People', 'Tasks',
  function($scope, People, Tasks) {

    // Forms
    $scope.peopleForm = {};
    $scope.editTaskForm = {};
    $scope.addTaskForm = {};

    // Chronological list of shifts
    $scope.shifts = [{
      name: 'maanlang',
      tasks: [{
        name: 'aOpvang',
        people: ['a', 'b']
      }, {
        name: 'wut',
        people: ['c', 'd']
      }, {
        name: 'taakje',
        people: ['c', 'd']
      }]
    }, {
      name: 'bbb kort',
      tasks: [{
        name: 'zOpvang',
        people: ['e', 'f']
      }]
    }, {
      name: 'ccckort',
      tasks: [{
        name: 'eOpvang',
        people: ['g', 'h']
      }]
    }, {
      name: 'dddlang',
      tasks: [{
        name: 'rOpvang',
        people: ['i', 'j']
      }]
    }, {
      name: 'eeelang',
      tasks: [{
        name: 'tOpvang',
        people: ['a', 'b']
      }]
    }, {
      name: 'fffkort',
      tasks: [{
        name: 'yOpvang',
        people: ['b', 'a']
      }]
    }, {
      name: 'kortje',
      tasks: [{
        name: 'Opvang',
        people: ['Geert', 'Joris']
      }]
    }, {
      name: 'hhhhlang',
      tasks: [{
        name: 'Opvang',
        people: ['Geert', 'Joris']
      }, {
        name: 'tasakje',
        people: ['ha']
      }, {
        name: 'taakje',
        people: ['c', 'd']
      }]
    }];
    $scope.numShifts = 20;

    // Grid is shifts but split in 5 days and 2 periods
    $scope.shiftDays = [];

    // Stats help algorithms
    $scope.stats = {};
    $scope.people = {};
    $scope.best = [];

    // Generate new list of shifts based on given people and tasks
    $scope.fillGrid = function(keepGoing) {
      if (!$scope.pool1) return;
      if (!$scope.tasks) return;

      $scope.shifts = [];
      for (var i = 0; i < 20; i++) {
        // People that work this shift, pattern: 1001 0110 1001 0110 ...
        var shiftPeople = shuffle(angular.copy(Math.floor(i / 4) % 2 === i % 2 ? $scope.pool1 : $scope.pool2));
        // Tasks are in each shift the same, but the number of people assigned is not
        var shiftTasks = angular.copy($scope.tasks);
        // Is this a long shift, pattern: 1001 1001 ...
        var isLong = Math.floor(i / 2) % 2 === i % 2;
        // Assign people to tasks
        angular.forEach(shiftTasks, function(task, t) {
          for (var j = 0; j < task[isLong ? 'long' : 'short']; j++) {
            if (!shiftTasks[t].people)
              shiftTasks[t].people = [];
            if (shiftPeople.length)
              shiftTasks[t].people.push(shiftPeople.pop())
          }
        });
        // If not assigned, assign to Vliegende
        if (shiftPeople.length)
          shiftTasks.push({
            text: 'Vliegende',
            people: shiftPeople
          })

        var newShift = {
          name: 'wut' + i,
          tasks: shiftTasks
        };

        // Add shift info
        for (var j = 0; j < 20; j++) {}
        $scope.shifts.push(newShift);
      }

      $scope.convertToGrid();
      $scope.calcStats();
    };

    $scope.guess = function(num) {
      for (var i = 0; i < num; i++) {
        $scope.fillGrid();
      };
      $scope.shifts = $scope.best;
      $scope.convertToGrid();
      $scope.calcStats();
    };

    $scope.shuffleMoment = function(m, type) {
      // Currently there is a        grid[dayId]['morning'|'afternoon']['long'|'short']
      // In the future this will be: moments[mId].tasks[tId]
      var long = [],
        short = [],
        day = Math.floor(m / 2),
        tod = (m % 2) ? 'morning' : 'afternoon', //time of day
        type = type || 'long';
      console.log('shuffle ' + day + ' ' + tod + ' ' + type)
      angular.forEach($scope.grid[day][tod], function(tasks, t) {
        angular.forEach(tasks.long, function(person, p) {
          long.push(person);
        });
        angular.forEach(tasks.short, function(person, p) {
          short.push(person);
        });
      });
      long = shuffle(long);
      short = shuffle(short);
      var newlong = []
      while (long.length) {

      }
      $scope.calcStats();
    };

    $scope.convertToGrid = function() {
      $scope.shiftDays = [];
      angular.forEach($scope.best, function(shift, s) {
        var day = Math.floor(s / 4);
        var period = Math.floor((s % 4) / 2);
        var duration = s % 2;

        if (!$scope.shiftDays[day])
          $scope.shiftDays[day] = [];

        if (!$scope.shiftDays[day][period]) {
          $scope.shiftDays[day][period] = {
            day: shift.name,
            tasks: []
          }
        }

        angular.forEach(shift.tasks, function(task, t) {
          if (!$scope.shiftDays[day][period].tasks)
            $scope.shiftDays[day][period].tasks = [];
          if (!$scope.shiftDays[day][period].tasks[t]) {
            $scope.shiftDays[day][period].tasks[t] = {
              text: task.text,
              duration: [
                [],
                []
              ]
            };
          }
          $scope.shiftDays[day][period].tasks[t].duration[duration] = task.people;
        })
      });
    };

    $scope.today = function(dayOfWeek) {
      // Is dayOfWeek today?
      var d = new Date().getDay();
      // Let weekend be monday
      if (d === 0 || d === 6) d = 1;
      return --d === dayOfWeek;
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
            $scope.peopleForm.text = '';
            $scope.people = data;
            $scope.fillGrid();
          });
      }
    };

    $scope.updatePerson = function(person) {
      console.log(person)
      if (person._id)
        People.update(person)
        .success(function(data) {
          $scope.people = data;
          $scope.fillGrid();
        });
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
      Tasks.delete($scope.editTaskForm._id)
        .success(function(data) {
          $scope.editTaskForm = {};
          $scope.tasks = data;
          $scope.fillGrid();
        });
      angular.forEach($scope.tasks, function(v, k) {
        if (v._id === $scope.editTaskForm._id) {
          console.log('delete')
          console.log($scope.tasks[k]);
          $scope.tasks.splice(k, 1);
          $scope.fillGrid();
        }
      });
    };

    $scope.$watch('people', function(newVal) {
      // Split people in 2 pools
      $scope.pool1 = [];
      $scope.pool2 = [];
      $scope.numPool1 = 0;
      $scope.numPool2 = 0;
      angular.forEach(newVal, function(v, k) {
        if (v.pool && v.pool === 1) {
          $scope.pool1.push(v.text);
          $scope.numPool1++;
        } else {
          $scope.pool2.push(v.text);
          $scope.numPool2++;
        }
      });
    }, true);

    $scope.$watch('tasks', function(newVal, oldVal) {
      $scope.taskLong = 0;
      $scope.taskShort = 0;

      angular.forEach(newVal, function(v, k) {
        $scope.taskLong += v.long;
        $scope.taskShort += v.short;
      });

      $scope.numTasks = $scope.taskLong + $scope.taskShort;
    }, true);

    $scope.recordStats = function(person, taskId, num) {
      if (!$scope.stats.people[person]) {
        $scope.stats.people[person] = {};
      }
      if (!$scope.stats.people[person][taskId]) {
        $scope.stats.people[person][taskId] = 0;
      }
      if (!$scope.stats.tasks[taskId]) {
        $scope.stats.tasks[taskId] = 0;
      }
      $scope.stats.people[person][taskId]++;
      $scope.stats.tasks[taskId]++;
    };
    $scope.min = 99999;
    $scope.calcStats = function(person, taskId, num) {


      $scope.stats.people = {};
      $scope.stats.tasks = {};
      $scope.stats.variance = {};
      $scope.stats.cost = 0;

      angular.forEach($scope.shifts, function(shift, s) {
        angular.forEach(shift.tasks, function(task, t) {
          angular.forEach(task.people, function(person, p) {
            $scope.recordStats(person, t)
          })
        })
      })

      // Calculate average of times people do each task
      $scope.stats.avg = angular.copy($scope.stats.tasks);
      angular.forEach($scope.stats.avg, function(v, k) {
        $scope.stats.avg[k] /= 10;
      });
      // Calculate variance
      angular.forEach($scope.stats.people, function(tasks, name) {
        angular.forEach(tasks, function(count, taskId) {
          if (!$scope.stats.variance[taskId]) {
            $scope.stats.variance[taskId] = 0;
          }
          $scope.stats.variance[taskId] += Math.pow($scope.stats.avg[taskId] - count, 2);
        });
      });
      // Calculate cost
      angular.forEach($scope.stats.variance, function(v, k) {
        $scope.stats.cost += v;
      });
      if ($scope.stats.cost < $scope.min) {
        $scope.min = $scope.stats.cost;
        $scope.best = angular.copy($scope.shifts);
        console.log($scope.min)
      }
    };

  }
]);


function rint(exclmax) {
  return Math.floor(Math.random() * exclmax);
}

function shuffle(o) { //v1.0
  for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
};
