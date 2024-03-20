const mongoose = require('mongoose');
const clientModel = require('./customer')
const virusModel = require('./virus')

const Schema = mongoose.Schema

const virusClientSchema = new Schema({
    virusName: {
        type:String,
        required:true,
    },
    virusId: {
        type:String,
        required:true,
    },
    virusImageUrl: {
        type:String,
        default:'some dummy url for virus image!',
        required:true,
    },
    clientName: {
        type:String,
        required:true,
    },
    clientId: {
        type:String,
        required:true,
    },
    clientImageUrl: {
        type:String,
        default:'some dummy url for client image!',
        required:true,
    },
})

virusClientSchema.statics.addClientToVirus = async function(virus_Id,client_Id){
    const virusExists = await virusModel.findOne({_id:virus_Id})
    const clientExists = await clientModel.findOne({_id:client_Id})
    if(!virusExists || !clientExists){
        throw Error('الاسم غير موجود')
    }
    const {name:virusName,_id:virusId,virusImageUrl} = virusExists
    const {name:clientName,_id:clientId,clientImageUrl} = clientExists 
    const exists = await this.findOne({virusId,clientId:client_Id})
    if(exists){
        throw Error('صلاحية الوصول موجودة بالفعل')
    }
    const access = await this.create({virusName,virusId,virusImageUrl,clientName,clientId,clientImageUrl})
    return access
}

virusClientSchema.statics.removeClientFromVirus = async function(_id){
    const exists = await this.findOne({_id})
    if(!exists){
        throw Error('العميل غير موجود بالفعل')
    }
    const removedAccess = await this.findOneAndDelete({_id})

    return removedAccess
}

virusClientSchema.statics.getVirusClients = async function(virusId){
    const clients = await this.find({virusId})

    return clients
}

virusClientSchema.statics.getClientViruses = async function(clientId){
    const viruses = await this.findOne({clientId})

    return viruses
}

module.exports = mongoose.model('virusClient',virusClientSchema)