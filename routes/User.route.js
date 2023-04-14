const express=require("express")
const {UserModel}=require("../models/User.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
require("dotenv").config()
const userRouter=express.Router()
userRouter.post("/register", async (req, res) => {
    const { name, pass, email, age } = req.body
    try {
        bcrypt.hash(pass, 5, async (err, secure_password) => {
            if (err) {
                console.log(err)
            }
            else {
                let user = new UserModel({ name, pass: secure_password, email, age })
                await user.save()
                res.send("registerd")
            }
        })

    }
    catch (err) {
        res.send("Error while registring")
        console.log(err)
    }

})

userRouter.post("/login", async (req, res) => {
    const { email, pass } = req.body
    try {
        const user = await UserModel.find({ email })
        const hashed_pass=user[0].pass
        if (user.length > 0) {
            bcrypt.compare(pass,hashed_pass,(Err,result)=>{
                if(result){
                    const token = jwt.sign({userID:user[0]._id}, process.env.key)
                    console.log(token)
                    res.send({ "msg": "login successfull", "token": token })
                }else{
                    res.send("worng Credentials")
                }
            })

        }
        else {
            res.send("wrong credentials")
        }
    }

    catch (err) {
        res.send("somthing went wrong")
        console.log(err)
    }
})

module.exports={userRouter}