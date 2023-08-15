<template>
	<el-row>
		<el-col :span="4" class="hhh" @click="menu">
			<div>
				<el-button style="height: 40px" icon="el-icon-s-home" type="primary">
					<el-icon>
						<HomeFilled />
					</el-icon>
					主菜单
				</el-button>
			</div>
		</el-col>
		<el-col :span="16" class="hh">
			<div>欢迎来到患者药房科</div>
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
						<el-button style="height: 40px" slot="reference" type="primary" class="el-icon-user">
							<el-icon>
								<User />
							</el-icon>你好！{{name1}}
						</el-button>
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
                <el-table-column prop="execute" label="检查状态" width="100">
                  <template #default="scope">
                    {{scope.row.execute===0?"未执行":"已执行"}}
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="250">
                  <template #default="scope">
                    <el-button v-if="scope.row.execute===0" size="small" type="primary" @click="start(scope.row)">发药</el-button>
                    <el-button v-if="scope.row.execute===1" size="small" type="primary" disabled>成功</el-button>

                    <el-button size="small" type="danger" @click="insertTemp(scope.row)" style="margin-left: 5px" :disabled="scope.row.execute===0">退药</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column></el-table-column>
      </el-table>
    </div>
  </el-col>
</template>

<script>
	import http from "@/axios/http";
  import {Refresh, RefreshLeft, Search} from "@element-plus/icons-vue";

	export default {
		name: "MedicineCore",
    components: {RefreshLeft, Refresh, Search},
		data() {
			return {
				getDocInfo: [],
				status: '确认发药',
				name: '',
				name1: '',
				num: 10,
				tableData: [],
				input: '',
				value1: '',
        keywords: '',


      //   mynewvalue
        patientlist:[],
        consumelist:[],
        AllPatientList:[],

			}
		},
		mounted() {
      this.loadPatient()

			this.getDocInfoFuc();
		},
		methods: {
      start(row){
        http.get('/medicines/start/'+row.id).then(response => {
          if (response.data.code === "SUCCESS") {
            this.$message.success("执行中")
            this.selectbyrecordid(row)
          } else {
            this.$message.error(response.data.msg)
          }
        })
      },
      insertTemp(row) {
        http.get('/medicines/back/'+row.id).then(response => {
          if (response.data.code === "SUCCESS") {
            this.$message.success("退药中")
            this.selectbyrecordid(row)
          } else {
            this.$message.error(response.data.msg)
          }
        })
      },

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

			change(index, row) {
				if (row.takeMed === 1) {
					this.status = '已发药'
					return 'danger'
				} else {
					this.status = '确认发药'
					return 'primary'
				}
			},
			handleChange(value) {

			},

      refresh() {
        this.keywords = ''
        this.name = ''
        this.loadPatient()
      },

      // 获取数据
      loadPatient() {
        http.get('/medicines/').then(response => {
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
        http.get("/medicines/"+item.recordId).then(response => {
          if (response.data.code === "SUCCESS") {
            this.consumelist = response.data.data
          } else {
            this.$message.error("身份过期，请重新登录")
            this.$router.push("/")
          }
        })
      },

			menu() {
        this.$router.push('/medicine')
			},

      search() {
        let newArray = this.AllPatientList.filter(array => array.name.includes(this.name))
        newArray = newArray.filter(array => array.recordId.toString().includes(this.keywords))
        this.patientlist = newArray
      },
		}
	}
</script>

<style scoped>
	.h {
		background-color: #409EFF;

	}

	.hhh {
		background-color: #409EFF;
	}

	.hh {

		border: 5px solid #8c939d;
		background-color: #8c939d;
		height: 40px;

	}
</style>
