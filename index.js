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
}

_.forEach(arguments, function(term) {
  search = `${search} ${term}`;
});

if (search) {
  console.log(`fetching gif for ${typeName} ${search}...`);
  fetch(`https://h.getdango.com/special/${type}/search?q=${search}`)
    .then(res => res.json())
    .then(body => {
      // lets choose a random selection out of the top 5
      var choices = body.results.slice(1, 5);
      var choice = _.sample(choices);
      // console.log(choices, choice);
      var url = `https://i.dgif.co/gifs/${type}${choice}/O/${type}${choice}.gif`;
      clipboard.copy(url);
      let template = `<link rel="stylesheet" href="gifs.css"><div><img src='${url}' class='centered'></div>`;
      fsp.writeFile('index.html', template)
        .then(function(){
          opn('index.html', { wait: false });
        });
      console.log("URL copied to clipboard 👍");
    });
}
