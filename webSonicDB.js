const http = require('http');
const fs = require('fs');
const network = require('network');
const sonic = require('./sensors/sonicdb.js');
const dbif = require('./db/dbif.js');
const PORT = 65001;

const webServer = (request, response) => {
	fs.readFile('views/webpage.html', 'utf8', function (err, data) {
		response.writeHead(200, { 'Content-Type': 'text/html' });
		response.end(data);
		console.log('webpage에 접솝학니다.');
	});
}

const server = http.createServer(webServer);

server.listen(PORT, () => {
	network.get_active_interface((err, ifaces) => {
		if (ifaces !== undefined) {
			if (ifaces.name = 'wlan0') {
				console.log('server waiting http://' + ifaces.ip_address + ':' + PORT);
				console.log('web browser를 열고 web주소를 입력하세요');
			}
		}
	});
	setInterval(dbif.select, 10000);
});

const io = require('socket.io')(server);
sonic.init(io);
io.on('connection', client => {
	client.on('startmsg', (data) => {
		console.log('가동 메시지 수신(측정 주기:%d)!', data);
		sonic.start(data);
	});

	client.on('stopmsg', (data) => {
		console.log('중지메시지 수신');
		sonic.stop();
	});
});

process.on('SIGINT', () => {
	console.log('프로그램을 종료합니다.');
	process.exit();
});
