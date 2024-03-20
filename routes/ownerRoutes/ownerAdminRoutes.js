const express = require('express')
const router = express.Router()
const ownerMiddleware = require('../../middlewares/ownerMiddleware')

const {
    createAdmin,
    deleteAdmin,
    editAccess,
    changePassword,
    getAllAdmins
} = require('../../controllers/ownerControllers/ownerAdminController')

router.use(ownerMiddleware)
router.post('/create',createAdmin)
router.delete('/delete',deleteAdmin)
router.put('/edit',editAccess)
router.put('/change-password',changePassword)
router.get('/get-all',getAllAdmins)

module.exports = router