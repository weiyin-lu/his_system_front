<template>
  <div class="chargeHomePage">
    <el-header style="text-align: right"> <!--页面头部-->
      <span style="float: left;font-size: 20px;">门诊挂号收费功能页面</span><!--头部最左侧显示当前页面名称-->
      <!--最右侧首先显示当前用户名称,由登陆界面传输当前用户信息,同时与右侧按钮通过margin-right保持一定距离-->
      <span style="font-size: 15px; margin-right:15px">欢迎回来,{{userInfo.name}}</span>
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
    </el-header>

    <el-main  style="text-align: right; height:400px; width:100%;" >
      <!--跳转按钮布局通过el-row和el-col实现-->
      <el-row :gutter="20">
        <el-col :span="4">
        <!--跳至现场挂号页面-->
          <el-button type="primary" style="height:80px; width:120px;" plain round @click="addRoutes2">
            <i class="el-icon-s-order" style="font-size: 40px;"></i>
          <div style="font-size: 15px;">现场挂号</div>
          </el-button>
        </el-col>
        <el-col :span="4">
        <!--跳至退号页面-->
          <el-button type="danger" style="height:80px; width:120px;" plain round @click="addRoutes3">
            <i class="el-icon-s-release" style="font-size: 40px;"></i>
            <div style="font-size: 15px;">挂号信息操作</div>
          </el-button>
        </el-col>
      </el-row>
    </el-main>

  </div>
</template>

<script type="text/javascript">

export default {
  components: {
  },
  name: 'Home',
  data () {
    //注意：data即使不需要传数据，也必须return,否则会报错
    return {
      userinfo:{},
     }
  },
  methods: {
    //确定跳转位置, ../router/index.js 中可修改路径对应信息
    addRoutes2 () {
      this.$router.push('/outpatient/core')
    },
    addRoutes3 () {
      this.$router.push('/outpatient/manage')
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
    }
  },
  // 初始化写入登录数据
  created(){
    this.userInfo = JSON.parse(sessionStorage.getItem("userinfo"))
    console.log(this.userInfo)
  }
}
</script>

<style>
  .el-header {
    width: 100%;
    background-color: lightskyblue;
    color: black;
    line-height: 60px;
  }

  .el-row {
    margin-bottom: 20px;
  }
  .el-row.last-child {
      margin-bottom: 0;
    }
  .el-col {
    border-radius: 4px;
  }
</style>
