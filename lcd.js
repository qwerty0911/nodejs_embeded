const LCD = require('raspberrypi-liquid-crystal');
const lcd = new LCD(1,0x27,16,2);
const Lcd = {
	timerId:0,

	init:()=>{
		console.log('LCD모듈 초기화');
		lcd.beginSync();
		lcd.clearSync();
	},
	printText: (line1)=>{
		if(Lcd.timerId!=0){
			Lcd.clearAll();
		}
		//line1 += '                 '
		let length = line1.length;
		let i=1;
		console.log('text length : ',line1.length);
		lcd.setCursorSync(0,0);
		lcd.printSync(line1.substring(0,16));
		lcd.setCursorSync(0,1);
		lcd.printSync(line1.substring(16,32));
		if(length>32){
			line1 += '                ';
			Lcd.timerId = setInterval(()=>{
				lcd.setCursorSync(0,1);
				lcd.printSync(line1.substring(16+i,32+i++));
				if(i>=length-16) i=0;
		},666);};
	},
	clearAll:()=>{
		//if(Lcd.timerId!=0){
			clearInterval(Lcd.timerId);
			Lcd.timerId=0;
		//}
		lcd.clearSync();
	}
};

module.exports.init = function(){Lcd.init();};
module.exports.printText = function(line1){Lcd.printText(line1);};
module.exports.clearAll = function(){Lcd.clearAll();};
