const taskModel = require('../../models/task')
const videoModel = require('../../models/videos')
const virusModel = require('../../models/virus')
const postModel = require('../../models/post')

const handleWorkPeriods = async (_id,workPeriods) => {
    const currentDate = new Date()
    const dayOfMonth = currentDate.getDate();
    const month = currentDate.toLocaleString('ar', { month: 'long' });
    const year = currentDate.getFullYear()

    if(workPeriods.length === 0){
        const newArray = [{year,month,monthNumber:1}]
        await virusModel.setWorkPeriods(_id,newArray)
    }else {
        const lastWorkPeriod = workPeriods[workPeriods.length - 1]
        if(lastWorkPeriod.month !== month || lastWorkPeriod.year !== year){
            const newWorkPeriods = [...workPeriods,{year,month,monthNumber:lastWorkPeriod.monthNumber+1}]
            await virusModel.setWorkPeriods(_id,newWorkPeriods)
        }
    }

    return {dayOfMonth,month,year}
}

const getVirusTasks = async (req,res) => {
    const { _id } = req.virus

    try {
        const tasks = await taskModel.getVirusTasks(_id)
        res.status(200).json({tasks})
    } catch(err) {
        res.status(400).json({message:err.message})
    }
}

const getSingleTask = async (req,res) => {
    const { taskId } = req.params

    try {
        const task = await taskModel.getSingleTask(taskId)

        if(task.type === 'getIdea' || task.type === 'photos' || task.type === 'design'){
            res.status(200).json({task})
        }else if(task.type === 'edit') {
            const video = await videoModel.findOne({_id:task.videoId})
            const virusEditor = await virusModel.findOne({_id:video.virusId_Record})
            const {name,virusImageUrl} = virusEditor
            res.status(200).json({task,video,virus:{name,virusImageUrl}})
        }else if(task.type === 'upload-post'){
            const post = await postModel.findOne({_id:task.postId})
            if(post.postType === 'design'){
                const virusDesigner = await virusModel.findOne({_id:post.virusId_designer})
                const {name,virusImageUrl} = virusDesigner
                res.status(200).json({task,post,virus:{name,virusImageUrl}})
            }else {
                const virusPhotographer = await virusModel.findOne({_id:post.virusId_photographer})
                const {name,virusImageUrl} = virusPhotographer
                res.status(200).json({task,post,virus:{name,virusImageUrl}})
            }
        }else {
            const video = await videoModel.findOne({_id:task.videoId})
            res.status(200).json({task,video})
        }

    } catch(err) {
        res.status(400).json({message:err.message})
    }
}

const completeGetIdeaTask = async (req,res) => {
    const {task_id,idea,scenario,hook} = req.body
    const { _id,workPeriods } = req.virus
    

    try {
        const {dayOfMonth,month,year} = await handleWorkPeriods(_id,workPeriods)
        const task = await taskModel.completeTask(task_id,dayOfMonth,month,year)
        await videoModel.updateToRecord(task.videoId,idea,scenario,hook)

        res.status(200).json({task})
    } catch(err) {
        res.status(400).json({message:err.message})
    }
}

const completeRecordTask = async (req,res) => {
    const {task_id} = req.body
    const { _id,workPeriods } = req.virus
    

    try {
        const {dayOfMonth,month,year} = await handleWorkPeriods(_id,workPeriods)
        const task = await taskModel.completeTask(task_id,dayOfMonth,month,year)
        await videoModel.updateToEdit(task.videoId)

        res.status(200).json({task})
    } catch(err) {
        res.status(400).json({message:err.message})
    }
}

const completeEditTask = async (req,res) => {
    const {task_id,video_url} = req.body
    const { _id,workPeriods } = req.virus
    

    try {
        const {dayOfMonth,month,year} = await handleWorkPeriods(_id,workPeriods)
        const task = await taskModel.completeTask(task_id,dayOfMonth,month,year)
        await videoModel.updateToUpload(task.videoId,video_url)

        res.status(200).json({task})
    } catch(err) {
        res.status(400).json({message:err.message})
    }
}

const completeUploadTask = async (req,res) => {
    const {task_id,video_url} = req.body
    const { _id,workPeriods } = req.virus
    

    try {
        const {dayOfMonth,month,year} = await handleWorkPeriods(_id,workPeriods)
        const task = await taskModel.completeTask(task_id,dayOfMonth,month,year)
        await videoModel.updateToCompleted(task.videoId,video_url,)
        await taskModel.updateMany({videoId:task.videoId},{videoUrl:video_url})

        res.status(200).json({task})
    } catch(err) {
        res.status(400).json({message:err.message})
    }
}

const completePreparePostTask = async (req,res) => {
    const {task_id} = req.body
    const { _id,workPeriods } = req.virus
    

    try {
        const {dayOfMonth,month,year} = await handleWorkPeriods(_id,workPeriods)
        const task = await taskModel.completeTask(task_id,dayOfMonth,month,year)
        await postModel.updateToPrepared(task.postId)

        res.status(200).json({task})
    } catch(err) {
        res.status(400).json({message:err.message})
    }
}

const completeUploadPostTask = async (req,res) => {
    const {task_id,post_url} = req.body
    const { _id,workPeriods } = req.virus
    

    try {
        const {dayOfMonth,month,year} = await handleWorkPeriods(_id,workPeriods)
        const task = await taskModel.completeTask(task_id,dayOfMonth,month,year)
        await postModel.updateToCompleted(task.postId,post_url)
        await taskModel.updateMany({postId:task.postId},{postUrl:post_url})

        res.status(200).json({task})
    } catch(err) {
        res.status(400).json({message:err.message})
    }
}

const failedTask = async (req,res) => {
    const {task_id} = req.body
    
    try {
        const task = await taskModel.findOneAndUpdate({_id:task_id},{isDelayed:true})

        res.status(200).json({task})
    } catch(err) {
        res.status(400).json({message:err.message})
    }
}

module.exports = {
    getVirusTasks,
    getSingleTask,
    completeGetIdeaTask,
    completeRecordTask,
    completeEditTask,
    completeUploadTask,
    completePreparePostTask,
    completeUploadPostTask,
    failedTask
}