/**
 * @ Author: tyutjohn
 * @ Create Time: 2020-04-26 19:35:07
 * @ Modified by: tyutjohn
 * @ Modified time: 2020-05-17 22:36:02
 * @ Github: https://github.com/tyutjohn
 */

const Router = require('koa-router')
const router = new Router()
const mongoose = require('../../util/mongoose')
const passport = require('koa-passport')
const axios = require('axios')
const redis = require('../../util/redis')

//引入user
const User = require('../../models/user')

//引入Setting
const Set = require('../../models/setting')

//引入Department
const Dep = require('../../models/department')

//引入Validator验证
const ValidatorEnroll = require('../../validation/user/enroll')
const ValidatorEnrollScore = require('../../validation/user/enrollScore')
const ValidatorUserFind = require('../../validation/user/userFind')
const ValidatorUserChat=require('../../validation/user/userChat')

//查找AmapKey
Key = () => {
    return new Promise(res => {
        res(Set.findOne({
            state: 0
        }, {
            AmapKey: 1
        }).then(ctx => {
            return ctx
        }))
    })
}

//获取ip
getClientIP = (req) => {
    return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
        req.socket.remoteAddress // 判断后端的 socket 的 IP
}

/**
 * @router GET api/user/ip
 * @des 获取用户ip地址
 * @access 接口是公开的
 */
router.get('/ip', async ctx => {
    //获取amap,ip
    const key = await Key()
    const ip = await getClientIP(ctx.request)

    //构建amapUrl
    const url = 'https://restapi.amap.com/v3/ip?ip=' + ip + '&key=' + key.AmapKey

    //请求高德api
    getIp = () => {
        return new Promise(res => {
            res(axios.get(url).then(ip => {
                return ip.data
            }))
        })
    }
    const result = await getIp()
    ctx.body = result
})

/**
 * @router POST api/user/enroll
 * @des 客户端报名地址
 * @access  接口是公开的
 */
router.post('/enroll', async ctx => {

    //记录访问ip,60s内限制访问次数为10次,存到redis
    const ip = await getClientIP(ctx.request)

    //查询是否存在ip,若存在，自增1
    await redis.getString(ip).then(res => {
        if (res) {
            redis.incrInt(ip)
        } else {
            redis.setString(ip, 1, 60) //设置过期时间为1分钟
        }
    })

    await redis.getString(ip).then(async res => {
        if (res > 10) {
            ctx.body = '访问过于频繁，请一分钟后再试'
            return
        } else {
            const {
                errors,
                isValid
            } = ValidatorEnroll(ctx.request.body)
            //验证是否通过
            if (!isValid) {
                ctx.status = 400
                ctx.body = errors
                return
            }
            await User.find({
                phone: ctx.request.body.phone
            }).then(async doc => {
                if (doc.length > 0) {
                    ctx.body = '您已经提交成功，请勿重复提交'
                    return
                } else {
                    const newUser = new User(ctx.request.body)

                    //储存到数据库
                    await newUser.save().then(user => {
                        ctx.body = '您已提交成功'
                    }).catch(err => {
                        console.log(err)
                    })
                }
            })
        }
    })

})

/**
 * @router GET api/user/person/:id
 * @des 个人用户信息
 * @acces 接口是私密的
 */
router.get('/person/:id',passport.authenticate('jwt',{
    session:false
}),async ctx=>{
    let _id = mongoose.Types.ObjectId(ctx.params.id)
    await User.findOne({_id}).then(doc=>{
        ctx.status=200
        ctx.body=doc
    })
})

/**
 * @router GET api/user/
 * @des 全部报名信息
 * @access 接口是私密的
 */
router.get('/', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    let page = ctx.request.query.page
    let pageSize = ctx.request.query.pageSize

    const leng=await User.countDocuments({
        sms_status:0
    })
    await User.find({
            sms_status: 0
        })
        .limit(1 * pageSize) //读取条数
        .skip(10 * page) //跳过的条数
        .then(doc => {
            ctx.status = 200
            let result={
                userdata:doc,
                len:leng
            }
            ctx.body =result
        }).catch(err => {
            console.log(err)
        })
})

/**
 * @router GET api/user/department
 * @des 各部门报名的信息
 * @access 接口是私密的
 */
router.get('/department', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    let page = ctx.request.query.page
    let pageSize = ctx.request.query.pageSize
    let department = ctx.request.query.department

    const leng=await User.countDocuments({
        sms_status: 0,
        department
    })
    await User.find({
        sms_status: 0,
        department
    }).limit(1 * pageSize).skip(10 * page).then(doc => {
        ctx.status = 200
        let result={
            userdata:doc,
            len:leng
        }
        ctx.body =result
    }).catch(err => {
        console.log(err)
    })
})

