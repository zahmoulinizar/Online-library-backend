const express = require('express')
const connectDB =  require('./Config/ConnectDB')
const cors = require('cors')
const Port = 8000
const app=express()



app.use(express.json({limit: '50mb'}))

// import cors
app.use(cors())

// import the router user
app.use("/user" , require('./Routes/user')) 

// import the router product
app.use("/prod" , require('./Routes/product'))


// invoque the connectDB 
 connectDB()


app.listen(Port , ()=>console.log('Server started'))