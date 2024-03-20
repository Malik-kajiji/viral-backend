const taskModel = require('../models/task')
const videoModel = require('../models/videos')
const postModel = require('../models/post')
const cron = require('node-cron');

// This function will be executed every day at 11:59 PM
const task = async () => {
    let currentDay = ''
    const currentDayIndex = new Date().getDay() 
    switch(currentDayIndex){
        case 0:
            currentDay = 'أحد'
        break;
        case 1:
            currentDay = 'إثنين'
        break;
        case 2:
            currentDay = 'ثلثاء'
        break;
        case 3:
            currentDay = 'إربعاء'
        break;
        case 4:
            currentDay = 'خميس'
        break;
        case 5:
            currentDay = 'جمعة'
        break;
        case 6:
            currentDay = 'سبت'
        break;
        default: 
            currentDay = 'سبت'
    }

    const uploadTasks = await taskModel.find({isCompleted:false,type:{$in:['upload','upload-post']},day:currentDay})
    for(let i=0;i<uploadTasks.length;i++){
        const task = uploadTasks[i]
        if(task.type === 'upload'){
            await videoModel.findOneAndUpdate({_id:task.videoId},{isDelayed:true})
        }else {
            await postModel.findOneAndUpdate({_id:task.postId},{isDelayed:true})
        }
    }
    await taskModel.updateMany({isCompleted:false,day:currentDay},{isDelayed:true})
};

// Schedule the task to run at 11:59 PM every day
// cron.schedule('59 23 * * *', task);
cron.schedule('34 17 * * *', task);