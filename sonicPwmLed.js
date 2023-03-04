const gpio = require('pigpio').Gpio;

const TRIG = 6;
const ECHO =13;
const LED = 26;

const led = new gpio(LED,{mode:gpio.OUTPUT});
const trig = new gpio(TRIG,{mode:gpio.OUTPUT});
const echo = new gpio(ECHO, {mode:gpio.INPUT, alert:true});

trig.digitalWrite(0);

const Triggering = () =>{
	console.log('triggering');
	let startTick, distance, diff;
	echo.on('alert',(level,tick) =>{
		if(level ==1){startTick=tick;}
		else{level==0
			const endTick=tick;
			diff = endTick-startTick;
			distance = diff/58;
			if(distance<400){
				console.log('distance:%i cd',distance);
				PWMLed(distance);
			}
		}
	});
};

const PWMLed = (dis) =>{
	if(dis<5) led.pwmWrite(255);
	else if(dis<10) led.pwmWrite(170);
	else if(dis<15) led.pwmWrite(100);
	else if(dis<20) led.pwmWrite(50);
	else if(dis<50) led.pwmWrite(5);
	else led.pwmWrite(0);
}

process.on('SIGINT', ()=>{
	led.digitalWrite(0);
	process.exit();
});

Triggering();
console.log("근접센서로 밝기제어");
setInterval(() =>{trig.trigger(10,1);}, 200);
