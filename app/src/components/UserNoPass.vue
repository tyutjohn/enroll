<template>
    <div>
        <el-table ref="multipleTable" :data="usergetdata" tooltip-effect="dark" stripe border
            :style="height">
            <el-table-column type="index" :index="indexMethod">
            </el-table-column>
            <el-table-column label="姓名" width="80">
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
            <el-table-column label="校区" width="80">
                <template slot-scope="scope">{{ scope.row.campus }}</template>
            </el-table-column>
            <el-table-column label="电话" width="160">
                <template slot-scope="scope">{{ scope.row.phone }}</template>
            </el-table-column>
            <el-table-column label="部门" width="100">
                <template slot-scope="scope">{{ departmentname(scope.row.department) }}</template>
            </el-table-column>
            <el-table-column label="分数" width="80">
                <template slot-scope="scope">{{ scope.row.score }}</template>
            </el-table-column>
            <el-table-column label="面试官意见" width="140">
                <template slot-scope="scope">{{scope.row.evaluate}}</template>
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
        <div style=" text-align: center;margin:10px;">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="currentPage4" :page-sizes="[10,20,50,100]" :page-size="10"
                layout="total, sizes, prev, pager, next, jumper" :total="userleng">
            </el-pagination>
        </div>
    </div>
</template>
<style>

</style>

<script>
    export default {
        data() {
            return {
                multipleSelection: [], //选择框值
                usergetdata: [], //用户信息
                userleng: 0, //用户信息总数
                departdata: [], //部门列表
                department_id: '',
                currentPage4: 4, //页
                pageSize: '', //每页的条数
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
            //索引排序
            indexMethod(index) {
                return index + 1;
            },
            //获取全部信息
            infordata() {
                this.axios.get('api/user/nopass', {
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
            //选择各个部门报名的信息
            selectdiffdepart() {
                this.axios.get('/nopass/'+this.department_id, {
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
                if (this.judge) {
                    this.selectdiffdepart();
                } else {
                    this.infordata();
                }
            },
        },

        watch: {

        }

    }
</script>