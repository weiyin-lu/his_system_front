<template>
<el-row>
  <el-col :span="4"><div class="h"><el-button type="primary" class="el-icon-s-home" @click="re">主菜单</el-button> </div></el-col>
  <el-col :span="16"><div class="hh">欢迎来到门诊发药</div></el-col>
  <el-col :span="4"><div class="h">
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
  <el-col :span="24" style="margin-top: 40px"></el-col>
  <el-col :span="4"><div><el-input v-model.trim="name" placeholder="请输入患者名称" style="width: 80%"></el-input></div></el-col>
  <el-col :span="4"><div><el-input v-model.trim="input" placeholder="请输入病历号" style="width: 80%"></el-input></div></el-col>
  <el-col :span="6"><div class="block">
    <span class="demonstration">选择时间</span>
    <el-date-picker
      v-model.trim="value1"
      type="date"
      placeholder="选择日期"
      format="yyyy 年 MM 月 dd 日"
      value-format="yyyy-MM-dd">
    </el-date-picker>
  </div></el-col>
  <el-col :span="3"><div><el-button class="el-icon-search" type="primary" @click="search">查询</el-button></div></el-col>
  <el-col :span="3"><div><el-button class="el-icon-refresh" type="primary" @click="refresh">刷新</el-button></div></el-col>
  <el-col :span="3"><div><el-button class="el-icon-refresh-left" type="primary" @click="kong">清空</el-button> </div></el-col>
  <el-col :span="24"><br><br></el-col>
  <el-col :span="24">
    <div>
      <el-table :data="tableData" border height="740px">
        <el-table-column
          prop="name"
          label="患者姓名"
          min-width="10%">
        </el-table-column>
        <el-table-column
          prop="patientId"
          label="患者病历号"
          min-width="10%">
        </el-table-column>
        <el-table-column
          prop="time"
          label="时间"
          min-width="10%">
        </el-table-column>
        <el-table-column
          prop="code"
          label="项目编码"
          min-width="10%">
        </el-table-column>
        <el-table-column
          prop="costName"
          label="项目名称"
          min-width="15%">
        </el-table-column>
        <el-table-column
          prop="payment"
          label="付费状态"
          min-width="10%">
        </el-table-column>
        <el-table-column
          prop="takeMed"
          label="发药状态"
          min-width="10%">
        </el-table-column>
        <el-table-column
          prop="consumption"
          label="用量"
          min-width="10%">
        </el-table-column>
        <el-table-column label="发药确认" min-width="10%">
          <template slot-scope="scope">
            <el-button
                    v-if="scope.row.takeMed===0"
                    size="mini"
                    type="primary"
                    @click="handleConfirm(scope.$index,scope.row)">未发药</el-button>
            <el-button
                    v-if="scope.row.takeMed===1"
                    size="mini"
                    type="danger"
                    @click="handleConfirm(scope.$index,scope.row)"
                    disabled>已发药</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-col>
</el-row>
</template>

<script>
    import http from "@/axios/http";

    export default {
        data(){
            return{
                getDocInfo:[],
                status:'确认发药',
                name:'',
                name1:'',
                num:10,
                tableData:[],
                input:'',
                value1:'',
            }
        },
        created: function(){
            this.loaddip();
            this.getDocInfoFuc();
        },
        methods:{
          kong(){
            this.input=''
            this.value1=''
            this.name=''
          },
            getDocInfoFuc(){
                let _this=this
                http.get("http://localhost:20910/api/getDocInfo/"+this.$store.state.docId,{
                    DocId:this.$store.state.docId
                }).then(resp=>{
                    if(resp && resp.data.code===200){
                        this.getDocInfo=[]
                        _this.getDocInfo.push(resp.data.result)
                        this.name1=_this.getDocInfo[0].name
                    }
                })

            },
            change(index,row){
                if(row.takeMed===1){
                    this.status='已发药'
                    return 'danger'
                }
                else{
                    this.status='确认发药'
                    return 'primary'
                }
            },
            handleChange(value){

            },
            refresh(){

                this.loaddip()
            },
            loaddip(){
                let _this = this
              http.get('http://localhost:20910/api/display').then(resp => {
                    if (resp) {
                      console.log(resp.data)
                        _this.tableData = resp.data.result
                    }
                })
            },
            re(){
                this.$router.replace('/OutpatientDepartment')
            },
            handleConfirm(index, row) {
                const data = {
                    id:row.id
                }
                if(row.payment===0){
                    this.$message.error("失败!未付费")
                }
                else if(row.payment===1&&row.takeMed===0){
                  http.post('http://localhost:20910/api/setMed0/'+row.id,data).then(resp => {
                        if (resp && resp.status === 200) {
                            this.$message({
                                message:'成功',
                                type:'success'
                            })
                            this.loaddip()
                        }
                    })
                }
                else if(row.payment===1){
                    this.$message.error("不可操作")
                }
            },
            search() {
                if(this.name && !this.input && !this.value1){
                  http.get('http://localhost:20910/api/searchDispByName/'+this.name,{
                        name:this.name
                    }).then(resp =>{
                        if(resp && resp.data.code === 200){
                            this.tableData = resp.data.result;
                            if(resp.data.result.length===0){
                                this.$message.error("查询失败")
                            }
                            else{
                                this.$message({
                                    message:'查询成功',
                                    type:'success'
                                })
                            }
                        }

                    })
                }
                else if(this.input && !this.value1){
                  http.get('http://localhost:20910/api/searchDispById/'+this.input,{
                        patientId:this.input
                    }).then(resp =>{
                        if(resp && resp.data.code === 200){
                            this.tableData = resp.data.result;
                            if(resp.data.result.length===0){
                                this.$message.error("查询失败")
                            }
                            else{
                                this.$message({
                                    message:'查询成功',
                                    type:'success'
                                })
                            }
                        }

                    })
                }
                else if(!this.input && this.value1){

                  http.get("http://localhost:20910/api/searchDispByTime/"+this.value1,{
                        time:this.value1
                    }).then(resp=>{
                        if(resp && resp.data.code===200){
                            this.tableData = resp.data.result;
                            if(resp.data.result.length===0){
                                this.$message.error("查询失败")
                            }
                            else{
                                this.$message({
                                    message:'查询成功',
                                    type:'success'
                                })
                            }
                        }
                    })
                }
                else if(this.input && this.value1){
                    console.log(this.value1)
                    console.log(this.input)
                  http.get("http://localhost:20910/api/searchDispByTimeAndId/"+this.value1+"/"+this.input,{
                        time:this.value1,
                        recordId:this.input
                    }).then(resp=>{
                        if(resp && resp.data.code===200){
                            this.tableData = resp.data.result;
                            if(resp.data.result.length===0){
                                this.$message.error("查询失败")
                            }
                            else{
                                this.$message({
                                    message:'查询成功',
                                    type:'success'
                                })
                            }
                        }
                    })
                }
                else{
                    this.$message({
                        message:"请输入查询信息",
                        type:'warning'
                    })
                }
            },
        }
    }
</script>

<style scoped>
  .h{
    background-color: #409EFF ;

  }
  .hh{

    border: 5px solid #8c939d;
    background-color: #8c939d;
    height: 30px;

  }
</style>
