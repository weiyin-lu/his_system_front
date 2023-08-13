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

    <!--添加医生-->
    <el-button type="primary" @click="isaddshow = true">添加医生</el-button>

    <!--医生列表表格-->
		<el-table :data="doctorlist" stripe style="width: 100%;height: 800px;">
			<el-table-column prop="name" label="用户名" width="180" />
			<el-table-column prop="userType" label="用户类型" width="180" />
			<el-table-column prop="title" label="职称" />
			<el-table-column prop="deptName" label="科室名" />
			<el-table-column prop="deptType" label="科室类型" />
			<el-table-column prop="deptFunc" label="科室从属" />
			<el-table-column prop="regName" label="挂号等级" />
			<el-table-column align="right">
				<template #header>
					<el-autocomplete :fetch-suggestions="doctornameselect" v-model="search.name" size="small" placeholder="用户名" />
					<el-autocomplete :fetch-suggestions="doctortypeselect" v-model="search.userType" size="small" placeholder="用户类型" />
					<el-autocomplete :fetch-suggestions="doctortitleselect" v-model="search.title" size="small" placeholder="职称" />
					<el-button size="small" @click="getbylist()">查询</el-button>
				</template>
				<template #default="scope">
					<el-button size="small" @click="toupdateline(scope.row)" >修改</el-button>
					<el-button size="small" type="danger" @click="deleteone(scope.row.docId)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

    <!-- 点击修改弹出修改框 -->
    <el-dialog v-model="isupshow" title="添加" width="30%" center>
      <el-form :model="updateline" label-position="right" label-width="100px" style="max-width: 460px">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="updateline.name" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="updateline.password" />
        </el-form-item>
        <el-form-item label="用户类型" prop="userType">
          <el-input v-model="updateline.userType" />
        </el-form-item>
        <el-form-item label="职称" prop="title">
          <el-input v-model="updateline.title" />
        </el-form-item>
        <el-form-item label="科室名" prop="deptName">
          <el-autocomplete style="width: 360px" :fetch-suggestions="deptnameselect" v-model="keshiline.deptName" @input="selectbykeshi" />
          <span>科室分类：{{keshiline.deptType}}</span>
          <span style="margin-left: 15px">科室类型：{{keshiline.deptFunc}}</span>

        </el-form-item>
        <el-form-item label="挂号等级" prop="regId">
          <el-autocomplete style="width: 360px" :fetch-suggestions="regnameselect" v-model="regline.regLevel" @input="selectbyreg" />
        </el-form-item>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button type="primary" @click="updateone">确定</el-button>
					<el-button @click="isupshow = false;">取消</el-button>
				</span>
      </template>
    </el-dialog>

    <!-- 点击添加弹出添加框 -->
    <el-dialog v-model="isaddshow" title="添加" width="30%" center>
      <el-form :model="addline" label-position="right" label-width="100px" style="max-width: 460px">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="addline.name" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addline.password" />
        </el-form-item>
        <el-form-item label="用户类型" prop="userType">
          <el-input v-model="addline.userType" />
        </el-form-item>
        <el-form-item label="职称" prop="title">
          <el-input v-model="addline.title" />
        </el-form-item>
        <el-form-item label="科室名" prop="deptName">
          <el-autocomplete style="width: 360px" :fetch-suggestions="deptnameselect" v-model="keshiline.deptName" @input="selectbykeshi" />
          <span>科室分类：{{keshiline.deptType}}</span>
          <span style="margin-left: 15px">科室类型：{{keshiline.deptFunc}}</span>

        </el-form-item>
        <el-form-item label="挂号等级" prop="regId">
          <el-autocomplete style="width: 360px" :fetch-suggestions="regnameselect" v-model="regline.regLevel" @input="selectbyreg" />
        </el-form-item>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button type="primary" @click="addone">确定</el-button>
					<el-button @click="isaddshow = false;">取消</el-button>
				</span>
      </template>
    </el-dialog>
	</div>
</template>

