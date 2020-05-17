/**
 * @ Author: tyutjohn
 * @ Create Time: 2020-04-23 11:50:26
 * @ Modified by: tyutjohn
 * @ Modified time: 2020-05-17 08:53:15
 * @ Github: https://github.com/tyutjohn
 */

const Router = require('koa-router')
const router = new Router()
const mongoose = require('../../util/mongoose')
const jwt = require('jsonwebtoken')
const passport = require('koa-passport')

//引入setting
const Setting = require('../../models/setting')

/**
 * @route GET api/setting/test
 * @desc 测试接口地址
 * @access 接口是公开的
 */
router.get('/test', async ctx => {
    ctx.status = 200;
    ctx.body = {
        msg: 'setting works...'
    }
})

/**
 * @route POST api/setting/
 * @desc 系统信息设置
 * @access 接口是私密的
 */
router.post('/',passport.authenticate('jwt',{
    session:false
}),async ctx => {
    await Setting.find().then(async doc => {
        if (doc.length > 0) {
            const _id = mongoose.Types.ObjectId(doc[0]._id)
            const settingUpdate = {
                $set: ctx.request.body
            }

            await Setting.updateOne({_id}, settingUpdate, err => {
                if (err) {
                    ctx.status = 400
                    ctx.body = err
                } else {
                    ctx.status = 200
                    ctx.body = '修改成功'
                }
            })
        } else {
            //存储到数据库
            const settingResult = new Setting(ctx.request.body)

            await settingResult.save().then(user => {
                ctx.body = '保存成功'
            }).catch(err => {
                console.log(err)
            })
        }
    })
})

/**
 * @route GET api/setting/
 * @desc 获取系统信息
 * @access 接口是私密的
 */
router.get('/',passport.authenticate('jwt',{
    session:false
}),async ctx=>{
    await Setting.findOne({state:0}).then(res=>{
        ctx.status=200
        ctx.body=res
    })
})


module.exports = router.routes()