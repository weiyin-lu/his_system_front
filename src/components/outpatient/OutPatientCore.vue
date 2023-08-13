<template>
  <div class="register">

      <el-header style="text-align: right"><!--页面头部-->
        <span style="float: left;font-size: 20px;">现场挂号页面</span><!--头部最左侧显示当前页面名称-->
         <!--最右侧首先显示当前用户名称,由登陆界面传输当前用户信息,同时与右侧按钮通过margin-right保持一定距离-->
        <span style="font-size: 15px; margin-right:15px">{{userInfo.name}}</span>
        <!--通过带有返回主页图标的按钮实现返回主页面操作-->
        <el-button type="primary" style="height:40px; width:40px;" circle @click="addRoutes1">
          <el-icon color="#FFFFFF">
            <Back />
          </el-icon>
        </el-button>
    </el-header>

    <!--页面主体部分主要实现用户信息输入操作-->
    <el-main style="text-align: left; height:100%; width:100%;">
      <el-row type="flex" justify="start"><!--显示系统生成信息,在created初始化-->
        <el-col :span="7">
          <!--显示看诊日期-->
          <span style="font-size: 20px">看诊日期:</span>
          <!--“看诊日期”为当前日期,不可修改-->
          <el-date-picker v-model="today" :disabled="true" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-col>
        <el-col :span="7">
          <!--显示午别-->
          <span style="font-size: 20px">午别:</span>
          <!--午别为当前午别，该信息不可修改,12点前是上午,12点后是下午-->
          <el-tag effect="plain" type="info" style="font-size:15px;width:210px;">
            {{patient.noon}}
          </el-tag>
        </el-col>
      </el-row>

      <!--分割线-->
      <el-divider style="font-size:15px" />

      <el-row>
        <el-col :span="9">
          <!--用红色*号表示必须填写的信息-->
          <span style="color:red">*</span>
          <span>病历号:</span>
          <el-input  round clearable v-model="patient.recordId" style="width:300px" maxlength="10" show-word-limit>
          </el-input>
        </el-col>

        <el-col :span="6">
          <!--用红色*号表示必须填写的信息-->
          <span style="color:red">*</span>
          <span>姓名: </span>
          <el-input placeholder="请输入姓名" v-model="patient.name" style="width:150px" clearable>
          </el-input>
        </el-col>

        <el-col :span="6">
          <!--用红色*号表示必须填写的信息-->
          <span style="color:red">*</span>
          <span>性别: </span>
          <span>
            <!--用单选框判断性别,默认为男性,此处不会出现错误,故不需要判断-->
            <el-radio v-model="patient.gender" label="男" border style="width:100px">男
            </el-radio>
            <el-radio v-model="patient.gender" label="女" border style="width:100px">女
            </el-radio>
          </span>
        </el-col>
      </el-row>

      <el-row :span="24">
          <span>身份证号: </span>
          <el-input placeholder="请输入身份证号" v-model="patient.patientId" style="width:287px" clearable>
          </el-input>
          <!--身份证号为非必填项,但其本身存在标准限制,因此如果存在填写信息仍需要进行判断-->
      </el-row>

      <el-row :span="24">
          <!--家庭地址为非必填项,此处对填入信息不做判断-->
          <span>家庭地址: </span>
          <el-input placeholder="请输入家庭地址" v-model="patient.address" style="width:287px" clearable>
          </el-input>
      </el-row>

      <el-row>
        <el-col :span="9">
        <!--用红色*号表示必须填写的信息-->
        <span style="color:red">*</span>
        <span>出生日期:</span>
        <span>
          <!--通过Element中的日期选择器选择日期birthday，其返回格式为yyyy-MM-dd-->
          <el-date-picker
              v-model="patient.birthday"
              type="date"
              placeholder="选择日期">
          </el-date-picker>
        </span>
        </el-col>
        <el-col :span="6">
          <!--用红色*号表示必须填写的信息-->
          <span style="color:red">*</span>
          <span>结算类别: </span>
          <span>
            <!--通过选择器选择支付类型，默认为现金支付，此处应无错误发生-->
            <el-select v-model="patient.setCategory" placeholder="请选择结算类别">
            <el-option v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
            </el-option>
            </el-select>
          </span>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="15">
          <!--用红色*号表示必须填写的信息-->
          <span style="color:red">*</span>
          <span class="demonstration">看诊医生：</span>
