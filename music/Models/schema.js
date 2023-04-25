const { Schema, model } = require("mongoose");

let schema = new Schema({
  serverid: String,
  channelid: String,
});

module.exports = model("Schema", schema);
