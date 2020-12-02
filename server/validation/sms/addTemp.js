/**
 * @ Author: tyutjohn
 * @ Create Time: 2020-04-26 15:18:59
 * @ Modified by: tyutjohn
 * @ Modified time: 2020-04-26 17:12:34
 * @ Github: https://github.com/tyutjohn
 */

const Validator=require('validator')
const isEmpty=require('../is-empty')

module.exports=ValidatorAddTemp=(data)=>{
    let errors={}
    //验证是否是字符串
    data.TemplateType=!isEmpty(data.TemplateType)?data.TemplateType:''
    data.TemplateName=!isEmpty(data.TemplateName)?data.TemplateName:''
    data.TemplateContent=!isEmpty(data.TemplateContent)?data.TemplateContent:''
    data.Remark=!isEmpty(data.Remark)?data.Remark:''

    if(Validator.isEmpty(data.TemplateType)){
        errors.TemplateType='短信类型不能为空'
    }
    
    if(Validator.isEmpty(data.TemplateName)){
        errors.TemplateName='模板名称不能为空'
    }

    if(!Validator.isLength(data.TemplateName,{
        min:1,
        max:30
    })){
        errors.TemplateName='模板名称，长度为1~30个字符'
    }

    if(Validator.isEmpty(data.TemplateContent)){
        errors.TemplateContent='模板内容不能为空'
    }

    if(!Validator.isLength(data.TemplateContent,{
        min:1,
        max:500
    })){
        errors.TemplateContent='模板内容，长度为1~500个字符'
    }

    if(Validator.isEmpty(data.Remark)){
        errors.Remark='短信模板申请说明不能为空，请在申请说明中描述您的业务使用场景'
    }

    if(!Validator.isLength(data.Remark,{
        min:1,
        max:100
    })){
        errors.Remark='请在申请说明中描述您的业务使用场景，长度为1~100个字符。'
    }

    return {
        errors,
        isValid:isEmpty(errors)
    }
}