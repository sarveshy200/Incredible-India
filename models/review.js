const mongose = require("mongoose");
const Schema = mongose.Schema;


const reviewSchema = new Schema({
    comment : String,
    rating :{
        type: Number,
        min: 1,
        max:5
    },
    createdAt:{
        type:Date,
        default: Date.now(),
    },
    author:{
        type:Schema.Types.ObjectId,
        ref :"User",
    }
});


module.exports = mongose.model("Review", reviewSchema);