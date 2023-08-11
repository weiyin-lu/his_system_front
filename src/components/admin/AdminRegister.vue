<template>
  <el-main>
    <el-row style="background-color: #00FFFF">
      <el-col :span="1" :offset="0">
        <div class="top">
          <el-image
            style="width: 40px; height: 40px"
            :src="returnimg"
            @click="returnmain"></el-image>
        </div></el-col>
      <el-col :span="1" :offset="21">
        <div style="text-align: center;margin-top: 20%">
          {{user.username}}
        </div>
      </el-col>
      <el-col :span="1" >
        <div class="top">
          <el-image
            style="width: 40px; height: 40px"
            :src="quitimg"
            @click="logout"></el-image>
      </div></el-col>
    </el-row>
    <el-row style="align-content:center;height:60px;">
      <el-col :span="8" :offset="2" style="height:44px;margin-top: 8px;">
        <el-autocomplete
                clearable
                class="inline-input"
                v-model="reglevel"
                :fetch-suggestions="regSearch"
                placeholder="请输入挂号级别名称"
                @select="regSelect"
                style="width: 150px"
                @keyup.native="$event.target.value = $event.target.value.replace(/\s+/g,'')"
        ></el-autocomplete>
      </el-col>
      <el-col :span="4" :offset="4" style="margin-top: 8px;">
        <el-button type="primary" icon="el-icon-search" @click="regQuery">查询挂号级别</el-button>
      </el-col>
      <el-col :span="4" style="margin-top: 8px;">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="regAdd">新增挂号级别</el-button>
      </el-col>
    </el-row>
    <el-dialog title="新增/修改" :visible.sync="dialogFormVisible" @close="clear" width="40%">
      <el-form :model="RegForm" label-position="left" label-width="20%" style="width: 100%">
        <el-form-item prop="reg_level" label="挂号级别名称">
          <el-input v-model="RegForm.regLevel" clearable
                    @keyup.native="$event.target.value = $event.target.value.replace(/\s+/g,'')"></el-input>
        </el-form-item>
        <el-form-item prop="reg_limit" label="挂号级别限额">
          <el-input v-model="RegForm.regLimit" clearable type="number"></el-input>
        </el-form-item>
        <el-form-item prop="reg_cost" label="挂号费">
          <label slot="label">挂&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;费</label>
          <el-input v-model="RegForm.regCost" clearable type="number"></el-input>
        </el-form-item>
        <el-form-item prop="reg_cost" label="显示顺序号">
          <label slot="label">显&nbsp;示&nbsp;顺&nbsp;序&nbsp;号</label>
          <el-input v-model="RegForm.regOrder" clearable type="number"></el-input>
        </el-form-item>
        <el-form-item prop="reg_cost" label="挂号费科目">
          <label slot="label">挂&nbsp;号&nbsp;费&nbsp;目&nbsp;科</label>
          <el-input v-model="RegForm.subject" clearable
                    @keyup.native="$event.target.value = $event.target.value.replace(/\s+/g,'')"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <el-row style="border-width: 1px;border-style: solid; border-color: #eaeaea">
      <el-table
        highlight-current-row
        height="550"
        :data="regs"
        style="width: 100%">
        <el-table-column
          type="index">
        </el-table-column>
        <el-table-column
          prop="regLevel"
          label="级别名称">
        </el-table-column>
        <el-table-column
          prop="regLimit"
          label="级别限额">
        </el-table-column>
        <el-table-column
          prop="regOrder"
          label="级别显示序号">
        </el-table-column>
        <el-table-column
          prop="regCost"
          label="挂号费">
        </el-table-column>
        <el-table-column
          prop="subject"
          label="科目">
        </el-table-column>
        <el-table-column
          prop="status"
          label="有效性">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">失效</span>
            <span v-if="scope.row.status === 1">有效</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
                    :disabled="scope.row.status===0"
                    size="mini"
                    @click="regEdit(scope.row)">编辑</el-button>
            <el-button
                    v-if="scope.row.status===1"
                    size="mini"
                    type="danger"
                    @click="regDelete(scope.row)">删除</el-button>
            <el-button
                    v-if="scope.row.status===0"
                    size="mini"
                    type="success"
                    @click="addReg(scope.row)">激活</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </el-main>
</template>

