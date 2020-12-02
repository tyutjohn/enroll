<template>
    <div class="bg-admin">
        <div class="admin-container">
            <el-card class="box-card" style="background:rgba(243, 243, 243, 0.71)">
                <el-form :label-position="labelPosition" label-width="100px" :model="formlogin" style="width:100%">
                    <p class="form-p">超级管理员注册</p>
                    <el-form-item label="手机号码">
                        <el-input v-model="formlogin.phone" style="width:60%">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="昵称">
                        <el-input v-model="formlogin.name" style="width:60%">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input v-model="formlogin.password" style="width:60%" show-password>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="确认密码">
                        <el-input v-model="formlogin.password2" style="width:60%" @keyup.enter.native="super_register()"
                            show-password>
                        </el-input>
                    </el-form-item>
                    <el-button type="primary" class="button"
                        style="margin:0 auto;display:block;border-radius:20px;font-size:16px" @click="super_register()">
                        立即注册
                    </el-button>
                </el-form>
            </el-card>
        </div>
    </div>
</template>

<style>
    .bg-admin {
        background: url("../assets/superadmin.jpg") no-repeat center;
        background-size: 100% 100%;
        height: 100%;
        position: fixed;
        width: 100%;
    }

    .admin-container {
        width: 40%;
        margin: 0 auto;
        margin-top: 130px;
    }

    .form-p {
        color: rgb(103, 98, 98);
        font-size: 20px;
        font-weight: 600;
        letter-spacing: 8px;
        text-align: center;
        margin: 40px;
    }
</style>
<script>
    import {
        Loading
    } from 'element-ui'
    export default {
        data() {
            return {
                labelPosition: 'right',
                formlogin: {
                    phone: '', //注册号码
                    name: '', //昵称
                    password: '', //密码
                    password2: '', //确认密码
                }
            };
        },
        methods: {
            //注册超级管理员
            super_register() {
                this.axios.post('/api/admin/initialize',this.formlogin).then(res => {
                    if (res.status == 200) {
                        Loading.service({
                            fullscreen: true,
                            text: '注册成功，正在跳转'
                        });
                        setTimeout(() => {
                            this.$router.push({
                                path: '/Login'
                            })
                            Loading.service().close();
                        }, 2000)
                    } else {
                        this.$message.error(res.data)
                        setTimeout(() => {
                            Loading.service().close();
                        }, 1000)
                    }
                }).catch(err => {
                    if (err.response.status == 400) {
                        this.$message.error(JSON.stringify(err.response.data))
                    } else if (err.response.status == 404) {
                        this.$message.error(err.response.data)
                    } else {
                        this.$message.error(err.message)
                    }
                })
            }
        }
    }
</script>