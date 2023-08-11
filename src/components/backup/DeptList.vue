<template>
	<div id="app">
		<el-button type="primary" @click="getlist()">查询</el-button>
		<el-button type="primary" @click="isaddshow = true">添加</el-button>
		<el-table :data="deptlist" stripe style="width: 100%">
			<el-table-column prop="deptName" label="科室名" width="180" />
			<el-table-column prop="deptType" label="科室类型" width="180" />
			<el-table-column prop="deptFunc" label="科室从属" width="180" />

			<el-table-column align="right">
				<template #header>
					<!-- 模糊搜索输入框 -->
					<el-input v-model="search.deptName" size="small" placeholder="Type to deptName" />
					<el-input v-model="search.deptType" size="small" placeholder="Type to deptType" />
					<el-input v-model="search.deptFunc" size="small" placeholder="Type to deptFunc" />
					<el-button size="small" @click="getbylist()">查询</el-button>
				</template>
				<template #default="scope">
					<!-- 获取这一行数据进行修改 -->
					<el-button size="small" @click="toupdateline(scope.row)">Edit</el-button>
					<!-- 获取这一行id到后端删除 -->
					<el-button size="small" type="danger" @click="deleteone(scope.row.deptId)">Delete</el-button>
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
	import axios from 'axios'
	export default {
		name: "DeptList",
		data() {
			return {
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
		methods: {
			getlist() {
				axios.get("http://localhost:8000/dept/")
					.then(response => {
						// console.log(response.data)
						if (response.data.code == "SUCCESS") {
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
				axios.delete("http://localhost:8000/dept/" + id)
					.then(response => {
						// console.log(response.data)
						if (response.data.code == "SUCCESS") {
							this.$message.success("删除成功")
							this.getlist()
						} else {
							this.$message.error(response.data.msg)
						}
					})
			},
			// 因赋值问题单独做的
			toupdateline(updateline) {
				this.isupshow=true
				/**
				 * 新开辟一段空间
				 * 因为前段引用类型数据会赋值地址
				 * 所以修改后不点击确定数据也会改变
				 * 但数据库中的数据不变
				*/
				this.updateline=JSON.parse(JSON.stringify(updateline))
			},
			// 修改后的值传入后端修改
			updateone() {
				axios.put("http://localhost:8000/dept/update", this.updateline)
					.then(response => {
						// console.log(response.data)
						if (response.data.code == "SUCCESS") {
							this.$message.success("修改成功")
							this.getlist()
							this.isupshow=false
						} else {
							this.$message.error(response.data.msg)
						}
					})
			},
			// 添加数据传入后端添加
			addone() {
				axios.post("http://localhost:8000/dept/add", this.addline)
					.then(response => {
						// console.log(response.data)
						if (response.data.code == "SUCCESS") {
							this.$message.success("添加成功")
							this.getlist()
							this.isaddshow=false
						} else {
							this.$message.error(response.data.msg)
						}
					})
			}
		},
	}
</script>

<style>
</style>
