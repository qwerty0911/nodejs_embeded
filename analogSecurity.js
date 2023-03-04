const gpio = require('pigpio').Gpio;
const mcpadc = require('mcp-spi-adc');

const SPI_SPEED = 1000000;
const LIGHT = 0;
const SOUND = 1;
const TRIG =5;
const ECHO =6;
const LED = 26;

const led = new gpio(LED, {mode:gpio.OUTPUT});
const trig = new gpio(TRIG, {mode:gpio.OUTPUT});
const echo = new gpio(ECHO, {mode:gpio.INPUT, alert:true});


var timerid, timeout=200;
var lightdata = -1;
var sounddata = -1;
var flag=0;

const Light = mcpadc.openMcp3208(LIGHT,{speedHz:SPI_SPEED},
	(err) => {
		console.log("SPI 채널0 초기화 완료!");
		console.log("---------------------");
		if(err) console.log("채널0초기화 실패 hw점검");
});

const Sound = mcpadc.openMcp3208(SOUND, {speedHz:SPI_SPEED},
	(err) => {
		console.log("SPI 채널1채널 초기화 완료!");
		console.log("------------------------");
		if(err) console.log("채널 1초기화 실패 hw점검");
});
const analogSound = () =>{
	Sound.read((error, reading1) =>{
		console.log("현재 측정된 소리(%d)",reading1.rawValue);
		sounddata = reading1.rawValue;
	});
	if(sounddata!=-1){
		if(sounddata>800) console.log("소리 4단계 ");
		else if(sounddata>500) console.log("소리 3단계 ");
		else if(sounddata>300) console.log("소리 2단계 ");
		else console.log("소리 1단계 ");
		sounddata=-1;
	}
}

const analogLight = () =>{
	Light.read((error, reading) =>{
		console.log("현재 측정된 조도값(%d)", reading.rawValue);
		lightdata = reading.rawValue;
	});
	if(lightdata != -1){
		if(lightdata>2500) //4단계
		{
			flag=1;
			setImmediate(analogSound);
		}
		else if (lightdata>1500) //3단계
		{
			flag=1;
			led.digitalWrite(0);
		}
		else if (lightdata>800) //2단계
		{
			flag=0
			led.digitalWrite(0);
			setImmediate(analogSound);
		}
		else //1단계
		{
			led.digitalWrite(0);
			flag=0;
		}
		lightdata=-1;
	}
	timerid = setTimeout(analogLight,timeout);
}

const Triggering =() =>{
	let startTick, distance, diff;
	echo.on('alert',(level,tick)=>{
		if(level==1){startTick=tick;}
		else
		{
			endTick=tick;
			diff =endTick - startTick;
			distance = diff/58;
			if(distance<10)
			{
				console.log("탐지된 거리(%i)",distance);
				if(distance<5){
					if(sounddata>500)led.digitalWrite(1);
					else led.digitalWrite(0);
				}
				else led.digitalWrite(0);
			}
		}
	});
}


process.on('SIGINT',() =>{
	Light.close(() =>{
		console.log("MCP-ADC가 해제되어, 프로그램을 종료합니다.");
		led.pwmWrite(0);
		process.exit();
	});
});


console.log("밝기를 측정하고 LED에 출력하는 프로그램");
setImmediate(analogLight);
Triggering();
setInterval(()=>{if(flag==1)trig.trigger(10,1);},200);
