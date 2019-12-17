<template>
	<div class="wrapper">
		<div class="getClasstjtc">
			<div class="tcContent">
				<!-- 分组选择左侧栏 -->
				<div class="fzleft" v-if="!pattern&&model==3">
					<p>
						<button v-bind:class="{ active:cancelbtn==true}" v-on:click="allClass(0)">全部</button>
					</p>
					<ul>
						<li v-for="(item,index) in groupStudent" v-on:click="addClass(index,item.id)" v-bind:class="{ active:item.id==usergroupId}">{{item.name}}</li>
					</ul>
				</div>
				<div class="menberight">
					<!-- 班级答题统计 -->
					<div class="pingjuntrue" v-if="pattern&&model!=3">
						<ul class="banjiuldati">
							<li>测试平均正确率：
								<p class="pingjunzitiset">{{averagelv2}}%</p>
							</li>
							<li>已答题：<span></span>{{haveTheAnswerCount}}人</li>
							<li>未答题：<span></span>{{notTheAnswerCount}}人</li>
						</ul>
					</div>
					<!-- 班级答题统计 组长模式-->
					<div class="pingjuntrue" v-if="!pattern&&model!=3">
						<ul class="banjiuldati">
							<li>测试平均正确率：
								<p class="pingjunzitiset">{{averagelv2}}%</p>
							</li>
							<li>已答题组数：<span></span>{{haveTheAnswerCount}}</li>
							<li>未答题组数：<span></span>{{notTheAnswerCount}}</li>
						</ul>
					</div>
					<!-- 班级答题统计 全组模式 点击全部 -->
					<div class="pingjuntrue" v-if="!pattern&&model==3&&allGroupChecked">
						<ul class="banjiuldati">
							<li>测试平均正确率：
								<p class="pingjunzitiset">{{averagelv2}}%</p>
							</li>
							<li>已答题：<span></span>{{haveTheAnswerCount}}人</li>
							<li>未答题：<span></span>{{notTheAnswerCount}}人</li>
						</ul>
					</div>
					<!-- 班级答题统计 全组模式 点击组名-->
					<div class="pingjuntrue" v-if="!pattern&&model==3&&!allGroupChecked">
						<ul class="banjiuldati">
							<li>测试平均正确率：
								<p class="pingjunzitiset">{{averagelv2}}%</p>
							</li>
							<li>组内已答题：<span></span>{{haveTheAnswerCount}}人</li>
							<li>组内未答题：<span></span>{{notTheAnswerCount}}人</li>
						</ul>
					</div>
					<!--班级答题统计表格-->
					<div class="grop_list_show classtableset">
						<!-- 柱状图标 -->
						<div class="paichange"  v-show="!$route.query.changeTab">
							<div id="container2" ref="container2" style="width:100%;height:100%;"></div>
						</div>
						<!-- 表格 -->
						<div class="paichangetable"  v-show="$route.query.changeTab">
							<table border="0" cellspacing="0" cellpadding="0" class="studentScoce">
								<thead>
									<tr>
										<th>题号<i class="iconfont icon-paixusheng"></i></th>
										<th>正确人数</th>
										<th>错误人数<i class="iconfont icon-paixu-jiang"></i></th>
										<th>正确率</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="(item,index) in tableData">
										<td class="tihaodianji" @click="getQuestionNum(item.datamark)">
											{{item.datamark}}
										</td>
										<td>{{item.trueCount}}</td>
										<td>{{item.nullCount}}</td>
										<td>{{item.accuracy}}%</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div style="text-align:center;margin-top: 2rem;">
							<router-link tag="span" v-if="!$route.query.changeTab" id="switchPai" class="lvsebtn" @click.native="switchTab('showTable')"
							 :to="{path:'',query:{tab:'column',changeTab:true}}" exact>查看表格</router-link>
							<router-link tag="span" v-if="$route.query.changeTab" id="switchPai" class="lvsebtn" @click.native="switchTab('showPic')"
							 :to="{path:'',query:{tab:'table',changeTab:false}}" exact>查看图表</router-link>
							<span id="studentResultbtn" class="lvsebtn" @click="rankingStatistics()">学生正确率</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<span class="closefullscreen fr" @click="back()">
			<em class="iconfont icon-guanbi1 exitResTc colorfff"></em>
		</span>
	</div>
