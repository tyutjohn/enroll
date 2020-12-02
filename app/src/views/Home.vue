<template>
    <div class="home">
        <div class="left flex" :style="height">
            <div style="display:flex;margin:10px">
                <img :src="logoSrc">
                <p class="logo-p">易班发展中心</p>
            </div>
            <div class="user" style="display:flex">
                <div class="flex">
                    <el-avatar :src="user.userAvatarSrc" class="userAvatar"></el-avatar>
                </div>
                <div class="flex">
                    <p style="color: aliceblue">Welcome</p>
                    <h1 class="userName">{{user.userName}}</h1>
                </div>
            </div>
            <div class="menu">
                <el-menu default-active="1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
                    background-color="#253e55" text-color="#fff" @select="componentMount">
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span>面试管理控制台</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item index="1-1">通知面试</el-menu-item>
                            <el-menu-item index="1-2">面试打分</el-menu-item>
                            <el-menu-item index="1-3">录取管理</el-menu-item>
                            <el-menu-item index="1-4">面试报名统计</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-submenu index="2">
                        <template slot="title">
                            <i class="el-icon-document"></i>
                            <span>录取管理控制台</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item index="2-1">已录取</el-menu-item>
                            <el-menu-item index="2-2">未录取</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-submenu index="3">
                        <template slot="title">
                            <i class="el-icon-chat-dot-round"></i>
                            <span>聊天室</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item index="3-1">在线聊天</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-submenu index="4" v-if="adminconsole">
                        <template slot="title">
                            <i class="el-icon-setting"></i>
                            <span>管理员控制台</span>
                        </template>
                        <el-menu-item index="4-1">管理员</el-menu-item>
                        <el-menu-item index="4-2">系统配置设置</el-menu-item>
                    </el-submenu>
                </el-menu>
            </div>
        </div>
        <div class="right flex">
            <Header :userImfor=user></Header>
            <div style="margin-top:10px">
                <router-view></router-view>
            </div>
            <Bottom />
        </div>
    </div>

</template>
<style>
    .home {
        width: 100%;
        height: 100%;
        display: flex;
    }

    .flex {
        justify-content: start;
    }

    .left {
        background: #253e55;
        width: 16%;
    }

    .right {
        background: #f1f2f4;
        width: 84%;
    }

    .logo-p {
        font-size: 20px;
        color: #fff;
        letter-spacing: 6px;
        margin-left: 10px;
        font-weight: 600;
        margin-top: 16px;
    }

    .user {
        width: 100%;
        height: 100px;
    }

    .userAvatar {
        margin: 10px 40px;
        margin-right: 30px;
        width: 50px !important;
        height: 50px !important;
    }

    .userName {
        font-size: 30px;
        color: #f1f2f4;
    }
</style>

<script>
    import Header from '../components/Header'
    import Bottom from '../components/Bottom'
    export default {
        data() {
            return {
                height: {
                    height: document.body.scrollHeight + 'px'
                },
                logoSrc: require('../assets/logo.png'),
                user: {
                    userAvatarSrc: '',
                    userName: '',
                    phone: '',
                    department:'',
                    rank:''
                },
                isCompany: 'Editor',
                adminconsole: false, //超级管理员
                normalconsole: false, //普通管理员
            };
        },

        components: {
            Header,
            Bottom,
        },

        mounted() {
            this.getUser();
        },

        methods: {
            //token验证获取用户信息
            getUser() {
                const token = sessionStorage.getItem("userToken");
                this.axios.get('/api/admin/current', {
                    headers: {
                        Authorization: token
                    }
                }).then(res => {
                    this.user.userAvatarSrc = res.data.avatar
                    this.user.userName = res.data.name
                    this.user.phone = res.data.phone
                    this.user.department=res.data.department
                    this.user.rank=res.data.rank
                    if (res.data.rank == 0) this.adminconsole = true
                    if (res.data.rank == 1) this.normalconsole = true
                    //将grade权限存入sessionStorage
                    sessionStorage.setItem("userGrade", res.data.rank);
                    sessionStorage.setItem("userId", res.data.id);
                })
            },
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },
            //动态加载工作区组件
            componentMount(key) {
                switch (key) {
                    case '1-1':
                        this.$router.push('/UserInform');
                        break;
                    case '1-2':
                        this.$router.push('/UserInterView');
                        break;
                    case '1-3':
                        this.$router.push('/UserAdmission')
                        break
                    case '1-4':
                        this.$router.push('/Datavisual');
                        break;
                    case '2-1':
                        this.$router.push('/UserPass');
                        break;
                    case '2-2':
                        this.$router.push('/UserNoPass');
                        break;
                    case '3-1':
                        this.$router.push('/Chat')
                        break;
                    case '4-1':
                        this.$router.push('/Admin');
                        break;
                    case '4-2':
                        this.$router.push('/SysSetting');
                        break;
                }
            },
        },

        watch: {}

    }
</script>