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
                v-model="deptname"
                :fetch-suggestions="deptSearch"
                placeholder="请输入科室名称"
                @select="deptSelect"
                style="width: 150px"
                @keyup.native="$event.target.value = $event.target.value.replace(/\s+/g,'')"
        ></el-autocomplete>
      </el-col>
      <el-col :span="4" :offset="4" style="margin-top: 8px;">
        <el-button type="primary" icon="el-icon-search" @click="deptQuery">查询科室</el-button>
      </el-col>
      <el-col :span="4" style="margin-top: 8px;">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addDept">新增科室</el-button>
      </el-col>
    </el-row>
    <el-dialog title="新增/修改" :visible.sync="dialogFormVisible" @close="clear" width="35%">
      <el-form :model="DeptForm" label-position="left" label-width="20%">
        <el-form-item prop="dept_id" style="height: 0">
          <el-input v-model="DeptForm.deptId" type="hidden"></el-input>
        </el-form-item>
        <el-form-item prop="dept_name" label="科室名称">
          <el-input v-model="DeptForm.deptName" clearable
                    @keyup.native="$event.target.value = $event.target.value.replace(/\s+/g,'')"></el-input>
        </el-form-item>
        <el-form-item prop="dept_type" label="科室分类">
          <el-input v-model="DeptForm.deptType" clearable
                    @keyup.native="$event.target.value = $event.target.value.replace(/\s+/g,'')"></el-input>
        </el-form-item>
        <el-form-item prop="dept_func" label="科室类型">
          <el-input v-model="DeptForm.deptFunc" clearable
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
        :data="depts"
        style="width: 100%">
        <el-table-column
          type="index">
        </el-table-column>
        <el-table-column
          prop="deptId"
          label="科室编码">
        </el-table-column>
        <el-table-column
          prop="deptName"
          label="科室名称">
        </el-table-column>
        <el-table-column
          prop="deptType"
          label="科室分类">
        </el-table-column>
        <el-table-column
          prop="deptFunc"
          label="科室类型">
        </el-table-column>
        <el-table-column
          prop="status"
          label="是否有效">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">失效</span>
            <span v-if="scope.row.status === 1">有效</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
                    :disabled="scope.row.status===0"
                    size="mini"
                    @click="deptEdit(scope.row)">编辑</el-button>
            <el-button
                    v-if="scope.row.status===1"
                    size="mini"
                    type="danger"
                    @click="deptDelete(scope.row)">删除</el-button>
            <el-button
                    v-if="scope.row.status===0"
                    size="mini"
                    type="success"
                    @click="deptAdd(scope.row)">激活</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </el-main>
</template>

<script>
    export default {
        name: "DeptManage",
        data() {
            return {
              /*当前用户*/
                user:'',
                returnimg: require('../assets/返回.png'),
                quitimg: require('../assets/+退出.png'),
                dialogFormVisible: false,
              /*显示用的部门信息*/
                depts: [],
              /*全部部门信息*/
                deptall:[],
              /*搜索使用的名字*/
                deptname:'',
                DeptForm:{
                    deptId:'',
                    deptName:'',
                    deptType:'',
                    deptFunc:'',
                    status:''
                },
                maxId:''
            }
        },
        mounted () {
            this.loadDepts();
        },
        methods: {
          /*获取全部科室信息*/
            loadDepts(){
                axios.get('http://localhost:20910/api/admin/depts').then(resp => {
                    if (resp && resp.data.code === 200) {
                       this.depts = resp.data.result;
                       this.deptall = resp.data.result;
                    }
                })
                this.user = JSON.parse(sessionStorage.getItem('user'));
            },
          /*科室信息编辑*/
            deptEdit(item) {
                this.dialogFormVisible = true;
                this.DeptForm = {
                    deptId:item.deptId,
                    deptName:item.deptName,
                    deptType:item.deptType,
                    deptFunc:item.deptFunc,
                    status: item.status
                }
            },
          /*科室查询*/
            deptQuery(){
                axios.get('http://localhost:20910/api/admin/depts/'+this.deptname).then(resp => {
                    if (resp && resp.data.code === 200) {
                        this.depts = resp.data.result;
                    }
                })
            },
          /*科室删除*/
            deptDelete(item){
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios.post('http://localhost:20910/api/admin/depts/delete', {
                            deptId:item.deptId,
                            deptName:item.deptName,
                            deptType:item.deptType,
                            deptFunc:item.deptFunc,
                            status:item.status
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
                        this.loadDepts();
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
          /*新增科室*/
            addDept(){
                this.maxId = Math.max.apply(null,this.deptall.map(item=>{return item.deptId}))
                this.maxId++;
                this.dialogFormVisible = true;
                this.DeptForm.deptId = this.maxId;
                if(this.DeptForm.deptId < 0){
                this.DeptForm.deptId = '1';
                }
                this.DeptForm.status = '1';
            },
          /*激活科室*/
            deptAdd(item){
              axios.post('http://localhost:20910/api/admin/depts', {
                deptId:item.deptId,
                deptName:item.deptName,
                deptType:item.deptType,
                deptFunc:item.deptFunc,
                status:'1'
              }).then(resp => {
                        if (resp && resp.data.code === 200) {
                          this.$message({
                            type: 'success',
                            message: '激活成功!'
                          });
                        }
                        else {
                          this.$message({
                            type: 'error',
                            message:"激活失败，"+resp.data.message
                          });
                        }
                        this.loadDepts();
              })
            },
          /*清空表格信息*/
            clear(){
                this.DeptForm={
                    deptId:'',
                    deptName:'',
                    deptType:'',
                    deptFunc:'',
                    status: ''
                }
            },
          /*提交用户请求*/
            onSubmit () {
              if(this.DeptForm.deptName.length < 1 || this.DeptForm.deptName === " "||
                      this.DeptForm.deptType.length < 1 || this.DeptForm.deptType === " "||
                      this.DeptForm.deptFunc.length < 1 ||this.DeptForm.deptFunc === " "){
                this.$message({
                  type: 'error',
                  message: '请完整填入信息！'
                });
              }else {
                axios.get('http://localhost:20910/api/admin/depts/' + this.DeptForm.deptName).then(resp => {
                  if (resp && resp.data.code === 200) {
                    let dept = resp.data.result;
                    if (dept.length !== 0 && dept[0].deptId !== this.DeptForm.deptId) {
                      this.$message({
                        type: 'error',
                        message: '部门名重复！'
                      });
                    } else {
                      axios.post('http://localhost:20910/api/admin/depts', {
                        deptId: this.DeptForm.deptId,
                        deptName: this.DeptForm.deptName,
                        deptType: this.DeptForm.deptType,
                        deptFunc: this.DeptForm.deptFunc,
                        status: this.DeptForm.status
                      }).then(resp => {
                        if (resp && resp.data.code === 200) {
                          this.dialogFormVisible = false;
                          this.loadDepts();
                        }
                      })
                    }
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
            this.depts = [{deptId:item.deptId,
              deptName:item.deptName,
              deptType:item.deptType,
              deptFunc:item.deptFunc,
              status:item.status
            }];
          },
        }
    }

</script>

<style scoped>

</style>
