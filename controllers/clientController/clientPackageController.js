const videoModel = require('../../models/videos')
const packageModel = require('../../models/package')
const postModel = require('../../models/post')

const getCurrentPackageVideos = async (req, res) => {
    const { client_id, currentPackage } = req.client;

    try {
    const videos = await videoModel.getPackageVideos(currentPackage);
    const {weeksCount } = await packageModel.getPackageDetails(currentPackage);

    videos.sort((a, b) => a.videoNumber - b.videoNumber);

    // let sortedVideos = [];
    // let weekNumber = 1

    // for (let i = 0; i < videos.length; i += videosPerWeek) {
    //     const videoGroup = videos.slice(i, i + videosPerWeek);
    //     sortedVideos.push({ weekNumber, videos: videoGroup });
    //     weekNumber++;
    // }

    const sortedVideos = [];

    for(let i=1;i<=weeksCount;i++){
        sortedVideos.push({weakNumber:i,videos:[]})
    }

    videos.forEach(e=>{
        const oldWeekVideos = sortedVideos[e.weakNumber-1].videos
        sortedVideos[e.weakNumber-1] = {weekNumber:e.weakNumber,videos:[...oldWeekVideos,e]}
    })


    res.status(200).json({ sortedVideos });
    } catch (err) {
    res.status(400).json({ message: err.message });
    }
};

const getVideoDetails = async (req, res) => {
    const {video_id} = req.params;
    
    try {
        const video = await videoModel.getSingleVideo(video_id)
        res.status(200).json({ video });
    }catch(err){
        res.status(400).json({ message: err.message });
    }
}

const getCurrentPackagePosts = async (req, res) => {
    const { client_id, currentPackage } = req.client;

    try {
        const posts = await postModel.getPackagePosts(currentPackage);
        const { weeksCount } = await packageModel.getPackageDetails(currentPackage);

        posts.sort((a, b) => a.postNumber - b.postNumber);

        const sortedPosts = [];

        for(let i=1;i<=weeksCount;i++){
            sortedPosts.push({weakNumber:i,posts:[]})
        }

        posts.forEach(e=>{
            const oldWeekPosts = sortedPosts[e.weakNumber-1].posts
            sortedPosts[e.weakNumber-1] = {weekNumber:e.weakNumber,posts:[...oldWeekPosts,e]}
        })

        res.status(200).json({ sortedPosts });
    } catch (err) {
    res.status(400).json({ message: err.message });
    }
};

const getAllPackagesForClient = async (req, res) => {
    const { client_id } = req.client;

    try {
        const packages = await packageModel.getAllPackagesForClient(client_id)

        res.status(200).json({ packages });
    }catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const getPackageVideos = async (req, res) => {
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

const getPackagePosts = async (req, res) => {
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

module.exports = {
    getCurrentPackageVideos,
    getVideoDetails,
    getCurrentPackagePosts,
    getAllPackagesForClient,
    getPackageVideos,
    getPackagePosts
}