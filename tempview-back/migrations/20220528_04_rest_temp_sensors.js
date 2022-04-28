module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.bulkInsert('sensors', [
      {
        sensor_name: 'CSAU',
        sensor_fullname: 'Mökin saunan lämpötila',
        sensor_unit: 'c',
      },
      {
        sensor_name: 'CRAU',
        sensor_fullname: 'Mökin aitan lämpötila',
        sensor_unit: 'c',
      },
      {
        sensor_name: 'CKEL',
        sensor_fullname: 'Mökin kellarin lämpötila',
        sensor_unit: 'c',
      },
      {
        sensor_name: 'HUPS',
        sensor_fullname: 'Kodin yläkerta',
        sensor_unit: 'c',
      },
      {
        sensor_name: 'HDOW',
        sensor_fullname: 'Kodin alakerta',
        sensor_unit: 'c',
      },
    ])
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.bulkDelete('sensors', null, {})
  },
}
