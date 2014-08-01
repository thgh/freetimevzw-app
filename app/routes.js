var Person = require('./models/person');
var Task = require('./models/task');

module.exports = function(app) {

  // api/people ---------------------------------------------------------------------
  // get all people
  app.get('/api/people', function(req, res) {

    // use mongoose to get all people in the database
    Person.find(function(err, people) {

      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
      if (err)
        res.send(err)

      res.json(people); // return all people in JSON format
    });
  });

  // create person and send back all people after creation
  app.post('/api/people', function(req, res) {

    // create a person, information comes from AJAX request from Angular
    Person.create(req.body, function(err, person) {
      if (err)
        res.send(err);

      // get and return all the people after you create another
      Person.find(function(err, people) {
        if (err)
          res.send(err)
        res.json(people);
      });
    });

  });

  // update person
  app.post('/api/people/:person_id', function(req, res) {

    var data = req.body;
    delete data._id;

    Person.update({
      _id: req.params.person_id
    }, data, function(err, person) {
      if (err)
        res.send(err);

      Person.find(function(err, people) {
        if (err)
          res.send(err)
        res.json(people);
      });
    });

  });

  // delete a person
  app.delete('/api/people/:person_id', function(req, res) {
    Person.remove({
      _id: req.params.person_id
    }, function(err, person) {
      if (err)
        res.send(err);

      // get and return all the people after you create another
      Person.find(function(err, people) {
        if (err)
          res.send(err)
        res.json(people);
      });
    });
  });


  // api/tasks ---------------------------------------------------------------------
  // get all tasks
  app.get('/api/tasks', function(req, res) {

    // use mongoose to get all tasks in the database
    Task.find(function(err, tasks) {

      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
      if (err)
        res.send(err)

      res.json(tasks); // return all tasks in JSON format
    });
  });

  // create task and send back all tasks after creation
  app.post('/api/tasks', function(req, res) {

    // create a task, information comes from AJAX request from Angular
    Task.create(req.body, function(err, task) {
      if (err)
        res.send(err);

      // get and return all the tasks after you create another
      Task.find(function(err, tasks) {
        if (err)
          res.send(err)
        res.json(tasks);
      });
    });

  });

  // update task
  app.post('/api/tasks/:task_id', function(req, res) {

    var data = req.body;
    delete data._id;

    Task.update({
      _id: req.params.task_id
    }, data, function(err, task) {
      if (err)
        res.send(err);

      Task.find(function(err, tasks) {
        if (err)
          res.send(err)
        res.json(tasks);
      });
    });

  });

  // delete a task
  app.delete('/api/tasks/:task_id', function(req, res) {
    Task.remove({
      _id: req.params.task_id
    }, function(err, task) {
      if (err)
        res.send(err);

      // get and return all the tasks after you create another
      Task.find(function(err, tasks) {
        if (err)
          res.send(err)
        res.json(tasks);
      });
    });
  });


  // application -------------------------------------------------------------
  app.get('*', function(req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
  });
};
