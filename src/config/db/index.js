const { Sequelize } = require("sequelize");

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize("tour_dulich", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

async function connect() {
  try {
    await sequelize.authenticate();
    console.log("Connection successfully");
  } catch (error) {
    console.error("Connection fail ", error);
  }
}

export default { connect };
