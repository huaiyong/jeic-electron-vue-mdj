<template>
  <div class="records">
    <div class="records_title clearfix">
      <span>教学记录</span>
      <span @click="close()">
        <img src="../../assets/img/close.svg" alt="">
      </span>
    </div>
    <div class="records_cont clearfix">
      <div class="records_type">
        <ul class="clearfix" v-if="recordList">
          <li v-for="(i,index) in recordList" :key="index" @click="showclassRecord(i.id,i.resourceId,i.resourceUrl,i.type,i.answerType,i.teachingGroupId)">
           <span :class="{'records_image':i.type==2,'records_img':i.type==3,'records_doc':i.type==1,'records_qita':i.type==null}"></span>
            <p class="filetext_title" v-text="i.name"></p>
          </li>
        </ul>
        <div v-if="!recordList" class="tipsall"> 
        	<img src="../../assets/img/ktjl.png" alt="" />
          <p class="tipscolor">暂无教学记录</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    mapState
  } from "vuex";
  export default {
    name: "Records",
    data() {
      return {
        recordList: [], //记录列表
        
      }
    },
    sockets: {
	    ketangjilu(){
	      this.getRecordData();
	    },
	    closeketangjilu(){
	    	this.close();
	    },
	    jiaoxueXiangQing(data){
	    	this.showclassRecord(data[0],data[1],data[2],data[3],data[4],data[5])
	    }
	  },
    methods: {
    	getRecordData(){
    		const that = this;
	      this.$http.get("http://127.0.0.1:3000/jeic/api/sendRecord/findClassRecordByRid?classRecordId=" + this.classRecord).then(function(res) {
	        if (res.data.ret == 200) { //云试题
	          that.recordList = res.data.data;
	        };
	      });
    	},
      showclassRecord(eachRecordId,resourceId,resourceUrl,type,answerType,teachingGroupId) {    
				this.$store.dispatch("getEachRecordId", eachRecordId );	
				this.$store.dispatch("getResourceId", resourceId );
				this.$store.dispatch("getTeachingGroupId", teachingGroupId );
        this.$router.push({
          name: 'recordDetail',
          params:{
          	resourceId:resourceId,
          	eachRecordId:eachRecordId,
          	resourceUrl:resourceUrl,
          	type:type,
          	answerType:answerType
          }
        });
      },
      close() { //关闭按钮
        this.$router.push({
          "name": "Index"
        });
      }
    },
    computed: {
      ...mapState({
        classRecord: state => state.state.classRecord
      })
    },
    mounted(){
    	this.getRecordData()
    },
    created(){
    	this.getRecordData()
    }
  }
</script>

<style scoped="scoped">
  .records {
    width: 80rem;
    height: 40rem;
    background: rgb(137, 137, 137);
    border: .1 solid rgba(18, 18, 18, 0.3);
    border-radius: .6rem;
    box-shadow: .1rem .1rem 1rem #0003;
    position: absolute;
    top: 2rem;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
    overflow: hidden;
  }
  .records_title {
    height: 5.6rem;
    line-height: 5.6rem;
    padding: 0 2rem;
    border-bottom: .1rem solid rgba(1, 1, 1, 0.3);
    background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#E8E6E7), to(#D2D0D3), color-stop(0.5, #dbd9dc));
  }
  .records_title span:first-child {
    color: #666;
    font-size: 1.6rem;
    padding: .8rem 1rem;
    border: .1rem solid #a3a1a4;
    border-radius: .8rem;
    background: #fff;
  }
  .records_title span:last-child {
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
  .records_title span:last-child img {
    width: 100%;
    height: 100%;
  }
  .records_cont {
    padding:.8rem;
    box-sizing: border-box;
  }

  .records_type {
    height: 100%;
    overflow-y: auto;
  }
  .records_type ul li {
    width: 9rem;
    height: 12rem;
    text-align: center;
    margin: .4rem .3rem;
    float: left;
    overflow: hidden;
    cursor: pointer;
  }
  .records_type ul li:hover {
    background: #69a9da;
  }
  .records_type ul li span {
    width: 8rem;
    height: 8rem;
    border-radius: 1.4rem;
    box-shadow: 0.2rem 0.2rem 0.6rem 0 #565656;
    display: inline-block;
  }
  .records_type ul li p {
    font-size: 1.6rem;
    color: #fff;
    margin-top: .6rem;
    line-height: 1.7rem;
  }
  .records_img {
    background: url(../../assets/img/image.png);
    background-size: 100%;
  }
  .records_image{
    background: url(../../assets/img/image.png);
    background-size: 100%;
  }
  .records_doc {
    background: #fff url(../../assets/img/doc.png);
    background-size: 100%;
  }
  .records_qita {
    background: url(../../assets/img/qita.png);
    background-size: 100%;
  }
  .tipsall {
	margin: 4.8rem auto;
	text-align: center;
	}
	.tipsall img{
		width: 20rem;
		text-align: center;
		margin:0 auto;
	}
	.tipscolor {
		margin-top:1rem;
		font-size: 2.2rem;
		color: #f6b337;
	}
	.filetext_title {
		display: block;
		font-size: 1.6rem;
		margin-top: .6rem;
		line-height: 1.7rem;
	}
</style>
