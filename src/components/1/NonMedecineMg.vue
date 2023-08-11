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
                v-model="name"
                :fetch-suggestions="prjSearch"
                placeholder="请输入项目名称"
                @select="prjSelect"
                style="width: 150px"
                @keyup.native="$event.target.value = $event.target.value.replace(/\s+/g,'')"
        ></el-autocomplete>
      </el-col>
      <el-col :span="4" :offset="4" style="margin-top: 8px;">
        <el-button type="primary" icon="el-icon-search" @click="prjQuery">查询项目</el-button>
      </el-col>
      <el-col :span="4" style="margin-top: 8px;">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="prjAdd">新增项目</el-button>
      </el-col>
    </el-row>
    <el-dialog title="新增/修改" :visible.sync="dialogFormVisible" @close="clear">
      <el-form :model="PrjForm" label-position="left" label-width="100px">
        <el-form-item prop="code" label="项目编码">
          <el-input v-model="PrjForm.code" style="width: 300px" clearable
                    @keyup.native="$event.target.value = $event.target.value.replace(/\s+/g,'')"></el-input>
        </el-form-item>
        <el-form-item prop="name" label="项目名称">
          <el-input v-model="PrjForm.name" style="width: 300px" clearable
                    @keyup.native="$event.target.value = $event.target.value.replace(/\s+/g,'')"></el-input>
        </el-form-item>
        <el-form-item prop="price" label="价格">
          <label slot="label">价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格</label>
          <el-input v-model="PrjForm.price" style="width: 300px" type="number"></el-input>
        </el-form-item>
        <el-form-item prop="standard" label="标准">
          <label slot="label">标&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;准</label>
          <el-input v-model="PrjForm.standard" style="width: 300px" clearable
                    @keyup.native="$event.target.value = $event.target.value.replace(/\s+/g,'')"></el-input>
        </el-form-item>
        <el-form-item prop="" label="选择科室">
          <el-autocomplete
                  clearable
                  class="inline-input"
                  v-model="namedept"
                  :fetch-suggestions="deptSearch"
                  placeholder="请输入科室名称"
                  @select="deptSelect"
                  style="width: 160px"
                  @keyup.native="$event.target.value = $event.target.value.replace(/\s+/g,'')"
          ></el-autocomplete>
          <el-button type="primary" icon="el-icon-search" @click="deptQuery" style="width: 135px;margin-left: 5px;">查询科室</el-button>
        </el-form-item>
        <el-form-item label="科室名称">
          <el-input v-model="PrjForm.deptName" :disabled="true" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item prop="type" label="种类">
          <label slot="label">种&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;类</label>
          <el-select v-model="PrjForm.type" placeholder="项目种类" style="width: 300px">
            <el-option label="检查" :value="0"></el-option>
            <el-option label="检验" :value="1"></el-option>
            <el-option label="处置" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="" label="收费项目">
          <el-autocomplete
              clearable
              class="inline-input"
              v-model="namesub"
              :fetch-suggestions="subSearch"
              placeholder="请输入收费项目名称"
              @select="subSelect"
              style="width: 148px"
              @keyup.native="$event.target.value = $event.target.value.replace(/\s+/g,'')"
          ></el-autocomplete>
          <el-input v-model="PrjForm.subject" :disabled="true" style="width: 148px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clear">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <el-row style="border-width: 1px;border-style: solid; border-color: #eaeaea">
      <el-table
        highlight-current-row
        height="550"
        :data="prjs"
        style="width: 100%">
        <el-table-column
          type="index">
        </el-table-column>
        <el-table-column
          prop="code"
          label="项目编码">
        </el-table-column>
        <el-table-column
          prop="name"
          label="项目名称">
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格">
        </el-table-column>
        <el-table-column
          prop="standard"
          label="标准">
        </el-table-column>
        <el-table-column
          prop="deptName"
          label="部门">
        </el-table-column>
        <el-table-column
          prop="type"
          label="种类">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 0">检查</span>
            <span v-if="scope.row.type === 1">检验</span>
            <span v-if="scope.row.type === 2">处置</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="subject"
          label="收费项目">
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
                    @click="prjEdit(scope.row)">编辑</el-button>
            <el-button
                    v-if="scope.row.status===1"
                    size="mini"
                    type="danger"
                    @click="prjDelete(scope.row)">删除</el-button>
            <el-button
                    v-if="scope.row.status===0"
                    size="mini"
                    type="success"
                    @click="addPrj(scope.row)">激活</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </el-main>
