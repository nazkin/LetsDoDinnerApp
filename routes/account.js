const router = require('express').Router()
const jwtVerify = require('../middleware/jwtVerify')
const User = require('../models/User')
const Account = require('../models/Account')
const Image = require('../models/Image')

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
        const account = await Account.findOne({_id: req.params.id}).populate('images')
        const usersAccount = await Account.findOne({userId: req.user.userId})
        let hasConnection = false
        if(account.invitations.includes(usersAccount._id) || account.connections.includes(usersAccount._id)) {
            hasConnection = true
        }
        res.json({
            message: 'Account retrieved successfully',
            account: account,
            hasConnect: hasConnection,
        })

    } catch (error) {
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
        const accounts = await Account.find({gender: usersAccount.interestedIn})

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

router.post('/filtered-users', jwtVerify, async (req, res) => {
    const filteredAccounts = []
    let accounts;
    const usersAccount = await Account.findOne({userId: req.user.userId})

    const filters = {
        interestedIn: usersAccount.interestedIn,
        matchAgeMax: usersAccount.matchAgeMax,
        matchAgeMax: usersAccount.matchAgeMin,
        city: '',
        region: '',
        country: ''
    }
    
    //Basic filtering by gender, reduces the size of data retrieved by the largest amount
    if(usersAccount.interestedIn !== 'everyone') {
        accounts = await Account.find({gender: usersAccount.interestedIn})
    }else {
        accounts = await Account.find({})
    }

    accounts.forEach((account, i) => {
        //remove the user from the list of accounts
        const isUser = account.userId === req.user.userId
        //filter accounts based on users age preferences
        const isRightAge = account.age <= filters.matchAgeMax && account.age >= filters.matchAgeMin
        //filter accounts based on users gender preferences
        let isRightGender;
        if(filters.interestedIn === 'everyone'){
            isRightGender = true
        }else if(interestedIn === account.gender){
            isRightGender = true
        }else {
            isRightGender = false
        }
        //filter accounts based on location
        let isRightLocation;
        if(!filters.city && !filters.country && !filters.region){
           isRightLocation = true;
        }else if(filters.city === account.city && filters.country === account.country && filters.region === account.region){
            isRightLocation = true
        }else {
            isRightLocation = false
        }

        //Filter out the age

        //filter out the genders
        
        //OTHER LOGIC FOR FILTERING SPECIFIC USERS
        if(!isUser){
            filteredAccounts.push(account)
        }
    })
     


})

module.exports = router