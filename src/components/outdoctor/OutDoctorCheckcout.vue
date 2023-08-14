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
      <el-table :data="consumedList" height="300px">
        <el-table-column type="index" />
        <el-table-column label="项目名" prop="costName"/>
        <el-table-column label="开立时间" prop="time" :formatter="dateFormat"/>
        <el-table-column label="检查目的" prop="aim" />
        <el-table-column label="检查位置" prop="body" />
        <el-table-column label="检查结果" prop="results" />
      </el-table>
    </el-row>
    <el-row style="text-align: left">
      <el-tag style="margin-left: auto;background-color: lightblue;color: white;margin-top: 15px">选择项目
      </el-tag>
      <el-table :data="noDrugList.filter(data => !searchString || data.name.includes(searchString))"
                highlight-current-row @current-change="inputPresent" height="300px">
        <el-table-column type="index" />
        <el-table-column label="标签" prop="code" />
        <el-table-column label="名称" prop="name" />
        <el-table-column label="单位" prop="standard" />
        <el-table-column label="价格" prop="price" />
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
      <el-tag style="margin-left: auto;background-color: lightblue;color: white;margin-top: 15px">检查备注
      </el-tag>
    </el-row>
    <el-row style="margin-left: 10px;margin-top: 20px">
      <el-tag style="width: 70px">检查目的</el-tag>
      <el-input clearable v-model.trim="consume.aim" style="width: 500px;margin-left: 50px" />
    </el-row>
    <el-row style="margin-left: 10px;margin-top: 20px">
      <el-tag style="width: 70px">检查位置</el-tag>
      <el-input clearable v-model.trim="consume.body" style="width: 500px;margin-left: 50px" />
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
  name: 'OutDoctorCheckout',
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
        number:null,
        amount:null,
        type:'',
        subject:'',
        prescription:'',
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
      noDrugList:[],
      // 所有处置列表里的查询信息
      searchString: ''
    }
  },
  // 1. 从sessionstorage获取userinfo信息，从store获取当前病人recordId，写入到子组件对象里
  // 2. 查询当前病人已有的医技信息,存入对象
  // 3. 查询所有有效的医技处理方案,存入对象
  created() {
    // 1.
    let patient = this.$store.state.presentPatient
    this.consume.recordId = patient.recordId
    this.presentPatient = patient;
    // 2.
    http.get('/checkouts/'+ this.presentPatient.recordId)
        .then(response => {
          this.consumedList = response.data.data
        })
    // 3.
    http.get('/checkouts/manage/')
        .then(response => {
          this.noDrugList = response.data.data
        })
  },
  // /checkouts/manage/ 查询所有有效医技列表
  //  /checkouts/{recordId} 展示有需要处理医技信息的病人概要信息
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
    // 将当前选择的处置填入consume对象
    inputPresent(value) {
      this.consume.costName = value.name
      this.consume.price = value.price
      this.consume.deptId = value.deptId
      this.consume.type = '检查'
      this.consume.subject = value.subject
    },
    // 调用接口,提交当前consume的所有信息
    commit() {
      http.put('/outdoctors/consume/',this.consume)
          .then(response => {
            console.log(response.data)
          })
    },
    clear() {

    },
  }
}
</script>

<style scoped>

</style>
