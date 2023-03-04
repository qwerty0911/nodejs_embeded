constgpio=require('pigpio').Gpio;  
constbutton=newgpio(21,{mode:gpio.INPUT});  
constrled=newgpio(20,{mode:gpio.OUTPUT});  
constbled=newgpio(16,{mode:gpio.OUTPUT});  
varcount=0;  //채터링문제해결(Debouncing),10ms동안안정화  
button.glitchFilter(10000);  
constCheckButton=()=>{  
    letdata;  
    data=button.digitalRead();  
    if(!data){  
        console.log('Pressed!'+count);  
        if((count++%2)==0){  
            rled.digitalWrite(1);  
            bled.digitalWrite(0);  
        }  else{  
            rled.digitalWrite(0);  
            bled.digitalWrite(1);  
        }  
    }  
    setTimeout(CheckButton,200);  
}

process.on('SIGINT',function(){  
    rled.digitalWrite(0);  
    bled.digitalWrite(0);  
    console.log("프로그램이종료됩니다….");  
    process.exit();  
});  

setImmediate(CheckButton)