const express = require('express')
const router = express.Router()
const adminMiddleware = require('../../middlewares/adminMiddleware')

const {
    getCreatePackageData,
    createPackage,
    getAllCurrentPackages,
    getAllClientPackages,
    getPackageVideos,
    getPackagePosts,
    addPost,
    addVideo,
    deletePost,
    deleteVideo,
    changePostDay,
    changeVideoDay,
    pausePackage,
    resumePackage,
    redirectPackageTasks,
    createNextWeekTasks
} = require('../../controllers/adminControllers/adminPackageController')

router.use(async (req,res,next)=>{await adminMiddleware(req,res,next,'packages')})
router.get('/get-all-current-packages',getAllCurrentPackages)
router.get('/get-client-packages/:client_id',getAllClientPackages)
router.get('/get-package-videos/:package_id',getPackageVideos)
router.get('/get-package-posts/:package_id',getPackagePosts)
router.post('/add-post',addPost)
router.post('/add-Video',addVideo)
router.put('/change-post-day',changePostDay)
router.put('/change-video-day',changeVideoDay)
router.delete('/delete-post',deletePost)
router.delete('/delete-video',deleteVideo)
router.get('/get-create-package-data',getCreatePackageData)
router.post('/create-package',createPackage)
router.put('/pause-package',pausePackage)
router.put('/resume-package',resumePackage)
router.put('/redirect-package-tasks',redirectPackageTasks)
router.post('/create-next-week-tasks',createNextWeekTasks)


module.exports = router