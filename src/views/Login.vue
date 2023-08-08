<template>
    <div id="app">
      <el-form :model="loginForm"
               label-position="right"
               label-width="100px"
               style="max-width: 460px"
               ref="form"
               :rules="rules">
        <el-form-item label="登录ID">
          <el-input v-model="loginForm.id" />
        </el-form-item>
        <el-form-item label="密码">
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
      // 验证没有正常生效，需要调整
      rules: {
        idrule: [
          { required: true, message: '请输入ID', trigger: 'blur' }
        ],
        pwdrule: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '长度不小于6个字符', trigger: 'blur' }
        ],
      }
    };
  },
  methods: {
    login() {
      this.$refs.form.validate(
          valid => {
            if (valid) {
              //   如果表单验证通过，执行axios请求
              axios.post("http://localhost:8000/auth/login", this.loginForm)
                  .then(response => {
                    console.log(response.data)
                  })
            }
          })
    }
  }
}
</script>

<style scoped>

</style>