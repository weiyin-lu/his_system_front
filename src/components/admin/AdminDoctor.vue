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
      <el-row style="align-content:center;height:60px;border-width: 2px;">
        <el-col :span="8" :offset="2" style="height:44px;margin-top: 8px;">
          <el-autocomplete
                  clearable
                  class="inline-input"
                  v-model="docname"
                  :fetch-suggestions="docSearch"
                  placeholder="请输入名称"
                  @select="docSelect"
                  @keyup.native="$event.target.value = $event.target.value.replace(/\s+/g,'')"
          ></el-autocomplete>
        </el-col>
        <el-col :span="4" :offset="4" style="margin-top: 8px;">
          <el-button type="primary" icon="el-icon-search" @click="docQuery">查询用户</el-button>
        </el-col>
        <el-col :span="4" style="margin-top: 8px;">
          <el-button type="primary" icon="el-icon-circle-plus-outline" @click="docAdd">新增用户</el-button>
        </el-col>
      </el-row>
      <el-dialog title="新增/修改" :visible.sync="dialogFormVisible" @close="clear" top="1%">
        <div style="overflow: scroll;height: 65vh">
          <el-form :model="DocForm" label-position="left" label-width="100px">
            <el-form-item prop="doc_id" label="用户编码">
              <label slot="label">用&nbsp;&nbsp;&nbsp;户&nbsp;&nbsp;&nbsp;编&nbsp;&nbsp;码</label>
              <el-input v-model="DocForm.docId" :disabled="true" style="width: 300px"></el-input>
            </el-form-item>
            <el-form-item prop="doc_name" label="用户名">
              <label slot="label">用&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</label>
              <el-input v-model="DocForm.name" style="width: 300px" clearable
                        @keyup.native="$event.target.value = $event.target.value.replace(/\s+/g,'')"></el-input>
            </el-form-item>
            <el-form-item prop="password" label="登陆密码">
              <label slot="label">登&nbsp;&nbsp;&nbsp;&nbsp;陆&nbsp;&nbsp;&nbsp;密&nbsp;&nbsp;码</label>
              <el-input v-model="DocForm.password" style="width: 300px" type="password"></el-input>
            </el-form-item>
            <el-form-item prop="" label="选择科室">
              <label slot="label">选&nbsp;&nbsp;&nbsp;择&nbsp;&nbsp;&nbsp;科&nbsp;&nbsp;室</label>
              <el-autocomplete
                      clearable
                      class="inline-input"
                      v-model="namedept"
                      :fetch-suggestions="deptSearch"
                      placeholder="请输入科室名称"
                      @select="deptSelect"
                      style="width: 150px"
                      @keyup.native="$event.target.value = $event.target.value.replace(/\s+/g,'')"
              ></el-autocomplete>
              <el-button type="primary" icon="el-icon-search" @click="deptQuery" style="width: 145px;margin-left: 5px">查询科室</el-button>
            </el-form-item>
            <el-form-item label="科室名称">
              <label slot="label">科&nbsp;&nbsp;&nbsp;室&nbsp;&nbsp;&nbsp;名&nbsp;&nbsp;称</label>
              <el-input v-model="DocForm.dept.deptName" :disabled="true" style="width: 300px"></el-input>
            </el-form-item>
            <el-form-item prop="doc_type" label="用户类型">
              <label slot="label">用&nbsp;&nbsp;&nbsp;户&nbsp;&nbsp;&nbsp;类&nbsp;&nbsp;型</label>
              <el-select v-model="DocForm.userType" placeholder="用户类型" style="width: 300px" @change="handSelect">
                <el-option label="挂号收费员" value="挂号收费员"></el-option>
                <el-option label="门诊医生" value="门诊医生"></el-option>
                <el-option label="医技医生" value="医技医生"></el-option>
                <el-option label="药房操作员" value="药房操作员"></el-option>
                <el-option label="财务管理员" value="财务管理员"></el-option>
                <el-option label="医院管理员" value="医院管理员"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="title" label="职称">
              <label slot="label">职&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称</label>
              <el-select v-model="DocForm.title" placeholder="职称" style="width: 300px"
                         :disabled="!(DocForm.userType==='门诊医生'|| DocForm.userType==='医技医生')">
                <el-option label="主任医师" value="主任医师"></el-option>
                <el-option label="副主任医师" value="副主任医师"></el-option>
                <el-option label="主治医师" value="主治医师"></el-option>
                <el-option label="住院医师" value="住院医师"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="schedule" label="是否参与排班">
              <el-select v-model="DocForm.schedule" placeholder="是否排班" style="width: 300px"
                         :disabled="!(DocForm.userType==='门诊医生'|| DocForm.userType==='医技医生')">
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="" label="选择挂号级别">
              <el-autocomplete
                      clearable
                      :disabled="!(DocForm.userType==='门诊医生'|| DocForm.userType==='医技医生')"
                      class="inline-input"
                      v-model="namereg"
                      :fetch-suggestions="regSearch"
                      placeholder="请输入挂号级别名称"
                      @select="regSelect"
                      style="width: 150px"
                      @keyup.native="$event.target.value = $event.target.value.replace(/\s+/g,'')"
              ></el-autocomplete>
              <el-button type="primary" icon="el-icon-search" @click="regQuery" style="width: 150px"
                         :disabled="!(DocForm.userType==='门诊医生'|| DocForm.userType==='医技医生')">查询挂号级别</el-button>
            </el-form-item>
            <el-form-item label="挂号级别名称">
              <el-input v-model="DocForm.register.regLevel" :disabled="true" style="width: 150px"></el-input>
              <el-button type="primary" icon="el-icon-search" @click="regClear" style="width: 145px;margin-left: 5px;"
                         :disabled="!(DocForm.userType==='门诊医生'|| DocForm.userType==='医技医生')">清空挂号级别</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="onSubmit">确 定</el-button>
        </div>
      </el-dialog>
      <el-row style="border-width: 1px;border-style: solid; border-color: #eaeaea">
        <el-table
          highlight-current-row
          height="550"
          :data="docs"
          style="width: 100%">
          <el-table-column
            type="index">
          </el-table-column>
          <el-table-column
            prop="docId"
            label="用户编码">
          </el-table-column>
          <el-table-column
            prop="name"
            label="用户名">
          </el-table-column>
          <el-table-column
            prop="dept.deptName"
            label="所在科室">
          </el-table-column>
          <el-table-column
            prop="userType"
            label="用户类型">
          </el-table-column>
          <el-table-column
            prop="title"
            label="职称">
          </el-table-column>
          <el-table-column
            prop="register.regLevel"
            label="挂号级别">
          </el-table-column>
          <el-table-column
            prop="schedule"
            label="是否参与排班"
            width="50">
            <template slot-scope="scope">
              <span v-if="scope.row.schedule === 0">否</span>
              <span v-if="scope.row.schedule === 1">是</span>
            </template>
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
                      @click="docEdit(scope.row)">编辑</el-button>
              <el-button
                      v-if="scope.row.status===1"
                      size="mini"
                      type="danger"
                      @click="docDelete(scope.row)">删除</el-button>
              <el-button
                      v-if="scope.row.status===0"
                      size="mini"
                      type="success"
                      @click="addDoc(scope.row)">激活</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-main>
