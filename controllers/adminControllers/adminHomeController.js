const virusModel = require('../../models/virus')
const clientModel = require('../../models/customer')
const packageModel = require('../../models/package')
const taskModel = require('../../models/task')


const getHomeData = async (req,res) => {
    const { access } = req.admin
    let data = {viruses:null,clients:null,packages:null,tasks:null,work:null,admins:null}

    try {
        if(access.includes('viruses') || access.includes('owner')){
            let viruses = await virusModel.find()
            let virusesImages = []
            for(let i = 0; i< 3;i++){
                virusesImages.push(viruses[i].virusImageUrl)
            }
    
            data.viruses = {count:viruses.length,virusesImages}
        }
        if(access.includes('clients') || access.includes('owner')){
            let clients = await clientModel.find()
            let clientsImages = []
            for(let i = 0; i< 3;i++){
                clientsImages.push(clients[i].clientImageUrl)
            }
    
            data.clients = {count:clients.length,clientsImages}
        }
        if(access.includes('packages') || access.includes('owner')){
            let currentPackages = await packageModel.find({isCompleted:false})
            let paused =  currentPackages.filter((e) => e.isPaused === true)
            let almostCompleted = currentPackages.filter(e => e.weeksCount - e.currentWeek <= 1)
            data.packages = {
                packagesCount : currentPackages.length - paused.length,
                pausedCount : paused.length,
                almostCompletedsCount : almostCompleted.length,
            }
        }
        if(access.includes('tasks') || access.includes('owner')){
            let noneCompletedTasks = await taskModel.find({isCompleted:false})
            let moreThanOneWeekTasks = noneCompletedTasks.filter(e => !e.isCurrentWeek)
            
            data.tasks = {
                noneCompletedTasks : noneCompletedTasks.length,
                moreThanOneWeekTasks : moreThanOneWeekTasks.length,
            }
        }
        if(access.includes('work') || access.includes('owner')){
            const currentDate = new Date()
            const month = currentDate.toLocaleString('ar', { month: 'long' });
            let completedMonthWork = await taskModel.find({isCompleted:true,completeMonthDate:month})
    
            data.work = {
                completedMonthWork:completedMonthWork.length
            }
        }
        res.status(200).json(data)
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

module.exports = {getHomeData}