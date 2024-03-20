const express = require('express')
const router = express.Router()
const virusMiddleware = require('../../middlewares/virusMiddleware')
const {
    getVirusClients,
    getClientPackage,
    getClientPackageVideos,
    getClientPackagePosts,
    getClientVideoDetails
} = require('../../controllers/virusControllers/virusClientController')


router.use(virusMiddleware)
router.get('/get-my-clients',getVirusClients)
router.get('/get-client-packages/:client_id',getClientPackage)
router.get('/get-client-package-videos/:package_id',getClientPackageVideos)
router.get('/get-client-package-posts/:package_id',getClientPackagePosts)
router.get('/get-client-video-details/:video_id',getClientVideoDetails)


module.exports = router