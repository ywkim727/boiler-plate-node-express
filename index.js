const express = require('express')  //express 모듈을 가져옴
const app = express()               //express app 생성, 'app'은 웹서버를 나타내는 중심 객체
const port = 5000

const mongoose = require('mongoose')
mongoose.connect(`mongodb+srv://uddn:mxUsZx43k8ag3T7J@boilerplate.8k8ggq5.mongodb.net/`).then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))



app.get('/', (req, res) => res.send('Hello World!'))    // 루트 경로('/')요청이 들어왔을 때 "Hello World" 라는 응답을 보냄

app.listen(port, () => console.log(`Example app listening on port ${port}!`))   //지정된 포트 번호에서 서버가 시작되면 콘솔에 메시지 표시

