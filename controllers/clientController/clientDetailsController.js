const clientModel = require('../../models/customer')
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

const createToken =  (_id)=>{
    return JWT.sign({_id},process.env.SECRET,{expiresIn:'30d'})
}

const getDetails = async (req,res) => {
    const {client_id} = req.client
    try {
        const client = await clientModel.findOne({_id:client_id})

        res.status(200).json(client)
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const changePassword = async (req,res) => {
    const { old_password,new_password } = req.body
    const { client_id } = req.client
    const virus = await clientModel.findOne({_id:client_id})

    const match = await bcrypt.compare(old_password,virus.password)
    if(!match){
        res.status(400).json({message:'كلمة المرور غير صحيحة'})
    }else {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(new_password,salt)
        const updatedClient = await clientModel.findOneAndUpdate({_id:client_id},{password:hash, passwordChangedAt: Date.now()})
        
        const token = createToken(updatedClient._id)
        res.status(200).json({
            name: updatedClient.name,
            token
        })
    }
}

module.exports = {
    getDetails,
    changePassword
}