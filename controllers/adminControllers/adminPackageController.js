const clientModel = require('../../models/customer')
const packageModel = require('../../models/package')
const videoModel = require('../../models/videos')
const postModel = require('../../models/post') 
const virusModel = require('../../models/virus')
const adminModel = require('../../models/admin')
const { createTasksForThisWeakV2 } = require('../taskController')


const getCreatePackageData = async (req,res) => {
    try {
        const allClients = await clientModel.find()
        const allViruses = await virusModel.find()
        res.status(200).json({allClients,allViruses})
    }catch(err){
        res.status(400).json({message:err.message})
    }

}

const createPackage = async (req,res) => {
    const { 
        client_id,
        numberOfWeeks,
        reelsPerWeek,
        postsPerWeek,
        days,
        postDays,
        virus_id_posts_uploader,
        virus_id_posts_designer,
        virus_id_posts_photographer,
        virusId_Idea,
        virusId_Record,
        virusId_Edit,
        virusId_Upload
    } = req.body;

    //postDays = [{day:'',type:''}]

    const packageNumber = await packageModel.count({client_id})

    try {
        const package = await packageModel.createPackage(client_id,numberOfWeeks,reelsPerWeek,postsPerWeek,packageNumber+1)
        const client = await clientModel.updateCurrentPackage(client_id,package._id)

        let allVideos = []
        let currentDay = 0
        let currentWeak = 1
        let currentVideo = 1
        for(let i = 0; i<(reelsPerWeek * numberOfWeeks);i++){
            allVideos.push({
                videoNumber:i+1,
                state:'في قائمة الانتظار',
                clientId:client_id,
                clientName: client.name,
                clientImageUrl:client.clientImageUrl,
                day:days[currentDay],
                weakNumber:currentWeak,
                package_id:package._id,
                virusId_Idea,
                virusId_Record,
                virusId_Edit,
                virusId_Upload
            })

            if(currentDay === days.length - 1){
                currentDay = 0
                currentWeak++;
            }else {
                currentDay++
            }
            currentVideo++;
            if(currentVideo === days.length + 1){
                currentVideo = 0
            }
        }

        const videos = await videoModel.addVideos(allVideos)

        let allPosts = []
        let currentDayPosts = 0
        let currentWeakPosts = 1
        let currentPost = 1
        for(let i = 0; i<(postsPerWeek * numberOfWeeks);i++){
            allPosts.push({
                postType:postDays[currentDayPosts].type,
                postNumber:i+1,
                state:'في قائمة الانتظار',
                clientId:client_id,
                clientName: client.name,
                clientImageUrl: client.clientImageUrl,
                day:postDays[currentDayPosts].day,
                virusId_designer:postDays[currentDayPosts].type === 'design' ? virus_id_posts_designer:'',
                virusId_photographer:postDays[currentDayPosts].type === 'photos' ? virus_id_posts_photographer:'',
                virusId_uploader:virus_id_posts_uploader,
                weakNumber:currentWeakPosts,
                package_id:package._id,
            })

            if(currentDayPosts === postDays.length - 1){
                currentDayPosts = 0
                currentWeakPosts++;
            }else {
                currentDayPosts++
            }
            currentPost++;
            if(currentPost === postDays.length + 1){
                currentPost = 0
            }
        }

        const posts = await postModel.addPosts(allPosts)


        res.status(200).json({videos,posts,package})
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const getAllCurrentPackages = async (req,res) => {
    try {
        const clients = await clientModel.find();
        let allClientsObj = {}
        clients.forEach((e)=>{
            allClientsObj = {...allClientsObj,[e._id]:e}
        })
        const notCompletedPackages = await packageModel.find({isCompleted:false})
        let packages = []

        for(let i =0 ;i<notCompletedPackages.length;i++){
            const currentPackage = notCompletedPackages[i]
            let clientPackage = allClientsObj[currentPackage.client_id]
            packages.push({
                clientImageUrl:clientPackage.clientImageUrl,
                clientName:clientPackage.name,
                ...currentPackage._doc
            })
        }
        //


        res.status(200).json(packages)
    }catch(err){
        res.status(400).json({message:err.message})
    }

}

const getAllClientPackages = async (req,res) => {
    const { client_id } = req.params

    try {
        const packages = await packageModel.getAllPackagesForClient(client_id)
        const { clientImageUrl,name,clientSince } = await clientModel.findOne({_id:client_id})

        res.status(200).json({packages,clientDetails:{clientImageUrl,name,clientSince}})
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const getPackageVideos = async (req, res) => {
    const {package_id} = req.params;

    try {
    const allViruses = await virusModel.find()
    const videos = await videoModel.getPackageVideos(package_id);
    const {weeksCount} = await packageModel.getPackageDetails(package_id);

    videos.sort((a, b) => a.videoNumber - b.videoNumber);

    const sortedVideos = [];

    for(let i=1;i<=weeksCount;i++){
        sortedVideos.push({weakNumber:i,videos:[]})
    }

    videos.forEach(e=>{
        const oldWeekVideos = sortedVideos[e.weakNumber-1].videos
        sortedVideos[e.weakNumber-1] = {weekNumber:e.weakNumber,videos:[...oldWeekVideos,e]}
    })

    // let sortedVideos = [];
    // let weekNumber = 1

    // for (let i = 0; i < videos.length; i += videosPerWeek) {
    //     const videoGroup = videos.slice(i, i + videosPerWeek);
    //     sortedVideos.push({ weekNumber, videos: videoGroup });
    //     weekNumber++;
    // }


    res.status(200).json({ sortedVideos,allViruses });
    } catch (err) {
    res.status(400).json({ message: err.message });
    }
}

const getPackagePosts = async (req, res) => {
    const {package_id} = req.params;

    try {
        const allViruses = await virusModel.find()
        const posts = await postModel.getPackagePosts(package_id);
        const { weeksCount } = await packageModel.getPackageDetails(package_id);
    
        posts.sort((a, b) => a.postNumber - b.postNumber);
    
        const sortedPosts = [];

        for(let i=1;i<=weeksCount;i++){
            sortedPosts.push({weakNumber:i,posts:[]})
        }

        posts.forEach(e=>{
            const oldWeekPosts = sortedPosts[e.weakNumber-1].posts
            sortedPosts[e.weakNumber-1] = {weekNumber:e.weakNumber,posts:[...oldWeekPosts,e]}
        })
    
        res.status(200).json({ sortedPosts,allViruses });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const addPost = async (req,res) => {
    const { postType,packageId,clientId,clientName,clientImageUrl,day,virusId_designer,virusId_photographer,virusId_uploader,weakNumber } = req.body

    try {
        const postNumber = await postModel.count({package_id:packageId})
        const post = await postModel.create({
            postType,postNumber:postNumber+1,package_id:packageId,
            clientId,clientName,clientImageUrl,
            day,virusId_designer,virusId_photographer,
            virusId_uploader,weakNumber
        })

        res.status(200).json(post);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const addVideo = async (req,res) => {
    const { package_id,clientId,clientName,clientImageUrl,day,weakNumber,virusId_Idea,virusId_Record,virusId_Edit,virusId_Upload } = req.body

    try {
        const videoNumber = await videoModel.count({package_id})
        const video = await videoModel.create({
            videoNumber:videoNumber+1,state:'في قائمة الانتظار',
            clientId,clientName,clientImageUrl,day,
            virusId_Idea,virusId_Record,virusId_Edit,virusId_Upload,
            weakNumber,package_id
        })

        res.status(200).json(video);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const deletePost = async (req,res) => {
    const { _id } = req.body

    try {
        const deletedPost = await postModel.findOneAndDelete({_id})

        res.status(200).json(deletedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const deleteVideo = async (req,res) => {
    const { _id } = req.body

    try {
        const deletedVideo = await videoModel.findOneAndDelete({_id})

        res.status(200).json(deletedVideo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const changePostDay = async (req,res) => {
    const { post_id,day } = req.body

    try {
        const newPost = await postModel.findOneAndUpdate({_id:post_id},{day})

        res.status(200).json({...newPost._doc,day});
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const changeVideoDay = async (req,res) => {
    const { video_id,day } = req.body

    try {
        const newVideo = await videoModel.findOneAndUpdate({_id:video_id},{day})

        res.status(200).json({...newVideo._doc,day});
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const pausePackage = async (req,res) => {
    const { package_id } = req.body
    try {
        const package = await packageModel.findOneAndUpdate({_id:package_id},{isPaused:true})

        res.status(200).json({...package._doc,isPaused:true});
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const resumePackage = async (req,res) => {
    const { package_id } = req.body
    try {
        const package = await packageModel.findOneAndUpdate({_id:package_id},{isPaused:false})

        res.status(200).json({...package._doc,isPaused:false});
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const redirectPackageTasks = async (req,res) => {
    const { taskType,packageId,virusId } = req.body

    
    try {
        const package = await packageModel.findOne({_id:packageId})
        
        let updated;
        if(taskType === 'virusId_Idea'){
            updated = await videoModel.updateMany({package_id:packageId,weakNumber:{ $gt: package.currentWeek }},{virusId_Idea:virusId})
        }else if(taskType === 'virusId_Record'){
            updated = await videoModel.updateMany({package_id:packageId,weakNumber:{ $gt: package.currentWeek }},{virusId_Record:virusId})
        }else if(taskType === 'virusId_Edit'){
            updated = await videoModel.updateMany({package_id:packageId,weakNumber:{ $gt: package.currentWeek }},{virusId_Edit:virusId})
        }else if(taskType === 'virusId_Upload'){
            updated = await videoModel.updateMany({package_id:packageId,weakNumber:{ $gt: package.currentWeek }},{virusId_Upload:virusId})
        }else if(taskType === 'design'){
            updated = await postModel.updateMany({package_id:packageId,weakNumber:{ $gt: package.currentWeek },postType:'design'},{virusId_designer:virusId})
        }else if(taskType === 'photos'){
            updated = await postModel.updateMany({package_id:packageId,weakNumber:{ $gt: package.currentWeek },postType:'photos'},{virusId_photographer:virusId})
        }else if(taskType === 'upload-post'){
            updated = await postModel.updateMany({package_id:packageId,weakNumber:{ $gt: package.currentWeek }},{virusId_uploader:virusId})
        }else{
            throw Error('تأكد من تحديد نوع مهمة صالح')
        }

        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const createNextWeekTasks = async (req,res) => {
    const { password } = req.body
    const { admin_id } = req.admin
    try {
        if(admin_id === process.env.OWNER_ID){
            if(password === process.env.OWNER_PASS){
                await createTasksForThisWeakV2()
            }else {
                throw Error('كلمة مرور غير صحيحة')
            }
        }else {
            const isCorrectPass = await adminModel.checkPassword(admin_id,password)
            if(isCorrectPass){
                await createTasksForThisWeakV2()
            }else {
                throw Error('كلمة مرور غير صحيحة')
            }
        }

        res.status(200).json({doneMeassge:'تم انشاء المهام بنجاح'});
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}


module.exports = {
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
}