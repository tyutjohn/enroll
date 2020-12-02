/**
 * @ Author: tyutjohn
 * @ Create Time: 2020-04-22 22:41:23
 * @ Modified by: tyutjohn
 * @ Modified time: 2020-05-01 09:00:34
 * @ Github: https://github.com/tyutjohn
 */

const mongoose=require('mongoose')
const db=require('../config/mongodb').mongoURI

//连接数据库
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)
mongoose.connect(db,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log('mongodb connected...');
}).catch((err)=>{
    console.log(err);
})

module.exports=mongoose