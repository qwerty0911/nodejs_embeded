const gpio = require('pigpio').Gpio;

const RELAY = 2;
const relay = new gpio(RELAY, { mode: gpio.OUTPUT });

const TurnOn = () => {
	relay.digitalWrite(1);
	console.log('on');
	setTimeout(TurnOff, 2000);
}
const TurnOff = () => {
	relay.digitalWrite(0);
	console.log('off');
	setTimeout(TurnOn, 2000);
}
setImmediate(TurnOn);
