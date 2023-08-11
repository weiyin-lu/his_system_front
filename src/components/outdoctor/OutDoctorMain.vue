<template>
  <div class="home">
    <el-container>
      <el-aside width="400px"  style="max-height: 666px; background-color: rgb(238, 241, 246)" v-if="showSide">
        <el-row>
          <span style="text-align:left;float:left;margin-top: 7px">
            <el-tag size="medium" style="width: 250px;background-color: lightblue">患者选择:{{pName}}</el-tag>
          </span>
          <span style="float:right">
            <el-button style="background-color: #409EFF" @click="selectRefresh">
              <i class="el-icon-refresh" style="color: white;font-size: 3px"></i>
            </el-button>
          </span>
        </el-row>
        <div style="justify-content: center;width: 100%">
        <el-row  style="background-color: #409EFF; text-align: center">
          <el-col :span="4" ><span style="color: white; width: 100%;font-size: 13px" >{{tagMessage}}</span></el-col>
          <el-col :span="16" style="background-color: white">
            <el-input clearable v-model="input" placeholder="请输入内容" style="width: 105%"></el-input>
          </el-col>
          <el-col :span="4" style="background-color: white;text-align: right">
            <el-button style="background-color: #409EFF" @click="findButton">
              <i class="el-icon-search" style="color: white;font-size: 3px"></i>
            </el-button>
          </el-col>
        </el-row>
        </div>
        <el-tabs v-model="tag" type="border-card">
          <el-tab-pane name="患者" label="患者" @tab-click="editTagMessage">
            <div style="text-align: center">
              <el-tag style="text-align: left;background-color: lightblue;width: 85%">未诊患者:</el-tag>
              <el-table
                      :data="table1Data"
                      max-height="225"
                      style="width: 100%"
                      :cell-class-name="tableCellClassname"
                      @cell-click="cellClick"
                      highlight-current-row
              >
                <el-table-column
                        prop="recordId"
                        label="病历号"
                        width="130">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="患者姓名"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="age"
                        label="年龄"
                        width="50">
                </el-table-column>
              </el-table>
              <el-tag style="text-align: left;background-color: lightblue;width: 85%">已诊患者:</el-tag>
              <el-table
                      :data="table2Data"
                      max-height="225"
                      style="width: 100%"
                      @row-click="rowClick"
              >
                <el-table-column
                        prop="recordId"
                        label="病历号"
                        width="130">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="患者姓名"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="age"
                        label="年龄"
                        width="50">
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane name="科室" label="科室" @tab-click="editTagMessage2">
            <div style="text-align: center">
              <el-tag style="text-align: left;background-color: lightblue;width: 85%">科室:</el-tag>
              <el-table
                      :data="table3Data"
                      style="width: 100%"
                      max-height="666"
                      highlight-current-row
              >
                <el-table-column
                        prop="deptName"
                        label="科室名称"
                        width="250">
                </el-table-column>
                <el-table-column
                        prop="deptType"
                        label="科室类别">
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>

      </el-aside>
      <el-container>
        <!-- -------------------------------------------------------------main部分--------------------------------------------------------- -->
        <el-main>
          <div style="text-align: left">
                <span style="margin-right: 15px"><el-button @click="show">{{hit}}</el-button></span>
                <span><el-tag size="medium" style="width: 250px;background-color: rgba(0,0,0,0.12)">{{this.$store.state.message}}</el-tag></span>
          </div>
          <el-tabs v-model="page" @tab-click="click" type="border-card">
            <!-- ------------------------------------------门诊病历首页部分------------------------------------------- -->
            <el-tab-pane name="病历首页" label="病历首页"></el-tab-pane>
            <!-- ------------------------------------------------检查申请部分--------------------------------------------- -->
            <el-tab-pane name="检查申请" label="检查申请"></el-tab-pane>
            <!-- -----------------------------------------------检验申请界面-------------------------------------------------------------- -->
            <el-tab-pane name="检验申请" label="检验申请"></el-tab-pane>
            <!-- -----------------------------------------------门诊确诊界面-------------------------------------------------------------- -->
            <el-tab-pane name="门诊确诊" label="门诊确诊"></el-tab-pane>
            <!-- -----------------------------------------------处置申请界面-------------------------------------------------------------- -->
            <el-tab-pane name="处置申请" label="处置申请"></el-tab-pane>
            <!-- ----------------------------------------------------成药处方界面---------------------------------------------- -->
            <el-tab-pane name="成药处方" label="成药处方"></el-tab-pane>
            <!-- -----------------------------------------草药处方界面------------------------------------------------- -->
            <el-tab-pane name="草药处方" label="草药处方"></el-tab-pane>

          </el-tabs>
        </el-main>
      </el-container>
    </el-container>

  </div>
