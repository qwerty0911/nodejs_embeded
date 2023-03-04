const request = require('request');
const network = require('network');
var myData={
    userip:"",
    degree:'0'
}

const PORT = 60001;

network.get_active_interface((err,ifaces)=>{
    let myUrl;
    if(ifaces!=undefined){
        if(ifaces.name =='wlan0'){
            console.log('IP주소:'+ifaces.ip_address+':'+PORT);
            myUrl="http://"+ifaces.ip_address+':'+PORT+'/servo';
            myData.userip=ifaces.ip_address;
            request.post(
                {
                    url:myUrl,
                    form:myData,
                    headers : {"content-type":"application/x-www-form-urlencoded"}
                },
                (error,response,body)=>{
                    if(!error&&response.statusCode==200){
                        console.log('REST API서버로부터 수신한 응답:'+body);
                    }
                }
            );
        }
    }
})