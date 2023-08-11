<template>
  <div class="register">

      <el-header style="text-align: right"><!--页面头部-->
        <span style="float: left;font-size: 20px;">现场挂号页面</span><!--头部最左侧显示当前页面名称-->
         <!--最右侧首先显示当前用户名称,由登陆界面传输当前用户信息,同时与右侧按钮通过margin-right保持一定距离-->
        <span style="font-size: 15px; margin-right:15px">{{userName}}</span>
        <!--通过带有返回主页图标的按钮实现返回主页面操作-->
        <el-button type="primary" style="height:40px; width:40px;" circle @click="addRoutes1">
          <i class="el-icon-s-home" circle style="margin-right: 30px"></i>
        </el-button>
    </el-header>

    <!--页面主体部分主要实现用户信息输入操作-->
    <el-main style="text-align: left; height:100%; width:100%;">
      <el-row type="flex" justify="start"><!--显示系统生成信息,在created初始化-->
        <el-col :span="10"><!--显示发票号-->
          <span style="font-size: 20px;margin-right:10px">发票号:</span>
          <!--通过标签显示发票号-->
          <el-tag effect="plain" type="info" style="font-size:15px;width:210px;margin-right:30px">
            {{billId}}
          </el-tag>
          <!--通过按钮更新发票号，此处需要注意发票号位数和是否为空-->
          <el-button type="primary" plain round @click="inputNewBillId='';showBillError=false;dialogFormVisible=true" style="margin-right:30px">
            <i class=" el-icon-refresh-right">更新发票号</i>
          </el-button>

          <!--嵌套输入框-->
          <el-dialog title="更新发票号" :visible.sync="dialogFormVisible">
            <el-form>
              <el-form-item label="输入发票号" label-width="formLabelWidth">
                <el-input v-model="inputNewBillId" autocomplete="off"
                oninput = "value=value.replace(/[^\d]/g,'')"  maxlength="10" show-word-limit>
                </el-input>
              </el-form-item>
              <span v-show="showBillError">
                <i class="el-icon-error" style="font-size: 15px; color: red">{{billError}}</i>
              </span>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false;showBillError = false;inputNewBillId = ''">
                取 消
              </el-button>
              <el-button type="primary" @click="updateBill">确 定</el-button>
            </div>
          </el-dialog>

        </el-col>
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
            {{noon}}
          </el-tag>
        </el-col>
      </el-row>

      <!--包含发票号的分割线-->
      <el-divider style="font-size:15px">发票号:{{billId}}</el-divider>

      <el-row>
        <el-col :span="9">
          <!--用红色*号表示必须填写的信息-->
          <span style="color:red">*</span>
          <span>病历号:</span>
          <el-input  round clearable v-model="record_Id" style="width:300px"  @blur="changeRecordId"
           oninput = "value=value.replace(/[^\d]/g,'')"  maxlength="10" show-word-limit>
          </el-input>
          <!--如果修改后病历号重复,则需要通过showRecIdError显示病历号重复的错误提示-->
          <span v-show="showRecIdError">
            <i class="el-icon-error" style="font-size: 15px; color: red">{{recIdErrorMsg}}</i>
          </span>
        </el-col>
        <el-col :span="6">
          <!--用红色*号表示必须填写的信息-->
          <span style="color:red">*</span>
          <span>姓名: </span>
          <el-input placeholder="请输入姓名" v-model="name" style="width:150px" clearable :disabled="searchSame">
          </el-input>
          <!--如果点击保存按钮时输入姓名name为空,则需要通过showNameMissing显示未填写姓名的错误提示-->
          <span v-show="showNameMissing">
            <i class="el-icon-error" style="font-size: 15px; color: red">未填写姓名</i>
          </span>
        </el-col>
        <el-col :span="6">
          <!--用红色*号表示必须填写的信息-->
          <span style="color:red">*</span>
          <span>性别: </span>
          <span>
            <!--用单选框判断性别,默认为男性,此处不会出现错误,故不需要判断-->
            <el-radio v-model="gender" :disabled="searchSame" label="1" border style="width:100px">男
            </el-radio>
            <el-radio v-model="gender" :disabled="searchSame" label="2" border style="width:100px">女
            </el-radio>
          </span>
        </el-col>
      </el-row>

      <el-row :span="24">
          <span>身份证号: </span>
          <el-input placeholder="请输入身份证号" v-model="ID" style="width:287px" clearable>
          </el-input>
          <!--身份证号为非必填项,但其本身存在标准限制,因此如果存在填写信息仍需要进行判断-->
          <span v-show="showIdError">
            <i class="el-icon-error" style="font-size: 15px; color: red">{{IdErrorMessage}}</i>
          </span>
      </el-row>

      <el-row :span="24">
          <!--家庭地址为非必填项,此处对填入信息不做判断-->
          <span>家庭地址: </span>
          <el-input placeholder="请输入家庭地址" v-model="address" style="width:287px" clearable>
          </el-input>
      </el-row>

      <el-row>
        <el-col :span="9">
        <!--用红色*号表示必须填写的信息-->
        <span style="color:red">*</span>
        <span>出生日期:</span>
        <span>
          <!--通过Element中的日期选择器选择日期birthday，其返回格式为yyyy-MM-dd-->
          <el-date-picker v-model="birthday" type="date" placeholder="选择日期" style="width:284px" :disabled="searchSame"
                          value-format="yyyy-MM-dd" >
          </el-date-picker>
        </span>
        <!--需要在保存结果时首先检查是否填写日期, 而后判断日期是否早于当前时间,填写合法日期后自动计算得出年龄age-->
        <span v-show="showBirthdayError">
            <i class="el-icon-error" style="font-size: 15px; color: red">{{birthdayError}}</i>
        </span>
        </el-col>
        <el-col :span="6">
          <!--用红色*号表示必须填写的信息-->
          <span style="color:red">*</span>
          <span>年龄: </span>
          <!--手动填写年龄，或通过之前填写的生日信息自动计算得出年龄-->
          <el-input placeholder="请输入年龄" clearable v-model="age" style="width:150px" :disabled="searchSame"
          oninput = "value=value.replace(/[^\d]/g,'')">
          </el-input>
          <!--需要在保存结果时首先检查是否填写年龄, 而后判断年龄合法性,填写合法年龄后自动计算得出年份,日期默认为当前日期-->
          <span v-show="showAgeError">
            <i class="el-icon-error" style="font-size: 15px; color: red">{{ageError}}</i>
          </span>
        </el-col>
        <el-col :span="6">
          <!--用红色*号表示必须填写的信息-->
          <span style="color:red">*</span>
          <span>结算类别: </span>
          <span>
            <!--通过选择器选择支付类型，默认为现金支付，此处应无错误发生-->
            <el-select v-model="type" placeholder="请选择结算类别">
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
          <!--
            通过级联选择器选择挂号级别/挂号科室和看诊医生，
            首先需要判断是否填写了该信息，
            然后判断对应挂号医生挂号人是否满，
            如果满员则显示对应错误信息
          -->
          <span class="demonstration">挂号级别／挂号科室／看诊医生：</span>
          <el-cascader style="width:390px"
                      ref="cascaderAddr"
                      placeholder="试试搜索：李医生"
                      v-model="deptDocs"
                      :options="Doc"
                      filterable></el-cascader>
           <span v-show="showDocError">
            <i class="el-icon-error" style="font-size: 15px; color: red">{{docError}}</i>
          </span>
        </el-col>
        <el-col :span="8">
          <!--用红色*号表示必须填写的信息-->
          <span style="color:red">*</span>
          <!--通过选择器选择支付类型，默认为需要病例本，此处应无错误发生-->
          <span>是否需要病例本: </span>
          <span>
            <el-radio v-model="book" label="1" border style="width:100px">是</el-radio>
            <el-radio v-model="book" label="2" border style="width:100px">否</el-radio>
          </span>
        </el-col>
      </el-row>

       <el-row>
        <span style="color:red; margin-right:15px">挂号金额:</span>
        <!--挂号金额通过挂号级别／科室／医生和是否需要病例本综合计算得出，不可修改-->
        <el-tag effect="plain" type="danger" style="font-size:15px;width:200px;">
          {{money}}
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

