const Validator=require('validator')
const isEmpty=require('../is-empty')

module.exports=ValidatorEnrollScore=(data)=>{
    let errors={}

    //验证是否有字符串
    data.score=!isEmpty(data.score)?data.score:''
    data.evaluate=!isEmpty(data.evaluate)?data.evaluate:''

    if(Validator.isEmpty(data.score)){
        errors.score='请打出您的分数'
    }

    if(Validator.isEmpty(data.evaluate)){
        errors.evaluate='请给出您的评价'
    }

    return {
        errors,
        isValid:isEmpty(errors)
    }
}