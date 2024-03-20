const virusClientModel = require('../../models/virusClient')
const packageModel = require('../../models/package')
const videoModel = require('../../models/videos')
const postModel = require('../../models/post')

const getVirusClients = async (req,res) => {
    const { _id } = req.virus

    try {
        const clients = await virusClientModel.getVirusClients(_id)

        res.status(200).json({clients})
    } catch(err) {
        res.status(400).json({message:err.message})
    }
}

const getClientPackage = async (req,res) => {
    const { client_id } = req.params;

    try {
        const packages = await packageModel.getAllPackagesForClient(client_id)

        res.status(200).json({ packages });
    }catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const getClientPackageVideos = async (req,res) => {
    const {package_id} = req.params;

    try {
    const videos = await videoModel.getPackageVideos(package_id);
    const {videosPerWeek} = await packageModel.getPackageDetails(package_id);

    videos.sort((a, b) => a.videoNumber - b.videoNumber);

    let sortedVideos = [];
    let weekNumber = 1

    for (let i = 0; i < videos.length; i += videosPerWeek) {
        const videoGroup = videos.slice(i, i + videosPerWeek);
        sortedVideos.push({ weekNumber, videos: videoGroup });
        weekNumber++;
    }


    res.status(200).json({ sortedVideos });
    } catch (err) {
    res.status(400).json({ message: err.message });
    }
}

const getClientPackagePosts = async (req,res) => {
    const {package_id} = req.params;

    try {
        const posts = await postModel.getPackagePosts(package_id);
        const { postsPerWeek } = await packageModel.getPackageDetails(package_id);
    
        posts.sort((a, b) => a.postNumber - b.postNumber);
    
        const sortedPosts = [];
        let weekNumber = 1;
    
        for (let i = 0; i < posts.length; i += postsPerWeek) {
            const videoGroup = posts.slice(i, i + postsPerWeek);
            sortedPosts.push({ weekNumber, posts: videoGroup });
            weekNumber++;
        }
    
        res.status(200).json({ sortedPosts });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const getClientVideoDetails = async (req,res) => {
    const {video_id} = req.params

    try {
        const video = await videoModel.getSingleVideo(video_id)

        res.status(200).json({video})
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

module.exports = {
    getVirusClients,
    getClientPackage,
    getClientPackageVideos,
    getClientPackagePosts,
    getClientVideoDetails
}