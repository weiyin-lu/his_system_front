<template>
	<div id="app">
		<el-button type="primary" @click="getlist()">查询</el-button>
		<el-table :data="deptlist" stripe style="width: 100%">
			<el-table-column prop="deptName" label="科室名" width="180" />
			<el-table-column prop="deptType" label="科室类型" width="180" />
			<el-table-column prop="deptFunc" label="科室从属" width="180" />

			<el-table-column align="right">
				<template #header>
					<el-input v-model="search.deptName" size="small" placeholder="Type to deptName" />
					<el-input v-model="search.deptType" size="small" placeholder="Type to deptType" />
					<el-input v-model="search.deptFunc" size="small" placeholder="Type to deptFunc" />
					<el-button size="small" @click="getbylist()">查询</el-button>
				</template>
				<template #default="scope">
					<el-button size="small">Edit</el-button>
					<el-button size="small" type="danger" @click="deleteone(scope.row.deptId)">Delete</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
	import axios from 'axios'
	export default {
		name: "DeptList",
		data() {
			return {
				search: {
					deptName: "",
					deptType: "",
					deptFunc: ""
				},
				deptlist: [],
				newArray: [],
				AllArray: [],
			}
		},
		methods: {
			getlist() {
				axios.get("http://localhost:8000/dept/")
					.then(response => {
						console.log(response.data)
						if (response.data.code == "SUCCESS") {
							this.deptlist = response.data.data
							this.AllArray = response.data.data
						} else {
							this.$message.error("身份过期，请重新登录")
							this.$router.push("/")
						}
					})
			},
			getbylist() {

				this.newArray = this.AllArray.filter(array => array.deptName.includes(this.search.deptName))

				this.newArray = this.newArray.filter(array => array.deptType.includes(this.search.deptType))

				this.newArray = this.newArray.filter(array => array.deptFunc.includes(this.search.deptFunc))

				this.deptlist = this.newArray
			},
			deleteone(id) {
				axios.delete("http://localhost:8000/dept/"+id)
				.then(response => {
					console.log(response.data)
					if (response.data.code == "SUCCESS") {
						this.$message.success("删除成功")
						this.getlist()
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
