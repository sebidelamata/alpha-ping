module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)', // Applies to all routes
        headers: [
          {
            key: 'X-Test-Header',
            value: 'Hello, this is a test'
          }
        ]
      }
    ]
  }
}
