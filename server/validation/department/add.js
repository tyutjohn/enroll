/**
 * @ Author: tyutjohn
 * @ Create Time: 2020-04-23 16:23:29
 * @ Modified by: tyutjohn
 * @ Modified time: 2020-04-23 16:53:27
 * @ Github: https://github.com/tyutjohn
 */

const Validator=require('validator')
const isEmpty=require('../is-empty')

module.exports=validateDepAddInput=(data)=>{
    let errors={}
    //验证是否为字符串
    data.department_id=!isEmpty(data.department_id)?data.department_id:''
    data.department_name=!isEmpty(data.department_name)?data.department_name:''

    if(Validator.isEmpty(data.department_id)){
        errors.department_id='部门编号不能为空'
    }

    if(Validator.isEmpty(data.department_name)){
        errors.department_name='部门名称不能为空'
    }

    return {
        errors,
        isValid:isEmpty(errors)
    }
}