const events = require('events');
const event = new events.EventEmitter();

//assigned event
event.on('doEvent',(param1) => {
    console.log("First Event Created")
    console.log(param1)
})

//make event
event.emit('doEvent');
event.emit('doEvent',"Tutorials Website Node.js");
