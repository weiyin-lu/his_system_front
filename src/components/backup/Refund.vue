<template>
  <div class="refund">
    <el-container>
      <el-header style="text-align: right"><!--页面头部-->
        <span style="float: left">退费页面</span><!--头部最左侧显示当前页面名称-->
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
            <!--输入病历号查询-->
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
          <!--显示患者消费信息-->
          <el-table ref="multipleTable"
                    :data="tableData"
                    max-height="300"
                    stripe
                    :header-cell-style="{'text-align':'center',background:'#F5F6FA',color:'#666E92'}"
                    :cell-style="{'text-align': 'center'}"
                    border
                    style="width: 100%"
                    :default-sort = "{prop: 'date', order: 'descending'}"
                    @selection-change="handleSelectionChange">
            <el-table-column type="selection" min-width="5%" :selectable="checkSelectable"></el-table-column>
            <el-table-column prop="recordId" label="病历号" min-width="10%"></el-table-column>
            <el-table-column prop="name" label="姓名" min-width="10%"></el-table-column>
            <el-table-column prop="costName" label="项目名称" min-width="15%"></el-table-column>
            <el-table-column prop="price" label="单价" min-width="10%"></el-table-column>
            <el-table-column prop="num" label="数量" min-width="8%"></el-table-column>
            <el-table-column prop="time" label="开立时间" min-width="15%">
              <template slot-scope="scope">{{ scope.row.time }}</template>
            </el-table-column>
            <!--通过不同消费状态显示不同颜色字体，如果是未消费则为红色，其他情况为黑色-->
            <el-table-column prop="state" label="消费状态" min-width="10%">
              <template slot-scope="scope">
                <div :style="{'color': scope.row.state === '存在可退费项目'?'red':'black'}">{{scope.row.state}}</div>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="退费项目数选择／操作" min-width="17%">
              <template slot-scope="scope">
                <!--未消费的项目可以退掉全部数量，也可以退掉部分数量-->
                <div v-if="scope.row.state === '存在可退费项目'">
                 <el-input-number v-model="scope.row.amount" :min="1" :max=maxData[scope.$index] size="small"
                    @change="numberChange($event, scope.row, scope.$index)">
                  <!--通过change函数改变每一行对应的退费数量-->
                  </el-input-number>
                  <el-button style="margin-left:20px" @click.native.prevent="minRow(scope.row, tableData)" type="text">
                    退费
                  </el-button>
                </div>
                <div v-else>
                  <!--其他情况下无法操作-->
                  <el-button disabled type="text">
                    无法操作
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <p></p>
          <div>
            <el-row style="text-align: left">
              <el-col :span="12">
                <span style="color: red">退还金额: </span>
                <el-tag  type="danger" effect="plain" style="text-align:right; font-size:15px;width:100px; height:35px;">
                  {{fact}}元
                </el-tag>
              </el-col>
              <el-col :span="12" style="float: right">
                <el-button @click="minSelRow()" type="success" style="float: right;">确认退费</el-button>
                <el-button @click="clear()" style="float: right; margin-right:30px">取消选择</el-button>
                <el-button @click="allSelect()" type="primary" style="float: right; margin-right:30px">全选</el-button>

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
                            :default-sort = "{prop: 'date', order: 'descending'}">
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
                  <!--显示退还金额fact-->
                  <el-form-item label="退还金额:" width="150">
                    <el-tag  type="danger" effect="plain" style="text-align:right; font-size:15px;width:100px; height:35px;">
                      {{fact}}元
                    </el-tag>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="dialogFormVisible = false">取 消</el-button>
                  <el-button type="primary" @click="submit">确 定</el-button>
                </div>
              </el-dialog>


              </el-col>
            </el-row>
          </div>
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
      userName:'',
      inputRecordId: '',
      outputRecordId:'',
      name: '',
      Id: 'null',
      showEmpty: false,
      dialogFormVisible: false,
      sucRes: false,
      fact:'',
      maxData:[],
      tableData: [],
      resTable:[],
        multipleSelection: [],
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
        type: '',

    }
  },

  created: function(){
    let _this = this;
    axios.get("http://localhost:20910/patient/getDocNameById/"+this.$store.state.docId).then(function (resp){
      _this.userName =  resp.data;
    })
  },

  methods: {

    addRoutes1 () {
        this.$router.push('/chargeHomePage')
    },

    async search(){
      if(this.inputRecordId.length===0){
        this.showEmpty = true;
        this.sucRes = false;
      }
      else{
        const _this = this;
        await axios.get('http://localhost:20910/patientConsume/getUnused/'+_this.inputRecordId).then(function(resp){
          console.log(resp.data);
          _this.tableData = resp.data;
          for(let item of _this.tableData){
            _this.maxData[_this.maxData.length]=item.amount;
          }
        });
        axios.get('http://localhost:20910/patient/get/'+_this.inputRecordId).then(function(resp){
          if(resp.data!==null&&resp.data.length!==0) {
            _this.outputRecordId = resp.data[0];
            _this.name = resp.data[1];
            _this.Id = resp.data[2];
          }
        });
        if(this.tableData.length!==0){
          this.showEmpty = false;
          this.sucRes = true;
        }
        else{
          this.showEmpty = false;
          this.sucRes = false;
          //Alert警告错误信息
          this.$message.error('未查询到相关病历');
          this.inputRecordId = '';
        }
      }
    },

    minRow(row){
      let m = 0;
      try{m+=(row.price+'').split(".")[1].length}catch(e){}
      try{m+=(row.amount+'').split(".")[1].length}catch(e){}
      let cost = (parseInt((row.price+'').replace(".",""))*parseInt((row.amount+'').replace(".","")))/Math.pow(10,m);
      this.$confirm('将退'+row.amount+'个'+row.costName+'共计'+cost+'元,是否继续?', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(async () => {
          await axios.post("http://localhost:20910/patientConsume/refund?id="+row.id+'&n='+row.amount)
          .then(function(resp){});
          let date = new Date();
          let year = date.getFullYear(); // 年
          let month = date.getMonth() + 1; // 月
          let day = date.getDate(); // 日
          let hour = date.getHours();
          let min = date.getMinutes();
          let sec = date.getSeconds();
          let now = `${year}-${month}-${day} ${hour}:${min}:${sec}`;
          axios.post("http://localhost:20910/receipt/addRec?name="+this.name
          +"&time="+now+"&cost="+((-1)*cost)
          +"&project=退费&detail="+this.name+"于"+now+"退还,"+row.amount+'个'+row.costName+'共计'+
          cost+'元'+"&state=打印成功"+"&recordId="+this.outputRecordId);
          this.$message({
          type: 'success',
          message: '退费成功!'
          });
        const _this = this;
        await axios.get('http://localhost:20910/patientConsume/getUnused/'+_this.inputRecordId).then(function(resp){
          console.log(resp.data);
          _this.tableData = resp.data;
          for(let item of _this.tableData){
            _this.maxData[_this.maxData.length]=item.amount;
          }
        });
        axios.get('http://localhost:20910/patient/get/'+_this.inputRecordId).then(function(resp){
          if(resp.data!==null&&resp.data.length!==0) {
            _this.outputRecordId = resp.data[0];
            _this.name = resp.data[1];
            _this.Id = resp.data[2];
          }
        });
        }).catch(() => {
          this.$message({
          type: 'info',
          message: '取消退费'
          });
        });
    },

    numberChange($event, row){
      this.$refs.multipleTable.toggleRowSelection(row,false);
      this.$refs.multipleTable.toggleRowSelection(row,true);
    },

    checkSelectable(row) {//定义只有未看诊状态才可以被选中
      return row.state==='存在可退费项目'
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    minSelRow(){//删除所有选择行元素
      if(this.multipleSelection.length!==0){
        this.resTable=[];
        for(let item of this.multipleSelection){
          this.resTable.push({
            'name':item.name,
            'costName':item.costName,
            'number':item.amount,
            'price':item.price,
            'time':item.time,
          });
        }
        this.dialogFormVisible = true;
      }
      else{
        this.$alert('没有选中任何项', '提示', {
          confirmButtonText: '确定',
        });
      }
    },

    allSelect(){//按钮用于全选／清空操作
      let counter = 0;
      for(let item of this.tableData){//统计表内所有未看诊记录个数
        if(item.state === "存在可退费项目")
          counter++;
      }
      //如果当前multipleSelecion内已选项个数和counter相同，表示现在是全选状态，此时全选按钮执行清空操作
      if(this.multipleSelection.length===counter){
        this.$refs.multipleTable.clearSelection();
      }
      else{//若不相同，则将所有未看诊记录变为选中状态
        this.tableData.forEach((item)=>{
          if(item.state === "存在可退费项目")
            this.$refs.multipleTable.toggleRowSelection(item,true);
        })
      }
    },

    clear() {//清空
      this.$refs.multipleTable.clearSelection();
    },

    submit(){//结算按钮
      this.$confirm('是否继续?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(async () => {
        let info = '';
        for(let item of this.multipleSelection){
          let m = 0;
          try{m+=(item.price+'').split(".")[1].length}catch(e){}
          try{m+=(item.amount+'').split(".")[1].length}catch(e){}
          let cost = (parseInt((item.price+'').replace(".",""))*parseInt((item.amount+'').replace(".","")))/Math.pow(10,m);
          await axios.post("http://localhost:20910/patientConsume/refund?id="+item.id+'&n='+item.amount)
          .then(function(resp){});
          info = info+item.amount+'个'+item.costName+'共'+cost+'元,';
        }
        let date = new Date();
        let year = date.getFullYear(); // 年
        let month = date.getMonth() + 1; // 月
        let day = date.getDate(); // 日
        let hour = date.getHours();
        let min = date.getMinutes();
        let sec = date.getSeconds();
        let now = `${year}-${month}-${day} ${hour}:${min}:${sec}`;
        axios.post("http://localhost:20910/receipt/addRec?name="+this.name
          +"&time="+now+"&cost="+(this.fact*(-1))
          +"&project=退费&detail="+this.name+"于"+now+"退还,"+info+"&state=打印成功"+"&recordId="+this.outputRecordId);
        this.$message({
          type: 'success',
          message: '退费成功!'
        });
        const _this = this;
        this.maxData = [];
        await axios.get('http://localhost:20910/patientConsume/getUnused/'+_this.inputRecordId).then(function(resp){
          console.log(resp.data);
          _this.tableData = resp.data;
          for(let item of _this.tableData){
            _this.maxData[_this.maxData.length]=item.amount;
          }
        });
        axios.get('http://localhost:20910/patient/get/'+_this.inputRecordId).then(function(resp){
          if(resp.data!==null&&resp.data.length!==0) {
            _this.outputRecordId = resp.data[0];
            _this.name = resp.data[1];
            _this.Id = resp.data[2];
          }
        });
        this.dialogFormVisible = false;
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消退费'
        });
      });
    },
  },

  watch:{//监听
    'multipleSelection': function(){
      let totalCost = 0;
      for(let item of this.multipleSelection){//通过循环multipleSelecion内元素，计算总的应退金额
        let m = 0;
        let r1 = 0;
        let r2 = 0;
        let n = 0;
        let i = 0;
        try{m+=(item.price+'').split(".")[1].length}catch(e){}
        try{m+=(item.amount+'').split(".")[1].length}catch(e){}
        try{r1 = ((parseInt((item.price+'').replace(".",""))*parseInt((item.amount+'').replace(".","")))/Math.pow(10,m)).toString().split(".")[1].length}catch(e){ r1=0 }
        try{r2 = totalCost.toString().split(".")[1].length} catch(e){ r2=0 }
        n = (r1>=r2)? r1:r2;
        i = Math.pow(10,Math.max(r1,r2));
        totalCost = ((parseInt((item.price+'').replace(".",""))*parseInt((item.amount+'').replace(".","")))/Math.pow(10,m)*i+totalCost*i)/i.toFixed(n);
      }
      this.fact = totalCost;
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
    border-radius: 4px;
  }
</style>