<script>
    export default {
        name: "RegisterManage",
        data(){
            return{
              /*当前用户 */
                user:'',
                returnimg: require('../assets/返回.png'),
                quitimg: require('../assets/+退出.png'),
                dialogFormVisible: false,
              /*搜索使用的名称*/
                reglevel:'',
              /*查询结果*/
                regs:[],
              /*全部挂号级别*/
                regall:[],
                RegForm:{
                    regId:'',
                    regLevel:'',
                    regLimit:'',
                    regCost:'',
                    regOrder:'',
                    subject:'',
                    status:''
                },
                maxregId:''
            }
        },
        mounted(){
          this.loadRegs();
        },
        methods:{
          /*加载全部数据*/
            loadRegs(){
                axios.get('http://localhost:20910/api/admin/regs').then(resp => {
                    if (resp && resp.data.code === 200) {
                        this.regs = resp.data.result;
                        this.regall = resp.data.result;
                    }
                })
                this.user = JSON.parse(sessionStorage.getItem('user'));
            },
          /*清空表格*/
            clear(){
                this.RegForm = {
                    regId:'',
                    regLevel:'',
                    regLimit:'',
                    regCost:'',
                    regOrder:'',
                    subject:'',
                    status: ''
                }
            },
          /*查询挂号级别*/
            regQuery(){
                axios.get('http://localhost:20910/api/admin/regs/'+this.reglevel).then(resp => {
                    if (resp && resp.data.code === 200) {
                        this.regs = resp.data.result;
                    }
                })
            },
          /*挂号级别删除*/
            regDelete(item){
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() =>{
                    axios.post('http://localhost:20910/api/admin/regs/delete', {
                        regId:item.regId,
                        regLevel:item.regLevel,
                        regLimit:item.regLimit,
                        regCost:item.regCost,
                        regOrder:item.regOrder,
                        subject:item.subject,
                        status: item.status
                        }).then(resp => {
                        if (resp && resp.data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }
                        else {
                            this.$message({
                                type: 'error',
                                message:"删除失败，"+resp.data.message
                            });
                        }
                        this.loadRegs();
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
          /*打开编辑窗口*/
            regEdit(item){
                this.RegForm = {
                    regId:item.regId,
                    regLevel:item.regLevel,
                    regLimit:item.regLimit,
                    regCost:item.regCost,
                    regOrder:item.regOrder,
                    subject:item.subject,
                    status: item.status
                }
                this.dialogFormVisible = true;
            },
          /*添加挂号级别*/
            regAdd(){
                this.maxregId = Math.max.apply(null,this.regall.map(item=>{return item.regId}));
                this.maxregId++;
                this.RegForm.regId = this.maxregId;
              if(this.RegForm.regId < 0){
                this.RegForm.regId = '1';
              }
                this.RegForm.status = '1';
                this.dialogFormVisible = true;
            },
          /*激活挂号级别*/
          addReg(item){
            axios.post('http://localhost:20910/api/admin/regs', {
              regId:item.regId,
              regLevel:item.regLevel,
              regLimit:item.regLimit,
              regCost:item.regCost,
              regOrder:item.regOrder,
              subject:item.subject,
              status: '1'
            }).then(resp => {
              if (resp && resp.data.code === 200) {
                this.$message({
                  type: 'success',
                  message: '激活成功!'
                });
              } else {
                this.$message({
                  type: 'error',
                  message: "激活失败，" + resp.data.message
                });
              }
              this.loadRegs();
            })
          },
          /*提交修改后的数据*/
            onSubmit(){
              if(this.RegForm.regLevel.length<1||this.RegForm.regLevel===" "||
                      this.RegForm.regLimit.length<1||this.RegForm.regCost.length<1|| this.RegForm.regOrder.length<1||
                      this.RegForm.subject.length<1||this.RegForm.subject===" "){
                this.$message({
                  type: 'error',
                  message: '请完整填写信息！'
                });
              }else {
                axios.post('http://localhost:20910/api/admin/regs', {
                  regId: this.RegForm.regId,
                  regLevel: this.RegForm.regLevel,
                  regLimit: this.RegForm.regLimit,
                  regCost: this.RegForm.regCost,
                  regOrder: this.RegForm.regOrder,
                  subject: this.RegForm.subject,
                  status: this.RegForm.status
                }).then(resp => {
                  if (resp && resp.data.code === 200) {
                    this.dialogFormVisible = false;
                    this.loadRegs();
                  }
                })
              }
            },
          /*返回主界面*/
            returnmain(){
                this.$router.replace({path: '/hh'});
            },
          /*退出*/
            logout(){
                this.$confirm('确定退出？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    window.sessionStorage.removeItem("user");
                    this.$router.replace({path: '/'})
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消退出'
                    });
                });
            },
          /*挂号级别提示函数*/
          regSearch(queryString, cb) {
            let reg = this.regall;
            reg = reg.map(item=>{
              item.value = item.regLevel;
              return item;
            });
            let results = queryString ? reg.filter(this.createFilter(queryString)) : reg;
            // 调用 callback 返回建议列表的数据
            cb(results);
          },
          /*根据输入信息对科室信息进行筛选*/
          createFilter(queryString) {
            return (reg) => {
              return (reg.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
          },
          /*选中某挂号级别后处理*/
          regSelect(item) {
            this.regs = [{
              regId:item.regId,
              regLevel:item.regLevel,
              regLimit:item.regLimit,
              regCost:item.regCost,
              regOrder:item.regOrder,
              subject:item.subject,
              status:item.status
            }];
          },
        }
    }
</script>

<style scoped>

</style>
