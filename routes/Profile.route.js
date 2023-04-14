const express=require("express");
const  profileRouter=express.Router()
const session = require('express-session');
const {ProfileModel}=require("../models/Profile.model")
const multer = require('multer');
profileRouter.use(express.json())
profileRouter.get("/",async(req,res)=>{
const profile=await ProfileModel.find()
    res.send(profile)
})





// configure Multer for handling file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 5 // limit file size to 5 MB
  }
});



// handle POST requests to create a new user with a file and message
profileRouter.post('/create', upload.single('file'), (req, res) => {
  const { firstName, lastName, email, phone, address, message } = req.body;
  const file = req.file.buffer;
// console.log("f",file)
  const newUser = new ProfileModel({
    firstName,
    lastName,
    email,
    phone,
    file,
    message
  });

  newUser.save()
    .then(() => {
      res.send('ProfileModel saved successfully');
    }).catch(error => {
      console.error(error);
      res.status(500).send('Error saving user');
    });
});

profileRouter.get('/:id/file', (req, res) => {
    const id = req.params.id;
  
    ProfileModel.findOne({ _id: id })
      .then(profile => {
        if (!profile) {
          return res.status(404).send('Profile not found');
        }
  
        res.setHeader('Content-Type', 'application/pdf');
        res.send(profile.file);
      }).catch(error => {
        console.error(error);
        res.status(500).send('Error fetching file');
      });
  });
  


// profileRouter.post("/create",async(req,res)=>{
//     const payload=req.body
//     try{
//         const new_profile=new ProfileModel(payload)
//         await new_profile.save()
//         res.send("Created the profile")    
//     }
//     catch(err){
// console.log(err)
// res.send({"msg":"somthing went wrong"})
//     }
    
// })

profileRouter.patch("/update/:id",async(req,res)=>{
    const id = req.params.id;
    const payload = req.body;
    const profile=await ProfileModel.findOne({"_id":id})
    const userID_in_note=profile.userID
    const userID_making_req=req.body.userID
    try {
        if(userID_making_req!==userID_in_note){
            res.send({"msg":"you are not authorised"})
        }else{
            await ProfileModel.findByIdAndUpdate({ "_id": id }, payload)
        res.send(`updated the profile whose id is ${id}`)
        }
    }

    catch (err) {
        console.log(err)
        res.send("err: somthing went wrong")
    }
})
profileRouter.delete("/delete/:id",async(req,res)=>{
    const id = req.params.id;
    const profile=await ProfileModel.findOne({"_id":id})
    const userID_in_note=profile.userID
    const userID_making_req=req.body.userID
    try {
        if(userID_making_req!==userID_in_note){
            res.send({"msg":"you are not authorised"})
        }else{
            await ProfileModel.findByIdAndDelete({ "_id": id })
        res.send(`deleted the profile whose id is ${id}`)
        }
    }

    catch (err) {
        console.log(err)
        res.send("err: somthing went wrong")
    }
})


profileRouter.use(session({
  secret: 'your-secret-key-here',
  resave: false,
  saveUninitialized: false,
}));

profileRouter.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("logout sucessfull")
      res.redirect('/');
    }
  });
});

module.exports={profileRouter}