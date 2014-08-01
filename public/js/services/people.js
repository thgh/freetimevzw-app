angular.module('personService', [])

// super simple service
// each function returns a promise object 
.factory('People', ['$http',
  function($http) {
    return {
      get: function() {
        return $http.get('/api/people');
      },
      create: function(personData) {
        return $http.post('/api/people', personData);
      },
      update: function(personData) {
        return $http.post('/api/people/' + personData._id, personData);
      },
      delete: function(id) {
        return $http.delete('/api/people/' + id);
      }
    }
  }
]);
