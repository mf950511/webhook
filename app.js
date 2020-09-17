const spawn = require('child_process').spawn
const http = require('http')
const createHandler = require('github-webhook-handler')
const handler = createHandler([
  {
    path: '/webhook/react-admin',
    secret: 'react-admin'
  },
  {
    path: '/webhook/react-admin-node',
    secret: 'react-admin-node'
  },
  {
    path: '/webhook/gatsby-blog',
    secret: 'gatsby-blog'
  }
])
http.createServer(function(req, res){
  handler(req, res, function(err) {
    res.statusCode = 404
    res.end('no such location')
  })
}).listen(7777)

handler.on('error', (err) => {
  console.error(err)
})

handler.on('push', e => {
  console.log(
    'Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref,
    e.payload,
    e
  )
  switch(e.path){
    case '/webhook/react-admin':
      runCmd('sh', ['./sh/react-admin.sh', event.payload.repository.name], function (text) { console.log(text) })
      break
    case '/webhook/react-admin-node':
      runCmd('sh', ['./sh/react-admin-node.sh', event.payload.repository.name], function (text) { console.log(text) })
      break
    case '/webhook/gatsby-blog':
      runCmd('sh', ['./sh/gatsby-blog.sh', event.payload.repository.name], function (text) { console.log(text) })
      break
    default: 
      break
  }
})

function runCmd(cmd, args, callback){
  const child = spawn(cmd, args)
  let resp = ''
  child.stdout.on('data', (buffer) => {
    resp += buffer
  })
  child.stdout.on('end', () => {
    callback(resp)
  })
}