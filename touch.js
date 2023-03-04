const gpio = require('pigpio').Gpio;
const TOUCH = 13;
const BUZZER = 21;
const touch = new gpio(TOUCH, {mode:gpio.ALT0});
const buzzer = new gpio(BUZZER, {mode:gpio.OUTPUT});

const TurnOffBuzzer = () =>{
	buzzer.digitalWrite(0);
}

const CheckLight = () = >{
	buzzer.digitalWrite(0);
	let data = touch.digitalRead();
	console.log(data);
	if(data){
		console.log("touch!");
		buzzer.digitalWrite(1);
		setTimeout(TurnOffBuzzer,100);
	}	
}
process.on('SIGINT',function(){
	buzzer,digitalWrite();
	console.log("exit");
	process.exit();
});
setInterval(CheckLight,300);:
