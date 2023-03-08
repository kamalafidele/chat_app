const UserModel = require('../models/User');

class UserRepo {
  static async save(data) {
    return UserModel.create(data);
  }

  static async findUsers() {
    return UserModel.find({}).exec();
  }

  static async findUserById(userId) {
    return UserModel.findById(userId).exec();
  }

  static async findUserByUsername(username) {
    return UserModel.findOne({ username }).exec();
  }

  static async deleteUserByUsername(username) {
    return UserModel.deleteOne({ username }).exec();
  }

  static async deleteUserById(id) {
    return UserModel.deleteOne({ _id: id }).exec();
  }

  static async updateOneById(userId, data) {
    return UserModel.findOneAndUpdate({ _id: userId }, data, { new: true });
  }
}

module.exports = UserRepo;
