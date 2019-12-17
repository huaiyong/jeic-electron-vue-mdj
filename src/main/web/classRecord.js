var express = require('express');
var router = express.Router();
const uuid = require('node-uuid');
const userGroupDao = require('../db/userGroupDao');
const httpUtil = require('../utils/httpUtil');
const config = require('../config');
const classRecordDao = require('../db/classRecordDao');
const studentDao = require('../db/studentDao');
const dateUtil = require('../utils/dateUtil');
const Constants = require('../common/Constants');

var request = require('request');

/**
 * 开始上课
 */
//router.post('/startClass', function(req, res) {
//	var id = uuid.v1();
//	Constants.classRecordId = id;
//	var jsonObj = req.body.jsonData;
//	
//	var date = dateUtil.currentTime();
//	jsonObj["startTime"] = date;
//	jsonObj["classRecordId"] = id;
//	
//	var map = {};
//	map["teacherName"]= jsonObj.teacherName; //教师名字
//	map["id"]= id;
//	map["createBy"]= jsonObj.teacherId; //教师ID
//	map["officeId"]= jsonObj.officeId; //学校ID
//	map["officeName"]= jsonObj.officeName; //学校名称
//	map["gradeId"]= jsonObj.gradeId;
//	map["gradeName"]= jsonObj.gradeName;
//	map["classId"]= jsonObj.classId;
//	map["className"]= jsonObj.className;
//	map["subjectId"]= jsonObj.subjectId;
//	map["subjectName"]= jsonObj.subjectName; //获取科目
//	map["startTime"]= date;
//	map["endTime"]= date;
//	
//	httpUtil.httpPostJSON(config.adminSartClass,map);
//	
//	classRecordDao.insertstartClass(jsonObj);
//	
//	res.json({
//		data: id,
//		message: "上课成功",
//		ret: 200
//	})
//});

router.post('/startClass', function(req, res) {
	var id = uuid.v1();
	Constants.classRecordId = id;
	var jsonObj = req.body.jsonData;
	var classId = jsonObj.classId;
	var teacherId = jsonObj.teacherId;
	var obj = {};
	var date = dateUtil.currentTime();
	obj["startTime"] = date;
	obj["classRecordId"] = id;
	
	obj["teacherId"] = jsonObj.teacherId;
	obj["classId"] = jsonObj.classId;
	obj["subjectId"] = jsonObj.subjectId;
	obj["subjectName"] = jsonObj.subjectName;
	
	request(config.jeucIp+"/uc/user?classId="+classId +"&userType=2&state=1&delFlag=0&orderBy=2", function (error, response, body) {
		if (!error && response.statusCode == 200) {
		   	body = JSON.parse(body);
		    var remember = body.data.list;
			var userList = [];
			for (var i = 0; i < remember.length; i++) {
				var studentobj = {};
				studentobj.userId = remember[i].id;
				studentobj.deviceName = remember[i].deviceName;
				studentobj.realname = remember[i].realname;
				studentobj.sex = remember[i].sex;
				userList.push(studentobj);
			};
			obj["userList"] = userList;	
		
			request(config.jeucIp+"/ea/class/" + classId, function (error, response, body) {
				if (!error && response.statusCode == 200) {
				body = JSON.parse(body);
				var gradeId = body.data.gradeId;
				var gradeName = body.data.gradeName;
				var className = body.data.name;					
				obj["gradeId"] =gradeId;
				obj["gradeName"] =gradeName;
				obj["className"] =className;
		
				request(config.jeucIp+"/uc/user/" + teacherId, function (error, response, body) {
					if (!error && response.statusCode == 200) {
						body = JSON.parse(body);
						var officeId =body.data.provinceId+"," +body.data.cityId +"," +body.data.countyId +"," +body.data.officeId;
						var officeName =body.data.provinceName+"," +body.data.cityName +"," +body.data.countyName +"," +body.data.officeName;
						obj["officeId"] =officeId;
						obj["officeName"] =officeName;
						obj["teacherName"] =body.data.realname;	
		
						var map = {};
						map["teacherName"]= obj.teacherName; //教师名字
						map["id"]= id;
						map["createBy"]= obj.teacherId; //教师ID
						map["officeId"]= obj.officeId; //学校ID
						map["officeName"]= obj.officeName; //学校名称
						map["gradeId"]= obj.gradeId;
						map["gradeName"]= obj.gradeName;
						map["classId"]= obj.classId;
						map["className"]= obj.className;
						map["subjectId"]= obj.subjectId;
						map["subjectName"]= obj.subjectName; //获取科目
						map["startTime"]= date;
						map["endTime"]= date;
					
						httpUtil.httpPostJSON(config.adminSartClass,map);
						
						classRecordDao.insertstartClass(obj);
	  				}
				})
	  		}
		})
		}
	})
	res.json({
		data: id,
		message: "上课成功",
		ret: 200
	})
});




/**
 * 下课
 */
router.post('/stopClass', function(req, res, next) {
//	var classRecordId = req.param('classRecordId');
	var classRecordId = Constants.classRecordId;
	global.userMap = {};//清空签到数据
	global.padSigninUserList = [];//清空学生pad签到数据
	//删除临时组
	userGroupDao.findTeachingGroupByType(classRecordId,function (rows) {
		if(rows.length > 0){
			for(var teachingGroup of rows){
				userGroupDao.findUserGroupById(teachingGroup.id,function (rows1) {
					if(rows1.length > 0){
						for(var userGroup of rows1){
							var userGroupId = userGroup.id;
							userGroupDao.deleteStudentUserGroup(userGroupId);
						}	
					}
					userGroupDao.deleteUserGroup(teachingGroup.id);
					userGroupDao.deleteTeachingGroup(teachingGroup.id);
				})
			}	
		}
	})
	studentDao.deleteStudent();
	var endTime = dateUtil.currentTime();
	classRecordDao.updateEndTime(classRecordId,endTime)
	var map = {};
	map["rId"]= classRecordId; //教师名字
	httpUtil.httpPostJSON(config.adminStopClass,map);
	res.json({
		message: "操作成功",
		ret: 200
	})
});




module.exports = router;
