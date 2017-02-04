#!/usr/bin/env node

var program = require('commander');
var fetch = require('node-fetch');
var _ = require('lodash');
var clipboard = require("copy-paste");
var opn = require("opn");
var fsp = require("fs-promise");

var arguments = process.argv.splice(2);
let search = '';
let type = 'pk'; // default is pokemon
let typeName = 'Pokemon'; // default is pokemon

// Check if the first argument is choosing the type
if (arguments[0] == 'poke') {
  type = 'pk';
  typeName = 'Pokemon';
  arguments.shift(); // get rid of the first one
} else if (arguments[0] == 'hp') {
  type = 'hp';
  typeName = 'Harry Potter';
  arguments.shift();   // get rid of the first one
} else if (arguments[0] == 'pup') {
  type = 'pp';
  typeName = 'Puppies';
  arguments.shift();
}

_.forEach(arguments, function(term) {
  search = `${search} ${term}`;
});

if (search) {
  console.log(`fetching gif for ${typeName} ${search}...`);
  fetch(`https://h.getdango.com/special/${type}/search?q=${search}`)
    .then(res => res.json())
    .then(body => {
      // lets get the top 5
      let choices = body.results.slice(0, 5);
      let images = '';
      _.each(choices, function(choice) {
        var url = `https://i.dgif.co/gifs/${type}${choice}/O/${type}${choice}.gif`;
        images = `${images} <div class='image'><img src='${url}'></div>`;
      });
      let template = `<title>GIF Search</title> <style>body, html {
        background-color: #e26b73;
      }

      h1 {
        font-family: 'Montserrat', sans-serif;
        font-size: 48px;
        font-weight: bold;
        margin-bottom: 40px;
        letter-spacing: 2px;
      }

      .centered {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        /* bring your own prefixes */
        height: 400px;
      }

      .image {
        padding: 20px 20px;
        margin: auto;  /* Magic! */
      }

      img {
        max-width: 300px;
        border-radius: 10px;
      }
</style><h1>GIF Choices for ${search}</h1><div class='centered'> ${images}</div>`;
      fsp.writeFile('/tmp/gifs.html', template)
        .then(function(){
          opn('/tmp/gifs.html', { wait: false });
        });
      console.log("URL copied to clipboard 👍");
    });
}
