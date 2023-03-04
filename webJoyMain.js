const http = require('http');
const fs = require('fs');
const led = require('./act/ledmodule.js');
const network = require('network');
//const socketio = require('socket.io');
//const mcpadc = require('mcp-spi-adc');
const joystick = require('./sensors/joystick.js');
const light = require('./sensors/light.js');
const PORT = 65090;

const webServer = (request, response) =>{
	fs.readFile('views/chart.html','utf8',function(err,data){
		response.writeHead(200,{'Content-Type':'text/html'});
		response.end(data);
		console.log('webpage에 접속합니다.');
	});
}

const server = http.createServer(webServer);
const io = require('socket.io')(server);

joystick.init(io);
light.init(io);

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
	client.on('startmsg',(data)=>{
		console.log('JOYSTICK 가동 메시지 수신(측정 주기:%d)!',data);
		joystick.start(data);
	});

	client.on('stopmsg',(data)=>{
		console.log('JOYSTICK 중지 메시지 수신');
		joystick.stop();
	});

	client.on('startmsg1',(data,data1)=>{
		console.log('LIGHTSENSOR가동 메시지 수신(측정주기 : '+data+'기준 밝기 : '+data1+')');
		light.start(data,data1);
	});
	client.on('stopmsg1',(data)=>{
		console.log('LIGHTSENSOR중지 메시지 수신')
		led.off();
		light.stop();
	});

});

process.on('SIGINT',()=>{
	console.log('프로그램을 종료합니다.');
	joystick.terminate();
	light.terminate();
	console.log('웹서버 종료');
	process.exit();
});
