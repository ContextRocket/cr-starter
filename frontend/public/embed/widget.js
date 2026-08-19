var ContextRocketWidget=(()=>{var _=Object.defineProperty;var oe=Object.getOwnPropertyDescriptor;var ie=Object.getOwnPropertyNames;var de=Object.prototype.hasOwnProperty;var J=e=>{throw TypeError(e)};var ce=(e,t)=>{for(var r in t)_(e,r,{get:t[r],enumerable:!0})},le=(e,t,r,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of ie(t))!de.call(e,s)&&s!==r&&_(e,s,{get:()=>t[s],enumerable:!(n=oe(t,s))||n.enumerable});return e};var pe=e=>le(_({},"__esModule",{value:!0}),e);var j=(e,t,r)=>t.has(e)||J("Cannot "+r);var a=(e,t,r)=>(j(e,t,"read from private field"),r?r.call(e):t.get(e)),u=(e,t,r)=>t.has(e)?J("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,r),d=(e,t,r,n)=>(j(e,t,"write to private field"),n?n.call(e,r):t.set(e,r),r),f=(e,t,r)=>(j(e,t,"access private method"),r);var X=(e,t,r,n)=>({set _(s){d(e,t,s,r)},get _(){return a(e,t,n)}});var ke={};ce(ke,{ContextRocketChatElement:()=>H,applyTransportEvent:()=>N,beginSend:()=>z,buildPoweredByHref:()=>P,canSend:()=>L,collectEmbedA2aSubscribe:()=>Z,createInitialChatState:()=>R,mountFromScriptTag:()=>O,parseWidgetConfig:()=>w,registerContextRocketChatElement:()=>B,resetMessageIdCounter:()=>te,streamEmbedA2aSubscribe:()=>I});async function*Q(e,t){let r=new TextDecoder,n="",s="message",o=[],p=()=>{e.cancel()};t?.addEventListener("abort",p,{once:!0});try{for(;!t?.aborted;){let{done:h,value:v}=await e.read();if(h)break;n+=r.decode(v,{stream:!0});let g=n.split(`
`);n=g.pop()??"";for(let C of g)C.startsWith("event:")?s=C.slice(6).trim():C.startsWith("data:")?o.push(C.slice(5).trim()):C===""&&o.length>0&&(yield{type:s,data:o.join(`
`)},s="message",o.length=0)}}finally{t?.removeEventListener("abort",p);try{await e.cancel()}finally{e.releaseLock()}}}function ue(e=fetch){return{request:e}}var V=ue(),fe=new Set(["submitted","working","input-required","completed","canceled","failed"]),Y=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,S="Something went wrong. Please try again.",ge="This is a canned ContextRocket demo response. Configure live mode with an organization handle when you are ready to connect your own knowledge base.";function k(e){return typeof e=="object"&&e!==null}function me(e){return typeof e=="string"&&fe.has(e)}function he(e){return!k(e)||!Array.isArray(e.parts)?[]:e.parts.flatMap(t=>!k(t)||t.type!=="text"||typeof t.text!="string"||!t.text?[]:[t.text])}function xe(e){if(!k(e))return[{type:"error",message:S}];if(e.error!==void 0&&e.error!==null)return[{type:"error",message:S}];let t=e.result;if(!k(t))return[];let r=t.type;if(r==="TaskArtifactUpdateEvent")return he(t.artifact).map(h=>({type:"delta",text:h}));if(r!=="TaskStatusUpdateEvent")return[];let n=typeof t.id=="string"?t.id:void 0,s=k(t.status)?t.status:void 0,o=s?.state;if(!me(o))return[];if(o==="failed"||o==="canceled")return[{type:"error",message:S}];let p=be(s,t);return o==="completed"||t.final===!0?[{type:"done",taskId:n},...p]:[{type:"meta",state:o},...p]}function be(...e){for(let t of e){if(!k(t))continue;let r=k(t.metadata)?t.metadata:t,n=typeof r.thread_id=="string"&&r.thread_id||typeof r.threadId=="string"&&r.threadId||void 0;if(n&&Y.test(n))return[{type:"session",threadId:n}]}return[]}function ye(e){try{return xe(JSON.parse(e))}catch{return[{type:"error",message:S}]}}async function*Ee(e,t){if(e)for await(let r of Q(e.getReader(),t))for(let n of ye(r.data))yield n}async function*ve(e,t){let r=e.threadId??"demo-thread";yield{type:"meta",state:"working"};for(let n of ge.split(/(\s+)/)){if(t?.aborted)return;n&&(yield{type:"delta",text:n}),await new Promise(s=>setTimeout(s,n.trim()?18:4))}t?.aborted||(yield{type:"session",threadId:r},yield{type:"done",taskId:"demo-task"})}async function*I(e,t,r=V,n){if(n?.aborted)return;if(e.mode==="demo"){yield*ve(t,n);return}let s={role:"user",parts:[{type:"text",text:t.message}]};t.threadId&&Y.test(t.threadId)&&(s.contextId=t.threadId);let o={};e.handle&&(o.handle=e.handle);let p={jsonrpc:"2.0",id:`embed-chat-${crypto.randomUUID()}`,method:"tasks/sendSubscribe",params:{message:s,metadata:o}},h=`${e.apiBaseUrl.replace(/\/$/,"")}/api/agent/a2a`,v={"content-type":"application/json",accept:"text/event-stream"};e.apiKey&&(v["x-api-key"]=e.apiKey);let g;try{g=await r.request(h,{method:"POST",headers:v,body:JSON.stringify(p),signal:n})}catch{if(n?.aborted)return;yield{type:"error",message:S};return}if(!g.ok){yield{type:"error",message:S};return}if(!(g.headers.get("content-type")??"").includes("text/event-stream")){yield{type:"error",message:S};return}yield*Ee(g.body,n)}async function Z(e,t,r=V,n){let s=[];for await(let o of I(e,t,r,n))s.push(o);return s}function R(e){return{status:"idle",messages:e?[{id:"greeting",role:"assistant",content:e}]:[],errorMessage:null,threadId:null}}var F=0;function ee(e){return F+=1,`${e}-${F}`}function te(){F=0}function z(e,t){let r=ee("user"),n=ee("assistant");return{assistantMessageId:n,state:{...e,status:"streaming",errorMessage:null,messages:[...e.messages,{id:r,role:"user",content:t},{id:n,role:"assistant",content:""}]}}}function N(e,t,r){switch(t.type){case"delta":return t.text?{...e,messages:e.messages.map(n=>n.id===r&&n.role==="assistant"?{...n,content:n.content+t.text}:n)}:e;case"session":return{...e,threadId:t.threadId};case"error":return{...e,status:"error",errorMessage:t.message};case"done":return{...e,status:"complete"};case"meta":return e;default:return e}}function L(e){return e.status!=="streaming"}var x="contextrocket";function b(e,...t){for(let r of t){let n=e.getAttribute(r)?.trim();if(n)return n}}function w(e){let t=b(e,`data-${x}-api-key`),r=b(e,`data-${x}-handle`),n=b(e,`data-${x}-api-base`),o=b(e,`data-${x}-mode`)==="live"?"live":"demo";if(o==="live"&&!n)return null;let p=b(e,`data-${x}-accent`),h=b(e,`data-${x}-greeting`),v=b(e,`data-${x}-title`),g=b(e,`data-${x}-ref`);return{...n?{apiBaseUrl:n.replace(/\/$/,"")}:{},mode:o,...t?{apiKey:t}:{},...r?{handle:r}:{},...p?{accentColor:p}:{},...h?{greeting:h}:{},...v?{title:v}:{},...g?{ref:g}:{}}}function P(e){let t="https://www.contextrocket.ai",r=e.ref??e.handle??"widget";return`${t}?ref=${encodeURIComponent(r)}`}function re(e="#ff2b67"){return`
:host {
  all: initial;
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  font-size: 14px;
  line-height: 1.45;
  color: #111827;
  --cr-accent: ${e};
  --cr-accent-soft: color-mix(in srgb, var(--cr-accent) 12%, white);
  --cr-border: #e5e7eb;
  --cr-muted: #6b7280;
  --cr-bg: #ffffff;
  --cr-panel-shadow: 0 12px 40px rgba(17, 24, 39, 0.18);
}

*, *::before, *::after {
  box-sizing: border-box;
}

.cr-root {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 2147483000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

.cr-launcher {
  width: 52px;
  height: 52px;
  border: 1px solid var(--cr-border);
  border-radius: 0;
  background: var(--cr-accent);
  color: #fff;
  cursor: pointer;
  display: grid;
  place-items: center;
  box-shadow: var(--cr-panel-shadow);
  font-size: 20px;
  line-height: 1;
}

.cr-launcher:focus-visible {
  outline: 2px solid #111827;
  outline-offset: 2px;
}

.cr-panel {
  width: min(360px, calc(100vw - 32px));
  height: min(520px, calc(100vh - 120px));
  display: none;
  flex-direction: column;
  border: 1px solid var(--cr-border);
  background: var(--cr-bg);
  box-shadow: var(--cr-panel-shadow);
}

.cr-panel[data-open="true"] {
  display: flex;
}

.cr-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--cr-border);
  background: #fafafa;
}

.cr-title {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.cr-close {
  border: none;
  background: transparent;
  color: var(--cr-muted);
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  padding: 2px 6px;
}

.cr-messages {
  flex: 1;
  overflow-y: auto;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cr-message {
  max-width: 88%;
  padding: 10px 12px;
  border: 1px solid var(--cr-border);
  white-space: pre-wrap;
  word-break: break-word;
}

.cr-message[data-role="user"] {
  align-self: flex-end;
  background: var(--cr-accent-soft);
  border-color: color-mix(in srgb, var(--cr-accent) 35%, white);
}

.cr-message[data-role="assistant"] {
  align-self: flex-start;
  background: #f9fafb;
}

.cr-message[data-streaming="true"]::after {
  content: "\u258B";
  display: inline-block;
  margin-left: 2px;
  animation: cr-blink 1s step-end infinite;
  color: var(--cr-accent);
}

@keyframes cr-blink {
  50% { opacity: 0; }
}

.cr-error {
  margin: 0 14px;
  padding: 8px 10px;
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #991b1b;
  font-size: 12px;
}

.cr-composer {
  display: flex;
  gap: 8px;
  padding: 12px 14px;
  border-top: 1px solid var(--cr-border);
}

.cr-input {
  flex: 1;
  min-width: 0;
  border: 1px solid var(--cr-border);
  border-radius: 0;
  padding: 8px 10px;
  font: inherit;
}

.cr-input:focus {
  outline: 2px solid color-mix(in srgb, var(--cr-accent) 45%, white);
  outline-offset: 0;
}

.cr-send {
  border: 1px solid var(--cr-accent);
  background: var(--cr-accent);
  color: #fff;
  padding: 8px 12px;
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.cr-send:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.cr-footer {
  padding: 8px 14px 10px;
  border-top: 1px solid var(--cr-border);
  text-align: center;
  font-size: 11px;
  color: var(--cr-muted);
}

.cr-footer a {
  color: var(--cr-muted);
  text-decoration: none;
}

.cr-footer a:hover {
  color: var(--cr-accent);
  text-decoration: underline;
}
`.trim()}var G="contextrocket-chat",m,i,l,T,q,$,U,y,E,D,M,A,c,ne,ae,K,se,W,H=class extends HTMLElement{constructor(){super();u(this,c);u(this,m,null);u(this,i,R());u(this,l);u(this,T,0);u(this,q,null);u(this,$);u(this,U);u(this,y);u(this,E);u(this,D);u(this,M);u(this,A);d(this,l,this.attachShadow({mode:"open"}))}static get observedAttributes(){return["data-contextrocket-api-key","data-contextrocket-handle","data-contextrocket-mode","data-contextrocket-api-base","data-contextrocket-accent","data-contextrocket-greeting","data-contextrocket-ref"]}connectedCallback(){d(this,m,w(this)),a(this,m)&&(d(this,i,R(a(this,m).greeting)),f(this,c,ne).call(this),f(this,c,ae).call(this),f(this,c,W).call(this))}attributeChangedCallback(){if(!this.isConnected)return;let r=w(this);r&&(d(this,m,r),a(this,A)&&(a(this,A).href=P(r)),a(this,l).host.style.setProperty("--cr-accent",r.accentColor??"#ff2b67"))}};m=new WeakMap,i=new WeakMap,l=new WeakMap,T=new WeakMap,q=new WeakMap,$=new WeakMap,U=new WeakMap,y=new WeakMap,E=new WeakMap,D=new WeakMap,M=new WeakMap,A=new WeakMap,c=new WeakSet,ne=function(){let r=a(this,m),n=document.createElement("style");n.textContent=re(r.accentColor);let s=document.createElement("div");s.className="cr-root",s.innerHTML=`
      <div class="cr-panel" data-open="false" part="panel">
        <header class="cr-header">
        <h2 class="cr-title">${r.title??"Ask ContextRocket"}</h2>
          <button type="button" class="cr-close" aria-label="Close chat">\xD7</button>
        </header>
        <div class="cr-messages" part="messages"></div>
        <p class="cr-error" hidden part="error"></p>
        <form class="cr-composer" part="composer">
          <input class="cr-input" type="text" autocomplete="off" placeholder="Ask a question\u2026" />
          <button class="cr-send" type="submit">Send</button>
        </form>
        <footer class="cr-footer" part="footer">
          Powered by <a href="${P(r)}" target="_blank" rel="noopener noreferrer">ContextRocket</a>
        </footer>
      </div>
      <button type="button" class="cr-launcher" aria-label="Open chat" part="launcher">\u2301</button>
    `,a(this,l).replaceChildren(n,s),d(this,U,a(this,l).querySelector(".cr-panel")),d(this,$,a(this,l).querySelector(".cr-launcher")),d(this,y,a(this,l).querySelector(".cr-messages")),d(this,E,a(this,l).querySelector(".cr-input")),d(this,D,a(this,l).querySelector(".cr-send")),d(this,M,a(this,l).querySelector(".cr-error")),d(this,A,a(this,l).querySelector(".cr-footer a"))},ae=function(){a(this,$).addEventListener("click",()=>f(this,c,K).call(this,!0)),a(this,l).querySelector(".cr-close")?.addEventListener("click",()=>f(this,c,K).call(this,!1)),a(this,l).querySelector(".cr-composer")?.addEventListener("submit",r=>{r.preventDefault(),f(this,c,se).call(this)})},K=function(r){a(this,U).dataset.open=r?"true":"false",r&&a(this,E).focus()},se=async function(){let r=a(this,m);if(!r||!L(a(this,i)))return;let n=a(this,E).value.trim();if(!n)return;a(this,E).value="";let s=z(a(this,i),n);d(this,i,s.state),d(this,q,s.assistantMessageId);let o=++X(this,T)._;f(this,c,W).call(this);try{for await(let p of I(r,{message:n,threadId:a(this,i).threadId??void 0})){if(o!==a(this,T))return;if(d(this,i,N(a(this,i),p,s.assistantMessageId)),f(this,c,W).call(this),p.type==="error"||p.type==="done")break}o===a(this,T)&&a(this,i).status==="streaming"&&(d(this,i,{...a(this,i),status:"complete"}),f(this,c,W).call(this))}catch{if(o!==a(this,T))return;d(this,i,{...a(this,i),status:"error",errorMessage:"Something went wrong. Please try again."}),f(this,c,W).call(this)}},W=function(){a(this,y).replaceChildren();for(let s of a(this,i).messages){let o=document.createElement("div");o.className="cr-message",o.dataset.role=s.role,o.textContent=s.content,s.role==="assistant"&&a(this,i).status==="streaming"&&s.id===a(this,q)&&(o.dataset.streaming="true"),a(this,y).appendChild(o)}a(this,y).scrollTop=a(this,y).scrollHeight;let r=!!a(this,i).errorMessage;a(this,M).hidden=!r,a(this,M).textContent=a(this,i).errorMessage??"";let n=a(this,i).status==="streaming";a(this,E).disabled=n,a(this,D).disabled=n||!L(a(this,i))};function B(e=customElements){e.get(G)||e.define(G,H)}function Se(e=document.currentScript){if(e)return e;let t=document.querySelectorAll('script[src*="embed/widget.js"], script[data-contextrocket-api-key], script[data-contextrocket-handle]');for(let r=t.length-1;r>=0;r-=1){let n=t.item(r);if(n&&w(n))return n}return null}function O(e=Se()){if(!e)return null;if(!w(e))return console.warn("[ContextRocket] live embed requires data-contextrocket-api-base; omit data-contextrocket-mode for a canned demo"),null;B();let r=document.createElement(G);for(let n of e.attributes)n.name.startsWith("data-")&&r.setAttribute(n.name,n.value);return document.body.appendChild(r),r}B();typeof document<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>O()):O());return pe(ke);})();
