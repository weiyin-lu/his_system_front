<template>
      <el-tag style="text-align: center;background-color: #409EFF;width: 800px;height: auto">
        <el-button id="commmit" type="primary" icon="el-icon-circle-check" style="margin-left: 60px" @click="commit">
          提交
        </el-button>
        <el-button id="clear" type="primary" icon="el-icon-delete-solid"  style="margin-left: 60px" @click="clear">
          清空
        </el-button>
        <el-button id="refresh" type="primary" icon="el-icon-refresh-right" style="margin-left: 60px" @click="refresh">
          刷新
        </el-button>
      </el-tag>

      <el-row style="text-align: left">
        <el-tag style="margin-left: auto;background-color: lightblue;color: white;margin-top: 15px">病史内容:</el-tag>
      </el-row>
      <el-row style="margin-left: 10px">
        <el-tag style="width: 70px">主诉:</el-tag>
        <el-input clearable v-model.trim="medrecord.complaint" :disabled="false"
                  placeholder="无" style="width: 500px;margin-left: 50px"></el-input>
      </el-row>
      <el-row style="margin-left: 10px;margin-top: 20px">
        <el-tag style="width: 70px">现病史:</el-tag>
        <el-input clearable v-model.trim="medrecord.curIll" :disabled="false"
                  placeholder="无" style="width: 500px;margin-left: 50px"></el-input>
      </el-row>
      <el-row style="margin-left: 10px;margin-top: 20px">
        <el-tag style="width: 70px">治疗情况:</el-tag>
        <el-input clearable v-model.trim="medrecord.curTreat" :disabled="false"
                  placeholder="无" style="width: 500px;margin-left: 50px"></el-input>
      </el-row>
      <el-row style="margin-left: 10px;margin-top: 20px">
        <el-tag style="width: 70px">既往史:</el-tag>
        <el-input clearable v-model.trim="medrecord.pastIll" :disabled="false"
                  placeholder="无" style="width: 500px;margin-left: 50px"></el-input>
      </el-row>
      <el-row style="margin-left: 10px;margin-top: 20px">
        <el-tag style="width: 70px">过敏史:</el-tag>
        <el-input clearable v-model.trim="medrecord.allergy" :disabled="false"
                  placeholder="无" style="width: 500px;margin-left: 50px"></el-input>
      </el-row>
      <el-row style="margin-left: 10px;margin-top: 20px">
        <el-tag style="width: 70px">体格检查:</el-tag>
        <el-input clearable v-model.trim="medrecord.phyExam" :disabled="false"
                  placeholder="无" style="width: 500px;margin-left: 50px"></el-input>
      </el-row>
      <el-divider></el-divider>
      <el-row style="text-align: left">
        <el-tag style="margin-left: auto;background-color: lightblue;color: white;margin-top: 15px">评估/诊断:</el-tag>
      </el-row>
      <el-card class="box-card" shadow="always">
        <div  class="clearfix" style="text-align: left">
          <span >诊断:</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="dialogVisible=true" :disabled="false">
            增加
          </el-button>
          <el-dialog title="增加诊断结果" v-model="dialogVisible" append-to-body>
            <div style="text-align: center">
              <div>
                <el-tag style="width:70px">ICD编码:</el-tag>
                <el-input clearable v-model.trim="medrecord.icdCode" @input="showIll"
                          placeholder="请输入ICD编码" style="width: 300px
                ;margin-left: 20px"></el-input>
              </div>
              <div>
                <p><b>疾病信息</b></p>
                <el-table :data="presentIll" style="width: 100%">
                  <el-table-column prop="illName" label="病名" />
                  <el-table-column prop="icdCode" label="编码" />
                  <el-table-column prop="illType" label="类型" />
                </el-table>
              </div>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </div>
          </el-dialog>
          <el-button style="margin-right: 5px ;float: right; padding: 3px 0" type="text" @click="remove" :disabled="false">
            删除
          </el-button>

          <el-divider />

        </div>
        <div>
          <el-table
              ref="presentIll"
              :data="presentIll"
              tooltip-effect="dark"
              style="width: 100%">
            <el-table-column
                type="selection"
                width="30">
            </el-table-column>
            <el-table-column
                prop="icdCode"
                label="ICD编码"
                width="320">
            </el-table-column>
            <el-table-column
                prop="illName"
                label="名称"
                width="340">
            </el-table-column>
            <el-table-column
                prop="illType"
                label="类型"
                width="340">
            </el-table-column>
          </el-table>
        </div>
      </el-card>
      <el-row style="margin-left: 10px;margin-top: 20px">
        <el-tag style="width: 70px">检查建议:</el-tag>
        <el-input clearable v-model.trim="medrecord.suggest" :disabled="false" placeholder="无"
                  style="width: 500px;margin-left: 50px"></el-input>
      </el-row>
      <el-row style="margin-left: 10px;margin-top: 20px">
        <el-tag style="width: 70px">注意事项:</el-tag>
        <el-input clearable autosize v-model.trim="medrecord.attention" :disabled="false" placeholder="无"
                  style="width: 500px;margin-left: 50px"></el-input>
      </el-row>
      <el-row style="text-align: center;margin-top: 20px">
        <el-icon color="#FFFFFF">
          <Select />
        </el-icon>
        <el-button type="primary" @click="commit">提交</el-button>
      </el-row>
