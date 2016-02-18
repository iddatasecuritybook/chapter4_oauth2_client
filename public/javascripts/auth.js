var authorize = function (options) {
  var url = options.url;
  var scope = options.scope;
  var clientId  = options.clientId;

  jQuery.ajax({
    url: url,
    dataType: 'json',
    data: {
      client_id: clientId,
      scope: scope,
      grant_type: 'code'
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    success: function (response) {
      console.log(response);
    },
    error: function (response) {
      console.log(response);
    }
  });
};