<!--          选择器选择看诊医生，此处有不及时更新v-model值的问题-->
          <el-select style="width:390px" class="m-2"
                     v-model="presentDoctor" value-key="presentDoctor.docId"
                     placeholder="选择医生" @change="inputdata">
            <el-option v-for="(item,index) in doctorInfo"
                       :key="index"
                       :label="item.name"
                       :value="item"/>
          </el-select>
        </el-col>
      </el-row>

       <el-row>
        <span style="color:red; margin-right:15px">挂号金额:</span>
        <!--挂号金额通过挂号级别／科室／医生和是否需要病例本综合计算得出，不可修改-->
        <el-tag effect="plain" type="danger" style="font-size:15px;width:200px;">
          {{ patient.cost }}
        </el-tag>
      </el-row>
    </el-main>

    <el-footer style="text-align: center">
      <el-button type="primary" style="height:70px; width:100px;margin-right:30px" plain round @click="open">
        <i class="el-icon-finished" style="font-size: 30px;"></i>
        <div style="font-size: 15px;">挂号</div>
      </el-button>
      <el-button style="height:70px; width:100px;" plain round @click="empty">
        <i class="el-icon-delete" style="font-size: 30px;"></i>
        <div style="font-size: 15px;">清空</div>
      </el-button>
    </el-footer>
  </div>
</template>

<script type="text/javascript">
import axios from 'axios'
import http from "@/axios/http";
export default {
  components: {
  },
  name: 'OurtPatientCore',
  data () {
    return {
      // 挂号信息传递对象
      patient: {
        recordId:'',
        name:'',
        gender: '',
        birthday: '',
        age: '',
        patientId:'',
        address:'',
        docId:'',
        deptId:'',
        regLevel:'',
        cost:null,
        noon:'',
        setCategory:''
      },
      // 表单选中的医生信息
      presentDoctor:{
        docId:null,
        password:"",
        name:"",
        deptId:null,
        userType:"",
        title:"",
        schedule:null,
        regId:null,
        status:null
      },
      // 当前登录用户信息
      userInfo:{},
      //当天日期
      today:'',
      // 支付选项列表
      options: [{//支付选项列表
          value: '现金支付',
          label: '现金支付'
        }, {
          value: '信用卡支付',
          label: '信用卡支付'
        }, {
          value: '支付宝支付',
          label: '支付宝支付'
        }, {
          value: '微信支付',
          label: '微信支付'
        }, {
          value: '网银支付',
          label: '网银支付'
        }],
      // 挂号医生的信息
      doctorInfo:[],
     //  挂号等级信息
      register:[]
     }
  },

  created(){
    // 1.获取登录userInfo数据
    // 2.获取当前日期
    // 3. 自动生成上下午状态
    // 4. 查询门诊医生的列表，写入到doctorInfo
    // 5. 查询挂号等级，存入register
    let _this = this;
    // 1.
    this.userInfo = JSON.parse(sessionStorage.getItem('userinfo'))
    // 2.
    let date = new Date();
    let year = date.getFullYear(); // 年
    let month = date.getMonth() + 1; // 月
    let day = date.getDate(); // 日
    let hour = date.getHours();//小时
    this.today=`${year}-${month}-${day}`;
    // 3.
    if(hour<12){
      this.patient.noon = "上午";
    }else {
      this.patient.noon = "下午";
    }
    // 4.
    let condition = {
      user_type: '门诊医生'
    }
    http.post("/doctors/searchByCondi",condition)
        .then(response => {
          _this.doctorInfo = response.data.data
        })
    // 5.
    http.get('/registers/')
        .then(response => {
          _this.register = response.data.data
        })
  },

  methods: {
    //当前页面跳转回主页面
    addRoutes1 () {
      this.$router.push('/outpatient')
    },
    // 把regLevel docId deptId cost写入到待插入对象里
    inputdata(value) {
      console.log(value)
      this.patient.docId = value.docId
      this.patient.deptId = value.deptId
      let now = this.register.filter(item => {return item.regId == value.regId})
      this.patient.regLevel = now[0].regLevel
      this.patient.cost = now[0].regCost
    },
    // 插入挂号记录
    open() {
      http.put('/patients/',this.patient)
          .then(response => {
            console.log(response.data)
          })
    },
    //通过刷新页面实现清空
    empty(){
      this.$router.go(0)
    }
  },
}
</script>

<style>
  .el-header {
    width: 100%;
    background-color: lightskyblue;
    color: black;
    line-height: 60px;
  }

  .el-row {
    margin-bottom: 20px;
  }
  .el-row.last-child {
      margin-bottom: 0;
    }
  .el-col {
    border-radius: 6px;
  }
</style>
