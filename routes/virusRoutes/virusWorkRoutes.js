const express = require('express')
const router = express.Router()
const virusMiddleware = require('../../middlewares/virusMiddleware')

const {
    getWorkPeriods,
    getCompletedTasks
} = require('../../controllers/virusControllers/virusWorkController')

router.use(virusMiddleware)

router.get('/get-work-periods',getWorkPeriods)
router.get('/get-completed-tasks/:month/:year',getCompletedTasks)

module.exports = router