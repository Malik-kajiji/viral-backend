const express = require('express')
const router = express.Router()

const {
    addVideosToCustomer,
    removeVideo,
    updateState,
    updateVideo,
    getSingleVideo,
    getClientVideos,
    getClientVideosByAdmin,
    getVirusVideosByAdmin,
    getAllVideos,
    handleVideosToVirus
} = require('../controllers/videosController')

router.get('/:id',getSingleVideo)
router.post('/add',addVideosToCustomer)
router.delete('/remove',removeVideo)
router.put('/update-state',updateState)
router.put('/update-video',updateVideo)

// client middleware
router.get('/getClientVideos',getClientVideos)

// virus
router.get('/getClientVideosByAdmin/:id',getClientVideosByAdmin)

// admin
router.get('/getVirusVideosByAdmin',getVirusVideosByAdmin)
router.get('/getAllVideos',getAllVideos)
router.put('/handle-videos-to-virus',handleVideosToVirus)

module.exports = router