<template>
  <div class="withdraw">
    <el-container>
      <el-header style="text-align: right"><!--页面头部-->
        <span style="float: left;font-size: 20px;">退号页面</span><!--头部最左侧显示当前页面名称-->
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
              <i class="el-icon-search" style="font-size: 15px;">查询</i>
            </el-button>
          </el-col>
        </el-row>

        <!--显示对应病历号存在信息-->
        <div v-show="sucResult">
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


        <el-divider content-position="left">患者挂号信息</el-divider>
           <!--查询出该患者的历次挂号信息，并按日期降序排列-->
          <el-table ref="multipleTable"
                    :data="tableData"
                    stripe
                    max-height="244"
                    :default-sort = "{prop: 'date', order: 'descending'}"
                    :header-cell-style="{'text-align':'center',background:'#F5F6FA',color:'#666E92'}"
                    border
                    style="width:100%;text-align: center;"
                    @selection-change="handleSelectionChange"
                    :cell-style="changeCellStyle">
            <el-table-column type="selection" min-width="8%"  :selectable="checkSelectable">
            </el-table-column>
            <el-table-column prop="recordId" label="病历号" min-width="12%"></el-table-column>
            <el-table-column prop="name" label="姓名" min-width="10%"></el-table-column>
            <el-table-column prop="patientId" label="身份证号" min-width="15%"></el-table-column>
            <el-table-column prop="booktime" label="日期" min-width="15%">
              <template slot-scope="scope">{{ scope.row.booktime}}</template>
            </el-table-column>
            <el-table-column prop="noon" label="挂号午别" min-width="10%"></el-table-column>
            <el-table-column prop="deptName" label="看诊科室" min-width="10%"></el-table-column>
            <el-table-column prop="state" label="看诊状态" min-width="10%">
            <!--通过不同看诊状态显示不同颜色字体，如果是未看诊则为红色，其他情况为黑色-->
              <template slot-scope="scope">
                <div :style="{'color': scope.row.state === '未看诊'?'red':'black'}">{{scope.row.state}}</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="10%">
              <template slot-scope="scope">
                <!--只有未看诊状态才可以退号-->
                <div v-if="scope.row.state === '未看诊'">
                  <el-button @click.native.prevent="deleteRow(scope.row, tableData)" type="text">
                    退号
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
          <el-footer>
            <el-row>
              <el-col :span="12" style="text-align: left">
                <el-tag style="font-size:15px;width:100px; height:35px; margin-right:15px">
                  应退金额:
                </el-tag>
                <!--由选中行计算得出,通过标签显示应退金额-->
                <el-tag  type="warning" style="text-align:right; font-size:15px;width:100px; height:35px;">
                  {{money}}元
                </el-tag>
              </el-col>
              <el-col :span="12">
                <el-button @click="delSelectRow()" type="success" style="float: right;">确认退号</el-button>
                <el-button @click="clear()" style="float: right; margin-right:30px">取消选择</el-button>
                <el-button @click="allSelect()" type="primary" style="float: right; margin-right:30px">全选</el-button>
              </el-col>
            </el-row>
          </el-footer>
        </div>

      </el-main>


    </el-container>
  </div>
</template>

<script type="text/javascript">

