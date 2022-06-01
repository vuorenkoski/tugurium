module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addIndex('measurements', ['timestamp', 'sensor_id'])
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeIndex('measurements', ['timestamp', 'sensor_id'])
  },
}
