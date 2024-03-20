const mongoose = require('mongoose')

const schema = mongoose.Schema

const packageSchema = new schema({
    packageNumber: {
        type:Number,
        require:true
    },
    startDate:{
        type:Date,
        require:true
    },
    endDate:{
        type:Date,
    },
    isCompleted: {
        type:Boolean,
        default:false
    },
    client_id: {
        type:String,
        require:true
    },
    weeksCount:{
        type:Number,
        require:true
    },
    currentWeek: {
        type:Number,
        require:true
    },
    videosPerWeek: {
        type:Number,
        require:true
    },
    postsPerWeek: {
        type:Number,
        require:true
    },
    isPaused:{
        type:Boolean,
        default:false
    }
})


packageSchema.statics.createPackage = async function(client_id,weeksCount,videosPerWeek,postsPerWeek,packageNumber){
    const package = await this.create({
        startDate:Date.now(),
        client_id,
        weeksCount,
        currentWeek:0,
        videosPerWeek,
        postsPerWeek,
        packageNumber
    })

    return package
}

packageSchema.statics.getAllPackagesForClient = async function(client_id){
    const packages = await this.find({client_id})

    return packages
}

packageSchema.statics.getPackageDetails = async function(package_id){
    const package = await this.findOne({_id:package_id})

    return package
}

module.exports = mongoose.model('package',packageSchema)