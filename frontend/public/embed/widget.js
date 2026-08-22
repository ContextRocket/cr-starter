var ContextRocketWidget=(()=>{var re=Object.defineProperty;var we=Object.getOwnPropertyDescriptor;var ke=Object.getOwnPropertyNames;var Re=Object.prototype.hasOwnProperty;var ce=e=>{throw TypeError(e)};var Ae=(e,r)=>{for(var t in r)re(e,t,{get:r[t],enumerable:!0})},We=(e,r,t,n)=>{if(r&&typeof r=="object"||typeof r=="function")for(let s of ke(r))!Re.call(e,s)&&s!==t&&re(e,s,{get:()=>r[s],enumerable:!(n=we(r,s))||n.enumerable});return e};var Me=e=>We(re({},"__esModule",{value:!0}),e);var ne=(e,r,t)=>r.has(e)||ce("Cannot "+t);var o=(e,r,t)=>(ne(e,r,"read from private field"),t?t.call(e):r.get(e)),b=(e,r,t)=>r.has(e)?ce("Cannot add the same private member more than once"):r instanceof WeakSet?r.add(e):r.set(e,t),l=(e,r,t,n)=>(ne(e,r,"write to private field"),n?n.call(e,t):r.set(e,t),t),h=(e,r,t)=>(ne(e,r,"access private method"),t);var de=(e,r,t,n)=>({set _(s){l(e,r,s,t)},get _(){return o(e,r,n)}});var Xe={};Ae(Xe,{ContextRocketChatElement:()=>j,applyTransportEvent:()=>Q,beginSend:()=>J,buildPoweredByHref:()=>O,canSend:()=>U,collectEmbedA2aSubscribe:()=>ge,createInitialChatState:()=>G,mountFromScriptTag:()=>Y,parseWidgetConfig:()=>L,registerContextRocketChatElement:()=>K,renderMarkdown:()=>ee,resetMessageIdCounter:()=>me,streamEmbedA2aSubscribe:()=>B});async function*le(e,r){let t=new TextDecoder,n="",s="message",a=[],i=()=>{e.cancel()};r?.addEventListener("abort",i,{once:!0});try{for(;!r?.aborted;){let{done:c,value:p}=await e.read();if(c)break;n+=t.decode(p,{stream:!0});let x=n.split(`
`);n=x.pop()??"";for(let f of x)f.startsWith("event:")?s=f.slice(6).trim():f.startsWith("data:")?a.push(f.slice(5).trim()):f===""&&a.length>0&&(yield{type:s,data:a.join(`
`)},s="message",a.length=0)}}finally{r?.removeEventListener("abort",i);try{await e.cancel()}finally{e.releaseLock()}}}function Le(e=fetch){return{request:e}}var ue=Le(),Ie=new Set(["submitted","working","input-required","completed","canceled","failed"]),pe=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,M="Something went wrong. Please try again.",He="The connection ended before the answer was complete. Please try again.",Pe="This content is not available in this chat. Please try again.",_e="This is a canned ContextRocket demo response. Configure live mode with an organization handle when you are ready to connect your own knowledge base.";function S(e){return typeof e=="object"&&e!==null}function $e(e){return typeof e=="string"&&Ie.has(e)}function qe(e){return!S(e)||!Array.isArray(e.parts)?[]:e.parts.flatMap(r=>!S(r)||r.type!=="text"||typeof r.text!="string"||!r.text?[]:[r.text])}function fe(e){return S(e)?S(e.metadata)?e.metadata:{}:{}}function Ne(...e){for(let r of e){let t=fe(r).source_refs;if(!Array.isArray(t))continue;return t.flatMap(s=>!S(s)||typeof s.sourceRefId!="string"?[]:[{sourceRefId:s.sourceRefId.slice(0,200),...typeof s.title=="string"?{title:s.title.slice(0,160)}:{},...typeof s.excerpt=="string"?{excerpt:s.excerpt.slice(0,600)}:{},...typeof s.url=="string"?{url:s.url.slice(0,2e3)}:{}}]).slice(0,8)}}function De(...e){for(let r of e){let t=fe(r).suggestions;if(Array.isArray(t))return t.filter(n=>typeof n=="string").map(n=>n.trim().slice(0,200)).filter(Boolean).slice(0,5)}}function V(e,r,...t){let n=Ne(...t),s=De(...t);return{type:"meta",state:e,terminal:r,...n?{sourceRefs:n}:{},...s?{suggestions:s}:{}}}function Be(e){if(!S(e))return[{type:"error",message:M}];if(e.error!==void 0&&e.error!==null)return[{type:"error",message:M}];let r=e.result;if(!S(r))return[];let t=r.type;if(t==="TaskArtifactUpdateEvent"){let c=qe(r.artifact).map(p=>({type:"delta",text:p}));return c.push(V("working",!1,r,r.artifact)),c}if(t!=="TaskStatusUpdateEvent")return[{type:"unsupported",message:Pe}];let n=typeof r.id=="string"?r.id:void 0,s=S(r.status)?r.status:void 0,a=s?.state;if(!$e(a))return[];if(a==="failed"||a==="canceled")return[V(a,!0,s,r),{type:"error",message:M}];let i=Ge(s,r);return a==="completed"||a==="input-required"||r.final===!0?[V(a,!0,s,r),...i,{type:"done",taskId:n}]:[V(a,!1,s,r),...i]}function Ge(...e){for(let r of e){if(!S(r))continue;let t=S(r.metadata)?r.metadata:r,n=typeof t.thread_id=="string"&&t.thread_id||typeof t.threadId=="string"&&t.threadId||void 0;if(n&&pe.test(n))return[{type:"session",threadId:n}]}return[]}function Ue(e){try{return Be(JSON.parse(e))}catch{return[{type:"error",message:M}]}}async function*Oe(e,r){if(e)for await(let t of le(e.getReader(),r))for(let n of Ue(t.data))yield n}async function*ze(e,r){let t=e.threadId??"demo-thread";yield{type:"meta",state:"working"};for(let n of _e.split(/(\s+)/)){if(r?.aborted)return;n&&(yield{type:"delta",text:n}),await new Promise(s=>setTimeout(s,n.trim()?18:4))}r?.aborted||(yield{type:"session",threadId:t},yield{type:"done",taskId:"demo-task"})}async function*B(e,r,t=ue,n){if(n?.aborted)return;if(e.mode==="demo"){yield*ze(r,n);return}let s={role:"user",parts:[{type:"text",text:r.message}]};r.threadId&&pe.test(r.threadId)&&(s.contextId=r.threadId);let a={};e.handle&&(a.handle=e.handle);let i={jsonrpc:"2.0",id:`embed-chat-${crypto.randomUUID()}`,method:"tasks/sendSubscribe",params:{message:s,metadata:a}},c=`${e.apiBaseUrl.replace(/\/$/,"")}/api/agent/a2a`,p={"content-type":"application/json",accept:"text/event-stream"};e.apiKey&&(p["x-api-key"]=e.apiKey);let x;try{x=await t.request(c,{method:"POST",headers:p,body:JSON.stringify(i),signal:n})}catch{if(n?.aborted)return;yield{type:"error",message:M};return}if(!x.ok){yield{type:"error",message:M};return}if(!(x.headers.get("content-type")??"").includes("text/event-stream")){yield{type:"error",message:M};return}let m=!1;for await(let E of Oe(x.body,n))(E.type==="done"||E.type==="error"||E.type==="unsupported"||E.type==="meta"&&E.terminal)&&(m=!0),yield E;!n?.aborted&&!m&&(yield{type:"error",message:He})}async function ge(e,r,t=ue,n){let s=[];for await(let a of B(e,r,t,n))s.push(a);return s}function G(e){return{status:"idle",messages:e?[{id:"greeting",role:"assistant",content:e}]:[],errorMessage:null,threadId:null,transportState:null}}var se=0;function he(e){return se+=1,`${e}-${se}`}function me(){se=0}function J(e,r){let t=he("user"),n=he("assistant");return{assistantMessageId:n,state:{...e,status:"streaming",errorMessage:null,messages:[...e.messages,{id:t,role:"user",content:r},{id:n,role:"assistant",content:""}]}}}function Q(e,r,t){switch(r.type){case"delta":return r.text?{...e,messages:e.messages.map(n=>n.id===t&&n.role==="assistant"?{...n,content:n.content+r.text}:n)}:e;case"session":return{...e,threadId:r.threadId};case"error":return{...e,status:"error",errorMessage:r.message};case"unsupported":return{...e,status:"error",errorMessage:r.message};case"done":return{...e,status:"complete"};case"meta":{let n=r.sourceRefs||r.suggestions?e.messages.map(s=>s.id===t&&s.role==="assistant"?{...s,...r.sourceRefs?{sourceRefs:r.sourceRefs}:{},...r.suggestions?{suggestions:r.suggestions}:{}}:s):e.messages;return{...e,messages:n,transportState:r.state,status:r.terminal&&r.state==="input-required"?"input-required":r.terminal&&r.state==="canceled"?"canceled":e.status}}default:return e}}function U(e){return e.status!=="streaming"}var T="contextrocket";function C(e,...r){for(let t of r){let n=e.getAttribute(t)?.trim();if(n)return n}}function P(e,r){if(!e)return;let t=e.replace(/[\u0000-\u001f\u007f]/g,"").trim();return t?t.slice(0,r):void 0}function be(e){if(e)return/^(#[0-9a-f]{3,8}|rgb(a)?\([^)]{1,80}\)|hsl(a)?\([^)]{1,80}\))$/i.test(e)?e:void 0}function L(e){let r=C(e,`data-${T}-api-key`),t=C(e,`data-${T}-handle`),n=C(e,`data-${T}-api-base`),a=C(e,`data-${T}-mode`)==="live"?"live":"demo";if(a==="live"&&!n)return null;let i=C(e,`data-${T}-accent`),c=C(e,`data-${T}-greeting`),p=C(e,`data-${T}-title`),x=C(e,`data-${T}-ref`),f=C(e,`data-${T}-theme`),m=C(e,`data-${T}-position`),E=C(e,`data-${T}-locale`);return{...n?{apiBaseUrl:n.replace(/\/$/,"")}:{},mode:a,...r?{apiKey:r}:{},...t?{handle:t}:{},...be(i)?{accentColor:be(i)}:{},...P(c,400)?{greeting:P(c,400)}:{},...P(p,120)?{title:P(p,120)}:{},...P(x,100)?{ref:P(x,100)}:{},...f==="system"||f==="light"||f==="dark"?{theme:f}:{},...m==="bottom-right"||m==="bottom-left"?{position:m}:{},...E==="auto"||E==="en"||E==="es"||E==="de"?{locale:E}:{}}}function O(e){let r="https://www.contextrocket.ai",t=e.ref??e.handle??"widget";return`${r}?ref=${encodeURIComponent(t)}`}function Z(e){if(e)try{let r=new URL(e);return r.protocol!=="http:"&&r.protocol!=="https:"?void 0:r.href}catch{return}}function z(e){return e.replace(/[&<>"']/g,r=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[r])}function ee(e,r){let t=r.split(/\r?\n/),n=!1,s=[],a=(i,c)=>{let p=document.createElement("p");c&&(p.className=c),oe(p,i),e.appendChild(p)};for(let i of t){if(i.trim().startsWith("```")){if(n){let f=document.createElement("pre"),m=document.createElement("code");m.textContent=s.join(`
`),f.appendChild(m),e.appendChild(f),s=[]}n=!n;continue}if(n){s.push(i);continue}let c=i.match(/^#{1,6}\s+(.+)$/);if(c){let f=document.createElement("p");f.className="cr-markdown-heading";let m=document.createElement("strong");m.textContent=c[1],f.appendChild(m),e.appendChild(f);continue}let p=i.match(/^\s*[-*+]\s+(.+)$/);if(p){let f=document.createElement("ul"),m=document.createElement("li");oe(m,p[1]),f.appendChild(m),e.appendChild(f);continue}let x=i.match(/^\s*\d+[.)]\s+(.+)$/);if(x){let f=document.createElement("ol"),m=document.createElement("li");oe(m,x[1]),f.appendChild(m),e.appendChild(f);continue}i.trim()&&a(i)}if(n&&s.length>0){let i=document.createElement("pre"),c=document.createElement("code");c.textContent=s.join(`
`),i.appendChild(c),e.appendChild(i)}}function oe(e,r){let t=/(\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|__([^_]+)__|`([^`]+)`|\*([^*]+)\*|_([^_]+)_)/g,n=0;for(let s of r.matchAll(t)){let a=s.index??0;if(a>n&&e.appendChild(document.createTextNode(r.slice(n,a))),s[2]&&s[3]){let i=Z(s[3]);if(i){let c=document.createElement("a");c.href=i,c.target="_blank",c.rel="noopener noreferrer",c.textContent=s[2],e.appendChild(c)}else e.appendChild(document.createTextNode(s[2]))}else if(s[4]||s[5]||s[7]||s[8]){let i=document.createElement(s[4]||s[5]?"strong":"em");i.textContent=s[4]||s[5]||s[7]||s[8]||"",e.appendChild(i)}else if(s[6]){let i=document.createElement("code");i.textContent=s[6],e.appendChild(i)}n=a+s[0].length}n<r.length&&e.appendChild(document.createTextNode(r.slice(n)))}function xe(e="#ff2b67"){return`
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
  --cr-card: #f9fafb;
  --cr-text: #111827;
  --cr-panel-shadow: 0 12px 40px rgba(17, 24, 39, 0.18);
}

:host([data-theme="dark"]) {
  color: #f9fafb;
  --cr-border: #374151;
  --cr-muted: #9ca3af;
  --cr-bg: #111827;
  --cr-card: #1f2937;
  --cr-text: #f9fafb;
  --cr-accent-soft: color-mix(in srgb, var(--cr-accent) 22%, #111827);
}

@media (prefers-color-scheme: dark) {
  :host([data-theme="system"]) {
    color: #f9fafb;
    --cr-border: #374151;
    --cr-muted: #9ca3af;
    --cr-bg: #111827;
    --cr-card: #1f2937;
    --cr-text: #f9fafb;
    --cr-accent-soft: color-mix(in srgb, var(--cr-accent) 22%, #111827);
  }
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

.cr-root[data-position="bottom-left"] {
  right: auto;
  left: 20px;
  align-items: flex-start;
}

.cr-launcher {
  width: 56px;
  height: 56px;
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
  color: var(--cr-text);
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
  background: var(--cr-card);
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
  min-width: 44px;
  min-height: 44px;
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
  background: var(--cr-card);
}

.cr-message p,
.cr-message ul,
.cr-message ol,
.cr-message pre {
  margin: 0 0 8px;
}

.cr-message p:last-child,
.cr-message ul:last-child,
.cr-message ol:last-child,
.cr-message pre:last-child {
  margin-bottom: 0;
}

.cr-message ul,
.cr-message ol {
  padding-left: 20px;
}

.cr-message a,
.cr-source {
  color: var(--cr-accent);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.cr-message pre {
  overflow-x: auto;
  padding: 8px;
  background: color-mix(in srgb, var(--cr-card) 72%, #000 28%);
  font-size: 12px;
}

.cr-markdown-heading {
  font-weight: 700;
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

.cr-status {
  margin: 0 14px 8px;
  color: var(--cr-muted);
  font-size: 12px;
}

.cr-retry {
  align-self: flex-start;
  margin: 0 14px 8px;
  min-height: 44px;
  border: 1px solid var(--cr-border);
  background: var(--cr-card);
  color: var(--cr-accent);
  padding: 8px 12px;
  cursor: pointer;
  font: inherit;
  font-weight: 600;
}

.cr-sources,
.cr-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.cr-source,
.cr-suggestion {
  min-height: 32px;
  border: 1px solid var(--cr-border);
  background: var(--cr-bg);
  padding: 5px 8px;
  font-size: 11px;
}

.cr-suggestion {
  color: var(--cr-accent);
  cursor: pointer;
  font: inherit;
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
  min-height: 44px;
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
`.trim()}var ie="contextrocket-chat",Fe={en:{open:"Open chat",close:"Close chat",send:"Send",stop:"Stop response",retry:"Try again",placeholder:"Ask a question\u2026",poweredBy:"Powered by",working:"Working\u2026",submitted:"Connecting\u2026",inputRequired:"A response is needed to continue.",canceled:"Response stopped. You can try again.",interrupted:"The connection ended before the answer was complete. Please try again.",unsupported:"This content is not available in this chat. Please try again.",sources:"Sources",suggestions:"Suggested follow-ups"},es:{open:"Abrir chat",close:"Cerrar chat",send:"Enviar",stop:"Detener respuesta",retry:"Intentar de nuevo",placeholder:"Haz una pregunta\u2026",poweredBy:"Desarrollado por",working:"Trabajando\u2026",submitted:"Conectando\u2026",inputRequired:"Se necesita una respuesta para continuar.",canceled:"Respuesta detenida. Puedes intentarlo de nuevo.",interrupted:"La conexi\xF3n termin\xF3 antes de completar la respuesta. Int\xE9ntalo de nuevo.",unsupported:"Este contenido no est\xE1 disponible en este chat. Int\xE9ntalo de nuevo.",sources:"Fuentes",suggestions:"Sugerencias"},de:{open:"Chat \xF6ffnen",close:"Chat schlie\xDFen",send:"Senden",stop:"Antwort stoppen",retry:"Erneut versuchen",placeholder:"Frage stellen\u2026",poweredBy:"Bereitgestellt von",working:"Wird bearbeitet\u2026",submitted:"Verbindung wird hergestellt\u2026",inputRequired:"F\xFCr die Fortsetzung ist eine Antwort erforderlich.",canceled:"Antwort gestoppt. Du kannst es erneut versuchen.",interrupted:"Die Verbindung endete vor Abschluss der Antwort. Bitte erneut versuchen.",unsupported:"Dieser Inhalt ist in diesem Chat nicht verf\xFCgbar. Bitte erneut versuchen.",sources:"Quellen",suggestions:"Vorschl\xE4ge"}};function ae(e){return Fe[e.locale==="es"||e.locale==="de"?e.locale:"en"]}var v,u,g,k,X,R,I,A,y,w,W,H,$,q,N,D,d,ye,Ee,F,ve,te,Te,_,Ce,Se,j=class extends HTMLElement{constructor(){super();b(this,d);b(this,v,null);b(this,u,G());b(this,g);b(this,k,0);b(this,X,null);b(this,R,"");b(this,I,null);b(this,A);b(this,y);b(this,w);b(this,W);b(this,H);b(this,$);b(this,q);b(this,N);b(this,D);l(this,g,this.attachShadow({mode:"open"}))}static get observedAttributes(){return["data-contextrocket-api-key","data-contextrocket-handle","data-contextrocket-mode","data-contextrocket-api-base","data-contextrocket-accent","data-contextrocket-greeting","data-contextrocket-title","data-contextrocket-ref","data-contextrocket-theme","data-contextrocket-position","data-contextrocket-locale"]}connectedCallback(){l(this,v,L(this)),o(this,v)&&(l(this,u,G(o(this,v).greeting)),h(this,d,ye).call(this),h(this,d,Ee).call(this),h(this,d,_).call(this),h(this,d,F).call(this,!1))}attributeChangedCallback(){if(!this.isConnected)return;let t=L(this);t&&(l(this,v,t),o(this,D)&&(o(this,D).href=O(t),o(this,g).host.style.setProperty("--cr-accent",t.accentColor??"#ff2b67"),o(this,g).host.dataset.theme=t.theme??"system",o(this,g).querySelector(".cr-root")?.setAttribute("data-position",t.position??"bottom-right")))}};v=new WeakMap,u=new WeakMap,g=new WeakMap,k=new WeakMap,X=new WeakMap,R=new WeakMap,I=new WeakMap,A=new WeakMap,y=new WeakMap,w=new WeakMap,W=new WeakMap,H=new WeakMap,$=new WeakMap,q=new WeakMap,N=new WeakMap,D=new WeakMap,d=new WeakSet,ye=function(){let t=o(this,v),n=ae(t),s=document.createElement("style");s.textContent=xe(t.accentColor);let a=document.createElement("div");a.className="cr-root",a.dataset.position=t.position??"bottom-right",a.innerHTML=`
      <div class="cr-panel" data-open="false" data-position="${z(t.position??"bottom-right")}" part="panel" role="dialog" aria-modal="true" aria-hidden="true" aria-label="${z(t.title??"Ask ContextRocket")}" inert>
        <header class="cr-header">
          <h2 class="cr-title">${z(t.title??"Ask ContextRocket")}</h2>
          <button type="button" class="cr-close" aria-label="${n.close}">\xD7</button>
        </header>
        <div class="cr-messages" part="messages" role="log" aria-live="polite"></div>
        <p class="cr-status" role="status" aria-live="polite" hidden></p>
        <p class="cr-error" role="alert" hidden part="error"></p>
        <button type="button" class="cr-retry" hidden>${n.retry}</button>
        <form class="cr-composer" part="composer">
          <input class="cr-input" type="text" autocomplete="off" placeholder="${n.placeholder}" aria-label="${n.placeholder}" />
          <button class="cr-send" type="submit" aria-label="${n.send}">${n.send}</button>
        </form>
        <footer class="cr-footer" part="footer">
          ${n.poweredBy} <a href="${z(O(t))}" target="_blank" rel="noopener noreferrer">ContextRocket</a>
        </footer>
      </div>
      <button type="button" class="cr-launcher" aria-label="${n.open}" aria-expanded="false" aria-controls="contextrocket-chat-panel" part="launcher">\u2301</button>
    `,o(this,g).replaceChildren(s,a),l(this,y,o(this,g).querySelector(".cr-panel")),o(this,y).id="contextrocket-chat-panel",l(this,A,o(this,g).querySelector(".cr-launcher")),l(this,w,o(this,g).querySelector(".cr-messages")),l(this,W,o(this,g).querySelector(".cr-input")),l(this,H,o(this,g).querySelector(".cr-send")),l(this,$,o(this,g).querySelector(".cr-error")),l(this,q,o(this,g).querySelector(".cr-status")),l(this,N,o(this,g).querySelector(".cr-retry")),l(this,D,o(this,g).querySelector(".cr-footer a")),o(this,g).host.dataset.theme=t.theme??"system"},Ee=function(){o(this,A).addEventListener("click",()=>h(this,d,F).call(this,!0)),o(this,g).querySelector(".cr-close")?.addEventListener("click",()=>h(this,d,F).call(this,!1)),o(this,N).addEventListener("click",()=>void h(this,d,te).call(this,o(this,R))),o(this,w).addEventListener("click",t=>{let s=t.target.closest("[data-suggestion]");s?.dataset.suggestion&&h(this,d,te).call(this,s.dataset.suggestion)}),o(this,g).querySelector(".cr-composer")?.addEventListener("submit",t=>{t.preventDefault(),o(this,u).status==="streaming"?h(this,d,Te).call(this):h(this,d,ve).call(this)}),o(this,g).addEventListener("keydown",t=>{if(!o(this,y)||o(this,y).dataset.open!=="true")return;if(t.key==="Escape"){t.preventDefault(),h(this,d,F).call(this,!1);return}if(t.key!=="Tab")return;let n=Array.from(o(this,y).querySelectorAll('button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'));if(!n.length)return;let s=n[0],a=n[n.length-1];t.shiftKey&&o(this,g).activeElement===s?(t.preventDefault(),a.focus()):!t.shiftKey&&o(this,g).activeElement===a&&(t.preventDefault(),s.focus())})},F=function(t){o(this,y)&&(o(this,y).dataset.open=t?"true":"false",o(this,y).setAttribute("aria-hidden",String(!t)),t?(o(this,y).removeAttribute("inert"),o(this,A).setAttribute("aria-expanded","true"),o(this,W).focus()):(o(this,y).setAttribute("inert",""),o(this,A).setAttribute("aria-expanded","false"),o(this,A).focus()))},ve=async function(){let t=o(this,W).value.trim();t&&(o(this,W).value="",await h(this,d,te).call(this,t))},te=async function(t){let n=o(this,v);if(!n||!t.trim()||!U(o(this,u)))return;l(this,R,t.trim());let s=J(o(this,u),o(this,R));l(this,u,s.state),l(this,X,s.assistantMessageId);let a=++de(this,k)._,i=new AbortController;l(this,I,i),h(this,d,_).call(this);try{for await(let c of B(n,{message:o(this,R),threadId:o(this,u).threadId??void 0},void 0,i.signal)){if(a!==o(this,k))return;if(l(this,u,Q(o(this,u),c,s.assistantMessageId)),h(this,d,_).call(this),c.type==="error"||c.type==="unsupported"||c.type==="done")break}}catch{a===o(this,k)&&(l(this,u,{...o(this,u),status:"error",errorMessage:"Something went wrong. Please try again."}),h(this,d,_).call(this))}finally{a===o(this,k)&&l(this,I,null)}},Te=function(){o(this,I)?.abort(),l(this,k,o(this,k)+1),l(this,I,null),l(this,u,{...o(this,u),status:"canceled",errorMessage:ae(o(this,v)).canceled}),h(this,d,_).call(this)},_=function(){if(!o(this,v))return;let t=ae(o(this,v));o(this,w).replaceChildren();for(let i of o(this,u).messages){let c=document.createElement("div");c.className="cr-message",c.dataset.role=i.role,i.role==="assistant"?(ee(c,i.content),i.sourceRefs?.length&&h(this,d,Ce).call(this,c,i.sourceRefs,t),i.suggestions?.length&&o(this,u).status!=="streaming"&&h(this,d,Se).call(this,c,i.suggestions,t)):c.textContent=i.content,i.role==="assistant"&&o(this,u).status==="streaming"&&i.id===o(this,X)&&(c.dataset.streaming="true"),o(this,w).appendChild(c)}o(this,w).scrollTop=o(this,w).scrollHeight;let n=!!o(this,u).errorMessage;o(this,$).hidden=!n,o(this,$).textContent=o(this,u).errorMessage??"",o(this,N).hidden=!n||!o(this,R);let s="";o(this,u).status==="streaming"?s=o(this,u).transportState==="submitted"?t.submitted:t.working:o(this,u).status==="input-required"&&(s=t.inputRequired),o(this,q).hidden=!s,o(this,q).textContent=s;let a=o(this,u).status==="streaming";o(this,W).disabled=a,o(this,H).disabled=!a&&!U(o(this,u)),o(this,H).textContent=a?t.stop:t.send,o(this,H).setAttribute("aria-label",a?t.stop:t.send)},Ce=function(t,n,s){let a=document.createElement("div");a.className="cr-sources",a.setAttribute("aria-label",s.sources);for(let i of n){let c=Z(i.url),p=c?document.createElement("a"):document.createElement("span");p.className="cr-source",p.textContent=i.title??i.sourceRefId,c&&p instanceof HTMLAnchorElement&&(p.href=c,p.target="_blank",p.rel="noopener noreferrer"),a.appendChild(p)}t.appendChild(a)},Se=function(t,n,s){let a=document.createElement("div");a.className="cr-suggestions",a.setAttribute("aria-label",s.suggestions);for(let i of n){let c=document.createElement("button");c.type="button",c.className="cr-suggestion",c.dataset.suggestion=i,c.textContent=i,a.appendChild(c)}t.appendChild(a)};function K(e=customElements){e.get(ie)||e.define(ie,j)}function je(e=document.currentScript){if(e)return e;let r=document.querySelectorAll('script[src*="embed/widget.js"], script[data-contextrocket-api-key], script[data-contextrocket-handle]');for(let t=r.length-1;t>=0;t-=1){let n=r.item(t);if(n&&L(n))return n}return null}function Y(e=je()){if(!e)return null;if(!L(e))return console.warn("[ContextRocket] live embed requires data-contextrocket-api-base; omit data-contextrocket-mode for a canned demo"),null;K();let t=document.createElement(ie);for(let n of e.attributes)n.name.startsWith("data-")&&t.setAttribute(n.name,n.value);return document.body.appendChild(t),t}K();typeof document<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>Y()):Y());return Me(Xe);})();
