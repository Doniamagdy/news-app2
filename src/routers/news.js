const express = require('express')
const router = express.Router()
const News = require('../models/news')
const auth = require('../middelware/auth')

router.post('/addnews',auth,async(req,res)=>{
    try{
        
        const news = new News({...req.body,owner:req.reporter._id})
        await news.save()
        res.status(200).send(news)
    
    }
    catch(e){
        res.status(400).send(e.message)
    }
})



router.get('/news',auth,async(req,res)=>{
    try{
    await req.reporter.populate('news')
        res.status(200).send(req.reporter.news)
    }
    catch(e){
        res.status(500).send(e.message)
    }

})


router.get('/news/:id',auth,async(req,res)=>{
    try{
        const _id = req.params.id
        const news = await News.findOne({_id,owner:req.reporter._id})
        if(!news){
            return res.status(404).send('no news are found')
        }
        await news.populate('owner')
        res.status(200).send(news.owner)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})


router.patch('/news/:id',auth,async(req,res)=>{
    try{
        const _id = req.params.id
        const news = await News.findOneAndUpdate(
            {_id,owner:req.reporter._id},
            req.body,
            {
            new:true,
            runValidators:true
            }
        )
        if(!news){
            return res.status(404).send('No news are found')
        }
        res.status(200).send(news)
    }
    catch(e){
        res.status(400).send(e.message)
    }
})


router.delete('/news/:id',auth,async(req,res)=>{
    try{
        const _id= req.params.id
        const news = await News.findOneAndDelete({_id,owner:req.reporter._id})
        if(!news){
            return res.status(404).send('No news are found')
        }
        res.status(200).send(news)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})



module.exports = router