</template>

<script>
	import $ from "jquery";
	import {
		mapState
	} from "vuex";

	export default {
		name: "allStatistics",
		data() {
			return {
				current: -1,
				groupStudent: [],
				cancelbtn: true,
				changeTab: true,
				tableData: [],
				averagelv2: 0,
				haveTheAnswerCount: 0,
				notTheAnswerCount: 0,
				text: this.$route.params.text,
				eachRecordId: this.$route.params.id,
				notTheAnswerCount: 0,
				usergroupId: '',
				changeId: '',
				allGroupChecked: false,
			}
		},
		computed: {
			...mapState({
				recordId: state => state.state.recordId,
				pattern: state => state.state.pattern,
				model: state => state.state.model,
				groupId: state => state.state.groupId
			})
		},
		sockets: {
			showTable() {
				this.switchTab("showTable")
			},
			showPic() {
				this.switchTab("showPic")
			},
			tihao(data) {
				this.getQuestionNum(data)
			},
			closeInfoWindow() {
				this.back()
			},
			watchStudetailFlower() {
				this.rankingStatistics()
			},
			chakanzongchengjiScroll(data) {
			
				var conheight = $(".studentScoce").height();
				$(".paichangetable").scrollTop(data * conheight);
			},
			allGroup() {
				this.allClass();
			},
			checkGroup(data) {
				this.addClass(data[0], data[1])
			}
		},
		methods: {
			back() {
				this.$router.push({
					name: 'StudentAnswers'
				})
				this.usergroupId = "";
				this.cancelbtn = true;
				this.current = -1;
				sessionStorage.setItem("switchTab","column");
				sessionStorage.removeItem("groupId")
			},
			addClass: function(index, id) { //点击组
				this.cancelbtn = false;
				this.current = index;
				this.usergroupId = id;
				this.allGroupChecked = false;
				sessionStorage.setItem("groupId",id)
				var that = this;
				this.$http.get("http://localhost:3000/jeic/api/answerResult/getAnswerByRecordId?recordId=" + this.changeId +
					'&type=1' + '&teachinggroupId=' + this.groupId + '&usergroupId=' + id).then(function(res) {

					var tishuliangnum = [];
					var banjibaifenbi = [];
					var averagelv = 0
					var chushu = res.data.data.length;
					that.tableData = res.data.data
					for (var i = 0; i < res.data.data.length; i++) {
						banjibaifenbi.push(res.data.data[i].accuracy);
						tishuliangnum.push(i + 1 + "题")
						averagelv = averagelv + parseFloat(res.data.data[i].accuracy);
					}
					that.averagelv2 = (averagelv / chushu).toFixed(2);
					that.displayChart(tishuliangnum, banjibaifenbi)
				});
				this.$http.get("http://127.0.0.1:3000/jeic/api/answerResult/getDataGroupByUser?recordId=" + this.changeId +
					'&type=' + this.model + '&usergroupId=' + id + '&teachinggroupId=' + this.groupId).then(function(res) {

					that.haveTheAnswerCount = res.data.data.haveTheAnswerCount
					that.notTheAnswerCount = res.data.data.notTheAnswerCount
				});

			},

			allClass: function() { //点击全部
				this.cancelbtn = true;
				this.current = -1;
				this.usergroupId = "";
				this.allGroupChecked = true;
				sessionStorage.removeItem("groupId")
				var that = this;
				this.$http.get("http://localhost:3000/jeic/api/answerResult/getAnswerByRecordId?recordId=" + this.changeId +
					'&type=1' + '&teachinggroupId=' + this.groupId).then(function(res) {

					var tishuliangnum = [];
					var banjibaifenbi = [];
					var averagelv = 0
					var chushu = res.data.data.length;
					that.tableData = res.data.data
					for (var i = 0; i < res.data.data.length; i++) {
						banjibaifenbi.push(res.data.data[i].accuracy);
						tishuliangnum.push(i + 1 + "题")
						averagelv = averagelv + parseFloat(res.data.data[i].accuracy);
					}
					that.averagelv2 = (averagelv / chushu).toFixed(2);
					that.displayChart(tishuliangnum, banjibaifenbi)
				});

				// 获取已答题和未答题人数
				this.$http.get("http://127.0.0.1:3000/jeic/api/answerResult/getDataGroupByUser?recordId=" + this.changeId +
					'&type=' + this.model + '&teachinggroupId=' + this.groupId).then(function(res) {

					that.haveTheAnswerCount = res.data.data.haveTheAnswerCount
					that.notTheAnswerCount = res.data.data.notTheAnswerCount
				});

			},

			//切换btn柱状图的班级图表
			switchTab: function(data) {
				if (data == 'showTable') {
					sessionStorage.setItem("switchTab","table")
					this.$router.push({
						path: '/AnswerStatistics',
						query: {
							tab: 'column',
							changeTab: true,
							usergroupId: this.usergroupId
						}
					})

				} else if (data == 'showPic') {
					sessionStorage.setItem("switchTab","column")
					this.$router.push({
						path: '/AnswerStatistics',
						query: {
							tab: 'table',
							changeTab: false,
							usergroupId: this.usergroupId
						}
					})
				}
			},
			getQuestionNum: function(num) {
				var switchTab = sessionStorage.getItem("switchTab")
				this.$router.push({
					name: 'singleStatistics',
					params: {
						id: num,
						tab:switchTab,
						changeTab:true,
						usergroupId:this.usergroupId
					},
				})
			},
			rankingStatistics: function() {
				var switchTab = sessionStorage.getItem("switchTab")
				if(this.usergroupId=="" || this.usergroupId==undefined){
					this.$router.push({
						name: 'rankingStatistics',
						params: {
							tab:switchTab,
							changeTab:true,
							usergroupId:this.usergroupId
						},
					})
				}else{
					var switchTab = sessionStorage.getItem("switchTab")
					this.$router.push({
						name: 'getGroupStudentRange',
						params: {
							id: this.usergroupId,
							tab:switchTab,
							changeTab:true
						},
					})
				}
			},
			//chart图表
			displayChart: function(dataX, dataY) {
				let myChart = this.$echarts.init(this.$refs.container2);
				var option = {
					title: {
						text: '正确率统计图表',
						textStyle: {
							fontWeight: 'bold', //标题颜色
							color: '#eee',
							fontSize: 20
						},
						subtext: '',
						x: 'center'
					},
					xAxis: {
						type: 'category',
						data: dataX,
						axisLine: {
							lineStyle: {
								type: 'solid',
								color: '#fff', //左边线的颜色
								width: '2' //坐标线的宽度
							}
						},
						axisLabel: {
							show: true,
							rotate: 45,
							textStyle: {
								color: '#eee',
								fontSize: 24
							},

						}
					},
					yAxis: {
						type: 'value',
						axisLine: {
							show: true
						},
						splitLine: {
							show: true
						},
						axisLabel: {
							show:true,
							formatter: '{value}%',
							textStyle: {
								color: '#eee',
								fontSize: 24
							}
						}
					},
					series: [{
						data: dataY,
						type: 'bar',
						itemStyle: {
							normal: {
								color: function(params) {
									var colorList = ['#78b1e7'];
									//若返回的list长度不足，不足部分自动显示为最后一个颜色
									return colorList[params.dataIndex]
								},
								label: {
									show: false,
									position: 'top',
									textStyle: { //数值样式
										color: 'white',
										fontSize: 26,
									}
								},
								textStyle: { //数值样式
									color: '#fff',
									fontSize: 26
								}
							}
						}
					}]
				};

				myChart.setOption(option);
				var that = this;
				myChart.on('click', function(params) {
					that.$router.push({
						name: 'singleStatistics',
						params: {
							id: params.dataIndex+1,
							tab:'column',
							changeTab:false,
							usergroupId:that.usergroupId
						},
					})
				});
			}
		},
		created() {
			if (this.text) {
				this.changeId = this.eachRecordId;
			
			} else {
				this.changeId = this.recordId;
			
			}
			
			if(sessionStorage.getItem("groupId")){
				var that = this;
				this.$http.get("http://localhost:3000/jeic/api/answerResult/getAnswerByRecordId?recordId=" + this.changeId +
					'&type=1' + '&teachinggroupId=' + this.groupId + '&usergroupId=' + sessionStorage.getItem("groupId")).then(function(res) {
					var tishuliangnum = [];
					var banjibaifenbi = [];
					var averagelv = 0
					var chushu = res.data.data.length;
					that.tableData = res.data.data
					for (var i = 0; i < res.data.data.length; i++) {
						banjibaifenbi.push(res.data.data[i].accuracy);
						tishuliangnum.push(i + 1 + "题")
						averagelv = averagelv + parseFloat(res.data.data[i].accuracy);
					}
					that.averagelv2 = (averagelv / chushu).toFixed(2);
					that.displayChart(tishuliangnum, banjibaifenbi)
				});
				this.$http.get("http://127.0.0.1:3000/jeic/api/answerResult/getDataGroupByUser?recordId=" + this.changeId +
					'&type=' + this.model + '&usergroupId=' + sessionStorage.getItem("groupId") + '&teachinggroupId=' + this.groupId).then(function(res) {
					that.haveTheAnswerCount = res.data.data.haveTheAnswerCount
					that.notTheAnswerCount = res.data.data.notTheAnswerCount
				});
				
				//获取分组学生
				this.$http.get("http://127.0.0.1:3000/jeic/api/teachingGroup/" + this.groupId).then(function(
					res) {
					if (res.data.ret == 200) {
						that.groupStudent = res.data.data.userGrouplist;
					};
				});
			}else{
				var that = this;
				this.$http.get("http://localhost:3000/jeic/api/answerResult/getAnswerByRecordId?recordId=" + this.changeId +
					'&type=1' + '&teachinggroupId=' + this.groupId).then(function(res) {
					var tishuliangnum = [];
					var banjibaifenbi = [];
					var averagelv = 0
					var chushu = res.data.data.length;
					that.tableData = res.data.data
					for (var i = 0; i < res.data.data.length; i++) {
						banjibaifenbi.push(res.data.data[i].accuracy);
						tishuliangnum.push(i + 1 + "题")
						averagelv = averagelv + parseFloat(res.data.data[i].accuracy);
					}
					that.averagelv2 = (averagelv / chushu).toFixed(2);
					that.displayChart(tishuliangnum, banjibaifenbi)
				});
				
				//获取分组学生
				this.$http.get("http://127.0.0.1:3000/jeic/api/teachingGroup/" + this.groupId).then(function(
					res) {
					if (res.data.ret == 200) {
						that.groupStudent = res.data.data.userGrouplist;
					};
				});
				
				// 获取已答题和未答题人数
				this.$http.get("http://127.0.0.1:3000/jeic/api/answerResult/getDataGroupByUser?recordId=" + this.changeId + '&type=' +
					this.model + '&teachinggroupId=' + this.groupId).then(function(res) {
					that.haveTheAnswerCount = res.data.data.haveTheAnswerCount
					that.notTheAnswerCount = res.data.data.notTheAnswerCount
				});
			}
		},

		mounted() {
			this.$route.query.tab =this.$route.params.tab;
			this.$route.query.changeTab = this.$route.params.changeTab;
			this.usergroupId = this.$route.params.usergroupId;
			if(this.usergroupId==0||this.usergroupId==''||this.usergroupId==undefined){
				this.cancelbtn=true;
			}else{
				this.cancelbtn=false;
			}
			this.displayChart()
		}
	}
