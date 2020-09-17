const http = require('http')
const createHandler = require('github-webhook-handler')
const spawn = require('child_process').spawn
const handlerOpts = [
  { 
    path: '/webhook/gatsby-blog', 
    secret: 'gatsby-blog' 
  },
  { 
    path: '/webhook/react-admin', 
    secret: 'react-admin' 
  },
  { 
    path: '/webhook/react-admin-node', 
    secret: 'react-admin-node' 
  }
]
const handler = generaterHandler(handlerOpts)


function generaterHandler(handlerOpts) {
  var handlers = handlerOpts.reduce(function(hs, opts) {
    hs[opts.path] = createHandler(opts)
    return hs
  }, {})

  return http.createServer(function(req, res) {
    var handler = handlers[req.url]
    handler(req, res, function(err) {
      res.statusCode = 404
      res.end('no such location')
    })
  }).listen(7777)
}

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
    const { path, secret } = event
    console.log(3333333, path, secret, event)
    // switch(path) {
    //   case '/webhook/gatsby-blog':
    //     runCmd('sh', [`./sh/${ secret }.sh`, event.payload.repository.name], function (text) { console.log(text) })
    //     break
    //   case '/webhook/react-admin':
    //     break
    //   case '/webhook/react-admin-node':
    //     break
    //   default:
    //     break
    // }
    // try {
    //   const s = spawn('sh', ['./sh/gatsby-blog.sh'], {
    //     cwd: `../${e.payload.repository.name}`
    //   })
    //   s.stdout.on('data', (data) => {
    //     console.log(`${e.payload.repository.name}: ${data}`);
    //   })
    //   s.stderr.on('data', (data) => {
    //     console.log(`${e.payload.repository.name}: ${data}`);
    //   });
    //   console.log(e.payload.repository.name, 'has rebuild');
    //   } catch (e) {
    //       console.log(e)
    //   }
})

handler.on('issues', function (event) {
  console.log('Received an issue event for %s action=%s: #%d %s',
    event.payload.repository.name,
    event.payload.action,
    event.payload.issue.number,
    event.payload.issue.title)
})