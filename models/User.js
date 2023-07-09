const mongoose = require('mongoose')

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

const User = mongoose.model('User',userSchema)  //스키마를 감싸주는 모델을 만듦

module.exports = { User } //모듈을 다른 곳에서도 쓸 수 있게 함