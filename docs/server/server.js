"use strict";(()=>{var o={},P=()=>Math.floor(Math.random()*Number.MAX_SAFE_INTEGER),d=new Promise(e=>self.onmessage=e),b=async({request:e})=>{let t;for(;(t=P())in o;);let{body:a,cache:s,credentials:r,headers:c,integrity:l,keepalive:h,method:m,mode:p,redirect:E,referrer:f,referrerPolicy:T,url:u}=e,w=Object.fromEntries(c.entries());return(await d).data.postMessage({code:"REQUEST",id:t,data:[a,s,r,w,l,h,m,p,E,f,T,u]}),await new Promise(n=>o[t]=n).then(([n,g,M,v])=>new Response(n,{headers:g,status:M,statusText:v}))},k=new BroadcastChannel(""),i=()=>setTimeout(()=>k.close(),3e3);d.then(({data:e})=>{let t=i();e.onmessage=({data:{code:a,id:s,data:r}})=>{switch(a){case"HEARTBEAT":{clearTimeout(t),t=i();break}default:o[s]?.(r)}},e.postMessage({code:"CONNECT"})});self.addEventListener("fetch",e=>e.respondWith(b(e)));setInterval(()=>fetch("./ping.txt"),20*1e3);})();
