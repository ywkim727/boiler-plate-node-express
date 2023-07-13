const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10 //salt가 몇자리인지, salt를 통해 비밀번호를 암호화 합니다
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name : {
        type : String,
        maxlength : 50
    },
    email : {
        type : String,
        trim : true,    //빈칸을 없애주는 역할
        unique : 1      //똑같은 이메일 방지
    },
    password : {
        type : String,
        minlength : 5
    },
    lastname : {
        type : String,
        maxlength : 50
    },
    role : {
        type : Number,  //Number가 0이면 유저, 1이면 관리자
        default : 0
    },
    image : String,
    token : {
        type : String
    },
    tokenExp : {        //token의 유효기간
        type : Number
    }
})

//pre: save 이전에 function을 수행시킴
userSchema.pre('save', function(next) {
    //비밀번호를 암호화 시킨다
    let user = this;

    if(user.isModified('password')){                        //password가 변경이 되었을 경우에만 암호화를 시킨다
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)
            bcrypt.hash(user.password, salt, function(err, hash) {    
                // Store hash in your password DB.
                if(err) return next(err)
                user.password = hash
                next()
            });
        });
    } else {
        next()
    }
    

})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) {
            console.log(cb)
            return cb(err)
        }
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb) {

    let user = this

    //jsonwebtoken을 이용해서 token을 생성하기
    let token = jwt.sign(user._id.toHexString(), 'secretToken')
    
    user.token = token
    user.save(function(err, user) {
        if(err) return cb(err);
        cb(null, user)          //save 잘 됐으면 user 정보만 넘기면 된다
    })
}

const User = mongoose.model('User',userSchema)  //스키마를 감싸주는 모델을 만듦

module.exports = User //모듈을 다른 곳에서도 쓸 수 있게 함