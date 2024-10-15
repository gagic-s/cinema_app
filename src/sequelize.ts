import { Sequelize } from "sequelize";

// returns undefined??
// function connectingToPostgres(){
//     const sequelize = new Sequelize('postgres://postgres:duleGagic2510@@localhost:5432/cinema');
//     try {
//         sequelize.authenticate();
//        console.log('Connection has been established successfully.');
//      } catch (error) {
//        console.error('Unable to connect to the database:', error);
//      }
// }
const sequelize = new Sequelize(
  "postgres://postgres:duleGagic2510@@localhost:5432/cinema"
);

// returns an object
function connectingToPostgres() {
  sequelize
    .authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");
    })
    .catch((error) => {
      console.error("Unable to connect to the database:", error);
    });
  return sequelize;
}

export default connectingToPostgres;
