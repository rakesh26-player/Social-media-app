const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv') // to store some important apis url
const helmet = require('helmet')
const morgan = require('morgan')
const userRoute = require("./routes/users.js")
const authRoute = require("./routes/auth.js")
const postRoute = require("./routes/posts.js")
const multer  = require('multer')
const path = require("path")

dotenv.config()
const port = 8800
mongoose.connect("mongodb://localhost:27017/new", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Failed to connect to MongoDB:", error);
    });

app.use("/images", express.static(path.join(__dirname, "public/images")))
app.use(express.json()); // bodyparser post method
app.use(helmet())
app.use(morgan("common")) // send details of the request in console 

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images");
    },
    filename: (req, file, cb) => {
      cb(null, req.body.name);
    },
  });

const upload = multer( {storage} )

app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
        console.log("File:", req.file); // Log file details
        console.log("Body:", req.body); // Log additional data
      return res.status(200).json("File uploded successfully");
    } catch (error) {
      console.error(error);
    }
  });



app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

app.get('/', (req, res) => {
    res.send('home page!')
})

app.get('/users', (req, res) => {
    res.send('no')
    console.log("hello")
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})