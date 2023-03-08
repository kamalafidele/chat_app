const UserRepo = require('../repositories/UserRepo');

class UserService {
  static async save(data) {
    return UserRepo.save(data);
  }

  static async getUserById(userId) {
    return UserRepo.findUserById(userId);
  }

  static async getUserByUsername(username) {
    return UserRepo.findUserByUsername(username);
  }


  static async updateUserById(user, data) {
    return UserRepo.updateOneById(user, data);
  }

  static async deleteUserById(id) {
    return UserRepo.deleteUserById(id);
  }
}

module.exports = UserService;
