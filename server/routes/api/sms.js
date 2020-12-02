/**
 * @ Author: tyutjohn
 * @ Create Time: 2020-04-23 17:13:28
 * @ Modified by: tyutjohn
 * @ Modified time: 2020-05-17 22:28:05
 * @ Github: https://github.com/tyutjohn
 */

const Router = require('koa-router')
const router = new Router()
const passport = require('koa-passport')
const mongoose = require('../../util/mongoose')
const Core = require('@alicloud/pop-core')

//引入sms
const Sms = require('../../models/sms')

//引入setting
const Set = require('../../models/setting')

//引入user
const User = require('../../models/user')

//引入input验证
const ValidatorAddTemp = require('../../validation/sms/addTemp')
const ValidatorSendSms = require('../../validation/sms/sendSms')
const ValidatorQuerySmsDetail = require('../../validation/sms/querySmsDetail')

//获取公共参数
Headers = () => {
    return new Promise(res => {
        res(Set.findOne({
            state: 0
        }, {
            AccessKeyId: 1,
            AccessKeySecret: 1
        }).then(ctx => {
            return ctx
        }))
    })
}

//阿里云短信服务请求地址
let endpoint = 'https://dysmsapi.aliyuncs.com'

//阿里云短信api版本号
let apiVersion = '2017-05-25'

/**
 * @router POST api/sms/
 * @desc 手动添加短信模板
 * @access 接口是私密的
 */
router.post('/', passport.authenticate('jwt', {
    session: false
}), async ctx => {

    //请求查询
    getQuery = async (result) => {
        let client = new Core({
            accessKeyId: result.AccessKeyId,
            accessKeySecret: result.AccessKeySecret,
            endpoint,
            apiVersion
        })

        let requestOption = {
            method: 'POST'
        };

        let params = {
            "TemplateCode": ctx.request.body.TemplateCode
        }

        const result3 = await client.request('QuerySmsTemplate', params, requestOption).catch(err => {
            return err.data.Message
        })

        return result3

    }

    //查询是否存在
    const findResult = await Sms.find({
        TemplateCode: ctx.request.body.TemplateCode
    })

    if (findResult.length > 0) {
        ctx.data = false
        ctx.body = '该短信模板已经存在'
    } else {

        const result = await Headers() //获取头信息
        const result4 = await getQuery(result)
        if (result4.Code == 'OK') {
            const newSms = new Sms(ctx.request.body)
            await newSms.save().then(doc => {
                ctx.body = doc
            }).catch(err => {
                console.log(err)
            })
            //返回数据
            ctx.status = 200
            ctx.body = result4
        } else {
            ctx.status = 400
            ctx.body = result4
        }
    }
})

/**
 * @router PUT api/sms/:id
 * @desc 手动修改短信模板
 * @access 接口是私密的
 */
router.put('/:id', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    //设置修改
    const _id = mongoose.Types.ObjectId(ctx.params.id)
    const update = {
        $set: ctx.request.body
    }

    await Sms.updateOne(_id, update, err => {
        if (err) {
            ctx.status = 400
            ctx.body = err
        } else {
            ctx.status = 200
            ctx.body = '修改成功'
        }
    })
})

/**
 * @router Delete api/sms/:id
 * @desc 手动删除短信模板
 * @access 接口是私密的
 */
router.delete('/:id', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    //设置删除
    await Sms.deleteOne({
        _id: ctx.params.id
    }).then(res => {
        ctx.status = 200
        ctx.body = '删除成功'
    })
})

/**
 * @router GET api/sms/
 * @desc 获取短信模板
 * @access 接口是私密的
 */
router.get('/', passport.authenticate('jwt', {
    session: false
}), async ctx => {

    //请求查询
    getQuery = async () => {
        let client = new Core({
            accessKeyId: result.AccessKeyId,
            accessKeySecret: result.AccessKeySecret,
            endpoint,
            apiVersion
        })

        let requestOption = {
            method: 'POST'
        };

        //将不同code的结果循环传入数组中并return
        let data = []
        for (let i = 0; i < result2.length; i++) {
            let params = {
                "TemplateCode": result2[i].TemplateCode
            }
            const result3 = await client.request('QuerySmsTemplate', params, requestOption).catch(err => {
                return err.data.Message
            })
            result3._id = result2[i]._id
            result3.SignName = result2[i].SignName
            data.push(result3)
        }
        return data
    }

    const result = await Headers() //获取头信息
    const result2 = await Sms.find({}, (err, doc) => { //数据库查询模板信息
        if (err) {
            ctx.status = 400
            ctx.body = err
        } else {
            const code = doc
            return code
        }
    })
    ctx.body = await getQuery() //将查询结果返回给前台

})

