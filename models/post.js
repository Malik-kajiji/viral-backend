const mongoose = require('mongoose')

const schema = mongoose.Schema

const postSchema = new schema({
    postType:{
        type:String,
        required:true,
        enum:['photos','design']
    },
    postNumber:{
        type:Number,
        require:true
    },
    state: {
        type:String,
        required:true,
        enum:['في قائمة الانتظار','تم التجهيز','تم التنزيل'],
        default:'في قائمة الانتظار'
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
    postUrl: {
        type:String,
        default:''
    },
    virusId_designer: {
        type:String,
    },
    virusId_photographer: {
        type:String,
    },
    virusId_uploader:{
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
    },
})

postSchema.statics.getPackagePosts = async function(package_id){
    const posts = await this.find({package_id})

    return posts
}

postSchema.statics.addPosts = async function(documents){
    const videos = await this.insertMany(documents)

    return videos
}

postSchema.statics.updateToPrepared = async function(post_id){
    const post = await this.findOneAndUpdate({_id:post_id},{state:'تم التجهيز'})

    return {...post._doc,state:'تم التجهيز'}
}

postSchema.statics.updateToCompleted = async function(post_id,post_url) {
    const post = await this.findOneAndUpdate({_id:post_id},{post_url,state:'تم التنزيل'})

    return {...post._doc,post_url,state:'تم التنزيل'}
}

module.exports = mongoose.model('post',postSchema)