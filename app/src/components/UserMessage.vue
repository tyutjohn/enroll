<template>
  <div class="usermessage">
    <el-card class="box-card">
      <div slot="header">
        <span style="font-size:20px;color:#5f54549c;font-weight: 600;">在线客服</span>
        <i class="el-icon-s-promotion" style="margin-left:10px;" :style="online"></i>
      </div>
      <div class="usermes-main" :style="height" style="overflow:auto" id="scrollHeight">
        <div style="display:flex;margin: 10px;" v-for="mes in messages"
          :class="mes.charater?'message-right':'message-left'" :key="mes.index">
          <el-button :type="mes.charater?'success':'primary'" plain
            :class="mes.charater?'message-button':'message-button-left'">{{mes.message}}</el-button>
          <el-avatar :src="mes.charater?avatarAdmin:avatarUser" class="message-avatar">
          </el-avatar>
        </div>
      </div>
    </el-card>
    <div class="usermes-footer">
      <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="textarea" resize='none' id="textarea"
        @keyup.enter.native="clickButton" style="padding-top:10px">
      </el-input>
      <div style="display:flex;justify-content: flex-end;margin-right:10px;margin-top:10px">
        <el-button type="info" plain @click="clickButton">发送</el-button>
      </div>
    </div>

    <el-dialog title="聊天室登录" :visible.sync="dialogFormVisible" width='90%' :fullscreen='fullscreen' :show-close='close'
      :center='center'>
      <el-form :model="form">
        <el-form-item label="昵称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" @keyup.enter.native="nextFocus()"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" :label-width="formLabelWidth">
          <el-input v-model="form.phone" autocomplete="off" id="phone" @keyup.enter.native='userLogin'></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="userLogin">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style>
  .usermessage .el-dialog.is-fullscreen {
    background: aliceblue;
  }

  .usermessage .el-dialog.is-fullscreen .el-dialog__header {
    margin-top: 150px
  }

  .usermessage .dialog-footer {
    position: absolute;
    right: 30px;
  }

  .usermes-main {
    background: #f4f4f45c;
  }

  .usermes-footer {
    width: 94%;
    position: absolute;
    bottom: 0;
    margin: 10px 10px 40px 10px;
  }

  .message-left {
    justify-content: flex-end;
    flex-direction: row-reverse;
  }

  .message-right {
    justify-content: flex-end;
  }

  .message-avatar {
    width: 30px !important;
    height: 30px !important;
  }

  .message-button {
    margin-right: 20px !important;
    position: relative;
    max-width: 46%;
    white-space: normal !important;
    line-height: 1.5 !important;
    letter-spacing: 1px;
  }

  .message-button::before {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    background: #f0f9eb;
    transform: rotate(45deg);
    right: -6px;
    top: 10px;
  }

  .message-button-left {
    margin-left: 20px !important;
    position: relative;
    max-width: 46%;
    white-space: normal !important;
    line-height: 1.5 !important;
    letter-spacing: 1px;
  }

  .message-button-left::before {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    background: #ecf5ff;
    transform: rotate(45deg);
    left: -6px;
    top: 10px;
  }
</style>
<script>
  import io from 'socket.io-client'
  const socket = io('http://localhost:3000/deviceInfo')
  export default {
    data() {
      return {
        online: { //上线判断
          color: ''
        },
        dialogFormVisible: true, //登录遮罩
        formLabelWidth: '80px',
        form: { //用户表单
          name: '',
          phone: ''
        },
        fullscreen: true, //单表遮罩
        close: false, //关闭按钮
        center: true, //表单居中
        height: { //自适应高度
          height: document.body.scrollHeight - 300 + 'px'
        },
        textarea: '', //消息
        messages: [], //消息内容,
        avatarUser: require('../assets/userAvatar.jpg'), //用户头像
        avatarAdmin: require('../assets/avter.png'), //管理员头像
      };
    },

    components: {},

    computed: {},

    mounted() {
      this.getAdmin()
      this.getMes()
    },

    updated() {
      this.scorllToBottom()
    },

    methods: {
      //判断管理员是否在线
      getAdmin() {
        this.axios.get('/api/user/chat').then(res => {
          if (res.data.Login) {
            this.online.color = '#1989faa3'
          } else {
            this.$message({
              type: 'warning',
              message: '当前客服未在线，有消息请留言'
            })
          }
        })
      },
      //用户登录
      userLogin() {
        this.axios.post('/api/user/saveuser', this.form).then(res => {
          if (res.status == 200) {
            this.socketAllRefresh()
            socket.emit('userLogin', this.form)
            this.dialogFormVisible = false
            socket.on('reMessage', data => {
              if (data) {
                this.getAdmin()
                this.$message({
                  type: 'success',
                  message: '管理员已上线'
                })
              }
            })
          }
        }).catch(err => {
          if (err.response.status == 400) {
            this.$message.error(JSON.stringify(err.response.data))
          } else if (err.response.status == 404) {
            this.$message.error(err.response.data.phone)
          } else {
            this.$message.error(err.message)
          }
        })
      },
      //回车焦点跳转
      nextFocus() {
        document.querySelector("#phone").focus()
      },
      //发送消息
      clickButton() {
        if (!this.textarea) {
          this.$message.error('不能发送空白消息')
          return
        }
        //socket发送mes
        socket.emit('sendMsg', this.textarea)
        let messageObj = {
          charater: true,
          message: this.textarea
        }
        this.messages.push(messageObj)
        this.textarea = ''
        document.querySelector('#textarea').value = ''
      },
      //接收消息
      getMes() {
        socket.on('receiveMsg', data => {
          let messageObj = {
            charater: false,
            message: data
          }
          this.messages.push(messageObj)
        })
      },
      //获取滚动条位置
      scorllToBottom() {
        let height = document.querySelector('#scrollHeight')
        height.scrollTop = height.scrollHeight
      },
      //通知server新用户上线，刷新userlist
      socketAllRefresh(){
        const socketAll=io('http://localhost:3000/')
        socketAll.emit('socketlogin','user login success')
      }
    }
  }
</script>