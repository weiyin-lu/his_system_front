<template>
  <div class="home">
    <el-container>
      <el-aside width="400px"  style="max-height: 666px; background-color: rgb(238, 241, 246)" v-if="showSide">
        <el-row>
          <span style="text-align:left;float:left;margin-top: 7px">
            <el-tag size="medium" style="width: 250px;background-color: lightblue">
              当前患者:{{ patientInfo.pName }}</el-tag>
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
            <div style="text-align: right">
              <span style="margin-right: 15px"><el-button @click="show">{{hit}}</el-button></span>
              <span>
                  <el-tag size="medium" style="width: 400px;background-color: rgba(0,0,0,0.12)">
                    {{ patientInfo.message }}</el-tag>
                </span>
              <el-dropdown> <!--下拉框-->
                <el-button type="primary" style="height:40px; width:40px;" circle> <!--首先显示带有用户图标的按钮-->
                  <el-icon color="#FFFFFF">
                    <User />
                  </el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>
                      <div>
                        <b>基本信息</b>
                        <table>
                          <tr>
                            <td><b>姓名</b></td>
                            <td>{{userInfo.name}}</td>
                          </tr>
                          <tr>
                            <td><b>岗位</b></td>
                            <td>{{userInfo.userType}}</td>
                          </tr>
                          <tr>
                            <td><b>科室</b></td>
                            <td>{{userInfo.deptType}}</td>
                          </tr>
                          <tr>
                            <td><b>级别</b></td>
                            <td>{{userInfo.regName}}</td>
                          </tr>
                        </table>
                      </div>
                    </el-dropdown-item>
                    <el-dropdown-item divided @click.native="logout()">注销</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          <el-tabs v-model="page" @tab-click="click" type="border-card">
            <!-- ------------------------------------------门诊病历首页部分------------------------------------------- -->
              <el-tab-pane name="1" label="病历首页"></el-tab-pane>
            <!-- ------------------------------------------------检查申请部分--------------------------------------------- -->
              <el-tab-pane name="2" label="检查申请"></el-tab-pane>
            <!-- ----------------------------------------------------成药处方界面---------------------------------------------- -->
            <el-tab-pane name="3" label="药品处方"></el-tab-pane>
            <router-view :key="timer"/>
          </el-tabs>
        </el-main>
      </el-container>
    </el-container>

  </div>
</template>

<script>

import http from "@/axios/http";
import {Refresh} from "@element-plus/icons-vue";

export default {
  name: 'OutDoctorMain',
  components: {
    Refresh
  },
  data(){
    return {
      page:'1',
      input:'',
      pName:'',
      hit:'隐藏患者栏',
      showSide:true,
      message:'',
      tagMessage:'患者名:',
      tag:"患者",
      // 患者列表
      table1Data: [],
      // 当前选择的患者的全部信息
      presentPatient:{},
      // 当前选择的患者展示信息
      patientInfo:{
        message: '待选择患者',
        pName: '等待选择...',
      },
      // 当前登录医生的信息
      userInfo: {},
      timer:''
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
    // 选中列表中的某一患者后更新信息
    // 1. 根据选中的患者填入父组件信息
    // 2. 将选中患者的信息存入store
    // 3. 切换到问诊信息页
    // 4. 刷新内容
    cellClick(row){
      // 1.
      this.presentPatient = this.table1Data[row.index]
      this.patientInfo.pName= row.name;
      this.patientInfo.message =
          '病历号: '+ row.recordId+' | 姓名：'+row.name+' | 年龄：'+row.age+' | 性别：'+row.gender
      // 2.
      this.$store.commit("persentPatient",this.presentPatient)
      // 3.
      this.$router.push('/outdoctor/medrecord')
      this.page = '1'
      // 4.
      this.timer = new Date().getTime()
    },
    // 刷新提示消息
    selectRefresh(){
      this.$message({
        message:'患者选择刷新按钮,重新执行查询操作',
        type: 'success'
      });
      this.$router.push('/outdoctor');
    },
    // 用户注销
    // 1. 二次确认
    // 2. 确认后，删除sessionstroage信息
    // 3. 返回登录页
    logout () {
      // 1.
      this.$confirm('是否确认注销?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '注销成功!'
        });
        // 2.
        sessionStorage.removeItem('userinfo')
        sessionStorage.removeItem('token')
        // 3.
        this.$router.push('/');
      });
    },
    // 患者栏按钮
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
    // 当el-tab受到点击，切换子路由
    click(tab){
      if(tab.props.name=='1'){
        this.$router.push('/outdoctor/medrecord')
      }
      else if(tab.props.name=='2'){
        this.$router.push('/outdoctor/check');
      }
      else if(tab.props.name=='3'){
        this.$router.push('/outdoctor/med');
      }
    },
  },
  // 在页面初始化时访问的数据
  // 1. 从sessionstorage中获得登录账户的基本信息，存入当前页对象里
  // 2. 查询所有病人的信息
  created() {
    // 1.
    let _this = this;
    let info = JSON.parse(sessionStorage.getItem("userinfo"))
    this.userInfo = info
    // 2.
    http.get('/outdoctors/patient/' + info.docId).then(function (resp){
      _this.table1Data = resp.data.data;
    });
  },
  watch:{
    'tag' :function (){
      if(this.tag==='患者'){
        this.tagMessage = '患者名:';
      }
    }
  }
}
</script>
