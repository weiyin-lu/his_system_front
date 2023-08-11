<template>
  <div class="charge">
    <el-container>
      <el-header style="text-align: right"><!--页面头部-->
        <span style="float: left">收费页面</span><!--头部最左侧显示当前页面名称-->
        <!--最右侧首先显示当前用户名称,由登陆界面传输当前用户信息,同时与右侧按钮通过margin-right保持一定距离-->
        <span style="font-size: 15px; margin-right:15px">{{userName}}</span>
        <!--通过带有返回主页图标的按钮实现返回主页面操作-->
        <el-button type="primary" style="height:40px; width:40px;" circle @click="addRoutes1">
          <i class="el-icon-s-home" circle style="margin-right: 30px"></i>
        </el-button>
      </el-header>

      <el-main>
        <h1 style="text-align: left">患者信息查询</h1>
        <el-row style="text-align: left">
          <el-col :span="8">
            <span style="font-size: 20px">病历号:</span>
            <!--输入病历号查询,通过正则表达式限制只能输入数字-->
            <el-input placeholder="请输入病历号" v-model="inputRecordId" style="width:210px" clearable
            oninput = "value=value.replace(/[^\d]/g,'')" @keydown.enter.native="search">
            </el-input>
            <!--如果未输入病历号,则需要通过showEmpty显示未输入病历号的错误提示-->
            <span v-show="showEmpty">
              <i class="el-icon-error" style="font-size: 20px; color: red">未输入病历号</i>
            </span>
          </el-col>
          <el-col :span="1">
            <!--通过输入的病历号查询-->
            <el-button type="primary" plain round @click="search">
              <i class="el-icon-search" style="font-size: 17px;">查询</i>
            </el-button>
          </el-col>
        </el-row>

        <div v-show="sucRes" style="text-align: left">
          <el-divider content-position="left">患者信息确认</el-divider>
          <el-row style="text-align: left">
            <el-col :span="6">
              <span style="font-size: 20px">病历号:</span>
              <!--通过标签显示病历号-->
              <el-tag effect="plain" type="info" style="font-size:15px;width:210px;">
                {{outputRecordId}}
              </el-tag>
            </el-col>
            <el-col :span="6">
              <span style="font-size: 20px">姓 名:</span>
              <!--通过标签显示姓名-->
              <el-tag effect="plain" type="info" style="font-size:15px;width:210px;">
                {{name}}
              </el-tag>
            </el-col>
            <el-col :span="6">
              <span style="font-size: 20px">身份证号:</span>
              <!--通过标签显示身份证号-->
              <el-tag effect="plain" type="info" style="font-size:15px;width:210px;">
                {{Id}}
              </el-tag>
            </el-col>
          </el-row>

          <el-divider content-position="left">患者消费信息</el-divider>
          <!--查询出该患者本次看诊的待缴费项目，并按项目开立时间时间降序排序-->
          <el-table ref="multipleTable"
                    :data="tableData"
                    stripe
                    border
                    style="width: 100%"
                    max-height="288"
                    :header-cell-style="{'text-align':'center',background:'#F5F6FA',color:'#666E92'}"
                    :cell-style="{'text-align': 'center'}"
                    :default-sort = "{prop: 'time', order: 'descending'}"
                    @selection-change="handleSelectionChange">
            <el-table-column type="selection" style="width: 10%" :selectable="checkSelectable"></el-table-column>
            <el-table-column prop="recordId" label="病历号" style="width: 10%"></el-table-column>
            <el-table-column prop="name" label="姓名" style="width: 10%"></el-table-column>
            <el-table-column prop="costName" label="项目名称" style="width: 20%"></el-table-column>
            <el-table-column prop="price" label="单价" style="width: 10%"></el-table-column>
            <el-table-column prop="num" label="数量" style="width: 10%"></el-table-column>
            <el-table-column prop="time" label="开立时间" style="width: 20%">
              <template slot-scope="scope">{{ scope.row.time }}</template>
            </el-table-column>
            <!--通过不同收费状态显示不同颜色字体，如果是未付费则为红色，其他情况为黑色-->
            <el-table-column prop="state" label="收费状态" style="width: 10%">
              <template slot-scope="scope">
                <div :style="{'color': scope.row.state === '未缴费'?'red':'black'}">{{scope.row.state}}</div>
              </template>
            </el-table-column>
          </el-table>
          <p></p>
          <el-row>
            <el-col :span="12">
            <!--由选择表项数据计算得出,通过标签显示找零金额-->
              <span style="color: red">应收金额: </span>
              <el-tag type="danger" effect="plain" style="text-align: right;font-size:15px;width:100px;">
                {{suppose}}
              </el-tag>
            </el-col>
            <el-col :span="12">
              <el-button type="success" @click="click" style="float:right">
                <i class="el-icon-s-check" style="font-size: 15px;">收费结算</i>
              </el-button>
              <el-button @click="clear()" style="font-size: 15px; float: right; margin-right:30px">
                取消选择
              </el-button>
              <el-button @click="allSelect()" type="primary" style="font-size: 15px; float: right; margin-right:30px">
                全选
              </el-button>

              <!--嵌套输入框-->
              <el-dialog title="收费结算" :visible.sync="dialogFormVisible">
                <div style="display:flex;justify-content:center;margin-bottom:15px">
                  <el-table :data="resTable"
                            stripe
                            border
                            style="width: 100%"
                            max-height="140"
                            :header-cell-style="{'text-align':'center',background:'#F5F6FA',color:'#666E92'}"
                            :row-style="{height:10+'px'}"
                            :cell-style="{'text-align': 'center',padding: 0+'px'}"
                            :default-sort = "{prop: 'time', order: 'descending'}">
                    <el-table-column prop="name" label="姓名" min-width="20%"></el-table-column>
                    <el-table-column prop="costName" label="项目名称" min-width="20%"></el-table-column>
                    <el-table-column prop="price" label="单价" min-width="20%"></el-table-column>
                    <el-table-column prop="number" label="数量" min-width="10%"></el-table-column>
                    <el-table-column prop="time" label="开立时间" min-width="25%">
                      <template slot-scope="scope">{{ scope.row.time }}</template>
                    </el-table-column>
                  </el-table>
                </div>
                <el-form>
                  <!--显示应收金额suppose-->
                  <el-form-item label="应收金额:" width="150">
                    <el-tag type="danger" effect="plain" style="text-align: right;font-size:15px;width:193px;">
                      {{suppose}}
                    </el-tag>
                  </el-form-item>
                  <!--选择支付方式-->
                  <el-form-item label="支付方式:" width="150">
                    <el-select v-model="type" placeholder="请选择支付方式">
                      <el-option v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <!--收费员输入实收金额fact-->
                  <el-form-item label="实收金额:" width="150">
                    <el-input  v-model="fact" style="width:193px;text-align: right;"
                              oninput = "value=value.replace(/[^\d]/g,'')">
                    </el-input>
                    <!--收费金额错误时显示的提示信息-->
                    <span v-show="factMoneyError">
                      <i class="el-icon-error" style="font-size: 15px; color: red">{{factMoneyErrMsg}}</i>
                    </span>
                  </el-form-item>
                  <!--通过实收金额和应收金额做差得到找零金额change-->
                  <el-form-item label="找零金额:" width="150">
                    <el-tag  type="info" effect="plain" style="text-align:right;font-size:15px;width:193px;">
                      {{change}}元
                    </el-tag>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="dialogFormVisible = false; fact='';factMoneyError = false">
                    取 消
                  </el-button>
                  <el-button type="primary" @click="submit">确 定</el-button>
                </div>
              </el-dialog>
            </el-col>
          </el-row>

        </div>
      </el-main>
    </el-container>

  </div>
