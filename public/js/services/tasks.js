angular.module('taskService', [])

// super simple service
// each function returns a promise object 
.factory('Tasks', ['$http',
  function($http) {
    return {
      get: function() {
        return $http.get('/api/tasks');
      },
      create: function(taskData) {
        return $http.post('/api/tasks', taskData);
      },
      update: function(taskData) {
        return $http.post('/api/tasks/' + taskData._id, taskData);
      },
      delete: function(id) {
        return $http.delete('/api/tasks/' + id);
      }
    }
  }
]);
