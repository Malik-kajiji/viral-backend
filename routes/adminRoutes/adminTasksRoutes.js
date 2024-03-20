const express = require('express')
const router = express.Router()
const adminMiddleware = require('../../middlewares/adminMiddleware')

const {
    getAllTasks,
    redirectTask,
    rejectTask,
    deleteTask
} = require('../../controllers/adminControllers/adminTasksController')

router.use(async (req,res,next)=>{await adminMiddleware(req,res,next,'tasks')})

router.get('/get-all-tasks',getAllTasks)
router.put('/redirect-task',redirectTask)
router.put('/reject-task',rejectTask)
router.delete('/delete-task',deleteTask)

module.exports = router