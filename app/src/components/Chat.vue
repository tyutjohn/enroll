<template>
    <div class="chat" :style="height">
        <div class="chat-header">
            <p>在线聊天室</p>
            <el-divider></el-divider>
        </div>
        <div class="chat-main">
            <div class="main-user" :style="chatHeight" style="overflow:auto">
                <div v-for="(item,index) in userList" :key="item.phone">
                    <el-badge :value="item.mesStatus" class="badge-item">
                        <el-button style="width:100%;height:50px;border-radius:10px" @click="mainMessage(item,index)">
                            <el-avatar :src="useravatar" class="chat-useravatar">
                            </el-avatar>
                            {{item.name}}
                        </el-button>
                    </el-badge>
                </div>
            </div>
            <div class="main-message">
                <div class="message-icon" v-if="!MessageCompont">
                    <i class="el-icon-chat-line-round"></i>
                </div>
                <Message v-if="MessageCompont" :userList="userImfor" :room="room"/>
            </div>
        </div>
    </div>
</template>

<style>
    .chat {
        background: #ffffff;
        margin: 10px;
        margin-bottom: 0;
    }

    .chat-header p {
        font-size: 30px;
        font-weight: 600;
        margin-left: 10px;
        padding-top: 10px;
        color: rgb(156, 166, 176);
    }

    .chat-main {
        display: flex;
        justify-content: flex-start;
    }

    .main-user {
        width: 26%;
        background: #c1c3c51f;
        border-radius: 10px;
    }

    .main-message {
        width: 100%;
        background: #f0f8ff61;
    }

    .main-message textarea {
        border: none;
        border-top: 1px solid #DCDFE6;
    }

    .message-icon {
        font-size: 80px;
        margin-top: 20%;
        margin-left: 44%;
        color: #b2c2d06b;
    }

    .badge-item {
        width: 100%;
        margin-bottom: 2px;
    }

    .chat-useravatar {
        position: absolute;
        left: 10px;
        top: 4px;
        width: 40px !important;
        height: 40px !important;
    }

    .el-badge__content.is-fixed {
        top: 28px !important;
        right: 50px !important;
    }
</style>
<script>
    import Message from '../components/Message'
    import io from 'socket.io-client'
    const socket = io('http://localhost:3000/deviceInfo')
    const socketAll=io('http://localhost:3000/')
    export default {
        data() {
            return {
                height: { //自适应高度
                    height: document.body.scrollHeight - 80 + 'px'
                },
                chatHeight: {
                    height: document.body.scrollHeight - 200 + 'px'
                },
                MessageCompont: false, //Message组件开关
                MesStatus: 'new', //消息状态
                adminImfor: { //管理员身份id
                    name: '',
                    phone: ''
                },
                userList: [], //用户列表
                useravatar: require('../assets/userAvatar.jpg'), //用户头像
                userImfor: '', //用户详情
                room: {
                    name: '',
                    phone: ''
                }
            };
        },

        components: {
            Message
        },

        computed: {},

        mounted() {
            this.getUser()
            this.getUserList()
            this.ListenUserLogin()
        },

        methods: {
            //点击消息详情
            mainMessage(item,index) {
                this.MessageCompont = true
                this.userImfor = item
                this.userList[index].mesStatus=''
                this.room.name = this.adminImfor.name
                this.room.phone = this.userImfor.phone
            },
            //token验证获取用户信息
            getUser() {
                const token = sessionStorage.getItem("userToken");
                this.axios.get('/api/admin/current', {
                    headers: {
                        Authorization: token
                    }
                }).then(res => {
                    this.adminImfor.name = res.data.name
                    this.adminImfor.phone = res.data.phone
                    this.socketCon()
                })
            },
            //socket连接
            socketCon() {
                //socket通信
                socket.emit('clientMessage', this.adminImfor)
            },
            //获取用户list
            getUserList() {
                this.axios.get('/api/admin/userlist', {
                    headers: {
                        Authorization: sessionStorage.getItem('userToken')
                    }
                }).then(res => {
                    this.userList = res.data
                })
            },
            //监听是否新用户登录
            ListenUserLogin(){
                socketAll.on('socketmsg',data=>{
                    if(data){
                        this.getUserList()
                    }
                })
            }
        },
    }
</script>