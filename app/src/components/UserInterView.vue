<template>
    <div>
        <el-table ref="multipleTable" :data="usergetdata" tooltip-effect="dark" stripe border
            @selection-change="handleSelectionChange" :style="height">
            <el-table-column type="index" :index="indexMethod">
            </el-table-column>
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column label="姓名" width="100">
                <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column label="性别" width="60">
                <template slot-scope="scope">{{ scope.row.sex }}</template>
            </el-table-column>
            <el-table-column label="专业" width="120">
                <template slot-scope="scope">{{ scope.row.major }}</template>
            </el-table-column>
            <el-table-column label="班级" width="90">
                <template slot-scope="scope">{{ scope.row.class }}</template>
            </el-table-column>
            <el-table-column label="校区" width="120">
                <template slot-scope="scope">{{ scope.row.campus }}</template>
            </el-table-column>
            <el-table-column label="电话" width="160">
                <template slot-scope="scope">{{ scope.row.phone }}</template>
            </el-table-column>
            <el-table-column label="志愿部门一" width="120">
                <template slot-scope="scope">{{ departmentname(scope.row.department) }}</template>
            </el-table-column>
            <el-table-column label="志愿部门二" width="120">
                <template slot-scope="scope">{{ departmentname(scope.row.department2) }}</template>
            </el-table-column>
            <el-table-column>
                <template slot="header">
                    <el-select v-model="department_id" placeholder="请选择查看的部门" @change="selectdiffdepart($event)">
                        <el-option v-for='(items,index) in departdata' :value='items.department_id' :key='index'
                            :label='items.department_name'>
                        </el-option>
                    </el-select>
                </template>
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" class="search"
                        @click="selEnrollButton(scope.row._id)">开始打分</el-button>
                    <el-button type="danger" icon="el-icon-brush" circle @click="enrollLoading(scope.row._id)">
                    </el-button>
                    <el-button type="warning" icon="el-icon-s-tools" circle @click="userAdjust(scope.row._id)">
                    </el-button>
                    <el-dialog :visible.sync="dialogFormVisible">
                        <div slot="title" class="dialog-title">面试打分控制台</div>
                        <div>
                            <el-button-group>
                                <el-button type="primary" icon="el-icon-edit" plain>{{userinformation.name}}的个人报名信息
                                </el-button>
                            </el-button-group>
                            <div class="flex">
                                <div class="flex-dir flex-left" style="width:220px">
                                    <ul class="user-ul">
                                        <li><i class="el-icon-user"
                                                style="margin-right: 6px;"></i>姓名:{{userinformation.name}}</li>
                                        <li><i class="el-icon-female"
                                                style="margin-right: 6px;"></i>性别:{{userinformation.sex}}</li>
                                        <li><i class="el-icon-reading"
                                                style="margin-right: 6px;"></i>专业:{{userinformation.major}}</li>
                                        <li><i class="el-icon-s-home"
                                                style="margin-right: 6px;"></i>班级:{{userinformation.class}}</li>
                                        <li><i class="el-icon-s-grid"
                                                style="margin-right: 6px;"></i>学号:{{userinformation.schoolNum}}</li>
                                        <li><i class="el-icon-school"
                                                style="margin-right: 6px;"></i>校区:{{userinformation.campus}}</li>
                                    </ul>
                                </div>
                                <div class="flex-dir flex-center" style="width:300px">
                                    <ul class="user-ul">
                                        <li><i class="el-icon-tickets"
                                                style="margin-right: 6px;"></i>第一志愿:{{departmentname(userinformation.department)}}
                                        </li>
                                        <li><i class="el-icon-document"
                                                style="margin-right: 6px;"></i>第二志愿:{{departmentname(userinformation.department2)}}
                                        </li>
                                        <li><i class="el-icon-s-order"
                                                style="margin-right: 6px;"></i>个人介绍:{{userinformation.introduce}}</li>
                                    </ul>
                                </div>
                                <div class="flex-dir flex-right" style="width:220px">
                                    <el-input type="number" placeholder="请输入分数" v-model="score" maxlength="100"
                                        show-word-limit clearable>
                                    </el-input>
                                    <div style="margin: 20px 0;"></div>
                                    <el-input type="textarea" placeholder="请输入评价" v-model="evaluate" maxlength="100"
                                        show-word-limit>
                                    </el-input>
                                </div>
                            </div>
                        </div>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="dialogFormVisible = false">取 消</el-button>
                            <el-button type="primary" @click="enrollScore(userinformation._id)">确 定</el-button>
                        </div>
                    </el-dialog>
                </template>
            </el-table-column>
        </el-table>
        <div style="text-align:center;margin:20px">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="currentPage4" :page-sizes="[10,20,50,100]" :page-size="10"
                layout="total, sizes, prev, pager, next, jumper" :total="userLeng">
            </el-pagination>
        </div>
    </div>
