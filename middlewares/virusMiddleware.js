const Virus = require('../models/virus');
const JWT = require('jsonwebtoken');


const authMiddleware = async (req,res,next)=>{
    const { authorization } = req.headers

    if(!authorization){
        return res.status(401).json({error:'لم تتم عملية التحقق بنجاح'});
    }

    try {
        const token = authorization.split(' ')[1];
        const {_id} = JWT.verify(token,process.env.SECRET)
        const user = await Virus.findOne({_id});

        const decodedToken = JWT.decode(token, { complete: true });
        const issuedAt = decodedToken.payload.iat;
        const issuedAtDate = new Date(issuedAt * 1000);

        if(issuedAtDate < user.passwordChangedAt){
            return res.status(401).json({error:'لم تتم عملية التحقق بنجاح'});
        }

        if(!user){
            return res.status(401).json({error:'فشل في عملية التحقق'});
        }

        req.virus = user
        next()
    }catch (err){
        return res.status(401).json({error:err.message});
    }
}

module.exports = authMiddleware