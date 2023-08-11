<template>
    <el-container>
        <el-header>
            <div style="text-align: left">
                <span><el-tag size="medium" style="width: 250px;background-color: rgba(0,0,0,0.12);color: #2c3e50">{{this.$store.state.message}}</el-tag></span>
                <span style="float: right">
                  <el-dropdown> <!--下拉框-->
                    <el-button type="primary" style="height:40px; width:40px;" circle> <!--首先显示带有用户图标的按钮-->
                      <i class="el-icon-user-solid" circle style="margin-right: 15px"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown"> <!--鼠标悬停在按钮上方时显示下拉菜单-->
                      <el-dropdown-item @click.native="addRoutes">注销</el-dropdown-item><!--返回主界面-->
                    </el-dropdown-menu>
                  </el-dropdown>
                </span>
            </div>
        </el-header>
        <el-main>
    <el-tabs v-model="page" @tab-click="click" type="border-card" style="margin-top: 0">
        <el-tab-pane name="病历首页" label="病历首页"></el-tab-pane>
        <el-tab-pane name="检查申请" label="检查申请"></el-tab-pane>
        <el-tab-pane name="检验申请" label="检验申请"></el-tab-pane>
        <el-tab-pane name="门诊确诊" label="门诊确诊">
            <el-row style="text-align: center">
                <el-tag style="width: 70px">姓名:</el-tag>
                <el-input clearable v-model="nameInput" placeholder="请输入患者姓名" style="width: 300px;margin-left: 10px"></el-input>
                <el-button type="primary" icon="el-icon-search" style="margin-left: 50px" @click="search();searchResult = true">查询</el-button>
              <el-dialog title="查询结果" width="30%" :visible.sync="searchResult">
                <el-table :data="searchData" style="margin-left: 20px" highlight-current-row @current-change="handleCurrentChange">
                  <el-table-column prop="pId" label="病历号" width="150px"></el-table-column>
                  <el-table-column prop="pName" label="姓名" width="150px"></el-table-column>
                  <el-table-column prop="pAge" label="年龄" width="50px"></el-table-column>
                </el-table>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="searchResult=false">取消</el-button>
                  <el-button type="primary" @click="searchResult=false;confirmSearch()">确认</el-button>
                </div>
              </el-dialog>
            </el-row>
            <el-row style="text-align: center;margin-top: 10px">
                <el-tag style="width: 70px">病历号</el-tag>
                <el-input clearable v-model="idInput" placeholder="请输入病历号" style="width: 300px;margin-left: 10px"></el-input>
                <el-button type="primary" icon="el-icon-circle-close" style="margin-left: 50px" @click="cancel">取消</el-button>
            </el-row>
            <el-divider></el-divider>
            <el-card class="box-card" shadow="always">
                <el-row style="text-align: left">
                    <el-tag style="margin-left: auto;background-color: lightblue;color: white;margin-top: 10px">病史内容:</el-tag>
                </el-row>
                <el-row style="margin-left: 10px">
                    <el-tag style="width: 70px">主诉:</el-tag>
                    <el-input :disabled="true" v-model="complaint" placeholder="无" style="width: 500px;margin-left: 50px"></el-input>
                </el-row>
                <el-row style="margin-left: 10px;margin-top: 20px">
                    <el-tag style="width: 70px">现病史:</el-tag>
                    <el-input :disabled="true" v-model="curIll" placeholder="无" style="width: 500px;margin-left: 50px"></el-input>
                </el-row>
                <el-row style="margin-left: 10px;margin-top: 20px">
                    <el-tag style="width: 70px">治疗情况:</el-tag>
                    <el-input :disabled="true" v-model="curTreatment" placeholder="无" style="width: 500px;margin-left: 50px"></el-input>
                </el-row>
                <el-row style="margin-left: 10px;margin-top: 20px">
                    <el-tag style="width: 70px">既往史:</el-tag>
                    <el-input :disabled="true" v-model="pastIll" placeholder="无" style="width: 500px;margin-left: 50px"></el-input>
                </el-row>
                <el-row style="margin-left: 10px;margin-top: 20px">
                    <el-tag style="width: 70px">过敏史:</el-tag>
                    <el-input :disabled="true" v-model="allergy" placeholder="无" style="width: 500px;margin-left: 50px"></el-input>
                </el-row>
                <el-row style="margin-left: 10px;margin-top: 20px">
                    <el-tag style="width: 70px">体格检查:</el-tag>
                    <el-input :disabled="true" v-model="phyExam" placeholder="无" style="width: 500px;margin-left: 50px"></el-input>
                </el-row>
                <el-divider></el-divider>
                <el-row style="text-align: left">
                    <el-tag style="margin-left: auto;background-color: lightblue;color: white;margin-top: 15px">评估/诊断:</el-tag>
                </el-row>
                <el-card class="box-card" shadow="always">
                    <div  class="clearfix" style="text-align: left">
                        <span >西医诊断:</span>
                        <el-divider></el-divider>
                    </div>
                    <div >
                        <el-table
                                ref="multipleTable"
                                :data="confirmData"
                                tooltip-effect="dark"
                                style="width: 100%"
                                >
                            <el-table-column
                                    type="selection"
                                    width="30">
                            </el-table-column>
                            <el-table-column
                                    prop="icdCode"
                                    label="ICD编码"
                                    width="500">
                                <template slot-scope="scope">{{ scope.row.icdCode }}</template>
                            </el-table-column>
                            <el-table-column
                                    prop="illName"
                                    label="名称"
                                    width="500">
                            </el-table-column>
                            <el-table-column
                                    prop="time"
                                    label="发病时间"
                                    show-overflow-tooltip>
                            </el-table-column>
                        </el-table>
                    </div>
                    <el-divider></el-divider>
                    <div  class="clearfix" style="text-align: left">
                        <span >中医诊断:</span>
                        <el-divider></el-divider>
                    </div>
                    <div >
                        <el-table
                                ref="multipleTable"
                                :data="confirmChineseData"
                                tooltip-effect="dark"
                                style="width: 100%"
                                >
                            <el-table-column
                                    type="selection"
                                    width="30">
                            </el-table-column>
                          <el-table-column
                              prop="icdCode"
                              label="ICD编码"
                              width="500">
                            <template slot-scope="scope">{{ scope.row.icdCode }}</template>
                          </el-table-column>
                          <el-table-column
                              prop="illName"
                              label="名称"
                              width="500">
                          </el-table-column>
                          <el-table-column
                              prop="time"
                              label="发病时间"
                              show-overflow-tooltip>
                          </el-table-column>
                        </el-table>
                    </div>
                </el-card>
                <el-row style="margin-left: 10px;margin-top: 20px">
                    <el-tag style="width: 70px">检查建议:</el-tag>
                    <el-input :disabled="true" v-model="suggest" placeholder="无" style="width: 500px;margin-left: 50px"></el-input>
                </el-row>
                <el-row style="margin-left: 10px;margin-top: 20px">
                    <el-tag style="width: 70px">注意事项:</el-tag>
                    <el-input :disabled="true" v-model="attention" placeholder="无" style="width: 500px;margin-left: 50px"></el-input>
                </el-row>
            </el-card>
            <el-row style="text-align: center;margin-top: 20px">
                <el-tag style="width: 70px">诊断结果:</el-tag>
                <el-input type="textarea" :rows="1.7" :disabled="enableInput" clearable v-model="inputResult" placeholder="请输入诊断结果" style="width: 500px;margin-left: 20px"></el-input>
            </el-row>
            <el-button type="primary" style="margin-top: 20px" :disabled="enableInput"  @click="finish">诊毕</el-button>
        </el-tab-pane>
        <el-tab-pane name="处置申请" label="处置申请"></el-tab-pane>
        <el-tab-pane name="成药处方" label="成药处方"></el-tab-pane>
        <el-tab-pane name="草药处方" label="草药处方"></el-tab-pane>

    </el-tabs>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "confirm",
        data() {
            return{
                page: '门诊确诊',
                message: '请选择患者',
              currentRow:[],
              nameInput:'',
              idInput:'',
              complaint:'',
              curIll:'',
              curTreatment:'',
              pastIll:'',
              allergy:'',
              phyExam:'',
              suggest:'',
              attention:'',
              inputResult:'',
              searchResult:false,
              enableInput:false,
                confirmData: [{
                    icdCode: '',
                    illName: '',
                    time: '',
                    type:''
                }],
              confirmChineseData:[{
                icdCode: '',
                illName: '',
                time: '',
                type:''
              }],
              searchData:[{
                pName:'',
                pId:'',
                pAge:'',
                time:'',
                state:'',
                id:'',
              }],

            }
        },
        methods:{
          addRoutes () {
            this.$confirm('是否确认注销?', '提示', {
              cancelButtonText: '取消',
              confirmButtonText: '确定',
              type: 'warning'
            }).then(() => {
              this.$message({
                type: 'success',
                message: '注销成功!'
              });
              this.$router.push('/');
            });
          },
          search(){
            let _this = this;
            _this.searchData = [];
            if(_this.idInput.length>0){
              console.log(_this.idInput)
              axios.post("http://localhost:20910/getUserByID?id="+this.$store.state.docId+"&recordId="+_this.idInput).then(function (resp){
                _this.enableInput = false;
                console.log(resp.data);
                _this.searchData.push({
                  'pName': resp.data[0].name,
                  'pId': resp.data[0].recordId,
                  'pAge': resp.data[0].age,
                  'time':resp.data[0].booktime.substring(0,10)+' '+resp.data[0].booktime.substring(11,19),
                  'state': resp.data[0].state,
                  'id':resp.data[0].id,
                })
              })
            }
            else if(_this.nameInput.length>0){
              let i = 0;
              axios.post("http://localhost:20910/getUserByName1/"+this.$store.state.docId+"/"+_this.nameInput).then(function (resp){
                _this.enableInput = false;
                while(i<resp.data.length){
                  _this.searchData.push({
                    'pName': resp.data[i].name,
                    'pId': resp.data[i].recordId,
                    'pAge': resp.data[i].age,
                    'time':resp.data[0].booktime.substring(0,10)+' '+resp.data[0].booktime.substring(11,19),
                    'state': resp.data[0].state,
                    'id':resp.data[0].id,
                  })
                  i++;
                }
              })
            }
          },
          cancel(){
            this.$message({
              message:'cancel',
              type:'warning'
            });
            this.nameInput='';
            this.idInput='';
          },
          async finish(){
            let _this = this;
            await axios.post("http://localhost:20910/updateMedRecordResults?" +
                "&results="+_this.inputResult+
                "&id="+_this.currentRow.id
            ).then(function (resp){});
            await axios.post("http://localhost:20910/updatePatientState2?&id="+_this.currentRow.id).then(function (resp){})
            this.$message({
              message:'finish',
              type:'success'
            });
            this.$store.state.patientState='已就诊';
          },

      handleCurrentChange(val) {
        this.currentRow = val;
      },
          confirmSearch(){
            let _this = this;
            if(this.currentRow.state==='未看诊'){
              this.$message({
                message:'该病人仍处于未看诊状态',
                type:'warning',
              })
              this.enableInput=false;
            }
            else {
              axios.post("http://localhost:20910/getPatientDataByrecordId?id=" + _this.currentRow.id + "&recordId=" + _this.currentRow.pId + "&docId=" +
                  this.$store.state.docId).then(function (resp) {
                _this.complaint = resp.data[0].complaint;
                _this.curIll = resp.data[0].curIll;
                _this.curTreatment = resp.data[0].curTreatment;
                _this.pastIll = resp.data[0].pastIll;
                _this.allergy = resp.data[0].allergy;
                _this.phyExam = resp.data[0].phyExam;
                _this.suggest = resp.data[0].suggest;
                _this.attention = resp.data[0].attention;
              });
              axios.post("http://localhost:20910/getConfirmICDByRecordId?id=" + _this.currentRow.id + "&recordId=" + _this.currentRow.pId + "&docId=" +
                  this.$store.state.docId).then(function (resp) {
                _this.confirmData=[];
                _this.confirmChineseData=[];
                if (resp.data[0].type === 1) {
                  _this.confirmData = resp.data;
                  _this.confirmChineseData = null;
                } else if (resp.data[0].type === 0) {
                  _this.confirmData = null;
                  _this.confirmChineseData = resp.data;
                }
              })
              _this.nameInput = _this.currentRow.pName;
              this.$message({
                message: '选择患者成功',
                type: "success"
              });
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
      created:function() {
        let _this = this;
        if(this.$store.state.patientState==='未看诊'){
          this.$message({
            message:'该病人仍处于未看诊状态,自动跳转至病历首页',
            type:'info',
          })
          this.$router.push({path:'/Record'})
        }
        else {
          axios.post("http://localhost:20910/getPatientDataByrecordId?id=" + this.$store.state.id + "&recordId=" + _this.$store.state.recordPid + "&docId=" +
              this.$store.state.docId).then(function (resp) {
            _this.complaint = resp.data[0].complaint;
            _this.curIll = resp.data[0].curIll;
            _this.curTreatment = resp.data[0].curTreatment;
            _this.pastIll = resp.data[0].pastIll;
            _this.allergy = resp.data[0].allergy;
            _this.phyExam = resp.data[0].phyExam;
            _this.suggest = resp.data[0].suggest;
            _this.attention = resp.data[0].attention;
          });
          axios.post("http://localhost:20910/getConfirmICDByRecordId?id="+this.$store.state.id+ "&recordId=" + _this.$store.state.recordPid + "&docId=" +
              this.$store.state.docId).then(function (resp) {
            _this.confirmData=[];
            _this.confirmChineseData=[];
            if (resp.data[0].type === 1){
              _this.confirmData = resp.data;
              _this.confirmChineseData = null;
            } else if (resp.data[0].type === 0) {
              _this.confirmData = null;
              _this.confirmChineseData = resp.data;
            }
          })
          if (this.$store.state.patientState === '已就诊') {
            this.enableInput = true;
            axios.post("http://localhost:20910/getResultByRegisterId?id=" + this.$store.state.id).then(function (resp) {
              _this.inputResult = resp.data;
            })
            this.$message({
              message:'只能查看已就诊患者信息',
              type:'warning',
            })
          }
          else {
            console.log(this.$store.state.id);
            this.currentRow.id = this.$store.state.id;
            console.log(this.currentRow);
            this.enableInput = false;
            this.$message({
              message:'请补充就诊中患者检查结果并提交确诊',
              type:'info',
            })
          }
        }
      }
    }
</script>

<style scoped>

</style>
