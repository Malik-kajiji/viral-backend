const express = require('express')
const router = express.Router()
const adminMiddleware = require('../../middlewares/adminMiddleware')

const {
    getHomeData
} = require('../../controllers/adminControllers/adminHomeController')

router.use(async (req,res,next)=>{await adminMiddleware(req,res,next,'home')})

router.get('/get-home-data',getHomeData)


module.exports = router