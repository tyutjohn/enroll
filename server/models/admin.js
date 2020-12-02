/**
 * @ Author: tyutjohn
 * @ Create Time: 2020-04-22 20:43:26
 * @ Modified by: tyutjohn
 * @ Modified time: 2020-05-10 18:11:05
 * @ Github: https://github.com/tyutjohn
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

//实例化数据模板
const adminSchema = new Schema({
    name: {                     //管理员称呼
        type: String,
        trim: true,
        required: true
    },
    phone: {                    //管理员联系电话
        type: String,
        trim: true,
        required: true,
        unique:true
    },
    password: {                 //管理员密码
        type: String,
        required: true,
        trim:true
    },
    department: {               //管理员部门
        type: String,
        trim: true
    },
    avatar: String,             //管理员头像
    rank: Number,               //管理员等级,0为超级管理员，1为普通管理员
    create_time: {              //创建时间
        type: Date,
        default: Date.now
    },
    update_time: {              //更新时间
        type: Date,
        default: Date.now
    },
    state: {                    //当前状态
        type: Number,
        default: 0
    },
})

module.exports = Admin = mongoose.model("admins", adminSchema)