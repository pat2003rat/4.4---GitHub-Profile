var $ = require('jquery');
var _ = require('underscore');
var Handlebars = require('handlebars');
var githubtoken = require('./gitapikey.js');
var moment = require('moment')


// Send auth token to github if token is provided //


if (githubtoken !== undefined){
    $.ajaxSetup({
        headers: {
            'Authorization': 'token ' + githubtoken.token
        }
    });
}


//ajax returns an object b/c .done //
//.done is a promise saying when your done //
$.ajax('https://api.github.com/users/pat2003rat').done(function(data){
  var source = $("#profile-template").html();
  var template = Handlebars.compile(source);
  console.log(data);
  $('.profile-container').append(template(data));




  // pulling in organizations url from profiles object
  $.ajax(data.organizations_url).done(function(data){
    var source = $("#organizations-template").html();
    var template = Handlebars.compile(source);

    console.log('orgs data', data);
    data.forEach(function(organization){
      $('.profile-container').append(template(organization));

    });
  });


$.ajax('https://api.github.com/users/pat2003rat/repos').done(function(data){
  var sortedDate = _.sortBy(data, "updated_at").reverse();
    var source = $("#repo-template").html();
    var template = Handlebars.compile(source);
    console.log(template);
      sortedDate.forEach(function(repository){
        console.log(repository);
    var formatDate = moment(repository.updated_at, "YYYYMMDD").fromNow();
    repository.formatDate = formatDate;
        $('.repo-list').append(template(repository));
        
    });
  });
});
