const Queries = require('../models/queries');

const answer = async (req, res, next) => {
    try{
        const {aid} = req.body;

       const deleteAnswer = await Queries.findOne({"answers._id":aid});

       if(!deleteAnswer){
           console.log("Answer not found!");
       }

        req.Answer = deleteAnswer;
        req.id = aid;

        next();
    }catch(e){
        console.log(e);
    }
}

module.exports = answer