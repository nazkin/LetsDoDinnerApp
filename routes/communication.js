const router = require('express').Router()
const jwtVerify = require('../middleware/jwtVerify')
const User = require('../models/User')
const Account = require('../models/Account')
const Image = require('../models/Image')
const Chat = require('../models/Chat')
const Message = require('../models/Message')

//Connection invitation
router.post('/invitation/:id', jwtVerify, async (req, res)=> {
    const recipient = req.params.id;
    try {
        const recipientAccount = await Account.findById(recipient)
        const senderAccount = await Account.findOne({userId: req.user.userId})
        recipientAccount.invitations.push(senderAccount);
        await recipientAccount.save();
        res.json({
            message: 'Invitation to connect sent successfully'
        })
        
    } catch (error) {
        res.json({
            message: 'Invitation to connect failed to send'
        })
    }

})
//Connection accept
router.post('/invitation/accept/:id', jwtVerify, async (req, res)=> {
    const recipient = req.params.id;//This id is retrieved from the invitation request

    const recipientAccount = await Account.findById(recipient)
    const senderAccount = await Account.findOne({userId: req.user.userId})

    const chat = new Chat({
        users: [senderAccount, recipientAccount]
    })
    const startedChat = await chat.save()
    //Adding the new connection
    recipientAccount.connections.push(senderAccount)
    senderAccount.connections.push(recipientAccount)
    //Creating the chat
    recipientAccount.chats.push(startedChat)
    senderAccount.chats.push(startedChat)
    //Removing the invitation
    senderAccount.invitations.pop(recipientAccount)

    await recipientAccount.save()
    await senderAccount.save()

    res.json({
        message: "A connection between both users has been established successfully"
    })

})
//Connection decline

router.post('/invitation/decline/:id', jwtVerify, async (req, res) => {
    try {
        const dmAccount = await Account.findOne({userId: req.user.userId})
        const senderAccount = await Account.findById(req.params.id)
    
        dmAccount.invitations.pop(senderAccount)
        await dmAccount.save()
    
        res.json({
            message: "Invitation removed successfully"
        })
    } catch (error) {
        res.json({
            message: "Could not remove invitaion",
            err: error
        })
    }

})


//Fetching a chat between two users
router.get('/chatdata/:id', jwtVerify, async (req, res)=> {

    try {
        const chat = await Chat.findById(req.params.id).populate('users').populate('messages')
        res.json({
            message: "Chat information retrieved successfully",
            info: chat,
            userId: req.user.userId
        })
    } catch (error) {
        res.json({
            message: "Error: Could not retrieve chat information",
            err: error
        })
    }

})

router.post('/message/:id', jwtVerify, async (req,res)=>{
    const chatId = req.params.id
    const sender = req.user.userId

    const message = new Message({
        sentBy: req.user.userId,
        body: req.body.body,
        chatId: req.params.id
    })
    const savedMsg = await message.save()

    const chat = await Chat.findById(chatId)
    chat.messages.push(savedMsg)
    await chat.save()

    res.json({
        message: "Message was sent effectively"
    })

})
module.exports = router