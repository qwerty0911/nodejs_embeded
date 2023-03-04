const http = require('http');
const fs = require('fs');
const network = require('network');
//const socketio = require('socket.io');
//const mcpadc = require('mcp-spi-adc');
//const joystick = require('./sensors/joystick.js');
const lcd = require('./lcd.js');
const PORT = 65051;

const webServer = (request, response) =>{
	fs.readFile('views/lcdpage.html','utf8',function(err,data){
		response.writeHead(200,{'Content-Type':'text/html'});
		response.end(data);
		console.log('webpage에 접속합니다.');
	});
}

const server = http.createServer(webServer);
const io = require('socket.io')(server);

lcd.init(io);

server.listen(PORT, () =>{
	network.get_active_interface((err,ifaces)=>{
		if(ifaces !== undefined){
			if(ifaces.name = 'wlan0'){
				console.log('server waiting http://'+ifaces.ip_address+':'+PORT);
				console.log('web browser를 열고 web주소를 입력하세요');
			}
		}
	});
});

io.on('connection',client=>{
	client.on('printLCD',(data)=>{
		console.log('LCD 출력 : ',data);
		lcd.printText(data);
	});

	client.on('clearLCD',(data)=>{
		console.log('LCD clear');
		lcd.clearAll();
	});
});

process.on('SIGINT',()=>{
	console.log('프로그램을 종료합니다.');
	lcd.clearAll();
	process.exit();
});
