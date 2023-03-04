const bleno = require('@abandonware/bleno');
const led = require('./led.js');
const util = require('util');

const SERVICE_UUID = 'ad09';
const CHARACTERISTIC_UUID = 'ad10';

var analog_data = 0;
var nodename = "BLE-036";

var Characteristic = bleno.Characteristic;
var PrimaryService = bleno.PrimaryService;

const ApproachCharacteristic = function(){
  ApproachCharacteristic.super_.call(this,{
    uuid : CHARACTERISTIC_UUID,
    properties:['read','notify','write'],
    value:null
  });

  this._value = 0;
  this._updateValueCallback = null;
};

util.inherits(ApproachCharacteristic, Characteristic);

ApproachCharacteristic.prototype.onReadRequest = (offsetmcallback)=>{
  var data1 = Buffer.from(this.toString());
  console.log("블루투스>데이터1회송신서비스: "+data1);
  callback(this.RESULT_SUCCESS,data1);
}

ApproachCharacteristic.prototype.onWriteRequest = (data,offset,withoutResponse,callback)=>{
  if(data=="on"){
    console.log("블루투스>데이터수신(write요청):"+data+'(LED ON)');
    led.on();
  }
  else if(data=="off"){
    console.log("블루투스>데이터 수신(write요청):"+data+"(LED OFF)");
    led.off();
  }
  else console.log("블루투스>데잍수신:"+data+'on/off이외의 데이터');
  callback(this.RESULT_SUCCESS);
};

ApproachCharacteristic.prototype.onSubscribe = (maxValueSize, updateValueCallback)=>{
  console.log("블루투스>상대방이 센서데이터 연속서비스 가입(subscribe)요청함");
  this._updateValueCallback = updateValueCallback;
};

ApproachCharacteristic.prototype.onUnsubscribe = (maxValueSize, updateValueCallback)=>{
  console.log("블루투스>상대방이 센서데이터 연속서비스 탕퇴(unsubscribe)요청함");
  this._updateValueCallback = null;
};

bleno.on('stateChange',(state)=>{
  if(state==='poweredOn'){
    bleno.startAdvertising(nodename,[SERVICE_UUID]);
    console.log("블루투스>ON("+nodename+"가동)");
  }
  else{
    bleno.stopAdvertising();
    console.log("블루투스>Advertising을 중단합니다");
  }
});

const approachCharacteristic = new ApproachCharacteristic();

bleno.on('advertisingStart',(error)=>{
  if(!error){
    console.log("블루투스>Advertising을 시작합니다...");
    bleno.setServices([
      new PrimaryService({
        uuid: SERVICE_UUID,
        charactoeristics:[approachCharacteristic]
      })
    ]);
  }
  else console.log("블루투스 > Advertising도중 오류 발생");
});

bleno.on('accept',(addr)=>{
  console.log("블루투스>상대편(%s)이 연결을 수락했습니다",addr);
  setInterval(()=>{
    bleno.updateRssi((error,rssi)=>{
      bleno.setMaxListeners(0);
      console.log("수신감도"+rssi);
    });
  },5000);
});

bleno.on('disconnect',(addr)=>{
  console.log("블루투스>상대편(%s)이 연결을 끊었습니다.",addr);
});

bleno.on('servicesSet',(err)=>{
  if(!err) console.log("블루투스>상대에게 보낼ServiceProfile을 생성합니다");
});

process.on('SIGINT',()=>{
  console.log("\n블루투스>프로그램을 종료합니다");
  process.exit();
});


setInterval(()=>{
  analog_data++;
  approachCharacteristic._value = analog_data;
  if(approachCharacteristic._updateValueCallback){
    console.log(`블루투스>연속데이터송신:&(approachCharacteristic._value}`);
    const notificationBytes = Buffer.from(String(approachCharacteristic._value));
    approachCharacteristic._updateValueCallback(notificationBytes);
  }
},1000);
