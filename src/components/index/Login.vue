<template>
  <body id="paper">
  <div style="position: absolute;/*绝对定位*/
     width: 300px;
     height: 200px;

     top: 50%;
     left: 50%;
     margin-top: -250px;
     margin-left: -200px;">
    <el-form :model="loginForm" :rules="rules" ref="loginForm"
             style="border-radius: 15px;
             background-clip: padding-box;
             margin: 90px auto;
             width: 350px;
             padding: 35px 35px 15px 35px;
             background: #fff;
             border: 1px solid #eaeaea;
             box-shadow: 0 0 25px #cac6c6;"
             label-position="left">
      <h3 style="margin: 0 auto 40px auto;
    text-align: center;
    color: #505458;font-size: 35px">HIS-医疗管理系统</h3>
      <el-form-item prop="id">
        <el-input type="text" v-model="loginForm.id"
                  placeholder="请输入用户编码"/>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"/>
      </el-form-item>
      <el-form-item style="width: 100%">
        <el-button type="primary" style="width: 100%;background: #505458;border: none"
                   @click="login()">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
  </body>
</template>

<script>
    import http from "@/axios/http"
    export default {
        name: 'Login',
        data () {
            return {
              // 登录表单
              loginForm: {
                id: null,
                password: ''
                },
              // 登录表单验证
              rules: {
                id: [
                    { required: true, message: '请输入ID', trigger: 'blur' }
                ],
                password: [
                  { required: true, message: '请输入密码', trigger: 'blur' },
                  { min: 6, message: '长度不小于6个字符' }
                ],
              },
              userInfo: {}
            }
        },
        methods: {
          // 登录方法，检查前端表单验证通过后即可进入正常流程
          // 1. 检查表单验证，如果通过执行234
          // 2. 把token写入到sessionstorage
          // 3. 把token二次传递回后端请求token的解析信息，存入sessionstorage
          //    因为使用了post方式传递单独参数，因此需要修改header
          // 4. 从解析数据里判断该用户的权限，直接跳转到对应工作站
          login() {
            // 1.
            this.$refs.loginForm.validate(
                valid => {
                  if (valid) {
                    http.post("/auth/", this.loginForm)
                        .then(response => {
                          if(response.data.code == "SUCCESS") {

                            // 2.
                            sessionStorage.setItem("token",response.data.data)
                            this.$message.success("登录成功")
                            // 3.
                            http.put("/auth/", response.data.data,{
                              headers: {
                                'Content-Type' : 'text/plain'
                              }
                            })
                            .then(info => {
                              sessionStorage.setItem('userinfo',JSON.stringify(info.data.data));
                              this.userInfo = info.data.data;
                              // 4.
                              switch (info.data.data.userType) {
                                case '门诊医生': this.$router.push('/outdoctor');console.log("run");break;
                                case '挂号收费员': this.$router.push('/outpatient');break;
                                case '医技医生': this.$router.push('/checkout');break;
                                case '药房医生': this.$router.push('/medicine');break;
                                case '医院管理员': this.$router.push('/admin');break;
                              }
                            })
                          } else {
                            this.$message.error("登录失败，" + response.data.msg)
                          }
                        })

                  }
                })
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
