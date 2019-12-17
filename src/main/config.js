var config = {
	//楼下111管理端
//  "adminServerIp":"111.207.13.88",
//  "adminServerPort":"9153",
	//阿里云管理端
//  "adminServerIp":"47.93.207.20",
//  "adminServerPort":"9038",
    //牡丹江管理端
    "adminServerIp":"218.9.54.192",
    "adminServerPort":"777",
    
    //牡丹江管理端接口路径
    "adminStuAnswer":"/jeicAdmin/api/crClassRecord/stuAnswer",
    "adminInsertSend":"/jeicAdmin/api/crClassRecord/crClassRecordSend",
    "adminBackPhotos":"/jeicAdmin/api/crClassRecord/crClassStuBack",
    "adminClassRecordSend":"/jeicAdmin/api/crClassRecord/crClassRecordSend",
    "adminStuSend":"/jeicAdmin/api/crClassRecord/stuSend",
    "adminSartClass":"/jeicAdmin/api/crClassRecord",
    "adminStopClass":"/jeicAdmin/api/crClassRecord/getOutClass",
    
//	楼下111用户接口
    //"jeucIp":"http://111.207.13.88:8881/jeuc/api",
//	阿里云用户接口
//"jeucIp":"http://39.105.18.180:9001/jeuc/api",
//	牡丹江用户接口
 "jeucIp":"http://218.9.54.64:9099/jeuc/api/",
    
};
module.exports = config;
