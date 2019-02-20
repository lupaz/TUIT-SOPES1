var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/nel', function(req, res, next) {
  res.render('index', { title: 'Express',message: " Hola Putos " });
});

module.exports = router;
