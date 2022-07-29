const mongoose = require('mongoose')
const date = require('date-and-time');
const now = new Date();
date.format(now, 'ddd, MMM DD YYYY');
console.log(now)
const News = mongoose.model('News',{
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    avatarnews:{
        type:Buffer
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'News'  
    },
    time:{
         type: Date, 
         default: Date.now
    }
    
})
module.exports = News