<template>
	<div>
		<el-row>
			<el-col :span="4" class="hhh" @click="menu">
				<div>
					<el-button style="height: 40px" class="el-icon-s-home" type="primary">
						<el-icon>
							<HomeFilled />
						</el-icon>
						主菜单
					</el-button>
				</div>
			</el-col>
			<el-col :span="16" class="hh">
				<div>欢迎来到医技管理</div>
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
								</el-icon>
								你好！{{name1}}
							</el-button>
						</template>

					</el-popover>
				</div>
			</el-col>
		</el-row>

		<el-row style="margin-top: 40px">
			<el-col :span="5">
				<div>名称：<el-input v-model.trim="input" placeholder="请输入项目名称" style="width: 60%"></el-input>
				</div>
			</el-col>
			<el-col :span="5">
				<div>部门：<el-select v-model.trim="value0" placeholder="请选择">
						<el-option v-for="item in options" :key="item.deptId" :label="item.deptName" :value="item.deptId">
						</el-option>
					</el-select>
				</div>
			</el-col>
			<el-col :span="3">
				<div>
					<el-button class="el-icon-search" @click="search" type="primary">查询</el-button>
				</div>
			</el-col>
			<el-col :span="3">
				<div>
					<el-button class="el-icon-refresh" @click="refresh" type="primary">刷新</el-button>
				</div>
			</el-col>
			<el-col :span="3">
				<div>
					<el-button class="el-icon-news" type="primary" @click="formVisible=true">添加医技</el-button>
				</div>
			</el-col>
		</el-row>
		<el-col>

			<!--   医技信息-->
			<el-table :data="tableData" style="width: 100%;margin-top: 50px" border height="600px">
				<el-table-column prop="code" label="项目编码" min-width="15%">
				</el-table-column>
				<el-table-column prop="name" label="项目名称" min-width="15%">
				</el-table-column>
				<el-table-column prop="price" label="价格" min-width="15%">
				</el-table-column>
				<el-table-column prop="standard" label="标准" min-width="15%">
				</el-table-column>
				<el-table-column prop="deptId" label="部门" min-width="15%">
          <template #default="scope">
<!--            find函数只返回对错,不能直接用.属性名访问,加上问号变成三元后可访问-->
            {{deptlist.find(obj => obj.deptId === scope.row.deptId)?.deptName}}
          </template>
				</el-table-column>
				<el-table-column prop="subject" label="收费项目" min-width="15%">
				</el-table-column>

				<el-table-column label="操作" min-width="15%">
					<template #default="scope">
						<el-button size="default" type="danger" @click="handleDelete(scope.row)">删除</el-button>
						<el-button size="default" type="primary" @click="handleChange(scope.row)" style="margin-left: 5px">修改</el-button>
					</template>
				</el-table-column>
			</el-table>


			<!--   修改窗口-->
			<el-dialog v-model="outerVisible">
				<el-form :model="updateline" label-position="right" label-width="100px" style="max-width: 460px">
					<el-form-item prop="code" label="项目编码">
						<el-input v-model="updateline.code" />
					</el-form-item>
					<el-form-item prop="name" label="项目名称">
						<el-input v-model="updateline.name" />
					</el-form-item>
					<el-form-item prop="price" label="价格">
						<el-input v-model="updateline.price" />
					</el-form-item>
					<el-form-item prop="standard" label="标准">
						<el-input v-model="updateline.standard" />
					</el-form-item>
          <el-form-item prop="deptId" label="部门">
            <el-autocomplete style="width: 360px" :fetch-suggestions="deptnameselect" v-model="updatedeptName" @input="selectbykeshi" />

          </el-form-item>

					<el-form-item prop="subject" label="收费项目">
						<el-input v-model="updateline.subject" />
					</el-form-item>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button type="primary" @click="updateone">确定</el-button>
						<el-button @click="outerVisible = false;this.deptName=''">取消</el-button>
					</span>
				</template>
			</el-dialog>

			<!--  添加窗口-->
			<el-dialog v-model="formVisible">
				<el-form :model="addline" label-position="right" label-width="100px" style="max-width: 460px">
					<el-form-item prop="code" label="项目编码">
						<el-input v-model="addline.code" />
					</el-form-item>
					<el-form-item prop="name" label="项目名称">
						<el-input v-model="addline.name" />
					</el-form-item>
					<el-form-item prop="price" label="价格">
						<el-input v-model="addline.price" />
					</el-form-item>
					<el-form-item prop="standard" label="标准">
						<el-input v-model="addline.standard" />
					</el-form-item>
					<el-form-item prop="deptId" label="部门">
            <el-autocomplete style="width: 360px" :fetch-suggestions="deptnameselect" v-model="adddeptName" @input="selectbykeshi" />

          </el-form-item>
					<el-form-item prop="subject" label="收费项目">
						<el-input v-model="addline.subject" />
					</el-form-item>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button type="primary" @click="addone">确定</el-button>
						<el-button @click="formVisible = false;">取消</el-button>
					</span>
				</template>
			</el-dialog>
		</el-col>
	</div>
</template>

