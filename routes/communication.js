const router = require('express').Router()
const jwtVerify = require('../middleware/jwtVerify')
const User = require('../models/User')
const Account = require('../models/Account')
const Image = require('../models/Image')
const Chat = require('../models/Chat')


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

    recipientAccount.connections.push(senderAccount)
    senderAccount.connections.push(recipientAccount)

    await recipientAccount.save()
    await senderAccount.save()

    res.json({
        message: "A connection between both users has been established successfully"
    })

    //Create a chat which signifies a connection made

    //Add the chat into the first users chat array

    //add the chat into the second users chat array 

    //Delete invitation from the recipients array

})
module.exports = router