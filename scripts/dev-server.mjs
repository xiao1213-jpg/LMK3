import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {extname,join,normalize} from 'node:path';

const args=process.argv.slice(2);
const option=(name,fallback)=>{const index=args.indexOf(name);return index>=0&&args[index+1]?args[index+1]:fallback;};
const host=option('--host','127.0.0.1');
const port=Number(option('--port',process.env.PORT||3000));
const root=process.cwd();
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.woff':'font/woff','.xlsx':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'};

createServer(async(request,response)=>{
  try{
    const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
    const relative=normalize(pathname).replace(/^(\.\.(\/|\\|$))+/, '').replace(/^[/\\]+/,'');
    let file=join(root,relative||'index.html');
    if((await stat(file)).isDirectory())file=join(file,'index.html');
    const body=await readFile(file);
    response.writeHead(200,{'content-type':types[extname(file).toLowerCase()]||'application/octet-stream','cache-control':'no-store'});
    response.end(body);
  }catch{
    response.writeHead(404,{'content-type':'text/plain; charset=utf-8'});
    response.end('Not found');
  }
}).listen(port,host,()=>console.log(`LMK preview: http://${host}:${port}`));
