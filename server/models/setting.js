/**
 * @ Author: tyutjohn
 * @ Create Time: 2020-04-23 11:35:53
 * @ Modified by: tyutjohn
 * @ Modified time: 2020-05-17 08:34:36
 * @ Github: https://github.com/tyutjohn
 */

const mongoose=require('mongoose')
const Schema=mongoose.Schema

//config Schema
const configSchema=new Schema({
    AccessKeyId:{                   //aliyun账户id
        type:String,
        trim:true
    },
    AccessKeySecret:{               //aliyun账户密钥
        type:String,
        trim:true
    },
    queryuptime:Date,               //查询录取开放时间
    querydowntime:Date,             //查询录取结束时间
    signuptime:Date,                //线上报名开放时间
    signdowntime:Date,              //线上报名结束时间
    state:{                         //系统初始化状态
        type:Number,
        default:0
    },
    AmapKey:{                       //高德开放平台key
        type:String,
        trim:true
    }                  
})

module.exports=Setting=mongoose.model("settings",configSchema)