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
      <el-tabs v-model="page" @tab-click="click" type="border-card">
        <el-tab-pane name="病历首页" label="病历首页"></el-tab-pane>
        <el-tab-pane name="检查申请" label="检查申请"></el-tab-pane>
        <el-tab-pane name="检验申请" label="检验申请"></el-tab-pane>
        <el-tab-pane name="门诊确诊" label="门诊确诊"></el-tab-pane>
        <el-tab-pane name="处置申请" label="处置申请"></el-tab-pane>
        <el-tab-pane name="成药处方" label="成药处方">
          <div class="about">
            <el-row style="text-align: left">
              <el-tag style="margin-right:15px">门诊诊断: </el-tag>
              <el-tag type="info">【{{judgement}}】{{disease}}</el-tag>
            </el-row>

            <el-tag style="text-align: center;background-color: #409EFF;width: 100%;height: 42px ">
              <el-row>
                <el-button type="primary" icon="el-icon-circle-plus" @click="addPrescription">
                  增方
                </el-button>
                <el-dialog title="新增处方" :visible.sync="addVisible">
                  <el-row style="text-align: center">
                    <el-tag style="width: 70px">处方名称</el-tag>
                    <el-input clearable v-model="inputPrescriptionName" placeholder="请输入处方名称" style="width: 300px;margin-left: 20px"></el-input>
                    <el-button type="primary" @click="resetPrescription()" icon="el-icon-refresh" style="margin-left: 10px"></el-button>
                  </el-row>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="addVisible = false;inputPrescriptionName='新增处方'+addTime">取 消</el-button>
                    <el-button type="primary" @click="executeAddPrescription()">确 定</el-button>
                  </div>
                </el-dialog>
                <el-button type="primary" icon="el-icon-delete" style="margin-left: 60px" @click="deletePrescription()">
                  删方
                </el-button>
                <el-dialog title="确认删除所选项目？" :visible="deleteVisible" width="30%">
                  <el-button @click="deleteVisible=false">取消</el-button>
                  <el-button type="primary" @click="deleteVisible=false;confirmDelete()">确定</el-button>
                </el-dialog>
                <el-button type="primary" icon="el-icon-circle-check" style="margin-left: 60px" @click="executePrescription()">开立</el-button>
                <el-dialog title="确认开立？" :visible="executeVisible" width="30%">
                  <el-button @click="executeVisible=false">取消</el-button>
                  <el-button type="primary" @click="executeVisible=false;confirmExecute()">确认</el-button>
                </el-dialog>
                <el-button type="primary" icon="el-icon-error" style="margin-left: 60px" @click="cancelPrescription()">作废</el-button>
                <el-dialog title="确认作废该项目？" :visible="cancelVisible" width="30%">
                  <el-button @click="cancelVisible=false">取消</el-button>
                  <el-button type="primary" @click="cancelVisible=false;confirmCancel()">确认</el-button>
                </el-dialog>
                <el-button type="primary" icon="el-icon-refresh-right" style="margin-left: 60px" @click="refresh();">刷新</el-button>

                <el-button type="primary"  icon="el-icon-delete" style="float: right" @click="deleteMedicine()">删药</el-button>
                <el-dialog title="确认删除所选药品？" :visible="deleteMedicineVisible">
                  <el-button @click="deleteMedicineVisible=false">取消</el-button>
                  <el-button type="primary" @click="deleteMedicineVisible=false;confirmDeleteMedicine()">确定</el-button>
                </el-dialog>
                <el-button type="primary" icon="el-icon-circle-plus" style="float: right" @click="addMedicine()">增药</el-button>
                <el-dialog title="新增药物" :visible.sync="addMedicineVisible">
                  <el-tag>名称:</el-tag>
                  <el-autocomplete
                      clearable
                      class="inline-input"
                      v-model.trim="inputProjectName"
                      :fetch-suggestions="querySearch"
                      placeholder="请输入药品名称"
                      :trigger-on-focus="false"
                      @select="handleSelect"
                      style="margin-left: 20px;width: 200px">
                  </el-autocomplete>

                  <el-button type="primary" icon="el-icon-search" style="margin-left: 30px" @click="searchMedicine()"></el-button>
                  <el-table :data="medicineData" style="width: 100%" highlight-current-row>
                    <el-table-column prop="medicineName" label="药品名称" min-width="25%">
                      <template slot-scope="scope">{{scope.row.medicineName}}</template>
                    </el-table-column>
                    <el-table-column prop="medicineSpec" label="规格" min-width="25%"></el-table-column>
                    <el-table-column prop="medicinePrice" label="单价" min-width="25%" sortable></el-table-column>
                    <el-table-column prop="medicineNumber" label="数量" min-width="25%">
                      <template slot-scope="scope">
                        <el-input-number v-model="scope.row.medicineNumber" :min="1" :max="100" size="mini"
                                         @change="numberChange($event, scope.row, scope.$index)">
                        </el-input-number>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-form style="margin-top:20px;" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="50px" class="demo-ruleForm">
                    <el-form-item label="用法" prop="usage">
                      <el-input v-model="ruleForm.usage"></el-input>
                    </el-form-item>
                    <el-form-item label="用量" prop="consumption">
                      <el-input v-model="ruleForm.consumption"></el-input>
                    </el-form-item>
                    <el-form-item label="频次" prop="frequency">
                      <el-input v-model="ruleForm.frequency"></el-input>
                    </el-form-item>
                  </el-form>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="addMedicineVisible = false">取 消</el-button>
                    <el-button type="primary" @click="executeAddMedicine()">确 定</el-button>
                  </div>
                </el-dialog>
              </el-row>
            </el-tag>

            <el-row>
              <el-col :span="8" style="text-align:left">
                <p>
                  <el-tag type="info" style="width: 20%; height:30px">
                    门诊处方:
                  </el-tag>
                </p>
                <el-table ref="singleTable"
                          :data="recipel"
                          highlight-current-row
                          @current-change="handleCurrentChange"
                          border
                          style="width: 80%; box-shadow:5px 5px 10px gray">
                  <el-table-column prop="name" label="名称" style="width: 50%"></el-table-column>
                  <el-table-column prop="state" label="状态" style="width: 50%"></el-table-column>
                </el-table>
              </el-col>
              <el-col :span="16">
                <p style="text-align:left">
                  <el-tag style="width: 14%; height:30px; margin-right:15px">
                    本项目合计金额:
                  </el-tag>
                  <el-tag  type="warning" style="width: 10%; height:30px">
                    {{money}}元
                  </el-tag>
                </p>
                <el-table ref="multipleTable" :data="showTableData"
                          stripe
                          border
                          style="width: 100%"
                          @selection-change="handleSelectionChange">
                  <el-table-column type="selection" min-width="5%"></el-table-column>
                  <el-table-column prop="medName" label="药品名称" min-width="16%"></el-table-column>
                  <el-table-column prop="Spec" label="规格" min-width="16%"></el-table-column>
                  <el-table-column prop="price" label="单价" min-width="11%" sortable></el-table-column>
                  <el-table-column prop="usage" label="用法" min-width="11%"></el-table-column>
                  <el-table-column prop="dosage" label="用量" min-width="11%"> </el-table-column>
                  <el-table-column prop="freq" label="频次" min-width="11%"> </el-table-column>
                  <el-table-column prop="amount" label="数量" min-width="20%">
                    <template slot-scope="scope">
                      <el-input-number v-model="scope.row.amount" :min="1" :max="100" size="mini"
                                     @change="medNumberChange($event, scope.row, scope.$index)">
                      </el-input-number>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
            <p></p>

            <el-tabs type="border-card">
              <el-tab-pane label="处方模版">
                <el-row>
                  <el-col :span="10" >
                    <div style="text-align:left">
                      <el-tag style="font-size: 10px">名称:</el-tag>
                      <el-autocomplete
                          clearable
                          class="inline-input"
                          v-model.trim="inputTemplateName"
                          :fetch-suggestions="queryTemplateSearch"
                          placeholder="请输入名称"
                          :trigger-on-focus="false"
                          @select="handleTemplateSelect"
                          style="width:150px;margin-left: 5px">
                      </el-autocomplete>
                      <span v-show="showTemplateEmpty">
                        <i class="el-icon-error" style="font-size:8px; color: red">未输入名称</i>
                      </span>
                      <el-button type="primary" @click="searchTemplate" icon="el-icon-search" style="margin-left: 8px"></el-button>
                    </div>
                    <div style="text-align:center">
                      <el-table :data="showTemplateTable" style="width: 90%">
                        <el-table-column label="模版名称(点击查看详细信息)" style="width: 70%">
                          <template slot-scope="scope">
                            <el-link @click="handleTemplateClick(scope.row)" >{{scope.row.tempName}}</el-link>
                          </template>
                        </el-table-column>
                        <el-table-column prop="range" label="范围" style="width: 30%"> </el-table-column>
                      </el-table>
                    </div>
                  </el-col>
                  <el-col :span="14" v-show="showTemplateDetail" >
                    <el-card class="box-card">
                      <div slot="header" class="clearfix" style="text-align:left">
                        <span style="font-size:18px">模版明细:</span>
                        <el-button style="float: right; padding: 3px 0" type="text" @click="useTemplate">使用该模版</el-button>
                      </div>
                      <div>
                        <el-table :data="templateDetailTable" style="width: 100%" border>
                          <el-table-column prop="medName" label="药品名称" style="width: 10%"></el-table-column>
                          <el-table-column prop="Spec" label="规格" style="width: 10%"></el-table-column>
                          <el-table-column prop="price" label="单价" style="width: 10%" sortable></el-table-column>
                          <el-table-column prop="usage" label="用法" style="width: 10%"></el-table-column>
                          <el-table-column prop="dosage" label="用量" style="width: 20%"> </el-table-column>
                          <el-table-column prop="freq" label="频次" style="width: 20%"> </el-table-column>
                          <el-table-column prop="amount" label="数量" style="width: 10%"></el-table-column>
                        </el-table>
                      </div>
                    </el-card>
                  </el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane label="常用药品">
                <el-row>
                  <el-col :span="10" >
                    <div style="text-align:left">
                      <el-tag style="font-size: 10px">名称:</el-tag>
                      <el-autocomplete
                          clearable
                          class="inline-input"
                          v-model.trim="inputMedName"
                          :fetch-suggestions="querySearch"
                          placeholder="请输入药品名称"
                          :trigger-on-focus="false"
                          @select="handleMedSelect"
                          style="width:150px;margin-left: 5px">
                      </el-autocomplete>
                      <span v-show="showMedEmpty">
                                    <i class="el-icon-error" style="font-size:8px; color: red">未输入名称</i>
                                    </span>
                      <el-button type="primary" @click="searchMed" icon="el-icon-search" style="margin-left: 8px"></el-button>
                    </div>
                    <div style="text-align:center">
                      <el-table :data="commonMedTable" style="width: 50%">
                        <el-table-column label="常用药品名称(点击查看详细信息)" style="width: 100%">
                          <template slot-scope="scope">
                            <el-link @click="handleMedClick(scope.row)" >{{scope.row.value}}</el-link>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </el-col>
                  <el-col :span="14" v-show="showMedDetail" >
                    <el-card class="box-card">
                      <div slot="header" class="clearfix" style="text-align:left">
                        <span style="font-size:18px">药品明细:</span>
                      </div>
                      <div>
                        <el-table :data="medTable" style="width: 100%" border>
                          <el-table-column prop="medID" label="药品编码" style="width: 10%"></el-table-column>
                          <el-table-column prop="medName" label="药品名称" style="width: 10%"></el-table-column>
                          <el-table-column prop="medCode" label="药品助记码" style="width: 10%"></el-table-column>
                          <el-table-column prop="standard" label="药品规格" style="width: 10%"></el-table-column>
                          <el-table-column prop="remedy" label="药品剂型" style="width: 10%"></el-table-column>
                          <el-table-column prop="cost" label="单价" style="width: 20%" sortable> </el-table-column>
                          <el-table-column prop="unit" label="药品单位" style="width: 20%"> </el-table-column>
                          <el-table-column prop="type" label="药品类型" style="width: 10%"></el-table-column>
                        </el-table>
                      </div>
                    </el-card>
                  </el-col>
                </el-row>
              </el-tab-pane>

              <el-tab-pane label="建议方案">
                <el-row :gutter="12">
                  <el-col :span="5" >
                    <div style="text-align:center">
                      <el-table :data="patientTable" style="width: 100%">
                        <el-table-column label="相似发病患者病历号" style="width: 100%">
                          <template slot-scope="scope">
                            <el-popover trigger="hover" placement="top">
                              <p>患者名: {{ scope.row.name}}</p>
                              <p>疾病: {{ scope.row.illness }}</p>
                              <div slot="reference" class="name-wrapper">
                                <el-link @click="handlePatientClick(scope.row)" >{{scope.row.record_Id}}</el-link>
                              </div>
                            </el-popover>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </el-col>
                  <el-col :span="5" v-show="showlikePre" style="text-align: center">
                    <div style="text-align:center">
                      <el-card shadow="hover">
                        <el-table :data="likePre" style="width: 100%">
                          <el-table-column label="处方名" style="width: 100%">
                            <template slot-scope="scope">
                              <el-link @click="handleClick(scope.row)">{{scope.row.prescriptionName}}</el-link>
                            </template>
                          </el-table-column>
                        </el-table>
                      </el-card>
                    </div>
                  </el-col>
                  <el-col :span="14" v-show="showDetail" style="text-align: center">
                    <el-card class="box-card">
                      <div slot="header" class="clearfix" style="text-align:left">
                        <span style="font-size:18px">处方明细:</span>
                        <el-button style="float: right; padding: 3px 0" type="text" @click="showPatientDialog">使用该模版</el-button>
                      </div>
                      <div>
                        <el-table :data="PatientDetailTable" style="width: 100%" border>
                          <el-table-column prop="medName" label="药品名称" style="width: 10%"></el-table-column>
                          <el-table-column prop="Spec" label="规格" style="width: 10%"></el-table-column>
                          <el-table-column prop="price" label="单价" style="width: 10%" sortable></el-table-column>
                          <el-table-column prop="usage" label="用法" style="width: 10%"></el-table-column>
                          <el-table-column prop="dosage" label="用量" style="width: 20%"> </el-table-column>
                          <el-table-column prop="freq" label="频次" style="width: 20%"> </el-table-column>
                          <el-table-column prop="amount" label="数量" style="width: 10%"></el-table-column>
                        </el-table>
                      </div>
                      <el-dialog title="修改处方名"
                                 :visible.sync="patientDialogVisible"
                                 width="30%"
                                 :before-close="handlePatientClose">
                        <el-input placeholder="请输入处方名" v-model="inputPatientPrescription" clearable>
                        </el-input>
                        <span slot="footer" class="dialog-footer">
                                        <el-button @click="patientDialogVisible = false">取 消</el-button>
                                        <el-button type="primary" @click="uselikePatient">确 定</el-button>
                                      </span>
                      </el-dialog>
                    </el-card>
                  </el-col>
                </el-row>
              </el-tab-pane>

              <el-tab-pane label="历史处方">
                <el-row>
                  <el-col :span="10" >
                    <div style="text-align:left">
                      <el-tag style="font-size: 10px">名称:</el-tag>
                      <el-autocomplete
                          clearable
                          class="inline-input"
                          v-model.trim="inputHisPreName"
                          :fetch-suggestions="queryHistorySearch"
                          placeholder="请输入处方名"
                          :trigger-on-focus="false"
                          @select="handleHistorySelect"
                          style="width:150px;margin-left: 5px">
                      </el-autocomplete>
                    </div>
                    <div style="text-align:center">
                      <el-table :data="showPartHistoryTable" style="width: 60%">
                        <el-table-column label="最近历史处方名(点击查看详细信息)" style="width: 100%">
                          <template slot-scope="scope">
                            <el-link @click="handleHistoryClick(scope.row)" >{{scope.row.value}}</el-link>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </el-col>
                  <el-col :span="14" v-show="showHistoryDetail" >
                    <el-card class="box-card">
                      <div slot="header" class="clearfix" style="text-align:left">
                        <span style="font-size: 18px">处方明细:</span>
                        <el-button style="float: right; padding: 3px 0" type="text" @click="useHistoryDialogVisible">使用该处方</el-button>
                      </div>
                      <div>
                        <el-table :data="historyDetailTable" style="width: 100%" border>
                          <el-table-column prop="medName" label="药品名称" style="width: 10%"></el-table-column>
                          <el-table-column prop="Spec" label="规格" style="width: 10%"></el-table-column>
                          <el-table-column prop="price" label="单价" style="width: 10%" sortable></el-table-column>
                          <el-table-column prop="usage" label="用法" style="width: 10%"></el-table-column>
                          <el-table-column prop="dosage" label="用量" style="width: 20%"> </el-table-column>
                          <el-table-column prop="freq" label="频次" style="width: 20%"> </el-table-column>
                          <el-table-column prop="amount" label="数量" style="width: 10%"></el-table-column>
                        </el-table>
                      </div>
                      <el-dialog title="修改处方名"
                                 :visible.sync="historyDialogVisible"
                                 width="30%"
                                 :before-close="handleClose">
                        <el-input placeholder="请输入处方名" v-model="inputHistoryPrescription" clearable>
                        </el-input>
                        <span slot="footer" class="dialog-footer">
                                        <el-button @click="historyDialogVisible = false">取 消</el-button>
                                        <el-button type="primary" @click="usePrescription">确 定</el-button>
                                      </span>
                      </el-dialog>
                    </el-card>
                  </el-col>
                </el-row>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-tab-pane>
        <el-tab-pane name="草药处方" label="草药处方"></el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script type="text/javascript">