</script>

<style scoped>
	.wrapper {
		position: relative;
		z-index: 4;
		width: 100%;
		height: 100%;
	}

	.backLast {
		background: none;
		color: #fff;
		border: 0;
		font-size: 3rem;
		position: absolute;
		bottom: 3rem;
		left: 3rem;
	}

	.fzleft p button {
		width: 7rem;
		height: 2.6rem;
		background: #fff;
		border: 0;
		color: #000;
		outline: none;
		border-radius: .5rem;
		box-shadow: 0px 1px 13px #5f5d5d;
		font-size: 1.2rem;
		margin: 3rem 0 1rem .8rem;
	}

	.active {
		background: #fe9c02 !important;
		color: #fff !important;
	}

	.fzleft>ul>li {
		display: inline-block;
		width: 7rem;
		height: 2.6rem;
		background: #fff;
		border: 0;
		color: #101010;
		border-radius: .5rem;
		font-size: 1.2rem;
		margin: 1rem .8rem;
		text-align: center;
		line-height: 2.6rem;
		cursor: pointer;
	}

	.fzleft {
		width: 20.3rem;
		height: 100%;
		background: #78b1e8;
		float: left;
		box-sizing: border-box;
		padding:0 1.5rem;
	}

	.closefullscreen {
		position: absolute;
		top: -1px;
		right: 0;
		width: auto;
		height: auto;
		display: inline-block;
		background: transparent;
		box-shadow: none;
		border-radius: 0;
		border: 0;
		z-index: 999;
	}

	.colorfff {
		color: #fff;
	}

	.exitResTc {
		font-size: 3rem !important;
		opacity: 1;
		cursor: pointer;
	}

	.getClasstjtc {
		background: rgb(137, 137, 137);
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		margin: 0 auto;
	}

	.getClasstjtc>.tcContent {
		width: 100%;
		min-height: 30rem;
		height: 100%;
		background: rgb(82, 86, 89);
		color: #fff;
		text-align: left;
	}

	.menberight {
		width: calc(100% - 20.3rem);
		height: 100%;
		float: left;
	}

	.pingjuntrue {
		width: 20%;
		float: right;
		padding: 14% 1%;
		height: 100%;
		box-sizing: border-box;
	}

	.banjiuldati li {
		margin: 2rem 0;
	}

	.banjiuldati {
		padding: 2%;
		box-sizing: content-box;
		font-size: 1.4rem;
	}

	.pingjunzitiset {
		text-align: center;
		font-size: 3.2rem;
		font-weight: bold;
		color: #FFC107;
		margin: 2rem 0;
	}

	.classtableset {
		width: 79%;
		height: 100%;
		float: left;
		margin-left: 1%;
	}

	.paichangetable {
		width: 100%;
		height: 80%;
		margin-top: 2rem;
		overflow-y: auto;
		background: #C7EDCC;
		border-bottom-left-radius: 1%;
		border-bottom-right-radius: 1%;
		border-top-left-radius: 1%;
		border-top-right-radius: 1%;
	}
	
	.paichangetable table>thead{
		    border-top-left-radius: 1%;
		    border-top-right-radius: 1%;
	}

	.studentScoce tbody tr td {
		border-top: .1rem solid #d0d0d0;
	}

	.studentScoce {
		width: 100%;
		border-collapse: separate;
		color: #222;
		/* margin: 2rem auto; */
		font-size: 1.6rem;
	}

	.studentScoce thead tr th {
		text-align: center;
		height: 4rem;
		line-height: 4rem;
		background: #C7EDCC;
	}

	.studentScoce thead tr th:nth-child(1) {
		cursor: pointer;
	}

	.studentScoce thead tr th:nth-child(3) {
		cursor: pointer;
	}

	.studentScoce tbody tr td {
		text-align: center;
		height: 4rem;
		line-height: 4rem;
	}

	.studentScoce tbody tr {
		background: #C7EDCC;
	}

	.tihaodianji {
		cursor: pointer;
		color: #2196F3 !important;
		font-weight: bold;
		background: #C7EDCC;
		border-right: .1rem solid #eae8e8;
	}

	.paichange {
		display: block;
		width: 100%;
		height: 80%;
		margin-top: 2rem;
	}

	#switchPai,
	#studentResultbtn,
	.fanhuipai {
		display: inline-block;
		width: 15rem;
		margin: 1rem auto;
		height: 3.6rem;
		line-height: 3.6rem;
		border-radius: .8rem;
		color: #57e4c0;
		cursor: pointer;
		font-size: 1.6rem;
	}

	#studentResultbtn {
		margin-left: 20px;
	}

	.lvsebtn {
		border: .1rem solid #57e4c0;
		box-shadow: 0 0 0 0 #607D8B;
	}
</style>
