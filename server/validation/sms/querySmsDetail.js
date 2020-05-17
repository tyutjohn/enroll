/**
 * @ Author: tyutjohn
 * @ Create Time: 2020-04-26 17:46:13
 * @ Modified by: tyutjohn
 * @ Modified time: 2020-04-26 18:17:51
 * @ Github: https://github.com/tyutjohn
 */

const Validator=require('validator')
const isEmpty=require('../is-empty')

module.exports=ValidatorQuerySmsDetail=(data)=>{
    let errors={}
    //验证是否是字符串
    data.PhoneNumber=!isEmpty(data.PhoneNumber)?data.PhoneNumber:''
    data.SendDate=!isEmpty(data.SendDate)?data.SendDate:''

    if(Validator.isEmpty(data.PhoneNumber)){
        errors.PhoneNumber='未选择查询的号码'
    }

    if(Validator.isEmpty(data.SendDate)){
        errors.SendDate='未选择查询的日期'
    }

    if(!Validator.isLength(data.PageSize,{
        min:1,
        max:50
    })){
        errors.PageSize='短信记录的数量取值范围为1~50'
    }

    return {
        errors,
        isValid:isEmpty(errors)
    }
}