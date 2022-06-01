module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.bulkInsert('sensors', [
      {
        sensor_name: 'CINS',
        sensor_fullname: 'Mökin sisälämpötila',
        sensor_unit: 'c',
      },
      {
        sensor_name: 'COUT',
        sensor_fullname: 'Mökin ulkolämpötila',
        sensor_unit: 'c',
      },
      {
        sensor_name: 'CLAK',
        sensor_fullname: 'Mökin järven lämpötila',
        sensor_unit: 'c',
      },
    ])
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.bulkDelete('sensors', null, {})
  },
}
