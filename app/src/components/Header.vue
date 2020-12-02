<template>
  <div class="Header">
    <div class="header-container">
      <div class="flex header-left">
        <div style="display:flex;font-size:26px">
          <i class="el-icon-s-operation" style="margin:20px"></i>
          <el-input placeholder="搜索" suffix-icon="el-icon-search" v-model="search" style="margin-top:10px">
          </el-input>
        </div>
      </div>
      <div class="flex header-right">
        <div style="display:flex;font-size: 26px;">
          <i class="el-icon-chat-line-square" style="margin:20px;"></i>
          <el-dropdown style="margin-top:10px;">
            <el-button>
              <el-avatar :src="userImfor.userAvatarSrc" style="width:20px;height:20px;margin-right:6px;color:#606266">
              </el-avatar>
              {{userImfor.userName}}<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <p @click="myInfor()">我的资料</p>
              </el-dropdown-item>
              <el-dropdown-item>
                <p @click="dialogPassword=true">修改密码</p>
              </el-dropdown-item>
              <el-dropdown-item>
                <p @click="logOut()">退出登陆</p>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <!--我的资料-->
          <el-dialog title="我的资料" :visible.sync="dialogFormVisible">
            <el-form :model="form">
              <el-form-item label="昵称" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off" style="width:250px" disabled></el-input>
              </el-form-item>
              <el-form-item label="部门" :label-width="formLabelWidth">
                <el-input v-model="form.department" style="width:250px" disabled></el-input>
              </el-form-item>
              <el-form-item label="管理员等级" :label-width="formLabelWidth">
                <el-input v-model="form.rank" style="width:250px" disabled></el-input>
              </el-form-item>
              <el-form-item label="上传头像" :label-width="formLabelWidth">
                <div class="fileCover"><img :src="avatarSrc" @click="fileChange" style="width:100%;height:100%"></div>
                <input type="file" id="file" v-show="false" name="file" @change="fileUpdate($event)">
                <el-button style="margin-top:20px" size="small" type="success" @click="avatarUpload()" v-if="show">
                  确认上传</el-button>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogFormVisible=false">确 定</el-button>
            </div>
          </el-dialog>

          <!--修改密码-->
          <el-dialog title="修改密码" :visible.sync="dialogPassword">
            <el-form :model="formPass" status-icon :rules="rules" ref="formPass">
              <el-form-item label="新密码" :label-width="formLabelWidth" prop="password">
                <el-input v-model="formPass.password" style="width:300px"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" :label-width="formLabelWidth" prop="password2">
                <el-input v-model="formPass.password2" style="width:300px"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogPassword = false">取 消</el-button>
              <el-button type="primary" @click="userUpPwdPost()">确 定</el-button>
            </div>
          </el-dialog>

        </div>
      </div>
    </div>
  </div>
</template>
<style>
  .Header {
    width: 100%;
    height: 70px;
    background: #fff;
    position: absoulte;
    top: 0;
  }

  .header-container {
    width: 96%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
  }

  .header-left {
    width: 30%;
  }

  .header-right {
    width: 20%;
  }

  .fileCover {
    width: 100px;
    height: 80px;
    font-size: 100px;
    cursor: pointer;
  }
</style>

<script>
  import {
    Loading
  } from 'element-ui';
  export default {
    props: ['userImfor'],
    data() {
      var validatePass = (rule, value, callback) => { //验证密码
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.formPass.password !== '') {
            this.$refs.formPass.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => { //二次验证密码
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.formPass.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        search: '', //搜索
        dialogFormVisible: false, //我的资料开关
        form: { //我的资料表单
          name: '',
          department: '',
          rank: ''
        },
        formLabelWidth: '120px',
        avatarSrc: '', //上传头像
        file: '', //头像文件
        show: false, //上传按钮隐藏
        departData: [], //部门信息
        dialogPassword: false, //设置内嵌修改密码表单默认关闭
        formPass: { //修改密码
          password: '',
          password2: ''
        },
        rules: { //验证规则
          password: [{
            validator: validatePass,
            trigger: 'blur'
          }],
          password2: [{
            validator: validatePass2,
            trigger: 'blur'
          }]
        },
      };
    },
    mounted() {
      this.getDepart()
    },
    computed: {
      //动态部门
      departmentname() {
        return function (res) {
          if (res) { //如果存在，则计算
            return this.departData[res].department_name
          }
        }
      },
      //动态权限
      changeRank() {
        return function (res) {
          switch (res) {
            case 0:
              return '超级管理员'
            case 1:
              return '工作组管理员'
          }
        }
      }
    },
    methods: {
      getDepart() { //获取各部门信息
        this.axios.get('/api/depart', {
          headers: {
            'Authorization': sessionStorage.getItem('userToken')
          }
        }).then(res => {
          if (res.status == 200) {
            this.departData = res.data
          }
        }).catch(err => {
          if (err.response.status == 400) {
            this.$message.error(JSON.stringify(err.response.data))
          }
        })
      },
      //我的资料
      myInfor() {
        this.dialogFormVisible = true
        this.avatarSrc = this.userImfor.userAvatarSrc
        this.form.name = this.userImfor.userName
        this.form.department = this.departmentname(this.userImfor.department)
        this.form.rank = this.changeRank(this.userImfor.rank)
      },
      //退出登录
      logOut() {
        Loading.service({
          fullscreen: true,
          text: '退出成功'
        });
        sessionStorage.clear();
        setTimeout(() => {
          this.$router.push({
            path: '/Login'
          })
          Loading.service().close();
        }, 1000)
      },
      //更改头像
      fileChange() {
        document.querySelector('#file').click()
      },
      //点击更换头像事件
      fileUpdate(event) {
        let files = event.target.files[0]
        if (files.size > 1048567) {
          this.$message.error('选取头像大小应小于1M，请重新选择')
        } else {
          let render = new FileReader()
          render.readAsDataURL(files)
          render.onload = () => {
            this.file = files
            this.avatarSrc = render.result;
            this.show = true
          }
        }
      },
      //确认上传
      avatarUpload() {
        let phone = this.userImfor.phone
        let param = new FormData()
        param.append('file', this.file)
        this.axios.post('/api/admin/uploadAvatar/' + phone, param, {
          headers: {
            'Authorization': sessionStorage.getItem('userToken')
          }
        }).then(res => {
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '上传成功'
            })
          }
        }).catch(err => {
          if (err.response.status == 400) {
            this.$message.error(JSON.stringify(err.response.data))
          } else {
            this.$message.error(err.message)
          }
        })
      },
      userUpPwdPost() { //提交修改密码
        this.axios.post('/api/admin/password/' + this.userImfor.phone, this.formPass, {
          headers: {
            'Authorization': sessionStorage.getItem('userToken')
          }
        }).then(res => {
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: "修改密码成功"
            });
            this.dialogPassword = false;
          }
        }).catch(err => {
          if (err.response.status == 400) {
            this.$message.error(JSON.stringify(err.response.data))
          }
        })
      },
    }
  }
</script>