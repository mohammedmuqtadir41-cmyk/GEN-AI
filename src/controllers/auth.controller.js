const userModel = require("../models/user.model")

/**
 * @name registerUserControleer
 * @description Register a new user. expexts username , email and Password
 * @access Public
 */

async function registerUserController(res,res){
    const {username, email, password} = req.body

    if(!username || !email || !password){
        return res.status(400).json({message: "Please provide username, email and password"})
    }
 }

module.exports = {
    registerUserController
}