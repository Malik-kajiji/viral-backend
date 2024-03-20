const mongoose = require('mongoose')

const schema = mongoose.Schema

const taskSchema = new schema({
    type:{
        type:String,
        required:true,
        enum:['getIdea','record','edit','upload','photos','design','upload-post','other']
    },
    isDelayed:{
        type:Boolean,
        default:false,
        required:true
    },
    isCurrentWeek: {
        type:Boolean,
        default:true,
        required:true
    },
    day: {
        type:String,
        required:true
    },
    videoId: {
        type:String,
    },
    videoNumber: {
        type:Number,
    },
    postId: {
        type:String,
    },
    postNumber: {
        type:Number,
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
        required:true
    },
    packageId:{
        type:String,
        required:true
    },
    virusId: {
        type:String,
    },
    virusName: {
        type:String,
        required:true
    },
    virusImageUrl: {
        type:String,
        required:true
    },
    isCompleted: {
        type:Boolean,
        default:false,
        required:true
    },
    completeDayDate: {
        type:Number
    },
    completeMonthDate: {
        type:String,
    },
    completeYearDate: {
        type:Number
    },
    taskDescription: {
        type:String,
        default:''
    },
    videoUrl: {
        type:String,
        default:''
    },
    postUrl: {
        type:String,
        default:''
    }
})

taskSchema.statics.getVirusTasks = async function(virusId){
    const tasks = await this.find({virusId,isCompleted:false})
    const filteredTask = tasks.filter(e => !(!e.isCurrentWeek && e.isDelayed))

    return filteredTask
}

taskSchema.statics.completeTask = async function(task_id,completeDayDate,completeMonthDate,completeYearDate) {
    const task = await this.findOneAndUpdate({_id:task_id},{isCompleted:true,completeDayDate,completeMonthDate,completeYearDate})

    return {...task._doc,isCompleted:true}
}

taskSchema.statics.getSingleTask = async function(_id) {
    const task = await this.findOne({_id})

    return task
}

taskSchema.statics.getCompletedTasks = async function(virusId,completeMonthDate,completeYearDate) {
    const tasks = await this.find({virusId,completeMonthDate,completeYearDate})

    return tasks
}

//
taskSchema.statics.createTask = async function(type,day,videoId,clientId,virusId){
    const task = await this.create({type,day,videoId,clientId,virusId})

    return task
}

taskSchema.statics.getAllTasks = async function(){
    const tasks = await this.find()

    return tasks
}

taskSchema.statics.getClientTasks = async function(clientId){
    const tasks = await this.find({clientId})

    return tasks
}



taskSchema.statics.rejectTask = async function(_id,reason){
    const task = await this.findOneAndUpdate({_id},{isSuccessfull:false,reason})

    return {...task._doc,isSuccessfull:false,reason}
}

taskSchema.statics.redirectTask = async function(_id,virusId){
    const task = await this.findOneAndUpdate({_id},{isSuccessfull:true,reason:'',virusId})

    return {...task._doc,isSuccessfull:true,reason:'',virusId}
}

taskSchema.statics.editTask = async function(_id,type,isSuccessfull,date,videoId,clientId,virusId){
    const task = await this.findOneAndUpdate({_id},{type,isSuccessfull,date,videoId,clientId,virusId})

    return {...task._doc,type,isSuccessfull,date,videoId,clientId,virusId}
}

taskSchema.statics.deleteTask = async function(_id){
    const task = await this.findOneAndDelete({_id})

    return task
}

module.exports = mongoose.model('task',taskSchema)