//const gpio = require('pigpio').Gpio;
const mcpadc = require('mcp-spi-adc');
const led = require('../act/ledmodule.js');

const SPI_SPEED = 1000000;
const LIGHT = 3;

const light ={
	light:0,
	webio:0,
	timerId:0,
	bound:0,
	init:(io)=>{
		light.light = mcpadc.openMcp3208(LIGHT,
			{speedHz:SPI_SPEED},
				(err) =>{
					console.log("SPI ch3 reset...");
					if(err)console.log("ch3 reset fail");
			});
		light.webio=io;
	},
	read:()=>{
		let lvalue = -1;

		light.light.read((error,reading)=>{
			lvalue = reading.rawValue;
			console.log("조도"+lvalue+'기준점 : '+light.bound);
			if(lvalue!=-1){
				light.webio.sockets.emit('watch1',lvalue);
				if(lvalue>light.bound) led.on();
				else led.off();
				lvalue = -1;
			}
		});
	},
	start:(timerValue,border)=>{
		light.bound=border;
		if(light.timerId ==0){
			light.timerId=setInterval(light.read, timerValue);
		}
		else console.log('이미 가동중...');
	},
	stop:()=>{
		if(light.timerId!=0)
		clearInterval(light.timerId);
		light.timerId=0;
	},
	terminate:()=>{
		console.log('MCP-ADC 해제 (ch3) 및 led off');
		led.off();
		light.light.close(()=>{
			//console.log('MCP-ADC 해제 및 웹서버 종료(ch3 조도센서)');
			//led.off();
		});
	}
}

module.exports.init = function(io) {light.init(io); };
module.exports.read = function() {light.read();};
module.exports.start = function(timerValue,border){light.start(timerValue,border); };
module.exports.stop = function(){light.stop();};
module.exports.terminate = function(){light.terminate();};
