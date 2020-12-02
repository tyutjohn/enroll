<template>
  <div>
    <el-tabs :tab-position="tabPosition" style="margin-left:20px;margin-top:40px">

      <el-tab-pane label="短信模板管理">
        <el-button type="warning" icon="el-icon-upload" class="Smsadd" plain @click="dialogSmsOnlineaddVisible=true">
          在线申请</el-button>
        <el-button type="primary" icon="el-icon-edit" class="Smsadd" @click="dialogSmsaddVisible = true">手动添加
        </el-button>
        <el-dialog title="手动添加短信模板" :visible.sync="dialogSmsaddVisible">
          <el-form :model="Smsaddform">
            <el-form-item label="短信签名" :label-width="formLabelWidth">
              <el-input v-model="Smsaddform.SignName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="模板编号" :label-width="formLabelWidth">
              <el-input v-model="Smsaddform.TemplateCode" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="模板描述" :label-width="formLabelWidth">
              <el-input v-model="Smsaddform.Remark" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogSmsaddVisible = false">取 消</el-button>
            <el-button type="primary" @click="SmsAddinfor()">确 定</el-button>
          </div>
        </el-dialog>
        <el-dialog title="在线添加短信模板" :visible.sync="dialogSmsOnlineaddVisible">
          <el-form :model="Smsaddform">
            <el-form-item label="短信类型" :label-width="formLabelWidth">
              <el-select v-model="Smsaddform.TemplateType" placeholder="请选择">
                <el-option label='验证码' value=0>验证码</el-option>
                <el-option label='短信通知' value=1>短信通知</el-option>
                <el-option label='推广信息' value=2>推广短信</el-option>
                <el-option label='国际/港澳台消息' value=3>国际/港澳台消息</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="模板名称" :label-width="formLabelWidth">
              <el-input v-model="Smsaddform.TemplateName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="模板内容" :label-width="formLabelWidth">
              <el-input v-model="Smsaddform.TemplateContent" autocomplete="off" placeholder='模板内容需要符合文本短信模板规范'
                type="textarea" :rows='2'></el-input>
            </el-form-item>
            <el-form-item label="短信模板申请说明" :label-width="formLabelWidth">
              <el-input v-model="Smsaddform.Remark" autocomplete="off" placeholder='请描述您的业务使用场景，100字以内' type='textarea'
                :rows='2'></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogSmsOnlineaddVisible = false">取 消</el-button>
            <el-button type="primary" @click="SmsAddinforOnline()">确 定</el-button>
          </div>
        </el-dialog>
        <el-table :data="SmsModeldata" style="width: 100%">
          <el-table-column label="模板名称" width="150">
            <template slot-scope="scope">
              <i class="el-icon-message"></i>
              <span style="margin-left: 10px">{{ scope.row.TemplateName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="模板编号" width="180">
            <template slot-scope="scope">
              <i class="el-icon-tickets"></i>
              <span style="margin-left: 10px">{{ scope.row.TemplateCode }}</span>
            </template>
          </el-table-column>
          <el-table-column label="模板内容" width="300">
            <template slot-scope="scope">
              <i class="el-icon-edit-outline"></i>
              <span style="margin-left: 10px">{{ scope.row.TemplateContent }}</span>
            </template>
          </el-table-column>
          <el-table-column label="审核备注" width="200">
            <template slot-scope="scope">
              <i class="el-icon-document-remove"></i>
              <span style="margin-left: 10px">{{ scope.row.Reason }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态码" width="100">
            <template slot-scope="scope">
              <el-tag :type="mesStatus(scope.row.Message,scope.row) === 'OK' ? 'success' : 'danger'"
                disable-transitions>
                {{ mesStatus(scope.row.Message,scope.row) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="warning" size="small" plain>修改</el-button>
              <el-button type="danger" size="small" plain @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog title="修改短信模板" :visible.sync="dialogSmsUpdateVisible">
          <el-form :model="Smsaddform">
            <el-form-item label="短信类型" :label-width="formLabelWidth">
              <el-select v-model="Smsaddform.TemplateType" placeholder="请选择">
                <el-option label='验证码' value=0>验证码</el-option>
                <el-option label='短信通知' value=1>短信通知</el-option>
                <el-option label='推广信息' value=2>推广短信</el-option>
                <el-option label='国际/港澳台消息' value=3>国际/港澳台消息</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="模板名称" :label-width="formLabelWidth">
              <el-input v-model="Smsaddform.TemplateName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="模板内容" :label-width="formLabelWidth">
              <el-input v-model="Smsaddform.TemplateContent" autocomplete="off" placeholder='模板内容需要符合文本短信模板规范'
                type="textarea" :rows='2'></el-input>
            </el-form-item>
            <el-form-item label="短信模板申请说明" :label-width="formLabelWidth">
              <el-input v-model="Smsaddform.Remark" autocomplete="off" placeholder='请描述您的业务使用场景，100字以内' type='textarea'
                :rows='2'></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogSmsUpdateVisible = false">取 消</el-button>
            <el-button type="primary" @click="SmsUpdateinforOnline()">确 定</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>

      <el-tab-pane label="部门信息管理">
        <el-button type="primary" icon="el-icon-edit" class="Smsadd" @click="dialogDepaddVisible = true">添加</el-button>
        <el-dialog title="添加部门" :visible.sync="dialogDepaddVisible">
          <el-form :model="Depaddform">
            <el-form-item label="部门名称" :label-width="formLabelWidth">
              <el-input v-model="Depaddform.department_name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="部门id(从0开始依次加一)" :label-width="formLabelWidth">
              <el-input v-model="Depaddform.department_id" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="部门qq群" :label-width="formLabelWidth">
              <el-input v-model="Depaddform.department_qq" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogDepaddVisible = false">取 消</el-button>
            <el-button type="primary" @click="DepAddinfor()">确 定</el-button>
          </div>
        </el-dialog>
        <el-table :data="DepModeldata" style="width: 100%">
          <el-table-column label="部门名称" width="150">
            <template slot-scope="scope">
              <i class="el-icon-message"></i>
              <span style="margin-left: 10px">{{ scope.row.department_name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="部门编号" width="100">
            <template slot-scope="scope">
              <i class="el-icon-chat-dot-round"></i>
              <span style="margin-left: 10px">{{ scope.row.department_id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="部门qq群" width="300">
            <template slot-scope="scope">
              <i class="el-icon-edit-outline"></i>
              <span style="margin-left: 10px">{{ scope.row.department_qq }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleDepEdit(scope.row)" plain type='warning'>编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDepDelete(scope.row)" plain>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog title="部门编辑" :visible.sync="dialogDepVisible">
          <el-form :model="Depaddform">
            <el-form-item label="部门名称" :label-width="formLabelWidth">
              <el-input v-model="Depaddform.department_name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="部门编号" :label-width="formLabelWidth">
              <el-input v-model="Depaddform.department_id" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="部门qq群" :label-width="formLabelWidth">
              <el-input v-model="Depaddform.department_qq" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogDepVisible = false">取 消</el-button>
            <el-button type="primary" @click="Depalterinfo()">确 定</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>

      <el-tab-pane label="系统配置">
        <el-form label-width="140px" :model="AliyunConfig">
          <el-form-item label="阿里云ak">
            <el-input v-model="AliyunConfig.AccessKeyId" :disabled="updateinfo"></el-input>
          </el-form-item>
          <el-form-item label="AkSecret">
            <el-input v-model="AliyunConfig.AccessKeySecret" :disabled="updateinfo"></el-input>
          </el-form-item>
          <el-form-item label='线上报名开始时间'>
            <el-date-picker v-model="AliyunConfig.signuptime" type="datetime" placeholder="选择日期时间"
              :disabled="updateinfo">
            </el-date-picker>
          </el-form-item>
          <el-form-item label='线上报名结束时间'>
            <el-date-picker v-model="AliyunConfig.signdowntime" type="datetime" placeholder="选择日期时间"
              :disabled="updateinfo">
            </el-date-picker>
          </el-form-item>
          <el-form-item label='录取查询开始时间'>
            <el-date-picker v-model="AliyunConfig.queryuptime" type="datetime" placeholder="选择日期时间"
              :disabled="updateinfo">
            </el-date-picker>
          </el-form-item>
          <el-form-item label='录取查询结束时间'>
            <el-date-picker v-model="AliyunConfig.querydowntime" type="datetime" placeholder="选择日期时间"
              :disabled="updateinfo">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <div class="sysseting-bottom">
          <el-button type="warning" round @click="updateinfo=false">点击修改</el-button>
          <el-button type="danger" round @click='SaveAk()'>保存</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style scoped>
  .Smsadd {
    float: right;
    margin-right: 30px;
    margin-bottom: 10px;
  }

  .row-bg {
    margin: 10px;
  }

  .time-font {
    margin: 10px;
    color: rgba(22, 21, 21, 0.5);
    display: inline-block;
  }

  .sysseting-bottom {
    margin-left: 130px;
    margin-top: 40px;
  }
</style>

<script>
  export default {
    data() {
      return {
        tabPosition: 'left', //标签页方向
        SmsModeldata: [], //短信数据
        DepModeldata: [], //部门数据
        dialogSmsaddVisible: false, //添加短信模板
        dialogSmsOnlineaddVisible: false, //在线申请短信模板
        dialogSmsUpdateVisible: false, //修改短信模板
        dialogDepaddVisible: false, //添加部门模板
        dialogDepVisible: false, //修改部门模板
        formLabelWidth: '130px',
        Smsaddform: { //短信模板添加
          SignName: '',
          TemplateCode: '',
          Remark: '',
          TemplateType: '',
          TemplateName: '',
          TemplateContent: ''
        },
        Depaddform: { //部门添加
          department_id: '',
          department_name: '',
          department_qq: ''
        },
        AliyunConfig: { //配置表
          AccessKeyId: '',
          AccessKeySecret: '',
          _id: '',
          signuptime: '',
          signdowntime: '',
          queryuptime: '',
          querydowntime: ''
        },
        updateinfo: true, //系统配置开关
      };
    },

    components: {},

    computed: {
      mesStatus() {
        return function (res, row) {
          if (row.Reason.length > 6) {
            return '未通过审核'
          }
          return res
        }
      }
    },

    beforeMount() {},

    mounted() {
      this.getSmsInfor()
      this.getDepinfor()
      this.getSysSet()
    },

    methods: {
      //获取短信模板
      getSmsInfor() {
        this.axios.get('/api/sms/', {
          headers: {
            'Authorization': sessionStorage.getItem('userToken')
          }
        }).then(res => {
          if (res.status == 200) {
            this.SmsModeldata = res.data
          }
        }).catch(err => {
          if (err.response.status == 400) {
            this.$message.error(JSON.stringify(err.response.data))
          }
        })
      },
      //手动添加短信模板
      SmsAddinfor() {
        this.axios.post('/api/sms/', this.Smsaddform, {
          headers: {
            'Authorization': sessionStorage.getItem('userToken')
          }
        }).then(res => {
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.Smsaddform.SignName = ''
            this.Smsaddform.TemplateCode=''
            this.Smsaddform.Remark=''
            this.Smsaddform.TemplateType=''
            this.Smsaddform.TemplateName=''
            this.Smsaddform.TemplateContent=''
            this.getSmsInfor()
            this.dialogSmsaddVisible = false
          }
        }).catch(err => {
          if (err.response.status == 400) {
            this.$message.error(JSON.stringify(err.response.data))
          }
        })
      },
      //在线申请短信模板
      SmsAddinforOnline() {
        this.axios.post('api/sms/addTemp', this.Smsaddform, {
          headers: {
            'Authorization': sessionStorage.getItem('userToken')
          }
        }).then(res => {
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.getSmsInfor()
            this.Smsaddform.TemplateType = null
            this.Smsaddform.TempalteName = ''
            this.Smsaddform.TemplateContent = ''
            this.Smsaddform.Remark = ''
            this.dialogSmsOnlineaddVisible = false
          }
        }).catch(err => {
          if (err.response.status == 400) {
            this.$message.error(JSON.stringify(err.response.data))
          }
        })
      },
      //短信模板修改
      handleClick(row) {
        this.dialogSmsUpdateVisible = true;
        this.Smsaddform = row
      },
      //短信模板在线修改提交
      SmsUpdateinforOnline() {
        this.axios.post('/api/sms/modifyTemp', this.Smsaddform, {
          headers: {
            'Authorization': sessionStorage.getItem('userToken')
          }
        }).then(res => {
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '提交修改成功'
            })
            this.getSmsInfor()
            this.Smsaddform.TemplateType = null
            this.Smsaddform.TempalteName = ''
            this.Smsaddform.TemplateContent = ''
            this.Smsaddform.Remark = ''
            this.dialogSmsUpdateVisible = false
          }
        }).catch(err => {
          if (err.response.status == 400) {
            this.$message.error(JSON.stringify(err.response.data))
          }
        })
      },
      //过滤器
      filterTag(value, row) {
        return row.tag === value;
      },
      //短信模板删除
      handleDelete(row) {
        let id = row._id;
        this.$confirm('此操作将永久删除该模板, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.delete('api/sms/' + id, {
            headers: {
              'Authorization': sessionStorage.getItem('userToken')
            }
          }).then((res) => {
            if (res.status == 200) {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.getSmsInfor();
            }
          }).catch(err => {
            if (err.response.status == 400) {
              this.$message.error(JSON.stringify(err.response.data))
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //获取部门信息
      getDepinfor() {
        this.axios.get('api/depart/', {
          headers: {
            'Authorization': sessionStorage.getItem('userToken')
          }
        }).then(res => {
          if (res.status == 200) {
            this.DepModeldata = res.data
          }
        })
      },
      //添加部门信息
      DepAddinfor() {
        this.axios.post('api/depart/', this.Depaddform, {
          headers: {
            'Authorization': sessionStorage.getItem('userToken')
          }
        }).then(res => {
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '部门添加成功'
            })
            this.getDepinfor()
            this.dialogDepaddVisible = false
          }
        })
      },
      //编辑部门信息
      handleDepEdit(row) {
        this.dialogDepVisible = true
        this.Depaddform = row
      },
      //修改部门信息
      Depalterinfo() {
        let id = this.Depaddform.department_id
        this.axios.put('api/depart/' + id, this.Depaddform, {
          headers: {
            'Authorization': sessionStorage.getItem('userToken')
          }
        }).then(res => {
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '修改信息成功'
            })
            this.getDepinfor()
            this.dialogDepVisible = false
          }
        })
      },
      //删除部门
      handleDepDelete(row) {
        this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.delete('api/depart/' + row.department_id, {
            headers: {
              'Authorization': sessionStorage.getItem('userToken')
            }
          }).then(res => {
            if (res.status == 200) {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.getDepinfor()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //获取系统信息
      getSysSet() {
        this.axios.get('/api/setting', {
          headers: {
            'Authorization': sessionStorage.getItem('userToken')
          }
        }).then(res => {
          if (res.status == 200) {
            this.AliyunConfig = res.data
          }
        }).catch(err => {
          if (err.response.status == 400) {
            this.$message.error(JSON.stringify(err.response.data))
          }
        })
      },
      //保存系统配置
      SaveAk() {
        this.axios.post('/api/setting', this.AliyunConfig, {
          headers: {
            'Authorization': sessionStorage.getItem('userToken')
          }
        }).then(res => {
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.getSysSet()
          }
        }).catch(err => {
          if (err.response.status == 400) {
            this.$message.error(JSON.stringify(err.response.data))
          } else {
            this.$message.error(err.response.data)
          }
        })
      }
    },
    filters: {

    },

    watch: {}

  }
</script>