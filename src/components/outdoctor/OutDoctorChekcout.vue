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
    <el-tabs v-model="page" @tab-click="click" type="border-card" >
        <el-tab-pane name="病历首页" label="病历首页"></el-tab-pane>
        <el-tab-pane name="检查申请" label="检查申请">
            <el-tag style="text-align: center;background-color: #409EFF;width: 100%;height: auto">
              <el-button  type="primary" icon="el-icon-circle-plus"  @click="addProject()">新增项目</el-button>
              <el-dialog title="新增项目" :visible.sync="addVisible">
                <el-row style="text-align: center">
                  <el-tag style="width: 70px">项目名称</el-tag>
                  <el-autocomplete
                      ref="completeID"
                      clearable
                      class="inline-input"
                      v-model.trim="inputProjectName"
                      :fetch-suggestions="querySearch"
                      placeholder="请输入项目名称"
                      :trigger-on-focus="false"
                      @select="handleSelect"
                      style="width: 300px;margin-left: 20px">
                  </el-autocomplete>
                  <!--<el-input clearable v-model="inputProjectName" placeholder="请输入项目名称" style="width: 300px;margin-left: 20px"></el-input>-->

                  <el-button type="primary" @click="queryProject()" icon="el-icon-search" style="margin-left: 10px"></el-button>
                  <el-table :data="projectData" style="width: auto" @selection-change="handleProjectDataSelection">
                    <el-table-column type="selection" width="50px"></el-table-column>
                    <el-table-column prop="projectAddName" label="项目名称" style="width: 500px;margin-left: 200px">
                      <template slot-scope="scope">{{scope.row.projectAddName}}</template>
                    </el-table-column>
                    <el-table-column prop="projectPrice" label="单价" width="100px"></el-table-column>
                  </el-table>
                </el-row>
                <el-row STYLE="margin-right: 65px">
                  <el-tag style="width: 70px;margin-top: 20px">检查目的:</el-tag>
                  <el-input clearable v-model="aim" placeholder="请输入检查目的" style="width: 300px;margin-left: 20px"></el-input>
                </el-row>
                <el-row STYLE="margin-right: 65px">
                  <el-tag style="width: 70px;margin-top: 20px">检查部位</el-tag>
                  <el-input clearable v-model="body" placeholder="请输入检查部位" style="width: 300px;margin-left: 20px"></el-input>
                </el-row>

                <el-row>
                  <el-switch v-model="value1" active-text="加急" inactive-text="不加急" style="margin-top: 50px" ></el-switch>
                </el-row>

                <div slot="footer" class="dialog-footer">
                  <el-button @click="addVisible = false">取 消</el-button>
                  <el-button type="primary" @click="addVisible = false;executeAddProject()">确 定</el-button>
                </div>
              </el-dialog>
              <el-button  type="primary" icon="el-icon-delete" style="margin-left: 20px" @click="deleteProject()">删除项目</el-button>
              <el-dialog title="确认删除所选项目？" :visible="deleteVisible" width="30%">
                <el-button @click="deleteVisible=false">取消</el-button>
                <el-button type="primary" @click="deleteVisible=false;confirmDelete()">确定</el-button>
              </el-dialog>
              <el-button  type="primary" icon="el-icon-circle-check" style="margin-left: 20px" @click="executeProject()">开立项目</el-button>
              <el-dialog title="确认开立？" :visible="executeVisible" width="30%">
                <el-button @click="executeVisible=false">取消</el-button>
                <el-button type="primary" @click="executeVisible=false;confirmExecute()">确认</el-button>
              </el-dialog>
              <el-button  type="primary" icon="el-icon-error" style="margin-left: 20px" @click="cancelProject()">作废项目</el-button>
              <el-dialog title="确认作废该项目？" :visible="cancelVisible" width="30%">
                <el-button @click="cancelVisible=false">取消</el-button>
                <el-button type="primary" @click="cancelVisible=false;confirmCancel()">确认</el-button>
              </el-dialog>
              <el-button  type="primary" icon="el-icon-document-copy" style="margin-left: 20px" @click="saveTemplate()">存为组套</el-button>
              <el-dialog title="确认存为组套？" :visible.sync="saveVisible" width="30%">
                <el-row style="text-align: center">
                  <el-tag style="width: 70px;margin-top: 20px">组套名称:</el-tag>
                  <el-input clearable v-model="templateName" placeholder="请输入组套名称" style="width: 200px;margin-left: 20px"></el-input>
                </el-row>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="saveVisible=false">取消</el-button>
                  <el-button type="primary" @click="saveVisible=false;confirmSave()">确认</el-button>
                </div>

              </el-dialog>
              <el-button  type="primary" icon="el-icon-refresh-right" style="margin-left: 20px" @click="refresh">刷新</el-button>
            </el-tag>
            <p style="text-align: left">
                <el-tag style="width: 14%; height:30px; margin-right:15px">
                    本项目合计金额:
                </el-tag>
                <el-tag  type="warning" style="width: 10%; height:30px">
                    {{money}}元
                </el-tag>
                <el-button type="primary" @click="checktable = true" style="float: right">常用模板</el-button>
                <el-drawer
                        title="常用模板"
                        :visible.sync="checktable"
                        direction="rtl"
                        size="30%">
                    <el-table :data="temCheckdata" highlight-current-row>
                        <el-table-column property="name" label="名称" width="250"></el-table-column>
                        <el-table-column label="操作" width="100">
                            <template slot-scope="scope">

                              <el-button @click="transUse(scope.row)" type="text">使用</el-button>
                              <el-dialog title="确认使用" :visible.sync="useConfirmVisible" append-to-body style="text-align: center">
                                <el-row >
                                  <el-tag style="width: 70px;margin-top: 40px">检查目的:</el-tag>
                                  <el-input clearable v-model="aim" placeholder="请输入检查目的" style="width: 300px;margin-left: 20px"></el-input>
                                </el-row>
                                <el-row>
                                  <el-tag style="width: 70px;margin-top: 20px">检查部位</el-tag>
                                  <el-input clearable v-model="body" placeholder="请输入检查部位" style="width: 300px;margin-left: 20px"></el-input>
                                </el-row>

                                <el-row>
                                  <el-switch v-model="value1" active-text="加急" inactive-text="不加急" style="margin-top: 50px" ></el-switch>
                                </el-row>

                                <div slot="footer" class="dialog-footer">
                                  <el-button @click="useConfirmVisible = false">取 消</el-button>
                                  <el-button type="primary" @click="useConfirmVisible = false;useTemplate();checktable=false">确 定</el-button>
                                </div>
                              </el-dialog>

                                <el-popover
                                        placement="right"
                                        trigger="click">
                                    <el-table :data="detailData">
                                        <el-table-column property="medName" label="项目名称"></el-table-column>
                                        <el-table-column property="price" label="单价"></el-table-column>
                                    </el-table>
                                    <el-button slot="reference" type="text" @click="detailDataset(scope.row)" style="margin-left: 5px">详细</el-button>
                                </el-popover>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-drawer>
                <el-table
                        ref="multipleTable"
                        :data="checkData"
                        @selection-change="handleSelectionChange"
                        width="700"
                        highlight-current-row
                >
                  <el-table-column type="selection" width="50px"></el-table-column>
                    <el-table-column
                            prop="nondrugname"
                            label="项目名称"
                            width="300">
                      <template slot-scope="scope">{{scope.row.nondrugname}}</template>
                    </el-table-column>
                    <el-table-column
                            prop="deptName"
                            label="执行科室"
                            width="200">
                    </el-table-column>
                    <el-table-column
                            prop="status"
                            label="执行状态"
                            width="200">
                    </el-table-column>
                    <el-table-column
                            prop="price"
                            label="单价"
                            sortable
                            width="100">
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            label="检查结果"
                            width="100">
                        <template slot-scope="scope">
                            <el-popover
                                    placement="right"
                                    width="400"
                                    trigger="click">
                                <el-table :data="checkResultdata">
                                    <el-table-column width="150" property="checkResult" label="检查结果"></el-table-column>
                                    <el-table-column width="100" property="checkDname" label="执行医生"></el-table-column>
                                </el-table>
                                <el-button slot="reference" type="text" @click="lookCheckResult(scope.row)">查看详细</el-button>
                            </el-popover>
                        </template>
                    </el-table-column>
                </el-table>
            </p>
        </el-tab-pane>
        <el-tab-pane name="检验申请" label="检验申请"></el-tab-pane>
        <el-tab-pane name="门诊确诊" label="门诊确诊"></el-tab-pane>
        <el-tab-pane name="处置申请" label="处置申请"></el-tab-pane>
        <el-tab-pane name="成药处方" label="成药处方"></el-tab-pane>
        <el-tab-pane name="草药处方" label="草药处方"></el-tab-pane>
    </el-tabs>
        </el-main>
    </el-container>
