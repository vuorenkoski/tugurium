module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.bulkInsert('sensors', [
      {
        sensor_name: 'FTVI',
        sensor_fullname: 'Lämpötila (Röykkä)',
        sensor_unit: 'c',
      },
      {
        sensor_name: 'FRVI',
        sensor_fullname: 'Sademäärä (Röykkä))',
        sensor_unit: 'mm',
      },
      {
        sensor_name: 'FSVI',
        sensor_fullname: 'Lumen syvyys (Röykkä)',
        sensor_unit: 'cm',
      },
      {
        sensor_name: 'FWVI',
        sensor_fullname: 'Tuulen nopeus (Maasoja)',
        sensor_unit: 'm/s',
      },
    ])
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.bulkDelete('sensors', null, {})
  },
}
