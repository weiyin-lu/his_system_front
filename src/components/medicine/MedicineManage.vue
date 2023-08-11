<template>
<el-row>
  <el-col :span="4"><div class="h"><el-button type="primary" class="el-icon-s-home" @click="re">主菜单</el-button> </div></el-col>
  <el-col :span="16"><div class="hh">欢迎来到药品管理</div></el-col>
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
  <el-col :span="7"><div><el-input v-model.trim="name" placeholder="请输入药品名称" style="width: 80%;" clearable></el-input></div></el-col>
  <el-col :span="7"><div><el-input v-model.trim="input" placeholder="请输入药品助记符" style="width: 80%;" clearable></el-input></div></el-col>
  <el-col :span="3"><div><el-button class="el-icon-search" @click="search" type="primary">查询药品</el-button></div></el-col>
  <el-col :span="3">
    <div>
      <el-button class="el-icon-folder-add" @click="newdialogVisible=true" type="primary">新增药品</el-button>
      <el-dialog title="编辑" :visible.sync="newdialogVisible"  top = "1%" width="28%" :append-to-body="true" @close="clear">
        <div style="height: 70vh;min-width: auto;overflow: scroll">
          <el-form v-model="form" style="display: inline-block" ref="dataForm" label-position="right" label-width="80px">
            <el-form-item label="药品名称:" :label-width="formLabelWidth" prop="name">
              <el-input v-model.trim="form.name" placeholder="输入药品名称" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="拼音助记符:" :label-width="formLabelWidth" prop="code">
              <el-input v-model.trim="form.code" placeholder="输入拼音助记符" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="药品规格:" :label-width="formLabelWidth" prop="standard">
              <el-input v-model.trim="form.standard" placeholder="输入药品规格" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="药品剂型:" :label-width="formLabelWidth" prop="dosage">
              <el-input v-model.trim="form.dosage" placeholder="输入药品剂型" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="药品单位:" :label-width="formLabelWidth" prop="unit">
              <el-input v-model.trim="form.unit" placeholder="输入药品单位" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="药品单价:" :label-width="formLabelWidth" prop="cost">
              <el-input v-model.trim="form.cost" placeholder="输入药品单价" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="药品类型:" :label-width="formLabelWidth" prop="type">
              <template>
                <el-select v-model.trim="form.type" placeholder="请选择" style="width: 100.6%">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-form-item>
            <el-form-item label="费用类型:" :label-width="formLabelWidth" prop="subject">
              <template>
                <el-select v-model.trim="form.subject" placeholder="请选择" style="width: 100.6%">
                  <el-option
                    v-for="item in options1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-form-item>
            <el-form-item label="药品状态:" :label-width="formLabelWidth" prop="status">
              <el-input v-model.trim="form.status" placeholder="输入药品单价" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <div style="float: right">
                <el-button @click="newdialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit1">确 定</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
    </div></el-col>
  <el-col :span="2"><div><el-button class="el-icon-refresh" @click="refresh" type="primary">刷新</el-button></div></el-col>

  <el-col :span="2"><div><el-button class="el-icon-refresh-left" type="primary" @click="kong">清空</el-button> </div></el-col>
  <el-col :span="24"><div>
    <el-table  border height="740px" style="align-content: center;margin-top: 40px" :data="tableData" class="table">
      <el-table-column
        prop="id"
        label="药品编号"
        min-width="10%">
      </el-table-column>
      <el-table-column
        prop="name"
        label="药品名称"
        min-width="9%">
      </el-table-column>
      <el-table-column
        prop="code"
        label="拼音助记码"
        min-width="9%">
      </el-table-column>
      <el-table-column
        prop="standard"
        label="药品规格"
        min-width="9%">
      </el-table-column>
      <el-table-column
        prop="dosage"
        label="药品剂型"
        min-width="9%">
      </el-table-column>
      <el-table-column
        prop="unit"
        label="药品单位"
        min-width="9%">
      </el-table-column>
      <el-table-column
        prop="cost"
        label="药品单价"
        min-width="9%">
      </el-table-column>
      <el-table-column
        prop="type"
        label="药品类型"
        min-width="9%">
      </el-table-column>
      <el-table-column
        prop="subject"
        label="费用类型"
        min-width="10%">
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="11%">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="editDialog(scope.$index,scope.row)">编辑</el-button>
          <el-dialog title="编辑" :visible.sync="dialogVisible"  top = "1%" width="35%" :append-to-body="true" @close="clear" style="text-align: center">
            <div style="height: 70vh;min-width: auto;overflow: scroll">
              <el-form v-model="form" style="display: inline-block" ref="dataForm" label-position="right" label-width="80px">
                <el-form-item label="药品编号:" :label-width="formLabelWidth" prop="id">
                  <el-input v-model.trim="form.id" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="药品名称:" :label-width="formLabelWidth" prop="name">
                  <el-input v-model.trim="form.name" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="拼音助记符:" :label-width="formLabelWidth" prop="code">
                  <el-input v-model.trim="form.code" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="药品规格:" :label-width="formLabelWidth" prop="standard">
                  <el-input v-model.trim="form.standard" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="药品剂型:" :label-width="formLabelWidth" prop="dosage">
                  <el-input v-model.trim="form.dosage" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="药品单位:" :label-width="formLabelWidth" prop="unit">
                  <el-input v-model.trim="form.unit" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="药品单价:" :label-width="formLabelWidth" prop="cost">
                  <el-input v-model.trim="form.cost" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="药品类型:" :label-width="formLabelWidth" prop="type">
                  <template>
                    <el-select v-model.trim="form.type" placeholder="请选择" style="width: 100.6%">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </template>
                </el-form-item>
                <el-form-item label="费用类型:" :label-width="formLabelWidth" prop="subject">
                  <template>
                    <el-select v-model.trim="form.subject" placeholder="请选择" style="width: 100.6%">
                      <el-option
                        v-for="item in options1"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </template>
                </el-form-item>
                <el-form-item>
                  <div style="float: right">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="onSubmit">确 定</el-button>
                  </div>
                </el-form-item>
              </el-form>
            </div>
          </el-dialog>
          <el-button type="danger" size="mini" style="margin-left: 5px" @click.native="deleteDrug(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div></el-col>
