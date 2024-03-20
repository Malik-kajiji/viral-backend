const express = require('express')
const router = express.Router()
const clientMiddleware = require('../../middlewares/customerMiddleware')

const {
    getCurrentPackageVideos,
    getVideoDetails,
    getCurrentPackagePosts,
    getAllPackagesForClient,
    getPackageVideos,
    getPackagePosts
} = require('../../controllers/clientController/clientPackageController')

router.use(clientMiddleware)
router.get('/get-current-package-videos',getCurrentPackageVideos)
router.get('/get-video-details/:video_id',getVideoDetails)
router.get('/get-current-package-posts',getCurrentPackagePosts)
router.get('/get-all-packages',getAllPackagesForClient)
router.get('/get-package-videos/:package_id',getPackageVideos)
router.get('/get-package-posts/:package_id',getPackagePosts)

module.exports = router