</template>

<script>
import axios from "axios";

    export default {
        name: "UserManage",
        data() {
            return {
                /*用于判断是否修改密码*/
                flag:'1',
                /*存储原始密码*/
                pwd:'',
                /*当前用户*/
                user:'',
                returnimg: require('@/assets/返回.png'),
                quitimg: require('@/assets/+退出.png'),
                dialogFormVisible: false,
                /*搜索使用用户名*/
                docname:'',
                /*默认全部用户及搜索后的结果*/
                docs:[],
                /*全部用户*/
                docall:[],
                /*搜索部门使用的部门名*/
                namedept:'',
                /*搜索部门结果*/
                dept:[],
                /*全部部门*/
                deptall:[],
                /*搜索挂号级别使用的名称*/
                namereg:'',
                /*搜索挂号级别结果*/
                reg:[],
                /*全部挂号级别*/
                regall:[],
                DocForm:{
                    docId:'',
                    dept:{deptId:'',
                        deptName:'',
                        deptType:'',
                        deptFunc:'',
                        status:''},
                    register:{regId:'',
                        regLevel:'',
                        regLimit:'',
                        regCost:'',
                        regOrder:'',
                        subject:'',
                        status:''},
                    password:'',
                    name:'',
                    userType:'',
                    title:'',
                    schedule:'',
                    status:''
                }
            }
        },
        mounted(){
          // this.loaddocs();
        },
        methods: {
          /*获取全部用户 科室信息*/
            loaddocs(){
                axios.get('http://localhost:20910/api/admin/docs').then(resp => {
                    if (resp && resp.data.code === 200) {
                        this.docs = resp.data.result;
                        this.docall = resp.data.result;
                    }
                })
                this.user = JSON.parse(sessionStorage.getItem('user'));
              axios.get('http://localhost:20910/api/admin/depts').then(resp => {
                if (resp && resp.data.code === 200) {
                  this.deptall = resp.data.result;
                }
              })
              axios.get('http://localhost:20910/api/admin/regs').then(resp => {
                if (resp && resp.data.code === 200) {
                  this.regall = resp.data.result;
                }
              })
            },
          /*根据用户名称查询用户*/
            docQuery(){
                axios.get('http://localhost:20910/api/admin/docs/name='+this.docname).then(resp => {
                    if (resp && resp.data.code === 200) {
                        this.docs = resp.data.result;
                    }
                });
            },
          /*根据科室名称查询科室*/
            deptQuery(){
                axios.get('http://localhost:20910/api/admin/depts/'+this.namedept).then(resp => {
                    if (resp && resp.data.code === 200) {
                        this.dept = resp.data.result;
                        if(this.dept.length===0){
                            this.$message({
                                type: 'error',
                                message: '无此科室!'
                            });
                        } else{
                            this.DocForm.dept=this.dept[0];
                        }
                    }
                });
            },
          /*根据挂号级别名称查询挂号级别*/
            regQuery(){
                axios.get('http://localhost:20910/api/admin/regs/'+this.namereg).then(resp => {
                    if (resp && resp.data.code === 200) {
                        this.reg = resp.data.result;
                        if(this.reg.length===0){
                            this.$message({
                                type: 'error',
                                message: '无此挂号级别!'
                            });
                        } else{
                            this.DocForm.register = this.reg[0];
                        }
                    }
                });
            },
          /*清空挂号级别*/
            regClear(){
              this.DocForm.register = {
                regId:null,
                regLevel:'',
                regLimit:'',
                regCost:'',
                regOrder:'',
                subject:'',
                status:''
              };this.namereg = '';
            },
          /*添加用户，生成最大值+1作为id*/
            docAdd(){
                this.dialogFormVisible = true;
                this.DocForm.docId = (Math.max.apply(null,this.docall.map(item=>{return item.docId}))+1);
                if(this.DocForm.docId < 0){
                  this.DocForm.docId = '1';
                }
                this.DocForm.status = '1';
            },
          /*编辑用户信息*/
            docEdit(item){
              this.DocForm = {
                docId:item.docId,
                dept:item.dept,
                register:item.register,
                name:item.name,
                password:item.password,
                userType:item.userType,
                title:item.title,
                schedule:item.schedule,
                status: item.status
              }
              this.pwd = item.password;
              if(this.DocForm.register===null){
                this.DocForm.register = {
                  regId:null,
                  regLevel:'',
                  regLimit:'',
                  regCost:'',
                  regOrder:'',
                  subject:'',
                  status:''
                }
              }
              this.dialogFormVisible = true;
            },
          /*激活用户*/
            addDoc(item){
              /*判断密码是否已更改*/
              if(this.pwd!==this.DocForm.password){
                this.flag = '0';
              }else{
                this.flag = '1';
              }
              axios.post('http://localhost:20910/api/admin/docs/new/'+this.flag, {
                docId: item.docId,
                dept: item.dept,
                register: item.register,
                name: item.name,
                password: item.password,
                userType: item.userType,
                title: item.title,
                schedule: item.schedule,
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
                this.loaddocs();
              })
            },
          /*信息验证*/
          handSelect(item){
            console.log(item);
            if( item.userType !== '门诊医生'||item.userType!=='医技医生'){

              this.DocForm.title='';
              this.DocForm.schedule = 0;
              this.DocForm.register = {
                regId:null,
                regLevel:'',
                regLimit:'',
                regCost:'',
                regOrder:'',
                subject:'',
                status:''
              };
            }
          },
          /*删除用户信息*/
            docDelete(item){
              /*判断是否是当前登录用户*/
              if(item.docId===this.user.docId) {
                this.$message({
                  type: 'error',
                  message: '无此权限！'
                });
              }else {
                this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  axios.post('http://localhost:20910/api/admin/docs/delete', {
                    docId: item.docId,
                    dept: item.dept,
                    register: item.register,
                    name: item.name,
                    password: item.password,
                    userType: item.userType,
                    title: item.title,
                    schedule: item.schedule,
                    status: item.status
                  }).then(resp => {
                    if (resp && resp.data.code === 200) {
                      this.$message({
                        type: 'success',
                        message: '删除成功!'
                      });
                    } else {
                      this.$message({
                        type: 'error',
                        message: "删除失败，" + resp.data.message
                      });
                    }
                    this.loaddocs();
                  })
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消删除'
                  });
                });
              }
            },
          /*关闭新增/修改窗口，格式化数据*/
            clear(){
                this.namedept = '';
                this.dept = [];
                this.DocForm = {
                    docId:'',
                    dept:{deptId:'',
                        deptName:'',
                        deptType:'',
                        deptFunc:'',
                        status:''},
                    register:{regId:'',
                        regLevel:'',
                        regLimit:'',
                        regCost:'',
                        regOrder:'',
                        subject:'',
                        status:''},
                    password:'',
                    name:'',
                    userType:'',
                    title:'',
                    schedule:'',
                    status:''
                }
            },
          /*提交用户更改信息*/
            onSubmit(){
                if(this.DocForm.name.length < 1|| this.DocForm.name===" "||
                        this.DocForm.userType.length < 1||
                        this.DocForm.dept.deptId.length < 1||
                        this.DocForm.password.length < 8){
                    this.$message({
                        type: 'error',
                        message: '请完整填写信息！'
                    });
                }else{
                    if(this.pwd!==this.DocForm.password){
                      this.flag = '0';
                    }else{
                      this.flag = '1';
                    }
                                axios.post('http://localhost:20910/api/admin/docs/new/'+this.flag, {
                                    docId:this.DocForm.docId,
                                    dept:this.DocForm.dept,
                                    register:this.DocForm.register,
                                    password:this.DocForm.password,
                                    name:this.DocForm.name,
                                    userType:this.DocForm.userType,
                                    title:this.DocForm.title,
                                    schedule:this.DocForm.schedule,
                                    status:this.DocForm.status
                                }).then(resp => {
                                    if (resp && resp.data.code === 200) {
                                        this.dialogFormVisible = false;
                                        this.loaddocs();
                                    }
                                })
                }
            },
          /*返回管理员主界面*/
            returnmain(){
                this.$router.replace({path: '/admin'});
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
          /*提示科室名称*/
            deptSearch(queryString, cb) {
              let depts = this.deptall;
              depts = depts.map(item=>{
              item.value = item.deptName;
              return item;
              });
              let results = queryString ? depts.filter(this.createFilter(queryString)) : depts;
              // 调用 callback 返回建议列表的数据
              cb(results);
            },
          /*根据输入信息对科室信息进行筛选*/
            createFilter(queryString) {
              return (dept) => {
                return (dept.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
              };
            },
          /*选中某科室信息后处理*/
            deptSelect(item) {
              this.DocForm.dept = {deptId:item.deptId,
                deptName:item.deptName,
                deptType:item.deptType,
                deptFunc:item.deptFunc,
                status:item.status
              };
            },
          /*用户名称提示函数*/
            docSearch(queryString, cb) {
              let doc = this.docall;
              doc = doc.map(item=>{
                item.value = item.name+'('+item.docId+')';
                return item;
              });
              let results = queryString ? doc.filter(this.createFilter(queryString)) : doc;
              // 调用 callback 返回建议列表的数据
              cb(results);
            },
          /*选中某用户名后处理*/
            docSelect(item) {
              this.docs = [{
                docId:item.docId,
                dept:item.dept,
                register:item.register,
                name:item.name,
                password:item.password,
                userType:item.userType,
                title:item.title,
                schedule:item.schedule,
                status: item.status
              }];
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
          /*选中某挂号级别后处理*/
            regSelect(item) {
              this.DocForm.register = {
                regId:item.regId,
                regLevel:item.regLevel,
                regLimit:item.regLimit,
                regCost:item.regCost,
                regOrder:item.regOrder,
                subject:item.subject,
                status:item.status
              };
            },
        }
    }
</script>

<style scoped>

</style>
