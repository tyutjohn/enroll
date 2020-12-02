<template>
    <div class="bgg">
        <div class="inputinf">
            <span :style="top">登录</span>
            <label for="accont">登录账号</label>
            <el-input placeholder="请输入手机号码" v-model="formLabelAlign.phone" v-bind:style="style" name="accont" clearable
                @keyup.enter.native="nextFocus()">
            </el-input>
            <label for="pwd">密码</label>
            <el-input placeholder="请输入密码" v-model="formLabelAlign.password" show-password v-bind:style="style"
                name="pwd" @keyup.enter.native='login' id="password"></el-input>
            <el-button type="primary" plain :style="button" @click="login">登录→</el-button>
        </div>
        <div class="logo">
            <span>易班</span>
            <p>yiban.cn</p>
        </div>
        <div class="foot">
            <span>后台管理系统</span>
            <p>太原理工大学·易班发展中心</p>

        </div>
    </div>
</template>
<style scoped>
    .container {
        width: 60%;
        margin: 0 auto;
        margin-top: 200px;
    }

    .login {
        width: 100%;
    }

    .bgg {
        background: url('../assets/logoo.png')center;
        background-size: 130%;
        background-repeat: no-repeat;
        width: 100%;
        margin: 0 auto;
        height: 834px;
        position: relative;
    }

    .inputinf {
        position: absolute;
        top: 30%;
        left: 16%;
    }

    #app {
        margin: 0;
    }

    label {
        margin-top: 30px;
        color: grey;
        text-align: left;
        display: block;
        font-size: 15px;
    }

    .logo {
        position: absolute;
        right: 20%;
        color: #fff;
        top: 38%;

    }

    .logo span {
        font-size: 46px;
    }

    .logo p {
        margin: 0;
        margin-top: 10px;
    }

    .foot {
        position: absolute;
        right: 20%;
        color: #fff;
        bottom: 30%;
    }

    .foot span {
        font-size: 20px;
    }

    @media screen and (min-width: 768px) and (max-width: 1000px) {
        .foot {
            position: absolute;
            right: 16%;
            color: #fff;
            bottom: 30%;
        }

        .logo {
            position: absolute;
            right: 20%;
            color: #fff;
            top: 43%;

        }

        .logo span {
            font-size: 30px;
        }

        .logo p {
            margin: 0;
        }
    }
</style>
<script>
    import {
        Loading
    } from 'element-ui'
    export default {
        data() {
            return {
                formLabelAlign: {
                    phone: '',
                    password: '',
                },
                top: 'color:#6ba2fc;font-size:20px;display:block;text-align:left;',
                style: 'width:200px; display:block;margin-top:10px;',
                button: 'margin-top:20px;text-align:left;display:block'
            }
        },
        methods: {
            //登陆
            login() {
                this.axios.post('/api/admin/login', this.formLabelAlign).then(res => {
                    if (res.status == 200) {
                        Loading.service({
                            fullscreen: true,
                            text: '登陆成功，正在跳转'
                        })
                        setTimeout(() => {
                            //将用户名和token放入sessionStorage
                            sessionStorage.setItem("userName", res.data.name);
                            sessionStorage.setItem("userToken", res.data.token);
                            sessionStorage.setItem("isLogin", true);
                            //将信息存入vuex
                            this.$store.dispatch("setAdmin", res.data.name);
                            this.$store.dispatch('setUser',res.data.name)
                            this.$router.push({
                                path: '/Home'
                            })
                            Loading.service().close();
                        }, 1000);
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
                document.querySelector("#password").focus()
            }
        }
    }
</script>