/**
 * @router POST api/sms/addTemp
 * @desc 同步阿里云在线申请短信模板
 * @access 接口是私密的
 * @param TemplateType
 * @param TemplateName
 * @param TemplateContent
 * @param Remark
 */
router.post('/addTemp', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    const {
        errors,
        isValid
    } = ValidatorAddTemp(ctx.request.body)
    //判断验证是否通过
    if (!isValid) {
        ctx.status = 400
        ctx.body = errors
        return
    }

    const result = await Headers() //获取头信息
    let client = new Core({
        accessKeyId: result.AccessKeyId,
        accessKeySecret: result.AccessKeySecret,
        endpoint,
        apiVersion
    })

    let requestOption = {
        method: 'POST'
    }

    const result2 = await client.request('AddSmsTemplate', ctx.request.body, requestOption).catch(err => {
        return err.data.Message
    })

    saveMethod = async () => {
        if (result2.Message == 'OK') {
            const newTemp = new Sms({
                SignName: ctx.request.body.TemplateName,
                TemplateCode: result2.TemplateCode
            })
            await newTemp.save()
        }
    }
    await saveMethod()
    ctx.body = result2
})

/**
 * @router POST api/sms/modifyTemp
 * @desc 修改未通过审核的短信模板
 * @access 接口是私密的
 */
router.post('/modifyTemp', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    const {
        errors,
        isValid
    } = ValidatorAddTemp(ctx.request.body)
    //判断验证是否通过
    if (!isValid) {
        ctx.status = 400
        ctx.body = errors
        return
    }

    const result = await Headers() //获取头信息
    let client = new Core({
        accessKeyId: result.AccessKeyId,
        accessKeySecret: result.AccessKeySecret,
        endpoint,
        apiVersion
    })

    let requestOption = {
        method: 'POST'
    }

    const result2 = await client.request('ModifySmsTemplate', ctx.request.body, requestOption).catch(err => {
        return err.data.Message
    })
    ctx.body = result2
})

/**
 * @router  POST api/sms/sendSms
 * @des 发送面试短信
 * @access  接口是私密
 * @param TemplateParam //模板参数
 *        PhoneNumbers  //手机号码
 *        SignName      //签名
 *        TemplateCode  //模板code
 */
router.post('/sendSms', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    const {
        errors,
        isValid
    } = ValidatorSendSms(ctx.request.body)
    //判断验证是否通过
    if (!isValid) {
        ctx.status = 400
        ctx.body = errors
        return
    }

    const result = await Headers() //获取头信息
    let client = new Core({
        accessKeyId: result.AccessKeyId,
        accessKeySecret: result.AccessKeySecret,
        endpoint,
        apiVersion
    })

    let requestOption = {
        method: 'POST'
    }

    //发送短信
    const result1 = await client.request('SendSms', ctx.request.body, requestOption).catch(err => {
        return err.data.Message
    })

    if (result1.length > 5) {
        ctx.status = 400
        ctx.body = result1
    } else {
        //改变客户端短信发送状态
        let phone = ctx.request.body.PhoneNumbers.split(',')
        if (result1.Code == 'OK') {
            for (let i = 0; i < phone.length; i++) {
                await User.updateOne({
                    phone: phone[i]
                }, {
                    $set: {
                        sms_status: 1
                    }
                })
            }
        }

        ctx.status = 200
        ctx.body = result1
    }

})

/**
 * @router  GET api/sms/querySend
 * @des 查看短信发送的记录和状态
 * @access  接口是私密的
 */
router.post('/querySend', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    const {
        errors,
        isValid
    } = ValidatorQuerySmsDetail(ctx.request.body)
    //判断验证是否通过
    if (!isValid) {
        ctx.status = 400
        ctx.body = errors
        return
    }

    const result = await Headers() //获取头信息
    let client = new Core({
        accessKeyId: result.AccessKeyId,
        accessKeySecret: result.AccessKeySecret,
        endpoint,
        apiVersion
    })

    let requestOption = {
        method: 'POST'
    }

    const result1 = await client.request('QuerySendDetails', ctx.request.body, requestOption).catch(err => {
        return err.data.Message
    })

    ctx.body = result1

})

