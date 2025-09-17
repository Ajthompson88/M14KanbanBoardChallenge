'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1) Add the column as nullable
    await queryInterface.addColumn('tickets', 'name', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    // 2) Backfill data so no rows are NULL
    await queryInterface.sequelize.query(`
      UPDATE "tickets"
      SET "name" = CONCAT('Ticket #', "id")
      WHERE "name" IS NULL
    `);

    // 3) Enforce NOT NULL
    await queryInterface.changeColumn('tickets', 'name', {
      type: Sequelize.STRING(255),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('tickets', 'name');
  },
};
