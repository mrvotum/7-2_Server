const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const uuid = require('uuid');
const Router = require('koa-router');

const app = new Koa();

app.use(async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    return await next();
  }

  const headers = { 'Access-Control-Allow-Origin': '*', };

  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({...headers});
    try {
      return await next();
    } catch (e) {
      e.headers = {...e.headers, ...headers};
      throw e;
    }
  }

  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    });

    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
    }

    ctx.response.status = 204;
  }
});
app.use(koaBody({
    text: true,
    urlencoded: true,
    multipart: true,
    json: true,
}));


const router = new Router();
const TicketFull = [];
const Ticket = [];
const TicketStatusUpdate = [];

router.get('/TicketFull', async (ctx, next) => {
    // return list of TicketFull
    // console.log(`TicketFull = ${TicketFull}`);
    ctx.response.body = TicketFull;
});

router.post('/TicketFull', async (ctx, next) => {
    // create new contact
    // console.log(`ctx.request.body = ${ctx.request.body}`);
    TicketFull.push({...ctx.request.body});
    ctx.response.status = 204;
});

router.delete('/TicketFull/:id', async (ctx, next) => {
    // remove contact by id
    // ctx.originalUrl.split("/").pop() -- id
    const index = TicketFull.findIndex(({id}) => id === ctx.originalUrl.split("/").pop());
    if (index !== -1) {
      TicketFull.splice(index, 1);
    }
    ctx.response.status = 204;
});

router.put('/TicketFull/:id', async (ctx, next) => {
  // edit contact by id
  const index = TicketFull.findIndex(({id}) => id === ctx.originalUrl.split("/").pop());
  
  console.log(TicketFull[index]);

  TicketFull[index].id = ctx.request.body.id;
  TicketFull[index].name = ctx.request.body.name;
  TicketFull[index].description = ctx.request.body.description;
  TicketFull[index].status = ctx.request.body.status;
  TicketFull[index].created = ctx.request.body.created;

  ctx.response.status = 204;
});

// status

router.put('/TicketStatusUpdate/:id', async (ctx, next) => {
  // return list of TicketFull
  const index = TicketFull.findIndex(({id}) => id === ctx.originalUrl.split("/").pop());
  
  console.log(TicketFull[index]);

  TicketFull[index].status = ctx.request.body.status;
  TicketFull[index].created = ctx.request.body.created;

  ctx.response.status = 204;
});

app.use(router.routes()).use(router.allowedMethods());
http.createServer(app.callback()).listen(process.env.PORT || 7075);