<script>
	import http from '@/axios/http'
	import {
		HomeFilled,
		User
	} from "@element-plus/icons-vue";

	export default {
		name: "MedicalTechManage",
		components: {
			User,
			HomeFilled
		},
		data() {
			return {
				tempTemplate: [],
				tempItem: [],
				type: '',
				storeMedName: [],
				temp: [],
				Medicine: [],
				NondrugData: [],
				title: '',
				info: '',
				table: false,
				tableData: [],
				Data: [],
				name: '',
				name1: '',
				getDocInfo: [],

        input: '',
        value0: '',
				value: '',



				//mynewvalue
				updateline: {},
				addline: {
          code: "",
          name: "",
          price: "",
          standard: "",
          deptId: "",
          subject: "",
				},
				//修改窗口
				outerVisible: false,
				//添加窗口
				formVisible: false,

        //科室列表
        deptlist:[],

        options: [],

        adddeptName:"",
        updatedeptName:"",


        AllData:[],
        newArray:[],
			}
		},
		mounted() {
			this.loadtable()
      this.getlist()
			this.getDocInfoFuc()
		},

		methods: {

      // 医技列表
			loadtable() {
				http.get('/checkouts/manage/').then(response => {
					// console.log(response.data)
					if (response.data.code === "SUCCESS") {
						this.tableData = response.data.data
            this.AllData = response.data.data
					} else {
						this.$message.error("身份过期，请重新登录")
						this.$router.push("/")
					}
				})
			},

      // 科室列表
      getlist() {
        http.get("/depts/")
            .then(response => {
              // console.log(response.data)
              if (response.data.code === "SUCCESS") {
                this.deptlist = response.data.data
                this.options = this.deptlist
              } else {
                this.$message.error("身份过期，请重新登录")
                this.$router.push("/")
              }
            })
      },

      search(){
        this.newArray=this.AllData.filter(array => array.name.includes(this.input))
        this.newArray=this.newArray.filter(array => array.deptId === this.value0 || this.value0 === '')

        this.tableData=this.newArray

      },


      refresh(){
        this.input=''
        this.value0=''
        this.value=''
      },

			// 回到主菜单
			menu() {
				this.$router.push('/checkout')
			},

      // 删除按钮点击后
			handleDelete(row) {
				this.$confirm('此操作将永久删除, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					http.delete('/checkouts/manage/' + row.id).then(response => {
						if (response.data.code === "SUCCESS") {
							this.$message.success("删除成功")
							this.loadtable()
						} else {
							this.$message.error(response.data.msg)
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					})
				})
			},

      // 用户信息
			getDocInfoFuc() {
				let item = sessionStorage.getItem("userinfo");
				this.getDocInfo[0] = JSON.parse(item)
				this.name1 = this.getDocInfo[0].name

			},

      // 点击修改按钮传值，打开窗口
			handleChange(row) {
				this.updateline = JSON.parse(JSON.stringify(row))
        this.updatedeptName = this.deptlist.find(obj => obj.deptId === row.deptId)?.deptName
				this.outerVisible = true
			},

			// 修改后的值传入后端修改
			updateone() {
				if (this.updateline.code.trim().length < 1 || this.updateline.name.trim().length < 1 ||
					this.updateline.price.toString().trim().length < 1 || this.updateline.standard.trim().length < 1 ||
					this.updateline.deptId.toString().trim().length < 1 || this.updateline.subject.trim().length < 1) {
					this.$message({
						type: 'error',
						message: '请完整填入信息！'
					});
				} else {
					http.put("/checkouts/manage/", this.updateline)
						.then(response => {
							// console.log(response.data)
							if (response.data.code === "SUCCESS") {
								this.$message.success("修改成功")
								this.loadtable()
								this.outerVisible = false

							} else {
								this.$message.error(response.data.msg)
							}
						})
				}
			},

      // 添加后的值传入后端添加
      addone() {
        if (this.addline.code.trim().length < 1 || this.addline.name.trim().length < 1 ||
            this.addline.price.toString().trim().length < 1 || this.addline.standard.trim().length < 1 ||
            this.addline.deptId.toString().trim().length < 1 || this.addline.subject.trim().length < 1) {
          this.$message({
            type: 'error',
            message: '请完整填入信息！'
          });
        } else {
          http.put("/checkouts/manage/", this.addline)
              .then(response => {
                // console.log(response.data)
                if (response.data.code === "SUCCESS") {
                  this.$message.success("添加成功")
                  this.loadtable()
                  this.formVisible = false

                  // 清空对象
                  this.adddeptName=""
                  Object.keys(this.addline).forEach(function (key) {
                    this[key] = ""
                  },this.addline)

                } else {
                  this.$message.error(response.data.msg)
                }
              })
        }
      },

      //点击输入框时提示科室名的值
      deptnameselect(queryString,cb) {
        this.newArray = this.deptlist.map(item=>{
          item.value = item.deptName;
          return item;
        });
        let results = queryString ? this.newArray.filter((name) => name.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0) : this.newArray;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },

      // 添加或修改的科室发生变化时
      selectbykeshi(deptName) {
        let newarray=this.deptlist.filter(array => array.deptName === deptName)
        if (newarray.length === 0) {
          this.addline.deptId=""
          this.updateline.deptId=""
        }else {
          this.addline.deptId=newarray[0].deptId
          this.updateline.deptId=newarray[0].deptId
        }
      },
		}
	}
</script>

<style scoped>
	.hhh {
		background-color: #409EFF;
		height: 40px;
	}

	.hh {

		border: 5px solid #8c939d;
		background-color: #8c939d;
		height: 40px;

	}
</style>
