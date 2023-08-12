<template>
  <el-container>
    <el-main >
      <el-row>
        <el-col :span="2" :offset="19">
          <div class="top">
            <el-image
              style="width: 40px; height: 40px;cursor: pointer;"
              :src="quitimg"
            @click="logout"></el-image>
          </div></el-col>
      </el-row>
      <el-row >
        <el-col :span="12" :offset="4" class="bd1">
          <div>
            <p style="font-size: 30px;text-indent:55%;text-align: left;">
              管理员管理
            </p>
          </div></el-col>
        <el-col :span="4" class="bd">
          <div class="quit" style="height: 100px">
            <el-image
              style="width: 80px; height: 80px;margin-top: 10px;margin-right: 10px"
              :src="mainmenu"></el-image>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16" :offset="4"  style="border-style: solid;border-width: 2px;border-top-width: 0;border-color: #00FFFF">
          <el-row style="margin-top: 60px;">
            <el-col :span="6" v-for="(fit,index) in fits1" :key="fit">
              <router-link :to="'/admin'+router1[index]">
                <div>
                  <el-image
                    style="width: 96px; height: 96px"
                    :src="url[index]"></el-image>
                  <br>
                  {{fit}}
                </div>
              </router-link>
            </el-col>
          </el-row>
          <el-row class="row1">
            <el-col :span="6" v-for="(fit,index) in fits2" :key="fit">
              <router-link :to="'/admin'+router2[index]">
                <div>
                  <el-image
                    style="width: 96px; height: 96px"
                    :src="url2[index]"></el-image>
                  <br>
                  {{fit}}
                </div>
              </router-link>
            </el-col>
          </el-row>
        </el-col>
      </el-row>

        <!--<span class="block" v-for="fit in fits" :key="fit" style="margin: 0 30px 0 0">
        <el-image
          style="width: 100px; height: 100px"
          :src="url"></el-image>
        </span>-->
    </el-main>
  </el-container>
</template>
  <script>
      export default {
          name: "AdminMain",
          data() {
              return {
                  fits1: ['常数管理','科室管理', '用户管理', '诊断目录管理'],
                  fits2: ['挂号级别管理','非药品收费项目管理','医生排班管理'],
                  router1:['','/dept','/doc',''],
                  router2:['/reg','',''],
                  url: [require('@/assets/常用参数.png'),
                        require('@/assets/科室.png'),
                        require('@/assets/用户图标.png'),
                        require('@/assets/首页项目诊断.png'),
                  ],
                  url2: [require('@/assets/医院挂号.png'),
                         require('@/assets/医疗账单医院费用门诊账单.png'),
                         require('@/assets/医生排班.png'),
                  ],
                  quitimg: require('@/assets/+退出.png'),
                  mainmenu: require('@/assets/扁平管理员图标.png')
              }
          },
          methods:{
              logout(){
                  this.$confirm('确定退出？', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                  }).then(() => {
                      window.sessionStorage.removeItem("user");
                      this.$router.replace({path: '/'})
                  }).catch(() => {
                      this.$message({
                          type: 'info',
                          message: '已取消退出'
                      });
                  });
              }
          }
      }
  </script>
<style>
  .top{
    text-align: left;
  }
  .bd1{
    border-style: solid;
    border-width: 2px;
    border-right-width: 0;
    border-color: #00FFFF;
  }
  .bd{
    border-style: solid;
    border-width: 2px;
    border-left-width: 0;
    border-color: #00FFFF;
  }
  .quit{
    text-align: right;
  }
  .row1{
    margin-top: 60px;
    margin-bottom: 60px;
  }
</style>
