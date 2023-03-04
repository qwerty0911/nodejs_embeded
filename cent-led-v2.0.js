const noble = require('@jefflloyed/noble');

const SERVICE_UUID = "AD11";
const CHARACTERISTIC_UUID ="AD09";

noble.on('stateChange',functon(state){
  if(state =='poweredOn'){
    console.log("블루투스 : 서비스를 가동합니다.");
    noble.startScanning();
  }else{
    noble.stopScanning();
  }
});

noble.on('scanStart', function(){
  let myAddress = noble._bindings._hci.address;
  console.log("scan을 시작합니다.");
  console.log("블루투싀내 주소는:myAddress);
});

noble.on('scanStop',function(){
  //console.log("scan중지");
});


noble.on('discover',function(peripheral){
  console.log("주변 블루투스 기기:(%d)(%s)",peripheral.rssi,peripheral.address);
  if(peripheral.advertisement.localName =='BLE-32'){
    console.log("블루투스>찾음(discover");
    console.log("블루투스>이름:"+peripheral.advertisement.localName);
    console.log("블루트스>주소: "+peripheral.address);
    console.log("블루투스>신호세기(RSSI): "+peripheral.rssi);
    console.log("블루투스>상대와 연결합니다.");
    peripheral.connect(function(error){
      var serviceUUIDs = [SERVICE_UUID];
      var characteristicUUIDs = [CHARACTERISTIC_UUID];
      peripheral.discoverSomeServicesAndCharacteristics(serviceUUIDs,characteristicUUIDs, onServicesAndCharacteristicsDiscovered);
    });

    peripheral.once('connect',()=>{console.log("블루투스>연결완료.")});
    peripheral.once('disconnect',()=>{
      console.log("블루투스>연결이 끊어졌습니다.");
      console.log("블루투스>scan시작...");
      noble.startScanning();
    });
  }
});

function onServicesAndCharacteristicsDiscovered(error,services,characteristics){
  if(error){
    console.log("블루투스>오류발생 discovering services and characteristics"+error);
    return;
  }

  noble.stopScanning();
  var switchCharacteristic = characteristics[0];

  function receiveData(){
    switchCharacteristics.read(function(error,data){
      if(!error){
        console.log("블루투스> 데이터 1회성 수신(read):"+data);
        return(data);
      }
    });
  }

  function sendData(byte){
    var buffer = Buffer.from(byte);

    console.log('블루투스:데이터전송(write):'+buffer);
    switchCharacteristic.setMaxListers(0);
    switchCharacteristics.write(buffer, false, function(error){
      if(error){
        console.log(error);
        process.exit();
      }
    });
  }

  function remote_led_on(){
    sendData("on");
    setTimeout(remote_led_off,2000);
  }


  function remote_led_off(){
    sendData("off");
    setTimeout(remote_led_on,2000);
  }

  function NotifyForSubscribe(){
    switchCharacteristics.subscribe(function(error){
      if(!error){
