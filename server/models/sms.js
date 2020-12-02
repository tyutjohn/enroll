/**
 * @ Author: tyutjohn
 * @ Create Time: 2020-04-23 17:08:46
 * @ Modified by: tyutjohn
 * @ Modified time: 2020-04-29 21:10:58
 * @ Github: https://github.com/tyutjohn
 */

const mongoose=require('mongoose')
const Schema=mongoose.Schema

//define SmsSchema
const SmsSchema=new Schema({
    TemplateType:Number,    //短信类型，0：验证码 1：短信通知 2:推广短信 3:国际/港澳台消息
    TempalteName:{          //模板名称
        type:String,
        min:1,
        max:30,
        trim:true
    },    
    TemplateContent:{       //模板内容
        type:String,
        min:1,
        max:500,
        trim:true
    },
    Remark:{                //短信模板申请说明
        type:String,
        min:1,
        max:100,
        trim:true
    },
    SignName:{              //短信签名
        type:String,
        trim:true
    },        
    TemplateCode:{           //短信模板ID
        type:String,
        trim:true
    }    
})

module.exports=Sms=mongoose.model('sms',SmsSchema)