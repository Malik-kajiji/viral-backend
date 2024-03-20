const taskModel = require('../models/task')
const videoModel = require('../models/videos')
const clientsModel = require('../models/customer')
const packageModel = require('../models/package')
const postModel = require('../models/post')
const virusModel = require('../models/virus')


const createTasksForThisWeakV2 = async () => {
    const oldTasks = await taskModel.updateMany({isCompleted:false},{isCurrentWeek:false,isDelayed:true})
    let allVirusesObj = {}
    const allViruses = await virusModel.find()
    for(let i=0;i<allViruses.length;i++){
        allVirusesObj = {...allVirusesObj,[allViruses[i]._id]:{
            virusImageUrl:allViruses[i].virusImageUrl,
            virusName:allViruses[i].name
        }}
    }

    const allPackages = await packageModel.find({isCompleted:false,isPaused:false})
    let allTasks = []
    for(let i=0;i<allPackages.length;i++){
        let {weeksCount,currentWeek,_id} = allPackages[i]
        if(weeksCount === currentWeek){
            const updatedPackage = await packageModel.findOneAndUpdate({_id},{isCompleted:true})
        }else {
            const updatedPackage = await packageModel.findOneAndUpdate({_id,isPaused:false},{currentWeek:currentWeek+1})
            const packageVideos = await videoModel.find({package_id:_id,weakNumber:currentWeek+1})
            const packagePosts = await postModel.find({package_id:_id,weakNumber:currentWeek+1})
            for(let v=0;v<packageVideos.length;v++){
                const {day,virusId_Idea,virusId_Record,virusId_Edit,virusId_Upload,_id,videoNumber,clientId,clientName,clientImageUrl} = packageVideos[v];
                let prevDay = ''
                switch(day){
                    case 'سبت':prevDay='سبت'
                    break;
                    case 'أحد':prevDay='سبت'
                    break;
                    case 'إثنين':prevDay='أحد'
                    break;
                    case 'ثلثاء':prevDay='إثنين'
                    break;
                    case 'إربعاء':prevDay='ثلثاء'
                    break;
                    case 'خميس':prevDay='إربعاء'
                    break;
                    case 'جمعة':prevDay='خميس'
                    break;
                    default: prevDay=day
                }
                allTasks.push({type:'getIdea',day:prevDay,videoId:_id,videoNumber,clientId,packageId:updatedPackage._id,virusId:virusId_Idea,virusName:allVirusesObj[virusId_Idea].virusName,virusImageUrl:allVirusesObj[virusId_Idea].virusImageUrl,clientName,clientImageUrl})
                allTasks.push({type:'record',day:prevDay,videoId:_id,videoNumber,clientId,packageId:updatedPackage._id,virusId:virusId_Record,virusName:allVirusesObj[virusId_Record].virusName,virusImageUrl:allVirusesObj[virusId_Record].virusImageUrl,clientName,clientImageUrl})
                allTasks.push({type:'edit',day:day,videoId:_id,videoNumber,clientId,packageId:updatedPackage._id,virusId:virusId_Edit,virusName:allVirusesObj[virusId_Edit].virusName,virusImageUrl:allVirusesObj[virusId_Edit].virusImageUrl,clientName,clientImageUrl})
                allTasks.push({type:'upload',day:day,videoId:_id,videoNumber,clientId,packageId:updatedPackage._id,virusId:virusId_Upload,virusName:allVirusesObj[virusId_Upload].virusName,virusImageUrl:allVirusesObj[virusId_Upload].virusImageUrl,clientName,clientImageUrl})
            }
            for(let v=0;v<packagePosts.length;v++){
                const {_id,day,virusId_designer,virusId_uploader,virusId_photographer,postType,postNumber,clientId,clientName,clientImageUrl} = packagePosts[v];
                let prevDay = ''
                switch(day){
                    case 'سبت':prevDay='سبت'
                    break;
                    case 'أحد':prevDay='سبت'
                    break;
                    case 'إثنين':prevDay='أحد'
                    break;
                    case 'ثلثاء':prevDay='إثنين'
                    break;
                    case 'إربعاء':prevDay='ثلثاء'
                    break;
                    case 'خميس':prevDay='إربعاء'
                    break;
                    case 'جمعة':prevDay='خميس'
                    break;
                    default: prevDay=day
                }
                if(postType === 'design'){
                    allTasks.push({type:'design',day:prevDay,postId:_id,postNumber,clientId,packageId:updatedPackage._id,virusId:virusId_designer,virusName:allVirusesObj[virusId_designer].virusName,virusImageUrl:allVirusesObj[virusId_designer].virusImageUrl,clientName,clientImageUrl})
                }else {
                    allTasks.push({type:'photos',day:prevDay,postId:_id,postNumber,clientId,packageId:updatedPackage._id,virusId:virusId_photographer,virusName:allVirusesObj[virusId_photographer].virusName,virusImageUrl:allVirusesObj[virusId_photographer].virusImageUrl,clientName,clientImageUrl})
                }
                allTasks.push({type:'upload-post',day:day,postId:_id,postNumber,clientId,packageId:updatedPackage._id,virusId:virusId_uploader,virusName:allVirusesObj[virusId_uploader].virusName,virusImageUrl:allVirusesObj[virusId_uploader].virusImageUrl,clientName,clientImageUrl})
            }
        }
    }
    await taskModel.insertMany(allTasks)
}

