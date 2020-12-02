const multer=require('@koa/multer')
const path=require('path')

//初始化multer,自定义图片路径和名称
const storage=multer.diskStorage({
    destination:'public/uploads/'+new Date().getFullYear() + (new Date().getMonth()+1) + new Date().getDate(),
    filename(ctx,file,cb){
        const filenameArr=file.originalname.split('.')
        cb(null,Date.now()+'.'+filenameArr[filenameArr.length-1])
    }
})

//文件上传限制
const limits = {
    fields: 10,//非文件字段的数量
    fileSize: 500 * 1024,//文件大小 单位 b
    files: 1//文件数量
}

const upload=multer({storage,limits})

module.exports=upload