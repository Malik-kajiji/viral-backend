const virusClientModel = require('../../models/virusClient')

const addClientToVirus = async (req,res) => {
    const { virus_id,client_id } = req.body;
    try{
        const access = await virusClientModel.addClientToVirus(virus_id,client_id)

        res.status(200).json({access})
    } catch(err) {
        res.status(400).json({message:err.message})
    }
}

const removeClientFromVirus = async (req,res) => {
    const { access_id } = req.body;

    try{
        const removedAccess = await virusClientModel.removeClientFromVirus(access_id)

        res.status(200).json({removedAccess})
    } catch(err) {
        res.status(400).json({message:err.message})
    }
}

const getVirusClients = async (req,res) => {
    const { virus_id } = req.body;
    try{
        const clients = await virusClientModel.getVirusClients(virus_id)

        res.status(200).json({clients})
    } catch(err) {
        res.status(400).json({message:err.message})
    }
}

const getClientViruses = async (req,res) => {
    const { client_id } = req.body;
    try{
        const viruses = await virusClientModel.getClientViruses(client_id)

        res.status(200).json({viruses})
    } catch(err) {
        res.status(400).json({message:err.message})
    }
}

module.exports = {
    addClientToVirus,
    removeClientFromVirus,
    getVirusClients,
    getClientViruses
}