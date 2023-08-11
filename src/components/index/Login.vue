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
        <el-button type="primary" style="width: 100%;background: #505458;border: none" @click="login()">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
  </body>
</template>

<script>
    import axios from "axios";
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
              // 从token解析的来的登录用户相关信息
              loginInfo : {}
            }
        },
        methods: {
          // 登录方法，检查前端表单验证通过后即可进入正常流程
          login() {
            this.$refs.loginForm.validate(
                valid => {
                  // 如果表单验证通过，在下方执行请求后端的流程
                  if (valid) {
                    http.post("/auth/", this.loginForm)
                        .then(response => {
                          if(response.data.code == "SUCCESS") {
                            // 登录成功的情况下：
                            // 1. 把token写入到sessionstorage
                            // 2. 把token二次传递回后端请求token的解析信息，并存入loginInfo
                            //    因为使用了post方式传递单独参数，因此需要修改header
                            // 3. 从解析数据里判断该用户的权限，直接跳转到对应工作站 （

                            // 1.
                            console.log(response.data.data)
                            sessionStorage.setItem("token",response.data.data)
                            this.$message.success("登录成功")
                            // 2.
                            const tokenstring = response.data.data
                            http.put("/auth/", response.data.data,{
                              headers: {
                                'Content-Type' : 'text/plain'
                              }
                            })
                            .then(info => {
                              this.loginInfo = info.data.data
                            })
                            // 3.
                            // 未完成，需要等待其他模块实装 卢子昂_2023-08-11_19:55）
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
