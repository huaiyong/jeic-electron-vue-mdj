<template>
	<div class="mlh_wrapper">
		<div class="mlh_singleTest">
			<!-- 柱状图 -->
			<div class="mlh_zhutuabcd">
				<div id="myChart" style="width:100%;height:60%;"></div>
				<!--   选项人数  -->
			</div>

			<!-- 试题讲解 -->
			<div class="mlh_studentDatirenshu">
				<div class="mlh_tihaotcset">
					<div class="mlh_tiganul">
						<div>
							<div v-if="sttype=='1'" class="zmj_answerType">判断</div>
							<div v-if="sttype=='2'" class="zmj_answerType">单选</div>
							<div v-if="sttype=='4'" class="zmj_answerType">多选</div>
							<div v-if="type==1">
								<p class="wx_tigan" v-html="tigan"></p>
								<ul class="mlh_xuanxianguloption">
									<li v-if="stlist.text.length!=0" v-for="stlist in stlists" v-html="stlist.text"></li>
								</ul>
							</div>
							<div v-if="type==3">
								<img :src="getResourceUrl" alt="">
							</div>
						</div>
					</div>
					<div class="wx_selectkuang" v-show="clickEcharts">
						<div v-if="answerType==1">
							<p class="mlh_slectStrcolor"><span class="mlh_xuanxiangkuang" v-html="xuanxiang"></span>选项：</p>
							<ul class="mlh_xuanxiangullist">
								<li v-for="stulist in stulists">{{stulist.realname}}</li>
							</ul>
						</div>
						<div v-if="answerType==3" class="mlh_stuList">
							<p class="mlh_slectStrcolor"><span class="mlh_xuanxiangkuang" v-html="xuanxiang"></span>选项：</p>
							<ul class="mlh_xuanxiangullist">
								<li v-for="stulist in stulists">
									<b>{{stulist.userGroupName}}</b>
									<ul style="display: inline-block;vertical-align: text-top;">
										<li style="display: inline-block;" v-for="name in stulist.userList">{{name.realname}}</li>
									</ul>
								</li>
							</ul>
						</div>
						<div v-if="answerType==2" class="mlh_stuList">
							<p class="mlh_slectStrcolor"><span class="mlh_xuanxiangkuang" v-html="xuanxiang"></span>选项：</p>
							<ul class="mlh_xuanxiangullist">
								<li v-for="stulist in stulists">
									{{stulist.userGroupName}}
								</li>
							</ul>
						</div>
					</div>
				</div>

				<div class="zmj_answerItem clearfix" style="position: fixed;bottom: 20px;font-size: 2rem;">
					<div class="change">
						<i class="iconfont icon-zuojiantou" @click="prevTest()" v-show="tihao>1"></i>
						<span>第<i v-text="tihao"></i>题</span>
						<i class="iconfont icon-youjiantou" @click="nextTest()" v-show="tihao<total"></i>
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
		name: "recordSingleStatistics",
		data() {
			return {
				stlists: [], //试题选项
				tigan: "",
				sttype: "",
				tihao: 0,
				total: 0,
				clickEcharts: false,
				xuanxiang: "",
				stulists: [],
				stulistsA: [],
				stulistsB: [],
				stulistsC: [],
				stulistsD: [],
				stulistsE: [],
				stulistsF: [],
				stulistsG: [],
				stulistsH: [],
				stulistsI: [],
				stulistsJ: [],
				stulistsYES: [],
				stulistsNO: [],
				optionNu: 0,
				getResourceUrl: '',
				switchTab: ''
			}
		},
		mounted() {
			this.getParams();
			var that = this;
			$(".mlh_tiganul").on("click", "img", function() {
				var imgSrc = $(this).attr("src");
				that.lookImg(imgSrc);
			});
		},
		created() {
			this.getParams()
		},
		computed: {
			...mapState({
				resourceId: state => state.state.resourceId,
				pattern: state => state.state.pattern,
				recordId: state => state.state.recordId,
				model: state => state.state.model,
				groupId: state => state.state.groupId,
				answerType: state => state.state.answerType,
				eachRecordId: state => state.state.eachRecordId,
				testType: state => state.state.testType,
				type: state => state.state.type,
				resourceUrl: state => state.state.resourceUrl,
				teachingGroupId: state => state.state.teachingGroupId
			})
		},
		sockets: {
			prevQuestionStatistics() { //上一题
				this.prevTest()
			},
			nextQuestionStatistics() { //下一题
				this.nextTest()
			},
			fanhui() {
				this.back();
			},
			A() {
				this.changOption("A")
			},
			B() {
				this.changOption("B")
			},
			C() {
				this.changOption("C")
			},
			D() {
				this.changOption("D")
			},
			E() {
				this.changOption("E")
			},
			F() {
				this.changOption("F")
			},
			G() {
				this.changOption("G")
			},
			H() {
				this.changOption("H")
			},
			I() {
				this.changOption("I")
			},
			J() {
				this.changOption("J")
			},
			YES() {
				this.changOption("YES")
			},
			NO() {
				this.changOption("NO")
			},
			dantishitijiangjieScroll(data) {
				var conheight = $(".mlh_tihaotcset").height();
				$(".mlh_studentDatirenshu").scrollTop(data * conheight);
			}
		},
		methods: {
			back() {
				var switchTab = sessionStorage.getItem("switchTab");
				if (sessionStorage.getItem("groupId") != null || sessionStorage.getItem("groupId") != undefined || sessionStorage.getItem(
						"groupId") != "") {
					var usergroupId = sessionStorage.getItem("groupId");
					this.$route.params.usergroupId = usergroupId;
				}
				if (this.$route.params.tab == "column") {
					this.$route.params.tab = 'column';
					this.$route.params.changeTab = false;
				} else if (this.$route.params.tab == "table" || switchTab == 'table') {
					this.$route.params.tab = 'table';
					this.$route.params.changeTab = true;
				} else {
					this.$route.params.tab = 'column';
					this.$route.params.changeTab = false;
				}
				this.$router.push({
					name: 'recordAnswerStatistics',
					params: {
						tab: this.$route.params.tab,
						changeTab: this.$route.params.changeTab,
						usergroupId: this.$route.params.usergroupId
					}
				})
			},
			lookImg(imgSrc) { //点击图片放大
				this.$router.push({
					name: 'picShow',
					query: {
						imgsrc: imgSrc,
						tab: this.$route.params.tab,
						usergroupId: this.$route.params.usergroupId
					}
				});
			},
			getResult() {
				const that = this;
				var xdata = [];
				var ydata = [];
				// 获取单道试题的答题结果
				this.$http.get("http://127.0.0.1:3000/jeic/api/answerResult/getDataByQuestionId?recordId=" + this.eachRecordId +
					"&type=" + this.answerType + "&datamark=" +
					this.tihao + "&teachinggroupId=" + this.teachingGroupId).then(function(res) {
					that.optionNu = res.data.data.optionNu;
					that.sttype = res.data.data.type;
					if (that.sttype != "1") {

						if (that.answerType == 1) { //全班教学不分组模式下

							if (that.optionNu == 1) {
								xdata = ["A"];
								ydata[0] = res.data.data.optionInfo.optionA.count;
								that.stulistsA = res.data.data.optionInfo.optionA.userList;
								that.drawLine(xdata, ydata)
							} else if (that.optionNu == 2) {
								xdata = ["A", "B"];
								ydata[0] = res.data.data.optionInfo.optionA.count;
								ydata[1] = res.data.data.optionInfo.optionB.count;
								that.stulistsA = res.data.data.optionInfo.optionA.userList;
								that.stulistsB = res.data.data.optionInfo.optionB.userList;
								that.drawLine(xdata, ydata)
							} else if (that.optionNu == 3) {
								xdata = ["A", "B", "C"];
								ydata[0] = res.data.data.optionInfo.optionA.count;
								ydata[1] = res.data.data.optionInfo.optionB.count;
								ydata[2] = res.data.data.optionInfo.optionC.count;
								that.stulistsA = res.data.data.optionInfo.optionA.userList;
								that.stulistsB = res.data.data.optionInfo.optionB.userList;
								that.stulistsC = res.data.data.optionInfo.optionC.userList;
								that.drawLine(xdata, ydata)
							} else if (that.optionNu == 4) {
								xdata = ["A", "B", "C", "D"];
								ydata[0] = res.data.data.optionInfo.optionA.count;
								ydata[1] = res.data.data.optionInfo.optionB.count;
								ydata[2] = res.data.data.optionInfo.optionC.count;
								ydata[3] = res.data.data.optionInfo.optionD.count;
								that.stulistsA = res.data.data.optionInfo.optionA.userList;
								that.stulistsB = res.data.data.optionInfo.optionB.userList;
								that.stulistsC = res.data.data.optionInfo.optionC.userList;
								that.stulistsD = res.data.data.optionInfo.optionD.userList;
								that.drawLine(xdata, ydata)
							} else if (that.optionNu == 5) {
								xdata = ["A", "B", "C", "D", "E"];
								ydata[0] = res.data.data.optionInfo.optionA.count;
								ydata[1] = res.data.data.optionInfo.optionB.count;
								ydata[2] = res.data.data.optionInfo.optionC.count;
								ydata[3] = res.data.data.optionInfo.optionD.count;
								ydata[4] = res.data.data.optionInfo.optionE.count;
								that.stulistsA = res.data.data.optionInfo.optionA.userList;
								that.stulistsB = res.data.data.optionInfo.optionB.userList;
								that.stulistsC = res.data.data.optionInfo.optionC.userList;
								that.stulistsD = res.data.data.optionInfo.optionD.userList;
								that.stulistsE = res.data.data.optionInfo.optionE.userList;
								that.drawLine(xdata, ydata)
							} else if (that.optionNu == 6) {
								xdata = ["A", "B", "C", "D", "E", "F"];
								ydata[0] = res.data.data.optionInfo.optionA.count;
								ydata[1] = res.data.data.optionInfo.optionB.count;
								ydata[2] = res.data.data.optionInfo.optionC.count;
								ydata[3] = res.data.data.optionInfo.optionD.count;
								ydata[4] = res.data.data.optionInfo.optionE.count;
								ydata[5] = res.data.data.optionInfo.optionF.count;
								that.stulistsA = res.data.data.optionInfo.optionA.userList;
								that.stulistsB = res.data.data.optionInfo.optionB.userList;
								that.stulistsC = res.data.data.optionInfo.optionC.userList;
								that.stulistsD = res.data.data.optionInfo.optionD.userList;
								that.stulistsE = res.data.data.optionInfo.optionE.userList;
								that.stulistsF = res.data.data.optionInfo.optionF.userList;
								that.drawLine(xdata, ydata)
							} else if (that.optionNu == 7) {
								xdata = ["A", "B", "C", "D", "E", "F", "G"];
								ydata[0] = res.data.data.optionInfo.optionA.count;
								ydata[1] = res.data.data.optionInfo.optionB.count;
								ydata[2] = res.data.data.optionInfo.optionC.count;
								ydata[3] = res.data.data.optionInfo.optionD.count;
								ydata[4] = res.data.data.optionInfo.optionE.count;
								ydata[5] = res.data.data.optionInfo.optionF.count;
								ydata[6] = res.data.data.optionInfo.optionG.count;
								that.stulistsA = res.data.data.optionInfo.optionA.userList;
								that.stulistsB = res.data.data.optionInfo.optionB.userList;
								that.stulistsC = res.data.data.optionInfo.optionC.userList;
								that.stulistsD = res.data.data.optionInfo.optionD.userList;
								that.stulistsE = res.data.data.optionInfo.optionE.userList;
								that.stulistsF = res.data.data.optionInfo.optionF.userList;
								that.stulistsG = res.data.data.optionInfo.optionG.userList;
								that.drawLine(xdata, ydata)
							} else if (that.optionNu == 8) {
								xdata = ["A", "B", "C", "D", "E", "F", "G", "H"];
								ydata[0] = res.data.data.optionInfo.optionA.count;
								ydata[1] = res.data.data.optionInfo.optionB.count;
								ydata[2] = res.data.data.optionInfo.optionC.count;
								ydata[3] = res.data.data.optionInfo.optionD.count;
								ydata[4] = res.data.data.optionInfo.optionE.count;
								ydata[5] = res.data.data.optionInfo.optionF.count;
								ydata[6] = res.data.data.optionInfo.optionG.count;
								ydata[7] = res.data.data.optionInfo.optionH.count;
								that.stulistsA = res.data.data.optionInfo.optionA.userList;
								that.stulistsB = res.data.data.optionInfo.optionB.userList;
								that.stulistsC = res.data.data.optionInfo.optionC.userList;
								that.stulistsD = res.data.data.optionInfo.optionD.userList;
								that.stulistsE = res.data.data.optionInfo.optionE.userList;
								that.stulistsF = res.data.data.optionInfo.optionF.userList;
								that.stulistsG = res.data.data.optionInfo.optionG.userList;
								that.stulistsH = res.data.data.optionInfo.optionH.userList;
								that.drawLine(xdata, ydata)
							} else if (that.optionNu == 9) {
								xdata = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
								ydata[0] = res.data.data.optionInfo.optionA.count;
								ydata[1] = res.data.data.optionInfo.optionB.count;
								ydata[2] = res.data.data.optionInfo.optionC.count;
								ydata[3] = res.data.data.optionInfo.optionD.count;
								ydata[4] = res.data.data.optionInfo.optionE.count;
								ydata[5] = res.data.data.optionInfo.optionF.count;
								ydata[6] = res.data.data.optionInfo.optionG.count;
								ydata[7] = res.data.data.optionInfo.optionH.count;
								ydata[8] = res.data.data.optionInfo.optionI.count;
								that.stulistsA = res.data.data.optionInfo.optionA.userList;
								that.stulistsB = res.data.data.optionInfo.optionB.userList;
								that.stulistsC = res.data.data.optionInfo.optionC.userList;
								that.stulistsD = res.data.data.optionInfo.optionD.userList;
								that.stulistsE = res.data.data.optionInfo.optionE.userList;
								that.stulistsF = res.data.data.optionInfo.optionF.userList;
								that.stulistsG = res.data.data.optionInfo.optionG.userList;
								that.stulistsH = res.data.data.optionInfo.optionH.userList;
								that.stulistsI = res.data.data.optionInfo.optionI.userList;
								that.drawLine(xdata, ydata)
							} else if (that.optionNu == 10) {
								xdata = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
								ydata[0] = res.data.data.optionInfo.optionA.count;
								ydata[1] = res.data.data.optionInfo.optionB.count;
								ydata[2] = res.data.data.optionInfo.optionC.count;
								ydata[3] = res.data.data.optionInfo.optionD.count;
								ydata[4] = res.data.data.optionInfo.optionE.count;
								ydata[5] = res.data.data.optionInfo.optionF.count;
								ydata[6] = res.data.data.optionInfo.optionG.count;
								ydata[7] = res.data.data.optionInfo.optionH.count;
								ydata[8] = res.data.data.optionInfo.optionI.count;
								ydata[9] = res.data.data.optionInfo.optionJ.count;
								that.stulistsA = res.data.data.optionInfo.optionA.userList;
								that.stulistsB = res.data.data.optionInfo.optionB.userList;
								that.stulistsC = res.data.data.optionInfo.optionC.userList;
								that.stulistsD = res.data.data.optionInfo.optionD.userList;
								that.stulistsE = res.data.data.optionInfo.optionE.userList;
								that.stulistsF = res.data.data.optionInfo.optionF.userList;
								that.stulistsG = res.data.data.optionInfo.optionG.userList;
								that.stulistsH = res.data.data.optionInfo.optionH.userList;
								that.stulistsI = res.data.data.optionInfo.optionI.userList;
								that.stulistsJ = res.data.data.optionInfo.optionJ.userList;
								that.drawLine(xdata, ydata)
							}
						} else if (that.answerType == 2) { //分组教学--组长模式
							if (that.optionNu == 1) {
								xdata = ["A"];
								ydata[0] = res.data.data.optionInfo.optionA.count;
								that.stulistsA = res.data.data.optionInfo.optionA.userList;
								that.drawLine(xdata, ydata)
							} else if (that.optionNu == 2) {
								xdata = ["A", "B"];
								ydata[0] = res.data.data.optionInfo.optionA.count;
								ydata[1] = res.data.data.optionInfo.optionB.count;
								that.stulistsA = res.data.data.optionInfo.optionA.userList;
								that.stulistsB = res.data.data.optionInfo.optionB.userList;
								that.drawLine(xdata, ydata)
							} else if (that.optionNu == 3) {
								xdata = ["A", "B", "C"];
								ydata[0] = res.data.data.optionInfo.optionA.count;
								ydata[1] = res.data.data.optionInfo.optionB.count;
								ydata[2] = res.data.data.optionInfo.optionC.count;
								that.stulistsA = res.data.data.optionInfo.optionA.userList;
								that.stulistsB = res.data.data.optionInfo.optionB.userList;
								that.stulistsC = res.data.data.optionInfo.optionC.userList;
								that.drawLine(xdata, ydata)
							} else if (that.optionNu == 4) {
								xdata = ["A", "B", "C", "D"];
								ydata[0] = res.data.data.optionInfo.optionA.count;
								ydata[1] = res.data.data.optionInfo.optionB.count;
								ydata[2] = res.data.data.optionInfo.optionC.count;
								ydata[3] = res.data.data.optionInfo.optionD.count;
								that.stulistsA = res.data.data.optionInfo.optionA.userList;
								that.stulistsB = res.data.data.optionInfo.optionB.userList;
								that.stulistsC = res.data.data.optionInfo.optionC.userList;
								that.stulistsD = res.data.data.optionInfo.optionD.userList;
								that.drawLine(xdata, ydata)
							} else if (that.optionNu == 5) {
								xdata = ["A", "B", "C", "D", "E"];
								ydata[0] = res.data.data.optionInfo.optionA.count;
								ydata[1] = res.data.data.optionInfo.optionB.count;
								ydata[2] = res.data.data.optionInfo.optionC.count;
								ydata[3] = res.data.data.optionInfo.optionD.count;
								ydata[4] = res.data.data.optionInfo.optionE.count;
								that.stulistsA = res.data.data.optionInfo.optionA.userList;
								that.stulistsB = res.data.data.optionInfo.optionB.userList;
								that.stulistsC = res.data.data.optionInfo.optionC.userList;
								that.stulistsD = res.data.data.optionInfo.optionD.userList;
								that.stulistsE = res.data.data.optionInfo.optionE.userList;
								that.drawLine(xdata, ydata)
							} else if (that.optionNu == 6) {
								xdata = ["A", "B", "C", "D", "E", "F"];
								ydata[0] = res.data.data.optionInfo.optionA.count;
								ydata[1] = res.data.data.optionInfo.optionB.count;
								ydata[2] = res.data.data.optionInfo.optionC.count;
								ydata[3] = res.data.data.optionInfo.optionD.count;
								ydata[4] = res.data.data.optionInfo.optionE.count;
								ydata[5] = res.data.data.optionInfo.optionF.count;
								that.stulistsA = res.data.data.optionInfo.optionA.userList;
								that.stulistsB = res.data.data.optionInfo.optionB.userList;
								that.stulistsC = res.data.data.optionInfo.optionC.userList;
								that.stulistsD = res.data.data.optionInfo.optionD.userList;
								that.stulistsE = res.data.data.optionInfo.optionE.userList;
								that.stulistsF = res.data.data.optionInfo.optionF.userList;
								that.drawLine(xdata, ydata)
							} else if (that.optionNu == 7) {
								xdata = ["A", "B", "C", "D", "E", "F", "G"];
								ydata[0] = res.data.data.optionInfo.optionA.count;
								ydata[1] = res.data.data.optionInfo.optionB.count;
								ydata[2] = res.data.data.optionInfo.optionC.count;
								ydata[3] = res.data.data.optionInfo.optionD.count;
								ydata[4] = res.data.data.optionInfo.optionE.count;
								ydata[5] = res.data.data.optionInfo.optionF.count;
								ydata[6] = res.data.data.optionInfo.optionG.count;
								that.stulistsA = res.data.data.optionInfo.optionA.userList;
								that.stulistsB = res.data.data.optionInfo.optionB.userList;
								that.stulistsC = res.data.data.optionInfo.optionC.userList;
								that.stulistsD = res.data.data.optionInfo.optionD.userList;
								that.stulistsE = res.data.data.optionInfo.optionE.userList;
								that.stulistsF = res.data.data.optionInfo.optionF.userList;
								that.stulistsG = res.data.data.optionInfo.optionG.userList;
								that.drawLine(xdata, ydata)
							} else if (that.optionNu == 8) {
								xdata = ["A", "B", "C", "D", "E", "F", "G", "H"];
								ydata[0] = res.data.data.optionInfo.optionA.count;
								ydata[1] = res.data.data.optionInfo.optionB.count;
								ydata[2] = res.data.data.optionInfo.optionC.count;
								ydata[3] = res.data.data.optionInfo.optionD.count;
								ydata[4] = res.data.data.optionInfo.optionE.count;
								ydata[5] = res.data.data.optionInfo.optionF.count;
								ydata[6] = res.data.data.optionInfo.optionG.count;
								ydata[7] = res.data.data.optionInfo.optionH.count;
								that.stulistsA = res.data.data.optionInfo.optionA.userList;
								that.stulistsB = res.data.data.optionInfo.optionB.userList;
								that.stulistsC = res.data.data.optionInfo.optionC.userList;
								that.stulistsD = res.data.data.optionInfo.optionD.userList;
								that.stulistsE = res.data.data.optionInfo.optionE.userList;
								that.stulistsF = res.data.data.optionInfo.optionF.userList;
								that.stulistsG = res.data.data.optionInfo.optionG.userList;
								that.stulistsH = res.data.data.optionInfo.optionH.userList;
								that.drawLine(xdata, ydata)
							} else if (that.optionNu == 9) {
								xdata = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
								ydata[0] = res.data.data.optionInfo.optionA.count;
								ydata[1] = res.data.data.optionInfo.optionB.count;
								ydata[2] = res.data.data.optionInfo.optionC.count;
								ydata[3] = res.data.data.optionInfo.optionD.count;
								ydata[4] = res.data.data.optionInfo.optionE.count;
								ydata[5] = res.data.data.optionInfo.optionF.count;
								ydata[6] = res.data.data.optionInfo.optionG.count;
								ydata[7] = res.data.data.optionInfo.optionH.count;
								ydata[8] = res.data.data.optionInfo.optionI.count;
								that.stulistsA = res.data.data.optionInfo.optionA.userList;
								that.stulistsB = res.data.data.optionInfo.optionB.userList;
								that.stulistsC = res.data.data.optionInfo.optionC.userList;
								that.stulistsD = res.data.data.optionInfo.optionD.userList;
								that.stulistsE = res.data.data.optionInfo.optionE.userList;
								that.stulistsF = res.data.data.optionInfo.optionF.userList;
								that.stulistsG = res.data.data.optionInfo.optionG.userList;
								that.stulistsH = res.data.data.optionInfo.optionH.userList;
								that.stulistsI = res.data.data.optionInfo.optionI.userList;
								that.drawLine(xdata, ydata)
							} else if (that.optionNu == 10) {
								xdata = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
								ydata[0] = res.data.data.optionInfo.optionA.count;
								ydata[1] = res.data.data.optionInfo.optionB.count;
								ydata[2] = res.data.data.optionInfo.optionC.count;
								ydata[3] = res.data.data.optionInfo.optionD.count;
								ydata[4] = res.data.data.optionInfo.optionE.count;
								ydata[5] = res.data.data.optionInfo.optionF.count;
								ydata[6] = res.data.data.optionInfo.optionG.count;
								ydata[7] = res.data.data.optionInfo.optionH.count;
								ydata[8] = res.data.data.optionInfo.optionI.count;
								ydata[9] = res.data.data.optionInfo.optionJ.count;
								that.stulistsA = res.data.data.optionInfo.optionA.userList;
								that.stulistsB = res.data.data.optionInfo.optionB.userList;
								that.stulistsC = res.data.data.optionInfo.optionC.userList;
								that.stulistsD = res.data.data.optionInfo.optionD.userList;
								that.stulistsE = res.data.data.optionInfo.optionE.userList;
								that.stulistsF = res.data.data.optionInfo.optionF.userList;
								that.stulistsG = res.data.data.optionInfo.optionG.userList;
								that.stulistsH = res.data.data.optionInfo.optionH.userList;
								that.stulistsI = res.data.data.optionInfo.optionI.userList;
								that.stulistsJ = res.data.data.optionInfo.optionJ.userList;
								that.drawLine(xdata, ydata)
							}

						} else if (that.answerType == 3) { //分组教学--全组模式

							if (that.optionNu == 1) {
								xdata = ["A"];
								ydata[0] = res.data.data.optionInfo.optionA.count;
								that.stulistsA = res.data.data.optionInfo.optionA.usergroupList;
								that.drawLine(xdata, ydata)
							} else if (that.optionNu == 2) {
								xdata = ["A", "B"];
								ydata[0] = res.data.data.optionInfo.optionA.count;
								ydata[1] = res.data.data.optionInfo.optionB.count;
								that.stulistsA = res.data.data.optionInfo.optionA.usergroupList;
								that.stulistsB = res.data.data.optionInfo.optionB.usergroupList;
								that.drawLine(xdata, ydata)
							} else if (that.optionNu == 3) {
								xdata = ["A", "B", "C"];
								ydata[0] = res.data.data.optionInfo.optionA.count;
								ydata[1] = res.data.data.optionInfo.optionB.count;
								ydata[2] = res.data.data.optionInfo.optionC.count;
								that.stulistsA = res.data.data.optionInfo.optionA.usergroupList;
								that.stulistsB = res.data.data.optionInfo.optionB.usergroupList;
								that.stulistsC = res.data.data.optionInfo.optionC.usergroupList;
								that.drawLine(xdata, ydata)
							} else if (that.optionNu == 4) {
								xdata = ["A", "B", "C", "D"];
								ydata[0] = res.data.data.optionInfo.optionA.count;
								ydata[1] = res.data.data.optionInfo.optionB.count;
								ydata[2] = res.data.data.optionInfo.optionC.count;
								ydata[3] = res.data.data.optionInfo.optionD.count;
								that.stulistsA = res.data.data.optionInfo.optionA.usergroupList;
								that.stulistsB = res.data.data.optionInfo.optionB.usergroupList;
								that.stulistsC = res.data.data.optionInfo.optionC.usergroupList;
								that.stulistsD = res.data.data.optionInfo.optionD.usergroupList;
								that.drawLine(xdata, ydata)
							} else if (that.optionNu == 5) {
								xdata = ["A", "B", "C", "D", "E"];
								ydata[0] = res.data.data.optionInfo.optionA.count;
								ydata[1] = res.data.data.optionInfo.optionB.count;
								ydata[2] = res.data.data.optionInfo.optionC.count;
								ydata[3] = res.data.data.optionInfo.optionD.count;
								ydata[4] = res.data.data.optionInfo.optionE.count;
								that.stulistsA = res.data.data.optionInfo.optionA.usergroupList;
								that.stulistsB = res.data.data.optionInfo.optionB.usergroupList;
								that.stulistsC = res.data.data.optionInfo.optionC.usergroupList;
								that.stulistsD = res.data.data.optionInfo.optionD.usergroupList;
								that.stulistsE = res.data.data.optionInfo.optionE.usergroupList;
								that.drawLine(xdata, ydata)
							} else if (that.optionNu == 6) {
								xdata = ["A", "B", "C", "D", "E", "F"];
								ydata[0] = res.data.data.optionInfo.optionA.count;
								ydata[1] = res.data.data.optionInfo.optionB.count;
								ydata[2] = res.data.data.optionInfo.optionC.count;
								ydata[3] = res.data.data.optionInfo.optionD.count;
								ydata[4] = res.data.data.optionInfo.optionE.count;
								ydata[5] = res.data.data.optionInfo.optionF.count;
								that.stulistsA = res.data.data.optionInfo.optionA.usergroupList;
								that.stulistsB = res.data.data.optionInfo.optionB.usergroupList;
								that.stulistsC = res.data.data.optionInfo.optionC.usergroupList;
								that.stulistsD = res.data.data.optionInfo.optionD.usergroupList;
								that.stulistsE = res.data.data.optionInfo.optionE.usergroupList;
								that.stulistsF = res.data.data.optionInfo.optionF.usergroupList;
								that.drawLine(xdata, ydata)
							} else if (that.optionNu == 7) {
								xdata = ["A", "B", "C", "D", "E", "F", "G"];
								ydata[0] = res.data.data.optionInfo.optionA.count;
								ydata[1] = res.data.data.optionInfo.optionB.count;
								ydata[2] = res.data.data.optionInfo.optionC.count;
								ydata[3] = res.data.data.optionInfo.optionD.count;
								ydata[4] = res.data.data.optionInfo.optionE.count;
								ydata[5] = res.data.data.optionInfo.optionF.count;
								ydata[6] = res.data.data.optionInfo.optionG.count;
								that.stulistsA = res.data.data.optionInfo.optionA.usergroupList;
								that.stulistsB = res.data.data.optionInfo.optionB.usergroupList;
								that.stulistsC = res.data.data.optionInfo.optionC.usergroupList;
								that.stulistsD = res.data.data.optionInfo.optionD.usergroupList;
								that.stulistsE = res.data.data.optionInfo.optionE.usergroupList;
								that.stulistsF = res.data.data.optionInfo.optionF.usergroupList;
								that.stulistsG = res.data.data.optionInfo.optionG.usergroupList;
								that.drawLine(xdata, ydata)
							} else if (that.optionNu == 8) {
								xdata = ["A", "B", "C", "D", "E", "F", "G", "H"];
								ydata[0] = res.data.data.optionInfo.optionA.count;
								ydata[1] = res.data.data.optionInfo.optionB.count;
								ydata[2] = res.data.data.optionInfo.optionC.count;
								ydata[3] = res.data.data.optionInfo.optionD.count;
								ydata[4] = res.data.data.optionInfo.optionE.count;
								ydata[5] = res.data.data.optionInfo.optionF.count;
								ydata[6] = res.data.data.optionInfo.optionG.count;
								ydata[7] = res.data.data.optionInfo.optionH.count;
								that.stulistsA = res.data.data.optionInfo.optionA.usergroupList;
								that.stulistsB = res.data.data.optionInfo.optionB.usergroupList;
								that.stulistsC = res.data.data.optionInfo.optionC.usergroupList;
								that.stulistsD = res.data.data.optionInfo.optionD.usergroupList;
								that.stulistsE = res.data.data.optionInfo.optionE.usergroupList;
								that.stulistsF = res.data.data.optionInfo.optionF.usergroupList;
								that.stulistsG = res.data.data.optionInfo.optionG.usergroupList;
								that.stulistsH = res.data.data.optionInfo.optionH.usergroupList;
								that.drawLine(xdata, ydata)
							} else if (that.optionNu == 9) {
								xdata = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
								ydata[0] = res.data.data.optionInfo.optionA.count;
								ydata[1] = res.data.data.optionInfo.optionB.count;
								ydata[2] = res.data.data.optionInfo.optionC.count;
								ydata[3] = res.data.data.optionInfo.optionD.count;
								ydata[4] = res.data.data.optionInfo.optionE.count;
								ydata[5] = res.data.data.optionInfo.optionF.count;
								ydata[6] = res.data.data.optionInfo.optionG.count;
								ydata[7] = res.data.data.optionInfo.optionH.count;
								ydata[8] = res.data.data.optionInfo.optionI.count;
								that.stulistsA = res.data.data.optionInfo.optionA.usergroupList;
								that.stulistsB = res.data.data.optionInfo.optionB.usergroupList;
								that.stulistsC = res.data.data.optionInfo.optionC.usergroupList;
								that.stulistsD = res.data.data.optionInfo.optionD.usergroupList;
								that.stulistsE = res.data.data.optionInfo.optionE.usergroupList;
								that.stulistsF = res.data.data.optionInfo.optionF.usergroupList;
								that.stulistsG = res.data.data.optionInfo.optionG.usergroupList;
								that.stulistsH = res.data.data.optionInfo.optionH.usergroupList;
								that.stulistsI = res.data.data.optionInfo.optionI.usergroupList;
								that.drawLine(xdata, ydata)
							} else if (that.optionNu == 10) {
								xdata = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
								ydata[0] = res.data.data.optionInfo.optionA.count;
								ydata[1] = res.data.data.optionInfo.optionB.count;
								ydata[2] = res.data.data.optionInfo.optionC.count;
								ydata[3] = res.data.data.optionInfo.optionD.count;
								ydata[4] = res.data.data.optionInfo.optionE.count;
								ydata[5] = res.data.data.optionInfo.optionF.count;
								ydata[6] = res.data.data.optionInfo.optionG.count;
								ydata[7] = res.data.data.optionInfo.optionH.count;
								ydata[8] = res.data.data.optionInfo.optionI.count;
								ydata[9] = res.data.data.optionInfo.optionJ.count;
								that.stulistsA = res.data.data.optionInfo.optionA.usergroupList;
								that.stulistsB = res.data.data.optionInfo.optionB.usergroupList;
								that.stulistsC = res.data.data.optionInfo.optionC.usergroupList;
								that.stulistsD = res.data.data.optionInfo.optionD.usergroupList;
								that.stulistsE = res.data.data.optionInfo.optionE.usergroupList;
								that.stulistsF = res.data.data.optionInfo.optionF.usergroupList;
								that.stulistsG = res.data.data.optionInfo.optionG.usergroupList;
								that.stulistsH = res.data.data.optionInfo.optionH.usergroupList;
								that.stulistsI = res.data.data.optionInfo.optionI.usergroupList;
								that.stulistsJ = res.data.data.optionInfo.optionJ.usergroupList;
								that.drawLine(xdata, ydata)
							}
						}


					} else {
						if (that.answerType == 1 || that.answerType == 2) {
							xdata = ["YES", "NO"];
							ydata[0] = res.data.data.optionInfo.optionYES.count;
							ydata[1] = res.data.data.optionInfo.optionNO.count;
							that.stulistsYES = res.data.data.optionInfo.optionYES.userList;
							that.stulistsNO = res.data.data.optionInfo.optionNO.userList;
							that.drawLine(xdata, ydata)
						} else {
							xdata = ["YES", "NO"];
							ydata[0] = res.data.data.optionInfo.optionYES.count;
							ydata[1] = res.data.data.optionInfo.optionNO.count;
							that.stulistsYES = res.data.data.optionInfo.optionYES.usergroupList;
							that.stulistsNO = res.data.data.optionInfo.optionNO.usergroupList;
							that.drawLine(xdata, ydata)
						}
					}
				});
				if (this.type == 1) {
					// 获取试题
					this.$http.get(this.configure.resourceIp + '/teacher/import/getQuestionInfo.do?hid=' + this.resourceId + '&sort=' +
						this.tihao).then(
						function(res) {
							if (res.data.ret == 200) {
								that.stlists = res.data.data.data[0].option; //试题选项ABCD....
								that.tigan = res.data.data.data[0].body; //题干....
								that.total = res.data.data.total; //总题数
							};
						});
				}
			},
			getParams() {
				var routerParams = this.$route.params.id; // 取到路由带过来的参数 
				this.getResourceUrl = this.resourceUrl;
				this.tihao = routerParams; // 将数据放在当前组件的数据内
				if (this.tihao != undefined) {
					this.getResult()
				}
			},
			prevTest() {
				this.tihao = this.tihao - 1;
				this.$route.params.tab = 'table';
				this.switchTab = sessionStorage.getItem("switchTab")
				const that = this;
				that.clickEcharts = false;
				this.getResult()
			},
			nextTest() {
				this.tihao = parseInt(this.tihao) + 1;
				this.switchTab = sessionStorage.getItem("switchTab")
				const that = this;
				that.clickEcharts = false;
				this.getResult()
			},
			changOption(params) {
				var that = this
				that.xuanxiang = params;
				that.clickEcharts = true;
				that.stulists = [];
				if (params == "A") {
					that.stulists = that.stulistsA;
				} else if (params == "B") {
					that.stulists = that.stulistsB;
				} else if (params == "C") {
					that.stulists = that.stulistsC;
				} else if (params == "D") {
					that.stulists = that.stulistsD;
				} else if (params == "E") {
					that.stulists = that.stulistsE;
				} else if (params == "F") {
					that.stulists = that.stulistsF;
				} else if (params == "G") {
					that.stulists = that.stulistsG;
				} else if (params == "H") {
					that.stulists = that.stulistsH;
				} else if (params == "I") {
					that.stulists = that.stulistsI;
				} else if (params == "J") {
					that.stulists = that.stulistsJ;
				} else if (params == "YES") {
					that.stulists = that.stulistsYES;
				} else if (params == "NO") {
					that.stulists = that.stulistsNO;
				}
			},
			drawLine(x, y) {
				// 基于准备好的dom，初始化echarts实例
				let myChart = this.$echarts.init(document.getElementById('myChart'))
				var option = {
					title: {
						text: ''
					},
					tooltip: {},
					xAxis: {
						data: x,
						triggerEvent: true,
						axisLine: {
							lineStyle: {
								type: 'solid',
								color: '#fff', //左边线的颜色
								width: '2' //坐标线的宽度
							}
						},
						axisTick: {
							alignWithLabel: true //坐标值是否在刻度中间
						},
						axisLabel: {
							show: true,
							textStyle: {
								color: '#e5e5e5',
								fontSize: 30
							}
						}
					},
					yAxis: {
						minInterval: 1, //y轴显示整数
						axisLine: {
							show: false
						},
						// axisTick: {show:false},
						splitLine: {
							show: false
						},
						axisLabel: {
							show: false,
							formatter: '{value}',
							textStyle: {
								color: '#e5e5e5',
								fontSize: 26
							}
						}
					},
					series: {
						name: '选项',
						type: 'bar',
						data: y,
						itemStyle: {
							normal: {
								color: function(params) {
									var colorList = ['#78b1e7'];
									//若返回的list长度不足，不足部分自动显示为最后一个颜色
									return colorList[params.dataIndex]
								},
								label: {
									show: true,
									position: 'top',
									textStyle: { //数值样式
										color: 'white',
										fontSize: 16
									}
								},
								textStyle: { //数值样式
									color: '#fff',
									fontSize: 26
								}
							}
						}
					}
				};

				// 绘制图表
				myChart.setOption(option);
				// 点击A\B\C\D
				const that = this;
				myChart.on('click', function(params) {
					// that.changOption(params.name)
					if (params.name == undefined) {
						that.changOption(params.value)
					} else {
						that.changOption(params.name)
					}
				});
			}
		},
		watch: {
			// 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
			'$route': 'getParams',
			tihao() {
				this.$route.params.id = this.tihao;
				this.$router.push({
					name: 'recordSingleStatistics',
					params: {
						id: this.$route.params.id,
						usergroupId: this.$route.params.usergroupId,
						tab: this.switchTab
					}
				})
			}
		}
	}
