const mongoose = require('mongoose')

const schema = mongoose.Schema

const videoSchema = new schema({
    videoNumber: {
        type:Number,
        required:true
    },
    state: {
        type:String,
        required:true,
        enum:['في قائمة الانتظار','قيد التصوير','قيد المونتاج','قيد التنزيل','تم التنزيل']
    },
    clientId: {
        type:String,
        required:true
    },
    clientName: {
        type:String,
        required:true
    },
    clientImageUrl: {
        type:String,
        default:'',
        required:true
    },
    day: {
        type:String,
        required:true,
        enum:['سبت','أحد','إثنين','ثلثاء','إربعاء','خميس','جمعة']
    },
    idea: {
        type:String,
        default:''
    },
    scenario: {
        type:String,
        default:''
    },
    hook:{
        type:String,
        default:''
    },
    video_url: {
        type:String,
        default:''
    },
    virusId_Idea: {
        type:String,
    },
    virusId_Record: {
        type:String,
    },
    virusId_Edit: {
        type:String,
    },
    virusId_Upload: {
        type:String,
    },
    weakNumber: {
        type:Number,
        required:true
    },
    isDelayed: {
        type:Boolean,
        default:false
    },
    package_id: {
        type:String,
        required:true
    }
})

videoSchema.statics.getAllVideos = async function(){
    const videos = await this.find()

    return videos
}

videoSchema.statics.getCientVideos = async function(clientId){
    const videos = await this.find({clientId})

    return videos
}

videoSchema.statics.getSingleVideo = async function(_id){
    const video = await this.findOne({_id})

    return video
}

videoSchema.statics.addVideos = async function(documents){
    const videos = await this.insertMany(documents)

    return videos
}

videoSchema.statics.addVideo = async function(clientId,num,day,weakNumber){
    const video = await this.create({
        videoNumber:num,
        state:'في قائمة الانتظار',
        clientId,
        day,
        weakNumber
    })

    return video
}

videoSchema.statics.removeVideo = async function(_id){
    const video = await this.findOneAndDelete({_id})

    return video
}

videoSchema.statics.updateState = async function(_id,newState){
    const video = await this.findOneAndUpdate({_id},{state:newState})

    return {...video._doc,state:newState}
}

videoSchema.statics.updateVideo = async function(_id,day,scenario,video_url,virusId){
    const video = await this.findOneAndUpdate({_id},{day,scenario,video_url,virusId})

    return {...video._doc,day,scenario,video_url,virusId}
}



videoSchema.statics.getPackageVideos = async function(package_id){
    const videos = await this.find({package_id})

    return videos
}

videoSchema.statics.updateToRecord = async function(video_id,idea,scenario,hook) {
    const video = await this.findOneAndUpdate({_id:video_id},{idea,scenario,hook,state:'قيد التصوير'})

    return {...video._doc,idea,scenario,hook,state:'قيد التصوير'}
}

videoSchema.statics.updateToEdit = async function(video_id) {
    const video = await this.findOneAndUpdate({_id:video_id},{state:'قيد المونتاج'})

    return {...video._doc,state:'قيد المونتاج'}
}

videoSchema.statics.updateToUpload = async function(video_id) {
    const video = await this.findOneAndUpdate({_id:video_id},{state:'قيد التنزيل'})

    return {...video._doc,state:'قيد التنزيل'}
}

videoSchema.statics.updateToCompleted = async function(video_id,video_url) {
    const video = await this.findOneAndUpdate({_id:video_id},{video_url,state:'تم التنزيل',isDelayed:false})

    return {...video._doc,video_url,state:'تم التنزيل'}
}

module.exports = mongoose.model('video',videoSchema)