const createTasksForThisWeak = async () => {
    const clients = await clientsModel.getAllCustomer()
    clients.map(async (e,i)=>{
        if(e.numberOfWeaks >= e.currentWeak){
            
        } else {
            await clientsModel.updateCurrentWeak(e._id,e.currentWeak + 1)
            const videos = await videoModel.find({clientId:e._id,weakNumber:e.currentWeak + 1})
            for(let i = 0; i < videos.length ; i++){
                if(videos[i].state === 'في قائمة الانتظار'){
                    taskModel.createTask('getIdea',videos[i].day,videos[i]._id,videos[i].clientId,videos[i].virusId_Idea)
                    taskModel.createTask('record',videos[i].day,videos[i]._id,videos[i].clientId,videos[i].virusId_Record)
                    taskModel.createTask('edit',videos[i].day,videos[i]._id,videos[i].clientId,videos[i].virusId_Edit)
                    taskModel.createTask('upload',videos[i].day,videos[i]._id,videos[i].clientId,videos[i].virusId)
                }else if(videos[i].state === 'قيد التصوير'){
                    taskModel.createTask('record',videos[i].day,videos[i]._id,videos[i].clientId,videos[i].virusId_Record)
                    taskModel.createTask('edit',videos[i].day,videos[i]._id,videos[i].clientId,videos[i].virusId_Edit)
                    taskModel.createTask('upload',videos[i].day,videos[i]._id,videos[i].clientId,videos[i].virusId)
                }else if(videos[i].state === 'قيد المونتاج'){
                    taskModel.createTask('edit',videos[i].day,videos[i]._id,videos[i].clientId,videos[i].virusId_Edit)
                    taskModel.createTask('upload',videos[i].day,videos[i]._id,videos[i].clientId,videos[i].virusId_Upload)
                }else if(videos[i].state === 'قيد التنزيل'){
                    taskModel.createTask('upload',videos[i].day,videos[i]._id,videos[i].clientId,videos[i].virusId_Upload)
                }
            }
        }
    })
}

const getClientTasks = async (req,res) => {
    const { clientId } = req.body
    try {
        const tasks = await taskModel.getClientTasks(clientId)

        res.status(200).json({tasks})
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const getVirusTasks = async (req,res)=> {
    const { virusId } = req.body

    try {
        const tasks = await taskModel.getVirusTasks(virusId)

        res.status(200).json({tasks})
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const rejectTask = async (req,res) => {
    const { _id,reason } = req.body

    try {
        const task = await taskModel.rejectTask(_id,reason)

        res.status(200).json({task})
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const redirectTask = async (req,res) => {
    const { _id,virusId } = req.body

    try {
        const task = await taskModel.redirectTask(_id,virusId)

        res.status(200).json({task})
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

const completeTask = async (req,res) => {
    const { _id } = req.body

    try {
        const task = await taskModel.deleteTask(_id)
        let newVideo;
        if(task.type === 'getIdea'){
            newVideo = await videoModel.updateState(task.videoId,'قيد التصوير')
        }else if(task.type === 'record'){
            newVideo = await videoModel.updateState(task.videoId,'قيد المونتاج')
        }else if(task.type === 'edit'){
            newVideo = await videoModel.updateState(task.videoId,'قيد التنزيل')
        }else if(task.type === 'upload'){
            newVideo = await videoModel.updateState(task.videoId,'تم التزيل')
        }

        res.status(200).json({task,video:newVideo})
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

module.exports = {
    getClientTasks,
    getVirusTasks,
    rejectTask,
    redirectTask,
    completeTask,
    createTasksForThisWeakV2
}