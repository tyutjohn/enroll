# enroll-2.0-beat
![Author](https://img.shields.io/badge/tyutjohn-enrollmanage-brightgreen) ![node](https://img.shields.io/badge/node-%3E%3D%206.0.0-brightgreen) ![version](https://img.shields.io/badge/version-v2.0-blue)

报名管理系统2.0,新增即时聊天等功能，原有的报名管理功能更加强大，可以支持动态发布报名选项



# 项目介绍

**这是一套集成前后台的完整的SPA多页面报名管理系统**

主要**[子系统](https://github.com/tyutjohn/enrollmanage/System.md)**分为报名系统，面试管理系统，在线聊天系统，信息统计系统

## 项目架构

######   *server端*      ![node](https://img.shields.io/badge/node-v12.14.0-informational) ![koa](https://img.shields.io/badge/koa-v2.11.0-informational) ![mongoose](https://img.shields.io/badge/mongoose-v5.9.10-informational) ![redis](https://img.shields.io/badge/redis-v3.0.2-informational) ![socket.io](https://img.shields.io/badge/socket.io-v2.3.0-informational) ![aliclound-sms](https://img.shields.io/badge/alicloudsms-v1.1.6-informational) ![amap](https://img.shields.io/badge/amap-key-informational)



######   app端  ![vue](https://img.shields.io/badge/vue-v2.6.11-informational) ![vuecli](https://img.shields.io/badge/vuecli-v4.3.0-informational) ![element](https://img.shields.io/badge/element-v2.13.1-informational) ![echarts](https://img.shields.io/badge/echarts-v4.7.0-informational) ![axios](https://img.shields.io/badge/axios-v0.19.2-informational) 



# 项目目录结构
```markdown
app
	src			//前端入口
server
	index.js	//后端入口文件
```



# 本地启动
1. 安装运行redis,mongodb数据库
2. 安装依赖
```
cd app/
cnpm install

cd server/
cnpm install
```
3. 启动项目
``` bash
# 前台启动地址，localhost:8080
cd app/
npm run dev

# 后台启动地址，localhost:3000
node server/bin/www

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run all tests
npm test
```



# Beat

此版本为beat测试版，websocket即时通讯进度完成，可视化，动态化表单报名模块未完成，因为考试等诸多原因，预计下次构建时间为夏天，尽情期待



# 关于作者

+ 太原理工大学 johnwang,[个人博客](www.tyutjohn.com)
+ 如有问题请提交issues
+ 任何人未经允许，禁止用于商业/营销/宣传等。
+ 联系作者请至邮(tyutjohnwang@163.com)

# END
如果觉得我的项目不错的话，就给个star鼓励一下吧