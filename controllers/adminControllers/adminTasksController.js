const taskModel = require('../../models/task')
const virusModel = require('../../models/virus')
const clientModel = require('../../models/customer')

const getAllTasks = async (req,res) => {
    try {
        const clients = await clientModel.find()
        const viruses = await virusModel.find()
        let tasks = await taskModel.find({isCompleted:false})

        tasks.sort((a, b) => {
            return a.virusName.localeCompare(b.virusName);
        });

        res.status(200).json({clients,viruses,tasks})
    }catch(err) {
        res.status(400).json({message:err.message});
    }
}

const redirectTask = async (req,res) => {
    const { taskId,virusId,virusImageUrl,virusName,day } = req.body

    try {
        const task = await taskModel.findOneAndUpdate({_id:taskId},{virusId,virusImageUrl,virusName,day,isDelayed:false})

        res.status(200).json({...task._doc,virusId,virusImageUrl,virusName,day,isDelayed:false})
    }catch(err) {
        res.status(400).json({message:err.message});
    }
}

const rejectTask = async (req,res) => {
    const { taskId } = req.body

    try {
        const task = await taskModel.findOneAndUpdate({_id:taskId},{isDelayed:true})

        res.status(200).json({...task._doc,isDelayed:true})
    }catch(err) {
        res.status(400).json({message:err.message});
    }
}

const deleteTask = async (req,res) => {
    const { taskId } = req.body

    try {
        const task = await taskModel.findOneAndDelete({_id:taskId})

        res.status(200).json(task._doc)
    }catch(err) {
        res.status(400).json({message:err.message});
    }
}

module.exports = {
    getAllTasks,
    redirectTask,
    rejectTask,
    deleteTask
}