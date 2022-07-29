const mongoose = require ('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const reporterSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
            throw new Error ('Email is invalid')
            }
        }
    },
    age:{
        type:Number,
        default:20,
        validate(value){
            if(value<0){
                throw new Error('Age must be positive number')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:6,
       validate(value){
        let strongPassword = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])");
            if(!strongPassword.test(value)){
               throw new Error('password must include ..')
             }
         }
    },
    phone:{
      type:String,
      validate(value){
        let phoneNumber = new RegExp("^01[0125][0-9]{8}$");
            if(!phoneNumber.test(value)){
            throw new Error('Invalid Number')
            }
         }

    },
    avatar:{
        type:Buffer
    },
   
    tokens:[
        {
            type:String,
            required:true
        }
    ]

})

reporterSchema.virtual('news',{
    ref:'News',
    localField:'_id',
    foreignField:'owner'
})



reporterSchema.pre('save',async function(){
    const reporter = this 
if(reporter.isModified('password'))
reporter.password= await bcryptjs.hash(reporter.password,8)

})

reporterSchema.statics.findByCredentials = async(email,password)=>{
    const reporter = await Reporter.findOne({email})
    
    if(!reporter){
        throw new Error('Please check your email or password')
    }

   const isMatch = await bcryptjs.compare(password,reporter.password)
   if(!isMatch){
    throw new Error ('Please check your email or password')
   }
return reporter
}

reporterSchema.methods.generateToken = async function(){
    const reporter = this
    const token = jwt.sign({_id:reporter._id.toString()},'nodecourse')
    reporter.tokens = reporter.tokens.concat(token)
    await reporter.save()
    return token
}


const Reporter= mongoose.model('Reporter',reporterSchema)

module.exports = Reporter