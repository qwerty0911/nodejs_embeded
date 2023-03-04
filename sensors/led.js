const gpio = require('pigpio').Gpio;
const LED = 26;
const led = new gpio(LED,{mode:gpio.OUTPUT});

const ledCtrl = {
	on:()=>{
		led.digitalWrite(1);
	},
	off:()=>{
		led.digitalWrite(0);
	}
};

module.exports.on = function(){ledCtrl.on();};
module.exports.off = function(){ledCtrl.off();};
