require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
const express = require("express")
const app = express()
const dotenv = require("dotenv")
app.set("view engine", "ejs")
dotenv.config()
app.set("view engine", "ejs")
const mongoose= require('mongoose')
const cors = require("cors")
//for file
const path = require("path");
const { type } = require("node:os");
const { timeStamp } = require("node:console");
const strict = require("node:assert/strict")
const UserRouter= require("./routes/User.route")
const ProductRouter= require("./routes/Product.route");
const connectDB = require("./database/connectDb");
app.use(express.urlencoded({extended: true}))  // Middleware first 
app.use(express.json())
app.use(cors())
app.use("/api/v1", UserRouter)           // Routes after
app.use("/api/v1", ProductRouter)           // Product routes


//GET
//POST   
//PUT   Partially updating information on the server
//PATH
//DELETE

//100
//200
//300
//400
//500

mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
    console.log("Mongodb connected successfullly");
    
})

.catch((error=>{
    console.log("Cannot connect to database", error);
    
}))

// const UserSchema= new mongoose.Schema({
//     firstName:{type:String, required: true}, 
//     lastName: {type: String, required:true},
//     email: {type: String, required: true ,unique: true},
//     password: {type: String, required: true},
// }, {timestamps: true, strict: "throw"})

// const UserModel = mongoose.model("user", UserSchema)

//[]--> Arraya
//{}--> Object
//app.get(Path2D, callback)
app.get("/", (request, response)=>{
    //response.send("Welcome to my node application")
    //response.send("Fruit=[Banana, Mango, Orange, Apple, Pineapple]")
    response.send([
        { id: 1, name: "Mercy Bam", grade: "A", class: "SS2" },
        { id: 2, name: "Bob Marly", grade: "B", class: "SS1" },
        { id: 3, name: "Charlie Brown", grade: "A+", class: "SS3" }
    ]);
})

let students = [
    { id: 1, name: "Mercy", grade: "A", class: "SS2" },
    { id: 2, name: "Bob Marly", grade: "B", class: "SS1" },
    { id: 3, name: "Charlie Brown", grade: "A+", class: "SS3" }
]

let users = []

//Users to get file
app.get("/getFile", (req,res)=>{
    console.log(__dirname);//__dirname is to help you to get the root dir you are in 

    let fileToRender = path.join(__dirname, "index.html")
    console.log(fileToRender);
    
    res.sendFile(fileToRender)
})

app.get("/getAbout",(req,res)=>{
    console.log(__dirname);

    let myFile = path.join(__dirname, "about.html")
    console.log(myFile)

    res.sendFile(myFile)
} )

app.get("/getImage", (req,res)=>{
    console.log(__dirname);
    
    let fileTOMe = path.join(__dirname, "e7rMzl.webp")
    console.log(fileTOMe);

    res.sendFile(fileTOMe)
})

app.get("/ejsFile", (req, res)=>{
    let gender = "female"
    res.render('index', {gender,students})
})

app.get("/addStudents", (req,res)=>{
    res.render('addProduct')
})

app.post("/addStudents", (req, res)=>{
    console.log(req.body);
    
    students.push(req.body)
    let gender= "male"
    res.render('index', {gender,students })
})

app.post("/delete/:id", (req, res)=>{
    console.log(req.params.id);
    students.splice(req.params.id, 1)
    let gender = "male"
    res.render('index', {gender, students})

})

app.get("/editStudents/:id", (req,res)=>{
    console.log(req.params);

    res.render("editStudents")
    
})

app.post("/editStudents/:id", (req,res)=>{
    const {title, price, description, rating,stock} = req.body
    const {id} = req.params
    students.splice(id, 1, req.body)
    let gender = "male"
    res.render("index", {gender, students})
})

// app.get("/register", async (req,res)=>{
//     const users = await UserModel.find();
//     res.render("registerUser", { users })
    
// })

// app.post("/register", async (req, res) => {
//     try {
//         await UserModel.create(req.body);

//         const users = await UserModel.find();

//         res.render("registerUser", { users });

//     } catch (error) {
//         console.log(error);
//         res.status(400).send("User cannot be created");
//     }
// });

// cluster
// database
// collection
// documents




// Creating a Server  
// app.listen("port", callback(()=>{}))x

const PORT = process.env.PORT || 5005;

app.listen(PORT, (err) => {
  if (err) {
    console.log("error starting server");
  } else {
    console.log(`server started successfully on port ${PORT}`);
  }
});

module.exports = async(req,res)=>{
    await connectDB
    return app(req, res)
}