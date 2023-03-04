const gpio = require('pigpio').Gpio;

const TRIG = 6;
const ECHO =13;
const GLED = 14;
const RLED = 15;
const RELAY = 2;
const BUTTON = 5;
const TOUCH = 0;

const touch = new gpio(TOUCH, {mode:gpio.ALT0});
const button = new gpio(BUTTON, {mode:gpio.INPUT,pullUpDown:gpio.PUD_UP, edge: gpio.FALLING_EDGE});
const relay = new gpio(RELAY,{mode:gpio.OUTPUT});
const rled = new gpio(RLED,{mode:gpio.OUTPUT});
const gled = new gpio(GLED,{mode:gpio.OUTPUT});
const trig = new gpio(TRIG,{mode:gpio.OUTPUT});
const echo = new gpio(ECHO, {mode:gpio.INPUT, alert:true});
var flag = 0;
var flag_relay=1;

trig.digitalWrite(0);
button.glitchFilter(10000);



const Triggering = () =>{
	let startTick, distance, diff;
	echo.on('alert',(level,tick) =>{
		if(level ==1){startTick=tick;}
		else{level==0
			const endTick=tick;
			diff = endTick-startTick;
			distance = diff/58;
			if(distance<400){
				console.log('distance:%i cm',distance);
				PWMLed(distance);
			}
		}
	});
};

const PWMLed = (dis) =>{
	if(dis<10) {
		if(flag_relay)relay.digitalWrite(1);
		if(dis<5) 
		{
			rled.pwmWrite(255);
			gled.pwmWrite(255);
		}
		else 
		{
			rled.pwmWrite(170);
			gled.pwmWrite(170);
		}
	}
	else{
		relay.digitalWrite(0);
		if(dis<20) {
			rled.pwmWrite(50);
			gled.pwmWrite(50);
		}
		else {
			rled.pwmWrite(0);
			gled.pwmWrite(0);
		}
	}
}

const checkTouch = () =>{
	let data = touch.digitalRead();
	if(data){
		if(flag){flag=0;
			console.log('SECURITY SYSTEM 중단');
			relay.digitalWrite(0);
			rled.digitalWrite(0);
			gled.digitalWrite(0);
		}
		else {flag=1; console.log('SECURITY SYSTEM 가동');}
	}
}

process.on('SIGINT', ()=>{
	rled.digitalWrite(0);
	gled.digitalWrite(0);
	relay.digitalWrite(0);
	process.exit();
});

const Handler = (level,tick) =>{
	if(level ==0){
		console.log('Button down');
		if(flag_relay){
			flag_relay=0; console.log('BUZZER Off'); 
			relay.digitalWrite(0);
		}
		else {flag_relay=1; console.log('BUZZER On');}
	}
}

Triggering();
button.on('interrupt',Handler);

console.log("근접센서로 밝기제어");
setInterval(checkTouch,300);
setInterval(() =>{if(flag==1)trig.trigger(10,1);}, 200);



