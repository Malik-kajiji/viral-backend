const customerModel = require('../../models/customer')
const JWT = require('jsonwebtoken');

const createToken =  (_id)=>{
    return JWT.sign({_id},process.env.SECRET,{expiresIn:'30d'})
}

const loginAsCustomer = async (req,res) => {
    const { name,password } = req.body

    try {
        const {_id,businessType,clientSince,clientImageUrl } = await customerModel.login(name,password)
        const token = createToken(_id)
        res.status(200).json({
            name,
            businessType,
            clientSince,
            clientImageUrl,
            token
        })
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const getClientData = async (req,res) => {
    const { name,businessType,clientSince,clientImageUrl } = req.client

    res.status(200).json({name,businessType,clientSince,clientImageUrl})
}

module.exports = {
    loginAsCustomer,
    getClientData
}