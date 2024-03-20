const express = require('express')
const router = express.Router()

const {
    loginAsCustomer,
    getClientData
} = require('../../controllers/clientController/customerController')

const clientMiddleware = require('../../middlewares/customerMiddleware')

router.post('/login',loginAsCustomer)
router.use(clientMiddleware)
router.get('/get-client-data',getClientData)

module.exports = router