</template>

<script>

export default {
  inject:['reload'],
  name: 'Home',
  components: {
  },
  data(){
    return {

      page:'Home',
      input:'',
      pName:'',
      hit:'隐藏患者栏',
      showSide:true,
      message:'',
      tagMessage:'患者名:',
      tag:"患者",

      table1Data: [{
        recordId: '',
        name: '',
        age: ''
      }],
      table2Data: [{
        recordId: '',
        name: '',
        age: ''
      }],
      table3Data: [{
        deptName:'',
        deptType:''
      }],
    }
  },

  methods :{
    editTagMessage(){
      this.tagMessage = '患者名:';
    },
    editTagMessage2(){
      this.tagMessage = '科室名:';
    },

    tableCellClassname({row,column,rowIndex,columnIndex}){
      row.index = rowIndex;
      column.index = columnIndex;
    },
    cellClick(row){
      this.message ='病历号: '+ row.recordId+' 姓名：'+row.name+' 年龄：'+row.age;
      this.pName= row.name;
      this.$store.dispatch('editMessage',this.message);
      this.$store.commit('editMessage',this.message);
      this.$store.dispatch('editRecordPid',row.recordId);
      this.$store.commit('editRecordPid',row.recordId);
    },
    rowClick(){
      this.$message({
        message:'已就诊患者',
        type:'error'
      });
    },
    selectRefresh(){
      this.$message({
        message:'患者选择刷新按钮,重新执行查询操作',
        type: 'success'
      });
      this.reload();
    },
    findButton(){
      this.$message({
        message: '患者查询按钮，执行查询语句',
        type: 'success'
      });
    },
    show(){
      if(this.showSide===false){
        this.showSide=true;
        this.hit='隐藏患者栏';
      }
      else{
        this.showSide=false;
        this.hit='显示患者栏';
      }
    },
    click(tab){
      if(tab.name==='病历首页'){
        this.$router.push({path:'/Record'})
      }
      else if(tab.name==='检查申请'){
        this.$router.push({path:'/Check'});
      }
      else if(tab.name==='检验申请'){
        this.$router.push({path:'/Test'});
      }
      else if(tab.name==='门诊确诊'){
        this.$router.push({path:'/Confirm'});
      }
      else if(tab.name==='处置申请'){
        this.$router.push({path:'/Treat'});
      }
      else if(tab.name==='成药处方'){
        this.$router.push({path:'/Wmedicine'});
      }
      else if(tab.name==='草药处方'){
        this.$router.push({path:'/Cmedicine'});
      }

    },

  },

  created: function (){
    let _this = this;
    axios.get('http://localhost:20910/getUsers?id='+this.$store.state.docId).then(function (resp){
      _this.table1Data = resp.data;
    });
    axios.get('http://localhost:20910/getUsers2?id='+this.$store.state.docId).then(function (resp){
      _this.table2Data = resp.data;
    });

    axios.get('http://localhost:20910/getDeptPatient?id='+this.$store.state.docId).then(function (resp){
      _this.table3Data = resp.data;
    });

  },

  watch:{
    'tag' :function (){
      if(this.tag==='患者'){
        this.tagMessage = '患者名:';
      }
      if(this.tag==='科室'){
        this.tagMessage = '科室名:';
      }
    }
  }
}
</script>
