const express = require('express')
const router = express.Router()
const {
    loginAsVirus,
    getVirusData
} = require('../../controllers/virusControllers/virusController')

const virusMiddleware = require('../../middlewares/virusMiddleware')

router.post('/login',loginAsVirus)
router.use(virusMiddleware)
router.get('/get-virus-data',getVirusData)


module.exports = router