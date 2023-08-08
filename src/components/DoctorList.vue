<template>
  <div id="app">
    <el-button type="primary" @click="getlist()">查询</el-button>
    {{ doctorlist }}
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: "DoctorList",
  data() {
    return {
      doctorlist: []
    }
  },
  methods: {
    getlist() {
      axios.get("http://localhost:8000/doctors/")
          .then(response => {
            console.log(response.data)
            if (response.data.code == "SUCCESS") {
              this.doctorlist = response.data
            } else {
              this.$message.error("身份过期，请重新登录")
              this.$router.push("/")
            }
          })
    }
  }
}
</script>

<style scoped>

</style>