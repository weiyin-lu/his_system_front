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
                <el-drawer title="常用模板"
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
        </el-main>
    </el-container>
</template>

<script>
    export default {
      name: "OutDoctorCheckout",
      data() {
        return {
        }
      }
    }
</script>

<style scoped>

</style>
