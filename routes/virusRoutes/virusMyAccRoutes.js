const express = require('express')
const router = express.Router()
const virusMiddleware = require('../../middlewares/virusMiddleware')

const { getDetails, changePassword } = require('../../controllers/virusControllers/virusMyAccController')

router.use(virusMiddleware)

router.get('/get-virus-details',getDetails)
router.put('/change-password',changePassword)

module.exports = router