</template>

<script>
import http from '@/axios/http'
import {Select} from "@element-plus/icons-vue";
export default {
  name: "OutDoctorMedrecord",
  components: {Select},
  inject: ["reload"],
  data() {
    return {
      // 当前选择的病人信息，通过父级获得
      presentPatient: null,
      // 所有疾病列表，查询获得
      illList:[],
      // 选中疾病列表，显示用
      presentIll:[],
      // 输入信息对象
      medrecord: {
        id: null,
        recordId: null,
        complaint: '',
        curIll: '',
        curTreat: '',
        pastIll: '',
        allergy: '',
        phyExam: '',
        icdCode: '',
        suggest: '',
        attention: '',
        docId:0,
        results:'',
        registerId: 0,
      },
      // 输入疾病对象
      ill: {
        illId: null,
        illName: '',
        icdCode: '',
        illType: '',
        illKind: ''
      },
    //   二级页显示标识
      dialogVisible: false
    }
  },
  // 1. 从sessionstorage获取userinfo信息，从store获取当前病人信息，写入到子组件对象里
  // 2. 查询一次medrecord表，如果recordId已经存在，把信息写入到当前页面的病人信息对象，但是如果presentPatient为空，就不查询
  // 3. 查询所有疾病列表存储到illList
  created() {
    // 1.
    let info = JSON.parse(sessionStorage.getItem('userinfo'))
    let patient = this.$store.state.presentPatient
    this.medrecord.docId = info.docId
    this.medrecord.registerId = info.regId
    this.medrecord.recordId = patient.recordId
    this.presentPatient = patient;
    // 2.
    if(this.presentPatient != null) {
      http.get('/outdoctors/'+ this.presentPatient.recordId)
          .then(response => {
            if (response.data.data != null) {
              this.medrecord = response.data.data
            }
          })
    }
    // 3.
    http.get('/ill/')
        .then(response => {
          this.illList = response.data.data
        })
  },
  methods: {
    // 刷新，重新调用一次查询
    refresh() {
      http.get('/outdoctors/'+ this.presentPatient.recordId)
          .then(response => {
            if (response.data.data != null) {
              this.medrecord = response.data.data
            }
          })
    },
    // 删除，把medrecord里的特定值设置为空
    clear() {
      this.medrecord.complaint = ''
      this.medrecord.curIll = ''
      this.medrecord.curTreat = ''
      this.medrecord.pastIll = ''
      this.medrecord.allergy = ''
      this.medrecord.phyExam = ''
      this.medrecord.icdCode = ''
      this.medrecord.suggest = ''
      this.medrecord.attention = ''
    },
    // 提交病例信息的修改
    commit() {
      http.post('/outdoctors/',this.medrecord)
          .then(response => {
            if(response.data.code == 'SUCCESS') {
              this.$message.success("填入成功")
            } else {
              this.$message.error("填入失败")
            }
          })
    },
    // 在dialog输入框改变时，展示病情信息
    showIll(value) {
      console.log(value)
      this.presentIll = this.illList.filter(item => {return item.icdCode == value})
    },
    // 删除确诊信息
    remove() {
      console.log("remove run")
      this.presentIll = []
      this.medrecord.icdCode = ''
    }
  }
}
</script>

<style scoped>

</style>