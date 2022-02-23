// CRUD - create,read,update,delete

const { MongoClient, ObjectId, CURSOR_FLAGS } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const dbName = 'task-manager'

MongoClient.connect(connectionURL, { useNewUrlParser:true}, (error,client) => {
    if(error){
        return console.log("Unable to connect with database")
    }
    // console.log("Connected Correctly")
    const db = client.db(dbName)
    
    //  /home/anshshah/mongodb/bin/mongod --dbpath=/home/anshshah/mongodb-data
console.log("-----------------------------------------------------")
    // const update = db.collection('users').updateOne({
    //     _id: new ObjectId("620ca29bcf9a89c51a381996")
    // },{
    // $set:{                                                // updateOne()
    //         fname:'Mike',
    //         age:27
    //     }
    // })
    // update.then((result)=>{
    //     console.log(result)
    // }).catch((error)=>{
    //     console.log("Error :",error)
    // })

    // db.collection('tasks').updateMany({
    //     status : false
    // },{
    //     $set:{
    //         status:true                              // updateMany()
    //     }
    // }).then((result)=>{
    //     console.log(result)
    // }).catch((error)=>{
    //     console.log("Error :",error)
    // })

    // db.collection('users').deleteMany({
    //     age : 29
    // }).then((result)=>{
    //     console.log(result)                         // deleteMany()
    // }).catch((error)=>{
    //     console.log("Error :",error)
    // })

    // db.collection('tasks').deleteOne({
    //     description : "HTML/CSS"
    // }).then((result)=>{
    //     console.log(result)                         // deleteOne()
    // }).catch((error)=>{
    //     console.log("Error :",error)
    // })


// // Generate instance of Model
// const me = new User({
//     name : "  Mikey  ",
//     age : 22,
//     email : "MIKEY0961@gmail.com",
//     password : "mikey001"
    
// })
// me.save().then(()=>{
//     console.log(me)
// }).catch((error)=>{
//     console.log("Error :",error)
// })
})