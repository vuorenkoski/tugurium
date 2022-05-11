module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.bulkInsert('sensors', [
      {
        sensor_name: 'CLSR',
        sensor_fullname: 'Mökin järven pinta',
        sensor_unit: 'cm',
      },
    ])
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.bulkDelete('sensors', null, {})
  },
}
