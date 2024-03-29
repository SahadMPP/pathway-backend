const mongoose = require("mongoose");

let complaintDataSchema = new mongoose.Schema({
    "title":{
        required : true,
        type : String
    },
    "description":{
        required : true,
        type : String
    },
    "dataTime":{
        required : true,
        type : String
    },
})

module.exports = mongoose.model("Complaint",complaintDataSchema);