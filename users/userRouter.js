const express = require('express');

const Users = require('./userDb');
const Posts = require('../posts/postDb');

const router = express.Router();



router.post('/', validateUser, (req, res) => {
  Users.insert(req.body)
  .then(user => {
    res.status(201).json(user);
  })
  .catch(err => {
    res.status(500).json({message: 'Error Posting', error: err});
  });
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  const postData = { ...req.body, user_id: req.params.id };

  Posts.insert(postData)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => 
      res.status(500).json({ message: 'Something went wrong', error: err})
      );
});

router.get('/', (req, res) => {
  Users.get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => 
      res.status(500).json({message: 'Something went wrong getting the users', error: err})
      )
});

router.get('/:id', (req, res) => {
  Users.getById(req.params.id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({message: 'No user with that id'});
      }
    })
    .catch( err => 
      res.status(500).json({message: 'Something went wrong getting user', err})
      );
});

router.get('/:id/posts', validateUserId, (req, res) => {
  Users.getUserPosts(req.params.id)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch( err =>
      res.status(500).json({message: 'Something went wrong getting the user\s post', error: err})
      )
});

router.delete('/:id', validateUserId, (req, res) => {
  Users.remove(req.params.id)
    .then( () => {
      res.status(200).json({message: 'User deleted'});
    })
    .catch( err =>
      res.status(500).json({message: 'Something went wrong deleting the user', error: err})
    );
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  Users.update(req.params.id, req.body)
    then( () =>{
      res.status(200).json({message: 'Updated User'});
    })
    .catch( err => 
      res.status(500).json({message: 'Something went wrong updating the user', error: err})
      );
});

//custom middleware

function validateUserId(req, res, next) {
  Users.getById(req.params.id)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(400).json({ message: 'Invalid user id' })
      }
    })
    .catch( err => 
      res.status(500).json({ message: 'Something went wrong', error: err})
      )
}

function validateUser(req, res, next) {
  if ( !req.body || Object.keys(req.body).length === 0){
    res.status(400).json({message: 'Missing user data'});
  } else if (!req.body.name) {
    res.status(400).json({message: 'Missing required name field'})
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).json({ message: 'missing post data' });
  } else if (!req.body.text) {
    res.status(400).json({ message: 'missing required text field' });
  } else {
    next();
  }
}

module.exports = router;
