/**
 * @ Author: tyutjohn
 * @ Create Time: 2020-05-08 19:09:28
 * @ Modified by: tyutjohn
 * @ Modified time: 2020-05-08 19:14:48
 * @ Github: https://github.com/tyutjohn
 */

const Validator=require('validator')
const isEmpty=require('../is-empty')

module.exports=ValidatorUserFind=(data)=>{
    let errors={}

    //验证是否是字符串
    data.phone=!isEmpty(data.phone)?data.phone:''

    if(Validator.isEmpty(data.phone)){
        errors.phone='报名号码不能为空'
    }

    if(!Validator.isMobilePhone(data.phone,['zh-CN', 'zh-HK', 'zh-MO', 'zh-TW'])){
        errors.phone='联系电话格式错误'
    }

    return {
        errors,
        isValid:isEmpty(errors)
    }
}