/**
 * @router  POST api/sms/sendSmsPass
 * @des 面试通过短信
 * @access  接口是私密
 * @param TemplateParam //模板参数
 *        PhoneNumbers  //手机号码
 *        SignName      //签名
 *        TemplateCode  //模板code
 */
router.post('/sendSmsPass', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    const {
        errors,
        isValid
    } = ValidatorSendSms(ctx.request.body)
    //判断验证是否通过
    if (!isValid) {
        ctx.status = 400
        ctx.body = errors
        return
    }

    const result = await Headers() //获取头信息
    let client = new Core({
        accessKeyId: result.AccessKeyId,
        accessKeySecret: result.AccessKeySecret,
        endpoint,
        apiVersion
    })

    let requestOption = {
        method: 'POST'
    }

    //发送短信
    const result1 = await client.request('SendSms', ctx.request.body, requestOption).catch(err => {
        return err.data.Message
    })

    if (result1.length > 5) {
        ctx.status = 400
        ctx.body = result1
    } else {
        //改变客户端短信发送状态
        let phone = ctx.request.body.PhoneNumbers.split(',')
        if (result1.Code == 'OK') {
            for (let i = 0; i < phone.length; i++) {
                await User.updateOne({
                    phone: phone[i]
                }, {
                    $set: {
                        pass_status: 1
                    }
                })
            }
        }

        ctx.status = 200
        ctx.body = result1
    }

})

/**
 * @router  POST api/sms/sendSmsNoPass
 * @des 面试未通过短信
 * @access  接口是私密
 * @param TemplateParam //模板参数
 *        PhoneNumbers  //手机号码
 *        SignName      //签名
 *        TemplateCode  //模板code
 */
router.post('/sendSmsNoPass', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    const {
        errors,
        isValid
    } = ValidatorSendSms(ctx.request.body)
    //判断验证是否通过
    if (!isValid) {
        ctx.status = 400
        ctx.body = errors
        return
    }

    const result = await Headers() //获取头信息
    let client = new Core({
        accessKeyId: result.AccessKeyId,
        accessKeySecret: result.AccessKeySecret,
        endpoint,
        apiVersion
    })

    let requestOption = {
        method: 'POST'
    }

    //发送短信
    const result1 = await client.request('SendSms', ctx.request.body, requestOption).catch(err => {
        return err.data.Message
    })

    if (result1.length > 5) {
        ctx.status = 400
        ctx.body = result1
    } else {
        //改变客户端短信发送状态
        let phone = ctx.request.body.PhoneNumbers.split(',')
        if (result1.Code == 'OK') {
            for (let i = 0; i < phone.length; i++) {
                await User.updateOne({
                    phone: phone[i]
                }, {
                    $set: {
                        pass_status: 2
                    }
                })
            }
        }

        ctx.status = 200
        ctx.body = result1
    }

})

/**
 * @router  POST api/sms/secondChance
 * @des 补招短信
 * @access  接口是私密
 * @param TemplateParam //模板参数
 *        PhoneNumbers  //手机号码
 *        SignName      //签名
 *        TemplateCode  //模板code
 */
router.post('/secondChance', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    const {
        errors,
        isValid
    } = ValidatorSendSms(ctx.request.body)
    //判断验证是否通过
    if (!isValid) {
        ctx.status = 400
        ctx.body = errors
        return
    }

    const result = await Headers() //获取头信息
    let client = new Core({
        accessKeyId: result.AccessKeyId,
        accessKeySecret: result.AccessKeySecret,
        endpoint,
        apiVersion
    })

    let requestOption = {
        method: 'POST'
    }

    //发送短信
    const result1 = await client.request('SendSms', ctx.request.body, requestOption).catch(err => {
        return err.data.Message
    })

    if (result1.length > 5) {
        ctx.status = 400
        ctx.body = result1
    } else {
        //改变客户端短信发送状态
        let phone = ctx.request.body.PhoneNumbers.split(',')
        if (result1.Code == 'OK') {
            for (let i = 0; i < phone.length; i++) {
                await User.updateOne({
                    phone: phone[i]
                }, {
                    $set: {
                        itv_status: 0,
                        pass_status: 0
                    }
                })
            }
        }

        ctx.status = 200
        ctx.body = result1
    }

})

module.exports = router.routes()