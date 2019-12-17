const db = require('./db').getdb();
const uuid = require('node-uuid');
const conn = require('./db');

//查询教学分组列表
function findTeachingGroup(teachingGroup,callback) {
    var sql = "select * from teachinggroup where del_flag = 0 and class_id = '"+teachingGroup.classId+"' and subject_id = '"+teachingGroup.subjectId+"' ORDER BY create_date DESC;";
    //var sql = "select * from teachinggroup where class_id = '"+teachingGroup.classId+"' and subject_id = '345';"
    //logger.info(sql);
    conn.queryData(sql,callback)
}

//查询临时教学分组列表
function findTeachingGroupByType(teachingGroup,callback) {
    var sql = "select * from teachinggroup where del_flag = 0 and type = 1";
    //var sql = "select * from teachinggroup where class_id = '"+teachingGroup.classId+"' and subject_id = '345';"
    //logger.info(sql);
    conn.queryData(sql,callback)
}

//通过id查询教学组信息
function findTeachingGroupById(id,callback) {
    var sql = "select * from teachinggroup where del_flag = 0 and id = '"+id+"';";
    //var sql = "select * from teachinggroup where class_id = '"+teachingGroup.classId+"' and subject_id = '345';"
    //logger.info(sql);
    conn.queryData(sql,callback)
}

//删除某个教学组
function deleteTeachingGroup(teachingGroupId,callback) {
    var sql = "update teachinggroup set del_flag = 1 where id = '"+teachingGroupId+"';";
    //logger.info(sql);
    conn.executeSql(sql)
}
//删除某个教学组中的小组
function deleteUserGroup(teachingGroupId,callback) {
    var sql = "DELETE FROM usergroup where teachinggroup_id = '"+teachingGroupId+"';";
    //logger.info(sql);
    conn.executeSql(sql)
}
//通过教学组id查询教学组里面的小组
function findUserGroupById(id,callback) {
    var sql = "select * from usergroup where  del_flag = 0 and teachinggroup_id= '"+id+"';";
    //logger.info(sql);
    conn.queryData(sql,callback)
}
//通过小组id删除小组的成员
function deleteStudentUserGroup(userGroupId,callback) {
    var sql = "DELETE FROM student_usergroup where usergroup_id = '"+userGroupId+"';";
    //logger.info(sql);
    conn.executeSql(sql)
}
function deleteStudentUserGroupById(id,callback) {
    var sql = "DELETE FROM student_usergroup where id = '"+id+"';";
    //logger.info(sql);
    conn.executeSql(sql)
}
function updateUserGroupById(userGroup,callback){
	var sql = "update teachinggroup set name = '"+userGroup.name+"' where id = '"+userGroup.id+"';";
    //logger.info(sql);
    conn.queryData(sql)
}
//查询班级学生
async function findStudentList(classId){
	var sql = "select id from student where class_id = '"+classId+"';";
    //logger.info(sql);
    return await conn.asyncRun(sql);
}





//查询某个教学分组的组信息和小组成员
function findUserGroup(userGroup,callback) {
    //var sql = "SELECT a.id,a.name,b.student_id,b.student_name,b.leader_flag from usergroup as a LEFT JOIN student_usergroup as b on a.id = b.usergroup_id where a.teachinggroup_id = '"+userGroup.teachinggroupId+"';";
    var sql = "SELECT a.id,a.name,b.student_id,b.leader_flag,c.class_id,c.class_name,c.device,c.grade_name,c.name as student_name,c.office_name,c.sex from usergroup as a LEFT JOIN student_usergroup as b on a.id = b.usergroup_id LEFT JOIN student AS c ON b.student_id=c.id where a.teachinggroup_id = '"+userGroup.teachinggroupId+"';";
    //logger.info(sql);
    conn.queryData(sql,callback)
}
//查询某个教学分组的组信息和小组成员
async function findUserGroup1(userGroup) {
    //var sql = "SELECT a.id,a.name,b.student_id,b.student_name,b.leader_flag from usergroup as a LEFT JOIN student_usergroup as b on a.id = b.usergroup_id where a.teachinggroup_id = '"+userGroup.teachinggroupId+"';";
    var sql = "SELECT b.id,a.name,b.student_id,b.leader_flag,c.class_id,c.class_name,c.device,c.grade_name,c.name as student_name,c.office_name,c.sex from usergroup as a LEFT JOIN student_usergroup as b on a.id = b.usergroup_id LEFT JOIN student AS c ON b.student_id=c.id where a.teachinggroup_id = '"+userGroup.teachinggroupId+"';";
    //logger.info(sql);
    return await conn.asyncRun(sql);
}



module.exports.findTeachingGroup = findTeachingGroup
module.exports.findUserGroup = findUserGroup
module.exports.findUserGroupById = findUserGroupById
module.exports.deleteStudentUserGroup = deleteStudentUserGroup
module.exports.deleteUserGroup = deleteUserGroup
module.exports.deleteTeachingGroup = deleteTeachingGroup
module.exports.findTeachingGroupById = findTeachingGroupById
module.exports.updateUserGroupById = updateUserGroupById
module.exports.findTeachingGroupByType = findTeachingGroupByType


module.exports.findUserGroup1 = findUserGroup1
module.exports.findStudentList = findStudentList
module.exports.deleteStudentUserGroupById = deleteStudentUserGroupById



