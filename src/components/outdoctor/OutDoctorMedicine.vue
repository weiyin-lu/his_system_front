<template>
  <el-main>
    <el-tag style="text-align: center;background-color: #409EFF;width: 100%;height: auto">
      <el-button id="commmit" type="primary" style="margin-left: 60px" @click="commit">
        <el-icon color="#FFFFFF">
          <Check />
        </el-icon>
        提交
      </el-button>
      <el-button id="clear" type="primary" icon="el-icon-delete-solid"  style="margin-left: 60px" @click="clear">
        <el-icon color="#FFFFFF">
          <Close />
        </el-icon>
        清空
      </el-button>
    </el-tag>
    <el-row style="text-align: left">
      <el-tag style="margin-left: auto;background-color: lightblue;color: white;margin-top: 15px">已有项目
      </el-tag>
      <el-table :data="consumedList" height="300px" empty-text="暂无项目">
        <el-table-column type="index" />
        <el-table-column label="项目名" prop="costName"/>
        <el-table-column label="开立时间" prop="time" :formatter="dateFormat"/>
        <el-table-column label="用法" prop="useage" />
        <el-table-column label="用量" prop="consumption" />
        <el-table-column label="频次" prop="frequency" />
      </el-table>
    </el-row>
    <el-row style="text-align: left">
      <el-tag style="margin-left: auto;background-color: lightblue;color: white;margin-top: 15px">选择项目
      </el-tag>
      <el-table :data="medicineList.filter(data => !searchString || data.name.includes(searchString))"
                highlight-current-row @current-change="inputPresent" height="300px">
        <el-table-column type="index" />
        <el-table-column label="标签" prop="code" />
        <el-table-column label="名称" prop="name" />
        <el-table-column label="单位" prop="standard" />
        <el-table-column label="价格" prop="cost" />
        <el-table-column align="center">
          <template #header>
            <el-input v-model="searchString" size="small" placeholder="查找处置" />
          </template>
          <template #default="scope" >
            <el-button type="primary">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row style="text-align: left">
      <el-tag style="margin-left: auto;background-color: lightblue;color: white;margin-top: 15px">医生处方
      </el-tag>
    </el-row>
    <el-row style="margin-left: 10px;margin-top: 20px">
      <el-tag style="width: 70px">数量</el-tag>
      <el-input-number clearable v-model.trim="consume.number" style="width: 500px;margin-left: 50px"
                @change="calculate" />
    </el-row>
    <el-row style="margin-left: 10px;margin-top: 20px">
      <el-tag style="width: 70px">用法</el-tag>
      <el-input clearable v-model.trim="consume.useage" style="width: 500px;margin-left: 50px" />
    </el-row>
    <el-row style="margin-left: 10px;margin-top: 20px">
      <el-tag style="width: 70px">用量</el-tag>
      <el-input clearable v-model.trim="consume.consumption" style="width: 500px;margin-left: 50px" />
    </el-row>
    <el-row style="margin-left: 10px;margin-top: 20px">
    <el-tag style="width: 70px">频次</el-tag>
    <el-input clearable v-model.trim="consume.frequency" style="width: 500px;margin-left: 50px" />
    </el-row>
    <el-row style="margin-left: 10px;margin-top: 20px">
      <el-tag style="width: 70px;margin-right: 50px">药品信息</el-tag>
      <el-tag type="success" style="margin-right: 50px;font-size: 15px">{{ medicineMsg }}</el-tag>
    </el-row>
    <el-row style="margin-left: 10px;margin-top: 20px">
      <el-tag style="width: 70px;margin-right: 50px">订单费用</el-tag>
      <el-tag type="success" style="margin-right: 50px;font-size: 15px">{{ this.consume.price }}元</el-tag>
    </el-row>
    <el-row style="text-align: center;margin-top: 20px">
      <el-icon color="#FFFFFF">
        <Select />
      </el-icon>
      <el-button type="primary" @click="commit">提交</el-button>
    </el-row>
  </el-main>
</template>

<script>
import http from '@/axios/http'
export default {
  name: 'OutDoctorMedicine',
  data () {
    return{
      // 待插入信息的consume对象
      consume: {
        id:null,
        recordId:null,
        costName:'',
        price:null,
        deptId:null,
        charge:null,
        number:1,
        type:'',
        subject:'',
        useage:'',
        aim: '',
        consumption:'',
        frequency:'',
      },
      // 当前选择的病人的信息
      presentPatient: {},
      // 已有的医技处理信息列表
      consumedList: [],
      // 所有医技处理方案的列表
      medicineList:[],
      // 所有部门信息的列表
      deptList:[],
      // 所有处置列表里的查询信息
      searchString: '',
      // 展示当前选中的处置信息的消息
      medicineMsg: ''
    }
  },
  // 1. 从sessionstorage获取userinfo信息，从store获取当前病人recordId，写入到子组件对象里
  // 2. 如果当前病人的recordId存在，查询当前病人已有的医技信息,存入对象
  // 3. 查询所有有效的医技处理方案,存入对象
  created() {
    // 1.
    let patient = this.$store.state.presentPatient
    this.consume.recordId = patient.recordId
    this.presentPatient = patient;
    // 2.
    if (this.presentPatient.recordId != undefined) {
      http.get('/medicines/'+ this.presentPatient.recordId)
          .then(response => {
            this.consumedList = response.data.data
          })
    }
    // 3.
    http.get('/medicines/manage/')
        .then(response => {
          this.medicineList = response.data.data
        })
  },
  methods: {
    //   日期格式化方法
    dateFormat(row, column) {
      // 获取单元格数据
      let data = row.time
      if(data == null) {
        return null
      }
      let dt = new Date(data)
      return dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate() + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds()
    },
    // 1. 将当前选择的处置填入consume对象
    // 2. 将当前选择的处置组成消息写入nodrugMsg,需要通过deptList获取其对应科室名
    inputPresent(value) {
      // 1.
      this.consume.costName = value.name
      this.consume.price = value.cost
      this.consume.deptId = value.deptId
      this.consume.type = value.type
      this.consume.subject = value.subject
      // 2.
      this.medicineMsg = this.consume.costName + ' - ' + this.consume.type
    },
    // 计算药品总价
    calculate(value) {
      console.log(value)
      this.consume.price *= value
    },
    // 调用接口,提交当前consume的所有信息，recordId必须选中
    commit() {
      if (this.consume.recordId != null) {
        http.put('/outdoctors/consume/',this.consume)
            .then(response => {
              this.$message.success("项目添加成功")
            })
      } else {
        this.$message.error("请先选择病人！")
      }
    },
    // 清空输入的数据
    clear() {
      this.consume.aim = ''
      this.consume.body = ''
      this.consume.costName = ''
      this.consume.price = null
      this.consume.deptId = null
      this.consume.type = ''
      this.consume.subject = ''
      this.medicineMsg = ''
    },
  }
}
</script>

<style scoped>

</style>
