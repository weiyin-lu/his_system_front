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
                v-model="illname"
                :fetch-suggestions="illSearch"
                placeholder="请输入疾病名称"
                @select="illSelect"
                @keyup.native="$event.target.value = $event.target.value.replace(/\s+/g,'')"
        ></el-autocomplete>
      </el-col>
      <el-col :span="4" :offset="4" style="margin-top: 8px;">
        <el-button type="primary" icon="el-icon-search" @click="illQuery">查询诊断目录</el-button>
      </el-col>
      <el-col :span="4" style="margin-top: 8px;">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="illAdd">新增疾病</el-button>
      </el-col>
    </el-row>
    <el-dialog title="新增/修改" :visible.sync="dialogFormVisible" @close="clear">
      <el-form :model="IllForm" label-position="left" label-width="20%">
        <el-form-item prop="ill_id" label="疾病编码">
          <el-input v-model="IllForm.illId" clearable
                    @keyup.native="$event.target.value = $event.target.value.replace(/\s+/g,'')"></el-input>
        </el-form-item>
        <el-form-item prop="ill_name" label="疾病名称">
          <el-input v-model="IllForm.illName" clearable
                    @keyup.native="$event.target.value = $event.target.value.replace(/\s+/g,'')"></el-input>
        </el-form-item>
        <el-form-item prop="ICD_code" label="ICD编码">
          <el-input v-model="IllForm.icdcode" clearable :disabled="addFlag"
                    @keyup.native="$event.target.value = $event.target.value.replace(/\s+/g,'')"></el-input>
        </el-form-item>
        <el-form-item prop="ill_type" label="疾病类型">
          <el-input v-model="IllForm.illType" clearable
                    @keyup.native="$event.target.value = $event.target.value.replace(/\s+/g,'')"></el-input>
        </el-form-item>
        <el-form-item prop="ill_type" label="疾病种类">
          <el-select v-model="IllForm.illKind" placeholder="疾病种类" style="width: 100%">
            <el-option label="中医" :value="0"></el-option>
            <el-option label="西医" :value="1"></el-option>
          </el-select>
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
        :data="ills"
        style="width: 100%">
        <el-table-column
          type="index">
        </el-table-column>
        <el-table-column
          prop="illId"
          label="疾病编码">
        </el-table-column>
        <el-table-column
          prop="illName"
          label="疾病名称">
        </el-table-column>
        <el-table-column
          prop="icdcode"
          label="ICD编码">
        </el-table-column>
        <el-table-column
          prop="illType"
          label="疾病类型">
        </el-table-column>
        <el-table-column
          prop="illKind"
          label="疾病种类">
          <template slot-scope="scope">
            <span v-if="scope.row.illKind === 0">中医</span>
            <span v-if="scope.row.illKind === 1">西医</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
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
                    @click="illEdit(scope.row)">编辑</el-button>
            <el-button
                    v-if="scope.row.status===1"
                    size="mini"
                    type="danger"
                    @click="illDelete(scope.row)">删除</el-button>
            <el-button
                    v-if="scope.row.status===0"
                    size="mini"
                    type="success"
                    @click="addIll(scope.row)">激活</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </el-main>
</template>

