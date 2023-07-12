const express = require('express')  //express 모듈을 가져옴
const app = express()               //express app 생성, 'app'은 웹서버를 나타내는 중심 객체
const port = 5000
//body-parser
app.use(express.json());                        //application/json
app.use(express.urlencoded({extended: true}));  //application/x-www-form-urlencoded

const User  = require("./models/User") //User.js 갖고오기
const config = require("./config/key")

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI).then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))



app.get('/', (req, res) => res.send('Hello World! nodemon'))    // 루트 경로('/')요청이 들어왔을 때 "Hello World" 라는 응답을 보냄

//register route 만들기
app.post('/register', async(req, res) => {
    //회원가입 할때 필요한 정보들을 client에서 가져오면
    //그것들을 데이터 베이스에 넣어준다

    const user = new User(req.body)
    await user
    .save()
        .then(() => {
            res.status(200).json({
                success: true
            })
        })
        .catch((err) => {
            res.json({
                success: false, err: err
            })
        }); 
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))   //지정된 포트 번호에서 서버가 시작되면 콘솔에 메시지 표시

