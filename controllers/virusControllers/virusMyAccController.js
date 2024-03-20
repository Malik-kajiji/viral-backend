const virusModel = require('../../models/virus')
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

const createToken =  (_id)=>{
    return JWT.sign({_id},process.env.SECRET,{expiresIn:'30d'})
}

const getDetails = async (req,res) => {
    const {_id} = req.virus
    try {
        const virus = await virusModel.findOne({_id})

        res.status(200).json(virus)
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const changePassword = async (req,res) => {
    const { old_password,new_password } = req.body
    const { _id } = req.virus
    const virus = await virusModel.findOne({_id})

    const match = await bcrypt.compare(old_password,virus.password)
    if(!match){
        res.status(400).json({message:'كلمة المرور غير صحيحة'})
    }else {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(new_password,salt)
        const updatedVirus = await virusModel.findOneAndUpdate({_id},{password:hash})

        const token = createToken(updatedVirus._id)
        res.status(200).json({
            name: updatedVirus.name,
            token
        })
    }
}

module.exports = {
    getDetails,
    changePassword
}