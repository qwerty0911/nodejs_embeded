const Gpio = require('pigpio').Gpio;

const motor = new Gpio(26,{mode:Gpio.OUTPUT});

const servo ={
    move0:()=>{
        motor.servoWrite(500);
        console.log("서보모터 0도 회전");
    },
    move90:()=>{
        motor.servoWrite(1500);
        console.log("서보모터 90도 회전");
    },
    move180:()=>{
        motor.servoWrite(2500);
        console.log("서보모터 180도 회전");
    }
}

module.exports = servo;