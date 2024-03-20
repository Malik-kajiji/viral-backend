const express = require('express')
const router = express.Router()
const adminMiddleware = require('../../middlewares/adminMiddleware')

const {
    getAllViruses,
    getVirusMonthWork
} = require('../../controllers/adminControllers/adminWorkController')

router.use(async (req,res,next)=>{await adminMiddleware(req,res,next,'work')})

router.get('/get-all-viruses',getAllViruses)
router.get('/get-virus-month-work/:_id/:month/:year',getVirusMonthWork)

module.exports = router