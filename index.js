const express = require("express")
const { connection } = require("./configs/db")
const {userRouter}=require("./routes/User.route")
const {profileRouter}=require("./routes/Profile.route")
const {authenticate}=require("./middlwwares/authenticate.middleware")
const cors=require("cors")
require("dotenv").config()

const port =process.env.port
const app = express()
app.use(cors({
    origin:"*"
}))
app.use(express.json())


app.get("/", (req, res) => {
    res.send("welcome")
})

app.use("/users",userRouter)
// app.use(authenticate)
app.use("/profile",profileRouter)



app.listen(port, async () => {
    try {
        await connection
        console.log("connected to db")
    } catch (err) {
        console.log(err)
    }

    console.log("port is running at 8080")
})

