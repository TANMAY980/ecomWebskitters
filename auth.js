const express=require('express')
const dotEnv=require('dotenv')
const path=require('path')
const ejs=require('ejs')
const DB=require('./app/config/dbConfig')
const bodyParser = require('body-parser')
const cookieparser=require('cookie-parser')
const session=require('express-session')




dotEnv.config()
const app=express()
DB()


app.use(session({
    cookie: {
        maxAge: 60000
    },
    secret: process.env.COKKIE_PARSER_SECRET_KEY,
    resave: false,
    saveUninitialized: false
}));

app.use(cookieparser());

app.set("view engine","ejs")
app.set("views","views")

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname,"public")))
app.use('/uploads',express.static('uploads'))
app.use('/uploads', express.static(__dirname + '/uploads'));




const adminroute=require('./app/router/adminrouter')
app.use('/admin',adminroute)

const userroute=require('./app/router/userrouter')
app.use(userroute)

const port=process.env.PORT||9000

app.listen(port,()=>{
    console.log(`server running on http://localhost:${port}`);    
})