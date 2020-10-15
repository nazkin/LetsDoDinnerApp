const router = require('express').Router()
const jwtVerify = require('../middleware/jwtVerify')
const User = require('../models/User')
const Account = require('../models/Account')
const Image = require('../models/Image')
const Chat = require('../models/Chat')
// const { ascending, descending, calcBirthday } = require('../zhelpers')
//Helper function

const calcBirthday = (dateString) => {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

//User creates account

router.post('/create', jwtVerify ,async (req, res)=> {
    const account = new Account({
        nickname: req.body.nickname,
        userId: req.user.userId,
        description: req.body.description,
        gender: req.body.gender,
        dob: new Date(req.body.dob),
        age: calcBirthday(req.body.dob),
        interestedIn: req.body.interestedIn,
        matchAgeMax: parseInt(req.body.ageMax),
        matchAgeMin: parseInt(req.body.ageMin),
        country: req.body.country,
        region: req.body.region,
        city: req.body.city
    })

    const savedAccount = await account.save();
    res.json({
        message: 'Great, account information is saved',
        accountInfo: {
            accountId: savedAccount._id,
            userId: savedAccount.userId,
        }
    })
})

//User uploads photographs to their account

router.post('/upload', jwtVerify, async (req, res)=> {

    const image = new Image({
        downloadUrl: req.body.downloadUrl,
        caption: req.body.caption,
        userId: req.user.userId
    });

    try {
        const usrAccount = await Account.findOne({userId: req.user.userId})
        const savedImage = await image.save()
        usrAccount.avatar = savedImage.downloadUrl
        usrAccount.images.push(savedImage)
        const accountUpdate = await usrAccount.save()

        res.json({
            message: "Image saved successfully",
            update: accountUpdate
        })
    } catch (error) {
        res.json({
            message: 'Error while saving the new image',
            error
        })
    }


})

//User retrieves their own account to display information
router.get('/info', jwtVerify, async (req, res)=> {
    try {
        const account = await Account.findOne({userId: req.user.userId}).populate('images').populate('invitations').populate('connections').populate('chats')

        res.json({
            message: 'Account retrieved successfully',
            account: account,
            
        })

    } catch (error) {
        res.json({
            message: "error retrieving users account: ",
            err: error 
        })
    }  


});
//Retrieving the account of a user whose account is currently being viewed 
router.get('/info/:id', jwtVerify, async (req, res)=> {
    try {
        const account = await Account.findOne({_id: req.params.id}).populate('images').populate('chats')
        const usersAccount = await Account.findOne({userId: req.user.userId})
        let hasConnection = false //has a connection been established tracker 
        let invitePending = false //has an invitation been sent tracker
        let gotInvited = "" //who sent the invitation 
        let chatId = null //if a chat exist this chatId will be sent over
        
        //did either of the users send an invite to one another
        if(account.invitations.includes(usersAccount._id)) {    //User invited the account he is viewing
            invitePending = true
            gotInvited = 'no'
        } else if(usersAccount.invitations.includes(account._id)){ //Account being viewed invited current user
            invitePending = true
            gotInvited = 'yes'
        }
        //has a connection been established between two users
        else if(account.connections.includes(usersAccount._id) || usersAccount.connections.includes(account._id)){
            hasConnection = true
            account.chats.forEach(chat => {
                if(chat.users.includes(usersAccount._id) && chat.users.includes(account._id)){
                    chatId = chat._id
                }
            })
        } 
        res.json({
            message: 'Account retrieved successfully',
            account: account,
            hasConnect: hasConnection,
            hasInvite: invitePending,
            gotInvited: gotInvited,
            chat: chatId
        })

    } catch (error) {
        console.log(error)
        res.json({
            message: "error retrieving users account: ",
            err: error 
        })
    }  


});
//User updates information in their own account 
router.post('/update/:id', jwtVerify, async (req, res) => {
    const update = req.body.account;
    try {
        const updatedAccount = await Account.findByIdAndUpdate(req.params.id, update)
        res.json({
            message: "Updated Successfully",
            data: updatedAccount
        })
    } catch (error) {
        res.json({
            error: error
        })
    }
})

//Retrieving users that have recently been logged in

router.get('/recent-users', jwtVerify, async (req, res) => { 
    try{
        const recentAccounts = []
        const usersAccount = await Account.findOne({userId: req.user.userId})
        let accounts = (usersAccount.interestedIn === "everyone" || !usersAccount.interestedIn) ? await Account.find({}).populate('userId') : await Account.find({gender: usersAccount.interestedIn}).populate('userId')

        accounts.forEach((account, i) => {
            //remove the user from the list
            const isUser = account.userId === req.user.userId
            //filter accounts based on users age preferences
            const isRightAge = account.age <= usersAccount.matchAgeMax && account.age >= usersAccount.matchAgeMin
            //filter out the genders
            
            //OTHER LOGIC FOR FILTERING SPECIFIC USERS
            if(!isUser && isRightAge){
                recentAccounts.push(account)
            }
        })
        res.json({
            message: "Recent accounts retrieved",
            accounts: recentAccounts,
            user: usersAccount
        })
    } catch(err) {
        console.log(err);
        res.json({
            message: "Error retrieving recently active accounts",
            error: err
        })
    }
})
//Updating Images
router.post('/image/update-text/:imgId', jwtVerify, async (req, res) => { 
    try {
        await Image.findByIdAndUpdate(req.params.imgId, {caption: req.body.captionUpdate})
        res.json({
            message: "Image caption updated"
        })
    } catch (error) {
        console.log(error)
        res.json({
            message: "Error: Fail to update image caption"
        })
    }
    
})


//Filtering users
router.post('/filtered-users', jwtVerify, async (req, res) => {
    const filteredAccounts = []
    let accounts
    const usersAccount = await Account.findOne({ userId: req.user.userId })

    const filters = {
        interestedIn: req.body.interestedIn, // rename to genderOfInterest
        matchAgeMax: req.body.matchAgeMax,
        matchAgeMin: req.body.matchAgeMin,
        location: req.body.location,
        sort: req.body.sort
    }
    try {
            //Basic filtering by gender, and by location if requested 
        if (filters.interestedIn !== 'everyone') {
            if(filters.location === 'none') {
                accounts = await Account.find({ gender: filters.interestedIn }).populate('userId')
            }else if(filters.location === 'sameCountry') {
                accounts = await Account.find({ gender: filters.interestedIn, country: usersAccount.country }).populate('userId')
            }else if(filters.location === 'sameRegion') {
                accounts = await Account.find({ gender: filters.interestedIn, country: usersAccount.country, region: usersAccount.region }).populate('userId')
            }else if(filters.location === 'sameCity') {
                accounts = await Account.find({ gender: filters.interestedIn, country: usersAccount.country, region: usersAccount.region, city: usersAccount.city }).populate('userId')
            }
        } else if (filters.interestedIn === 'everyone') {
            if(filters.location === 'none') {
                accounts = await Account.find({}).populate('userId')
            }else if(filters.location === 'sameCountry') {
                accounts = await Account.find({ country: usersAccount.country }).populate('userId')
            }else if(filters.location === 'sameRegion') {
                accounts = await Account.find({ country: usersAccount.country, region: usersAccount.region }).populate('userId')
            }else if(filters.location === 'sameCity') {
                accounts = await Account.find({ country: usersAccount.country, region: usersAccount.region, city: usersAccount.city }).populate('userId')
            }
        }else {
            accounts = await Account.find({}).populate('userId')
        }
        //filter user and ages
        accounts.forEach((account, i) => {
            console.log('Candidate 1 ' + account.userId);
            console.log('Candidate 2 ' + account.userId);
            //OTHER LOGIC FOR FILTERING SPECIFIC USERS
            if(account.userId.toString() !== usersAccount.userId.toString() && account.age <= filters.matchAgeMax && account.age >= filters.matchAgeMin){

                filteredAccounts.push(account)
            }
        })
    
        //Sorting logic
        if(filters.sort === "youngest") {
            filteredAccounts.sort((a,b) => {
                // var ageA = Number(calcBirthday(a.dob))
                // var ageB = Number(calcBirthday(b.dob))

                const ageA = new Date(a.dob)
                const ageB = new Date(b.dob)
                if(ageA < ageB) {
                    return 1
                }else if(ageA > ageB) {
                    return -1
                }else {
                    return 0
                }
            })
        } else if(filters.sort === "oldest") {
            filteredAccounts.sort((a,b) => {
                let comparison = 0
                // const ageA = Number(calcBirthday(a.dob))
                // const ageB = Number(calcBirthday(b.dob))
                const ageA = new Date(a.dob)
                const ageB = new Date(b.dob)
            
                if(ageA > ageB) {
                    comparison = 1
                }else if(ageA < ageB) {
                    comparison = -1
                }else {
                    compariosn = 0
                }
            
                return comparison
            
            })
        } else if(filters.sort === "newest"){
            filteredAccounts.sort((a,b) => {
                let comparison = 0
                const ageA = new Date(a.userId.date)
                const ageB = new Date(b.userId.date)

                            
                if(ageA < ageB) {
                    comparison = 1
                }else if(ageA > ageB) {
                    comparison = -1
                }else {
                    compariosn = 0
                }
                return comparison
            
            })
        }

        res.json({
            message: "Users filtered successfully",
            filteredAccounts: filteredAccounts
        })
        
    } catch (error) {
        res.json({
            message: "Error while applying filters",
            err: error
        })
    }
    

})

//Checking if the user has any unread messages or new invitations
router.get('/new-com', jwtVerify, async (req, res) => {
    const usersAccount = await Account.findOne({ userId: req.user.userId }).populate('chats').populate('invitations')
    let invitations = false
    let unansweredMsg = false
    //Check if the user has any unanswered invitations
    if(usersAccount.invitations.length > 0){
        invitations = true
    }
    try {
        const chats = []
        for(let i = 0; i < usersAccount.chats.length; i++) {
            const chat = await Chat.findById(usersAccount.chats[i]._id).populate('messages')
            if(chat.messages.length > 0){ //Were there any messages sent in this chat
                let lastMessage = chat.messages[chat.messages.length - 1]
                if(lastMessage.sentBy.toString() !== req.user.userId.toString()) { //Who sent the last message
                    unansweredMsg = true
                    break
                } 
            }
           
        }
    
        res.json({
            message: 'Chats fetched successfully',
            invites: invitations,
            noAnswer: unansweredMsg,
            account: usersAccount
        }) 
    } catch (error) {
        console.log(error)
    }
    

    //Check if the user has any unanswered messages
 

})
//Delete image route
router.delete('/image-delete/:imageId', jwtVerify, async(req, res) => {
    try {
        const usersAccount = await Account.findOne({ userId: req.user.userId })
        const image = await Image.findById(req.params.imageId)
        for(let i = 0; i < usersAccount.images.length; i++){
            if(usersAccount.images[i].toString() === req.params.imageId.toString()){
                usersAccount.images.splice(i, 1)
                break
            }
        }
        await usersAccount.save()
        await Image.remove(image)
        res.json({
            message: "Image successfully deleted",

        })
    } catch (error) {
        res.json({
            message: "ERROR: Could not delete image",
            err: error
        })
    }


})


module.exports = router