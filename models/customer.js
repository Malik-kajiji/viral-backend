const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const schema = mongoose.Schema

const customerSchema = new schema({
    name: {
        type:String,
        required:true,
        unique:true
    },
    password: {
        type:String,
        required:true
    },
    businessType: {
        type:String,
        required:true
    },
    clientSince:{
        type:Date
    },
    phoneNumber: {
        type:String,
        required:true
    },
    accountName: {
        type:String,
        required:true
    },
    accountPassword: {
        type:String,
        required:true
    },
    currentPackage: {
        type:String,
    },
    clientImageUrl: {
        type:String,
        default:'',
        required:true
    },
    passwordChangedAt: {
        type:Date
    }
})

customerSchema.statics.editCustomer = async function(_id,name,phoneNumber,clientImageUrl,businessType,accountName,accountPassword){
    const customer = await this.findOneAndUpdate({_id},{name,phoneNumber,clientImageUrl,businessType,accountName,accountPassword})

    return {...customer._doc,name,phoneNumber,clientImageUrl,businessType,accountName,accountPassword}
}

customerSchema.statics.addCustomer = async function(name,password,phoneNumber,clientImageUrl,businessType,accountName,accountPassword){
    const exists = await this.findOne({name})
    if(exists){
        throw Error('الاسم موجود بالفعل')
    }else {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password,salt)
        const customer = await this.create({
            name,
            password:hash,
            phoneNumber,
            clientImageUrl,
            clientSince:Date.now(),
            passwordChangedAt:Date.now(),
            businessType,
            accountName,
            accountPassword
        })
        return customer
    }
} 

customerSchema.statics.removeCustomer = async function(_id) {
    const exists = await this.findOne({_id})
    if(!exists){
        throw Error('الاسم غير موجود')
    }
    const removed = await this.findOneAndDelete({_id})
    return removed
}

customerSchema.statics.login = async function(name,password){
    const customer = await this.findOne({name})
    if(!customer){
        throw Error('الحساب غير موجود يرجى انشاء حساب')
    }

    const match = await bcrypt.compare(password,customer.password)

    if(!match){
        throw Error('كلمة مرور غير صحيحة')
    }

    return customer
}

customerSchema.statics.changePassword = async function(_id,password) {
    const customer = await this.findOne({_id})
    if(!customer){
        throw Error('الحساب غير موجود يرجى انشاء حساب')
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password,salt);

    await this.findOneAndUpdate({_id},{password:hash,passwordChangedAt:Date.now()})

    return {...customer._doc,password:hash}
}

customerSchema.statics.getAllCustomer = async function() {
    const customers = await this.find()

    return customers
}

customerSchema.statics.updateCurrentPackage = async function(_id,package_id) {
    const customer = await this.findOneAndUpdate({_id},{currentPackage:package_id})

    return customer
}

// customerSchema.statics.updateWeaks = async function(_id,numberOfWeaks){
//     await this.findOneAndUpdate({_id},{numberOfWeaks,currentWeak:1})
// }

// customerSchema.statics.updateCurrentWeak = async function (_id,currentWeak) {
//     await this.findOneAndUpdate({_id},{currentWeak})
// }

module.exports = mongoose.model('customer',customerSchema)