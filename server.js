const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');

// daily scheduler
require('./functions/scheduler')


// virus routes
const virusRouter = require('./routes/virusRoutes/virusRoutes')
const virusTaskRoutes = require('./routes/virusRoutes/virusTasksRoutes')
const virusClientRoutes = require('./routes/virusRoutes/virusClientRoutes')
const virusWorkRoutes = require('./routes/virusRoutes/virusWorkRoutes')
const virusMyAccRoutes = require('./routes/virusRoutes/virusMyAccRoutes')
//client routes
const customerRoutes = require('./routes/clientRoutes/customerRoutes')
const clientPackageRoutes = require('./routes/clientRoutes/clientPackageRoutes')
const clientDetailsRoutes = require('./routes/clientRoutes/clientDetailsRoutes')
//admin routes
const adminClientRoutes = require('./routes/adminRoutes/adminClientRoutes')
const adminPackageRoutes = require('./routes/adminRoutes/adminPackageRoutes')
const adminRoutes = require('./routes/adminRoutes/adminRoutes')
const adminVirusClient = require('./routes/adminRoutes/adminVirusClientRoutes')
const adminVirusRoutes = require('./routes/adminRoutes/adminVirusRoutes')
const adminTasksRoutes = require('./routes/adminRoutes/adminTasksRoutes')
const adminWorkRoutes = require('./routes/adminRoutes/adminWorkRoutes')
const adminHomeRoutes = require('./routes/adminRoutes/adminHomeRoutes')
//owner routes
const ownerLoginRoutes = require('./routes/ownerRoutes/ownerLoginRoutes')
const ownerAdminRoutes = require('./routes/ownerRoutes/ownerAdminRoutes')


const app = express()
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json())
app.use(cors({
    origin:'*',
    methods:'GET,POST,PUT,DELETE',
    credentials:true
}))

app.get('/',(req,res)=>{
    console.log('got response!!')
    res.send('<h1>hello there!!!</h1>')
})

app.get('/test',(req,res)=>{
    console.log('got test!!')
    res.send('<h1>hello there!!!</h1>')
})

// virus end points
app.use('/virus',virusRouter)
app.use('/virus-task',virusTaskRoutes)
app.use('/virus-client',virusClientRoutes)
app.use('/virus-work',virusWorkRoutes)
app.use('/virus-details',virusMyAccRoutes)
// client end points
app.use('/customer',customerRoutes)
app.use('/client-package',clientPackageRoutes)
app.use('/client-details',clientDetailsRoutes)
// admin end points
app.use('/admins',adminRoutes)
app.use('/admin-package',adminPackageRoutes)
app.use('/admin-client',adminClientRoutes)
app.use('/admin-virus-client',adminVirusClient)
app.use('/admin-virus',adminVirusRoutes)
app.use('/admin-tasks',adminTasksRoutes)
app.use('/admin-work',adminWorkRoutes)
app.use('/home',adminHomeRoutes)
// owner end points
app.use('/owner',ownerLoginRoutes)
app.use('/owner-admin',ownerAdminRoutes)


console.log(`port: ${process.env.PORT}`)
console.log(`MONGODB_URL: ${process.env.MONGODB_URL}`)

mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`listening to port ${process.env.PORT} & connected to mongodb`)
    })
})
.catch((err)=>{
    console.log(err)
})