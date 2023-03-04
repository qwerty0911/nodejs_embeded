const gpio=require('pigpio').Gpio;


const button = new gpio(12,{mode:gpio.INPUT});
const buzzer = new gpio(26, {mode:gpio.OUTPUT});
const rled = new gpio(16,{mode:gpio.OUTPUT});
const gled = new gpio(20, {mode:gpio.OUTPUT});
const bled = new gpio(21, {mode:gpio.OUTPUT});
var count = 0;
var flag = 0;


button.glitchFilter(10000);


const ChangeLED = () =>{
	let data;
	data = button.digitalRead();
	if(!data){
		console.log('Pressed!'+count);
		buzzer.digitalWrite(1);
		flag=1;
		if((count % 3) ==0){
			rled.digitalWrite(0);
			gled.digitalWrite(1);
			bled.digitalWrite(0);
		}
		if((count % 3) ==1){
			rled.digitalWrite(0);
			gled.digitalWrite(0);
			bled.digitalWrite(1);
		}
		if((count % 3)==2){
			rled.digitalWrite(1);
			gled.digitalWrite(0);
			bled.digitalWrite(0);
		}
		count++;
	}
	setTimeout(ChangeLED,200);
	setTimeout(BuzzerControl,100);
}
const BuzzerControl = () =>{
	if(flag=1)
	{
		buzzer.digitalWrite(0);
		flag=0;
	}
}


process.on('SIGINT',function(){
	rled.digitalWrite(0);
	gled.digitalWrite(0);
	bled.digitalWrite(0);
	buzzer.digitalWrite(0);
	console.log("프로그램이 종료됩니다.");
	process.exit();
});

setImmediate(ChangeLED);
