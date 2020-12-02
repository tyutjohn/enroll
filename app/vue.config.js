/**
 * @ Author: tyutjohn
 * @ Create Time: 2020-05-10 12:28:46
 * @ Modified by: tyutjohn
 * @ Modified time: 2020-05-13 19:02:49
 * @ Github: https://github.com/tyutjohn
 */
module.exports={
    devServer:{
        host:'localhost',
        port:8080,
        proxy:{
            '/api':{
                target:'http://localhost:3000/api/',
                ws:true,
                changeOrigin:true,
                pathRewrite:{
                    '^/api':''
                }
            },
            '/public':{
                target:'http://localhost:3000/public/',
                ws:true,
                changeOrigin:true,
                pathRewrite:{
                    '^/public':''
                }
            },
        }
    }
}