/**
 * @ Author: tyutjohn
 * @ Create Time: 2020-04-22 21:44:03
 * @ Modified by: tyutjohn
 * @ Modified time: 2020-05-10 13:11:57
 * @ Github: https://github.com/tyutjohn
 */

const Validator = require('validator');
const isEmpty=require('../is-empty');

module.exports=validateInitAdmin=(data)=>{
    let errors={}
    //验证是否是字符串
    data.name=!isEmpty(data.name)?data.name:''
    data.phone=!isEmpty(data.phone)?data.phone:''
    data.password=!isEmpty(data.password)?data.password:''
    data.password2=!isEmpty(data.password2)?data.password2:''

    if(!Validator.isLength(data.name,{min:2,max:10})){
        errors.name='名字的长度不能小于2位且不能超过10位';
    }

    if(Validator.isEmpty(data.name)){
        errors.name='名字不能为空';
    }

    if(Validator.isEmpty(data.phone)){
        errors.phone='电话号码不能为空';
    }

    if(!Validator.isMobilePhone(data.phone,['zh-CN', 'zh-HK', 'zh-MO', 'zh-TW'])){
        errors.phone='联系电话格式错误'
    }

    if(Validator.isEmpty(data.password)){
        errors.password="密码不能为空"
    }

    if(!Validator.isLength(data.password,{min:6,max:30})){
        errors.password='密码的长度不能小于6位且不能超过30位';
    }

    if(Validator.isEmpty(data.password2)){
        errors.password2="验证密码不能为空"
    }

    if(!Validator.equals(data.password,data.password2)){
        errors.password2='两次密码不一致';
    }

    return {
        errors,
        isValid:isEmpty(errors)
    }
}