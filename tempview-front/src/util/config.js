module.exports = {
  AGGREGATE_METHODS: ['SUM', 'AVG'],
  COLORS: ['black', 'red', 'blue', 'green', 'orange', 'grey'],
  BACKEND_URL:
    process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:4000',
  WEBSOCKET_URL:
    process.env.NODE_ENV === 'production'
      ? `wss://${window.location.hostname}/api/graphql/`
      : 'ws://localhost:4000/graphql',
}
