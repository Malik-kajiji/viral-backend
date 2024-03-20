const virusModel = require('../../models/virus')
const virusClientModel = require('../../models/virusClient')
const clientModel = require('../../models/customer')
const saveImageToAWS = require('../../functions/base64toAWS')
// const saveImageToGCP = require('../../functions/base64toUrl')


const getAllViruses = async (req,res) => {
    try {
        const allViruses = await virusModel.find()

        res.status(200).json({allViruses})
    }catch(err){
        res.status(400).json({error:err.message})
    }
}

const addVirus = async (req,res) => {
    const {name,password,jobTitle,virusImage} = req.body
    if(name === '' || password === ''){
        res.status(400).json({message:'الرجاء ملئ الحقول'})
    }
    try {
        const virusImageUrl = await saveImageToAWS(virusImage)
        // const virusImageUrl = await saveImageToGCP(virusImage)
        const newVirus = await virusModel.addVirus(name,password,jobTitle,virusImageUrl)
        res.status(200).json(newVirus)
    }catch(err) {
        res.status(400).json({message:err.message});
    }
}

const editVirus = async (req,res) => {
    const {_id,name,jobTitle,virusImage} = req.body
    try {
        const matches = virusImage.match(/^data:image\/([a-z]+);base64,(.+)$/);
        if(matches){
            const virusImageUrl = await saveImageToAWS(virusImage)
            const newVirus = await virusModel.editVirus(_id,name,jobTitle,virusImageUrl)
            await virusClientModel.updateMany({virusId:newVirus._id},{virusImageUrl})
            res.status(200).json(newVirus)
        }else {
            const newVirus = await virusModel.editVirus(_id,name,jobTitle,virusImage)
            res.status(200).json(newVirus)
        }
    }catch(err) {
        res.status(400).json({message:err.message});
    }
}

const removeVirus = async (req,res) => {
    const { _id } = req.body
    try {
        const removed = await virusModel.removeVirus(_id)
        res.status(200).json(removed)
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const changePassword = async (req,res) => {
    const { _id,newPassword} = req.body
    try {
        const virus = await virusModel.changePassword(_id,newPassword)
        res.status(200).json(virus)
    }catch(err) {
        res.status(400).json({message:err.message})
    }
}

const addClientToVirus = async (req,res) => {
    const { virus_id,client_id } = req.body;
    try{
        const access = await virusClientModel.addClientToVirus(virus_id,client_id)

        res.status(200).json(access)
    } catch(err) {
        res.status(400).json({message:err.message})
    }
}

const removeClientFromVirus = async (req,res) => {
    const { access_id } = req.body;

    try{
        const removedAccess = await virusClientModel.removeClientFromVirus(access_id)

        res.status(200).json(removedAccess)
    } catch(err) {
        res.status(400).json({message:err.message})
    }
}

const getVirusClients = async (req,res) => {
    const { _id } = req.params;
    try{
        const virusClients = await virusClientModel.getVirusClients(_id)
        const allClients = await clientModel.find()

        const doseClientExists = (client) => {
            for(let i = 0; i<virusClients.length;i++){
                if(client._id.toString() === virusClients[i].clientId) return false
            }
            return true
        }

        const filterdClients = allClients.filter((client) => doseClientExists(client))

        res.status(200).json({virusClients,filterdClients})
    } catch(err) {
        res.status(400).json({message:err.message})
    }
}

module.exports = {getAllViruses,addVirus,editVirus,removeVirus,changePassword,addClientToVirus,removeClientFromVirus,getVirusClients}