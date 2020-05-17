/**
 * @ Author: tyutjohn
 * @ Create Time: 2020-04-22 20:41:27
 * @ Modified by: tyutjohn
 * @ Modified time: 2020-05-17 21:18:14
 * @ Github: https://github.com/tyutjohn
 */

const Router = require('koa-router');
const router = new Router();
const mongoose = require('../../util/mongoose')
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const secretOrKey = require('../../config/mongodb').secretOrKey;
const passport = require('koa-passport');
const upload = require('../../util/upload')
const redis = require('../../util/redis')

//引入admin
const User = require('../../models/admin');

//引入input验证
const validateRegisterInput = require('../../validation/admin/register');
const validateLoginInput = require('../../validation/admin/login');
const validatorPasswordInput = require('../../validation/admin/password');
const validateInitAdmin = require('../../validation/admin/initadmin')

/**
 * @route GET api/admin/test
 * @desc 测试接口地址
 * @access 接口是公开的
 */
router.get('/test', async ctx => {
    ctx.status = 200;
    ctx.body = {
        msg: 'admin works...'
    };
});


/**
 * @route POST api/admin/initialize
 * @desc 初始化管理员地址
 * @access 接口是公开的
 * @param phone
 * @param name
 * @param password
 * @param password2
 */
router.post('/initialize', async ctx => {
    //查询是否已经初始化
    const findInit = await User.find().then(res => {
        if (res.length > 0) {
            ctx.status = 400
            ctx.body = '系统已经初始化，请前往登录页面'
            return
        } else {
            return true
        }
    })

    if (findInit) {
        const {
            errors,
            isValid
        } = validateInitAdmin(ctx.request.body)
        //验证是否通过
        if (!isValid) {
            ctx.status = 400
            ctx.body = errors
            return
        }
        //存储
        const avatar = gravatar.url(ctx.request.body.email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });
        const newUser = new User({
            name: ctx.request.body.name,
            phone: ctx.request.body.phone,
            avatar,
            password: ctx.request.body.password,
            rank: 0
        });

        //加密密码
        newUser.password = await new Promise((res, rej) => {
            bcrypt.hash(newUser.password, 10, function (err, hash) {
                if (err) rej(err)
                res(hash)
            });
        })

        //存储到数据库
        await newUser.save().then(user => {
            ctx.body = user;
        }).catch(err => {
            console.log(err)
        });
    }
})

/**
 * @route POST api/admin/register
 * @desc 注册接口地址
 * @access 接口是私密的
 */
router.post('/register', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    const {
        errors,
        isValid
    } = validateRegisterInput(ctx.request.body);
    //判断是否验证通过
    if (!isValid) {
        ctx.status = 400;
        ctx.body = errors;
        return;
    }

    //存储到数据库
    const findResult = await User.find({
        phone: ctx.request.body.phone
    });

    if (findResult.length > 0) {
        ctx.data = false;
        ctx.body = {
            phone: '该手机已经注册'
        };
    } else {
        const avatar = gravatar.url(ctx.request.body.email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });
        const newUser = new User({
            name: ctx.request.body.name,
            phone: ctx.request.body.phone,
            avatar,
            password: ctx.request.body.password,
            department: ctx.request.body.department,
            rank: ctx.request.body.rank
        });

        //加密密码
        newUser.password = await new Promise((res, rej) => {
            bcrypt.hash(newUser.password, 10, function (err, hash) {
                if (err) rej(err)
                res(hash)
            });
        })

        //存储到数据库
        await newUser.save().then(user => {
            ctx.body = user;
        }).catch(err => {
            console.log(err)
        });

        //返回json数据
        ctx.body = newUser;
    }
});

/**
 * @route POST api/admin/login
 * @desc 登陆接口地址 返回token
 * @access 接口是公开的
 * @param phone
 * @param password
 */
router.post('/login', async ctx => {
    const {
        errors,
        isValid
    } = validateLoginInput(ctx.request.body);
    //判断是否验证通过
    if (!isValid) {
        ctx.status = 400;
        ctx.body = errors;
        return;
    }
    //查询
    const findResult = await User.find({
        phone: ctx.request.body.phone
    });
    const user = findResult[0]
    const password = ctx.request.body.password;
    //判断查没查到
    if (findResult.length == 0) {
        ctx.status = 404;
        ctx.body = {
            phone: '用户不存在'
        };
    } else {
        //查到后 验证密码
        var result = await bcrypt.compareSync(password, user.password);

        //验证通过
        if (result) {
            //返回token
            const payload = {
                id: user._id,
                name: user.name,
                avatar: user.avatar,
                rank: user.rank,
                department: user.department
            };
            const token = jwt.sign(payload, secretOrKey, {
                expiresIn: "12h"
            })

            ctx.status = 200;
            ctx.body = {
                success: true,
                token: "Bearer " + token,
                name: user.name
            };
        } else {
            ctx.status = 400;
            ctx.body = {
                password: "密码错误"
            }
        }
    }
})

