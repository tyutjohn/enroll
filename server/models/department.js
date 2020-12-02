/**
 * @ Author: tyutjohn
 * @ Create Time: 2020-04-23 16:19:19
 * @ Modified by: tyutjohn
 * @ Modified time: 2020-05-10 18:11:26
 * @ Github: https://github.com/tyutjohn
 */

const mongoose=require('mongoose')
const Schema=mongoose.Schema

//define DepartSchema
const DepartSchema=new Schema({
    department_id:{             //部门id
        type:String,
        unique:true,
        trim:true
    },
    department_name:{
        type:String,
        trim:true
    },     //部门名称
    department_qq:{             //部门qq
        type:Number,
        min:5,
        trim:true
    }
})

module.exports=Department=mongoose.model('departments',DepartSchema)