const mongodb = require("mongodb");
const MongodbClient = mongodb.MongoClient;
let _db;
const getDb = () => {
  if (!_db) {
    throw new Error("No Database Found!");
  }
  return _db;
};
const MongoConnect = (cb) => {
  MongodbClient.connect("mongodb://localhost:27017/node-complete")
    .then((client) => {
      console.log("Connected!");
      _db = client.db();
      cb();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

exports.MongoConnect = MongoConnect;
exports.getDb = getDb;
