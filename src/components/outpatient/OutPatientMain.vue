<template>
  <div class="chargeHomePage">
    <el-header style="text-align: right"> <!--页面头部-->
      <span style="float: left;font-size: 20px;">门诊挂号收费功能页面</span><!--头部最左侧显示当前页面名称-->
      <!--最右侧首先显示当前用户名称,由登陆界面传输当前用户信息,同时与右侧按钮通过margin-right保持一定距离-->
      <span style="font-size: 15px; margin-right:15px">欢迎回来,{{userName}}</span>
      <el-dropdown> <!--下拉框-->
        <el-button type="primary" style="height:40px; width:40px;" circle> <!--首先显示带有用户图标的按钮-->
          <i class="el-icon-user-solid" circle style="margin-right: 15px"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown"> <!--鼠标悬停在按钮上方时显示下拉菜单-->
          <el-dropdown-item @click.native="addRoutes11">注销</el-dropdown-item><!--返回主界面-->
        </el-dropdown-menu>
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
            <div style="font-size: 15px;">退号</div>
          </el-button>
        </el-col>
        <el-col :span="4">
        <!--跳至收费页面-->
          <el-button type="primary" style="height:80px; width:120px;" plain round @click="addRoutes4">
            <i class="el-icon-wallet" style="font-size: 40px;"></i>
            <div style="font-size: 15px;">收费</div>
          </el-button>
        </el-col>
        <el-col :span="4">
        <!--跳至退费页面-->
          <el-button type="danger" style="height:80px; width:120px;" plain round @click="addRoutes5">
            <i class="el-icon-coin" style="font-size: 40px;"></i>
            <div style="font-size: 15px;">退费</div>
          </el-button>
        </el-col>
        <el-col :span="4">
        <!--跳至费用查询页面-->
           <el-button type="primary" style="height:80px; width:120px;" plain round @click="addRoutes6">
              <i class="el-icon-search" style="font-size: 40px;"></i>
              <div style="font-size: 15px;">费用查询</div>
            </el-button>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="4">
        <!--跳至日结页面-->
          <el-button type="primary" style="height:80px; width:120px;" plain round @click="addRoutes7">
            <i class="el-icon-document-add" style="font-size: 40px;"></i>
            <div style="font-size: 15px;">日结</div>
          </el-button>
        </el-col>
        <el-col :span="4">
        <!--跳至日结查询页面-->
          <el-button type="primary" style="height:80px; width:120px;" plain round @click="addRoutes8">
            <i class="el-icon-document-checked" style="font-size: 40px;"></i>
            <div style="font-size: 15px;">日结查询</div>
          </el-button>
        </el-col>
        <el-col :span="4">
        <!--跳至发票重打页面-->
          <el-button type="danger" style="height:80px; width:120px;" plain round @click="addRoutes9">
            <i class="el-icon-document-copy" style="font-size: 40px;"></i>
            <div style="font-size: 15px;">发票重打</div>
          </el-button>
        </el-col>

        <el-col :span="4">
        <!--跳至发票补打页面-->
          <el-button type="danger" style="height:80px; width:120px;" plain round @click="addRoutes10">
            <i class="el-icon-printer" style="font-size: 40px;"></i>
            <div style="font-size: 15px;">发票补打</div>
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
      userName:'',
     }
  },
  methods: {
    //确定跳转位置, ../router/index.js 中可修改路径对应信息
    addRoutes1 () {
      this.$router.push('/chargeHomePage')
    },
    addRoutes2 () {
      this.$router.push('/register')
    },
    addRoutes3 () {
      this.$router.push('/withdraw')
    },
    addRoutes4 () {
      this.$router.push('/charge')
    },
    addRoutes5 () {
      this.$router.push('/refund')
    },
    addRoutes6 () {
      this.$router.push('/searchFund')
    },
    addRoutes7 () {
      this.$router.push('/daily')
    },
    addRoutes8 () {
      this.$router.push('/dailySearch')
    },
    addRoutes9 () {
      this.$router.push('/reprint')
    },
    addRoutes10 () {
      this.$router.push('/makeUpBill')
    },
    addRoutes11 () {//用户注销时需弹出弹出框以确认是否返回登陆界面,而不是误操作
      this.$confirm('是否确认注销?', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '注销成功!'
          });
          this.$router.push('/');
        });
    }
  },

  created: function(){
    let _this = this;
    axios.get("http://localhost:20910/patient/getDocNameById/"+this.$store.state.docId).then(function (resp){
      _this.userName =  resp.data;
    })
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
