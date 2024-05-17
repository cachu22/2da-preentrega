import { userModel } from "./models/users.models.js";

class userManager {
  constructor(){
    this.userModel = userModel;
    }
  
    // Método para obtener todos los usuarios
    async getUsers() {
      return await this.userModel.find();
  }
  
  //   async getUserById(id) {
  //     return this.users.find((user) => user.id === id);
  //   }
  
  //   async getUserByEmail(email) {
  //     return this.users.find((user) => user.email === email);
  //   }
  
  //   async getUsers() {
  //     return this.users;
  //   }
}

export default userManager