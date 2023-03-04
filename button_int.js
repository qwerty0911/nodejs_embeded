const gpio=require('pigpio').Gpio;


const button = new gpio(16,{mode:gpio.INPUT});
const rled = new gpio(20, {mode:gpio.OUTPUT});
const bled = new gpio(21, {mode:gpio.OUTPUT});
var count = 0;


button.glitchFilter(10000);


const CheckButton = () =>{
	let data;
	data = button.digitalRead();
	if(!data){
		console.log('Pressed!'+count);
		if((count++ % 2) ==0){
			rled.digitalWrite(1);
			bled.digitalWrite(0);
		}
		else{
			rled.digitalWrite(0);
			bled.digitalWrite(1);
		}
	}
	setTimeout(CheckButton,200);
}
process.on('SIGINT',function(){
	rled.digitalWrite(0);
	bled.digitalWrite(0);
	console.log("프로그램이 종료됩니다.");
	process.exit();
});
setImmediate(CheckButton); 