</el-row>
</template>

<script>
    export default {
        name: "OutpatientDrugManagement",
        data(){
            return{
                dialogVisible:false,
                newdialogVisible:false,
                name:'',
                name1:'',
                getDocInfo:[],
                input:'',
                tableData:[{
                    id:'',
                    name:'',
                    code:'',
                    standard:'',
                    dosage:'',
                    unit:'',
                    cost:'',
                    type:'',
                    subject:'',
                }],
                options:[{
                    value:'中药',
                    label:'中药',
                },{
                    value:'西药',
                    label:'西药'
                }],
                options1:[/*{
                    value:'中药费',
                    label:'中药费',
                },{
                    value:'西药费',
                    label:'西药费'
                }*/],
                form:{
                    id:'',
                    name:'',
                    code:'',
                    standard:'',
                    dosage:'',
                    unit:'',
                    cost:'',
                    type:'',
                    subject:'',
                    status:'',
                },
                formLabelWidth: '120px'
            }
        },
        mounted:function(){
            this.loadMedicine()
            this.getDocInfoFuc()
            this.subjectLoad()
        },
        methods:{
          subjectLoad(){
            let _this = this;
            axios.get("http://localhost:20910/fee/findAll").then(function(resp){
              for(let item of resp.data) {
                _this.options1.push({
                  'value': item.subject,
                  'lable': item.subject,
                });
              }
            });
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
            editDialog(index,row){
                this.dialogVisible=true
                this.form={
                    id:row.id,
                    name:row.name,
                    code:row.code,
                    standard:row.standard,
                    dosage:row.dosage,
                    unit:row.unit,
                    cost:row.cost,
                    type:row.type,
                    subject:row.subject,
                }
            },
            clear(){
              this.form={
                  id:'',
                  name:'',
                  code:'',
                  standard:'',
                  dosage:'',
                  unit:'',
                  cost:'',
                  type:'',
                  subject:'',
              }
            },
            refresh(){

                this.loadMedicine()
            },
          kong(){
            this.input=''
            this.name=''
          },
            loadMedicine(){
                let _this = this
                axios.get('http://localhost:20910/api/medical').then(resp => {
                    if (resp) {
                        _this.tableData = resp.data.result
                        console.log(resp.data.result)
                    }
                })
            },
            re(){
                this.$router.replace('/OutpatientDepartment')
            },
            search(){
                if(this.input && !this.name){
                    axios.get('http://localhost:20910/api/searchMedicalByCode/'+this.input,{
                        code:this.input
                    }).then(resp => {
                        if (resp&&resp.data.code === 200) {
                            this.tableData=resp.data.result
                            if(this.tableData.length===0){
                                this.$message.error("查询失败")
                            }else{
                                this.$message({
                                    message:'查询成功',
                                    type:'success'
                                })
                            }
                        }
                    })
                }else if(this.name && !this.input){
                    axios.get('http://localhost:20910/api/searchMedicalByName/'+this.name,{
                        name:this.name
                    }).then(resp => {
                        if (resp&&resp.data.code === 200) {
                            this.tableData=resp.data.result
                            if(this.tableData.length===0){
                                this.$message.error("查询失败")
                            }else{
                                this.$message({
                                    message:'查询成功',
                                    type:'success'
                                })
                            }
                        }
                    })
                }else if(this.name && this.input){
                    axios.get('http://localhost:20910/api/searchMedicalByNameAndCode/'+this.name+"/"+this.input,{
                        name:this.name,
                        code:this.input
                    }).then(resp => {
                        if (resp&&resp.data.code === 200) {
                            this.tableData=resp.data.result
                            if(this.tableData.length===0){
                                this.$message.error("查询失败")
                            }else{
                                this.$message({
                                    message:'查询成功',
                                    type:'success'
                                })
                            }
                        }
                    })
                }else {
                    this.$message.error("请输入查询条件")
                }
            },
            deleteDrug(id) {

                this.$confirm('此操作将永久删除该药品, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                        this.$axios
                            .post('http://localhost:20910/api/deleteMedical/'+id, {id: id}).then(resp => {
                            if (resp) {
                              let s = resp.data
                                this.loadMedicine()
                                if(s === 0){
                                  this.$message.error("删除失败！其他数据使用中！")
                                }else{
                                  this.$message({
                                    message:'删除成功',
                                    type:'success'
                                  })
                                }
                            }
                        })
                    }
                ).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            onSubmit1(){
                this.$axios.post('http://localhost:20910/api/insert',{
                    id:this.form.id,
                    name:this.form.name,
                    code:this.form.code,
                    standard:this.form.standard,
                    dosage:this.form.dosage,
                    unit:this.form.unit,
                    cost:this.form.cost,
                    type:this.form.type,
                    subject:this.form.subject,
                    deptId:10,
                    status:1
                }).then(resp => {
                    if (resp && resp.status === 200) {
                        this.$message({
                            message:'编辑成功',
                            type:'success'
                        });
                        this.dialogVisible = false
                        this.newdialogVisible = false
                        this.loadMedicine()
                    }
                })
            },
            onSubmit(){
                this.$axios.post('http://localhost:20910/api/update',{
                    id:this.form.id,
                    name:this.form.name,
                    code:this.form.code,
                    standard:this.form.standard,
                    dosage:this.form.dosage,
                    unit:this.form.unit,
                    cost:this.form.cost,
                    type:this.form.type,
                    subject:this.form.subject,
                    deptId:10,
                    status:1
                }).then(resp => {
                    if (resp && resp.status === 200) {
                        this.$message({
                            message:'编辑成功',
                            type:'success'
                        });
                        this.dialogVisible = false
                        this.newdialogVisible = false
                        this.loadMedicine()
                    }
                })
            }
        }
    }
</script>

<style scoped>
  .table{
    border: 1px solid #66b1ff;
  }
  .h{
    background-color: #409EFF ;

  }
  .hh{

    border: 5px solid #8c939d;
    background-color: #8c939d;
    height: 30px;

  }
</style>
