const Queries = require('../models/queries');

const getAnswers = async (req, res, next) => {
    try{
        const {username} = req.body;

       const findAnswer = await Queries.findOne({"answers.username":username});

       if(!findAnswer){
           console.log("Answer not found!");
       }

        req.Answer = findAnswer;
        req.username = username;

        next();
    }catch(e){
        console.log(e);
    }
}

module.exports = getAnswers