/**
 * @router GET api/user/markSore
 * @des 打分台的全部信息
 * @access 接口是私密的
 */
router.get('/markSore', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    let page = ctx.request.query.page
    let pageSize = ctx.request.query.pageSize

    const leng=await User.countDocuments({
        sms_status:1,
        itv_status:0
    })
    await User.find({
        sms_status: 1,
        itv_status: 0
    }).limit(1 * pageSize).skip(10 * page).then(doc => {
        ctx.status=200
        let result={
            userdata:doc,
            len:leng
        }
        ctx.body =result
    }).catch(err => {
        console.log(err)
    })
})

/**
 * @router GET  api/user/markSore/:department
 * @des 打分台各部门信息
 * @access 接口是私密的
 */
router.get('/markSore/:department', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    let department = ctx.params.department
    let page = ctx.request.query.page
    let pageSize = ctx.request.query.pageSize

    const leng=await User.countDocuments({
        sms_status:1,
        itv_status:0,
        department
    })
    await User.find({
        sms_status: 1,
        itv_status: 0,
        department
    }).limit(1 * pageSize).skip(10 * page).then(doc => {
        ctx.status = 200
        let result={
            userdata:doc,
            len:leng
        }
        ctx.body =result
    }).catch(err => {
        console.log(err)
    })
})

/**
 * @router POST api/user/enrollScore/:id
 * @des 对面试者打分
 * @access 接口是私密的
 */
router.post('/enrollScore/:id', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    let _id = mongoose.Types.ObjectId(ctx.params.id)

    //将打分结果保存在数据库
    const {
        errors,
        isValid
    } = ValidatorEnrollScore(ctx.request.body)
    //判断验证是否通过
    if (!isValid) {
        ctx.status = 400;
        ctx.body = errors;
        return;
    }

    await User.updateOne({
        _id
    }, {
        $set: {
            score: ctx.request.body.score,
            evaluate: ctx.request.body.evaluate,
            itv_status: 1
        }
    }).then(doc => {
        ctx.status = 200
        ctx.body = '打分成功'
    }).catch(err => {
        console.log(err)
    })
})

/**
 * @router POST api/user/loading
 * @des 延迟面试
 * @access 接口是私密的
 */
router.post('/loading', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    let _id = ctx.request.body._id

    await User.updateOne({_id}, {
        $set: {
            sms_status: 0
        }
    }).then(doc => {
        ctx.status = 200
        ctx.body = '已经延迟面试'
    }).catch(err => {
        console.log(err)
    })
})

/**
 * @router POST api/user/adjust
 * @des 调剂面试
 * @access 接口是私密的
 */
router.post('/adjust', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    let _id = ctx.request.body._id

    //查询是否填写了第二志愿
    await User.findOne({
        _id
    }, {
        department2: 1
    }).then(async doc => {
        if (doc.department2) {
            await User.updateOne({
                _id
            }, {
                $set: {
                    sms_status: 0,
                    department: doc.department2,
                    department2: ''
                }
            })
            ctx.body = '调剂成功'
        } else {
            ctx.body = '未填写第二志愿'
            return
        }
    })
})

/**
 * @router GET api/user/itv
 * @des 已经面试的全部信息
 * @access 接口是私密的
 */
router.get('/itv', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    let page = ctx.request.query.page
    let pageSize = ctx.request.query.pageSize

    const leng=await User.countDocuments({
        itv_status: 1,
        pass_status: 0
    })
    await User.find({
        itv_status: 1,
        pass_status: 0
    }).limit(1 * pageSize).skip(10 * page).then(doc => {
        ctx.status = 200
        let result={
            userdata:doc,
            len:leng
        }
        ctx.body =result
    }).catch(err => {
        console.log(err)
    })
})

/**
 * @router GET api/user/itv/:department
 * @des 已经面试的各部门的信息
 * @access 接口是私密的
 */
router.get('/itv/:department', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    let department = ctx.params.department
    let page = ctx.request.query.page
    let pageSize = ctx.request.query.pageSize

    const leng=await User.countDocuments({
        itv_status: 1,
        pass_status: 0,
        department
    })
    await User.find({
        itv_status: 1,
        pass_status: 0,
        department
    }).limit(1 * pageSize).skip(10 * page).then(doc => {
        ctx.status = 200
        let result={
            userdata:doc,
            len:leng
        }
        ctx.body =result
    }).catch(err => {
        console.log(err)
    })
})

/**
 * @router GET api/user/pass
 * @des 已经通过面试信息
 * @access 接口是私密的
 */
