import express, {Request, Response} from 'express';
import { createServer } from 'http'
import models from './models/models';
import { authenticateToken } from './authMiddleware';

const port = 3000
const cors = require('cors')
const mongoose = require('mongoose')
const User = models.User
const jwt = require('jsonwebtoken') 
const rateLimit = require('express-rate-limit')

const app = express();

app.use(cors())
app.use(express.json())

const server = createServer(app)

mongoose.connect('mongodb://localhost:27017/simple-jwt-server')

const verifyStatusRateLimit = rateLimit({
    // windowMs: 15 * 60 * 1000, 
    // max: 10
})

app.post('/api/verifyStatus', async (req: Request, res: Response) => {
    try{
        const decodedToken = await jwt.decode( req.body.token, 'secretPass')
        const userEmail = decodedToken.email
        const user = await User.findOne({
            email: userEmail
        })
        console.log('user found: ', user)
        if(user){
            res.json({status: 'ok', token: decodedToken, userEmail: user.email})
        } else {
            res.json({status: 'error', error: 'User not found'})
        }
    }catch(error){
        res.json({status: 'error', error: 'Could not decode the token.'})
    }    
})

const registerRateLimit = rateLimit({
    // windowMs: 60 * 60 * 1000,
    // max: 3
})

app.post('/api/register', registerRateLimit, async (req: Request, res: Response) => {
    try{
        await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        })
        res.json({status: 'ok'})
    }catch(error){
        res.json({status: 'error', error: 'Duplicate email'})
    }    
})

const loginRateLimit = rateLimit({
    // windowMs: 20 * 60 * 1000, 
    // max: 12
})

app.post('/api/login', async (req: Request, res: Response) => {
    const user = await User.findOne({
        email: req.body.email,
        password: req.body.password
    })
    console.log('USER FIRST INTERACTION: ', user)
    if (user) {
        const token = jwt.sign({
            name: user.firstName,
            email: user.email
        },'secretPass')
    
        user.token = token
        await user.save()
        return res.json({status: 'ok', user: token})
    } else{
        return res.json({status: 'error', user: false})
    }
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})