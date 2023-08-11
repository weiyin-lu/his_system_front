<template>
  <body id="paper">
  <div style="position: absolute;/*绝对定位*/
     width: 300px;
     height: 200px;

     top: 50%;
     left: 50%;
     margin-top: -250px;
     margin-left: -200px;">
    <el-form :model="loginForm" :rules="rules" style="border-radius: 15px;
    background-clip: padding-box;
    margin: 90px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;" label-position="left">
      <h3  style="margin: 0 auto 40px auto;
    text-align: center;
    color: #505458;font-size: 35px">HIS管理系统</h3>
      <el-form-item prop="username">
        <el-input type="text" v-model="loginForm.username"
                  placeholder="请输入用户编码"/>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"/>
      </el-form-item>
      <el-form-item style="width: 100%">
        <el-button type="primary" style="width: 100%;background: #505458;border: none" v-on:click="login">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
  </body>
</template>

<script>

    export default {
        name: 'Login',
        data () {
            return {
                loginForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [{required: true, message: '用户名不能为空', trigger: 'blur'}],
                    password: [{required: true, message: '密码不能为空', trigger: 'blur'}]
                },
                responseResult: []
            }
        },
        methods: {
            login () {
                if(this.loginForm.username===''||this.loginForm.username===null||this.loginForm.password===''||this.loginForm.password===null){
                    this.$message({
                        type: 'error',
                        message:"请输入账号密码！"
                    });
                }else{
                    axios.post('http://localhost:20910/api/login', {
                        docId: this.loginForm.username,
                        password: this.loginForm.password
                    })
                        .then(resp => {
                            let _this = this;
                            if (resp.data.code === 200) {
                                window.sessionStorage.setItem("user",JSON.stringify(resp.data.result));
                                if(resp.data.result.userType==='医院管理员'){
                                    this.$router.replace({path: '/hh'})
                                }else if(resp.data.result.userType==='门诊医生'){
                                  this.$router.replace({path: '/Record'})
                                  this.$store.dispatch('editDocId',this.loginForm.username);
                                  this.$store.commit('editDocId',this.loginForm.username);
                                }else if(resp.data.result.userType==='医技医生'){
                                    this.$store.dispatch('editDocId',this.loginForm.username);
                                    this.$store.commit('editDocId',this.loginForm.username);
                                    this.$router.replace({path: '/medicalLogin'})
                                }else if(resp.data.result.userType==='药房操作员'){
                                    this.$store.dispatch('editDocId',this.loginForm.username);
                                    this.$store.commit('editDocId',this.loginForm.username);
                                    this.$router.replace({path: '/OutpatientDepartment'})
                                }else if(resp.data.result.userType==='挂号收费员'){
                                  this.$store.dispatch('editDocId',this.loginForm.username);
                                  this.$store.commit('editDocId',this.loginForm.username);
                                  this.$router.replace({path: '/chargeHomePage'})
                                }else if(resp.data.result.userType==='财务管理员'){
                                  this.$store.dispatch('editDocId',this.loginForm.username);
                                  this.$store.commit('editDocId',this.loginForm.username);
                                  this.$router.replace({path: '/finManageHomePage'})
                                }else{
                                    this.$message({
                                        type: 'error',
                                        message:"非法用户！"
                                    });
                                    window.sessionStorage.removeItem("user");
                                    this.$router.replace({path: '/login'})
                                }
                            }else {
                              if(resp.data.message==='失效用户') {
                                this.$message({
                                  type: 'error',
                                  message: "账号密码已失效,无法登录！"
                                });
                              }
                              else{
                                axios.get("http://localhost:20910/api/docExist?id="+this.loginForm.username).then(function (resp){
                                  if(resp.data===true){
                                    _this.$message({
                                      type: 'error',
                                      message: "密码输入错误!"
                                    });
                                  }
                                  else{
                                    _this.$message({
                                      type: 'error',
                                      message: "非法用户!"
                                    });
                                  }
                                })
                              }
                              this.loginForm = {
                                username: '',
                                password: ''
                              }
                            }
                        })
                        .catch(() => {
                        })
                }
            }
        }
    }
</script>
<style>
  #paper {
    background: linear-gradient(#00FFFF,#ffffff);
    background-position: center;
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;
  }
  body{
    margin: 0;
  }

</style>
