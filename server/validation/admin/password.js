/**
 * @ Author: tyutjohn
 * @ Create Time: 2020-04-22 21:52:47
 * @ Modified by: tyutjohn
 * @ Modified time: 2020-04-23 16:25:39
 * @ Github: https://github.com/tyutjohn
 */

const Validator=require('validator')
const isEmpty=require('../is-empty')

module.exports=validatorPasswordInput=(data)=>{
    let errors={};
    //验证是否是字符串
    data.password=!isEmpty(data.password)?data.password:'';
    data.password2=!isEmpty(data.password2)?data.password2:'';

    if(Validator.isEmpty(data.password)){
        errors.password='密码不能为空'
    }

    if(!Validator.isLength(data.password,{min:6,max:30})){
        errors.password='密码的长度不能小于6位且不能超过30位';
    }

    if(Validator.isEmpty(data.password2)){
        errors.password='验证密码不能为空'
    }

    if(!Validator.equals(data.password,data.password2)){
        errors.password2="两次密码不一致"
    }

    return {
        errors,
        isValid:isEmpty(errors)
    }
}