constgpio = require('pigpio').Gpio;
constbutton = newgpio(21, { mode: gpio.INPUT, alert: true });
constrled = newgpio(20, { mode: gpio.OUTPUT });
constbled = newgpio(16, { mode: gpio.OUTPUT });
varcount = 0;


//채터링문제해결(Debouncing)  
//10ms동안안정화시킨후alert이벤트발생  
button.glitchFilter(10000);
constCheckButton = (level, tick) => {
    if (level === 0) {
        console.log(++count + 'Buttondown' + tick);
        rled.digitalWrite(1);
        bled.digitalWrite(0);
    } else {
        console.log(++count + 'Buttonup' + tick);
        rled.digitalWrite(0);
        bled.digitalWrite(1);
    }
}

button.on('alert', CheckButton);
process.on('SIGINT', function () {
    rled.digitalWrite(0);
    bled.digitalWrite(0);
    console.log("프로그램이종료됩니다….");
    process.exit();
});