<template>
	<div id="app">
		<el-button type="primary" @click="getlist()">查询</el-button>
		<el-table :data="doctorlist" stripe style="width: 100%">
			<el-table-column prop="name" label="姓名" width="180" />
			<el-table-column prop="userType" label="用户类型" width="180" />
			<el-table-column prop="title" label="职称" />
			<el-table-column prop="deptName" label="科室名" />
			<el-table-column prop="deptType" label="科室类型" />
			<el-table-column prop="deptFunc" label="科室从属" />
			<el-table-column prop="regName" label="挂号等级" />
			<el-table-column align="right">
				<template #header>
					<el-input v-model="search.name" size="small" placeholder="Type to name" />
					<el-input v-model="search.userType" size="small" placeholder="Type to userType" />
					<el-input v-model="search.title" size="small" placeholder="Type to title" />
					<el-button size="small" @click="getbylist()">查询</el-button>
				</template>
				<template #default="scope">
					<el-button size="small" >Edit</el-button>
					<el-button size="small" type="danger" @click="deleteone(scope.row.docId)">Delete</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
	import axios from 'axios'
  import http from "@/axios/http";
	export default {
		name: "DoctorList",
		data() {
			return {
				search:{
					name:"",
					userType:"",
					title:""
				},
				doctorlist: [],
				newArray: [],
				AllArray: [],
			}
		},
		methods: {
			//查询所有医生
			getlist() {
				http.get("/doctors/")
					.then(response => {
						console.log(response.data)
						if (response.data.code == "SUCCESS") {
							this.doctorlist = response.data.data
							this.AllArray = response.data.data
						} else {
							this.$message.error("身份过期，请重新登录")
							this.$router.push("/")
						}
					})
			},
			//还未实现，根据要查的数据传键值对
			getbylist() {
				
				this.newArray=this.AllArray.filter(array => array.name.includes(this.search.name))

				this.newArray=this.newArray.filter(array => array.userType.includes(this.search.userType))

				this.newArray=this.newArray.filter(array => this.search.title==""||array.title!=null&&array.title.includes(this.search.title))

				this.doctorlist=this.newArray
				// axios.post("http://localhost:8000/doctors/",this.search)
				// .then(response => {
				// 	console.log(response.data)
				// 	if (response.data.code == "SUCCESS") {
				// 		this.doctorlist = response.data.data
				// 	} else {
				// 		this.$message.error("身份过期，请重新登录")
				// 		this.$router.push("/")
				// 	}
				// })
			},
			deleteone(id) {
				axios.delete("http://localhost:8000/doctors/"+id)
				.then(response => {
					console.log(response.data)
					if (response.data.code == "SUCCESS") {
						this.$message.success("删除成功")
						this.getlist()
					} else {
						this.$message.error(response.data.msg)
					}
				})
			},
		},
	}
</script>

<style scoped>

</style>