router.get('/pass', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    let page = ctx.request.query.page
    let pageSize = ctx.request.query.pageSize

    const leng=await User.countDocuments({
        pass_status: 1
    })
    await User.find({
        pass_status: 1
    }).limit(1 * pageSize).skip(10 * page).then(doc => {
        ctx.status = 200
        let result={
            userdata:doc,
            len:leng
        }
        ctx.body =result
    }).catch(err => {
        console.log(err)
    })
})

/**
 * @router GET api/user/pass/:department
 * @des 已经通过面试的各部门信息
 * @access 接口是私密的
 */
router.get('/pass/:department', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    let department = ctx.params.department
    let page = ctx.request.query.page
    let pageSize = ctx.request.query.pageSize

    const leng=await User.countDocuments({
        pass_status: 1,
        department
    })
    await User.find({
        pass_status: 1,
        department
    }).limit(1 * pageSize).skip(10 * page).then(doc => {
        ctx.status = 200
        let result={
            userdata:doc,
            len:leng
        }
        ctx.body =result
    }).catch(err => {
        console.log(err)
    })
})

/**
 * @router GET api/user/nopass
 * @des 未通过面试信息
 * @access 接口是私密的
 */
router.get('/nopass', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    let page = ctx.request.query.page
    let pageSize = ctx.request.query.pageSize

    const leng=await User.countDocuments({
        pass_status: 2
    })
    await User.find({
        pass_status: 2
    }).limit(1 * pageSize).skip(10 * page).then(doc => {
        ctx.status = 200
        let result={
            userdata:doc,
            len:leng
        }
        ctx.body =result
    }).catch(err => {
        console.log(err)
    })
})

/**
 * @router GET api/user/nopass/:department
 * @des 未通过面试的各部门信息
 * @access 接口是私密的
 */
router.get('/nopass/:department', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    let department = ctx.params.department
    let page = ctx.request.query.page
    let pageSize = ctx.request.query.pageSize

    const leng=await User.countDocuments({
        pass_status: 2,
        department
    })
    await User.find({
        pass_status: 2,
        department
    }).limit(1 * pageSize).skip(10 * page).then(doc => {
        ctx.status = 200
        let result={
            userdata:doc,
            len:leng
        }
        ctx.body =result
    }).catch(err => {
        console.log(err)
    })
})

/**
 * @router POST api/user/userfind
 * @des 查询面试结果
 * @access 接口是私密的
 * @param phone
 */
router.post('/userfind', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    const {
        errors,
        isValid
    } = ValidatorUserFind(ctx.request.body)
    //验证是否通过
    if (!isValid) {
        ctx.status = 400
        ctx.body = errors
        return
    }

    //查找qqNum
    qqNum = (Did) => {
        return new Promise(res => {
            res(Dep.findOne({
                department_id: Did
            }, {
                department_qq: 1
            }).then(ctx => {
                return ctx
            }))
        })
    }

    //查询是否报名
    const result = await User.findOne({
        phone: ctx.request.body.phone
    }).then(async doc => {
        if (doc) {
            return doc
        } else {
            ctx.body = '未查询到该用户的信息，请确认手机号是否填写正确'
            return
        }
    })

    //获取录取qq群
    let Num = await qqNum(result.department)
    if (result.pass_status == 0) {
        ctx.body = '您的表现正在被商讨中，请耐心等待结果'
    } else if (result.pass_status == 1) {
        ctx.body = '恭喜您被我们录取，请加入qq群:' + Num.department_qq + ',您的小伙伴已经在群里等你了'
    } else {
        ctx.body = '很遗憾，您没有被我们录取，祝愿您以后的生活，学习愉快'
    }

})

/**
 * @router GET api/user/chat
 * @des 查询socket管理员是否在线
 * @access 接口是公开的
 */
router.get('/chat', async ctx => {
    const admin = await redis.hgetall('adminId')
    if (admin) {
        ctx.status = 200
        ctx.body = {
            Login: true
        }
    } else {
        ctx.status = 200
        ctx.body = {
            Login: false
        }
    }
})

/**
 * @router POST api/user/saveuser
 * @des 连接成功存储用户信息
 * @access 接口是公开的
 */
router.post('/saveuser',async ctx=>{
    const {
        errors,
        isValid
    } = ValidatorUserChat(ctx.request.body)
    //验证是否通过
    if (!isValid) {
        ctx.status = 400
        ctx.body = errors
        return
    }
    let result={}
    result[ctx.request.body.phone]=ctx.request.body.name
    await redis.hmset('userlist',result)//hash存储用户信息

    ctx.status=200


})

module.exports = router.routes()