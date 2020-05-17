const IO = require('socket.io')
const {
    getFulldate
} = require('../util/socket')
const redis = require('../util/redis')

creatSocket = app => {
    const io = IO(app)

    //每个客户端socket连接都会触发connection
    io.on('connection', clientSocket => {
        clientSocket.on('socketlogin',data=>{
            clientSocket.broadcast.emit("socketmsg", data)
        })

    })

    //单独的命名空间
    //命名空间：监听属性改变的，deviceInfo
    const deviceIo = io.of('/deviceInfo')
    deviceIo.on('connection', clientSocket => {
        //管理员
        clientSocket.on('clientMessage', data => {

            //通知管理员上线
            clientSocket.broadcast.emit('reMessage', data)
            let result = {}
            result[data.name] = data.phone
            redis.hmset('adminId', result, err => {
                console.log(err)
            })

            //管理员下线
            clientSocket.on('disconnect', () => {
                redis.hdel('adminId', data.name, err => {
                    console.log(err)
                })
            })
        })

        //用户登录
        clientSocket.on('userLogin', data => {
            //加入房间
            clientSocket.join(data.phone, () => {
                console.log(data.name + '进入了房间' + data.phone)
            }) //join(房间名)加入房间

            //退出房间
            clientSocket.on('disconnect', () => {
                console.log(data.name + '退出了房间')
            })

            //监听客户端发送的sendMsg事件
            clientSocket.on('sendMsg', msg => {
                console.log(data)
                //to(房间名)表示给同一房间用户推送消息
                clientSocket.broadcast.to(data.phone).emit("receiveMsg", msg)
            })
        })

    })

}

module.exports = creatSocket