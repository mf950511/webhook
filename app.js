const http = require('http')
const path = require('path')
const createHandler = require('node-github-webhook')
const spawn = require('child_process').spawn
const Koa = require('koa')
const koaBody = require('koa-body')
const serve = require('koa-static')
const { resolve } = require('path')
const app = new Koa()

const handler = createHandler([
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
])

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
    const { path } = event
    console.log('path', path)
    switch(path) {
      case '/webhook/gatsby-blog':
        runCmd('sh', [`./sh/gatsby-blog.sh`, event.payload.repository.name], function (text) { console.log(text) })
        break
      case '/webhook/react-admin':
        runCmd('sh', [`./sh/reach-admin.sh`, event.payload.repository.name], function (text) { console.log(text) })
        break
      case '/webhook/react-admin-node':
        runCmd('sh', [`./sh/react-admin-node.sh`, event.payload.repository.name], function (text) { console.log(text) })
        break
      default:
        break
    }
})

handler.on('issues', function (event) {
  console.log('Received an issue event for %s action=%s: #%d %s',
    event.payload.repository.name,
    event.payload.action,
    event.payload.issue.number,
    event.payload.issue.title)
})

function runCmd (cmd, args, callback) {
  const child = spawn(cmd, args)
  let resp = ''
  child.stdout.on('data', function (buffer) {
    resp += buffer.toString()
  })
  child.stdout.on('end', function () {
    callback(resp)
  })
}


app.
use(koaBody({ "formLimit":"5mb", "jsonLimit":"5mb", "textLimit":"5mb" })).
use(serve(path.resolve(__dirname, '../../website/blog'))).
use(serve(path.resolve(__dirname, '../../website/react-admin'))).
use(serve(path.resolve(__dirname, '../../website'))).
listen(7778)







