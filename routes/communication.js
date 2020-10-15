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

//Sending a message in a chat
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

//Remove a connection/match

router.delete('/connection/remove/:connectionAccountId', jwtVerify, async (req, res) => {

    try {

        let currentUsersAccount = await Account.findOne({userId: req.user.userId}).populate('chats').populate('connections')
        let connectionAccount = await Account.findById(req.params.connectionAccountId).populate('chats').populate('connections')

        //Remove connection from current users matches && Remove chat from current users chat array

        let chatId, usersChatIndex, connectionsChatIndex;

        let index = currentUsersAccount.connections.indexOf(connectionAccount._id) //index of match in current users connections array
        currentUsersAccount.chats.forEach((chat, i) => {
            if(chat.users.includes(connectionAccount._id) && chat.users.includes(currentUsersAccount._id)){
                chatId = chat._id   //Identify the common chat id
                usersChatIndex = i; //Itentify the index of the chat in users chats array
            }
        })
        currentUsersAccount.connections.splice(index, 1) //remove the identified index from connection array of the current user
        await currentUsersAccount.save()
        currentUsersAccount.chats.splice(usersChatIndex, 1) // remove the indetified index from the chats array of the current user
        await currentUsersAccount.save()

//Remove current user from connections matches && Remove chat from connections chat array

        let indexB = connectionAccount.connections.indexOf(currentUsersAccount._id)//index of match in connections accounts connections array
        connectionAccount.chats.forEach((chat, i)=> {
            if(chat.users.includes(connectionAccount._id) && chat.users.includes(currentUsersAccount._id)){
                connectionsChatIndex = i; //Identify index of the chat in connections chat array
            }
        })
        connectionAccount.connections.splice(indexB, 1) //remove the identified index from connection array of the match
        await connectionAccount.save()
        connectionAccount.chats.splice(connectionsChatIndex, 1)// remove the indetified index from the chats array of the match
        await connectionAccount.save()




//Remove chat from chat collection
        await Chat.findByIdAndDelete(chatId)
//Respond with success message
        res.json({
            message: 'Connection/Match successfully removed from your list',
            index: index,
            indexB: indexB,
        })
        
    } catch (error) {
        console.log(error)
        res.json({
            message: 'Error: Could not remove connection',
            error
        })
    }
})
module.exports = router