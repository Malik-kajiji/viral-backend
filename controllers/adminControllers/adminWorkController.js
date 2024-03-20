const taskModel = require('../../models/task')
const virusModel = require('../../models/virus')

const getAllViruses = async (req,res) => {
    try {
        const allViruses = await virusModel.find()

        res.status(200).json(allViruses)
    }catch(err) {
        res.status(400).json({message:err.message});
    }
}

const getVirusMonthWork = async (req,res) => {
    const { _id,month,year } = req.params

    try {
        const tasks = await taskModel.getCompletedTasks(_id,month,year)
        tasks.sort((a, b) => a.completeDayDate - b.completeDayDate);
        let ideas = []
        let recorded = []
        let edited = []
        let uploaded = []
        let photos = []
        let designs = []
        let postUploads = []
        let other = []
        tasks.forEach((e)=> {
            switch(e.type){
                case 'getIdea':ideas.push(e)
                break;
                case 'record':recorded.push(e)
                break;
                case 'edit':edited.push(e)
                break;
                case 'upload':uploaded.push(e)
                break;
                case 'photos':photos.push(e)
                break;
                case 'design':designs.push(e)
                break;
                case 'upload-post':postUploads.push(e)
                break;
                default:other.push(e)
            }
        })

        res.status(200).json({ideas,recorded,edited,uploaded,photos,designs,postUploads,other})
    } catch(err) {
        res.status(400).json({message:err.message})
    }
}

module.exports = {
    getAllViruses,
    getVirusMonthWork
}