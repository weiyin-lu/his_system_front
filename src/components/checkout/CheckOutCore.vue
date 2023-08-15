<template>
	<div>
		<el-row>
			<el-col :span="4" class="hhh" @click="menu">
				<div>
					<el-button style="height: 40px" icon="el-icon-s-home" type="primary">
            <el-icon><HomeFilled /></el-icon>
            主菜单
          </el-button>
				</div>
			</el-col>
			<el-col :span="16" class="hh">
				<div>欢迎来到患者检验科</div>
			</el-col>

      <el-col :span="4" class="hhh">
        <div>
          <el-popover placement="left" width="500" trigger="hover">
            <el-table :data="getDocInfo">
              <el-table-column width="100" prop="docId" label="医生编号"></el-table-column>
              <el-table-column width="100" prop="name" label="医生姓名"></el-table-column>
              <el-table-column width="100" prop="deptName" label="部门名称"></el-table-column>
              <el-table-column width="100" prop="userType" label="医生类别"></el-table-column>
              <el-table-column width="100" prop="title" label="医生级别"></el-table-column>
            </el-table>
            <template #reference>
              <el-button style="height: 40px"  slot="reference" type="primary" class="el-icon-user"><el-icon><User /></el-icon>你好！{{name1}}</el-button>
            </template>

          </el-popover>
        </div>
      </el-col>
		</el-row>


		<el-row style="margin-top: 40px">
			<el-col :span="6">
				<el-input clearable placeholder="请输入患者名称" v-model.trim="name" type="text" style="width: 80%"></el-input>
			</el-col>
			<el-col :span="6">
				<el-input clearable placeholder="请输入患者病历号" v-model.trim="keywords" type="text" style="width: 80%"></el-input>
			</el-col>
			<el-col :span="4">
				<el-button @click="search" type="primary"><el-icon><Search /></el-icon>查询</el-button>
			</el-col>
			<el-col :span="4">
				<el-button @click="refresh" type="primary"><el-icon><Refresh /></el-icon>刷新</el-button>
			</el-col>
			<el-col :span="4">
				<el-button @click="kong" type="primary"><el-icon><RefreshLeft /></el-icon>清空</el-button>
			</el-col>
		</el-row>


		<el-col :span="24">
			<div>
        <el-table :data="patientlist" border>
          <el-table-column prop="recordId" label="病历号" width="100"></el-table-column>
          <el-table-column prop="name" label="姓名" width="100"></el-table-column>

          <el-table-column label="操作" width="100" >
            <template #default="scope">
              <el-popover placement="right" :width="800" trigger="click">
                <template #reference>
                  <el-button style="margin-right: 16px" @click="selectbyrecordid(scope.row)">查看</el-button>
                </template>
                <el-table :data="consumelist">
                  <el-table-column prop="costName" label="项目名称" width="150"></el-table-column>
                  <el-table-column label="付费状态" width="100">
                    <template #default="scope">
                      {{scope.row.payment>0?"已付款":"未付款"}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="type" label="类型" width="150"></el-table-column>
                  <el-table-column prop="takeMed" label="检查状态" width="100">
                    <template #default="scope">
                      {{scope.row.payment===0?"未执行":scope.row.payment===1?"执行中":"已执行"}}
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="250">
                    <template #default="scope">
                      <el-button v-if="scope.row.takeMed===0" size="small" type="primary" @click="start(scope.row)">开始</el-button>
                      <el-button v-if="scope.row.takeMed===1" size="small" type="danger" @click="cancel(scope.row)">取消</el-button>
                      <el-button v-if="scope.row.takeMed===2" size="small" type="danger" disabled>成功</el-button>

                      <el-button size="small" type="primary" @click="insertTemp(scope.row)" style="margin-left: 5px" :disabled="scope.row.takeMed===0">录入</el-button>

                      <el-popover placement="right-start" title="检验结果" width="200" trigger="click" :content="scope.row.results">
                        <template #reference>
                          <el-button size="small" type="success" slot="reference" style="margin-left: 5px">信息</el-button>
                        </template>
                      </el-popover>
                    </template>
                  </el-table-column>
                </el-table>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column></el-table-column>
        </el-table>

        <el-dialog title="录入检查结果" v-model="inputVisible" width="40%">
          <el-input v-model.trim="checkdto.results" placeholder="请输入检查结果" style="width: 60%"></el-input>
          <el-button type="primary" @click="insertResults">确认</el-button>
          <el-button type="primary" @click="inputVisible=false">关闭</el-button>
        </el-dialog>

<!--				<el-table :data="tableData" border height="450px" style="margin-top: 50px">-->
<!--					<el-table-column prop="recordId" label="病历号" min-width="16%">-->
<!--					</el-table-column>-->
<!--					<el-table-column prop="name" label="姓名" min-width="16%">-->
<!--					</el-table-column>-->
<!--					<el-table-column prop="code" label="项目编号" min-width="16%">-->
<!--					</el-table-column>-->
<!--					<el-table-column prop="costName" label="项目名称" min-width="16%">-->
<!--					</el-table-column>-->
<!--					<el-table-column prop="payment" label="付费状态" min-width="16%">-->
<!--					</el-table-column>-->
<!--					<el-table-column prop="type" label="类型" min-width="16%">-->
<!--					</el-table-column>-->
<!--					<el-table-column prop="takeMed" label="检查状态" min-width="16%">-->
<!--					</el-table-column>-->
<!--					<el-table-column label="操作" min-width="24%">-->
<!--						<template slot-scope="scope">-->
<!--							<el-button v-if="scope.row.takeMed==='未执行'" size="mini" type="primary" @click="start(scope.row)">开始</el-button>-->
<!--							<el-button v-if="scope.row.takeMed==='执行中'" size="mini" type="danger" @click="cancel(scope.row)">取消</el-button>-->
<!--							<el-button v-if="scope.row.takeMed==='已执行'" size="mini" type="danger" disabled>成功</el-button>-->
<!--							<el-button size="mini" type="primary" @click="insertTemp(scope.row)" style="margin-left: 5px" :disabled="scope.row.takeMed==='未执行'">录入</el-button>-->
<!--							<el-dialog title="录入检查结果" :visible.sync="inputVisible" width="40%">-->
<!--								<el-input v-model.trim="result" placeholder="请输入检查结果" style="width: 60%"></el-input>-->
<!--								<el-button type="primary" @click="insertResults(scope.row)">确认</el-button>-->
<!--								<el-button type="primary" @click="inputVisible=false">关闭</el-button>-->
<!--							</el-dialog>-->
<!--							<el-popover placement="left-start" title="检验结果" width="200" trigger="click" :content="scope.row.results">-->
<!--								<el-button size="mini" type="success" slot="reference" style="margin-left: 5px">信息</el-button>-->
<!--							</el-popover>-->
<!--						</template>-->
<!--					</el-table-column>-->
<!--				</el-table>-->
			</div>
		</el-col>
	</div>
</template>

<script>
	import http from "@/axios/http"
  import {rowProps} from "element-plus";
  import {HomeFilled, Refresh, RefreshLeft, Search, User} from "@element-plus/icons-vue";
	export default {
		name: "CheckOutCore",
    components: {RefreshLeft, Refresh, Search, HomeFilled, User},
    computed: {
      rowProps() {
        return rowProps
      }
    },
		data() {
			return {
				name: '',
				name1: '',
				getDocInfo: [],
				temp: '',
				table: false,
        checkdto:{
          id:"",
          results: '',
        },

				outerVisible: false,
				inputVisible: false,
				// tableData: [],
        templist:{},
        consumelist:[],
        patientlist:[],
        AllPatientList:[],
				// nodroglist: [],
				keywords: '',
			}
		},
		mounted() {
			this.loadPatient()
			this.getDocInfoFuc()
		},
		methods: {
			  start(row){
			    console.log(row)
          http.get('/checkouts/start/'+row.id).then(response => {
            if (response.data.code === "SUCCESS") {
              this.$message.success("执行中")
              this.selectbyrecordid(row)
            } else {
              this.$message.error(response.data.msg)
            }
          })
			  },
      // 清空
			kong() {
				this.keywords = ''
				this.name = ''
			},
      // 获取用户信息
			getDocInfoFuc() {
				let item = sessionStorage.getItem("userinfo");
				this.getDocInfo[0] = JSON.parse(item)
				this.name1 = this.getDocInfo[0].name
			},

      // 获取数据
			loadPatient() {
				http.get('/checkouts/').then(response => {
					if (response.data.code === "SUCCESS") {
						this.patientlist = response.data.data
            this.AllPatientList = response.data.data
					} else {
						this.$message.error("身份过期，请重新登录")
						this.$router.push("/")
					}
				})
			},
      // 根据recordid获取数据
      selectbyrecordid(item) {
        http.get("/checkouts/"+item.recordId).then(response => {
          if (response.data.code === "SUCCESS") {
            this.consumelist = response.data.data
          } else {
            this.$message.error("身份过期，请重新登录")
            this.$router.push("/")
          }
        })
      },
      // 回到主菜单
			menu() {
				this.$router.push('/checkout')
			},
      // 刷新
			refresh() {
				this.keywords = ''
				this.name = ''
				this.loadPatient()
			},
      search() {
        let newArray = this.AllPatientList.filter(array => array.name.includes(this.name))
        newArray = newArray.filter(array => array.recordId.toString().includes(this.keywords))
        this.patientlist = newArray
      },
      insertTemp(row){
        console.log(row)
        this.checkdto.id=""
        this.checkdto.results = ''
        this.inputVisible=true
        this.templist=row
        this.checkdto.id=row.id
      },
      insertResults(){
        console.log(this.checkdto)
        http.put('/checkouts/',this.checkdto).then(response => {
          if (response.data.code === "SUCCESS") {
            this.$message.success("录入成功")
            this.inputVisible=false
          } else {
            this.$message.error(response.data.msg)
          }
        })
      },
      // cancel(row){
      //   this.$axios.post('http://localhost:20910/api/InspectUpdateTakeMed0/' + this.$store.state.docId + '/' + row.recordId + '/' + row.costName, {
      //     docId: this.$store.state.docId,
      //     recordId: row.recordId,
      //     costName: row.costName
      //   }).then(resp => {
      //     if (resp && resp.data.code === 200) {
      //       this.$message({
      //         message: '取消成功',
      //         type: 'success'
      //       })
      //       this.loadPatient()
      //     }
      //   })
      // },
		}
	}
</script>

<style>
	.hhh {
		background-color: #409EFF;
	}

	.hh {

		border: 5px solid #8c939d;
		background-color: #8c939d;
		height: 40px;
		color: white;

	}
</style>
