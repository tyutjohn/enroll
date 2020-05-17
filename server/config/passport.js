/**
 * @ Author: tyutjohn
 * @ Create Time: 2020-04-22 20:37:36
 * @ Modified by: tyutjohn
 * @ Modified time: 2020-04-22 23:37:02
 * @ Github: https://github.com/tyutjohn
 */

const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const secretOrKey=require('../config/mongodb').secretOrKey;
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secretOrKey;
const mongoose=require('mongoose');
//model为集合名
const User=mongoose.model('admins');
module.exports=passport=>{
    passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
        // console.log(jwt_payload);
        const user=await User.findById(jwt_payload.id);
        if(user){
            return done(null,user)
        }else{
            return done(null,false);
        }
    }));
};