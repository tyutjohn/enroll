/**
 * @ Author: tyutjohn
 * @ Create Time: 2020-05-01 15:57:08
 * @ Modified by: tyutjohn
 * @ Modified time: 2020-05-01 18:49:44
 * @ Github: https://github.com/tyutjohn
 */

const Validator=require('validator')
const isEmpty=require('../is-empty')

module.exports=ValidatorEnroll=(data)=>{
    let errors={}

    //验证是否使字符串
    data.name=!isEmpty(data.name)?data.name:''
    data.phone=!isEmpty(data.phone)?data.phone:''
    data.department=!isEmpty(data.department)?data.department:''

    if(Validator.isEmpty(data.name)){
        errors.name='姓名不能为空'
    }

    if(Validator.isEmpty(data.phone)){
        errors.phone='联系电话不能为空'
    }

    if(!Validator.isMobilePhone(data.phone,['zh-CN', 'zh-HK', 'zh-MO', 'zh-TW'])){
        errors.phone='联系电话格式错误'
    }

    if(Validator.isEmpty(data.department)){
        errors.department='报名部门不能为空'
    }

    return {
        errors,
        isValid:isEmpty(errors)
    }
}