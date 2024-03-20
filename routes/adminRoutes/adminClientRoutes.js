const express = require('express')
const router = express.Router()
const adminMiddleware = require('../../middlewares/adminMiddleware')

const {
    addCustomer,
    removeCustomer,
    changePassword,
    getAllCustomer,
    editCustomer
} = require('../../controllers/adminControllers/adminCientsController')

router.use(async (req,res,next)=>{await adminMiddleware(req,res,next,'clients')})

router.get('/get-all-clients',getAllCustomer)
router.post('/add-client',addCustomer)
router.delete('/remove-client',removeCustomer)
router.put('/change-password',changePassword)
router.put('/edit-client',editCustomer)


module.exports = router