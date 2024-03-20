const virusModel = require('../../models/virus')
const JWT = require('jsonwebtoken');

const createToken =  (_id)=>{
    return JWT.sign({_id},process.env.SECRET,{expiresIn:'30d'})
}

const loginAsVirus = async (req,res) => {
    const { name,password } = req.body
    try {
        const { _id,jobTitle,workingSince,virusImageUrl,workPeriods } = await virusModel.login(name,password)
        const token = createToken(_id)
        res.status(200).json({
            name,
            jobTitle,
            workingSince,
            virusImageUrl,
            workPeriods,
            token
        })
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const getVirusData = async (req,res) => {
    const { name,jobTitle,workingSince,virusImageUrl,workPeriods } = req.virus

    res.status(200).json({name,jobTitle,workingSince,virusImageUrl,workPeriods})
}

module.exports = {
    loginAsVirus,
    getVirusData
}