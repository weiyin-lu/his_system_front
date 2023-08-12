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
          <el-button style="float: right; padding: 3px 0" type="text" @click="add();addResultVisible=true" :disabled="false">
            增加
          </el-button>
          <el-dialog title="增加诊断结果" :visible.sync="addResultVisible">
            <div style="text-align: center">
              <div>
                <el-tag style="width:70px">ICD编码:</el-tag>
                <el-input clearable v-model.trim="medrecord.icdCode" placeholder="请输入ICD编码" style="width: 300px
                ;margin-left: 20px"></el-input>
              </div>
              <div style="margin-top: 20px">
                <el-tag style="width: 70px">疾病名称:</el-tag>
                <el-autocomplete
                    class="inline-input"
                    v-model.trim="state1"
                    :fetch-suggestions="querySearch"
                    placeholder="请输入疾病名称"
                    :trigger-on-focus="false"
                    @select="handleSelect"
                    style="margin-left: 20px;width: 300px"
                ></el-autocomplete>
              </div>
              <div style="margin-top: 20px">
                <div class="block">
                  <el-tag style="width: 70px">发病时间:</el-tag>
<!--                  v-model.trim-->
                  <el-date-picker
                      type="datetime"
                      placeholder="选择日期时间"
                      style="margin-left: 20px;width: 300px">
                  </el-date-picker>
                </div>
              </div>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="addResultVisible = false">取 消</el-button>
              <el-button type="primary" @click="addResultVisible = false;executeAddDisease()">确 定</el-button>
            </div>
          </el-dialog>
          <el-button style="margin-right: 5px ;float: right; padding: 3px 0" type="text" @click="remove()" :disabled="false">
            删除
          </el-button>
          <el-divider></el-divider>
        </div>
        <div>
          <el-table
              ref="multipleTable"
              :data="showWestResultData"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange">
            <el-table-column
                type="selection"
                width="30">
            </el-table-column>
            <el-table-column
                prop="icd"
                label="ICD编码"
                width="320">
              <template slot-scope="scope">{{ scope.row.icd }}</template>
            </el-table-column>
            <el-table-column
                prop="icdname"
                label="名称"
                width="340">
            </el-table-column>
            <el-table-column
                prop="icdtime"
                label="发病时间"
                show-overflow-tooltip>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
      <el-row style="margin-left: 10px;margin-top: 20px">
        <el-tag style="width: 70px">检查建议:</el-tag>
        <el-input clearable v-model.trim="inputJianchajianyi" :disabled="false" placeholder="无" style="width: 500px;margin-left: 50px"></el-input>
      </el-row>
      <el-row style="margin-left: 10px;margin-top: 20px">
        <el-tag style="width: 70px">注意事项:</el-tag>
        <el-input clearable autosize v-model.trim="inputZhuyishixiang" :disabled="false" placeholder="无" style="width: 500px;margin-left: 50px"></el-input>
      </el-row>
      <el-row style="text-align: center;margin-top: 20px">
        <el-button  type="primary" icon="el-icon-circle-check" @click="commit">提交</el-button>
      </el-row>
</template>

<script>
import store from '@/store/index'

export default {
  name: "OutDoctorMedrecord",
  inject: ["reload"],
  data() {
    return {
      // 当前选择的病人信息，通过父级获得
      presentPatient: {},
    //   输入信息对象
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
      }
    }
  },
  created() {
    let info = JSON.parse(sessionStorage.getItem('userinfo'))
    let patient = this.$store.state.presentPatient
    this.medrecord.docId = info.docId
    this.medrecord.registerId = info.regId
    this.medrecord.recordId = patient.recordId
    this.presentPatient = patient
  }
}
</script>

<style scoped>

</style>