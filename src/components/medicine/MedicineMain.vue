<template>
<div>
  <el-row>
    <el-col :span="4">
      <div class="h">
        <el-button style="height: 40px" type="primary" class="el-icon-back" @click="returnLogin"><el-icon><ArrowLeft /></el-icon>退出</el-button>
      </div>
    </el-col>
    <el-col :span="16">
      <div class="login_title">药房工作站</div>
    </el-col>
    <el-col :span="4" class="hhh">
      <div>
        <el-popover placement="left" width="500" trigger="hover">
          <el-table :data="getDocInfo">
            <el-table-column width="100" prop="docId" label="医生编号"></el-table-column>
            <el-table-column width="100" prop="name" label="医生姓名"></el-table-column>
            <el-table-column width="100" prop="deptName" label="部门名称"></el-table-column>
            <el-table-column width="100" prop="userType" label="医生类别"></el-table-column>
            <el-table-column width="100" prop="title" label="医生级别"></el-table-column>
          </el-table>
          <template #reference>
            <el-button style="height: 40px" slot="reference" type="primary" class="el-icon-user"><el-icon><User /></el-icon>你好！{{name}}</el-button>
          </template>

        </el-popover>
      </div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="16" :offset="4">
      <el-row>
        <el-col :span="12">
          <div class="div1"><el-icon><OfficeBuilding /></el-icon></div>
        </el-col>
        <el-col :span="12"><div class="div1"><el-icon><Grid /></el-icon></div></el-col>
        <el-col :span="12"><div><el-button type="primary" @click="h1">药房处置</el-button></div></el-col>
        <el-col :span="12"><div style="margin-bottom: 100px"><el-button type="primary" @click="h2">药品管理
        </el-button></div></el-col>
      </el-row>
    </el-col>
  </el-row>
</div>
</template>

<script>
import {Grid, OfficeBuilding} from "@element-plus/icons-vue";

export default {
  components: {OfficeBuilding, Grid},
  data(){
    return{
      userInfo:[],
      name:"",
      getDocInfo: [],

    }
  },
  mounted() {
    this.getDocInfoFuc()
  },
  methods: {
    h1() {
      this.$router.push('/medicine/core');
    },
    h2() {
      this.$router.push('/medicine/manage');
    },
    returnLogin() {
      this.$confirm('是否退出登录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.replace('/')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getDocInfoFuc() {
      let item = sessionStorage.getItem("userinfo");
      this.getDocInfo[0] = JSON.parse(item)
      this.name = this.getDocInfo[0].name
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