</template>
<style scoped>
    .search {
        margin-left: 10px;
    }

    .el-table--border {
        padding-left: 20px;
        padding-top: 20px;
    }

    .el-dialog__body {
        padding: 0;
    }

    .dialog-title {
        font-size: 20px;
        font-weight: 600;
        color: #1b7dd2;
    }

    .user-ul {
        list-style: none;
        font-size: 16px;
        color: #093f6f;
        font-weight: 500;
        letter-spacing: 2px;
    }

    .user-ul li {
        margin-top: 10px;
    }

    .el-button-group .el-button--primary {
        height: 34px;
    }

    .flex {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .flex-right {
        margin-right: 30px
    }

    .el-textarea__inner {
        height: 140px;
    }
</style>

<script>
    export default {
        data() {
            return {
                multipleSelection: [], //选择框值
                usergetdata: [], //用户信息
                userLeng: 0, //用户信息总数
                departdata: [], //部门列表
                department_id: '',
                dialogFormVisible: false, //对话框遮罩层是否开启
                formLabelWidth: '120px', //对话框大小
                userinformation: '', //用户个人信息
                score: '', //打分
                evaluate: '', //评价
                currentPage4: 4, //页
                pageSize: 10, //每页的条数
                page: '', //选择页数
                judge: false, //判断全部还是分类
                height: { //自适应高度
                    height: document.body.scrollHeight - 182 + 'px',
                    width: '100%',
                    overflow: 'auto'
                },
            };
        },

        components: {},

        computed: {
            //动态部门
            departmentname() {
                return function (res) {
                    if (res) { //如果存在，则计算
                        return this.departdata[res].department_name
                    }
                }
            },
        },

        beforeMount() {
            this.departmentdata();
        },

        mounted() {

        },

        methods: {
            //选择框值
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //索引排序
            indexMethod(index) {
                return index + 1;
            },
            //获取全部面试者信息
            enrollAll() {
                this.axios.get('/api/user/markSore', {
                    headers: {
                        Authorization: sessionStorage.getItem('userToken')
                    },
                    params: {
                        page: this.page,
                        pageSize: this.pageSize
                    }
                }).then((res) => {
                    if (res.status == 200) {
                        this.usergetdata = res.data.userdata
                        this.userLeng = res.data.len
                    }
                }).catch((response) => {
                    console.log(response);
                })
            },
            //获取部门配置
            departmentdata() {
                this.axios.get('/api/depart/', {
                    headers: {
                        Authorization: sessionStorage.getItem('userToken')
                    },
                }).then((res) => {
                    if (res.status == 200) {
                        this.departdata = res.data;
                        this.enrollAll()
                    }
                }).catch(err => {
                    if (err.response.status == 400) {
                        this.$message.error(JSON.stringify(err.response.data))
                    }
                })
            },
            //选择各个部门报名的信息
            selectdiffdepart(event) {
                this.axios.get('/api/user/markSore/' + event, {
                    headers: {
                        'Authorization': sessionStorage.getItem('userToken')
                    },
                    params: {
                        page: this.page,
                        pageSize: this.pageSize
                    }
                }).then((res) => {
                    if (res.status == 200) {
                        this.usergetdata = res.data.userdata
                        this.userLeng = res.data.len
                        this.judge = true;
                    }
                }).catch(err => {
                    if (err.response.status == 400) {
                        this.$message.error(JSON.stringify(err.response.data))
                    }
                })
            },
            //选择开始面试按钮
            selEnrollButton(event) {
                this.dialogFormVisible = true;
                this.axios.get('/api/user/person/' + event, {
                    headers: {
                        'Authorization': sessionStorage.getItem('userToken')
                    },
                }).then(res => {
                    if (res.status == 200) {
                        this.userinformation = res.data
                    }
                })
            },
            //面试评价和打分提交
            enrollScore(event) {
                this.axios.post('api/user/enrollScore/' + event, {
                    score: this.score,
                    evaluate: this.evaluate
                }, {
                    headers: {
                        'Authorization': sessionStorage.getItem('userToken')
                    },
                }).then(res => {
                    if (res.status == 200) {
                        this.enrollAll()
                        this.$message({
                            type: 'success',
                            message: '提交成功'
                        })
                        this.dialogFormVisible = false
                    }
                }).catch(err => {
                    if (err.response.status == 400) {
                        this.$message.error(JSON.stringify(err.response.data))
                    }
                })
            },
            //面试延迟
            enrollLoading(event) {
                this.$confirm('是否延迟该同学的面试?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.axios.post('/api/user/loading', {
                        _id: event
                    }, {
                        headers: {
                            'Authorization': sessionStorage.getItem('userToken')
                        },
                    }).then(res => {
                        if (res.status == 200) {
                            this.$message({
                                type: 'success',
                                message: res.data
                            })
                            this.enrollAll()
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消延迟面试'
                    })
                })
            },
            //转部门
            userAdjust(event) {
                this.$confirm('是否将此同学转至第二志愿面试?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.axios.post('/api/user/adjust', {
                        _id: event
                    }, {
                        headers: {
                            'Authorization': sessionStorage.getItem('userToken')
                        },
                    }).then(res => {
                        if (res.status == 200) {
                            this.$message({
                                type: 'success',
                                message: res.data
                            })
                            this.enrollAll()
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消调剂面试'
                    })
                })
            },
            //分页
            handleSizeChange(val) {
                this.pageSize = val;
                if (this.judge) {
                    this.selectdiffdepart();
                } else {
                    this.enrollAll();
                }
            },
            handleCurrentChange(val) {
                this.page = val - 1;
                if (this.judge) {
                    this.selectdiffdepart();
                } else {
                    this.enrollAll();
                }
            },
        },

        watch: {}

    }
</script>