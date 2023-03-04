const gpio = require('pigpio').Gpio;
const mcpadc = require('mcp-spi-adc');

const SPI_SPEED = 1000000;
const LIGHT = 0;
const LED = 26;

const led = new gpio(LED, {mode:gpio.OUTPUT});

var timerid, timeout=200;
var lightdata = -1;

const Light = mcpadc.openMcp3208(LIGHT,{speedHz:SPI_SPEED},
	(err) => {
		console.log("SPI 채널0 초기화 완료!");
		console.log("---------------------");
		if(err) console.log("채널0초기화 실패 hw점검");
});

const analogLight = () =>{
	Light.read((error, reading) =>{
		console.log("현재 측정된 조도값(%d)", reading.rawValue);
		lightdata = reading.rawValue;
	});
	if(lightdata != -1){
		if(lightdata>2200)
			led.pwmWrite(250);
		else if (lightdata<500)
			led.pwmWrite(1);
		else
			led.pwmWrite(30);
		lightdata=-1;
	}
	timeride = setTimeout(analogLight,timeout);
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

