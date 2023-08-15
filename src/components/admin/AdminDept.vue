<template>
	<div id="app">
		<!--  顶部导航条  -->
		<el-page-header :icon="null" @back="onback" style="padding: 20px;">
			<template #content>
				<div class="flex items-center">
					<el-avatar :size="32" class="mr-3" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
          <div style="float: right;height: 38px;line-height: 38px;margin-left: 20px;">
            <span class="text-large font-600 mr-3"> {{ user.name }} </span>
            <span class="text-sm mr-2" style="color: var(--el-text-color-regular);font-size: 14px;margin-left: 40px">
						{{ user.userType }}
					  </span>
          </div>

				</div>
			</template>
			<template #extra>
				<div class="flex items-center">
					<el-button type="primary" class="ml-2" @click="logout">退出</el-button>
				</div>
			</template>
		</el-page-header>

		<!--添加科室-->
		<el-button type="primary" @click="isaddshow = true">添加科室</el-button>

		<!--科室列表表格-->
		<el-table :data="deptlist" stripe style="width: 100%;height: 800px;">
			<!--  对应字段-->
			<el-table-column type="index" label="索引号码" width="180" />
			<el-table-column prop="deptId" label="科室编码" width="180" />
			<el-table-column prop="deptName" label="科室名称" width="180" />
			<el-table-column prop="deptType" label="科室类型" width="180" />
			<el-table-column prop="deptFunc" label="科室从属" width="180" />

			<el-table-column align="right">
				<template #header>
					<!-- 模糊搜索输入框 -->
					<el-autocomplete :fetch-suggestions="deptnameselect" style="width: 260px;" v-model="search.deptName" size="small" placeholder="科室名称" />
					<el-autocomplete :fetch-suggestions="depttypeselect" style="width: 260px;" v-model="search.deptType" size="small" placeholder="科室分类" />
					<el-autocomplete :fetch-suggestions="deptfuncselect" style="width: 260px;" v-model="search.deptFunc" size="small" placeholder="科室类型" />
					<el-button style="width: 100px;" size="small" @click="getbylist()">查询</el-button>
				</template>
				<template #default="scope">
					<!-- 获取这一行数据进行修改 -->
					<el-button size="small" @click="toupdateline(scope.row)">修改</el-button>
					<!-- 获取这一行id到后端删除 -->
					<el-button size="small" type="danger" @click="deleteone(scope.row.deptId)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 点击修改弹出修改框 -->
		<el-dialog v-model="isupshow" title="修改" width="30%" center>
			<el-form :model="updateline" label-position="right" label-width="100px" style="max-width: 460px">
				<el-form-item label="科室名" prop="deptName">
					<el-input v-model="updateline.deptName" />
				</el-form-item>
				<el-form-item label="科室类型" prop="deptType">
					<el-input v-model="updateline.deptType" />
				</el-form-item>
				<el-form-item label="科室从属" prop="deptFunc">
					<el-input v-model="updateline.deptFunc" />
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button type="primary" @click="updateone()">确定</el-button>
					<el-button @click="isupshow = false;">取消</el-button>
				</span>
			</template>
		</el-dialog>
		<!-- 点击添加弹出添加框 -->
		<el-dialog v-model="isaddshow" title="添加" width="30%" center>
			<el-form :model="addline" label-position="right" label-width="100px" style="max-width: 460px">
				<el-form-item label="科室名" prop="deptName">
					<el-input v-model="addline.deptName" />
				</el-form-item>
				<el-form-item label="科室类型" prop="deptType">
					<el-input v-model="addline.deptType" />
				</el-form-item>
				<el-form-item label="科室从属" prop="deptFunc">
					<el-input v-model="addline.deptFunc" />
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button type="primary" @click="addone()">确定</el-button>
					<el-button @click="isaddshow = false;">取消</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script>
	import http from "@/axios/http";
	export default {
		name: "AdminDept",
		data() {
			return {
        // 用户数据
        user:[],
				// 模糊查询输入框
				search: {
					deptName: "",
					deptType: "",
					deptFunc: ""
				},
				deptlist: [],
				// 模糊查询使用数组
				newArray: [],
				AllArray: [],
				// 修改框是否显示
				isupshow: false,
				updateline: [],
				// 添加框是否显示
				isaddshow: false,
				addline: {
					deptName: "",
					deptType: "",
					deptFunc: ""
				}
			}
		},
		mounted() {
      this.user=JSON.parse(sessionStorage.getItem("userinfo"))
			this.getlist()

		},
		methods: {
			getlist() {
				http.get("/depts/")
					.then(response => {
						// console.log(response.data)
						if (response.data.code === "SUCCESS") {
							this.deptlist = response.data.data
							this.AllArray = response.data.data
						} else {
							this.$message.error("身份过期，请重新登录")
							this.$router.push("/")
						}
					})
			},

			// 使用前端做的模糊查询
			getbylist() {

				this.newArray = this.AllArray.filter(array => array.deptName.includes(this.search.deptName))

				this.newArray = this.newArray.filter(array => array.deptType.includes(this.search.deptType))

				this.newArray = this.newArray.filter(array => array.deptFunc.includes(this.search.deptFunc))

				this.deptlist = this.newArray
			},

			// 传给后端id删除这一行
			deleteone(id) {
				this.$confirm('此操作将永久删除该科室, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					http.delete("/depts/" + id).then(response => {
						// console.log(response.data)
						if (response.data.code === "SUCCESS") {
							this.$message.success("删除成功")
							this.getlist()
						} else {
							this.$message.error(response.data.msg)
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				})
			},

			// 因赋值问题单独做的
			toupdateline(updateline) {
				this.isupshow = true
				/**
				 * 新开辟一段空间
				 * 因为前段引用类型数据会赋值地址
				 * 所以修改后不点击确定数据也会改变
				 * 但数据库中的数据不变
				 */
				this.updateline = JSON.parse(JSON.stringify(updateline))
			},

			// 修改后的值传入后端修改
			updateone() {
        if(this.addline.deptName.trim().length < 1 ||
            this.addline.deptType.trim().length < 1 ||
            this.addline.deptFunc.trim().length < 1 ){
          this.$message({
            type: 'error',
            message: '请完整填入信息！'
          });
        }else{
          http.put("/depts/update", this.updateline)
              .then(response => {
                if (response.data.code === "SUCCESS") {
                  this.$message.success("修改成功")
                  this.getlist()
                  this.isupshow = false
                } else {
                  this.$message.error(response.data.msg)
                }
              })
        }

			},

			// 添加数据传入后端添加
			addone() {
        if(this.addline.deptName.length < 1 || this.addline.deptName === " "||
            this.addline.deptType.length < 1 || this.addline.deptType === " "||
            this.addline.deptFunc.length < 1 ||this.addline.deptFunc === " "){
          this.$message({
            type: 'error',
            message: '请完整填入信息！'
          });
        }else{
          http.put("/depts/add", this.addline)
              .then(response => {
                // console.log(response.data)
                if (response.data.code === "SUCCESS") {
                  this.$message.success("添加成功")
                  this.getlist()
                  this.isaddshow = false
                } else {
                  this.$message.error(response.data.msg)
                }
                this.addline = {}
              })
        }
			},

      //点击输入框时提示科室名的值
      deptnameselect(queryString,cb) {
        this.newArray = this.AllArray.map(item=>{
          item.value = item.deptName;
          return item;
        });
        let results = queryString ? this.newArray.filter((name) => name.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0) : this.newArray;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },

      //点击输入框时提示科室分类的值
      depttypeselect(queryString,cb) {
        this.newArray = this.AllArray.map(item=>{
          item.value = item.deptType;
          return item;
        });
        // 去除数组中重复值
        this.newArray=this.newArray.filter((item,index) => this.newArray.findIndex(type => type.deptType === item.deptType) === index)

        let results = queryString ? this.newArray.filter((type) => type.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0) : this.newArray;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },

      //点击输入框时提示科室类型的值
      deptfuncselect(queryString,cb) {
        this.newArray = this.AllArray.map(item=>{
          item.value = item.deptFunc;
          return item;
        });
        // 去除数组中重复值
        this.newArray=this.newArray.filter((item,index) => this.newArray.findIndex(func => func.deptFunc === item.deptFunc) === index)
        //根据搜索框内字符串匹配
        let results = queryString ? this.newArray.filter((func) => func.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0) : this.newArray;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },

			// 退回管理页面
			onback() {
				this.$router.replace({
					path: '/admin'
				});
			},

			// 退出登录
			logout() {
				this.$confirm('确定退出？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					window.sessionStorage.removeItem("token");
          window.sessionStorage.removeItem("userinfo");
					this.$router.replace({
						path: '/'
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消退出'
					});
				});
			},
		},
	}
</script>

<style>
</style>
