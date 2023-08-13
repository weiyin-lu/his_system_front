<template>
  <div id="app">
    <!--  顶部导航条  -->
    <el-page-header :icon="null" @back="onback" style="padding: 20px;">
      <template #content>
        <div class="flex items-center">
          <el-avatar :size="32" class="mr-3" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
          <div style="float: right;height: 38px;line-height: 38px;margin-left: 20px;">
            <span class="text-large font-600 mr-3"> {{ user.name }} </span>
            <span class="text-sm mr-2" style="color: var(--el-text-color-regular);font-size: 14px;margin-left: 40px">
						{{ user.userType }}
					  </span>
          </div>

        </div>
      </template>
      <template #extra>
        <div class="flex items-center">
          <el-button type="primary" class="ml-2" @click="logout">退出</el-button>
        </div>
      </template>
    </el-page-header>

    <!--添加科室-->
    <el-button type="primary" @click="isaddshow = true">添加挂号等级</el-button>

    <!--科室列表表格-->
    <el-table :data="reglist" stripe style="width: 100%;height: 800px;">
      <!--  对应字段-->
      <el-table-column type="index" label="索引号码" width="180" />
      <el-table-column prop="regLevel" label="级别名称" width="180" />
      <el-table-column prop="regLimit" label="级别限额" width="180" />
      <el-table-column prop="regOrder" label="级别显示序号" width="180" />
      <el-table-column prop="regCost" label="挂号费" width="180" />
      <el-table-column prop="subject" label="科目" width="180" />

      <el-table-column align="right">
        <template #default="scope">
          <!-- 获取这一行数据进行修改 -->
          <el-button size="small" @click="toupdateline(scope.row)">修改</el-button>
          <!-- 获取这一行id到后端删除 -->
          <el-button size="small" type="danger" @click="deleteone(scope.row.regId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 点击修改弹出修改框 -->
    <el-dialog v-model="isupshow" title="修改" width="30%" center>
      <el-form :model="updateline" label-position="right" label-width="100px" style="max-width: 460px">
        <el-form-item label="级别名称" prop="regLevel">
          <el-input v-model="updateline.regLevel" />
        </el-form-item>
        <el-form-item label="级别限额" prop="regLimit">
          <el-input v-model="updateline.regLimit" />
        </el-form-item>
        <el-form-item label="级别显示序号" prop="regOrder">
          <el-input v-model="updateline.regOrder" />
        </el-form-item>
        <el-form-item label="挂号费" prop="regCost">
          <el-input v-model="updateline.regCost" />
        </el-form-item>
        <el-form-item label="科目" prop="subject">
          <el-input v-model="updateline.subject" />
        </el-form-item>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button type="primary" @click="updateone()">确定</el-button>
					<el-button @click="isupshow = false;">取消</el-button>
				</span>
      </template>
    </el-dialog>
    <!-- 点击添加弹出添加框 -->
    <el-dialog v-model="isaddshow" title="添加" width="30%" center>
      <el-form :model="addline" label-position="right" label-width="100px" style="max-width: 460px">
        <el-form-item label="级别名称" prop="regLevel">
          <el-input v-model="addline.regLevel" />
        </el-form-item>
        <el-form-item label="级别限额" prop="regLimit">
          <el-input v-model="addline.regLimit" />
        </el-form-item>
        <el-form-item label="级别显示序号" prop="regOrder">
          <el-input v-model="addline.regOrder" />
        </el-form-item>
        <el-form-item label="挂号费" prop="regCost">
          <el-input v-model="addline.regCost" />
        </el-form-item>
        <el-form-item label="科目" prop="subject">
          <el-input v-model="addline.subject" />
        </el-form-item>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button type="primary" @click="addone()">确定</el-button>
					<el-button @click="isaddshow = false;">取消</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import http from "@/axios/http";
export default {
  name: "AdminRegister",
  data() {
    return {
      // 用户数据
      user:[],

      // 用于显示的对象
      reglist: [],

      // 修改框是否显示
      isupshow: false,
      updateline: [],
      // 添加框是否显示
      isaddshow: false,
      addline: {
        regLevel:"",
        regLimit:"",
        regOrder:"",
        regCost:"",
        subject:"",
      }
    }
  },
  mounted() {
    this.user=JSON.parse(sessionStorage.getItem("userinfo"))
    this.getlist()

  },
  methods: {
    getlist() {
      http.get("/registers/")
          .then(response => {
            // console.log(response.data)
            if (response.data.code === "SUCCESS") {
              this.reglist = response.data.data
              this.AllArray = response.data.data
            } else {
              this.$message.error("身份过期，请重新登录")
              this.$router.push("/")
            }
          })
    },

    // 传给后端id删除这一行
    deleteone(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        http.delete("/registers/" + id).then(response => {
          // console.log(response.data)
          if (response.data.code === "SUCCESS") {
            this.$message.success("删除成功")
            this.getlist()
          } else {
            this.$message.error(response.data.msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      })
    },

    // 因赋值问题单独做的
    toupdateline(updateline) {
      this.isupshow = true
      /**
       * 新开辟一段空间
       * 因为前段引用类型数据会赋值地址
       * 所以修改后不点击确定数据也会改变
       * 但数据库中的数据不变
       */
      this.updateline = JSON.parse(JSON.stringify(updateline))
    },

    // 修改后的值传入后端修改
    updateone() {
      if(this.updateline.regLevel.trim().length < 1 || this.updateline.regLimit.toString().trim().length < 1 ||
          this.updateline.regOrder.toString().trim().length < 1 || this.updateline.regCost.toString().trim().length < 1 ||
          this.updateline.subject.trim().length < 1 ){
        this.$message({
          type: 'error',
          message: '请完整填入信息！'
        });
      }else{
        http.put("/registers/update", this.updateline)
            .then(response => {
              // console.log(response.data)
              if (response.data.code === "SUCCESS") {
                this.$message.success("修改成功")
                this.getlist()
                this.isupshow = false
              } else {
                this.$message.error(response.data.msg)
              }
            })
      }

    },

    // 添加数据传入后端添加
    addone() {
      if(this.addline.regLevel.trim().length < 1 || this.addline.regLimit.trim().length < 1 ||
          this.addline.regOrder.trim().length < 1 || this.addline.regCost.trim().length < 1 ||
          this.addline.subject.trim().length < 1 ){
        this.$message({
          type: 'error',
          message: '请完整填入信息！'
        });
      }else{
        http.put("/registers/add", this.addline)
            .then(response => {
              // console.log(response.data)
              if (response.data.code === "SUCCESS") {
                this.$message.success("添加成功")
                this.getlist()
                this.isaddshow = false
              } else {
                this.$message.error(response.data.msg)
              }
            })
      }
    },

    // 退回管理页面
    onback() {
      this.$router.replace({
        path: '/admin'
      });
    },

    // 退出登录
    logout() {
      this.$confirm('确定退出？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.sessionStorage.removeItem("token");
        window.sessionStorage.removeItem("userinfo");
        this.$router.replace({
          path: '/'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        });
      });
    },
  },
}
</script>

<style>
</style>
