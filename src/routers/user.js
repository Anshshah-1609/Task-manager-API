const express = require('express')
const User = require('../models/user.js')
const auth = require('../middleware/auth.js')
const router = express.Router()
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeMail, sendDeleteMail } = require('../emails/account.js')

// User Model
// Creating User
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        sendWelcomeMail(user.email, user.name)
        const token = await user.makeAuthToken()
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})
// Login for User
router.post('/users/login', async (req,res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.makeAuthToken()
        res.send({user , token})
    } catch (error) {
        console.log(error)
        res.status(400).send()
    }
})
// Logout for User
router.post('/users/logout',auth, async (req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((t) => {
            return t.token != req.token
        })
        
        await req.user.save()
        res.send(req.user.name+": Log-out Successfully!")

    } catch (error) {
        res.status(500).send(error)
    }
})
// Logout all users
router.post('/users/logoutAll', auth, async (req,res) => {
    try {
        req.user.tokens = []

        await req.user.save()
        res.status(200).send(req.user.name+": Log-out From all Devices")
    } catch (error) {
        res.status(500).send(error)
    }
})
// Reading all users
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})
// Updating User Profile
router.patch('/users/me',auth, async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','age','email','password']
    const isValid = updates.every((up) => {
        return allowedUpdates.includes(up)
    })

    if(!isValid){
        return res.status(404).send({Error : "Property does not exist in User!"})
    }

    try {
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })
        await req.user.save()
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidator:true})
        res.send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }
})
// Upload Avatar for User
const upload = multer({
    limits : {
        fileSize : 1000000
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/.(jpg|jpeg|png|JPG|JPEG|PNG)$/)) {
            return callback(new Error("Please upload Image!!"))
        }
        callback(undefined, true)
    }
})
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req,res) => {
    const buffer = await sharp(req.file.buffer).resize({ width:250, height:250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    
    res.send("Successfully Upload Avatar!")
},(error,req,res,next) => {
    res.status(400).send({Error : error.message})
})
// Delete User Avatar
router.delete('/users/me/avatar', auth, async (req,res) => {
    try {
        if (req.user.avatar) {
            req.user.avatar = undefined
            await req.user.save()
            return res.send("Avatar Deleted!!")
        }
        else {
            res.send("Avatar does not exist!")
        }
    } catch (error) {
        res.status(500).send({Error : error.message})
    }
})
// Get avatar Image
router.get('/users/:id/avatar', async (req,res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-type','image/png')
        res.send(user.avatar)
    } catch (error) {
        res.status(404).send({Error : error.message})
    }
})
// Delete User
router.delete('/users/me', auth, async (req,res) => {

    try {
        await req.user.remove()
        sendDeleteMail(req.user.email, req.user.name)
        res.send(req.user)
    } catch(error) {
        res.status(500).send(error)
    }
})

module.exports = router