export default {
  components: {
  },
  name: 'Register',
  data () {
    return {
      billId:'',//发票号
      inputNewBillId:'',//输入的更新发票号
      today:'',//当天日期
      noon:'',//午别
      userName:'',//当前操作医生姓名
      preRecId:'',//preRecId记录最原始的病历号，以便在清空时赋予病历号原始值
      record_Id: '',//病历号
      name: '',//病人姓名
      ID: '',//身份证号
      address: '',//地址
      searchSame: false,
      gender: '1',//年龄选项，1为男性，2为女性
      book: '1',//是否需要病例本，1为需要(支付金额需+1), 2为不需要
      birthday: '',//出生日期
      age: '',//年龄
      money:1,//支付金额
      showBillError: false,//是否存在发票号错误
      showRecIdError: false,//是否存在病历号错误
      showNameMissing: false,//是否填写姓名
      showBirthdayError: false,//出生日期是否存在错误
      showAgeError: false,//年龄是否存在错误
      showDocError: false,//挂号医生信息是否出现错误
      showIdError: false,//身份证号是否出现错误
      dialogFormVisible: false,//打开嵌套输入框
      billError:'输入位数不足',//输入发票号错误时显示的提示信息
      recIdErrorMsg:'病历号为空',//病历号信息错误时显示的提示信息
      docError: '未填写该信息',//挂号医生信息错误时显示的提示信息
      birthdayError: '未填写出生日期',//出生日期错误时显示的提示信息
      IdErrorMessage:'身份证号存在错误',//身份证号错误时显示的提示信息
      ageError: '未填写年龄',//年龄错误时显示的提示信息
      deptDocs:'',//级联表中选择的挂号级别，挂号科室和挂号医生的信息数组
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
        type: '现金支付',//默认选择现金支付选项
        Doc:[]//挂号医生级联表等信息
     }
  },

  created: function(){//初始化阶段
    let _this = this;
    axios.get("http://localhost:20910/patient/getDocNameById/"+this.$store.state.docId).then(function (resp){
      _this.userName =  resp.data;
    })
    axios.get("http://localhost:20910/register/getMaxPlusOne").then(function(resp){
      _this.preRecId = resp.data;
      _this.record_Id= resp.data;
    });//记录当前病历号+1
    axios.get("http://localhost:20910/receipt/getMaxPlusOne").then(function(resp){
      _this.billId = resp.data;
    });//首先通过调用数据库中最大值+1生成
    let date = new Date();
    let year = date.getFullYear(); // 年
    let month = date.getMonth() + 1; // 月
    let day = date.getDate(); // 日
    let hour = date.getHours();//小时
    this.today=`${year}-${month}-${day}`;
    this.searchSame = false;
    if(hour<12){
      this.noon="上午";
      axios.get("http://localhost:20910/register/doctorArrange/"+this.today+'/'+0).then(function(resp){
        _this.Doc = resp.data;
      })//调用数据库找到当前值班医生信息
    }else{
      this.noon="下午";
      axios.get("http://localhost:20910/register/doctorArrange/"+this.today+'/'+1).then(function(resp){
        _this.Doc = resp.data;
      })//调用数据库找到当前值班医生信息
    }
  },

  methods: {
    addRoutes1 () {//当前页面跳转回主页面
      this.$router.push('/chargeHomePage')
    },

    async updateBill(){
      if(this.inputNewBillId===null||this.inputNewBillId.length===0){
        this.showBillError = true;
        this.billError = '输入更新发票号位数不能为空';
      }
      else if(this.inputNewBillId.length>10){//输入更新发票号位数大于10
        this.showBillError = true;
        this.billError = '输入更新发票号位数应小于10位';
      }
      else{
        let _this = this;
        console.log(this.inputNewBillId);
        await axios.get("http://localhost:20910/receipt/searchForId/"+this.inputNewBillId).then(function(resp){
          _this.showBillError = resp.data;
        })
        if(this.showBillError===true){
          this.billError = '发票号存在重复';
        }
        else{
          this.dialogFormVisible = false;
          this.$message({
              type: 'success',
              message: '更新成功!'
          })
          this.billId = this.inputNewBillId;
        }
      }
    },

    changeRecordId(){
      if(this.record_Id===''){//病历号为空
        this.showRecIdError=true;
        this.recIdErrorMsg='病历号为空';
      }
      else if(this.record_Id!==this.preRecId){
        this.showRecIdError=false;
        let _this = this;
        axios.get("http://localhost:20910/register/searchSameInfo/"+this.record_Id).then(function(resp){
          console.log(resp.data);
          if(resp.data.length!==0){
            _this.$message({
              message: '存在原病历号，请仔细核对病人信息',
              type: 'warning'
            });
            _this.name = resp.data[0][0];
            if(resp.data[0][1]==='男'){
              _this.gender = '1';
            }
            else{
              _this.gender = '2';
            }
            _this.birthday = resp.data[0][2];
            _this.searchSame = true;
          }
          else{
            _this.name = '';
            _this.birthday = '';
            _this.gender = '1';
            _this.searchSame = false;
          }
        })
      }
    },

    async open() {
      let _this = this;
      if(this.record_Id===''){//病历号为空
        this.showRecIdError=true;
        this.recIdErrorMsg='病历号为空';
      }
      else{
        this.showRecIdError=false;
      }
      this.showNameMissing = this.name === '';
      if(this.ID===''){//身份证号为非必填项，可以为空
        this.showIdError=false;
      }
      else if(this.ID.length!==18){//若身份证号长度不足18位
        this.showIdError=true;
        this.IdErrorMessage = '身份证号长度错误';
      }
      //判断身份证号有效性，额外如果有需要的话还需要与出生日期进行对比
      else{
        let err = false;
        let position = 0;
        while(position<17){
          if(this.ID.charAt(position)<'0'||this.ID.charAt(position)>'9'){
            err = true;
            break;
          }
          position++;
        }
        if(this.ID.charAt(17)!=='x'&&this.ID.charAt(17)!=='X'&&(this.ID.charAt(17)<'0'||this.ID.charAt(17)>'9')){
          err = true;
        }
        if(err===true){
          this.showIdError=true;
          this.IdErrorMessage = '身份证号有误';
        }
        else{
          this.showIdError=false;
          let year = parseInt(this.ID.charAt(6))*1000+parseInt(this.ID.charAt(7))*100+parseInt(this.ID.charAt(8))*10+parseInt(this.ID.charAt(9));
          let month =  parseInt(this.ID.charAt(10))*10+parseInt(this.ID.charAt(11));
          let day =  parseInt(this.ID.charAt(12))*10+parseInt(this.ID.charAt(13));
          if(this.birthday!==''&&this.birthday!=='${year}-${month}-${day}'){
            this.$message({
              message: '身份证号生日与输入生日不同，请询问原因',
              type: 'warning'
            });
          }
        }
      }
      if(this.birthday===''){//出生日期为空
        this.showBirthdayError=true;
        this.birthdayError='未填写出生日期';
      }
      else{//出生日期早于当前日期,年龄在0~150岁之间,为合法输入
        let date = new Date();
        let year = date.getFullYear(); // 年
        let month = date.getMonth() + 1; // 月
        let day = date.getDate(); // 日
        if((year-parseInt(this.birthday.substring(0,4)))>=0&&
          (year-parseInt(this.birthday.substring(0,4))<=150)&&
        ((Date.parse(`${year}-${month}-${day}`)>Date.parse(this.birthday))||
        (year===parseInt(this.birthday.substring(0,4))&&
        month===parseInt(this.birthday.substring(5,7))&&
        day ===parseInt(this.birthday.substring(8,10))))){
          this.showBirthdayError=false;
        }
        else{//其他非法输入情况
          this.showBirthdayError=true;
          this.birthdayError='出生日期错误';
        }
      }
      if(this.age.length===0){//未填写年龄
        this.showAgeError=true;
        this.ageError='未填写年龄';
      }
      else if(this.age<0||this.age>150){//年龄错误
        this.showAgeError=true;
        this.ageError = '年龄错误';
      }
      else{
        this.showAgeError=false;
      }
      if(this.deptDocs===''){//未填写挂号医生等信息
        this.showDocError=true;
        this.docError='未填写信息';
      }
      else{
        //判断医生挂号人数是否已满
        await axios.get("http://localhost:20910/register/checkFull/"+this.deptDocs[2]+"/"+this.deptDocs[0])
        .then(function(resp){
          _this.showDocError=resp.data;
        });
        if(this.showDocError===true){
          this.docError='该医生挂号人数已满';
        }
        else{
          await axios.get("http://localhost:20910/register/checkFinish/"+this.deptDocs[2]+"/"+this.record_Id).then(function (resp){
            _this.showDocError = resp.data;
          });
          if(this.showDocError===true){
            this.$message({
              message: '该病历号存在未诊毕的病历,无需挂号',
              type: 'warning'
            });
            this.docError='重复挂号';
          }
        }
      }
      //当前输入信息均合法,则可以保存
      if(this.showRecIdError===false&&this.showNameMissing===false&&this.showBirthdayError===false
      &&this.showAgeError===false&&this.showDocError===false&&this.showIdError===false){
        //保存时需弹出弹出框以确认是否执行保存操作
        this.$confirm('是否继续?', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(async () => {
          let date = new Date();
          let year = date.getFullYear(); // 年
          let month = date.getMonth() + 1; // 月
          let day = date.getDate(); // 日
          let hour = date.getHours();
          let min = date.getMinutes();
          let sec = date.getSeconds();
          let now = `${year}-${month}-${day} ${hour}:${min}:${sec}`;
          await axios.post("http://localhost:20910/register/regInfo?recordId="+this.record_Id+"&name="+this.name
          +"&gender="+(this.gender==='1'? '男':'女')+"&age="+this.age+"&birthday="+this.birthday
          +"&category="+this.type+"&pId="+this.ID+"&address="+this.address
          +"&doc_id="+this.deptDocs[2]+"&dept_id="+this.deptDocs[1]+"&reg_id="+this.deptDocs[0]
          +"&rec_book="+(this.book==='1'? 1:0)+"&booktime="+this.today+"&noon="+this.noon
          +"&receipt_id="+this.billId+"&now="+now).then(function(resp){});
          await axios.post("http://localhost:20910/receipt/addRecWithId?id="+this.billId+"&name="+this.name
          +"&time="+now+"&cost="+this.money+"&project=挂号&detail="+this.name+"于"+now+"挂号"+"&state=打印成功"
          +"&recordId="+this.record_Id);
          this.$message({
            type: 'success',
            message: '挂号成功!'
          });
          axios.get("http://localhost:20910/patient/getDocNameById/"+this.$store.state.docId).then(function (resp){
            _this.userName =  resp.data;
          })
          axios.get("http://localhost:20910/register/getMaxPlusOne").then(function(resp){
            _this.preRecId = resp.data;
            _this.record_Id= resp.data;
          });//记录当前病历号+1
          axios.get("http://localhost:20910/receipt/getMaxPlusOne").then(function(resp){
            _this.billId = resp.data;
          });//首先通过调用数据库中最大值+1生成
          this.today=`${year}-${month}-${day}`;
          this.searchSame = false;
          if(hour<12){
            this.noon="上午";
            axios.get("http://localhost:20910/register/doctorArrange/"+this.today+'/'+0).then(function(resp){
              _this.Doc = resp.data;
            })//调用数据库找到当前值班医生信息
          }else{
            this.noon="下午";
            axios.get("http://localhost:20910/register/doctorArrange/"+this.today+'/'+1).then(function(resp){
              _this.Doc = resp.data;
            })//调用数据库找到当前值班医生信息
          }
          this.name = '';
          this.ID = '';
          this.address = '';
          this.gender = '1';
          this.book = '1';
          this.money = 1;
          this.age = '';
          this.birthday = '';
          this.deptDocs='';
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消挂号'
          });
        });
      }
    },
    empty(){//清空操作
      this.record_Id= this.preRecId;
      this.name = '';
      this.ID = '';
      this.address = '';
      this.gender = '1';
      this.book = '1';
      this.money = 1;
      this.age = '';
      this.birthday = '';
      this.deptDocs='';
      this.showRecIdError = false;
      this.showNameMissing = false;
      this.showIdError = false;
      this.showBirthdayError = false;
      this.showAgeError = false;
      this.showDocError = false;
      this.searchSame = false;
    }
  },

  watch:{//监听操作
   'birthday': function(){//通过输入日期的变化动态变化年龄
      let date = new Date();
      let year = date.getFullYear(); // 年
      let month = date.getMonth() + 1; // 月
      let day = date.getDate(); // 日
      let tempAge = 0;
      //日期选择器本身数据清空后回出现birthday为null的情况，
      //此时需要将birthday变为'',且年龄变为0,此时不显示任何错误提示信息
      if (this.birthday == null||this.birthday==='') {
          if(this.age.length!==0){
            this.age = '';
          }
          this.birthday = '';
          this.showBirthdayError=false;
      }
      //出生日期早于当前日期,年龄在0~150岁之间,为合法输入
      else if((year-parseInt(this.birthday.substring(0,4)))>=0&&
          (year-parseInt(this.birthday.substring(0,4))<=150)&&
        ((Date.parse(`${year}-${month}-${day}`)>Date.parse(this.birthday))||
        (year===parseInt(this.birthday.substring(0,4))&&
        month===parseInt(this.birthday.substring(5,7))&&
        day ===parseInt(this.birthday.substring(8,10))))){
        this.showBirthdayError=false;
        tempAge = new Date().getFullYear()-parseInt(this.birthday.substring(0,4))>0?
        new Date().getFullYear()-parseInt(this.birthday.substring(0,4)):0;
        //计算实际年龄时需要考虑具体日期，若不满一年则需减去一岁
        if(tempAge>0&&(month<parseInt(this.birthday.substring(5,7))
        ||((month===parseInt(this.birthday.substring(5,7)))&&(day<parseInt(this.birthday.substring(8,10)))))){
          tempAge--;
        }
        this.age = tempAge;//将age变更为计算年龄
      }
      else{
        this.showBirthdayError=true;
        this.birthdayError='出生日期错误';
      }
    },
    'age': function(){
      let date = new Date();
      let year = date.getFullYear(); // 年
      let month = date.getMonth() + 1; // 月
      let day = date.getDate(); // 日
      if(this.age.length===0){
        if(this.birthday!==''){
          this.birthday = '';
        }
      }
      else if(this.age>=0&&this.age<=150){
        this.showAgeError=false;
        if(this.birthday===''){//没有填写birthday时
          this.birthday=`${year-this.age}-${month}-${day}`;
        }
        else{//填写birthday时
          let tempAge = 0;
          if((year-parseInt(this.birthday.substring(0,4)))>=0&&
            (year-parseInt(this.birthday.substring(0,4))<=150)&&
            ((Date.parse(`${year}-${month}-${day}`)>Date.parse(this.birthday))||
            (year===parseInt(this.birthday.substring(0,4))&&
            month===parseInt(this.birthday.substring(5,7))&&
            day ===parseInt(this.birthday.substring(8,10))))){//birthday输入合法
              tempAge = new Date().getFullYear()-parseInt(this.birthday.substring(0,4))>0?
              new Date().getFullYear()-parseInt(this.birthday.substring(0,4)):0;
              //计算实际年龄时需要考虑具体日期，若不满一年则需减去一岁
              if(tempAge>0&&(month<parseInt(this.birthday.substring(5,7))
                ||((month===parseInt(this.birthday.substring(5,7)))
                &&(day<parseInt(this.birthday.substring(8,10)))))){
                  tempAge--;
              }
              if(tempAge!==this.age){//birthday计算得到年龄与输入不一致，则修改brithday
                 this.birthday=`${year-this.age}-${month}-${day}`;
              }
          }
          else{//birthday输入非法
            this.birthday=`${year-this.age}-${month}-${day}`;
          }
        }
      }
      else{
        this.showAgeError=true;
        this.ageError='年龄错误';
      }
    },
    //通过实际数据库内金额进行挂号金额的计算
    'deptDocs' : function(){//挂号金额通过挂号级别／科室／医生和是否需要病例本综合计算得出
      let _this = this;
      if(this.deptDocs!=null&&this.deptDocs!==''){
        axios.get("http://localhost:20910/register/getRegCost/"+this.deptDocs[0]).then(function(resp){
          _this.money = resp.data+(_this.book==='1'? 1:0);
        })
      }
      else{
        this.money = (this.book==='1'? 1:0);
      }
    },
    'book': function(){//挂号金额通过挂号级别／科室／医生和是否需要病例本综合计算得出
      if(this.deptDocs===null||this.deptDocs===''){
        this.money = (this.book==='1'? 1:0)
      }
      else{
        let _this = this;
        axios.get("http://localhost:20910/register/getRegCost/"+this.deptDocs[0]).then(function(resp){
          _this.money = resp.data+(_this.book==='1'? 1:0);
        })
      }
    },
  }
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
