<template>
	<div class="zmj_studentList">
		<div class="zmj_remember" v-if="pattern">
			<div class="zmj_rememberTitle">
				<span>成员管理</span><span @click="close()"><img src="../assets/img/close.svg" alt=""></span>
			</div>
			<div class="zmj_rememberInfo">全部:<span><i v-text="remember.length"></i>人</span> 已签到:<span><i v-text="signRemember.length"></i>人</span>
				未签到:<span><i v-text="remember.length-signRemember.length"></i>人</span></div>
			<div class="zmj_rememberList">
				<ul>
					<li v-for="(item,index) in remember" @click="studentFile(item.id,$event)" :key="index" :class="{'active':signRemember.indexOf(item.device)!=-1 || signRemember.indexOf(item.id)!=-1 }">
						<img v-if="item.sex=='男'" src="../assets/img/boy.png" alt="">
						<img v-if="item.sex=='女'" src="../assets/img/girl.png" alt="">
						<p v-text="item.name"></p>
						<span v-if="stuUpLoadFileId.indexOf(item.id)!=-1" class="num">{{stuUpLoadFile[stuUpLoadFileId.indexOf(item.id)].stuCount}}</span>
					</li>
				</ul>
			</div>
		</div>
		<div class="zmj_remember" v-if="!pattern">
			<div class="zmj_rememberTitle">
				<span v-text="groupName"></span><span @click="close()"><img src="../assets/img/close.svg" alt=""></span>
			</div>
			<div class="zmj_groupStudents">
				<div class="scroll">
					<div v-for="i in groupStudent" :key="i.id">
						<h4><span v-text="i.name"></span> (<span v-text="i.studentList.length+1"></span>人)</h4>
						<div class="groups clearfix">
							<div class="groupLeader fl" :class="{'active':signRemember.indexOf(i.groupLeader.device)!=-1 || signRemember.indexOf(i.groupLeader.id)!=-1}">
								<img v-if="i.groupLeader.sex=='男'" src="../assets/img/boy.png" alt="">
								<img v-if="i.groupLeader.sex=='女'" src="../assets/img/girl.png" alt="">
								<p v-text="i.groupLeader.name"></p>
								<span v-if="stuUpLoadFileId.indexOf(i.id)!=-1" class="num">{{stuUpLoadFile[stuUpLoadFileId.indexOf(i.id)].stuCount}}</span>
							</div>
							<ul class=" fr clearfix">
								<li v-for="item in i.studentList" @click="studentFile(item.id,$event)" :key="item.id" :class="{'active':signRemember.indexOf(item.device)!=-1 || signRemember.indexOf(item.id)!=-1}">
									<img v-if="item.sex=='男'" src="../assets/img/boy.png" alt="">
									<img v-if="item.sex=='女'" src="../assets/img/girl.png" alt="">
									<p v-text="item.name"></p>
									<span v-if="stuUpLoadFileId.indexOf(item.id)!=-1" class="num">{{stuUpLoadFile[stuUpLoadFileId.indexOf(item.id)].stuCount}}</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import $ from "jquery"
	import {
		mapState
	} from "vuex";
	export default {
		name: "Studentlist",
		data: function() {
			return {
				signRemember: [], //签到学生
				timer: "", //定时器
				groupStudent: [], // 分组学生,
				groupName: "", //组名
				stuUpLoadFileId: [],
				stuUpLoadFile: [],
				remember: []
			}
		},
		sockets: {
			closeMemberAdmin() {
				this.close();
			},
			chengyuanScroll(data) {
				var conheight = $(".zmj_rememberList ul").height()-$(".zmj_rememberList").height();
				$(".zmj_rememberList").scrollTop(data * conheight );
			},
			chengyuangroupScroll(data) {
				var conheight = $(".zmj_groupStudents .scroll").height()-$(".zmj_groupStudents").height();
				$(".zmj_groupStudents").scrollTop(data * conheight);
			},
			clickStuPicture(data) {
				this.studentFileEvents(data)
			}

		},
		methods: {
			close() {
				clearInterval(this.timer);
				this.$router.push({
					"name": "Index"
				});
			},
			getStudent() {
				this.$http.get("http://localhost:3000/jeic/api/student?classId=" + this.classId).then(res => {
					if (res.data.ret == 200) {
						this.remember = res.data.data;
					};
				});
			},
			getGroupStudent() {
				this.$http.get("http://127.0.0.1:3000/jeic/api/teachingGroup/" + this.groupId).then((
					res) => {
					if (res.data.ret == 200) {
						this.groupStudent = res.data.data.userGrouplist;
						this.groupName = res.data.data.name;
					};
				});


			},
			signIn() { //请求签到学生
				var data = [];
				this.timer = setInterval(() => {
					this.$http.get("http://localhost:3000/jeic/api/signin/getSignin").then((res) => {
						if (res.data.ret == 200) {
							this.signRemember = res.data.data;
							this.$socket.emit('jeic', {
									'name': "qiandao",
									'data': res.data.data
							});
							this.$http.get("http://localhost:3000/jeic/api/studentPad/findClassStuUploadCount?classRecordId=" + this.classRecord)
								.then((res) => {
									for (var i = 0; i < res.data.data.length; i++) {
										if (res.data.data[i].stu_id) {
											this.stuUpLoadFileId.push(res.data.data[i].stu_id);
										};
									};
									this.stuUpLoadFile = res.data.data
								})

						};
					});
				}, 1000);
			},
			studentFile(id, event) {
				if (event.target.querySelector("span") != null) {
					this.studentFileEvents(id);
				};
			},
			studentFileEvents(id) {
				this.$router.push({
					"path": "/studentUploadImg/:id:classRecordId",
					query: {
						id: id,
						classRecordId: this.classRecord
					}
				});
			}


		},
		computed: {
			...mapState({
				pattern: state => state.state.pattern,
				groupId: state => state.state.groupId,
				classRecord: state => state.state.classRecord,
				classId: state => state.state.classId
			})
		},

		activated() {
			if (!this.pattern) {
				this.getGroupStudent();
			} else {
				this.getStudent();
			};
			this.signIn();
		},
		beforeRouteLeave(to, from, next) {
			clearInterval(this.timer);
			next();
		}

	}
