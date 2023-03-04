constgpio = require('pigpio').Gpio;
constLEDPIN = 21;
constled = newgpio(LEDPIN, { mode: gpio.OUTPUT });
varflag = 0;

constTimeOutHandler = function () {
    if (flag > 0) {
        led.digitalWrite(1);
        console.log("Node:LEDon");
        flag = 0;
    }
    else {
        led.digitalWrite(0);
        console.log("Node:LEDoff");
        flag = 1;
    }
    setTimeout(TimeOutHandler, 1000);
}