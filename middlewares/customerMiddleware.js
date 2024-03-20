const JWT = require('jsonwebtoken');
const client = require('../models/customer')


const clientMiddleware = async (req,res,next)=>{
    const { authorization } = req.headers

    if(!authorization){
        return res.status(401).json({error:'لم تتم عملية التحقق بنجاح'});
    }

    try {
        const token = authorization.split(' ')[1];
        const {_id} = JWT.verify(token,process.env.SECRET)

        const { name,currentPackage,passwordChangedAt,businessType,clientSince,clientImageUrl  } = await client.findOne({_id});

        const decodedToken = JWT.decode(token, { complete: true });
        const issuedAt = decodedToken.payload.iat;
        const issuedAtDate = new Date(issuedAt * 1000);

        if(issuedAtDate < passwordChangedAt){
            return res.status(401).json({error:'لم تتم عملية التحقق بنجاح'});
        }
        
        req.client = {client_id:_id,name,currentPackage,businessType,clientSince,clientImageUrl}
        next()
    }catch (err){
        return res.status(401).json({error:err.message});
    }
}

module.exports = clientMiddleware