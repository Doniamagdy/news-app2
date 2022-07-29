const express = require ('express')
const jwt = require('jsonwebtoken')
const reporterRouter = require('./routers/reporters')
const newsRouter = require('./routers/news')

const app =express()
const port = process.env.PORT || 3000

require('./db/mongoose')

app.use(express.json())
app.use(reporterRouter)
app.use(newsRouter)


const myToken = () =>{
    const token = jwt.sign ({_id:'123'},'nodecourse')

    const tokenVerify = jwt.verify(token,'nodecourse')
    console.log(tokenVerify)
    }
    myToken()

app.listen(port,()=>console.log('server is running ..'))
