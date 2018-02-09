require('./instanthello');

var goodbye = require('./talk/goodbye');
var talk = require('./talk');
var question = require('./talk/question');

goodbye();

talk.intro();
talk.hello("Adam");

var answer = question.ask("whats is the meaning of life?");
console.log(answer);


