/**
 * @ Author: tyutjohn
 * @ Create Time: 2020-04-22 21:43:25
 * @ Modified by: tyutjohn
 * @ Modified time: 2020-05-10 12:38:30
 * @ Github: https://github.com/tyutjohn
 */

const Validator = require('validator');
const isEmpty = require('../is-empty');

module.exports = validateLoginInput=(data)=>{
    let errors = {};
    //验证是否是字符串
    data.phone = !isEmpty(data.phone) ? data.phone : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if (Validator.isEmpty(data.phone)) {
        errors.phone = '电话号码不能为空';
    }

    if(!Validator.isMobilePhone(data.phone,['zh-CN', 'zh-HK', 'zh-MO', 'zh-TW'])){
        errors.phone='联系电话格式错误'
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = "密码不能为空"
    }

    if (!Validator.isLength(data.password, {
            min: 6,
            max: 30
        })) {
        errors.password = '密码的长度不能小于6位且不能超过30位';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}