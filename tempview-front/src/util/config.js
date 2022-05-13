module.exports = {
  FIRST_YEAR: 2014,
  AGGREGATE_METHODS: ['SUM', 'AVG'],
  COLORS: ['black', 'red', 'blue', 'green', 'orange', 'grey'],
  BACKEND_URL:
    process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:4000',
}
