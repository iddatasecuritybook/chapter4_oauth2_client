var express = require('express');
var router = express.Router();

var uuid = require('node-uuid');
var request = require('request');

var SEVER_URL = 'http://localhost:3000';
var REDIRECT_SERVER_URL = 'http://localhost:5000';

var CLIENT_ID = 'YOUR_CLIENT_ID';

/* GET home page. */
router.get('/', function(req, res) {
  var state = uuid.v4();
  req.session.state = state;

  var options = {
    url: SEVER_URL + '/authorize',
    redirect_uri: REDIRECT_SERVER_URL + '/callback',
    client_id: CLIENT_ID,
    state: state,
    response_type: 'code',
    user_id: 1
  };

  var authorizationURL = options.url +
    '?redirect_uri=' + options.redirect_uri +
    '&user_id=' + options.user_id +
    '&client_id=' + options.client_id +
    '&response_type=' + options.response_type +
    '&state=' + options.state;

  res.render('index', {
    authorizationURL: authorizationURL
  });
});

/* GET the redirect's callback */
router.get('/callback', function(req, res, next) {
  var state = req.query.state;
  var code = req.query.code;

  // Compare the state with the session's state
  if (state !== req.session.state) {
    next(new Error('State does not match'));
  }

  request.post({
    url: SEVER_URL + '/token',
    form: {
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_SERVER_URL + '/callback',
      client_id: CLIENT_ID
    }}, function(error, response, body) {
    if (error) {
      console.error('request failed', error);
    }

    var resp = JSON.parse(body);
    var accessToken = resp.access_token;

    // Use the Access Token for a protected resource request
    res.send('Access Token: ' + accessToken);
  });
});

module.exports = router;
