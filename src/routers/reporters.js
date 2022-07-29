const express = require('express')
const router = express.Router()
const Reporter = require('../models/reporters')
const auth = require('../middelware/auth')
const multer = require('multer')


router.post('/signup',async(req,res)=>{
    try{
        const reporter= new Reporter(req.body)
        const token = await reporter.generateToken()
        await reporter.save()
        res.status(201).send({reporter,token})
    }
    catch(e){
        res.status(400).send(e.message)
    }
   
})


router.post('/login',async(req,res)=>{
    try{
        const reporter  = await Reporter.findByCredentials(req.body.email,req.body.password)
        const token = await reporter.generateToken()
        
        res.status(200).send({reporter,token})
    }
    catch(e){
        res.status(400).send(e.message)
    }
})

router.get('/profile',auth,async(req,res)=>{
    res.status(200).send(req.reporter)
})



router.get('/reporters',(req,res)=>{
    Reporter.find({}).then((data)=>{
        res.status(200).send(data)
    }).catch((e)=>{
        res.status(400).send(e)
    })
})



router.get('/reporters/:id',auth,(req,res)=>{
    const id = req.params.id
    Reporter.findById(id).then((reporter)=>{
        if(!reporter){
        return res.status(404).send('Unable to find reporter')
        }
        res.status(200).send(reporter)
    }).catch((e)=>{
        res.status(500).send(e)
    })
})



router.patch('/reporters/:id',auth,async(req,res)=>{
    try{
    
        const updates = Object.keys(req.body)

        const allowedUpdates = ['name','age','password']
        
        const isValid = updates.every((el)=>allowedUpdates.includes(el))
        console.log(isValid)

        if(!isValid){
            return res.status(400).send("Can't update")
        }
        
        const reporter = await Reporter.findById(req.params.id)
        if(!reporter){
            return res.status(404).send('No user is found')
        }
        
        updates.forEach((el)=> (reporter[el] = req.body[el]))
        await reporter.save()
        res.status(200).send(reporter)
    }
    catch(e){
        res.status(400).send(e)
    }
})


router.delete('/reporters/:id',auth,async(req,res)=>{
    try{
        const reporter = await Reporter.findByIdAndDelete(req.params.id)
        if(!reporter){
           return res.status(404).send('No reporter is found')
        }
        res.status(200).send(reporter)
    }
    catch(e){
        res.status(500).send(e)
    }
})


const uploads= multer({
    limits:{
        fileSize:1000000  //1MB
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|png|jpeg|jfif)$/)){
            return cb (new Error('Please upload an image'))
        }
        cb(null,true)
    }
})
router.post('/profileImage',auth,uploads.single('image'),async(req,res)=>{
    try{
        req.reporter.avatar = req.file.buffer
        await req.reporter.save()
        res.send()
    }
    catch(e){
        res.status(400).send(e)
    }
})



module.exports = router