</script>

<style scoped="scoped">
	.zmj_remember {
		width: 80rem;
		height: 42rem;
		border: .1rem solid rgba(18, 18, 18, 0.3);
		border-radius: .6rem;
		background: rgb(137, 137, 137);
		margin: 2rem auto 0;
		overflow: hidden;
	}

	.num {
		position: absolute;
		top: 0;
		right: 0px;
		display: block;
		width: 1.8rem;
		height: 1.8rem;
		line-height: 1.8rem;
		font-size: 1.4rem;
		border-radius: 50%;
		background: rgba(18, 150, 219, .75);
		text-align: center;
	}

	.zmj_rememberTitle {
		height: 5.6rem;
		line-height: 5.6rem;
		padding: 0 2rem;
		border-bottom: .1rem solid rgba(1, 1, 1, 0.3);
		background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#E8E6E7), to(#D2D0D3), color-stop(0.5, #dbd9dc));
	}

	.zmj_rememberTitle span:first-child {
		color: #666;
		font-size: 1.6rem;
		padding: .8rem 1rem;
		border: .1rem solid #a3a1a4;
		border-radius: .8rem;
		background: #fff;
	}

	.zmj_rememberTitle span:last-child {
		width: 2.4rem;
		height: 2.4rem;
		text-align: center;
		line-height: 2.4rem;
		background: #fff;
		border-radius: 50%;
		margin-top: 1.6rem;
		overflow: hidden;
		display: inline-block;
		float: right;
		cursor: pointer;

	}

	.zmj_rememberTitle span:last-child img {
		width: 100%;
		height: 100%;
	}

	.zmj_rememberInfo {
		height: 4rem;
		line-height: 4rem;
		font-size: 2.2rem;
		color: #fff;
		padding: 0 2rem;
		border-bottom: .1rem solid #ccc;
	}

	.zmj_rememberInfo span {
		margin-right: 2rem;
	}

	.zmj_rememberList  {
		padding-top: 2rem;
		padding-left: 2rem;
		height: 30.2rem;
		overflow-y: auto;
	}

	.zmj_rememberList ul li {
		position: relative;
		width: 8.3rem;
		font-size: 1.8rem;
		color: #fff;
		text-align: center;
		margin-right: 1rem;
		margin-bottom: 2rem;
		white-space: nowrap;
		text-overflow: ellipsis;
		display: inline-block;
		opacity: 0.3;
		cursor: pointer;
	}

	.zmj_rememberList ul li.active {
		opacity: 1
	}

	.zmj_rememberList ul li img {
		width: 6rem;
		height: 6rem;
		pointer-events: none;
	}

	.zmj_groupStudents {
		height: 36rem;
		padding: 0 2rem;
		overflow-y: auto;

	}
	.zmj_groupStudents h4{
		font-size: 1.6rem;
		color: #fff;
		padding: 1.5rem 0;
	}
	.zmj_groupStudents .groupLeader {
		width: 11%;
		height: 11rem;
		text-align: center;
		font-size: 1.45rem;
		color: #fff;
		margin-top: 1rem;
		opacity: 0.3;
		position: relative;
	}

	.zmj_groupStudents ul {
		width: 86%;
	}

	.zmj_groupStudents ul li {
		width: 12%;
		height: 11rem;
		float: left;
		text-align: center;
		margin-left: 1.4rem;
		margin-top: 1rem;
		opacity: 0.3;
	}

	.zmj_groupStudents div.active,.zmj_groupStudents ul li.active {
		opacity: 1;
		cursor: pointer;
	}

	.zmj_groupStudents img {
		width: 7rem;
		height: 7rem;
		margin-bottom: 1rem;
		pointer-events: none;
	}

	.zmj_groupStudents ul li p {
		    text-align: center;
		    font-size: 1.45rem;
		    color: #fff;
	}
</style>
