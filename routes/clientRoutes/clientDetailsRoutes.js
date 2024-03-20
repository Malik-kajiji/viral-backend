const express = require('express')
const router = express.Router()
const clientMiddleware = require('../../middlewares/customerMiddleware')

const { getDetails, changePassword } = require('../../controllers/clientController/clientDetailsController')

router.use(clientMiddleware)

router.get('/get-client-details',getDetails)
router.put('/change-password',changePassword)

module.exports = router