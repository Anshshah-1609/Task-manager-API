const jwt = require('jsonwebtoken')
const User = require('../models/user.js')

const auth = async (req,res,next) => {
    // console.log("in middleware/auth.js file")
    try {
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const user = await User.findOne({ _id:decoded._id, 'tokens.token' : token })

        if (!user) {
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
        
    } catch (error) {
        res.status(404).send({ Error : 'Please Authenticate!'})
    }
}
module.exports = auth