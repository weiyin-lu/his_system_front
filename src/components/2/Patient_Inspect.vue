<template>
  <div>
    <el-row>
    <el-col :span="4" class="hhh"><div><el-button  icon="el-icon-s-home" @click="menu" type="primary">主菜单</el-button></div></el-col>
    <el-col :span="16" class="hh"><div>欢迎来到患者检验科</div></el-col>
      <el-col :span="4" class="hhh"><div>
        <el-popover
                placement="left"
                width="500"
                trigger="hover">
          <el-table :data="getDocInfo">
            <el-table-column width="100" prop="docId" label="医生编号"></el-table-column>
            <el-table-column width="100" prop="name" label="医生姓名"></el-table-column>
            <el-table-column width="100" prop="dept" label="部门名称"></el-table-column>
            <el-table-column width="100" prop="userType" label="医生类别"></el-table-column>
            <el-table-column width="100" prop="title" label="医生级别"></el-table-column>
          </el-table>
          <el-button slot="reference" type="primary" class="el-icon-user">你好！{{name1}}</el-button>
        </el-popover>
      </div></el-col>
    </el-row>
    <el-row style="margin-top: 40px">
      <el-col :span="6">
        <el-input clearable placeholder="请输入患者名称" v-model.trim="name" type="text" style="width: 80%"></el-input>
      </el-col>
      <el-col :span="6">
        <el-input clearable placeholder="请输入患者病历号" v-model.trim="keywords" type="text" style="width: 80%"></el-input>
      </el-col>
      <el-col :span="4">
        <el-button  icon="el-icon-search" @click="search" type="primary">查询</el-button>
      </el-col>
      <el-col :span="4">
        <el-button  icon="el-icon-refresh" @click="refresh" type="primary">刷新</el-button>
      </el-col>
      <el-col :span="4">
        <el-button  icon="el-icon-refresh-left" @click="kong" type="primary">清空</el-button>
      </el-col></el-row>
    <el-col :span="24"><div><el-table
      :data="tableData"
      border
      height="450px" style="margin-top: 50px">
      <el-table-column
        prop="recordId"
        label="病历号"
        min-width="16%">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        min-width="16%">
      </el-table-column>
      <el-table-column
        prop="code"
        label="项目编号"
        min-width="16%">
      </el-table-column>
      <el-table-column
        prop="costName"
        label="项目名称"
        min-width="16%">
      </el-table-column>
      <el-table-column
        prop="payment"
        label="付费状态"
        min-width="16%">
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型"
        min-width="16%">
      </el-table-column>
      <el-table-column
        prop="takeMed"
        label="检查状态"
        min-width="16%">
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="24%">
        <template slot-scope="scope">
          <el-button v-if="scope.row.takeMed==='未执行'" size="mini" type="primary" @click="start(scope.row)">开始</el-button>
          <el-button v-if="scope.row.takeMed==='执行中'" size="mini" type="danger" @click="cancel(scope.row)">取消</el-button>
          <el-button v-if="scope.row.takeMed==='已执行'" size="mini" type="danger" disabled>成功</el-button>
          <el-button size="mini" type="primary" @click="insertTemp(scope.row)" style="margin-left: 5px" :disabled="scope.row.takeMed==='未执行'">录入</el-button>
          <el-dialog title="录入检查结果" :visible.sync="inputVisible" width="40%">
            <el-input v-model.trim="result" placeholder="请输入检查结果" style="width: 60%"></el-input>
            <el-button type="primary" @click="insertResults(scope.row)">确认</el-button>
            <el-button type="primary" @click="inputVisible=false">关闭</el-button>
          </el-dialog>
          <el-popover
              placement="left-start"
              title="检验结果"
              width="200"
              trigger="click"
              :content="scope.row.results">
            <el-button size="mini" type="success" slot="reference" style="margin-left: 5px">信息</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table></div></el-col>
  </div>
</template>

