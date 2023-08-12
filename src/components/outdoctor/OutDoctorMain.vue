<template>
  <div class="home">
    <el-container>
      <el-aside width="400px"  style="max-height: 666px; background-color: rgb(238, 241, 246)" v-if="showSide">
        <el-row>
          <span style="text-align:left;float:left;margin-top: 7px">
            <el-tag size="medium" style="width: 250px;background-color: lightblue">
              当前患者:{{presentPatient.pName}}</el-tag>
          </span>
          <span style="float:right">
            <el-button style="background-color: #409EFF" @click="selectRefresh">
              <el-icon color="#FFFFFF">
                <Refresh />
              </el-icon>
            </el-button>
          </span>
        </el-row>
        <el-tabs v-model="tag" type="border-card">
          <el-tab-pane name="患者" label="患者" @tab-click="editTagMessage">
            <div style="text-align: center">
              <el-tag style="text-align: left;background-color: lightblue;width: 85%">患者列表</el-tag>
              <el-table
                      :data="table1Data"
                      max-height="225"
                      style="width: 100%"
                      :cell-class-name="tableCellClassname"
                      @cell-click="cellClick"
                      highlight-current-row>
                <el-table-column
                        prop="recordId"
                        label="病历号"
                        width="80">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="姓名"
                        width="150">
                </el-table-column>
                <el-table-column
                    prop="gender"
                    label="性别"
                    width="75">
                </el-table-column>
                <el-table-column
                        prop="age"
                        label="年龄"
                        width="75">
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>

      </el-aside>
      <el-container>
        <!-- -------------------------------------------------------------main部分--------------------------------------------------------- -->
        <el-main>
          <div style="text-align: left">
                <span style="margin-right: 15px"><el-button @click="show">{{hit}}</el-button></span>
                <span>
                  <el-tag size="medium" style="width: 400px;background-color: rgba(0,0,0,0.12)">
                    {{presentPatient.message}}</el-tag>
                </span>
          </div>
          <el-tabs v-model="page" @tab-click="click" type="border-card">
            <!-- ------------------------------------------门诊病历首页部分------------------------------------------- -->
            <el-tab-pane name="病历首页" label="病历首页"></el-tab-pane>
            <!-- ------------------------------------------------检查申请部分--------------------------------------------- -->
            <el-tab-pane name="检查申请" label="检查申请"></el-tab-pane>
            <!-- -----------------------------------------------门诊确诊界面-------------------------------------------------------------- -->
            <el-tab-pane name="门诊确诊" label="门诊确诊"></el-tab-pane>
            <!-- ----------------------------------------------------成药处方界面---------------------------------------------- -->
            <el-tab-pane name="成药处方" label="药品处方"></el-tab-pane>
          </el-tabs>
        </el-main>
      </el-container>
    </el-container>

  </div>
</template>

<script>

import http from "@/axios/http";
import Login from "@/components/index/Login.vue";
import {Refresh} from "@element-plus/icons-vue";

export default {
  name: 'OutDoctorMain',
  components: {
    Refresh,
    Login
  },
  data(){
    return {
      page:'病例首页',
      input:'',
      pName:'',
      hit:'隐藏患者栏',
      showSide:true,
      message:'',
      tagMessage:'患者名:',
      tag:"患者",
      // 患者列表
      table1Data: [],
      // 当前选择的患者信息
      presentPatient:{
        message: '待选择患者',
        pName: '等待选择...',
      },
    }
  },

  methods :{
    editTagMessage(){
      this.tagMessage = '患者名:';
    },
    tableCellClassname({row,column,rowIndex,columnIndex}){
      row.index = rowIndex;
      column.index = columnIndex;
    },
    cellClick(row){
      this.presentPatient.pName= row.name;
      this.presentPatient.message =
          '病历号: '+ row.recordId+' | 姓名：'+row.name+' | 年龄：'+row.age+' | 性别：'+row.gender
    },
    selectRefresh(){
      this.$message({
        message:'患者选择刷新按钮,重新执行查询操作',
        type: 'success'
      });
      location.reload();
    },
    show(){
      if(this.showSide===false){
        this.showSide=true;
        this.hit='隐藏患者栏';
      }
      else{
        this.showSide=false;
        this.hit='显示患者栏';
      }
    },
    click(tab){
      if(tab.name==='病历首页'){
        this.$router.push({path:'/Record'})
      }
      else if(tab.name==='检查申请'){
        this.$router.push({path:'/Check'});
      }
      else if(tab.name==='门诊确诊'){
        this.$router.push({path:'/Confirm'});
      }
      else if(tab.name==='药品处方'){
        this.$router.push({path:'/Wmedicine'});
      }

    },

  },
  // 在页面初始化时访问的数据
  created: function (){
    let _this = this;
    const info = JSON.parse(sessionStorage.getItem('userinfo'))
    console.log(info)
    http.get('/outdoctors/patient/' + info.docId).then(function (resp){
      _this.table1Data = resp.data.data;
    });
  },
  watch:{
    'tag' :function (){
      if(this.tag==='患者'){
        this.tagMessage = '患者名:';
      }
      if(this.tag==='科室'){
        this.tagMessage = '科室名:';
      }
    }
  }
}
</script>