export default {
  inject:['reload'],
  components: {
  },
  name: 'ManagementFee',
  data () {

    return{
      page: '成药处方',
      message: '请选择患者',
      judgement:'西医诊断',
      disease:'腹痛',
      money:0,
      inputTemplateName:'',
      inputPrescriptionName:'',
      inputMedName:'',
      inputProjectName:'',
      inputPatientPrescription:'',
      inputHisPreName:'',
      inputHistoryPrescription:'',
      showTemplateEmpty: false,
      showTemplateDetail: false,
      showMedEmpty:false,
      showMedDetail:false,
      showHistoryDetail:false,
      showDetail: false,
      historyDialogVisible:false,
      showlikePre: false,
      patientDialogVisible:false,
      addVisible:false,
      deleteVisible:false,
      executeVisible:false,
      cancelVisible:false,
      addMedicineVisible:false,
      deleteMedicineVisible:false,
      restaurants:[],
      addTime:1,
      recipel: [{
        name: '',
        state:''
      }],
      currentRow: null,
      showTableData:[],
      tableData:[{
        prescriptionName:'',
        id:'',
        medName:'NaCl',
        Spec:'0.9g/100mL',
        price:50,
        usage:'静脉注射',
        dosage:'100ml',
        freq:'1日1次',
        amount:1,
      }],
      tableDataSelection:[],
      showTemplateTable:[{
        tempName:'春季常发性感冒',
        range:'',
      }],
      partTemplateTable:[{
        value:'春季常发性感冒',
        range:'全院',
      }],
      templateTable:[{
        id:'',
        medId:'',
        value:'春季常发性感冒',
        userange:'全院',
        medName:'',
        standard:'',
        cost:'',
        useage:'',
        consumption:'',
        frequency:'',
        number:'',
      }],
      templateDetailTable:[{
        id:'',
        tempName:'',
        medName:'',
        Spec:'',
        price:'',
        usage:'',
        dosage:'',
        freq:'',
        amount:'',
      }],
      commonMedTable:[{
        id:'',
        value:'',
        code:'',
        standard:'',
        cost:'',
        dosage:'',
        unit: '',
        type:''
      }],
      medTable:[{
        medID:'',
        medName:'',
        medCode:'',
        standard:'',
        cost:'',
        remedy:'',
        unit: '',
        type:''
      }],

      patientTable:[{
        name:'',
        record_Id:'',
        illness:'',
      }],
      PatientPreTable:[{
        id:'',
        medId:'',
        value:'春季常发性感冒',
        userange:'全院',
        medName:'',
        standard:'',
        cost:'',
        useage:'',
        consumption:'',
        frequency:'',
        number:'',
      }],
      likePre:[{
        prescriptionName:'a'
      }],
      PatientDetailTable:[{
        prescriptionName:'',
        id:'',
        medName:'',
        Spec:'',
        price:'',
        usage:'',
        dosage:'',
        freq:'',
        amount:'',
      }],

      showPartHistoryTable:[{
        value:'',
      }],
      partHistoryTable:[{
        value:'',
      }],
      historyPrescriptionTable:[{
        id:'',
        value:'',
        userange:'',
        medName:'',
        standard:'',
        cost:'',
        useage:'',
        consumption:'',
        frequency:'',
        number:'',
        medId:'',
      }],
      historyDetailTable:[{
        prescriptionName:'',
        id:'',
        medName:'NaCl',
        Spec:'0.9g/100mL',
        price:50,
        usage:'静脉注射',
        dosage:'100ml',
        freq:'1日1次',
        amount:1,
      }],

      medicineData:[{
        id:'',
        medicineName:'',
        medicineSpec:'',
        medicinePrice:0,
        medicineNumber:0,
      }],
      ruleForm: {
        usage:'',
        consumption:'',
        frequency:'',
      },
      rules: {
        usage: [
          { required: true, message: '请输入用法', trigger: 'blur' }
        ],
        consumption: [
          { required: true, message: '请输入用量', trigger: 'blur' }
        ],
        frequency: [
          { required: true, message: '请输入频次', trigger: 'blur' }
        ],
      }
    }
  },

  created: async function (){
    //this.userName =  this.$route.query.usrName;
    let i = 0;
    let _this = this;
    _this.disease = '...';
    _this.recipel = [];
    _this.projectData = [];
    _this.medicineData = [];
    _this.medTable = [];
    _this.detailData = [];
    _this.tableData = [];
    _this.showTemplateTable=[];
    _this.partTemplateTable=[];
    _this.templateDetailTable=[];
    _this.showTableData=[];
    _this.medTable = [];
    _this.showPartHistoryTable=[];
    _this.partHistoryTable=[];
    _this.historyDetailTable=[];
    _this.addTime = 1;
    _this.patientTable=[];
    if(this.$store.state.recordPid.length!==0){
      await axios.get("http://localhost:20910/getAllWMedConsume/"+this.$store.state.recordPid+"/"+this.$store.state.docId+"/"+this.$store.state.time).then(function (resp){
        for(let item of resp.data){
          if(_this.recipel.length===0||item.value!==_this.recipel[_this.recipel.length-1].name){
            _this.recipel.push({
              'name':item.value,
              'state':item.userange,
            })
          }
          _this.tableData.push({
            'prescriptionName':item.value,
            'id':item.medId,
            'medName':item.medName,
            'Spec':item.standard,
            'price':item.cost,
            'usage':item.userange,
            'dosage':item.consumption,
            'freq':item.frequency,
            'amount':item.number,
          });
        }
      });
      axios.get("http://localhost:20910/findLikePatient/"+this.$store.state.id).then(function(resp){
        let i  = 0;
        while(i<resp.data.length){
          _this.patientTable.push({
            'record_Id':resp.data[i][0],
            'name':resp.data[i][1],
            'illness':resp.data[i][2],
            'register_id':resp.data[i][3],
          });
          i++;
        }
      });
    }
    while(i<this.tableData.length) {
      this.money = this.money + (parseFloat(this.tableData[i].price)*parseInt(this.tableData[i].amount));
      i++;
    }
    axios.get('http://localhost:20910/getAllWestMedicine').then(function (resp){
      _this.restaurants = resp.data;
    });
    axios.get("http://localhost:20910/getAllTemplate/"+this.$store.state.docId).then(function(resp){
      _this.templateTable = resp.data;
      let i = 0;
      let counter = 0
      while(i<_this.templateTable.length){
        if(_this.partTemplateTable.length===0||_this.templateTable[i].value!==_this.partTemplateTable[_this.partTemplateTable.length-1].value){
          _this.partTemplateTable.push({
            'value':_this.templateTable[i].value,
            'range':_this.templateTable[i].userange,
          })
          if(counter<2){
            _this.showTemplateTable.push({
              'tempName':_this.templateTable[i].value,
              'range':_this.templateTable[i].userange,
            })
          }
          counter++;
        }
        i++;
      }
    });
    axios.get("http://localhost:20910/findCommonMed/"+this.$store.state.docId).then(function(resp){
      _this.commonMedTable = resp.data;
    });
    axios.get("http://localhost:20910/getAllPrescription/"+this.$store.state.docId).then(function(resp){
      _this.historyPrescriptionTable = resp.data;
      let i = 0;
      let counter = 0
      while(i<_this.historyPrescriptionTable.length){
        if(_this.partHistoryTable.length===0||_this.historyPrescriptionTable[i].value!==_this.partHistoryTable[_this.partHistoryTable.length-1].value){
          _this.partHistoryTable.push({
            'value':_this.historyPrescriptionTable[i].value,
          })
          if(counter<2){
            _this.showPartHistoryTable.push({
              'value':_this.historyPrescriptionTable[i].value,
            })
          }
          counter++;
        }
        i++;
      }
    });
  },
  watch: {
    'tableDataSelection': function (){
      let p = 0;
      for( let item of this.tableDataSelection ){
        let m = 0;
        let r1 = 0;
        let r2 = 0;
        let n = 0;
        let i = 0;
        try{m+=(item.price+'').split(".")[1].length}catch(e){}
        try{m+=(item.amount+'').split(".")[1].length}catch(e){}
        try{r1 = ((parseInt((item.price+'').replace(".",""))*parseInt((item.amount+'').replace(".","")))/Math.pow(10,m)).toString().split(".")[1].length}catch(e){ r1=0 }
        try{r2 = p.toString().split(".")[1].length} catch(e){ r2=0 }
        n = (r1>=r2)? r1:r2;
        i = Math.pow(10,Math.max(r1,r2));
        p = ((parseInt((item.price+'').replace(".",""))*parseInt((item.amount+'').replace(".","")))/Math.pow(10,m)*i+p*i)/i.toFixed(n);
      }
      this.money = p;
    },
    'currentRow': function(){
      if(this.currentRow==null){
        this.showTableData = [];
      }
      else{
        this.showTableData = [];
        for(let item of this.tableData){
          if(item.prescriptionName===this.currentRow.name){
            this.showTableData.push({
              'prescriptionName':item.prescriptionName,
              'id':item.id,
              'medName':item.medName,
              'Spec':item.Spec,
              'price':item.price,
              'usage':item.usage,
              'dosage':item.dosage,
              'freq':item.freq,
              'amount':item.amount,
            });
          }
        }
      }
    },
    'recipel': function(){
      this.addTime = this.addTime>this.recipel.length? (this.addTime): (this.recipel.length+1);
    },
  },

  methods: {
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
    querySearch(queryString, cb) {
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

    resetPrescription(){
      this.inputPrescriptionName = '新增处方'+ this.addTime;
    },
    addPrescription(){
      if(this.$store.state.patientState==='已就诊'){
        this.$message({
          message:'该患者已就诊,只能查看',
          type:'error',
        })
      }
      else{
        this.addVisible=true;
        this.inputPrescriptionName='新增处方'+this.addTime;
      }
    },
    executeAddPrescription(){
      let flag = false;
      for(let item of this.recipel){
        if(item.name===this.inputPrescriptionName){
          flag=true;
          break;
        }
      }
      if(flag===true){
        this.$message({
          message:'存在相同处方名,新增失败',
          type:'error'
        });
      }
      else{
        this.addVisible = false;
        this.recipel.push({
          name:this.inputPrescriptionName,
          state:'暂存',
        });
        this.addTime++;
        this.$message({
          message:'新增处方成功',
          type:'success'
        });
      }
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    deletePrescription(){
      if(this.$store.state.patientState==='已就诊'){
        this.$message({
          message:'该患者已就诊,只能查看',
          type:'error',
        })
      }
      else if(this.currentRow===null){
        this.$message({
          message:'未选中任何项目',
          type:'warning',
        });
      }
      else if(this.currentRow.state!=='暂存'&&this.currentRow.state!=='已作废'){
        this.$message({
          message:'不能删除已开立项目,请选择作废该处方',
          type:'error',
        });
      }
      else{
        this.deleteVisible = true;
      }
    },
    confirmDelete(){
      let val = this.currentRow;
      if(val){
        this.recipel.forEach((v,i)=>{
          if(val.name === v.name){
            this.recipel.splice(i,1);
          }
        })
      }
      this.showTableData=[];
      if(val){
        this.tableData.forEach((v,i)=>{
          if(val.name === v.prescriptionName){
            this.tableData.splice(i,1);
          }
        })
      }
      this.$message({
        message:'删除成功',
        type:'success',
      });
    },
    executePrescription(){
      if(this.$store.state.patientState==='已就诊'){
        this.$message({
          message:'该患者已就诊,只能查看',
          type:'error',
        })
      }
      else if(this.currentRow!==null){
        if(this.currentRow.state!=='暂存'&&this.currentRow.state!=='已作废'){
          this.$message({
            message:'处方已开立',
            type:'error'
          });
        }
        else if(this.showTableData.length===0){
          this.$message({
            message:'处方内需要至少含一个药品才能开立',
            type:'warning'
          });
        }
        else{
          this.executeVisible=true;
          this.$message({
            message:'executePrescription',
            type:'success'
          });
        }
      }
      else{
        this.$message({
          message:'未选择开立处方',
          type:'warning'
        });
      }
    },
    async confirmExecute(){
      let date = new Date();
      let year = date.getFullYear(); // 年
      let month = date.getMonth() + 1; // 月
      let day = date.getDate(); // 日
      let hour = date.getHours();//小时
      let min = date.getMinutes();//分钟
      let sec = date.getSeconds();//秒
      let now =`${year}-${month}-${day} ${hour}:${min}:${sec}`;
      for(let item of this.showTableData){
        await axios.post("http://localhost:20910/savePrescription?recordId="+this.$store.state.recordPid
            +"&medName="+item.medName+"&price="+item.price+"&doc_id="+this.$store.state.docId+
            "&medNumber="+item.amount+"&time="+now+"&id="+item.id+"&prescription="+item.prescriptionName
            +"&usage="+item.usage+"&consumption="+item.dosage+"&frequency="+item.freq).then(function(resp){});
      }
      for(let item of this.recipel){
        if(item.name===this.currentRow.name){
          item.state='已开立';
        }
      }
      this.$message({
        message:'开立成功',
        type:'success'
      });
    },
    cancelPrescription(){
      if(this.$store.state.patientState==='已就诊'){
        this.$message({
          message:'该患者已就诊,只能查看',
          type:'error',
        })
      }
      else if(this.currentRow!==null&&this.currentRow.state==='已开立'){
        this.cancelVisible=true;
        this.$message({
          message:'cancelPrescription',
          type:'warning'
        });
      }
      else{
        this.$message({
          message:'该处方无法作废',
          type:'warning'
        });
      }
    },
    confirmCancel(){
      axios.post("http://localhost:20910/deletePrescription?recordId="+this.$store.state.recordPid
          +"&docId="+this.$store.state.docId+"&prescription="+this.currentRow.name)
          .then(function(resp){});
      this.$message({
        message:'作废成功',
        type:'success'
      });
      for(let item of this.recipel){
        if(item.name===this.currentRow.name){
          item.state='已作废';
        }
      }
    },
    refresh(){
      this.$message({
        message:'refresh',
        type:'success'
      });
      this.reload();
    },
    deleteMedicine(){
      if(this.$store.state.patientState==='已就诊'){
        this.$message({
          message:'该患者已就诊,只能查看',
          type:'error',
        })
      }
      else if(this.tableDataSelection===null||this.tableDataSelection.length===0){
        this.$message({
          message:'未选中任何药物',
          type:'error'
        });
      }
      if(this.currentRow.state!=='暂存'&&this.currentRow.state!=='已作废'){
        this.$message({
          message:'不能删除已开立项目内药品',
          type:'warning'
        });
      }
      else{
        this.deleteMedicineVisible=true;
      }
    },
    confirmDeleteMedicine(){
      let val = this.tableDataSelection;
      if(val){
        val.forEach((val)=>{
          this.tableData.forEach((v,i)=>{
            if(val.prescriptionName === v.prescriptionName
                &&val.medName === v.medName){
              this.tableData.splice(i,1);
            }
          })
          this.showTableData.forEach((v,i)=>{
            if(val.prescriptionName === v.prescriptionName
                &&val.medName === v.medName){
              this.showTableData.splice(i,1);
            }
          })
        })
      }
      this.$message({
        message:'删除成功',
        type:'success'
      });
    },
    addMedicine(){
      if(this.$store.state.patientState==='已就诊'){
        this.$message({
          message:'该患者已就诊,只能查看',
          type:'error',
        })
      }
      else if(this.currentRow==null){
        this.$message({
          message:'未选中任何处方',
          type:'error'
        });
      }
      else if(this.currentRow.state!=='暂存'){
        this.$message({
          message:'不能向已开立处方中添加药品',
          type:'warning'
        });
      }
      else if(this.showTableData.length===5){
        this.$message({
          message:'一个处方最多添加五种药品',
          type:'warning'
        });
      }
      else{
        this.addMedicineVisible=true;
        this.$message({
          message:'addMedicine',
          type:'success'
        });
      }
    },
    searchMedicine(){
      this.$message({
        message:'查询药品按钮',
        type:'warning'
      });
    },
    executeAddMedicine(){
      if(this.medicineData!==null&&this.medicineData.length!==0&&this.ruleForm.usage!==''
          &&this.ruleForm.consumption!==''&&this.ruleForm.frequency!==''){
        this.addMedicineVisible = false;
        for(let item of this.medicineData){
          this.tableData.push({
            'prescriptionName':this.currentRow.name,
            'id':item.id,
            'medName':item.medicineName,
            'Spec':item.medicineSpec,
            'price':item.medicinePrice,
            'usage':this.ruleForm.usage,
            'dosage':this.ruleForm.consumption,
            'freq':this.ruleForm.frequency,
            'amount':item.medicineNumber,
          });
          this.showTableData.push({
            'prescriptionName':this.currentRow.name,
            'id':item.id,
            'medName':item.medicineName,
            'Spec':item.medicineSpec,
            'price':item.medicinePrice,
            'usage':this.ruleForm.usage,
            'dosage':this.ruleForm.consumption,
            'freq':this.ruleForm.frequency,
            'amount':item.medicineNumber,
          });
        }
        this.inputProjectName='';
        this.medicineData=[];
        this.ruleForm.usage = '';
        this.ruleForm.consumption='';
        this.ruleForm.frequency='';
        this.$message({
          message:'添加成功',
          type:'success'
        });
      }
      else{
        this.$message({
          message:'存在未填写完整项目',
          type:'error'
        });
      }
    },
    queryTemplateSearch(queryString, cb) {
      let templateTables = this.partTemplateTable;
      let results = queryString ? templateTables.filter(this.createTemplateFilter(queryString)) : templateTables;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createTemplateFilter(queryString) {
      return (templateTable) => {
        return (templateTable.value.toLowerCase().indexOf(queryString.toLowerCase()) !==-1);
      };
    },
    handleTemplateSelect(item){
      this.templateDetailTable=[];
      for(let temp of this.templateTable){
        if(temp.value === item.value&&temp.userange===item.range){
          this.templateDetailTable.push({
            'id':temp.medId,
            'tempName':temp.value,
            'medName':temp.medName,
            'Spec':temp.standard,
            'price':temp.cost,
            'usage':temp.useage,
            'dosage':temp.consumption,
            'freq':temp.frequency,
            amount:temp.number,
          });
        }
      }
      this.showTemplateDetail=true;
    },
    searchTemplate() {
      if (this.inputTemplateName === '') {
        this.showTemplateEmpty=true;
        this.showTemplateDetail = false;
      } else {
        this.showTemplateEmpty=false;
        this.showTemplateDetail = true;
      }
    },
    handleTemplateClick(row) {
      this.templateDetailTable = [];
      for(let item of this.templateTable){
        if(item.value === row.tempName&&item.userange===row.range){
          this.templateDetailTable.push({
            'id':item.medId,
            'tempName':item.value,
            'medName':item.medName,
            'Spec':item.standard,
            'price':item.cost,
            'usage':item.useage,
            'dosage':item.consumption,
            'freq':item.frequency,
            amount:item.number,
          });
        }
      }
      this.showTemplateDetail = true;
    },

    searchMed(){
      if(this.inputMedName===''){
        this.showMedEmpty = true;
        this.showMedDetail = false;
      }
      else{
        this.showMedEmpty = false;
        this.showMedDetail = true;
      }
    },

    handleMedSelect(item){
      this.medTable=[];
      this.medTable.push({
        'medID':item.id,
        'medName':item.value,
        'medCode':item.code,
        'standard':item.standard,
        'cost':item.cost,
        'remedy':item.dosage,
        'unit': item.unit,
        'type':item.type,
      });
      this.showMedDetail=true;
    },
    handleMedClick(row) {
      this.medTable=[];
      this.medTable.push({
        'medID':row.id,
        'medName':row.value,
        'medCode':row.code,
        'standard':row.standard,
        'cost':row.cost,
        'remedy':row.dosage,
        'unit': row.unit,
        'type':row.type,
      });
      this.showMedDetail=true;
    },

    handlePatientClick(row){
      this.likePre=[];
      let _this = this;
      axios.get("http://localhost:20910/findPresWithPatient/"+row.record_Id+'/'+row.register_id)
          .then(function(resp){
            _this.PatientPreTable = resp.data;
            for(let item of _this.PatientPreTable){
              if(_this.likePre.length===0||_this.likePre[_this.likePre.length-1].prescriptionName!==item.value){
                _this.likePre.push({
                  'prescriptionName':item.value,
                });
              }
            }
          });
      this.showlikePre= true;
    },
    handleClick(row){
      this.PatientDetailTable = [];
      for(let item of this.PatientPreTable){
        if(item.value===row.prescriptionName){
          this.PatientDetailTable.push({
            'prescriptionName':item.value,
            'id':item.medId,
            'medName':item.medName,
            'Spec':item.standard,
            'price':item.cost,
            'usage':item.useage,
            'dosage':item.consumption,
            'freq':item.frequency,
            'amount':item.number,
          });
        }
      }
      this.showDetail= true;
    },
    showPatientDialog(){if(this.$store.state.patientState==='已就诊'){
      this.$message({
        message:'该患者已就诊,只能查看',
        type:'error',
      })
    }
    else{
        this.inputPatientPrescription = this.PatientDetailTable[0].prescriptionName;
        this.patientDialogVisible = true;
      }
    },
    uselikePatient(){
      let flag = false;
      for(let item of this.recipel){
        if(item.name ===this.inputPatientPrescription){
          flag=true;
          break;
        }
      }
      if(flag===true){
        this.$message({
          message:'存在相同处方名,新增失败',
          type:'error'
        });
      }
      else{
        this.recipel.push({
          'name':this.inputPatientPrescription,
          'state':'暂存',
        });
        for(let item of this.PatientDetailTable){
          this.tableData.push({
            'prescriptionName': this.inputPatientPrescription,
            'id':item.id,
            'medName':item.medName,
            'Spec':item.Spec,
            'price':item.price,
            'usage':item.usage,
            'dosage':item.dosage,
            'freq':item.freq,
            'amount':item.amount
          })
        }
        this.patientDialogVisible = false;
        this.$message({
          message:'使用该模板成功',
          type:"success"
        });
        this.inputPatientPrescription = '';
      }
    },
    handlePatientClose(){
      this.patientDialogVisible = false;
      this.inputPatientPrescription = '';
    },

    queryHistorySearch(queryString, cb) {
      let histories = this.partHistoryTable;
      let results = queryString ? histories.filter(this.createHisFilter(queryString)) : histories;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createHisFilter(queryString) {
      return (history) => {
        return (history.value.toLowerCase().indexOf(queryString.toLowerCase()) !==-1);
      };
    },
    handleHistorySelect(item){
      this.historyDetailTable = [];
      for(let history of this.historyPrescriptionTable){
        if(item.value===history.value){
          this.historyDetailTable.push({
            'prescriptionName':history.value,
            'id':history.medId,
            'medName':history.medName,
            'Spec':history.standard,
            'price':history.cost,
            'usage':history.useage,
            'dosage':history.consumption,
            'freq':history.frequency,
            'amount':history.number,
          });
        }
      }
      this.showHistoryDetail = true;
    },
    handleHistoryClick(row){
      this.historyDetailTable = [];
      for(let history of this.historyPrescriptionTable){
        if(row.value===history.value){
          this.historyDetailTable.push({
            'prescriptionName':history.value,
            'id':history.medId,
            'medName':history.medName,
            'Spec':history.standard,
            'price':history.cost,
            'usage':history.useage,
            'dosage':history.consumption,
            'freq':history.frequency,
            'amount':history.number,
          });
        }
      }
      this.showHistoryDetail = true;
    },
    useHistoryDialogVisible(){
      if(this.$store.state.patientState==='已就诊'){
        this.$message({
          message:'该患者已就诊,只能查看',
          type:'error',
        })
      }
      else{
        this.inputHistoryPrescription = this.historyDetailTable[0].prescriptionName;
        this.historyDialogVisible = true;
      }
    },
    usePrescription(){
      let flag = false;
      for(let item of this.recipel){
        if(item.name === this.inputHistoryPrescription){
          flag=true;
          break;
        }
      }
      if(flag===true){
        this.$message({
          message:'存在相同处方名,新增失败',
          type:'error'
        });
      }
      else{
        this.recipel.push({
          'name':this.inputHistoryPrescription,
          'state':'暂存',
        });
        for(let item of this.historyDetailTable){
          this.tableData.push({
            'prescriptionName': this.inputHistoryPrescription,
            'id':item.id,
            'medName':item.medName,
            'Spec':item.Spec,
            'price':item.price,
            'usage':item.usage,
            'dosage':item.dosage,
            'freq':item.freq,
            'amount':item.amount
          })
        }
        this.$message({
          message:'使用该模板成功',
          type:"success"
        });
        this.inputHistoryPrescription='';
        this.historyDialogVisible=false;
      }
    },
    handleClose(){
      this.inputHistoryPrescription='';
      this.historyDialogVisible=false;
    },


    handleSelect(item) {
      let flag = 0;
      let i = 0;
      while(flag===0&&this.tableData!==null&&i<this.tableData.length){
        if(this.tableData[i].prescriptionName===this.currentRow.name
            &&this.tableData[i].medName===item.value){
          flag=1;
        }
        i++;
      }
      i=0;
      while(flag===0&&this.medicineData!==null&&i<this.medicineData.length){
        if(this.medicineData[i].medicineName===item.value){
          flag=2;
        }
        i++;
      }
      if(((this.medicineData===null? 0:this.medicineData.length)+this.showTableData.length)===5){
        this.$message({
          message:'每个处方最多开5种药品',
          type:'warning'
        });
      }
      else if(flag===2){
        this.$message({
          message:'待添加项内有相同药品',
          type:'error'
        });
      }
      else if(flag===1){
        this.$message({
          message:'选中处方内有相同药品',
          type:'error'
        });
      }
      else{
        this.medicineData=[];
        this.medicineData.push({
          'id':item.id,
          'medicineName':item.value,
          'medicineSpec':item.standard,
          'medicinePrice':item.cost,
          'medicineNumber':0,
        })
      }
    },

    useTemplate(){
      if(this.$store.state.patientState==='已就诊'){
        this.$message({
          message:'该患者已就诊,只能查看',
          type:'error',
        })
      }
      else {
        let pre = '模版:' + this.templateDetailTable[0].tempName;
        let flag = false;
        for (let item of this.recipel) {
          if (item.name === pre) {
            flag = true;
            break;
          }
        }
        if (flag === true) {
          this.$message({
            message: '存在相同处方名,新增失败',
            type: 'error'
          });
        } else {
          this.recipel.push({
            'name': pre,
            'state': '暂存',
          });
          for (let item of this.templateDetailTable) {
            this.tableData.push({
              'prescriptionName': pre,
              'id': item.id,
              'medName': item.medName,
              'Spec': item.Spec,
              'price': item.price,
              'usage': item.usage,
              'dosage': item.dosage,
              'freq': item.freq,
              'amount': item.amount
            })
          }
          this.$message({
            message: '使用该模板成功',
            type: "success"
          });
        }
      }
    },

    handleSelectionChange(val) {
      this.tableDataSelection = val;
    },

    numberChange($event, row){
      this.$refs.multipleTable.toggleRowSelection(row,false);
      this.$refs.multipleTable.toggleRowSelection(row,true);
    },
    medNumberChange($event,row){
      this.$refs.multipleTable.toggleRowSelection(row,false);
      this.$refs.multipleTable.toggleRowSelection(row,true);
      for(let item of this.tableData){
        if(item.prescriptionName===row.prescriptionName&&item.medName===row.medName){
          item.amount = row.amount;
          break;
        }
      }
    },
    click(tab) {
      if (tab.name === '病历首页') {
        this.$router.push({path: '/Record'})
      } else if (tab.name === '成药处方') {
        this.$router.push({path: '/Wmedicine'});
      } else if (tab.name === '检查申请') {
        this.$router.push({path: '/Check'});
      } else if (tab.name === '检验申请') {
        this.$router.push({path: '/Test'});
      } else if (tab.name === '门诊确诊') {
        this.$router.push({path: '/Confirm'});
      } else if (tab.name === '处置申请') {
        this.$router.push({path: '/Treat'});
      }  else if (tab.name === '草药处方') {
        this.$router.push({path: '/Cmedicine'});
      }
    }
  }
}
</script>
