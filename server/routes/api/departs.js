/**
 * @ Author: tyutjohn
 * @ Create Time: 2020-04-23 16:31:38
 * @ Modified by: tyutjohn
 * @ Modified time: 2020-05-17 12:43:36
 * @ Github: https://github.com/tyutjohn
 */

const Router = require('koa-router')
const router = new Router()
const passport = require('koa-passport')

//引入department
const Depart = require('../../models/department')

//引入input验证
const validateDepAddInput = require('../../validation/department/add')

/**
 * @router POST api/depart/
 * @desc 添加部门信息
 * @access 接口是私密的
 */
router.post('/', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    const {
        errors,
        isValid
    } = validateDepAddInput(ctx.request.body)
    //判断验证是否通过
    if (!isValid) {
        ctx.status = 400
        ctx.body = errors
        return
    }

    //存储到数据库
    const findResult = await Depart.find({
        department_id: ctx.request.body.department_id
    })

    if (findResult.length > 0) {
        ctx.data = false
        ctx.body = '该部门信息已经存在'
    } else {
        const newDepart = new Depart(ctx.request.body)
        await newDepart.save().then(doc=>{
            ctx.body=doc
        }).catch(err=>{
            console.log(err)
        })

        //返回数据
        ctx.body=newDepart
    }
})

/**
 * @router PUT api/depart/:id
 * @desc 修改部门信息
 * @access 接口是私密的
 */
router.put('/:id',passport.authenticate('jwt',{
    session:false
}),async ctx=>{
    //设置修改
    const id=ctx.params.id
    const update={$set:ctx.request.body}

    await Depart.updateOne({department_id:id},update,err=>{
        if(err){
            ctx.status=400
            ctx.body=err
        }else{
            ctx.status=200
            ctx.body='修改成功'
        }
    })
})

/**
 * @router Delete api/depart/:id
 * @desc 删除部门信息
 * @access 接口是私密的
 */
router.delete('/:id',passport.authenticate('jwt',{
    session:false
}),async ctx=>{
    //设置删除
    const id=ctx.params.id
    await Depart.deleteOne({department_id:id},err=>{
        if(err){
            ctx.status=400
            ctx.body=err
        }else{
            ctx.status=200
            ctx.body='删除成功'
        }
    })
})

/**
 * @router GET api/depart/
 * @desc 获取部门信息
 * @access 接口时私密的
 */
router.get('/',passport.authenticate('jwt',{
    session:false
}),async ctx=>{
    await Depart.find().then(res=>{
        ctx.body=res
    })
})

module.exports = router.routes()