<script>
    export default {
        name: "IllnessManage",
        data(){
            return{
              /*当前用户*/
                user:'',
                returnimg: require('../assets/返回.png'),
                quitimg: require('../assets/+退出.png'),
                dialogFormVisible: false,
              /*查询使用的疾病名称*/
                illname:'',
              /*显示的疾病*/
                ills:[],
              /*全部疾病*/
              illAll:[],
              /*新增标志*/
              addFlag:true,
                IllForm:{
                    illId:'',
                    illName:'',
                    icdcode:'',
                    illType:'',
                    status:'',
                    illKind:''
                }
            }
        },
        mounted(){
            this.loadill();
        },
        methods:{
          /*加载疾病信息*/
            loadill(){
                axios.get('http://localhost:20910/api/admin/ills').then(resp => {
                    if (resp && resp.data.code === 200) {
                        this.ills = resp.data.result;
                      this.illAll = resp.data.result;
                    }
                })
                this.user = JSON.parse(sessionStorage.getItem('user'));
            },
          /*清除表格数据*/
            clear(){
                this.IllForm = {
                    illId:'',
                    illName:'',
                    icdcode:'',
                    illType:'',
                    status:'',
                    illKind:''
                }
                this.addFlag = true;
            },
          /*疾病新增*/
            illAdd(){
                this.dialogFormVisible = false;
                this.addFlag = true;
                this.IllForm.status = '1';
            },
          /*疾病激活*/
          addIll(item){
            axios.post('http://localhost:20910/api/admin/ills', {
              illId:item.illId,
              illName:item.illName,
              icdcode:item.icdcode,
              illType:item.illType,
              status:'1',
              illKind:item.illKind
            }).then(resp => {
              if (resp && resp.data.code === 200) {
                this.$message({
                  type: 'success',
                  message: '激活成功!'
                });
              } else {
                this.$message({
                  type: 'error',
                  message: "激活失败，"
                });
              }
              this.loadill();
            })
          },
          /*疾病查询*/
            illQuery(){
                axios.get('http://localhost:20910/api/admin/ills/'+this.illname).then(resp => {
                    if (resp && resp.data.code === 200) {
                        this.ills = resp.data.result;
                    }
                })
            },
          /*疾病信息编辑窗口打开*/
            illEdit(item){
                this.IllForm = {
                    illId:item.illId,
                    illName:item.illName,
                    icdcode:item.icdcode,
                    illType:item.illType,
                    status:item.status,
                    illKind:item.illKind
                }
                this.dialogFormVisible = true;
            },
          /*疾病删除*/
            illDelete(item){
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() =>{
                    axios.post('http://localhost:20910/api/admin/ills/delete', {
                        illId:item.illId,
                        illName:item.illName,
                        icdcode:item.icdcode,
                        illType:item.illType,
                        status:item.status,
                        illKind:item.illKind
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
                        this.loadill();
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
          /*提交修改信息*/
            onSubmit(){
              if(this.IllForm.illId.length<1||this.IllForm.illId===" "||
                      this.IllForm.illName.length<1||this.IllForm.illName===" "||
                      this.IllForm.icdcode.length<1||this.IllForm.icdcode===" "||
                      this.IllForm.illType.length<1||this.IllForm.illType===" "||
                      this.IllForm.illKind.length<1||this.IllForm.illKind===" "){
                this.$message({
                  type: 'error',
                  message: '请完整输入信息！'
                });
              }else{
                axios.post('http://localhost:20910/api/admin/ills', {
                    illId:this.IllForm.illId,
                    illName:this.IllForm.illName,
                    icdcode:this.IllForm.icdcode,
                    illType:this.IllForm.illType,
                    status:this.IllForm.status,
                    illKind:this.IllForm.illKind
                }).then(resp => {
                    if (resp && resp.data.code === 200) {
                        this.dialogFormVisible = false;
                        this.loadill();
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
          /*提示疾病名称*/
          illSearch(queryString, cb) {
            let ill = this.illAll;
            ill = ill.map(item=>{
              item.value = item.illName;
              return item;
            });
            let results = queryString ? ill.filter(this.createFilter(queryString)) : ill;
            // 调用 callback 返回建议列表的数据
            cb(results);
          },
          /*根据输入信息对疾病信息进行筛选*/
          createFilter(queryString) {
            return (ill) => {
              return (ill.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
          },
          /*选中某疾病信息后处理*/
          illSelect(item) {
            this.ills = [{illId:item.illId,
              illName:item.illName,
              icdcode:item.icdcode,
              illType:item.illType,
              status:item.status,
              illKind:item.illKind
            }];
          },
        }
    }
</script>

<style scoped>

</style>
