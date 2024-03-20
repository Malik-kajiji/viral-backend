const videoModel = require('../models/videos')
const clientModel = require('../models/customer')

// videoModel.updateMany({clientId:'sdfsff'},)

const getAllVideos = async (req,res) => {
    try {
        const videos = await videoModel.getAllVideos()

        res.status(200).json({videos})
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const getVirusVideosByAdmin = async (req,res) => {
    const { virusId } = req.body
    try {
        const videos = await videoModel.getVirusVideos(virusId)

        res.status(200).json({videos})
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const getClientVideosByAdmin = async (req,res) => {
    const { id:clientId } = req.params
    try {
        const videos = await videoModel.getCientVideos(clientId)

        res.status(200).json({videos})
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const getClientVideos = async (req,res) => {
    const { _id } = req.client
    try {
        const videos = await videoModel.getCientVideos(_id)

        res.status(200).json({videos})
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const getSingleVideo = async (req,res) => {
    const { id } = req.params

    try {
        const videos = await videoModel.getSingleVideo(id)

        res.status(200).json({videos})
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const addVideosToCustomer = async (req,res) => {
    const { clientId,numberOfVideos,days } = req.body
    try {
        let allVideos = []
        let currentDay = 0
        let currentWeak = 1
        let currentVideo = 1
        for(let i = 0; i<numberOfVideos;i++){
            // let video = await videoModel.addVideo(clientId,i+1,days[i],currentWeak)
            allVideos.push({videoNumber:i+1,state:'في قائمة الانتظار',clientId,day:days[currentDay],weakNumber:currentWeak})
            // allVideos.push(video)
            if(currentDay === days.length - 1){
                currentDay = 0
                currentWeak++;
            }else {
                currentDay++
            }
            // currentDay++
            currentVideo++;
            if(currentVideo === days.length + 1){
                currentVideo = 0
                // currentDay = 0
            }
        }

        const numberOfWeaks = numberOfVideos / days.length
        await clientModel.updateWeaks(clientId)
        const videos = await videoModel.addVideos(allVideos,numberOfWeaks)

        res.status(200).json({videos})
    }catch(err){
        res.status(400).json({message:err.message})
    }
}



const removeVideo = async (req,res) => {
    const { _id } = req.body
    
    try {
        const removed = await videoModel.removeVideo(_id)

        res.status(200).json({removed})
    }catch(err) {
        res.status(400).json({message:err.message})
    }
}

const updateState = async (req,res) => {
    const { _id,newState } = req.body

    try{
        const video = await videoModel.updateState(_id,newState)

        res.status(200).json(video)
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const updateVideo = async (req,res) => {
    const { _id,day,scenario,video_url,virusId  } = req.body

    try {
        const video = await videoModel.updateVideo(_id,day,scenario,video_url,virusId)

        res.status(200).json(video)
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const handleVideosToVirus = async (req,res) => {
    const { clientId,virusIds } = req.body

    const { virusId_Idea,virusId_Record,virusId_Edit,virusId_Upload } = virusIds

    try {
        const videos = await videoModel.updateMany({clientId,state:'في قائمة الانتظار'},{virusId_Idea,virusId_Record,virusId_Edit,virusId_Upload})

        res.status(200).json({videos})
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

module.exports = {
    addVideosToCustomer,
    removeVideo,
    updateState,
    updateVideo,
    getSingleVideo,
    getClientVideos,
    getClientVideosByAdmin,
    getVirusVideosByAdmin,
    getAllVideos,
    handleVideosToVirus
}