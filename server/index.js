/**
 * @ Author: tyutjohn
 * @ Create Time: 2020-04-22 18:24:59
 * @ Modified by: tyutjohn
 * @ Modified time: 2020-05-12 18:42:53
 * @ Github: https://github.com/tyutjohn
 */

const koa=require('koa')
const Router=require('koa-router')
const bodyParser=require('koa-bodyparser')
const passport=require('koa-passport')

//实例化koa
const app=new koa()
const server=require('http').createServer(app.callback())
const creatSocket=require('./socket/createSocket')
const router=new Router()

//将新建的socket服务传入函数
creatSocket(server)

//引入log4js
const {logger,accessLogger}=require('./util/log4js')
app.use(accessLogger())

//捕获全局状态下的错误
app.on('error', err => {
    logger.error(err);
})

app.use(bodyParser())

//引入admins.js
const admins=require('./routes/api/admins')
//引入setting.js
const settings=require('./routes/api/setting')
//引入departs.js
const departs=require('./routes/api/departs')
//引入sms.js
const sms=require('./routes/api/sms')
//引入user.js
const users=require('./routes/api/user')

//回调到config文件中 passport.js
require('./config/passport')(passport)

//配置路由地址
router.use('/api/admin',admins)
router.use('/api/setting',settings)
router.use('/api/depart',departs)
router.use('/api/sms',sms)
router.use('/api/user',users)

//初始化passport
app.use(passport.initialize())
app.use(passport.session())

//配置public静态资源
app.use(require('koa-static')(__dirname + '/'))

//配置路由
app.use(router.routes()).use(router.allowedMethods())

const port=process.env.PORT || 3000;

server.listen(port,'0.0.0.0',()=>{
    console.log(`server started on ${port}`);
})