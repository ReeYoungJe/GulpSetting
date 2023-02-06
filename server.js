const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require("fs")


const router = require('./router/main')(app, fs);

app.set('views', __dirname + '/src'); //ROOT 지정
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

const server = app.listen(3000, function(){
    console.log("Express server 포트 3000 스타트")
});


app.use(express.static('dist/css')); //css 사용



