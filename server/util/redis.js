/**
 * @ Author: tyutjohn
 * @ Create Time: 2020-04-22 21:10:46
 * @ Modified by: tyutjohn
 * @ Modified time: 2020-05-15 20:17:05
 * @ Github: https://github.com/tyutjohn
 */

const redis=require('redis')
const Redisconfig=require('../config/redis').redis
//连接redis数据库
const client=redis.createClient(Redisconfig.port,Redisconfig.url)
const clientSub=redis.createClient(Redisconfig.port,Redisconfig.url)
const clientPub=redis.createClient(Redisconfig.port,Redisconfig.url)

client.on("error",err=>{
  console.log('redis connect err',err);
});

client.on('connect',()=>{
  console.log('redis cocnnect success');
})

clientSub.on('connect',()=>{
    console.log('redis clientsub connect success')
})

clientPub.on('connect',()=>{
    console.log('redis clientpub connect success')
})

//验证redis
// client.auth(Redisconfig.password);

const redisHelper = {};

/**
 * redisHelper setString function
 * @param key
 * @param value
 * @param expire
 */
redisHelper.setString = (key, value, expire) => {
    return new Promise((resolve, reject) => {
        client.set(key, value, (err, result)=>{

            if (err) {
                console.log(err);
                reject(err);
            }

            if (!isNaN(expire) && expire > 0) {
                client.expire(key, parseInt(expire));
            }
            resolve(result)
        })
    })
}

/**
 * redisHelper getString function
 * @param key
 */
redisHelper.getString = (key) => {
    return new Promise((resolve, reject) => {
        client.get(key, (err, result)=>{
            if (err) {
                console.log(err);
                reject(err)
            }
            resolve(result)
        })
    })
}

/**
 * redisHelper incr function
 * @param key
 */
redisHelper.incrInt=(key)=>{
    return new Promise((resolve,reject)=>{
        client.incr(key,(err,result)=>{
            if(err){
                console.log(err)
                reject(err)
            }
            resolve(result)
        })
    })
}

/**
 * redisHelper hmset
 * @param key
 * @param JSON Object
 */
redisHelper.hmset=(key,value)=>{
    return new Promise((resolve,reject)=>{
        client.hmset(key,value,(err,result)=>{
            if(err){
                console.log(err)
                reject(err)
            }
            resolve(result)
        })
    })
}

/**
 * redisHelper hgetall
 * @param key
 */
redisHelper.hgetall=(key)=>{
    return new Promise((resolve,reject)=>{
        client.hgetall(key,(err,result)=>{
            if(err){
                console.log(err)
                reject(err)
            }
            resolve(result)
        })
    })
}

/**
 * redisHelper hdel
 * @param hkey
 * @param key
 */
redisHelper.hdel=(hkey,key)=>{
    return new Promise((resolve,reject)=>{
        client.hdel(hkey,key,(err,result)=>{
            if(err){
                console.log(err)
                reject(err)
            }
            resolve(result)
        })
    })
}

/**
 * redisHelper publish
 * @param channel
 * @param value
 */
redisHelper.publish=(channel,value)=>{
    return new Promise((resolve,reject)=>{
        clientPub.publish(channel,value,(err,result)=>{
            if(err){
                console.log(err)
                reject(err)
            }
            resolve(result)
        })
    })
}

/**
 * redisHelper subscribe
 * @param channel
 */
redisHelper.subscribe=(channel)=>{
    return new Promise((resolve,reject)=>{
        clientSub.subscribe(channel,(err,result)=>{
            if(err){
                console.log(err)
                reject(err)
            }
            resolve(result)
        })
    })
}


module.exports = redisHelper

