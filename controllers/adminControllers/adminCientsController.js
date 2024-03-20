const clientModel = require('../../models/customer')
const virusClientModel = require('../../models/virusClient')
const saveImageToGCP = require('../../functions/base64toUrl')

const getAllCustomer = async (req,res) => {
    try {
        const customers = await clientModel.getAllCustomer();
        res.status(200).json(customers)
    }catch(err) {
        res.status(400).json({message:err.message});
    }
}
const editCustomer = async (req,res) => {
    const {_id,name,businessType,clientImage,accountName,accountPassword,phoneNumber} = req.body
    try {
        const matches = clientImage.match(/^data:image\/([a-z]+);base64,(.+)$/);
        if(matches){
            const clientImageUrl = await saveImageToGCP(clientImage)
            const newClient = await clientModel.editCustomer(_id,name,phoneNumber,clientImageUrl,businessType,accountName,accountPassword)
            await virusClientModel.updateMany({clientId:newClient._id},{clientImageUrl})
            res.status(200).json(newClient)
        }else {
            const newClient = await clientModel.editCustomer(_id,name,phoneNumber,clientImage,businessType,accountName,accountPassword)
            res.status(200).json(newClient)
        }
    }catch(err) {
        res.status(400).json({message:err.message});
    }
}

const addCustomer = async (req,res) => {
    const { name,password,phoneNumber,clientImage,businessType,accountName,accountPassword } = req.body
    if(name === '' || password === ''){
        res.status(400).json({message:'الرجاء ملئ الحقول'})
    }
    try {
        const clientImageUrl = await saveImageToGCP(clientImage)
        const customer = await clientModel.addCustomer(name,password,phoneNumber,clientImageUrl,businessType,accountName,accountPassword);
        res.status(200).json(customer)
    }catch(err) {
        res.status(400).json({message:err.message});
    }
}

const removeCustomer = async (req,res) => {
    const { _id } = req.body
    try {
        const customer = await clientModel.removeCustomer(_id);
        res.status(200).json(customer)
    }catch(err) {
        res.status(400)
    }
}

const changePassword = async (req,res) => {
    const { _id,newPassword} = req.body
    try {
        const customer = await clientModel.changePassword(_id,newPassword)
        res.status(200).json(customer)
    }catch(err) {
        res.status(400).json({message:err.message})
    }
}

module.exports = {
    addCustomer,
    removeCustomer,
    changePassword,
    getAllCustomer,
    editCustomer
}