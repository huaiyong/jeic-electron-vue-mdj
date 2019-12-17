var Constants = {
    "code":{
        "success":200,
        "error":500
    },
    "message":{
        "success":"操作成功",
        "error":"操作失败"
    },
    classRecordId:"",
    winner:[],				//   抢答
    padResponder: [],
	padIntResponder:1,
	padAnswerList:[],		//   pad答题记录的全局变量
	padAnswerUserList:[],	//	 pad答题用户的全局变量
	answer : {},			//	   答题记录设备的全局变量
    answerList : [],		//   答题记录设备的全局变量
    padSigninUserList:[],	//   pad签到
    userMap:{},
};
module.exports = Constants;