</template>

<script>
    export default {
      inject:['reload'],
        name: "Check",
        data(){
            return{
                page:'检查申请',
                message: '请选择患者',
                money:0,
                checktable:false,
                addVisible:false,
                deleteVisible:false,
                executeVisible:false,
                cancelVisible:false,
                saveVisible:false,
              useConfirmVisible:false,
              value1:false,
                inputProjectName:'',
              templateName:'',
              restaurants:[],
              aim:'',
              body:'',
              _row:'',
                //新增项目显示信息
                projectData:[{
                  projectAddName:'',
                  projectPrice:'',
                }],
                projectDataSelection:[],
              //病人检查项目信息
                checkData: [{
                    nondrugname: '',
                    deptName: '',
                    status: '',
                    price: 0,
                    aim:'',
                    body:'',
                    hurry:0,
                }],
                checkDataSelection: [],
              //查看详细结果
                checkResultdata: [{
                    checkResult: '',
                    checkDname: ''
                }],
              //模板详细信息
                detailData: [{
                    medName: '',
                    price: ''
                }],
                temCheckdata: [{
                    name: ''
                },],
            }
        },

      created:async function (){

          let _this = this;
          _this.projectData = [];
          _this.checkData = [];
          _this.temCheckdata = [];
          _this.checkResultdata = [];
          _this.detailData = [];
          if(this.$store.state.recordPid.length!==0){
            await axios.get('http://localhost:20910/getCheckProject/'+this.$store.state.recordPid+'/'+this.$store.state.time+'/'+this.$store.state.docId).then(function (resp){
                  _this.checkData = resp.data;
                }
            );
          }
          axios.get('http://localhost:20910/getTemplate').then(function (resp){
            for(let item of resp.data){
              _this.temCheckdata.push({
                'name': item,
              })
            }
          });
          let i = 0;
          while(i<this.checkData.length) {
            this.money += parseFloat(this.checkData[i].price);
            i++
          }
          axios.get('http://localhost:20910/getAllCheckProject').then(function (resp){
            _this.restaurants = resp.data;
          });

        },

        watch: {
          'checkDataSelection': function (){
            let p = 0;
            for( let item of this.checkDataSelection ){
              let m = 0;
              let r1 = 0;
              let r2 = 0;
              let n = 0;
              try{r1=(item.price+'').split('.')[1].length}catch(e){ r1=0 }
              try{r2=p.toString().split('.')[1].length}catch(e){r2=0}
              n = (r1>=r2)? r1:r2;
              m = Math.pow(10,Math.max(r1,r2));
              p = (item.price*m+p*m)/m.toFixed(n);
            }
            this.money = p;
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
          addProject(){
            if(this.$store.state.patientState==='已就诊'){
              this.$message({
                message: '只能查看已就诊患者信息',
                type: 'error'
              });
              this.addVisible = false;
            }
            else {
              this.$message({
                message: 'addProject',
                type: 'success'
              });
              this.inputProjectName='';
              this.projectData = [];
              this.aim = '';
              this.body = '';
              this.value1 = false;
              this.addVisible = true;
            }
          },
          //实现输入建议函数**********************************************************************************
          querySearch(queryString, cb) {
            this.$refs.completeID.activated=true
            let restaurants = this.restaurants;
            let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
          },
          createFilter(queryString) {
            return (restaurant) => {
              return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) !==-1);
            };
          },

          handleSelect(item) {
            let flag = false;
            let i = 0;
            while(this.projectData!=null&&i<this.projectData.length){
              if(this.projectData[i].projectAddName===item.value){
                flag=true;
              }
              i++;
            }
            if(this.projectData==null||this.projectData.length===0||!flag){
              this.projectData.push({
                'projectAddName':item.value,
                'projectPrice':item.price,
                'deptName':item.deptName,
              })
            }
          },

          queryProject(){
            this.$message({
              message:'查询成功',
              type:'success',
            });
          },
          executeAddProject(){
            let h = 0;
            if(this.value1 === true){
              h=1
            }
            if(this.projectDataSelection.length!==0){
              let i= 0 ;

              while(i<this.projectDataSelection.length){
                let flag = false;
                for(let item of this.checkData){
                  if(item.nondrugname===this.projectDataSelection[i].projectAddName){
                    flag = true;
                    break;
                  }
                }
                if(flag===false){
                  this.checkData.push({
                    "index":this.checkData.length,
                    'nondrugname': this.projectDataSelection[i].projectAddName,
                    'deptName': this.projectDataSelection[i].deptName,
                    'status': '暂存',
                    'price': this.projectDataSelection[i].projectPrice,
                    'aim': this.aim,
                    'body': this.body,
                    'hurry': h,
                  });
                }
                i++;
              }

              this.$message({
                message:'添加成功',
                type:'success'
              });
            }
            else{
              this.$message({
                message:'添加失败',
                type:'error'
              });
            }
          },
          deleteProject(){
            if(this.$store.state.patientState==='已就诊'){
              this.$message({
                message: '只能查看已就诊患者信息',
                type: 'error'
              });
              this.deleteVisible=false;
            }
            else {
              if(this.checkDataSelection===null||this.checkDataSelection.length===0){
                this.$message({
                  message: '未选中任何项目',
                  type: 'error'
                });
                this.deleteVisible=false;
              }
              else {
                this.$message({
                  message: 'deleteProject',
                  type: 'warning'
                });
                this.deleteVisible = true;
              }
            }
          },
          confirmDelete(){
            //let _this = this;
            let val = this.checkDataSelection;
            if(val ){
              val.forEach((val)=>{
                this.checkData.forEach((v,i)=>{
                  if(val.nondrugname === v.nondrugname && val.status==='暂存'){
                    this.checkData.splice(i,1);
                  }
                })
              })
              this.$refs.multipleTable.clearSelection();
              this.$message({
                message:'删除成功',
                type:'success'
              });
            }
            else{
              this.$message({
                message:'删除失败',
                type:'error'
              });
            }

          },
          executeProject(){
            if(this.$store.state.patientState==='已就诊'){
              this.$message({
                message: '只能查看已就诊患者信息',
                type: 'error'
              });
              this.executeVisible = false;
            }
            else {
              if(this.checkDataSelection===null||this.checkDataSelection.length===0){
                this.$message({
                  message: '未选中任何项目',
                  type: 'error'
                });
                this.executeVisible=false;
              }
              else {
                this.$message({
                  message: 'executeProject',
                  type: 'success'
                });
                this.executeVisible = true
              }
            }
          },
          async confirmExecute(){
            let _this = this;
            let date = new Date();
            let year = date.getFullYear(); // 年
            let month = date.getMonth() + 1; // 月
            let day = date.getDate(); // 日
            let hour = date.getHours();//小时
            let min = date.getMinutes();//分钟
            let sec = date.getSeconds();//秒
            let now =`${year}-${month}-${day} ${hour}:${min}:${sec}`;
            let i = 0;
            let j = 0;
            while(i<_this.checkDataSelection.length){
              if(_this.checkDataSelection[i].status === '暂存'){
                j++;
                await axios.post("http://localhost:20910/insertConsume?" +
                    "&recordId="+_this.$store.state.recordPid+
                    "&costName="+_this.checkDataSelection[i].nondrugname+
                    "&price="+_this.checkDataSelection[i].price+
                    "&deptId="+_this.checkDataSelection[i].deptName+
                    "&docId1="+_this.$store.state.docId+
                    "&docId2="+_this.$store.state.docId+             //执行医生的ID
                    "&time="+now+
                    "&type="+'检查'+
                    "&aim="+_this.checkDataSelection[i].aim+
                    "&body="+_this.checkDataSelection[i].body+
                    "&hurry="+_this.checkDataSelection[i].hurry
                ).then(function (resp){});
                _this.checkData[this.checkDataSelection[i].index].status='已开立';
              }
              i++;
            }
            if(j>0){
              this.$message({
                message:'开立成功',
                type:'success'
              });
              _this.refresh();
            }
            else{
              this.$message({
                message:'开立失败',
                type:'error'
              });
            }
          },
          cancelProject(){
            if(this.$store.state.patientState==='已就诊'){
              this.$message({
                message: '只能查看已就诊患者信息',
                type: 'error'
              });
              this.cancelVisible = false;
            }
            else {
              if(this.checkDataSelection===null||this.checkDataSelection.length===0){
                this.$message({
                  message: '未选中任何项目',
                  type: 'error'
                });
                this.cancelVisible=false;
              }
              else {
                this.$message({
                  message: 'cancellProject',
                  type: 'warning'
                });
                this.cancelVisible = true;
              }
            }
          },
          //确认作废项目
          async confirmCancel(){
            let _this = this;
            let i = 0;
            let j = 0;
            while(i<_this.checkDataSelection.length ){
              if(_this.checkDataSelection[i].status === '已开立'){
                j++;
                await axios.post("http://localhost:20910/deleteConsume?" +
                    "&costName="+_this.checkDataSelection[i].nondrugname+
                    "&recordId="+_this.$store.state.recordPid+"&time="+this.$store.state.time+"&docId="+this.$store.state.docId
                ).then(function (resp){});
              }
              i++;
            }
            if(j>0){
              this.$message({
                message:'作废成功',
                type:'success'
              });
              _this.refresh();
            }
            else{
              this.$message({
                message:'作废失败',
                type:'error'
              });
            }

          },
          saveTemplate(){
            if(this.checkDataSelection===null||this.checkDataSelection.length===0){
              this.$message({
                message: '未选中任何项目',
                type: 'error'
              });
              this.saveVisible=false;
            }
            else {
              this.$message({
                message: 'saveTemplate',
                type: 'success'
              });
              this.templateName = '';
              this.saveVisible = true;
            }
          },
          //确认存为组套
          async confirmSave(){
            if(this.templateName.length!==0) {
              let flag = false;
              await axios.post("http://localhost:20910/searchTemplateByName?name=" + this.templateName).then(function (resp) {
                flag = resp.data;
              })
              if (flag === true) {
                let date = new Date();
                let year = date.getFullYear(); // 年
                let month = date.getMonth() + 1; // 月
                let day = date.getDate(); // 日
                let hour = date.getHours();//小时
                let min = date.getMinutes();//分钟
                let sec = date.getSeconds();//秒
                let now = `${year}-${month}-${day} ${hour}:${min}:${sec}`;
                let _this = this;
                let i = 0;
                console.log(_this.checkDataSelection)
                while (i < _this.checkDataSelection.length) {
                  await axios.post("http://localhost:20910/insertTemplate?" +
                      "&name=" + _this.templateName +
                      "&time=" + now +
                      "&userange=" + "个人" +
                      "&docId=" + this.$store.state.docId +
                      "&medName=" + _this.checkDataSelection[i].nondrugname
                  )
                  i++;
                }
                if (i > 0) {
                  this.$message({
                    message: '保存成功',
                    type: 'success'
                  });
                } else {
                  this.$message({
                    message: '保存失败',
                    type: 'error'
                  });
                }
              } else {
                this.$message({
                  message: '该模板名已被使用',
                  type: 'error'
                })
              }
            }
            else{
              this.$message({
                message: '未输入模板名',
                type: 'error'
              })
            }
          },
          refresh(){
            this.$message({
              message: 'refresh',
              type: 'success'
            })
            this.reload();
          },
          transUse(row){
            if(this.$store.state.patientState==='已就诊'){
              this.$message({
                message:'已就诊患者只能进行查看操作',
                type:'error'
              });
              this.useConfirmVisible=false;
            }
            else{
              this.useConfirmVisible = true;
              this._row = row;
            }
          },
          handleSelectionChange(val) {
            this.checkDataSelection = val;

          },
          handleProjectDataSelection(val){
            this.projectDataSelection = val;

          },
          lookCheckResult(row){
            let _this = this;
            _this.checkResultdata=[]
            axios.post("http://localhost:20910/getCheckResults?" +
                "&recordId="+_this.$store.state.recordPid+
                "&name="+row.nondrugname+"&docId="+this.$store.state.docId+"&time="+this.$store.state.time
            ).then(function (resp){
              if(resp.data!==null&&resp.data.length!==0) {
                _this.checkResultdata.push({
                  'checkResult': resp.data[0].results,
                  'checkDname': resp.data[0].name
                })
              }
            })
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
            async useTemplate() {
                let _this = this;
                let h = 0;
                let j = 0;
                if(_this.value1 === true){ h = 1; }
                await axios.post("http://localhost:20910/getCheckTempData?" +
              "&name="+this._row.name).then(function (resp){
                console.log(resp);
                let i = 0
                while(i<resp.data.length){
                  let flag = 1
                  for (let key of _this.checkData){
                    if(resp.data[i].medName === key.nondrugname){
                      flag = 0;
                      break;
                    }
                  }
                  if(flag !== 0){
                    j++;
                    _this.checkData.push({
                      "index":_this.checkData.length,
                      'nondrugname': resp.data[i].medName,
                      'deptName': resp.data[i].deptname,
                      'status':'暂存',
                      'price' :resp.data[i].price,
                      'aim' :_this.aim,
                      'body':_this.body,
                      'hurry': h
                    });
                  }
                  i++;
                }
              })
              if(j>0){
                this.$message({
                  message: '使用成功',
                  type: 'success'
                });
              }
              else{
                this.$message({
                  message: '模板内项目均重复，无需使用该模板',
                  type: 'error'
                });
              }
            },
            detailDataset(row) {
            let _this = this;
            _this.detailData = []
              axios.post("http://localhost:20910/getCheckTempData?" +
                  "&name="+row.name).then(function (resp){
                let i = 0
                while(i<resp.data.length){
                  _this.detailData.push({
                    'medName': resp.data[i].medName,
                    'price': resp.data[i].price
                  })
                  i++
                }
              });
            },
        }
    }
</script>

<style scoped>

</style>
