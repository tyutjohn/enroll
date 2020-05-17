const Validator=require('validator')
const isEmpty=require('../is-empty')

module.exports=ValidatorUserChat=(data)=>{
    let errors={}

    //验证是否是字符串
    data.name=!isEmpty(data.name)?data.name:''
    data.phone=!isEmpty(data.phone)?data.phone:''

    if(Validator.isEmpty(data.name)){
        errors.name='姓名不能为空'
    }

    if(Validator.isEmpty(data.phone)){
        errors.phone='联系电话不能为空'
    }

    if(!Validator.isMobilePhone(data.phone,['zh-CN', 'zh-HK', 'zh-MO', 'zh-TW'])){
        errors.phone='联系电话格式错误'
    }

    return {
        errors,
        isValid:isEmpty(errors)
    }
}