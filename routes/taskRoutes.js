const express = require('express')
const router = express.Router()

const {
    getClientTasks,
    getVirusTasks,
    rejectTask,
    redirectTask,
    completeTask
} = require('../controllers/taskController')

router.get('/clientTasks',getClientTasks)
router.get('/virusTasks',getVirusTasks)
router.put('/reject',rejectTask)
router.put('/redirect',redirectTask)
router.put('/complete',completeTask)

module.exports = router