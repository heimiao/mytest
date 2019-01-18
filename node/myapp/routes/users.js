var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('什么狗屁玩意');
});

module.exports = router;
