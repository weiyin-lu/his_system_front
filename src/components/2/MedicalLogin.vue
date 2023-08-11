<template>
<div>
  <el-row>
    <el-col :span="4"><div class="h"><el-button type="primary" class="el-icon-back" @click="returnLogin">退出</el-button> </div></el-col>
    <el-col :span="16"><div class="login_title">医技工作站</div></el-col>
    <el-col :span="4"><div class="h">
      <el-popover
              placement="left"
              width="500"
              trigger="hover">
        <el-table :data="getDocInfo">
          <el-table-column width="100" prop="docId" label="医生编号"></el-table-column>
          <el-table-column width="100" prop="name" label="医生姓名"></el-table-column>
          <el-table-column width="100" prop="dept" label="部门名称"></el-table-column>
          <el-table-column width="100" prop="userType" label="医生类别"></el-table-column>
          <el-table-column width="100" prop="title" label="医生级别"></el-table-column>
        </el-table>
        <el-button slot="reference" type="primary" class="el-icon-user">你好！{{name}}</el-button>
      </el-popover>
    </div></el-col>
  </el-row>

<el-row>
  <el-col :span="16" :offset="4">
    <el-row >
      <div>

        <el-col :span="6"><div class="div1"><i class="el-icon-office-building"></i></div></el-col>
        <el-col :span="6"><div class="div1"><i class="el-icon-s-claim"></i></div></el-col>
        <el-col :span="6"><div class="div1"><i class="el-icon-s-finance"></i></div></el-col>
        <el-col :span="6"><div class="div1"><i class="el-icon-s-custom"></i></div></el-col>
        <el-col :span="6"><div><el-button type="primary" @click.native="h1">患者检验</el-button></div></el-col>
        <el-col :span="6"><div><el-button type="primary" @click.native="h2">患者检查</el-button></div></el-col>
        <el-col :span="6"><div><el-button type="primary" @click.native="h3">患者处置</el-button></div></el-col>
        <el-col :span="6"><div><el-button type="primary" @click.native="h4">医技管理</el-button></div></el-col>
        <el-col :span="24"><div class="row"></div></el-col>
      </div>
    </el-row>
  </el-col>
</el-row>
</div>
</template>
<style>

</style>
<script>
  export default {
    data(){
      return{
        name:'',
        getDocInfo:[],
      }
    },
    mounted:function(){
      this.getDocInfoFuc()
    },
      methods:{
          h1(){
              this.$router.replace('/Patient_Inspect')
          },
          h2(){
              this.$router.replace('/Patient_check')
          },
          h3(){
              this.$router.replace('/Patient_treat')
          },
          h4(){
              this.$router.replace('/MedicalTechManage')
          },
          returnLogin(){
            this.$confirm('是否退出登录?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(()=>{
              this.$router.replace('/')
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
          },
        getDocInfoFuc(){
            let _this=this
            axios.get("http://localhost:20910/api/getDocInfo/"+this.$store.state.docId,{
              DocId:this.$store.state.docId
            }).then(resp=>{
              if(resp && resp.data.code===200){
                this.getDocInfo=[]
                _this.getDocInfo.push(resp.data.result)
                console.log("hh")
                this.name=_this.getDocInfo[0].name
              }
            })
        }
      }
  }
</script>
<style>
  .row{
    margin-top: 30px;
    background-repeat: no-repeat;
    background-size: cover;
    width: 100%;
    height:600px;
    float: left;
  }
  .login_title{
    background-color: #409EFF;
    font-size: 30px;
    color: white;
    text-align: center;
    height: 40px;
  }
  .h{
    background-color: #409EFF;
  }
  .div1{
    font-size: 400%;
    margin-top: 100px;
  }
</style>
