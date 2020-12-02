/**
 * @ Author: tyutjohn
 * @ Create Time: 2020-04-26 18:17:24
 * @ Modified by: tyutjohn
 * @ Modified time: 2020-05-10 18:11:44
 * @ Github: https://github.com/tyutjohn
 */

const mongoose=require('mongoose')
const Schema=mongoose.Schema

//实例化数据模板
const userSchema=new Schema({
    name:{                  //姓名
        type:String,
        trim:true
    },            
    sex:String,             //性别
    class:{                 //班级
        type:Number,
        trim:true
    },           
    major:{                 //专业
        type:String,
        trim:true
    },           
    schoolNum:{             //学号
        type:Number,
        trim:true
    },       
    introduce:{             //介绍
        type:String,
        trim:true
    },       
    department:String,      //第一志愿
    department2:String,     //第二志愿
    score:{                 //分数
        type:Number,
        trim:true
    },           
    evaluate:{              //评价
        type:String,
        trim:true
    },        
    sms_status:{            //短信状态
        type:Number,
        default:0
    },
    itv_status:{            //是否面试状态
        type:Number,
        default:0
    },
    pass_status:{           //录取状态,0为未通知，1为录取，2为不录取
        type:Number,
        default:0
    },         
    phone:{                 //联系电话
        type:Number,
        trim:true
    },           
    campus:String,          //校区 
    ip:String               //客户端ip  
})

module.exports=User=mongoose.model('users',userSchema)