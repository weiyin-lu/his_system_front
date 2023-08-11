<template>
  <el-row>
    <el-row>
  <el-col :span="4" class="hhh"><div><el-button class="el-icon-s-home" @click="re" type="primary">主菜单</el-button></div></el-col>
  <el-col :span="16" class="hh"><div>欢迎来到医技模板</div></el-col>
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
  <el-col :span="24">
    <div><el-dialog :visible.sync="formVisible" title="新建模板" top="1%" @close="clear">
      <div style="height: 70vh;overflow:scroll;">
        <el-row>
          <el-col :span="5" class="h" style="color: white"><div><el-button type="primary">新建医技模板</el-button></div></el-col>
          <el-col :span="14" class="hh"><div>欢迎来到医技模板</div></el-col>
          <el-col :span="5" class="hhh"><div><el-button type="primary">新建医技模板</el-button></div></el-col>
        </el-row>
        <div>
          <el-form label-suffix=":" label-position="right" :model="NewForm" style="margin-top: 20px">
            <el-row>
              <el-col :span="4" style="border: 1px solid ;border-color: #eaeaea;border-radius: 6%;height: 40px;"><div style="padding-top: 10px">模板名称</div></el-col>
              <el-col :span="20">
                <el-form-item>
                  <el-input v-model.trim="NewForm.name" placeholder="请输入模板名称" style="width: 80%;"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4" style="border: 1px solid ;border-color: #eaeaea;border-radius: 6%;height: 40px;"><div style="padding-top: 10px">创建时间</div></el-col>
              <el-col :span="20">
                <el-form-item>
                  <el-date-picker
                          placeholder="选择时间"
                          value-format="yyyy-MM-dd HH-mm-ss"
                          type="datetime"
                          v-model.trim="NewForm.time"
                          style="width: 80%;"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4" style="border: 1px solid ;border-color: #eaeaea;border-radius: 6%;height: 40px;"><div style="padding-top: 10px">模板范围</div></el-col>
              <el-col :span="20">
                <el-form-item>
                  <el-select v-model.trim="NewForm.userange" placeholder="输入模板范围" style="width: 80%;">
                    <el-option label="全院" value="全院"></el-option>
                    <el-option label="个人" value="个人"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4" style="border: 1px solid ;border-color: #eaeaea;border-radius: 6%;height: 40px;"><div style="padding-top: 10px">医生编号</div></el-col>
              <el-col :span="20">
                <el-form-item>
                  <el-input v-model.trim="NewForm.docId" placeholder="输入医生编号" style="width: 80%;"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4" style="border: 1px solid ;border-color: #eaeaea;border-radius: 6%;height: 40px;"><div style="padding-top: 10px">模板类型</div></el-col>
              <el-col :span="20">
                <el-form-item>
                  <el-select v-model.trim="NewForm.type" placeholder="选择类型" style="width: 80%;">
                    <el-option label="药品" value="药品"></el-option>
                    <el-option label="非药品" value="非药品"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4"><div>
                <el-button v-if="this.storeMedName.length===0">添加项目:</el-button>
                <el-popover
                        placement="bottom"
                        width="200"
                        trigger="click"
                        v-if="this.storeMedName.length!==0">
                  <el-table :data="storeMedName" width="100px">
                    <el-table-column prop="code" label="项目编码"></el-table-column>
                    <el-table-column prop="name" label="项目名称"></el-table-column>
                    <el-table-column label="操作"><template slot-scope="scope"><el-button size="mini" type="danger" @click="deleteNewTemplateItem(scope.row)">删除</el-button></template></el-table-column>
                  </el-table>
                  <el-button  slot="reference">已加项目:</el-button>
                </el-popover>
              </div></el-col>
              <el-col :span="20">
                <el-form-item>
                  <el-autocomplete
                          v-model.trim="NewForm.medName"
                          :fetch-suggestions="querySearchAsync"
                          placeholder="请输入内容"
                          clearable
                          style="width: 70%;" v-if="NewForm.type==='非药品'"></el-autocomplete>
                  <el-autocomplete
                          v-model.trim="NewForm.medName"
                          :fetch-suggestions="querySearchAsync1"
                          placeholder="请输入内容"
                          clearable
                          style="width: 70%;" v-if="NewForm.type==='药品'"></el-autocomplete>
                  <el-input placeholder="请先选择类型" v-if="NewForm.type===''" style="width:70%"></el-input>
                  <el-button @click="select">选择</el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <!--<div></div>-->
            <el-row>
              <el-col :span="4" style="border: 1px solid ;border-color: #eaeaea;border-radius: 6%;height: 40px;"><div style="padding-top: 10px">检查部位</div></el-col>
              <el-col :span="20">
                <el-form-item>
                  <el-input v-model.trim="NewForm.position" placeholder="请输入检查部位(NULL)" style="width: 80%;"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4" style="border: 1px solid ;border-color: #eaeaea;border-radius: 6%;height: 40px;"><div style="padding-top: 10px">项目用法</div></el-col>
              <el-col :span="20">
                <el-form-item>
                  <el-input v-model.trim="NewForm.useage" placeholder="请输入用法(NULL)" style="width: 80%;"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4" style="border: 1px solid ;border-color: #eaeaea;border-radius: 6%;height: 40px;"><div style="padding-top: 10px">项目用量</div></el-col>
              <el-col :span="20">
                <el-form-item>
                  <el-input v-model.trim="NewForm.consumption" placeholder="请输入用量(NULL)" style="width: 80%;"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4" style="border: 1px solid ;border-color: #eaeaea;border-radius: 6%;height: 40px;"><div style="padding-top: 10px">项目频次</div></el-col>
              <el-col :span="20">
                <el-form-item>
                  <el-input v-model.trim="NewForm.frequency" placeholder="请输入频次(NULL)" style="width: 80%;"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4" style="border: 1px solid ;border-color: #eaeaea;border-radius: 6%;height: 40px;"><div style="padding-top: 10px">项目数量</div></el-col>
              <el-col :span="20">
                <el-form-item>
                  <el-input v-model.trim="NewForm.number" placeholder="请输入数量(NULL)" style="width: 70%;"></el-input>
                  <el-button type="primary" @click="rer">确认</el-button>
                </el-form-item>
              </el-col>
            </el-row>

          </el-form>
        </div>
      </div>
    </el-dialog></div>
  </el-col>
    </el-row>
  <el-row style="margin-top: 40px">
  <el-col :span="5"><div>名称：<el-input v-model.trim="input" placeholder="请输入模板名称" style="width: 60%"></el-input></div></el-col>
  <el-col :span="5"><div>范围：<el-select v-model.trim="value0" placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select></div></el-col>
  <el-col :span="5"><div>类型：<el-select v-model.trim="value" placeholder="请选择">
    <el-option
      v-for="item in options1"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option></el-select></div></el-col>
  <el-col :span="3"><div><el-button class="el-icon-search" @click="search" type="primary">查询</el-button></div></el-col>
  <el-col :span="3"><div><el-button class="el-icon-refresh" @click="refresh" type="primary">刷新</el-button></div></el-col>
    <el-col :span="3"><div><el-button class="el-icon-news" type="primary" @click="newTemplate">新建模板</el-button></div></el-col>
  </el-row>
  <el-col><el-table
    :data="tableData"
    style="width: 100%;margin-top: 50px"
    border
    height="600px">
    <el-table-column
      prop="name"
      label="模板名称"
      min-width="15%">
    </el-table-column>
    <el-table-column
      prop="time"
      label="创建时间"
      min-width="15%">
    </el-table-column>
    <el-table-column
      prop="userange"
      label="范围"
      min-width="15%">
    </el-table-column>
    <el-table-column
      prop="type"
      label="类型"
      min-width="15%">
    </el-table-column>
    <el-table-column label="操作" min-width="15%">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="handleChange(scope.$index,scope.row)" style="margin-left: 5px">编辑</el-button>
        <el-dialog  :visible.sync="outerVisible" width="70%">
          <el-row>
            <el-col :span="4" class="hhh"><div style="text-align: center">医技模板</div></el-col>
            <el-col :span="16" class="hh"><div style="text-align: center">{{title}}</div></el-col>
            <el-col :span="4" class="hhh"><div style="text-align: center">修改模板</div></el-col>
            <el-col :span="13"><div><el-button type="text" @click="AddItem" style="float: left">添加已有项目</el-button></div></el-col>
                <el-col>
                  <div>
                    <el-dialog
                      width="50%"
                      title="选择项目信息"
                      :visible.sync="inner1Visible"
                      append-to-body>
                      <div style="margin:auto;text-align: center">
                        <div>
                          <el-table :data="NondrugData" border width="100%" height="300px">
                            <el-table-column
                              prop="id"
                              label="项目编号"
                              min-width="40%">
                            </el-table-column>
                            <el-table-column
                              prop="code"
                              label="项目编码"
                              min-width="40%">
                            </el-table-column>
                            <el-table-column
                              prop="name"
                              label="项目名称"
                              min-width="40%">
                            </el-table-column>
                            <el-table-column
                              prop="price"
                              label="项目价格"
                              min-width="40%">
                            </el-table-column>
                            <el-table-column
                              prop="standard"
                              label="项目规格"
                              min-width="40%">
                            </el-table-column>
                            <el-table-column
                              prop="deptId"
                              label="项目部门号"
                              min-width="40%">
                            </el-table-column>
                            <el-table-column
                              prop="subject"
                              label="费用类型"
                              min-width="40%">
                            </el-table-column>
                            <el-table-column
                              prop="type"
                              label="项目类型"
                              min-width="40%">
                            </el-table-column>
                            <el-table-column
                              label="操作"
                              min-width="40%">
                              <template slot-scope="scope0">
                                <div>
                                  <el-button size="mini" type="primary" @click="selectItem(scope0.$index,scope0.row,scope.row)">选择</el-button>
                                </div>
                              </template>
                            </el-table-column>
                          </el-table>
                        </div>
                      </div>
                    </el-dialog>
                  </div>
                  <div>
                    <el-dialog
                      width="50%"
                      title="选择项目信息"
                      :visible.sync="inner2Visible"
                      append-to-body>
                      <div><el-table  border height="300px" style="align-content: center;margin-top: 40px" :data="Medicine">
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
                        <template slot-scope="scope0">
                          <div>
                            <el-button size="mini" type="primary" @click="selectItem(scope0.$index,scope0.row,scope.row)">选择</el-button>
                          </div>
                        </template>
                      </el-table-column>
                    </el-table></div></el-dialog>
                  </div>
                  </el-col>
                <el-col :span="24"><el-table
                  :data="Data"
                  border
                  width="100%"
                  height="250px">
                  <el-table-column
                    prop="code"
                    label="项目编码"
                    min-width="40%">
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    label="项目名称"
                    min-width="40%">
                  </el-table-column>
                  <el-table-column
                    prop="standard"
                    label="项目规格"
                    min-width="40%">
                  </el-table-column>
                  <el-table-column
                    prop="type"
                    label="项目类型"
                    min-width="40%">
                  </el-table-column>
                  <el-table-column label="操作" min-width="20%">
                    <template slot-scope="scope1">
                      <el-button
                        size="mini"
                        type="danger"
                        @click="handleDeleteItem(scope1.$index, scope1.row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table></el-col>
          </el-row>
        </el-dialog>
        <el-button
          type="success"
          size="mini"
          @click="handleInfo(scope.$index,scope.row)" style="margin-left: 5px">信息</el-button>
          <el-drawer
            :visible.sync="table"
            direction="ltr"
            size="25%"
            :title="info"
          >
            <el-table :data="gridData" width="100%" border>
              <el-table-column property="code" label="项目编号" min-width="50%"></el-table-column>
              <el-table-column property="name" label="项目名称" min-width="50%"></el-table-column>
            </el-table>
          </el-drawer>
      </template>
    </el-table-column>
  </el-table></el-col>
