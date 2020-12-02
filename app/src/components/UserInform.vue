<!--
 * @Author: johnwang
 * @since: 2019-05-28 15:37:11
 * @lastTime: 2019-09-01 21:08:18
 * @LastAuthor: Do not edit
 * @Github: https://github.com/tyutjohn
 -->
<template>
    <div>
        <el-table ref="multipleTable" :data="usergetdata" tooltip-effect="dark" stripe border :style="height"
            @selection-change="handleSelectionChange">
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
                    <el-select v-model="department_id" placeholder="请选择查看的部门" @change="selectdiffdepart()">
                        <el-option v-for='(items,index) in departdata' :value='items.department_id' :key='index'
                            :label='items.department_name'>
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
        </el-table>
        <div class="bottom-top">
            <div style=" text-align: center;margin:10px;">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="currentPage4" :page-sizes="[10,20,50,100]" :page-size="10"
                    layout="total, sizes, prev, pager, next, jumper" :total="userleng">
                </el-pagination>
            </div>
        </div>
        <div class="main-bottom">
            <div class="bottom-left">
                <el-select v-model="smsConfig.TemplateCode" placeholder="请选择短信模板" @change="selectmodel($event)">
                    <el-option v-for="item in smsdata" :key="item.RequestId" :label="item.TemplateName"
                        :value="item">
                    </el-option>
                </el-select>
                <el-switch v-model="modelSwitch" active-color="#13ce66" inactive-color="rgb(236, 168, 168)"
                    inactive-text="自定义参数" style="margin:0 20px">
                </el-switch>
                <el-input type="textarea" :rows="1" placeholder="请输入自定义参数,如{'code':'1111'}" v-model="smsConfig.TemplateParam" style="width:300px"
                    v-if="!modelSwitch">
                </el-input>
                <el-date-picker v-model="smsConfig.TemplateParam" type="datetime" 
                placeholder="选择日期时间" 
                format="yyyy 年 MM 月 dd 日 HH 时 mm 分"
                value-format="yyyy年MM月dd日-HH:mm" v-if="modelSwitch">
                </el-date-picker>
            </div>
            <div style="float:right">
                <el-button @click="toggleSelection()">取消全部</el-button>
                <el-button type="primary" round style='margin-right:100px;' @click="sendSms()">发送
                </el-button>
            </div>
        </div>
    </div>
</template>
<style scoped>
    .el-table--border {
        padding-left: 20px;
        padding-top: 20px;
        padding-bottom: 20px;
    }

    .bottom-top {
        margin: 0 auto;
    }

    .bottom-left {
        margin: 20px auto;
        width: 90%;
        display: flex;
        justify-content: flex-start;
    }
</style>

<script>
    export default {
        data() {
            return {
                multipleSelection: [], //选择框值
                usergetdata: [], //用户信息
                userleng: 0, //用户信息总数
                departdata: [], //部门列表
                smsdata: [], //短信模板
                phones: '', //选中手机号
                EnrollTime: '', //报名时间
                department_id: '',
                currentPage4: 4, //页
                pageSize: 10, //每页的条数
                page: '', //选择页数
                judge: false, //判断全部还是分类
                height: { //自适应高度
                    height: document.body.scrollHeight - 282 + 'px',
                    width: '100%',
                    overflow: 'auto'
                },
                smsConfig: {
                    SignName: '', //签名
                    TemplateCode: '', //短信模板
                    PhoneNumbers: '', //手机号码
                    TemplateParam: '', //模板参数
                }, //发送短信配置
                modelSwitch: true, //模板开关
                selfconfig: '', //自定义模板参数
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
            this.departmentdata()
        },

        mounted() {
            this.getsmscode()
        },

        methods: {
            //取消全选
            toggleSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
            //选择框值
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //索引排序
            indexMethod(index) {
                return index + 1;
            },
            //获取全部信息
            infordata() {
                this.axios.get('/api/user/', {
                    headers: {
                        Authorization: sessionStorage.getItem('userToken')
                    },
                    params: {
                        pageSize: this.pageSize,
                        page: this.page
                    }
                }).then((res) => {
                    if (res.status == 200) {
                        this.usergetdata = res.data.userdata
                        this.userleng = res.data.len
                    }
                }).catch((response) => {
                    console.log(response);
                })
            },
            //获取部门配置
            departmentdata() {
                this.axios.get('/api/depart/', {
                    headers: {
                        'Authorization': sessionStorage.getItem('userToken')
                    }
                }).then(res => {
                    if (res.status == 200) {
                        this.departdata = res.data
                        this.infordata()
                    }
                }).catch(err => {
                    if (err.response.status == 400) {
                        this.$message.error(JSON.stringify(err.response.data))
                    }
                })
            },
            // //获取短信模板
            getsmscode() {
                this.axios.get('/api/sms/', {
                    headers: {
                        Authorization: sessionStorage.getItem('userToken')
                    },
                }).then((res) => {
                    this.smsdata = res.data;
                }).catch((response) => {
                    console.log(response);
                })
            },
            //选择短信模板
            selectmodel(val){
                this.smsConfig.SignName=val.SignName
                this.smsConfig.TemplateCode=val.TemplateCode
            },
            // //发送短信
            sendSms() {
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    if (this.multipleSelection.length == 1) {
                        this.smsConfig.PhoneNumbers = String(this.multipleSelection[i].phone)
                    } else {
                        let num = String(this.multipleSelection[i].phone) + ',';
                        this.smsConfig.PhoneNumbers += num;
                    }
                }
                if(this.modelSwitch){
                    this.smsConfig.TemplateParam="{'time':'"+this.smsConfig.TemplateParam+"'}"
                }
                this.axios.post('/api/sms/sendSms',this.smsConfig,{
                    headers: {
                        Authorization: sessionStorage.getItem('userToken')
                    },
                }).then((res) => {
                    if (res.status ==200) {
                        this.$message('短信发送成功');
                        this.infordata();
                    }
                }).catch(err => {
                    if (err.response.status == 400) {
                        this.$message.error(JSON.stringify(err.response.data))
                    }else{
                        this.$message.error(JSON.stringify(err.response.data))
                    }
                })
            },
            //选择各个部门报名的信息
            selectdiffdepart() {
                this.axios.get('api/user/department', {
                    headers: {
                        'Authorization': sessionStorage.getItem('userToken')
                    },
                    params: {
                        department: this.department_id,
                        page: this.page,
                        pageSize: this.pageSize
                    }
                }).then((res) => {
                    if (res.status == 200) {
                        this.usergetdata = res.data.userdata
                        this.userleng = res.data.len
                        this.judge = true;
                        console.log(this.usergetdata)
                    }
                }).catch((response) => {
                    console.log(response);
                })
            },
            //分页
            handleSizeChange(val) {
                this.pageSize = val;
                if (this.judge) {
                    this.selectdiffdepart();
                } else {
                    this.infordata();
                }
            },
            handleCurrentChange(val) {
                this.page = val - 1;
                // console.log(`当前页: ${val}`);
                if (this.judge) {
                    this.selectdiffdepart();
                } else {
                    this.infordata();
                }
            }
        },

        watch: {}

    }
</script>