/**
 * @route GET api/admin/current
 * @desc 用户信息接口地址 返回用户信息
 * @access 接口是私密的
 */
router.get('/current', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    ctx.body = {
        id: ctx.state.user._id,
        name: ctx.state.user.name,
        phone: ctx.state.user.phone,
        avatar: ctx.state.user.avatar,
        rank: ctx.state.user.rank,
        department: ctx.state.user.department
    };
})

/**
 * @route GET api/admin/
 * @desc 获取用户组信息
 * @access 接口是私密的
 */
router.get('/', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    //权限设置
    if (ctx.request.query.rank == 1) {
        //查询自身
        let _id = mongoose.Types.ObjectId(ctx.request.query.id)
        await User.find({
            _id: _id
        }, (err, docs) => {
            if (err) {
                ctx.status == 400
                ctx.body = err
            } else {
                ctx.body = docs
            }
        })
    } else {
        //查询所有
        await User.find({
            state: 0
        }).then(res => {
            ctx.body = res
        })
    }
})

/**
 * @route PUT api/admin/:phone
 * @desc 修改用户组成员信息
 * @access 接口是私密的
 */
router.put('/:phone', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    //设置修改
    const phone = ctx.params.phone
    const update = {
        $set: {
            name: ctx.request.body.name,
            department: ctx.request.body.department,
            rank: ctx.request.body.rank
        }
    };

    await User.updateOne({
        phone
    }, update).then(res => {
        ctx.status = 200
        ctx.body = '修改成功'
    })
})

/**
 * @route DELETE api/admin/:phone
 * @desc 删除用户组成员信息
 * @access 接口是私密的
 */
router.delete('/:phone', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    //设置删除
    const phone = ctx.params.phone
    await User.deleteOne({
        phone
    }).then(res => {
        ctx.status = 200
        ctx.body = '删除成功'
    })
})

/**
 * @route POST api/admin/password/:phone
 * @desc 更新用户组成员的密码
 * @access 接口是私密的
 */
router.post('/password/:phone', async ctx => {
    //设置修改
    const phone = ctx.params.phone
    const {
        errors,
        isValid
    } = validatorPasswordInput(ctx.request.body)
    //判断验证是否通过
    if (!isValid) {
        ctx.status = 400;
        ctx.body = errors;
        return;
    }

    //定义密码
    const passwordOld = {
        password: ctx.request.body.password
    }

    //加密密码
    passwordOld.password = await new Promise((res, rej) => {
        bcrypt.hash(passwordOld.password, 10, function (err, hash) {
            if (err) rej(err)
            res(hash)
        });
    })

    //存储到数据库
    await User.update({
        phone
    }, {
        $set: passwordOld
    }).then(res => {
        ctx.status = 200
        ctx.body = '修改成功'
    })
})

/**
 * @router POST api/admin/uploadAvatar/:phone
 * @des 上次管理员用户头像
 * @access 接口是私密的
 * @param phone
 * @param avatar
 */
router.post('/uploadAvatar/:phone', passport.authenticate('jwt', {
    session: false
}), async (ctx, next) => {
    let phone = ctx.params.phone
    //上传文件
    let err = await upload.single('file')(ctx, next)
        .then(res => res)
        .catch(err => err)
    let avatar = {
        avatar: ctx.file.path
    }
    //保存地址
    save = () => {
        User.updateOne({
            phone
        }, {
            $set: avatar
        }).then(res => console.log(res))
    }
    if (err) {
        ctx.status = 400
        ctx.body = err.message
    } else {
        await save()
        ctx.status = 200
        ctx.body = ctx.file
    }
})

/**
 * @router GET api/admin/userlist
 * @des 获取userChat队列
 * @access 接口是私密的
 */
router.get('/userlist', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    objToArr = (obj) => {
        var arr = []
        for (let i in obj) {
            let o = {}
            o['phone'] = i
            o['name'] = obj[i]
            o['mesStatus']='new'
            arr.push(o)
        }
        return arr
    }
    const list = await redis.hgetall('userlist')
    const result = await objToArr(list)

    ctx.body = result
})


module.exports = router.routes()