</script>

<style>
	.mlh_wrapper {
		color: #fff;
		position: relative;
		z-index: 2;
		width: 100%;
		height: 100%;
	}

	.mlh_stuList {
		background: #ccd8cb;
		color: #000;
		padding: 10px;
		border-radius: 10px;
		height: 75%;
		overflow-y: auto;
	}

	.mlh_backLast {
		background: none;
		color: #fff;
		border: 0;
		font-size: 3rem;
		position: absolute;
		bottom: 3rem;
		left: 3rem;
	}

	.mlh_singleTest {
		background: rgb(82, 86, 89);
		width: 100%;
		height: 100%;
	}

	.mlh_zhutuabcd {
		width: 50%;
		height: 100%;
		float: left;
		margin-left: 5px;
	}

	.mlh_slectStrcolor {
		font-size: 2rem;
	}

	.mlh_xuanxiangkuang {
		background: #599cec;
		padding: 0 9px;
	}

	.mlh_xuanxiangullist {
		margin-top: 3px;
	}

	.mlh_xuanxiangullist li {
		font-size: 1.8rem;
		display: block;
		line-height: 2rem;
		margin: 0 10px;
	}

	.wx_selectkuang {
		height: 40%;
	}

	.mlh_studentDatirenshu {
		width: calc(50% - 5px);
		position: absolute;
		top: 0;
		right: 0;
		bottom: 6rem;
		overflow-x: hidden;
		overflow-y: scroll;
	}

	.mlh_studentDatirenshu img {
		min-height: 4rem;
		max-width: 80%;
		width: auto;
		height: auto;
		vertical-align: middle;
	}

	.mlh_tiganul {
		font-size: 3rem;
		position: relative;
	}

	.mlh_tiganul img {
		min-height: 4rem;
		max-width: 80%;
		width: auto;
		height: auto;
		vertical-align: middle;
	}

	.wx_tigan {
		text-indent: 9rem;
		color: rgb(255, 183, 16);
	}

	.wx_tigan img {
		max-width: 90%;
	}

	.mlh_tiganul li {
		line-height: 4rem;
	}

	.mlh_xuanxianguloption {
		list-style-type: upper-alpha;
		margin-left: 4rem;
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

	.exitResTc {
		font-size: 3rem !important;
		opacity: 1;
		cursor: pointer;
	}
</style>
