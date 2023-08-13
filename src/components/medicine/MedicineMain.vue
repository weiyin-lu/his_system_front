<template>
<div>
  <el-row>
    <el-col :span="4"><div class="h"><el-button type="primary" class="el-icon-back" @click="returnLogin">退出</el-button> </div></el-col>
    <el-col :span="16"><div class="login_title">药房工作站</div></el-col>
    <el-col :span="4"><div class="h">
      <el-popover
              placement="left"
              width="500"
              trigger="hover">
        <el-table :data="userInfo">
          <el-table-column width="100" prop="docId" label="医生编号"></el-table-column>
          <el-table-column width="100" prop="name" label="医生姓名"></el-table-column>
          <el-table-column width="100" prop="deptName" label="部门名称"></el-table-column>
          <el-table-column width="100" prop="userType" label="医生类别"></el-table-column>
          <el-table-column width="100" prop="title" label="医生级别"></el-table-column>
        </el-table>
        <el-button slot="reference" type="primary" class="el-icon-user">你好！{{userInfo.name}}</el-button>
      </el-popover>
    </div></el-col>
  </el-row>
  <el-row>
    <el-col :span="16" :offset="4">
      <el-row>
        <el-col :span="8"><div class="div1"><i class="el-icon-office-building"></i></div></el-col>
        <el-col :span="8"><div class="div1"><i class="el-icon-school"></i></div></el-col>
        <el-col :span="8"><div class="div1"><i class="el-icon-s-grid"></i></div></el-col>
        <el-col :span="8"><div><el-button type="primary" @click="h1">药房处置</el-button></div></el-col>
        <el-col :span="8"><div style="margin-bottom: 100px"><el-button type="primary" @click="h2">药品管理
        </el-button></div></el-col>
      </el-row>
    </el-col>
  </el-row>
</div>
</template>

<script>
export default {
  data(){
    return{
      userInfo:[],
    }
  },
  created() {
    this.userInfo[0] = JSON.parse(sessionStorage.getItem("userinfo"))
    console.log(this.userInfo)
  },
  methods: {
    h1() {
      this.$router.push('/medicine/core');
    },
    h2() {
      this.$router.push('/medicine/manage');
    }
  }
}
</script>

<style scoped>
  .login_title{
    background-color: #409EFF;
    font-size: 30px;
    text-align: center;
  }
  .div1{
    font-size: 400%;
    margin-top: 100px;
  }
</style>
