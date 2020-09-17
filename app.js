var http = require('http')
var createHandler = require('github-webhook-handler')
const spawn = require('child_process').spawn
var handler = createHandler({ path: '/webhook/gatsby-blog', secret: 'gatsby-blog' })

http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404
    res.end('no such location')
  })
}).listen(7777)

handler.on('error', function (err) {
  console.error('Error:', err.message)
})

handler.on('push', function (event) {
  console.log('Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref)
    try {
      const s = spawn('sh', ['./sh/gatsby-blog.sh'], {
        cwd: `../${e.payload.repository.name}`
      })
      s.stdout.on('data', (data) => {
        console.log(`${e.payload.repository.name}: ${data}`);
      })
      s.stderr.on('data', (data) => {
        console.log(`${e.payload.repository.name}: ${data}`);
      });
      console.log(e.payload.repository.name, 'has rebuild');
      } catch (e) {
          console.log(e)
      }
})

handler.on('issues', function (event) {
  console.log('Received an issue event for %s action=%s: #%d %s',
    event.payload.repository.name,
    event.payload.action,
    event.payload.issue.number,
    event.payload.issue.title)
})