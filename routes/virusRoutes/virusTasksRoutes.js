const express = require('express')
const router = express.Router()
const virusMiddleware = require('../../middlewares/virusMiddleware')

const {
    getVirusTasks,
    getSingleTask,
    completeGetIdeaTask,
    completeRecordTask,
    completeEditTask,
    completeUploadTask,
    completePreparePostTask,
    completeUploadPostTask,
    failedTask
} = require('../../controllers/virusControllers/virusTasksControler')

router.use(virusMiddleware)

router.get('/get-virus-tasks',getVirusTasks)
router.get('/get-single-virus-tasks/:taskId',getSingleTask)
router.put('/complete-get-idea-task',completeGetIdeaTask)
router.put('/complete-record-task',completeRecordTask)
router.put('/complete-edit-task',completeEditTask)
router.put('/complete-upload-task',completeUploadTask)
router.put('/complete-prepare-post-task',completePreparePostTask)
router.put('/complete-upload-post-task',completeUploadPostTask)
router.put('/failed-task',failedTask)

module.exports = router