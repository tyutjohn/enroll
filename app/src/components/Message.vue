<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>{{userList.name}}</span>
            </div>
            <div class="text item" :style="textHeight" style="overflow:auto" id="MesScrollHeight">
                <div style="display:flex;margin: 10px;" v-for="mes in messages"
                    :class="mes.charater?'message-right':'message-left'" :key="mes.index">
                    <el-button :type="mes.charater?'success':'primary'" plain
                        :class="mes.charater?'message-button':'message-button-left'">{{mes.message}}</el-button>
                    <el-avatar :src="mes.charater?adminInfo.avatar:avatarUser" class="message-avatar">
                    </el-avatar>
                </div>
            </div>
        </el-card>
        <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="textarea" resize='none' id="textarea"
            @keypress.enter.native="clickButton" style="padding-top:10px">
        </el-input>
        <div style="display:flex;justify-content: flex-end;margin-right:10px">
            <el-button type="info" plain @click="clickButton">发送</el-button>
        </div>
    </div>
</template>

<style>
    .text {
        font-size: 14px;
    }

    .item {
        margin-bottom: 18px;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }

    .box-card {
        width: 100%;
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
        props: ['userList', 'room'],
        data() {
            return {
                textHeight: {
                    height: document.body.scrollHeight - 480 + 'px'
                },
                textarea: '', //输入框
                adminInfo: '', //管理员信息
                messages: [], //消息内容
                avatarUser: require('../assets/userAvatar.jpg'), //用户头像
            };
        },

        computed: {

        },

        mounted() {
            this.getAdminInfo()
            this.roomSocket()
        },

        updated() {
            this.scorllToBottom()
        },

        methods: {
            //取得管理员信息
            getAdminInfo() {
                const token = sessionStorage.getItem("userToken");
                this.axios.get('/api/admin/current', {
                    headers: {
                        Authorization: token
                    }
                }).then(res => {
                    this.adminInfo = res.data
                })
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
            //加入room，进行通信
            roomSocket() {
                socket.emit('userLogin', this.room)
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
                let height = document.querySelector('#MesScrollHeight')
                height.scrollTop = height.scrollHeight
            }
        },
        watch: {
            //监听room对象，对象需要加deep:true
            room: {
                handler() {
                    this.roomSocket()
                },
                deep: true
            }
        }
    }
</script>