const gpio = require('pigpio').Gpio;
const LIGHT = 21;
const LED = 20;
const light = new gpio(LIGHT, {mode:gpio.INPUT});
const led = new gpio(LED, {mode:gpio.OUTPUT});

const CheckLight = function(){
	led.digitalWrite(0);
	let data=light.digitalRead();
	if(!data){
		console.log("LED off");
		led.digitalWrite(0);
	}
	else{
		console.log("LEDon");
		led.digitalWrite(1);
	}
}
process.on('SIGINT',function(){
	led.digitalWrite(0);
	console.log("program exit");
	process.exit();
});

setInterval(CheckLight,500);
