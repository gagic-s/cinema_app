module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("user", "isVerified", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("user", "isVerified");
  }
};
