const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema

const virusSchema = new Schema({
    name: {
        type:String,
        required:true,
    },
    password: {
        type:String,
        required:true,
    },
    jobTitle:{
        type:String,
        default:'',
        required:true
    },
    workingSince: {
        type:Date,
        required:true
    },
    virusImageUrl: {
        type:String,
        default:'some dummy text url',
        required:true,
    },
    workPeriods: {
        type:Array,
        default:[]
    },
    passwordChangedAt: {
        type:Date
    }
})

virusSchema.statics.addVirus = async function(name,password,jobTitle,virusImageUrl) {
    const exists = await this.findOne({name})
    if(exists){
        throw Error('الاسم موجود بالفعل')
    }else {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password,salt)
        const virus = await this.create({name,password:hash,jobTitle,workingSince:Date.now(),passwordChangedAt:Date.now(),virusImageUrl})
        return virus
    }
}

virusSchema.statics.removeVirus = async function(_id) {
    const exists = await this.findOne({_id})
    if(!exists){
        throw Error('الاسم غير موجود')
    }
    const removed = await this.findOneAndDelete({_id})
    return removed
}

virusSchema.statics.login = async function(name,password){
    const virus = await this.findOne({name})
    if(!virus){
        throw Error('الحساب غير موجود يرجى انشاء حساب')
    }

    const match = await bcrypt.compare(password,virus.password)

    if(!match){
        throw Error('كلمة مرور غير صحيحة')
    }

    return virus
}


virusSchema.statics.changePassword = async function(_id,password) {
    const virus = await this.findOne({_id})
    if(!virus){
        throw Error('الحساب غير موجود يرجى انشاء حساب')
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password,salt);

    const updatedVirus = await this.findOneAndUpdate({_id},{password:hash,passwordChangedAt:Date.now()})

    return {...virus._doc,password:hash}
}

virusSchema.statics.editVirus = async function(_id,name,jobTitle,virusImageUrl){
    const virus = await this.findOneAndUpdate({_id},{name,jobTitle,virusImageUrl})

    return {...virus._doc,name,jobTitle,virusImageUrl}
}

virusSchema.statics.setWorkPeriods = async function(_id,workPeriods){
    const virus = await this.findOneAndUpdate({_id},{workPeriods})

    return virus
}

module.exports = mongoose.model('virus',virusSchema)