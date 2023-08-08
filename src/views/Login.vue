<template>
    <div id="app">
      <el-form :model="loginForm"
               label-position="right"
               label-width="100px"
               style="max-width: 460px"
               ref="loginForm"
               :rules="rules">
			   <!-- 规则 rules 要有对应的 ref 用来查看数据的变化-->
        <el-form-item label="登录ID" prop="id">
          <el-input v-model="loginForm.id" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" show-password v-model="loginForm.password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login()">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        id: 0,
        password: ""
      },
	  // 成功验证规则通过，修改规则名与 loginForm 对照
      rules: {
        id: [
          { required: true, message: '请输入ID', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '长度不小于6个字符' }
        ],
      }
    };
  },
  methods: {
    login() {
		// 修改验证表单为loginForm
      this.$refs.loginForm.validate(
          valid => {
            if (valid) {
              //   如果表单验证通过，执行axios请求
              axios.post("http://localhost:8000/auth/", this.loginForm)
                  .then(response => {
                    if(response.data.code == "SUCCESS") {
                      // 把token写入到sessionstorage
                      sessionStorage.setItem("token",response.data.data)
                      this.$message.success("登录成功")
					  this.$router.push("/doctors")
                    } else {
                      sessionStorage.setItem("token","")
                      this.$message.error("登录失败，" + response.data.msg)
                    }
                  })
            }
          })
    }
  }
}
</script>

<style scoped>

</style>