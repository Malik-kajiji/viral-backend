const express = require('express')
const router = express.Router()
const adminMiddleware = require('../../middlewares/adminMiddleware')
const {
    addClientToVirus,
    removeClientFromVirus,
    getVirusClients,
    getClientViruses
} = require('../../controllers/adminControllers/adminVirusClientController')

router.use(adminMiddleware)
router.post('/add-client',addClientToVirus)
router.delete('/remove-client',removeClientFromVirus)
router.get('/get-virus-clients',getVirusClients)
router.get('/get-client-viruses',getClientViruses)

module.exports = router