</template>

<script>
    export default {
        name: "NonMedecineMg",
        data(){
            return{
              /*当前用户*/
                user:'',
                returnimg: require('../assets/返回.png'),
                quitimg: require('../assets/+退出.png'),
                addFlag:'',
                dialogFormVisible: false,
              /*搜索使用的项目名称*/
                name:'',
              /*搜索部门使用的名称*/
                namedept:'',
              /*搜索部门的结果*/
                dept:[],
              /*全部部门*/
                deptAll:[],
              /*搜索后的项目*/
                prjs:[],
              /*全部项目*/
                prjAll:[],
              /*搜索费用使用的名称*/
              namesub:'',
              /*搜索费用的结果*/
              subject:[],
              /*全部收费项目*/
                subAll:[],
                PrjForm:{
                    id:'',
                    code:'',
                    name:'',
                    price:'',
                    standard:'',
                    deptId:'',
                    deptName:'',
                    subject:'',
                    type:'',
                    status:''
                }
            }
        },
        mounted(){
            this.prjLoad();
        },
        methods:{
          /*清空表格数据*/
            clear(){
                this.dept=[];
                this.namedept='';
                this.addFlag = '';
                this.PrjForm = {
                    id:'',
                    code:'',
                    name:'',
                    price:'',
                    standard:'',
                    deptId:'',
                    deptName:'',
                    subject:'',
                    type:'',
                    status:''
                }
                this.dialogFormVisible = false;
            },
          /*获取项目/部门数据*/
            prjLoad(){
                axios.get('http://localhost:20910/api/admin/nondrugs').then(resp => {
                    if (resp && resp.data.code === 200) {
                        this.prjs = resp.data.result;
                        this.prjAll = resp.data.result;
                    }
                })
                this.user = JSON.parse(sessionStorage.getItem('user'));
              axios.get('http://localhost:20910/api/admin/depts').then(resp => {
                if (resp && resp.data.code === 200) {
                  this.deptall = resp.data.result;
                }
              });
              axios.get("http://localhost:20910/fee/findAll").then(resp => {
                  this.subAll = resp.data;
              });
            },
          /*新增项目*/
            prjAdd(){
                this.dialogFormVisible = true;
                this.PrjForm.id = (Math.max.apply(null,this.prjAll.map(item=>{return item.id}))+1);
              if(this.PrjForm.id<0){
                this.PrjForm.id = '1';
              }
                this.PrjForm.status = '1';
                this.addFlag = '/add';
            },
          /*激活已删除项目*/
          addPrj(item){
            console.log()
            axios.post('http://localhost:20910/api/admin/nondrugs'+this.addFlag, {
              id:item.id,
              code:item.code,
              name:item.name,
              price:item.price,
              standard:item.standard,
              deptId:item.deptId,
              deptName:item.deptName,
              subject:item.subject,
              type:item.type,
              status:'1'
            }).then(resp => {
              if (resp && resp.data.code === 200) {
                this.dialogFormVisible = false;
                this.$message({
                  type: 'success',
                  message: '激活成功!'
                });
              }else {
                this.$message({
                  type: 'error',
                  message:"激活失败，"
                });
              }
              this.prjLoad();
            })
          },
          /*项目查询*/
          prjQuery(){
            axios.get('http://localhost:20910/api/admin/nondrugs/'+this.name).then(resp => {
              if (resp && resp.data.code === 200) {
                this.prjs = resp.data.result;
              }
            })
          },
          /*编辑项目信息*/
            prjEdit(item){
                this.PrjForm = {
                    id:item.id,
                    code:item.code,
                    name:item.name,
                    price:item.price,
                    standard:item.standard,
                    deptId:item.deptId,
                    deptName:item.deptName,
                    subject:item.subject,
                    type:item.type,
                    status:item.status
                }
                this.dialogFormVisible = true;
            },
          /*删除项目*/
            prjDelete(item){
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() =>{
                    axios.post('http://localhost:20910/api/admin/nondrugs/delete', {
                        id:item.id,
                        code:item.code,
                        name:item.name,
                        price:item.price,
                        standard:item.standard,
                        deptId:item.deptId,
                        deptName:item.deptName,
                        subject:item.subject,
                        type:item.type,
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
                        this.prjLoad();
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
          /*部门查询*/
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
                            this.PrjForm.deptId = this.dept[0].deptId;
                            this.PrjForm.deptName = this.dept[0].deptName;
                        }
                    }
                });
            },
          /*收费项目查询*/
          subQuery(){},
            /*提交修改信息*/
            onSubmit(){
              if(this.PrjForm.code.length<1||this.PrjForm.code===" "||
                      this.PrjForm.name.length<1||this.PrjForm.name===" "||
                      this.PrjForm.standard.length<1||this.PrjForm.standard===" "||
                      this.PrjForm.price.length<1||this.PrjForm.deptId<1||
                      this.PrjForm.subject.length<1||this.PrjForm.subject===" "||
                      this.PrjForm.type.length<1){
                this.$message({
                  type: 'error',
                  message: '请完整输入信息!'
                });
              }else {
                axios.post('http://localhost:20910/api/admin/nondrugs' + this.addFlag, {
                  id: this.PrjForm.id,
                  code: this.PrjForm.code,
                  name: this.PrjForm.name,
                  price: this.PrjForm.price,
                  standard: this.PrjForm.standard,
                  deptId: this.PrjForm.deptId,
                  deptName: this.PrjForm.deptName,
                  subject: this.PrjForm.subject,
                  type: this.PrjForm.type,
                  status: this.PrjForm.status
                }).then(resp => {
                  if (resp && resp.data.code === 200) {
                    this.dialogFormVisible = false;
                    this.prjLoad();
                    if (this.addFlag === '') {
                      this.$message({
                        type: 'success',
                        message: '修改成功!'
                      });
                    } else {
                      this.$message({
                        type: 'success',
                        message: '新增成功!'
                      });
                    }
                    this.addFlag = '';
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
            this.PrjForm.deptName = item.deptName;
            this.PrjForm.deptId = item.deptId;
          },
          /*提示项目名称*/
          prjSearch(queryString, cb) {
            let prj = this.prjAll;
            prj = prj.map(item=>{
              item.value = item.name;
              return item;
            });
            let results = queryString ? prj.filter(this.createFilter(queryString)) : prj;
            // 调用 callback 返回建议列表的数据
            cb(results);
          },
          /*选中某项目信息后处理*/
          prjSelect(item) {
            this.prjs = [{
              id:item.id,
              code:item.code,
              name:item.name,
              price:item.price,
              standard:item.standard,
              deptId:item.deptId,
              deptName:item.deptName,
              subject:item.subject,
              type:item.type,
              status:item.status
            }]
          },
          /*提示费目名称*/
          subSearch(queryString, cb) {
            let sub = this.subAll;
            sub = sub.map(item=>{
              item.value = item.subject;
              return item;
            });
            let results = queryString ? sub.filter(this.createFilter(queryString)) : sub;
            // 调用 callback 返回建议列表的数据
            cb(results);
          },
          /*选中某费目信息后处理*/
          subSelect(item) {
            this.PrjForm.subject = item.subject;
          },
        }
    }
</script>

<style scoped>

</style>
