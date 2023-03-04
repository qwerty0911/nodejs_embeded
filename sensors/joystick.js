const mcpadc = require('mcp-spi-adc');
const SPI_SPEED=1000000;
const VRX=0;
const VRY=1;

const joyStick = {
	joyX:0,
	joyY:0,
	webio:0,
	timerId:0,
	init:(io)=>{
		joyStick.joyX = mcpadc.openMcp3208(VRX, 
			{speedHz:SPI_SPEED},
				(err) =>{
					console.log("SPI ch0 reset complete!");
					if(err){console.log("ch0 reset fail.");
					}
			});
		joyStick.joyY = mcpadc.openMcp3208(VRY,
			{speedHz:SPI_SPEED},
				(err)=>{
					console.log("SPI ch1 reset complete!");
					if(err){console.log("ch1 reset fail.");
					}
			});
		joyStick.webio=io;
	},
	read:()=>{
		let xvalue = -1, yvalue = -1;

		joyStick.joyX.read((error,reading)=>{
			xvalue = reading.rawValue;
			joyStick.joyY.read((error,reading)=>{
				console.log('x좌표 : %d		y좌표 : %d',xvalue,reading.rawValue);
				yvalue = reading.rawValue;
				if(xvalue !=-1 && yvalue !=-1){
					joyStick.webio.sockets.emit('watch',xvalue,yvalue);
					xvalue = yvalue = -1;
				}
			});
		});
	},
	start:(timerValue)=>{
		if(joyStick.timerId ==0){
			joyStick.timerId = setInterval(joyStick.read, timerValue);
		}
		else console.log("이미 가동중...");
	},
	stop:()=>{
		if(joyStick.timerId !=0)
		clearInterval(joyStick.timerId);
		joyStick.timerId=0;
	},
	terminate:()=>{
		console.log('MCP-ADC해제 (ch0,1)');
		joyStick.joyX.close(()=>{
			joyStick.joyY.close(()=>{
			});
		});
	}
}

module.exports.init = function(io) {joyStick.init(io); };
module.exports.read = function() {joyStick.read(); };
module.exports.start = function(timerValue){joyStick.start(timerValue); };
module.exports.stop = function() {joyStick.stop(); };
module.exports.terminate = function() {joyStick.terminate(); };