<script>
    export default {
        data() {
            return {
                name:'',
                name1:'',
                getDocInfo:[],
                temp:'',
                table:false,
                result:'',
                outerVisible:false,
                inputVisible:false,
                tableData: [],
                keywords:'',
            }
        },
        mounted: function(){
            this.loadPatient()
            this.getDocInfoFuc()
        },
        methods:{
          start(row){
            console.log(row.takeMed)
            this.tempData=row
            this.takeMed=row.takeMed
            this.$axios.post('http://localhost:20910/api/CheckUpdateTakeMed1/'+this.$store.state.docId+'/'+row.recordId+'/'+row.costName,{
              docId:this.$store.state.docId,
              recordId:row.recordId,
              costName:row.costName
            }).then(resp=>{
              if(resp && resp.data.code===200){
                this.$message({
                  message:'执行中',
                  type:'success'
                })
                this.loadPatient()
              }
            })
          },
          kong(){
            this.keywords=''
            this.name=''
          },
          getDocInfoFuc(){
            let _this=this
            axios.get("http://localhost:20910/api/getDocInfo/"+this.$store.state.docId,{
              DocId:this.$store.state.docId
            }).then(resp=>{
              if(resp && resp.data.code===200){
                this.getDocInfo=[]
                _this.getDocInfo.push(resp.data.result)
                this.name1=_this.getDocInfo[0].name
              }
            })

          },
            loadPatient(){
                let _this = this
                axios.get('http://localhost:20910/api/InspectPatient').then(resp => {
                    if (resp&&resp.data.code===200) {
                        _this.tableData = resp.data.result
                        console.log(resp.data.result)
                    }
                })
            },
            menu(){
              this.$router.replace('/MedicalLogin')
            },
            refresh(){
                this.keywords=''
                this.name=''
                this.loadPatient()
            },
            search() {
                if(this.keywords && !this.name){
                    axios.get('http://localhost:20910/api/InspectSearchById/'+this.keywords,{
                        recordId:this.keywords
                    }).then(resp => {
                        if (resp&&resp.data.code === 200) {
                            this.tableData = resp.data.result
                            console.log(this.tableData)
                            if(this.tableData.length!==0){
                                this.$message({
                                    message:'查询成功',
                                    type:'success'
                                })
                            }
                            else if(this.tableData.length===0){
                                this.$message.error("查询失败")
                            }
                        }
                    })
                }else if(!this.keywords && this.name){
                    axios.get('http://localhost:20910/api/InspectSearchByName/'+this.name,{
                        name:this.name
                    }).then(resp => {
                        if (resp&&resp.data.code === 200) {
                            this.tableData = resp.data.result
                            console.log(this.tableData)
                            if(this.tableData.length!==0){
                                this.$message({
                                    message:'查询成功',
                                    type:'success'
                                })
                            }
                            else if(this.tableData.length===0){
                                this.$message.error("查询失败")
                            }
                        }
                    })
                }else if(this.keywords && this.name){
                    axios.get('http://localhost:20910/api/InspectSearchByIdAndName/'+this.keywords+"/"+this.name,{
                        recordId:this.keywords,
                        name:this.name
                    }).then(resp => {
                        if (resp&&resp.data.code === 200) {
                            this.tableData = resp.data.result
                            console.log(this.tableData)
                            if(this.tableData.length!==0){
                                this.$message({
                                    message:'查询成功',
                                    type:'success'
                                })
                            }
                            else if(this.tableData.length===0){
                                this.$message.error("查询失败")
                            }
                        }
                    })
                }else{
                    this.$message.error("请输入查询条件")
                }
            },
          insertTemp(row){
            this.result = ''
            this.inputVisible=true
            this.tempData=row
          },
          insertResults(){
            this.temp=this.tempData.results;
            if(this.result){
              this.$axios.post('http://localhost:20910/api/InspectUpdateResults/'+this.result+'/'+this.tempData.recordId+'/'+this.tempData.costName,{
                results:this.result,
                recordId:this.tempData.recordId,
                costName:this.tempData.costName
              }).then(resp=>{
                if(resp && resp.data.code===200){
                  this.$axios.post('http://localhost:20910/api/InspectUpdateTakeMed2/'+this.$store.state.docId+'/'+this.tempData.recordId+'/'+this.tempData.costName,{
                    docId:this.$store.state.docId,
                    recordId:this.tempData.recordId,
                    costName:this.tempData.costName
                  }).then(resp=>{
                    if(resp && resp.data.code===200){
                      this.$message({
                        message:'已执行',
                        type:'success'
                      })
                      this.loadPatient()
                    }
                  })
                  this.$message({
                    message:'录入成功',
                    type:'success'
                  })
                }
              })
            }else{
              this.$message.error("请输入检查结果")
            }
          },
          cancel(row){
            this.$axios.post('http://localhost:20910/api/InspectUpdateTakeMed0/' + this.$store.state.docId + '/' + row.recordId + '/' + row.costName, {
              docId: this.$store.state.docId,
              recordId: row.recordId,
              costName: row.costName
            }).then(resp => {
              if (resp && resp.data.code === 200) {
                this.$message({
                  message: '取消成功',
                  type: 'success'
                })
                this.loadPatient()
              }
            })
          },
        }
    }
</script>

<style>
  .hhh{
    background-color: #409EFF ;
  }
  .hh{

    border: 5px solid #8c939d;
    background-color: #8c939d;
    height: 40px;
    color: white;

  }
</style>