</el-row>
</template>

<script>
    export default {
        name: "MedicalTechManage",
        data(){
            return {
                tempTemplate:[],
                tempItem:[],
                type:'',
                NewForm:{
                    name:'',
                    time:'',
                    userange:'',
                    docId:'',
                    type:'',
                    medName:'',
                    position:'',
                    useage:'',
                    consumption:'',
                    frequency:'',
                    number:'',
                },
                storeMedName:[],
                formVisible:false,
                temp:[],
                Medicine:[],
                NondrugData:[],
                title:'',
                info:'',
                table:false,
                tableData:[],
                Data:[],
                input:'',
                name:'',
                name1:'',
                getDocInfo:[],
                options: [{
                    value:'个人',
                    label:'个人'
                },{
                    value:'全院',
                    label:'全院'
                }],
                options1:[{
                    value:'1',
                    label:'药品 '
                },{
                    value:'0',
                    label:'非药品'
                }],
                value0:'',
                value: '',
                gridData: [],
                dialogTableVisible:false,
                outerVisible:false,
                inner1Visible:false,
                inner2Visible:false,
                form: {
                    code:'',
                    name:'',
                    standard:'',
                    type:''
                },
                restaurants:[],
                restaurants1:[],
            }
        },
        mounted:function(){
            this.loadTemplate()
            this.loadMedName()
            this.getDocInfoFuc()
        },

        methods:{
          clear(){
            this.NewForm={
                      name:'',
                      time:'',
                      userange:'',
                      docId:'',
                      type:'',
                      medName:'',
                      position:'',
                      useage:'',
                      consumption:'',
                      frequency:'',
                      number:'',
            }
          },
            deleteNewTemplateItem(row){
              axios.post("http://localhost:20910/api/deleteTemplateItem/"+this.NewForm.name+'/'+row.name,{
                name1:this.NewForm.name,
                name2:row.name
              }).then(resp=>{
                if(resp && resp.data.code===200){
                  this.$message({
                    message:'删除成功',
                    type:'success'
                  })
                  this.loadTemplateItemName(this.NewForm.name)
                }
              })
            },
            newTemplate(){
              this.formVisible=true
            },
            loadMedName(){
                let _this=this
                axios.get("http://localhost:20910/api/listItemNonDrugName").then(resp=>{
                    if(resp && resp.data.code===200){
                        _this.restaurants=resp.data.result
                    }
                })
              axios.get("http://localhost:20910/api/listItemMedicineName").then(resp=>{
                if(resp && resp.data.code===200){
                  _this.restaurants1=resp.data.result
                }
              })
            },
            AddItem(){
                let a=this.type
                let _this=this
                if(a==='非药品'){
                    _this.inner1Visible = true
                }else {
                    _this.inner2Visible = true
                }
            },
            loadTemplateItemName(a){
              if(a==='非药品'){
                axios.get("http://localhost:20910/api/listItem0/"+this.NewForm.name,{
                  name:this.NewForm.name
                }).then(resp=>{
                  if(resp && resp.data.code===200){
                    this.storeMedName=resp.data.result
                  }
                })
              }else{
                axios.get("http://localhost:20910/api/listItem1/"+this.NewForm.name,{
                  name:this.NewForm.name
                }).then(resp=>{
                  if(resp && resp.data.code===200){
                    this.storeMedName=resp.data.result
                  }
                })
              }
            },
            select(){
                if(this.NewForm.name.split(" ").join("").length!==0){
                    let i=0;
                    if(this.NewForm.type==='药品'){
                      i=1;
                    }
                    axios.post("http://localhost:20910/api/insertNewTemplate",{
                        name:this.NewForm.name,
                        time:this.NewForm.time,
                        userange:this.NewForm.userange,
                        docId:this.NewForm.docId,
                        type:i,
                        medName:this.NewForm.medName,
                        position:this.NewForm.position,
                        useage:this.NewForm.useage,
                        consumption:this.NewForm.consumption,
                        frequency:this.NewForm.frequency,
                        number:this.NewForm.number,
                    }).then(resp=>{
                        if(resp && resp.data.code===200){
                            this.$message({
                                message:'选中成功',
                                type:'success'
                            })
                          //load storeMedName
                          this.loadTemplateItemName(this.NewForm.type)
                        }
                    })
                }else if(this.NewForm.name.split(" ").join("").length===0) {
                    this.$message.error("模板名称不能为空")
                }

            },
            async selectItem(index,row0){
              let i = 0
              if(this.tempItem.type === '药品'){
                i = 1
              }
                let data={
                    name:this.tempItem.name,
                    time:this.tempItem.time,
                    userange:this.tempItem.userange,
                    docId:this.$store.state.docId,
                    type:i,
                    medName:row0.name,
                }
              await axios.get("http://localhost:20910/api/listTemplateCostName/"+row0.name+"/"+this.tempItem.name,{
                name:row0.name,
                name1:this.tempItem.name
              }).then(resp=>{
                if(resp && resp.data.code==200){
                  this.tempTemplate=resp.data.result
                  if(this.tempTemplate.length===1){
                    this.$message.error("不能重复添加")
                  }else{
                    axios.post("http://localhost:20910/api/insertTemplateItem",data).then(resp=>{
                      if(resp && resp.data.code===200){
                        this.$message({
                          message:"添加成功",
                          type:'success'
                        })
                      }
                    })
                  }
                }
              })

            },
            handleDeleteItem(index,row){
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then( () => {
                        axios.post('http://localhost:20910/api/deleteTemplateItem/'+this.tempItem.name+'/'+row.name,{
                            name1:this.tempItem.name,
                            name2:row.name,
                        }).then(resp => {
                            if (resp && resp.status === 200) {
                              let _this=this
                              let i = 0
                              if(this.type === '药品'){
                                i = 1
                              }
                              axios.get('http://localhost:20910/api/listItemModule/'+this.title+'/'+i,{
                                name:this.title,
                                type:i
                              }).then(resp=>{
                                if(resp && resp.data.code===200){
                                  _this.Data=resp.data.result
                                }
                              })
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        })
                    })
            },
            loadTemplate(){
                let _this=this
                axios.get('http://localhost:20910/api/listTemplate').then(resp=>{
                    if(resp && resp.data.code===200){
                        _this.tableData=resp.data.result
                    }
                })
                axios.get('http://localhost:20910/api/getNondrug').then(resp=>{
                    if(resp && resp.data.code===200){
                        _this.temp=resp.data.result
                        let j=0;
                        for(let i=0;i<this.temp.length;i++){
                            if(this.temp[i].status===1){
                                this.NondrugData[j]=_this.temp[i]
                                j++
                            }

                        }
                    }
                })
                axios.get('http://localhost:20910/api/medical').then(resp => {
                    if (resp) {
                        this.Medicine = resp.data.result
                    }
                })
            },
            search(){
                let _this=this
                if(!this.input&&!this.value0&&!this.value){
                    this.$message.error("请输入查询条件")
                }
                else if(this.input&&!this.value0&&!this.value){
                    axios.get('http://localhost:20910/api/searchTemplate0/'+this.input,{
                        name:this.input
                    }).then(resp=>{
                        if(resp && resp.data.code===200){
                            _this.tableData=resp.data.result
                            if(_this.tableData.length===0){
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
                else if(!this.input&&this.value0&&!this.value){
                    axios.get('http://localhost:20910/api/searchTemplate1/'+this.value0,{
                        userange:this.value0
                    }).then(resp=>{
                        if(resp && resp.data.code===200){
                            _this.tableData=resp.data.result
                            if(_this.tableData.length===0){
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
                else if(!this.input&&!this.value0&&this.value){
                    axios.get('http://localhost:20910/api/searchTemplate2/'+this.value,{
                        userange:this.value
                    }).then(resp=>{
                        if(resp && resp.data.code===200){
                            _this.tableData=resp.data.result
                            if(_this.tableData.length===0){
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
            },
            refresh(){
                this.input=''
                this.value0=''
                this.value=''
                this.loadTemplate()
            },
            re(){
                this.$router.replace('/MedicalLogin')
            },
            handleDelete(index, row) {
                let data={
                    name:row.name
                }
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    axios.post('http://localhost:20910/api/deleteTemplate/'+row.name,data).then(resp=>{
                        if(resp && resp.data.code===200){
                            this.loadTemplate()
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
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
            handleChange(index,row){
                this.type = row.type
                this.tempItem=row
                this.title=row.name
                this.outerVisible = true
                let _this=this
              let i = 0
              if(row.type === '药品'){
                i = 1
              }
                axios.get('http://localhost:20910/api/listItemModule/'+row.name+'/'+i,{
                    name:row.name,
                    type:i
                }).then(resp=>{
                    if(resp && resp.data.code===200){
                        _this.Data=resp.data.result
                    }
                })
            },
            handleInfo(index,row){
                this.table=true
                this.info=row.name
                let _this=this
                if(row.type==='非药品'){
                    axios.get('http://localhost:20910/api/listItem0/'+this.info,{
                        name:this.info
                    }).then(resp=>{
                        if(resp && resp.data.code===200){
                            _this.gridData=resp.data.result
                        }
                    })
                }else{
                    axios.get('http://localhost:20910/api/listItem1/'+this.info,{
                        name:this.info
                    }).then(resp=>{
                        if(resp && resp.data.code===200){
                            _this.gridData=resp.data.result
                        }
                    })
                }

            },
            rer(){
                this.loadTemplate()
                this.formVisible=false;
            },
            querySearchAsync(queryString, cb) {
                let restaurants = this.restaurants;
                let results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    cb(results);
                }, 3000 * Math.random());
            },
            createStateFilter(queryString) {
                return (restaurants) => {
                    return (restaurants.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
          querySearchAsync1(queryString, cb) {
            let restaurants1 = this.restaurants1;
            let results = queryString ? restaurants1.filter(this.createStateFilter1(queryString)) : restaurants1;
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
              cb(results);
            }, 3000 * Math.random());
          },
          createStateFilter1(queryString) {
            return (restaurants1) => {
              return (restaurants1.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
          },
        },
      watch:{
          'inner1Visible': function(){
            if(this.inner1Visible===false){
              let _this=this
              let i = 0
              if(this.type  === '药品'){
                i = 1
              }
              axios.get('http://localhost:20910/api/listItemModule/'+this.title+'/'+i,{
                name:this.title,
                type:i
              }).then(resp=>{
                if(resp && resp.data.code===200){
                  _this.Data=resp.data.result
                }
              })
            }
          },
        'inner2Visible': function(){
          if(this.inner2Visible===false){
            let _this=this
            let i = 0
            if(this.type  === '药品'){
              i = 1
            }
            axios.get('http://localhost:20910/api/listItemModule/'+this.title+'/'+i,{
              name:this.title,
              type:i
            }).then(resp=>{
              if(resp && resp.data.code===200){
                _this.Data=resp.data.result
              }
            })
          }
        },
      }
    }
</script>

<style scoped>
  .hhh{
    background-color: #409EFF ;
    height: 40px;
  }
.hh{

  border: 5px solid #8c939d;
  background-color: #8c939d;
  height: 40px;

}
</style>