<script>
  import http from "@/axios/http";
	export default {
		name: "AdminDoctor",
		data() {
			return {

        // 用户数据
        user:[],

        // 模糊查询输入框
				search:{
					name:"",
					userType:"",
					title:""
				},

        // 用于显示的对象
				doctorlist: [],
        deptlist:[],
        reglist:[],

        // 用于方法调用的对象
				newArray: [],
				AllArray: [],

        // 修改框是否显示
        isupshow: false,
        updateline: {
          docId: "",
          password: "",
          name: "",
          userType:"",
          title:"",
          deptId:"",
          regId:""
        },

        // 添加框是否显示
        isaddshow: false,
        addline: {
          password: "",
          name: "",
          userType:"",
          title:"",
          deptId:"",
          regId:""
        },
        keshiline: {
          deptName: "",
          deptType: "",
          deptFunc: ""
        },
        regline: {
          regLevel: ""
        }

			}
		},

    mounted() {
      this.user=JSON.parse(sessionStorage.getItem("userinfo"))
      this.getdeptlist()
      this.getregisterlist()
      this.getlist()

    },

		methods: {

			//查询所有医生
			getlist() {
				http.get("/doctors/")
					.then(response => {
						// console.log(response.data)
						if (response.data.code == "SUCCESS") {
							this.doctorlist = response.data.data
							this.AllArray = response.data.data
						} else {
							this.$message.error("身份过期，请重新登录")
							this.$router.push("/")
						}
					})
			},

      //查询科室列表
      getdeptlist() {
        http.get("/depts/")
            .then(response => {
              // console.log(response.data)
              if (response.data.code === "SUCCESS") {
                this.deptlist = response.data.data
              } else {
                this.$message.error("身份过期，请重新登录")
                this.$router.push("/")
              }
            })
      },

      //查询科室列表
      getregisterlist() {
        http.get("/registers/")
            .then(response => {
              // console.log(response.data)
              if (response.data.code === "SUCCESS") {
                this.reglist = response.data.data
              } else {
                this.$message.error("身份过期，请重新登录")
                this.$router.push("/")
              }
            })
      },

			//模糊查询
			getbylist() {
				
				this.newArray=this.AllArray.filter(array => array.name.includes(this.search.name))

				this.newArray=this.newArray.filter(array => array.userType.includes(this.search.userType))

				this.newArray=this.newArray.filter(array => this.search.title === ""||array.title!=null&&array.title.includes(this.search.title))

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

      // 传给后端id删除这一行
			deleteone(id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          http.delete("/doctors/" + id).then(response => {
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

      // 添加数据传入后端添加
      addone() {
        if(this.addline.name.trim().length < 1||
            this.addline.userType.trim().length < 1||
          this.addline.deptId.length < 1||
            this.addline.password.length < 6){
          this.$message({
            type: 'error',
            message: '请完整填入信息！'
          });
        }else{
          http.put("/doctors/add", this.addline)
              .then(response => {
                // console.log(response.data)
                if (response.data.code === "SUCCESS") {
                  this.$message.success("添加成功")
                  this.getlist()
                  this.isaddshow = false
                } else {
                  this.$message.error(response.data.msg)
                }
              })
        }
      },

      // 点击修改按钮操作
      toupdateline(updateline) {
        this.updateline.docId=updateline.docId
        this.updateline.name=updateline.name
        this.updateline.userType=updateline.userType
        this.updateline.title=updateline.title
        this.keshiline.deptName=updateline.deptName
        this.regline.regLevel=updateline.regName
        this.selectbyreg(updateline.regName)
        this.selectbykeshi(updateline.deptName)

        this.isupshow = true

      },

      // 修改后的值传入后端修改
      updateone() {

        if(this.updateline.name.trim().length < 1||
            this.updateline.userType.trim().length < 1||
            this.updateline.deptId.length < 1||
            this.updateline.password.length < 6 ){
          this.$message({
            type: 'error',
            message: '请完整填入信息！'
          });
        }else{
          http.put("/doctors/update", this.updateline)
              .then(response => {
                // console.log(response.data)
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

      //点击输入框时提示用户名的值
      doctornameselect(queryString,cb) {
        this.newArray = this.AllArray.map(item=>{
          item.value = item.name;
          return item;
        });
        let results = queryString ? this.newArray.filter((name) => name.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0) : this.newArray;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },

      //点击输入框时提示用户类型的值
      doctortypeselect(queryString,cb) {
        this.newArray = this.AllArray.map(item=>{
          item.value = item.userType;
          return item;
        });
        // 去除数组中重复值
        this.newArray=this.newArray.filter((item,index) => this.newArray.findIndex(type => type.userType === item.userType) === index)

        let results = queryString ? this.newArray.filter((type) => type.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0) : this.newArray;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },

      //点击输入框时提示用户职称的值
      doctortitleselect(queryString,cb) {
        this.newArray = this.AllArray.map(item=>{
          item.value = item.title;
          return item;
        });
        // 去除数组中重复值
        this.newArray=this.newArray.filter((item,index) => this.newArray.findIndex(title => title.title === item.title) === index)
        //根据搜索框内字符串匹配
        let results = queryString ? this.newArray.filter((title) => title.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0) : this.newArray;
        // 调用 callback 返回建议列表的数据
        cb(results);
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

      //点击输入框时提示科室名的值
      regnameselect(queryString,cb) {
        this.newArray = this.reglist.map(item=>{
          item.value = item.regLevel;
          return item;
        });
        // 去除数组中重复值
        this.newArray=this.newArray.filter((item,index) => this.newArray.findIndex(type => type.regLevel === item.regLevel) === index)

        let results = queryString ? this.newArray.filter((name) => name.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0) : this.newArray;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },

      // 添加或修改的科室发生变化时
      selectbykeshi(deptName) {
        let newarray=this.deptlist.filter(array => array.deptName === deptName)
        if (newarray.length === 0) {
          this.keshiline.deptType=""
          this.keshiline.deptFunc=""
          this.addline.deptId=""
          this.updateline.deptId=""
        }else {
          this.keshiline.deptType=newarray[0].deptType
          this.keshiline.deptFunc=newarray[0].deptFunc
          this.addline.deptId=newarray[0].deptId
          this.updateline.deptId=newarray[0].deptId
        }
      },

      // 添加或修改的挂号等级发生变化时
      selectbyreg(regName) {
        let newarray=this.reglist.filter(array => array.regLevel === regName)
        if (newarray.length === 0) {
          this.addline.regId=""
          this.updateline.regId=""

        }else {
          this.addline.regId=newarray[0].regId
          this.updateline.regId=newarray[0].regId
        }
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
          })
        })
      },

		},
	}
</script>

<style scoped>

</style>
