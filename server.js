const http=require('http');
const fs=require('fs');
const path=require('path');
const crypto=require('crypto');
const ROOT=__dirname;
const rooms=new Map();
const COLORS=['green','blue','red','yellow'];
function id(n=8){return crypto.randomBytes(n).toString('hex').slice(0,n).toUpperCase()}
function send(res,code,data){res.writeHead(code,{'Content-Type':'application/json','Cache-Control':'no-store','Access-Control-Allow-Origin':'*'});res.end(JSON.stringify(data));}
function read(req){return new Promise(resolve=>{let b='';req.on('data',c=>b+=c);req.on('end',()=>{try{resolve(JSON.parse(b||'{}'))}catch{resolve({})}})})}
function publicRoom(r){return {id:r.id,hostId:r.hostId,started:r.started,players:r.players.map(p=>({id:p.id,name:p.name,color:p.color})),state:r.state,version:r.version,updated:r.updated}}
async function api(req,res,u){
 const parts=u.pathname.split('/').filter(Boolean);
 if(req.method==='POST'&&u.pathname==='/api/create'){
  const b=await read(req), rid=id(6), pid=id(10); const room={id:rid,hostId:pid,started:false,players:[{id:pid,name:b.name||'Host',color:'green'}],state:null,version:1,updated:Date.now()};rooms.set(rid,room);return send(res,200,{playerId:pid,room:publicRoom(room)});
 }
 if(parts[0]==='api'&&parts[1]==='room'&&parts[2]){
  const rid=parts[2],r=rooms.get(rid);if(!r)return send(res,404,{error:'Room not found'});
  if(req.method==='GET'&&parts.length===3)return send(res,200,publicRoom(r));
  if(req.method==='POST'&&parts[3]==='join'){
   const b=await read(req); let existing=b.playerId&&r.players.find(p=>p.id===b.playerId);
   if(existing)return send(res,200,{playerId:existing.id,room:publicRoom(r)});
   if(r.started)return send(res,409,{error:'Game already started'});
   if(r.players.length>=4)return send(res,409,{error:'Room is full'});
   const color=COLORS[r.players.length],pid=id(10);r.players.push({id:pid,name:b.name||'Friend '+r.players.length,color});r.version++;r.updated=Date.now();return send(res,200,{playerId:pid,room:publicRoom(r)});
  }
  if(req.method==='POST'&&parts[3]==='start'){
   const b=await read(req);if(b.playerId!==r.hostId)return send(res,403,{error:'Only the host can start'});if(r.players.length<2)return send(res,409,{error:'At least one invited friend must join'});r.started=true;r.state=b.state||null;r.version++;r.updated=Date.now();return send(res,200,publicRoom(r));
  }
  if(req.method==='POST'&&parts[3]==='state'){
   const b=await read(req);const actor=r.players.find(p=>p.id===b.playerId);if(!actor)return send(res,403,{error:'Not a room player'});if(!r.started)return send(res,409,{error:'Game not started'});
   if(r.state&&b.state&&r.state.current!==undefined&&b.state.current!==undefined){const expected=r.state.currentColor; if(expected&&expected!==actor.color)return send(res,409,{error:'Not your turn'});}
   r.state=b.state;r.version++;r.updated=Date.now();return send(res,200,{version:r.version});
  }
 }
 send(res,404,{error:'Not found'});
}
const server=http.createServer(async(req,res)=>{
 const u=new URL(req.url,'http://x');
 if(u.pathname.startsWith('/api/'))return api(req,res,u);
 let file=u.pathname==='/'?'/index.html':u.pathname;
 file=path.normalize(path.join(ROOT,file));if(!file.startsWith(ROOT))return res.end('Forbidden');
 fs.readFile(file,(e,d)=>{if(e){res.writeHead(404);return res.end('Not found')}const ext=path.extname(file);const type=ext==='.html'?'text/html':ext==='.js'?'text/javascript':'text/plain';res.writeHead(200,{'Content-Type':type});res.end(d)});
});
const port=process.env.PORT||8080;server.listen(port,()=>console.log(`Ludo Royale online at http://localhost:${port}`));
