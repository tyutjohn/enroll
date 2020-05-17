/**
 * @ Author: tyutjohn
 * @ Create Time: 2020-04-26 17:11:55
 * @ Modified by: tyutjohn
 * @ Modified time: 2020-04-26 17:46:25
 * @ Github: https://github.com/tyutjohn
 */

const Validator=require('validator')
const isEmpty=require('../is-empty')

module.exports=ValidatorSendSms=(data)=>{
    let errors={}
    //验证是否是字符串
    data.PhoneNumbers=!isEmpty(data.PhoneNumbers)?data.PhoneNumbers:''
    data.SignName=!isEmpty(data.SignName)?data.SignName:''
    data.TemplateCode=!isEmpty(data.TemplateCode)?data.TemplateCode:''

    if(Validator.isEmpty(data.PhoneNumbers)){
        errors.PhoneNumbers='未选择发送的手机号码'
    }

    if(Validator.isEmpty(data.SignName)){
        errors.SignName='短信签名名称不能为空'
    }

    if(Validator.isEmpty(data.TemplateCode)){
        errors.TemplateCode='短信模板不能为空'
    }

    return {
        errors,
        isValid:isEmpty(errors)
    }
}