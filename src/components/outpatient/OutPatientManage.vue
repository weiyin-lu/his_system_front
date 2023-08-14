<template>
  <div class="register">
    <el-header style="text-align: right"><!--页面头部-->
      <span style="float: left;font-size: 20px;">
        挂号信息管理页面
        <el-button type="primary" style="height:40px; width:40px;" circle @click="getPatient()">
        <el-icon color="#FFFFFF">
          <Refresh />
        </el-icon>
      </el-button>
      </span><!--头部最左侧显示当前页面名称-->
      <!--最右侧首先显示当前用户名称,由登陆界面传输当前用户信息,同时与右侧按钮通过margin-right保持一定距离-->
      <span style="font-size: 15px; margin-right:15px">{{userInfo.name}}</span>
      <!--通过带有返回主页图标的按钮实现返回主页面操作-->
      <el-button type="primary" style="height:40px; width:40px;" circle @click="returnMain()">
        <el-icon color="#FFFFFF">
          <Back />
        </el-icon>
      </el-button>
    </el-header>
    <el-main>
        <el-table :data="patient.filter(data => !searchString || data.name.includes(searchString))"
                  style="width: 100%">
          <el-table-column type="index" />
          <el-table-column label="就诊ID" prop="recordId" />
          <el-table-column label="姓名" prop="name" />
          <el-table-column label="性别" prop="gender" />
          <el-table-column label="年龄" prop="age" />
          <el-table-column label="就诊状态" prop="state" />
          <el-table-column align="right">
            <template #header>
              <el-input v-model="searchString" size="small" placeholder="查找姓名" />
            </template>
            <template #default="scope">
              <el-button type="primary" @click="handlePay(scope.$index, scope.row)"
                         :disabled="scope.row.state != '未看诊'">
                支付
              </el-button>
              <el-button type="primary" @click="handleConsume(scope.$index, scope.row);dialogVisible = true">
                处置订单
              </el-button>
              <el-button type="danger" @click="handleUnPay(scope.$index, scope.row)"
                         :disabled="scope.row.state == '就诊中' || scope.row.state == '退号'">
                退费
              </el-button>
            </template>
          </el-table-column>
        </el-table>

      <el-dialog v-model="dialogVisible"
                 title="处置支付状态"
                 style="{width:100%;height:300px}">
        <div>
          <p><b>当前患者处置信息</b></p>
          <el-table :data="presentConsume">
            <el-table-column type="index" />
            <el-table-column label="处置名" prop="costName" />
            <el-table-column label="价格" prop="price" />
            <el-table-column label="时间" prop="time" />
            <el-table-column label="支付状态" prop="payment"
                             :formatter="row => row.payment == 1 ? '已支付' : '未支付'" />
            <el-table-column label="执行状态" prop="execute"
                             :formatter="row => row.execute == 1 ? '已执行' : '未执行'" />
            <el-table-column align="right" label="操作" v-if="editVisable">
              <template #default="scope">
                <el-button type="primary" @click="handleConsumePay(scope.row)"
                           :disabled="scope.row.payment == 1">
                  支付
                </el-button>
                <el-button type="danger" @click="handleConsumeUnPay(scope.row)"
                           :disabled="scope.row.payment == 1 && scope.row.execute == 1">
                  退费
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">
              关闭
            </el-button>
          </span>
        </template>
      </el-dialog>
    </el-main>
  </div>
</template>

<script>
import http from '@/axios/http'
export default {
  name: "OutPatientManage",
  data() {
    return {
      // 当前登录用户信息
      userInfo: {},
      // 所有挂号信息
      patient: [],
      // 当前患者的所有处置订单信息
      presentConsume: [],
      // 前端查询用字段
      searchString: '',
      // 处置订单对话框显示标签
      dialogVisible: false,
      // 处置订单对话框操作栏显示标签
      editVisable: true
    }
  },
  methods: {
    //当前页面跳转回主页面
    returnMain() {
      console.log("run")
      this.$router.push('/outpatient')
    },
    // 获取所有病人信息
    getPatient() {
      http.get('/patients/')
          .then(response => {
            this.patient = response.data.data
          })
    },
    // 交费按钮
    // 1. 缴费修改成功:输出一条消息
    // 2. 调用接口刷新patient
    handlePay(index, row) {
      // 1.
      http.get('/patients/pay/'+ row.id)
          .then(response => {
            if (response.data.code == 'SUCCESS') {
              this.$message.success("缴费成功")
              // 2.
              this.getPatient()
            }
          })
    },
    // 退费按钮
    // 1. 二次确认退费消息
    // 2. 确认后,调用退费接口
    // 3. 调用接口刷新patient
    handleUnPay(index,row) {
      // 1.
      this.$confirm('与门诊医生确认后退费？', '注意', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 2.
        http.get('/patients/unpay/'+ row.id)
            .then(response => {
              if (response.data.code == 'SUCCESS') {
                this.$message.success("退费成功")
                // 3.
                this.getPatient()
              }
            })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    // 查询当前患者的处置信息
    // 1. 调用接口查询当前患者consume处置信息
    // 2. 如果该患者的状态不是就诊中,不显示操作按钮
    handleConsume(index,row) {
      // 1.
      http.get('/patients/consume/'+row.recordId)
          .then(response => {
            this.presentConsume = response.data.data
          })
      // 2.
      if (row.state != '就诊中') {
        this.editVisable = false
      } else {
        this.editVisable = true
      }
    },
    // 支付consume
    // 1. 调用支付接口
    // 2. 重新查询一次当前consume列表
    handleConsumePay(row) {
      // 1.
      http.get('/patients/consume/pay/'+ row.id)
          .then(response => {
            if (response.data.code == 'SUCCESS') {
              this.$message.success("缴费成功")
            }
          })
      // 2.
      http.get('/patients/consume/'+row.recordId)
          .then(response => {
            this.presentConsume = response.data.data
          })
      this.dialogVisible = false;
    },
    // 退费consume
    // 1. 调用退费接口
    // 2. 重新查询一次当前consume列表
    handleConsumeUnPay(row) {
      this.$confirm('与门诊医生确认后退费？', '注意', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        http.get('/patients/consume/back/'+ row.id)
            .then(response => {
              console.log(response.data)
              if (response.data.code == 'SUCCESS') {
                this.$message.success("退费成功")
              } else {
                this.$message.error(response.data.msg)
              }
            })
        this.dialogVisible = false;
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    }
  },
  // 1. 初始化写入登录数据
  // 2. 查询一次挂号信息数据
  created(){
    // 1.
    this.userInfo = JSON.parse(sessionStorage.getItem("userinfo"));
    // 2.
    http.get('/patients/')
        .then(response => {
          this.patient = response.data.data
        })
  }
}
</script>

<style scoped>

</style>