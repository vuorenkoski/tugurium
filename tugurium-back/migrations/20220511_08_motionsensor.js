module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.bulkInsert('sensors', [
      {
        sensor_name: 'CMOT',
        sensor_fullname: 'Mökin liiketunnistin',
        sensor_unit: 'lkm',
      },
    ])
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.bulkDelete('sensors', null, {})
  },
}
