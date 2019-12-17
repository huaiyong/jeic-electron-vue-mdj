import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
const routes = [{
		path: '/',
		component: resolve => require(['@/components/Login'], resolve),
	},
	{
		name: 'Index',
		path: '/Index',
		component: resolve => require(['@/components/Index'], resolve),
		children: [{
				name: 'UserInfo',
				path: '/UserInfo',
				component: resolve => require(['@/components/UserInfo'], resolve),
			},
			{
				name: 'StudentList',
				path: '/StudentList',
				component: resolve => require(['@/components/StudentList'], resolve),
				meta: {
					keepAlive: true,
				},
			},
			{
				name: 'Classroom',
				path: '/Classroom',
				component: resolve => require(['@/components/Classroom'], resolve),

			},
			{
				name: 'Records',
				path: '/Records',
				component: resolve => require(['@/components/teachRecord/Records'], resolve),
				meta: {
					keepAlive: false,
				},
			},
			{
				name: 'Resourceslist',
				path: '/Resourceslist',
				component: resolve => require(['@/components/resources/resourceslist'], resolve),
				meta: {
					keepAlive: true,
					reload: true
				},
				beforeEnter(to, from, next) {
					if (from.name == 'StudentAnswers') {
						to.meta.reload = false;
					};
					next();
				}
			},
			{
				name: 'videoPlayer',
				path: '/videoPlayer',
				component: resolve => require(['@/components/resourceDetail/videoPlayer'], resolve),
				meta: {
					keepAlive: false,
				},
			},
			{
				name: 'chooseMode',
				path: '/chooseMode',
				component: resolve => require(['@/components/voteItem/chooseMode'], resolve),
			},
			{
				name: 'customVote',
				path: '/customVote',
				component: resolve => require(['@/components/voteItem/customVote'], resolve),
			},
			{
				name: 'echartResult',
				path: '/echartResult:voteId:type',
				component: resolve => require(['@/components/voteItem/echartResult'], resolve),
			},
			{
				name: 'xuanju',
				path: '/xuanju',
				component: resolve => require(['@/components/voteItem/xuanju'], resolve),
			},
			{
				name: 'imgShow',
				path: '/imgShow',
				component: resolve => require(['@/components/resourceDetail/imgShow'], resolve),
				meta: {
					keepAlive: false,
				},
			},
			{
				name: 'studentUploadImg',
				path: '/studentUploadImg/:id:classRecordId',
				component: resolve => require(['@/components/studentUploadImg'], resolve),
			},

			{
				name: 'draw', //画板
				path: '/draw',
				component: resolve => require(['@/components/Draw'], resolve),
				meta: {
					keepAlive: false,
				},
			},
			{
				name: 'StudentAnswers',
				path: '/StudentAnswers',
				component: resolve => require(['@/components/resources/studentAnswers'], resolve),
				meta: {
					keepAlive: true,
					reload: true,
				},
				beforeEnter(to, from, next) {
					if (from.name == 'AnswerStatistics' || from.name == 'picShow' || to.params.state == true) {
						to.meta.reload = false;
					};
					next();
				},
			},
			{
				name: 'picShow',
				path: '/picShow',
				component: resolve => require(['@/components/resourceDetail/picShow'], resolve),
			},

			{
				name: 'recordDetail',
				path: '/recordDetail',
				component: resolve => require(['@/components/teachRecord/recordDetail'], resolve),
				meta: {
					keepAlive: true,
					reload: true,
				},
				beforeEnter(to, from, next) {
					if (from.name == 'recordAnswerStatistics' || from.name == 'picShow' || to.params.state == true) {
						to.meta.reload = false;
					};
					next();
				}
			},
			{
				name: 'AnswerStatistics', //查看班级答题统计页面
				path: '/AnswerStatistics',
				component: resolve => require(['@/components/statistics/allStatistics'], resolve),
				// meta: {
				// 	keepAlive: true,
				// },
				// beforeEnter(to, from, next) {
				// 	to.meta.keepAlive = true;
				// 	if (from.name == 'rankingStatistics' || from.name == 'singleStatistics' || from.name == 'getGroupStudentRange') {
				// 		to.meta.keepAlive = true;
				// 	}else if(from.name == 'StudentAnswers'){
				// 		to.meta.keepAlive = false;
				// 	};
				// 	next();
				// }
			},
			{
				name: 'rankingStatistics', //小红花页面
				path: '/rankingStatistics',
				component: resolve => require(['@/components/statistics/rankingStatistics'], resolve),
				meta: {
					keepAlive: false,
				},
			}, {
				name: 'singleStatistics', //小红花页面  getGroupStudentRange
				path: '/singleStatistics/:id',
				component: resolve => require(['@/components/statistics/singleStatistics'], resolve),
				meta: {
					keepAlive: false,
				},
			}, {
				name: 'getGroupStudentRange', //小红花小组成员页面  
				path: '/getGroupStudentRange',
				component: resolve => require(['@/components/statistics/getGroupStudentRange'], resolve),
				meta: {
					keepAlive: false,
				},
			},
			{
				name: 'recordAnswerStatistics', //查看课堂记录班级答题统计页面
				path: '/recordAnswerStatistics',
				component: resolve => require(['@/components/teachRecord/allStatistics'], resolve),
				meta: {
					keepAlive: false,
				},
			},
			{
				name: 'recordRankingStatistics', //课堂记录小红花页面
				path: '/recordRankingStatistics',
				component: resolve => require(['@/components/teachRecord/rankingStatistics'], resolve),
				meta: {
					keepAlive: false,
				},
			}, {
				name: 'recordSingleStatistics', //课堂记录小红花页面  getGroupStudentRange
				path: '/recordSingleStatistics/:id',
				component: resolve => require(['@/components/teachRecord/singleStatistics'], resolve),
				meta: {
					keepAlive: false,
				},
			}, {
				name: 'recordGetGroupStudentRange', //课堂记录小红花小组成员页面  
				path: '/recordGetGroupStudentRange',
				component: resolve => require(['@/components/teachRecord/getGroupStudentRange'], resolve),
				meta: {
					keepAlive: false,
				},
			},
			{
				name: 'teachModel',
				path: '/teachModel',
				component: resolve => require(['@/components/teachModel/teachModel'], resolve),
			},
			{
				name: 'showcase', //实物展台
				path: '/showcase',
				component: resolve => require(['@/components/showcase'], resolve),
			},
			{
				name: 'imgCompare', //拍照对比
				path: '/imgCompare',
				component: resolve => require(['@/components/imgCompare'], resolve),
			},
			{
				name: 'imgShowduibi', //拍照对比图片展示
				path: '/imgShowduibi',
				component: resolve => require(['@/components/resourceDetail/imgShowduibi'], resolve),
			},
		],
	},
	{
		name: 'foundGroup',
		path: '/foundGroup',
		component: resolve => require(['@/components/teachModel/foundGroup'], resolve),
	}
	
	
];
const router = new VueRouter({
	routes,
});
export default router;
