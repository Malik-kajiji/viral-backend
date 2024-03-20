const express = require('express')
const router = express.Router()
const adminMiddleware = require('../../middlewares/adminMiddleware')
const {
    getAllViruses,
    addVirus,
    editVirus,
    removeVirus,
    changePassword,
    addClientToVirus,
    removeClientFromVirus,
    getVirusClients
} = require('../../controllers/adminControllers/adminVirusController')

router.use(async (req,res,next)=>{await adminMiddleware(req,res,next,'viruses')})
router.get('/get-all',getAllViruses)
router.post('/add-virus',addVirus)
router.put('/update-virus',editVirus)
router.delete('/remove-virus',removeVirus)
router.put('/change-password',changePassword)
router.get('/get-virus-clients/:_id',getVirusClients)
router.post('/add-client-to-virus',addClientToVirus)
router.delete('/remove-client-from-virus',removeClientFromVirus)

module.exports = router