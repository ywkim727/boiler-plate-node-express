const express = require('express')  //express 모듈을 가져옴
const app = express()               //express app 생성, 'app'은 웹서버를 나타내는 중심 객체
const port = 5000

const cookieParser = require('cookie-parser')

app.use(express.json());                        //application/json
app.use(express.urlencoded({extended: true}));  //application/x-www-form-urlencoded
app.use(cookieParser());

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
app.post('/login', async (req, res) => {
    try {
        // 요청된 이메일을 데이터베이스에서 있는지 찾는다
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.json({
            loginSuccess: false,
            message: "제공된 이메일에 해당하는 유저가 없습니다."
            });
        }
        // 요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 번호인지 확인
        const isMatch = await user.comparePassword(req.body.password);
        if (!isMatch) {
            return res.json({
            loginSuccess: false,
            message: "비밀번호가 틀렸습니다."
            });
        }
        // 비밀번호가 맞다면 토큰을 생성
        const token = await user.generateToken();
        // 토큰을 저장한다. 여기에서는 쿠키에 저장하도록 예시를 들었습니다.
        res.cookie("x_auth", token)
        .status(200)
        .json({ loginSuccess: true, userId: user._id });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))   //지정된 포트 번호에서 서버가 시작되면 콘솔에 메시지 표시