</template>

<script type="text/javascript">

export default {
  components: {
  },
  name: 'Charge',
  data () {
    return{
      userName:'',//当前操作医生姓名
      inputRecordId: '',//输入待查询病历号
      showEmpty: false,//是否存在病历号输入
      sucRes: false,//是否有病历号对应信息
      factMoneyError: false,//判断实收金额是否正确
      dialogFormVisible: false,//是否显示弹出框
      outputRecordId: '',//输出对应病历号
      name: '',//输出对应患者姓名
      Id: 'null',//输出对应患者身份证号
      suppose:'0',//应收金额
      fact:'',//实收金额
      change:'',//找零金额
      factMoneyErrMsg:'',//实收金额错误提示
      tableData: [],
      resTable:[],
        multipleSelection: [],//存储所有待收费项目
        options: [{
          value: '选项1',
          label: '现金支付'
        }, {
          value: '选项2',
          label: '信用卡支付'
        }, {
          value: '选项3',
          label: '支付宝支付'
        }, {
          value: '选项4',
          label: '微信支付'
        }, {
          value: '选项5',
          label: '网银支付'
        }],
        type: '选项1',//支付方式选项
    }
  },

  methods: {
    addRoutes1 () {//跳转回主页面操作
      this.$router.push('/chargeHomePage')
    },


    async search(){//根据病历号查找数据库相关信息
      if(this.inputRecordId.length===0){//未输入病历号
        this.showEmpty = true;//显示错误信息
        this.sucRes = false;//不显示查找结果表格
      }
      else{
        const _this = this;
        await axios.get('http://localhost:20910/patientConsume/get/'+_this.inputRecordId).then(function(resp){
          _this.tableData = resp.data;
        });
        axios.get('http://localhost:20910/patient/get/'+_this.inputRecordId).then(function(resp){
          if(resp.data!==null&&resp.data.length!==0) {
            _this.outputRecordId = resp.data[0];
            _this.name = resp.data[1];
            _this.Id = resp.data[2].length !== 0 ? resp.data[2] : '未填写';
          }
        });
        if(this.tableData.length!==0){//调用数据库查找对应的消费信息传递给tableData
          this.showEmpty = false;
          this.sucRes = true;
        }
        else{//数据库内没有相关信息
          this.showEmpty = false;
          this.sucRes = false;
          //Alert警告错误信息
          this.$message.error('未查询到相关病历');
          this.inputRecordId = '';//清空输入病历号
        }
      }
    },

    checkSelectable(row) {//定义只有未缴费状态才可以被选中
      return row.state==='未缴费';
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    click(){//提交按钮
      if(this.multipleSelection.length===0){
        this.$alert('没有选中任何缴费项目', '注意', {
          confirmButtonText: '确定',
          })
      }
      else{
        this.resTable=[];
        for(let item of this.multipleSelection){
          this.resTable.push({
            'name':item.name,
            'costName':item.costName,
            'number':item.num,
            'price':item.price,
            'time':item.time,
          });
        }
        this.fact = '';
        this.charge = '';
        this.dialogFormVisible = true;
      }
    },

    submit(){//结算按钮
      if(this.fact.length===0){//未输入收费金额
         this.factMoneyError = true;
         this.factMoneyErrMsg = '未输入收费金额';
      }
      else if(parseInt(this.fact)>=parseInt(this.suppose)){//收费金额合理
        this.factMoneyError = false;
        this.$confirm('是否继续?', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
      }).then(async() => {
          this.$message({
            type: 'success',
            message: '缴费成功!'
          });
          let detail = '';
          let billId= '' ;
          await axios.get("http://localhost:20910/receipt/getMaxPlusOne").then(function(resp){
            billId = resp.data;
          });
          for(let item of this.multipleSelection){
            await axios.post('http://localhost:20910/patientConsume/charge?id='+item.id+'&billId='+billId).then(function(resp){});
            detail = detail+'单价为'+item.price+'的'+item.costName+"共"+item.num+"个,";
          }
          let date = new Date();
          let year = date.getFullYear(); // 年
          let month = date.getMonth() + 1; // 月
          let day = date.getDate(); // 日
          let hour = date.getHours();//小时
          let min = date.getMinutes();//分钟
          let sec = date.getSeconds();//秒
          let now =`${year}-${month}-${day} ${hour}:${min}:${sec}`;
          await axios.post('http://localhost:20910/receipt/addRecWithId?id='+billId+'&name='+this.name+'&time='+now+'&cost='+this.suppose
          +'&project='+'消费'+'&detail='+detail+'&state='+'打印成功'+'&recordId='+this.inputRecordId)
          .then(function(resp){});
          const _this = this;
          await axios.get('http://localhost:20910/patientConsume/get/'+_this.inputRecordId).then(function(resp){
            _this.tableData = resp.data;
          });
          axios.get('http://localhost:20910/patient/get/'+_this.inputRecordId).then(function(resp){
            if(resp.data!==null&&resp.data.length!==0) {
              _this.outputRecordId = resp.data[0];
              _this.name = resp.data[1];
              _this.Id = resp.data[2].length !== 0 ? resp.data[2] : '未填写';
            }
          });
          if(this.tableData.length!==0){//调用数据库查找对应的消费信息传递给tableData
            this.showEmpty = false;
            this.sucRes = true;
          }
          else{//数据库内没有相关信息
            this.showEmpty = false;
            this.sucRes = false;
            //Alert警告错误信息
            this.$message.error('未查询到相关病历');
            this.inputRecordId = '';//清空输入病历号
          }
          this.dialogFormVisible = false;
        }).catch(() => {
          this.$message({
          type: 'info',
          message: '取消缴费'
        });
      });
      }
      else{//收费金额小于待付金额
        this.factMoneyError=true;
        this.factMoneyErrMsg = '收费金额小于待付金额';
      }
    },

    allSelect(){//按钮用于全选／清空操作
      //如果当前multipleSelecion内已选项个数和表内待缴费记录数相同，表示现在是全选状态，此时全选按钮执行清空操作
      let total = 0;
      for(let item of this.tableData){
        if(item.state === '未缴费'){
          total++;
        }
      }
      if(this.multipleSelection.length===total){
        this.$refs.multipleTable.clearSelection();
      }
      else{//若不相同，则将所有记录变为选中状态
        this.tableData.forEach((item)=>{
          if(item.state==='未缴费'){
            this.$refs.multipleTable.toggleRowSelection(item,true);
          }
        })
      }
    },

    clear() {//清空
      this.$refs.multipleTable.clearSelection();
    },
  },

  created: function(){
    let _this = this;
    axios.get("http://localhost:20910/patient/getDocNameById/"+this.$store.state.docId).then(function (resp){
      _this.userName =  resp.data;
    })
  },

  watch:{
    'multipleSelection': function(){//多选框状态改变时，对应缴费金额也因发生改变
      let totalCost = 0;
      for(let item of this.multipleSelection){//通过循环multipleSelecion内元素，计算总的缴费金额
        let m = 0;
        let r1 = 0;
        let r2 = 0;
        let n = 0;
        let i = 0;
        try{m+=(item.price+'').split(".")[1].length}catch(e){}
        try{m+=(item.num+'').split(".")[1].length}catch(e){}
        try{r1 = ((parseInt((item.price+'').replace(".",""))*parseInt((item.num+'').replace(".","")))/Math.pow(10,m)).toString().split(".")[1].length}catch(e){ r1=0 }
        try{r2 = totalCost.toString().split(".")[1].length} catch(e){ r2=0 }
        n = (r1>=r2)? r1:r2;
        i = Math.pow(10,Math.max(r1,r2));
        totalCost = ((parseInt((item.price+'').replace(".",""))*parseInt((item.num+'').replace(".","")))/Math.pow(10,m)*i+totalCost*i)/i.toFixed(n);
      }
      this.suppose = totalCost;
    },

   'fact': function(){//应收金额和实收金额做差计算得出找零金额
      if(this.fact>=this.suppose){
        let m = 0;
        let r1 = 0;
        let r2 = 0;
        let n = 0;
        try{r1 = (this.fact+"").split(".")[1].length}catch(e){ r1=0 }
        try{r2 = (this.suppose+"").split(".")[1].length} catch(e){ r2=0 }
        n = (r1>=r2)? r1:r2;
        m = Math.pow(10,Math.max(r1,r2));
        this.change =(this.fact*m-this.suppose*m)/m.toFixed(n);
      }
      else{
        this.change='';
      }
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
  border-radius: 4px;
}
</style>