export default {
  components: {
  },
  name: 'Withdraw',
  data () {
    return{
      userName:'',//当前操作医生姓名
      inputRecordId: '',//输入待查询病历号
      outputRecordId: '',//输出对应病历号
      name: '',//输出对应患者姓名
      Id: 'null',//输出对应患者身份证号
      money: 0,//输出应退金额
      sucResult: false,//是否有病历号对应信息
      showEmpty: false,//是否存在病历号输入
      tableData: [],//病历号对应信息多选表
      multipleSelection: []//多选结果数组
    }
  },

  created: function(){//初始化
    let _this = this;
    axios.get("http://localhost:20910/patient/getDocNameById/"+this.$store.state.docId).then(function (resp){
      _this.userName =  resp.data;
    })
  },

  methods: {

    addRoutes1 () {//跳转回主页面操作
      this.$router.push('/chargeHomePage')
    },

    async search(){//根据病历号查找数据库相关信息
      if(this.inputRecordId.length===0){//未输入病历号
        this.showEmpty = true;//显示错误信息
        this.sucResult = false;//不显示查找结果表格
      }
      else{
        const _this = this;
        await axios.get('http://localhost:20910/register/get/'+_this.inputRecordId).then(function(resp){
          _this.tableData = resp.data;
        });
        axios.get('http://localhost:20910/patient/get/'+_this.inputRecordId).then(function(resp){
          if(resp.data!==null&&resp.data.length!==0){
            _this.outputRecordId = resp.data[0];
            _this.name = resp.data[1];
            _this.Id = (resp.data[2].length!==0? resp.data[2]:'未填写');
          }
        });
        if(this.tableData.length!==0){//表内有相关病历号对应
          this.showEmpty = false;
          this.sucResult = true;
        }
        else{//数据库内没有相关信息
          this.showEmpty = false;
          this.sucResult = false;
          //Alert警告错误信息
          this.$message.error('未查询到相关挂号信息');
          this.inputRecordId = '';//清空输入病历号
        }
      }
    },

    checkSelectable(row) {//定义只有未看诊状态才可以被选中
      return row.state==='未看诊'
    },

    changeCellStyle (row) {//对于操作列，列内元素居中
      if(row.column.label === "操作"){
        return 'text-align: center';
      }
      else{
       return 'text-align:left';
      }
    },

    deleteRow(row){//删除该行元素
        let back = row.cost;
        this.$confirm('将退回'+back+'元,是否继续?', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(async () => {
         await axios.post("http://localhost:20910/register/withdraw?id="+row.id).then(function(resp){});
          this.$message({
            type: 'success',
            message: '退号成功!'
          });
          let date = new Date();
          let year = date.getFullYear(); // 年
          let month = date.getMonth() + 1; // 月
          let day = date.getDate(); // 日
          let hour = date.getHours();
          let min = date.getMinutes();
          let sec = date.getSeconds();
          let now = `${year}-${month}-${day} ${hour}:${min}:${sec}`;
          axios.post("http://localhost:20910/receipt/addRec?name="+this.name
          +"&time="+now+"&cost="+(back*(-1))+"&project=退号&detail="+this.name+"于"+now+"退号,就诊科室为"+row.deptName+"&state=打印成功"
          +"&recordId="+this.outputRecordId);
          const _this = this;
          await axios.get('http://localhost:20910/register/get/'+_this.inputRecordId).then(function(resp){
            _this.tableData = resp.data;
          });
          axios.get('http://localhost:20910/patient/get/'+_this.inputRecordId).then(function(resp){
            if(resp.data!==null&&resp.data.length!==0) {
              _this.outputRecordId = resp.data[0];
              _this.name = resp.data[1];
              _this.Id = (resp.data[2].length !== 0 ? resp.data[2] : '未填写');
            }
          });
        }
        ).catch(() => {
          this.$message({
            type: 'info',
            message: '取消退号'
          });
        });
    },

    delSelectRow(){//删除所有选择行元素
      if(this.multipleSelection.length!==0){
        this.$confirm('将退回'+this.money+'元,是否继续?', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(async () => {
          let dept = '';
          for(let item of this.multipleSelection){
            await axios.post("http://localhost:20910/register/withdraw?id="+item.id).then(function(resp){});
          }
          for(let item of this.multipleSelection){
            dept = dept+item.deptName+',';
          }
          let date = new Date();
          let year = date.getFullYear(); // 年
          let month = date.getMonth() + 1; // 月
          let day = date.getDate(); // 日
          let hour = date.getHours();
          let min = date.getMinutes();
          let sec = date.getSeconds();
          let now = `${year}-${month}-${day} ${hour}:${min}:${sec}`;
          if(this.multipleSelection.length===1){
            axios.post("http://localhost:20910/receipt/addRec?name="+this.name
          +"&time="+now+"&cost="+(this.money*(-1))+"&project=退号&detail="+this.name+"于"+now+"退号,就诊科室为:,"+dept+"&state=打印成功"
          +"&recordId="+this.outputRecordId);
          }
          else{
            axios.post("http://localhost:20910/receipt/addRec?name="+this.name
          +"&time="+now+"&cost="+(this.money*(-1))+"&project=退号&detail="+this.name+"于"+now+"退号,就诊科室包括:,"+dept+"&state=打印成功"
          +"&recordId="+this.outputRecordId);
          }
          this.$message({
          type: 'success',
          message: '退号成功!'
          });
          const _this = this;
          await axios.get('http://localhost:20910/register/get/'+_this.inputRecordId).then(function(resp){
            _this.tableData = resp.data;
          });
          axios.get('http://localhost:20910/patient/get/'+_this.inputRecordId).then(function(resp){
            if(resp.data!==null&&resp.data.length!==0) {
              _this.outputRecordId = resp.data[0];
              _this.name = resp.data[1];
              _this.Id = (resp.data[2].length !== 0 ? resp.data[2] : '未填写');
            }
          });
        }).catch(() => {
          this.$message({
          type: 'info',
          message: '取消退号'
          });
        });
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
        if(item.state === "未看诊")
          counter++;
      }
      //如果当前multipleSelecion内已选项个数和counter相同，表示现在是全选状态，此时全选按钮执行清空操作
      if(this.multipleSelection.length===counter){
        this.$refs.multipleTable.clearSelection();
      }
      else{//若不相同，则将所有未看诊记录变为选中状态
        this.tableData.forEach((item)=>{
          if(item.state === "未看诊")
            this.$refs.multipleTable.toggleRowSelection(item,true);
        })
      }
    },

    clear() {//清空
      this.$refs.multipleTable.clearSelection();
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  },

  watch:{//监听
    'multipleSelection': function(){
      let totalCost = 0;
      for(let item of this.multipleSelection){//通过循环multipleSelecion内元素，计算总的应退金额
          let m = 0;
          let r1 = 0;
          let r2 = 0;
          let n = 0;
          try{r1=(item.cost+'').split('.')[1].length}catch(e){ r1=0 }
          try{r2=totalCost.toString().split('.')[1].length}catch(e){r2=0}
          n = (r1>=r2)? r1:r2;
          m = Math.pow(10,Math.max(r1,r2));
          totalCost = (item.cost*m+totalCost*m)/m.toFixed(n);
      }
      this.money = totalCost;
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
