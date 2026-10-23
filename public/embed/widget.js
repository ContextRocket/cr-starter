var ContextRocketWidget=(()=>{var ne=Object.defineProperty;var Me=Object.getOwnPropertyDescriptor;var We=Object.getOwnPropertyNames;var Le=Object.prototype.hasOwnProperty;var de=e=>{throw TypeError(e)};var Ie=(e,r)=>{for(var t in r)ne(e,t,{get:r[t],enumerable:!0})},He=(e,r,t,n)=>{if(r&&typeof r=="object"||typeof r=="function")for(let s of We(r))!Le.call(e,s)&&s!==t&&ne(e,s,{get:()=>r[s],enumerable:!(n=Me(r,s))||n.enumerable});return e};var _e=e=>He(ne({},"__esModule",{value:!0}),e);var se=(e,r,t)=>r.has(e)||de("Cannot "+t);var a=(e,r,t)=>(se(e,r,"read from private field"),t?t.call(e):r.get(e)),b=(e,r,t)=>r.has(e)?de("Cannot add the same private member more than once"):r instanceof WeakSet?r.add(e):r.set(e,t),l=(e,r,t,n)=>(se(e,r,"write to private field"),n?n.call(e,t):r.set(e,t),t),m=(e,r,t)=>(se(e,r,"access private method"),t);var le=(e,r,t,n)=>({set _(s){l(e,r,s,t)},get _(){return a(e,r,n)}});var Qe={};Ie(Qe,{ContextRocketChatElement:()=>X,applyTransportEvent:()=>Q,beginSend:()=>J,buildPoweredByHref:()=>F,canSend:()=>B,collectEmbedA2aSubscribe:()=>xe,createInitialChatState:()=>O,mountFromScriptTag:()=>Y,parseWidgetConfig:()=>H,registerContextRocketChatElement:()=>V,renderMarkdown:()=>ee,resetMessageIdCounter:()=>ye,streamEmbedA2aSubscribe:()=>D});async function*ue(e,r){let t=new TextDecoder,n="",s="message",o=[],i=()=>{e.cancel()};r?.addEventListener("abort",i,{once:!0});try{for(;!r?.aborted;){let{done:c,value:f}=await e.read();if(c)break;n+=t.decode(f,{stream:!0});let y=n.split(`
`);n=y.pop()??"";for(let p of y)p.startsWith("event:")?s=p.slice(6).trim():p.startsWith("data:")?o.push(p.slice(5).trim()):p===""&&o.length>0&&(yield{type:s,data:o.join(`
`)},s="message",o.length=0)}}finally{r?.removeEventListener("abort",i);try{await e.cancel()}finally{e.releaseLock()}}}function Pe(e=fetch){return{request:e}}var pe=Pe(),qe=new Set(["submitted","working","input-required","completed","canceled","failed"]),Ne="1.0";function ge(e){if(typeof e!="string"||!e)return null;let r=e.replace(/^TASK_STATE_/,"").toLowerCase().replace(/_/g,"-");return ae(r)?r:null}var fe=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,R="Something went wrong. Please try again.",$e="The connection ended before the answer was complete. Please try again.",Ue="This content is not available in this chat. Please try again.",ze="This is a canned ContextRocket demo response. Configure live mode with an organization handle when you are ready to connect your own knowledge base.";function x(e){return typeof e=="object"&&e!==null}function ae(e){return typeof e=="string"&&qe.has(e)}function me(e){return!x(e)||!Array.isArray(e.parts)?[]:e.parts.flatMap(r=>!x(r)||typeof r.text!="string"||!r.text?[]:[r.text])}function he(e){return x(e)?x(e.metadata)?e.metadata:{}:{}}function De(...e){for(let r of e){let t=he(r).source_refs;if(!Array.isArray(t))continue;return t.flatMap(s=>!x(s)||typeof s.sourceRefId!="string"?[]:[{sourceRefId:s.sourceRefId.slice(0,200),...typeof s.title=="string"?{title:s.title.slice(0,160)}:{},...typeof s.excerpt=="string"?{excerpt:s.excerpt.slice(0,600)}:{},...typeof s.url=="string"?{url:s.url.slice(0,2e3)}:{}}]).slice(0,8)}}function Oe(...e){for(let r of e){let t=he(r).suggestions;if(Array.isArray(t))return t.filter(n=>typeof n=="string").map(n=>n.trim().slice(0,200)).filter(Boolean).slice(0,5)}}function A(e,r,...t){let n=De(...t),s=Oe(...t);return{type:"meta",state:e,terminal:r,...n?{sourceRefs:n}:{},...s?{suggestions:s}:{}}}function Be(e){let r=x(e.status)?e.status:void 0,t=ge(r?.state);if(!ae(t))return[];let n=typeof e.taskId=="string"?e.taskId:void 0,s=[e,r];if(t==="failed"||t==="canceled")return[A(t,!0,...s),{type:"error",message:R}];let o=be(...s);return t==="completed"||t==="input-required"?[A(t,!0,...s),...o,{type:"done",taskId:n}]:[A(t,!1,...s),...o]}function Fe(e){let r=x(e.artifact)?e.artifact:void 0,t=me(r).map(n=>({type:"delta",text:n}));return t.push(A("working",!1,e,r)),t}function Ge(e){let r=e.type;if(r==="TaskArtifactUpdateEvent"){let i=me(e.artifact).map(c=>({type:"delta",text:c}));return i.push(A("working",!1,e,e.artifact)),i}if(r!=="TaskStatusUpdateEvent")return[{type:"unsupported",message:Ue}];let t=typeof e.id=="string"?e.id:void 0,n=x(e.status)?e.status:void 0,s=ge(n?.state);if(!ae(s))return[];if(s==="failed"||s==="canceled")return[A(s,!0,n,e),{type:"error",message:R}];let o=be(n,e);return s==="completed"||s==="input-required"||e.final===!0?[A(s,!0,n,e),...o,{type:"done",taskId:t}]:[A(s,!1,n,e),...o]}function je(e){if(!x(e))return[{type:"error",message:R}];if(e.error!==void 0&&e.error!==null)return[{type:"error",message:R}];let r=e.result;return x(r)?x(r.statusUpdate)?Be(r.statusUpdate):x(r.artifactUpdate)?Fe(r.artifactUpdate):Ge(r):[]}function be(...e){for(let r of e){if(!x(r))continue;let t=x(r.metadata)?r.metadata:r,n=typeof t.thread_id=="string"&&t.thread_id||typeof t.threadId=="string"&&t.threadId||void 0;if(n&&fe.test(n))return[{type:"session",threadId:n}]}return[]}function Xe(e){try{return je(JSON.parse(e))}catch{return[{type:"error",message:R}]}}async function*Ke(e,r){if(e)for await(let t of ue(e.getReader(),r))for(let n of Xe(t.data))yield n}async function*Ve(e,r){let t=e.threadId??"demo-thread";yield{type:"meta",state:"working"};for(let n of ze.split(/(\s+)/)){if(r?.aborted)return;n&&(yield{type:"delta",text:n}),await new Promise(s=>setTimeout(s,n.trim()?18:4))}r?.aborted||(yield{type:"session",threadId:t},yield{type:"done",taskId:"demo-task"})}async function*D(e,r,t=pe,n){if(n?.aborted)return;if(e.mode==="demo"){yield*Ve(r,n);return}let s={role:"ROLE_USER",parts:[{text:r.message}]};r.threadId&&fe.test(r.threadId)&&(s.contextId=r.threadId);let o={};e.handle&&(o.handle=e.handle);let i={jsonrpc:"2.0",id:`embed-chat-${crypto.randomUUID()}`,method:"SendStreamingMessage",params:{message:s,metadata:o}},c=`${e.apiBaseUrl.replace(/\/$/,"")}/api/agent/a2a`,f={"content-type":"application/json",accept:"text/event-stream","a2a-version":Ne};e.apiKey&&(f["x-api-key"]=e.apiKey);let y;try{y=await t.request(c,{method:"POST",headers:f,body:JSON.stringify(i),signal:n})}catch{if(n?.aborted)return;yield{type:"error",message:R};return}if(!y.ok){yield{type:"error",message:R};return}if(!(y.headers.get("content-type")??"").includes("text/event-stream")){yield{type:"error",message:R};return}let h=!1;for await(let E of Ke(y.body,n))(E.type==="done"||E.type==="error"||E.type==="unsupported"||E.type==="meta"&&E.terminal)&&(h=!0),yield E;!n?.aborted&&!h&&(yield{type:"error",message:$e})}async function xe(e,r,t=pe,n){let s=[];for await(let o of D(e,r,t,n))s.push(o);return s}function O(e){return{status:"idle",messages:e?[{id:"greeting",role:"assistant",content:e}]:[],errorMessage:null,threadId:null,transportState:null}}var oe=0;function we(e){return oe+=1,`${e}-${oe}`}function ye(){oe=0}function J(e,r){let t=we("user"),n=we("assistant");return{assistantMessageId:n,state:{...e,status:"streaming",errorMessage:null,messages:[...e.messages,{id:t,role:"user",content:r},{id:n,role:"assistant",content:""}]}}}function Q(e,r,t){switch(r.type){case"delta":return r.text?{...e,messages:e.messages.map(n=>n.id===t&&n.role==="assistant"?{...n,content:n.content+r.text}:n)}:e;case"session":return{...e,threadId:r.threadId};case"error":return{...e,status:"error",errorMessage:r.message};case"unsupported":return{...e,status:"error",errorMessage:r.message};case"done":return{...e,status:"complete"};case"meta":{let n=r.sourceRefs||r.suggestions?e.messages.map(s=>s.id===t&&s.role==="assistant"?{...s,...r.sourceRefs?{sourceRefs:r.sourceRefs}:{},...r.suggestions?{suggestions:r.suggestions}:{}}:s):e.messages;return{...e,messages:n,transportState:r.state,status:r.terminal&&r.state==="input-required"?"input-required":r.terminal&&r.state==="canceled"?"canceled":e.status}}default:return e}}function B(e){return e.status!=="streaming"}var k="contextrocket";function T(e,...r){for(let t of r){let n=e.getAttribute(t)?.trim();if(n)return n}}function P(e,r){if(!e)return;let t=e.replace(/[\u0000-\u001f\u007f]/g,"").trim();return t?t.slice(0,r):void 0}function ve(e){if(e)return/^(#[0-9a-f]{3,8}|rgb(a)?\([^)]{1,80}\)|hsl(a)?\([^)]{1,80}\))$/i.test(e)?e:void 0}function H(e){let r=T(e,`data-${k}-api-key`),t=T(e,`data-${k}-handle`),n=T(e,`data-${k}-api-base`),o=T(e,`data-${k}-mode`)==="live"?"live":"demo";if(o==="live"&&!n)return null;let i=T(e,`data-${k}-accent`),c=T(e,`data-${k}-greeting`),f=T(e,`data-${k}-title`),y=T(e,`data-${k}-ref`),p=T(e,`data-${k}-theme`),h=T(e,`data-${k}-position`),E=T(e,`data-${k}-locale`);return{...n?{apiBaseUrl:n.replace(/\/$/,"")}:{},mode:o,...r?{apiKey:r}:{},...t?{handle:t}:{},...ve(i)?{accentColor:ve(i)}:{},...P(c,400)?{greeting:P(c,400)}:{},...P(f,120)?{title:P(f,120)}:{},...P(y,100)?{ref:P(y,100)}:{},...p==="system"||p==="light"||p==="dark"?{theme:p}:{},...h==="bottom-right"||h==="bottom-left"?{position:h}:{},...E==="auto"||E==="en"||E==="es"||E==="de"?{locale:E}:{}}}function F(e){let r="https://www.contextrocket.ai",t=e.ref??e.handle??"widget";return`${r}?ref=${encodeURIComponent(t)}`}function Z(e){if(e)try{let r=new URL(e);return r.protocol!=="http:"&&r.protocol!=="https:"?void 0:r.href}catch{return}}function G(e){return e.replace(/[&<>"']/g,r=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[r])}function ee(e,r){let t=r.split(/\r?\n/),n=!1,s=[],o=(i,c)=>{let f=document.createElement("p");c&&(f.className=c),ie(f,i),e.appendChild(f)};for(let i of t){if(i.trim().startsWith("```")){if(n){let p=document.createElement("pre"),h=document.createElement("code");h.textContent=s.join(`
`),p.appendChild(h),e.appendChild(p),s=[]}n=!n;continue}if(n){s.push(i);continue}let c=i.match(/^#{1,6}\s+(.+)$/);if(c){let p=document.createElement("p");p.className="cr-markdown-heading";let h=document.createElement("strong");h.textContent=c[1],p.appendChild(h),e.appendChild(p);continue}let f=i.match(/^\s*[-*+]\s+(.+)$/);if(f){let p=document.createElement("ul"),h=document.createElement("li");ie(h,f[1]),p.appendChild(h),e.appendChild(p);continue}let y=i.match(/^\s*\d+[.)]\s+(.+)$/);if(y){let p=document.createElement("ol"),h=document.createElement("li");ie(h,y[1]),p.appendChild(h),e.appendChild(p);continue}i.trim()&&o(i)}if(n&&s.length>0){let i=document.createElement("pre"),c=document.createElement("code");c.textContent=s.join(`
`),i.appendChild(c),e.appendChild(i)}}function ie(e,r){let t=/(\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|__([^_]+)__|`([^`]+)`|\*([^*]+)\*|_([^_]+)_)/g,n=0;for(let s of r.matchAll(t)){let o=s.index??0;if(o>n&&e.appendChild(document.createTextNode(r.slice(n,o))),s[2]&&s[3]){let i=Z(s[3]);if(i){let c=document.createElement("a");c.href=i,c.target="_blank",c.rel="noopener noreferrer",c.textContent=s[2],e.appendChild(c)}else e.appendChild(document.createTextNode(s[2]))}else if(s[4]||s[5]||s[7]||s[8]){let i=document.createElement(s[4]||s[5]?"strong":"em");i.textContent=s[4]||s[5]||s[7]||s[8]||"",e.appendChild(i)}else if(s[6]){let i=document.createElement("code");i.textContent=s[6],e.appendChild(i)}n=o+s[0].length}n<r.length&&e.appendChild(document.createTextNode(r.slice(n)))}function Ee(e="#ff2b67"){return`
:host {
  all: initial;
  /* font-sans */
  font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  /* text-base \u2014 let children use the Tailwind type scale */
  font-size: 1rem;
  line-height: 1.5rem;
  color: #111827; /* gray-900 */
  -webkit-font-smoothing: antialiased;

  --cr-accent: ${e};
  --cr-accent-soft: color-mix(in srgb, var(--cr-accent) 12%, white);
  --cr-border: rgb(17 24 39 / 0.05); /* gray-900/5 \u2014 outline-gray-900/5 */
  --cr-border-strong: #e5e7eb; /* gray-200 */
  --cr-muted: #6b7280; /* gray-500 */
  --cr-bg: #ffffff;
  --cr-card: #f9fafb; /* gray-50 */
  --cr-text: #111827; /* gray-900 */
  --cr-secondary: #f3f4f6; /* gray-100 */
  --cr-secondary-fg: #111827;

  /* Tailwind spacing scale */
  --tw-space-1: 0.25rem;
  --tw-space-1_5: 0.375rem;
  --tw-space-2: 0.5rem;
  --tw-space-2_5: 0.625rem;
  --tw-space-3: 0.75rem;
  --tw-space-3_5: 0.875rem;
  --tw-space-4: 1rem;
  --tw-space-5: 1.25rem;
  --tw-space-6: 1.5rem;
  --tw-space-8: 2rem;

  /* text-xs / text-sm / text-sm/6 / text-base */
  --tw-text-xs: 0.75rem;
  --tw-leading-xs: 1rem;
  --tw-text-sm: 0.875rem;
  --tw-leading-sm: 1.25rem;
  --tw-leading-6: 1.5rem;
  --tw-text-base: 1rem;
  --tw-leading-base: 1.5rem;

  /* rounded-md / xl / 2xl / 3xl */
  --tw-radius-md: 0.375rem;
  --tw-radius-lg: 0.5rem;
  --tw-radius-xl: 0.75rem;
  --tw-radius-2xl: 1rem;
  --tw-radius-3xl: 1.5rem;

  /* shadow-lg (Tailwind UI flyout panels) */
  --cr-panel-shadow:
    0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.1);
  /* ChatFab launcher shadow (size-14 FAB) */
  --cr-fab-shadow:
    0 4px 12px rgba(11, 11, 15, 0.15),
    0 8px 24px rgba(11, 11, 15, 0.1);
}

:host([data-theme="dark"]) {
  color: #f9fafb; /* gray-50 */
  --cr-border: rgb(255 255 255 / 0.1); /* white/10 */
  --cr-border-strong: #374151; /* gray-700 */
  --cr-muted: #9ca3af; /* gray-400 */
  --cr-bg: #1f2937; /* gray-800 \u2014 flyout dark bg */
  --cr-card: #111827; /* gray-900 */
  --cr-text: #f9fafb;
  --cr-secondary: #374151;
  --cr-secondary-fg: #f9fafb;
  --cr-accent-soft: color-mix(in srgb, var(--cr-accent) 22%, #111827);
  --cr-panel-shadow: none; /* dark:shadow-none in Tailwind UI */
}

@media (prefers-color-scheme: dark) {
  :host([data-theme="system"]) {
    color: #f9fafb;
    --cr-border: rgb(255 255 255 / 0.1);
    --cr-border-strong: #374151;
    --cr-muted: #9ca3af;
    --cr-bg: #1f2937;
    --cr-card: #111827;
    --cr-text: #f9fafb;
    --cr-secondary: #374151;
    --cr-secondary-fg: #f9fafb;
    --cr-accent-soft: color-mix(in srgb, var(--cr-accent) 22%, #111827);
    --cr-panel-shadow: none;
  }
}

*, *::before, *::after {
  box-sizing: border-box;
}

/* fixed bottom-6 right-6 + gap-4 */
.cr-root {
  position: fixed;
  right: var(--tw-space-6);
  bottom: var(--tw-space-6);
  z-index: 2147483000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--tw-space-4);
}

.cr-root[data-position="bottom-left"] {
  right: auto;
  left: var(--tw-space-6);
  align-items: flex-start;
}

/* size-14 rounded-full */
.cr-launcher {
  width: 3.5rem;
  height: 3.5rem;
  border: none;
  border-radius: 9999px;
  background: var(--cr-accent);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  appearance: none;
  -webkit-appearance: none;
  outline: none;
  box-shadow: var(--cr-fab-shadow);
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.cr-launcher:hover {
  transform: scale(1.05);
  opacity: 0.9;
}

.cr-launcher:focus-visible {
  outline: 2px solid var(--cr-text);
  outline-offset: 2px;
}

/* size-6 icons */
.cr-launcher svg {
  width: 1.5rem;
  height: 1.5rem;
  display: block;
  flex-shrink: 0;
}

.cr-launcher svg[hidden] {
  display: none !important;
}

/*
 * Panel \u2248 Tailwind UI flyout:
 * max-w-md overflow-hidden rounded-2xl bg-white shadow-lg outline-1 outline-gray-900/5
 * Height keeps ChatFab drawer proportion: min(600px, 100dvh - 10rem)
 */
.cr-panel {
  width: min(28rem, calc(100vw - 3rem)); /* max-w-md / px-6 gutters */
  height: min(37.5rem, calc(100dvh - 10rem));
  display: none;
  flex-direction: column;
  overflow: hidden;
  border: none;
  outline: 1px solid var(--cr-border);
  outline-offset: -1px;
  border-radius: var(--tw-radius-2xl);
  background: var(--cr-bg);
  color: var(--cr-text);
  box-shadow: var(--cr-panel-shadow);
}

.cr-panel[data-open="true"] {
  display: flex;
}

/* Header: min-h-12 px-4 py-3 border-b */
.cr-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--tw-space-2);
  min-height: 3rem;
  padding: var(--tw-space-3) var(--tw-space-4);
  border-bottom: 1px solid var(--cr-border);
  background: var(--cr-bg);
}

/* text-sm/6 font-semibold */
.cr-title {
  margin: 0;
  font-size: var(--tw-text-sm);
  line-height: var(--tw-leading-6);
  font-weight: 600;
  letter-spacing: normal;
  text-transform: none;
  color: var(--cr-text);
}

/* size-8 rounded-md icon button */
.cr-close {
  border: none;
  background: transparent;
  color: var(--cr-muted);
  cursor: pointer;
  font-size: 1.125rem; /* text-lg */
  line-height: 1;
  width: 2rem;
  height: 2rem;
  min-width: 2rem;
  min-height: 2rem;
  padding: 0;
  border-radius: var(--tw-radius-md);
  display: grid;
  place-items: center;
  transition: background 0.15s ease, color 0.15s ease;
}

.cr-close:hover {
  background: var(--cr-card);
  color: var(--cr-text);
}

/* Messages: p-4 gap-3 text-sm/6 */
.cr-messages {
  flex: 1;
  overflow-y: auto;
  padding: var(--tw-space-4);
  display: flex;
  flex-direction: column;
  gap: var(--tw-space-3);
}

.cr-message {
  max-width: 85%;
  padding: var(--tw-space-2) var(--tw-space-3);
  border: none;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: var(--tw-text-sm);
  line-height: var(--tw-leading-6);
}

.cr-message[data-role="user"] {
  align-self: flex-end;
  border-radius: var(--tw-radius-xl) var(--tw-radius-xl) 0 var(--tw-radius-xl);
  background: var(--cr-secondary);
  color: var(--cr-secondary-fg);
}

.cr-message[data-role="assistant"] {
  align-self: flex-start;
  border-radius: var(--tw-radius-xl) var(--tw-radius-xl) var(--tw-radius-xl) 0;
  background: var(--cr-accent-soft);
  color: var(--cr-text);
}

.cr-message p,
.cr-message ul,
.cr-message ol,
.cr-message pre {
  margin: 0 0 var(--tw-space-2);
}

.cr-message p:last-child,
.cr-message ul:last-child,
.cr-message ol:last-child,
.cr-message pre:last-child {
  margin-bottom: 0;
}

.cr-message ul,
.cr-message ol {
  padding-left: var(--tw-space-5);
}

.cr-message a,
.cr-source {
  color: var(--cr-accent);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.cr-message pre {
  overflow-x: auto;
  padding: var(--tw-space-2);
  border-radius: var(--tw-radius-md);
  background: color-mix(in srgb, var(--cr-card) 72%, #000 28%);
  font-size: var(--tw-text-xs);
  line-height: var(--tw-leading-xs);
}

.cr-markdown-heading {
  font-weight: 600;
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
  margin: 0 var(--tw-space-4);
  padding: var(--tw-space-2) var(--tw-space-2_5);
  border: 1px solid #fecaca; /* red-200 */
  border-radius: var(--tw-radius-md);
  background: #fef2f2; /* red-50 */
  color: #991b1b; /* red-800 */
  font-size: var(--tw-text-xs);
  line-height: var(--tw-leading-xs);
}

.cr-status {
  margin: 0 var(--tw-space-4) var(--tw-space-2);
  color: var(--cr-muted);
  font-size: var(--tw-text-xs);
  line-height: var(--tw-leading-xs);
}

/* rounded-full border px-3 py-1.5 text-sm font-semibold */
.cr-retry {
  align-self: flex-start;
  margin: 0 var(--tw-space-4) var(--tw-space-2);
  min-height: 2rem;
  border: 1px solid var(--cr-border-strong);
  border-radius: 9999px;
  background: var(--cr-bg);
  color: var(--cr-accent);
  padding: var(--tw-space-1_5) var(--tw-space-3);
  cursor: pointer;
  font: inherit;
  font-size: var(--tw-text-sm);
  line-height: var(--tw-leading-sm);
  font-weight: 600;
}

.cr-sources,
.cr-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--tw-space-1_5);
  margin-top: var(--tw-space-2);
}

/* rounded-full border px-3 py-1 text-xs/sm */
.cr-source,
.cr-suggestion {
  min-height: 1.75rem;
  border: 1px solid var(--cr-border-strong);
  border-radius: 9999px;
  background: var(--cr-bg);
  padding: var(--tw-space-1) var(--tw-space-3);
  font-size: var(--tw-text-xs);
  line-height: var(--tw-leading-xs);
}

.cr-suggestion {
  color: var(--cr-text);
  cursor: pointer;
  font: inherit;
  font-size: var(--tw-text-sm);
  line-height: var(--tw-leading-sm);
  transition: background 0.15s ease, border-color 0.15s ease;
}

.cr-suggestion:hover {
  background: var(--cr-card);
}

/*
 * Composer: rounded-xl bg-gray-50 p-3 (ChatFab muted shell)
 * Input: text-sm/6 (Tailwind UI form fields use text-base sm:text-sm/6)
 */
.cr-composer {
  display: flex;
  flex-direction: column;
  gap: var(--tw-space-2);
  margin: 0 var(--tw-space-3) var(--tw-space-3);
  padding: var(--tw-space-3);
  border: none;
  border-radius: var(--tw-radius-xl);
  background: var(--cr-card);
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.05); /* shadow-xs */
}

.cr-input {
  flex: 1;
  min-width: 0;
  width: 100%;
  border: none;
  border-radius: 0;
  padding: 0;
  font: inherit;
  font-size: var(--tw-text-sm);
  line-height: var(--tw-leading-6);
  color: var(--cr-text);
  background: transparent;
}

.cr-input:focus {
  outline: none;
}

.cr-input::placeholder {
  color: var(--cr-muted); /* placeholder:text-gray-400-ish */
}

/* size-11 rounded-full send \u2014 matches ChatFab */
.cr-send {
  align-self: flex-end;
  width: 2.75rem;
  height: 2.75rem;
  min-height: 2.75rem;
  border: none;
  border-radius: 9999px;
  background: var(--cr-text);
  color: var(--cr-bg);
  padding: 0;
  cursor: pointer;
  font: inherit;
  font-size: 0;
  line-height: 0;
  display: grid;
  place-items: center;
  transition: opacity 0.15s ease;
}

.cr-send::before {
  content: "";
  width: 1rem; /* size-4 */
  height: 1rem;
  background: currentColor;
  mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><path d='m5 12 7-7 7 7'/><path d='M12 19V5'/></svg>") center / contain no-repeat;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><path d='m5 12 7-7 7 7'/><path d='M12 19V5'/></svg>") center / contain no-repeat;
}

.cr-send[data-state="stop"]::before {
  width: 0.875rem;
  height: 0.875rem;
  border-radius: 0.125rem;
  mask: none;
  -webkit-mask: none;
}

.cr-send:hover:not(:disabled) {
  opacity: 0.8;
}

.cr-send:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* Footer: px-4 py-2 text-xs text-gray-500 */
.cr-footer {
  padding: var(--tw-space-2) var(--tw-space-4) var(--tw-space-2_5);
  border-top: 1px solid var(--cr-border);
  text-align: center;
  font-size: var(--tw-text-xs);
  line-height: var(--tw-leading-xs);
  color: var(--cr-muted);
}

.powered-by-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--tw-space-1_5);
  color: var(--cr-muted);
  text-decoration: none;
  opacity: 0.85;
  transition: opacity 0.2s ease, color 0.2s ease;
}

.powered-by-badge img {
  display: block;
  width: 0.875rem; /* size-3.5 */
  height: 0.875rem;
}

.powered-by-badge:hover,
.powered-by-badge:focus-visible {
  color: var(--cr-accent);
  opacity: 1;
}
`.trim()}var ce="contextrocket-chat",Ye={en:{open:"Open chat",close:"Close chat",send:"Send",stop:"Stop response",retry:"Try again",placeholder:"Ask a question\u2026",working:"Working\u2026",submitted:"Connecting\u2026",inputRequired:"A response is needed to continue.",canceled:"Response stopped. You can try again.",interrupted:"The connection ended before the answer was complete. Please try again.",unsupported:"This content is not available in this chat. Please try again.",sources:"Sources",suggestions:"Suggested follow-ups"},es:{open:"Abrir chat",close:"Cerrar chat",send:"Enviar",stop:"Detener respuesta",retry:"Intentar de nuevo",placeholder:"Haz una pregunta\u2026",working:"Trabajando\u2026",submitted:"Conectando\u2026",inputRequired:"Se necesita una respuesta para continuar.",canceled:"Respuesta detenida. Puedes intentarlo de nuevo.",interrupted:"La conexi\xF3n termin\xF3 antes de completar la respuesta. Int\xE9ntalo de nuevo.",unsupported:"Este contenido no est\xE1 disponible en este chat. Int\xE9ntalo de nuevo.",sources:"Fuentes",suggestions:"Sugerencias"},de:{open:"Chat \xF6ffnen",close:"Chat schlie\xDFen",send:"Senden",stop:"Antwort stoppen",retry:"Erneut versuchen",placeholder:"Frage stellen\u2026",working:"Wird bearbeitet\u2026",submitted:"Verbindung wird hergestellt\u2026",inputRequired:"F\xFCr die Fortsetzung ist eine Antwort erforderlich.",canceled:"Antwort gestoppt. Du kannst es erneut versuchen.",interrupted:"Die Verbindung endete vor Abschluss der Antwort. Bitte erneut versuchen.",unsupported:"Dieser Inhalt ist in diesem Chat nicht verf\xFCgbar. Bitte erneut versuchen.",sources:"Quellen",suggestions:"Vorschl\xE4ge"}};function te(e){return Ye[e.locale==="es"||e.locale==="de"?e.locale:"en"]}var v,u,g,M,K,W,_,C,w,S,L,I,N,$,U,z,d,ke,Te,j,Ce,re,Se,q,Ae,Re,X=class extends HTMLElement{constructor(){super();b(this,d);b(this,v,null);b(this,u,O());b(this,g);b(this,M,0);b(this,K,null);b(this,W,"");b(this,_,null);b(this,C);b(this,w);b(this,S);b(this,L);b(this,I);b(this,N);b(this,$);b(this,U);b(this,z);l(this,g,this.attachShadow({mode:"open"}))}static get observedAttributes(){return["data-contextrocket-api-key","data-contextrocket-handle","data-contextrocket-mode","data-contextrocket-api-base","data-contextrocket-accent","data-contextrocket-greeting","data-contextrocket-title","data-contextrocket-ref","data-contextrocket-theme","data-contextrocket-position","data-contextrocket-locale"]}connectedCallback(){l(this,v,H(this)),a(this,v)&&(l(this,u,O(a(this,v).greeting)),m(this,d,ke).call(this),m(this,d,Te).call(this),m(this,d,q).call(this),m(this,d,j).call(this,!1))}attributeChangedCallback(){if(!this.isConnected)return;let t=H(this);t&&(l(this,v,t),a(this,z)&&(a(this,z).href=F(t),a(this,g).host.style.setProperty("--cr-accent",t.accentColor??"#ff2b67"),a(this,g).host.dataset.theme=t.theme??"system",a(this,g).querySelector(".cr-root")?.setAttribute("data-position",t.position??"bottom-right")))}};v=new WeakMap,u=new WeakMap,g=new WeakMap,M=new WeakMap,K=new WeakMap,W=new WeakMap,_=new WeakMap,C=new WeakMap,w=new WeakMap,S=new WeakMap,L=new WeakMap,I=new WeakMap,N=new WeakMap,$=new WeakMap,U=new WeakMap,z=new WeakMap,d=new WeakSet,ke=function(){let t=a(this,v),n=te(t),s=document.createElement("style");s.textContent=Ee(t.accentColor);let o=document.createElement("div");o.className="cr-root",o.dataset.position=t.position??"bottom-right",o.innerHTML=`
      <div class="cr-panel" data-open="false" data-position="${G(t.position??"bottom-right")}" part="panel" role="dialog" aria-modal="true" aria-hidden="true" aria-label="${G(t.title??"Ask ContextRocket")}" inert>
        <header class="cr-header">
          <h2 class="cr-title">${G(t.title??"Ask ContextRocket")}</h2>
          <button type="button" class="cr-close" aria-label="${n.close}">\xD7</button>
        </header>
        <div class="cr-messages" part="messages" role="log" aria-live="polite"></div>
        <p class="cr-status" role="status" aria-live="polite" hidden></p>
        <p class="cr-error" role="alert" hidden part="error"></p>
        <button type="button" class="cr-retry" hidden>${n.retry}</button>
        <form class="cr-composer" part="composer">
          <input class="cr-input" type="text" autocomplete="off" placeholder="${n.placeholder}" aria-label="${n.placeholder}" />
          <button class="cr-send" type="submit" data-state="send" aria-label="${n.send}"></button>
        </form>
        <footer class="cr-footer" part="footer">
          <a class="powered-by-badge" href="${G(F(t))}" target="_blank" rel="noopener noreferrer">
            <img src="/brand/cr-icon-red.svg" alt="" width="14" height="14" aria-hidden="true">
            <span>Powered by ContextRocket</span>
          </a>
        </footer>
      </div>
      <button type="button" class="cr-launcher" aria-label="${n.open}" aria-expanded="false" aria-controls="contextrocket-chat-panel" part="launcher">
        <svg class="cr-launcher-icon-open" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
        <svg class="cr-launcher-icon-close" hidden xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
    `,a(this,g).replaceChildren(s,o),l(this,w,a(this,g).querySelector(".cr-panel")),a(this,w).id="contextrocket-chat-panel",l(this,C,a(this,g).querySelector(".cr-launcher")),l(this,S,a(this,g).querySelector(".cr-messages")),l(this,L,a(this,g).querySelector(".cr-input")),l(this,I,a(this,g).querySelector(".cr-send")),l(this,N,a(this,g).querySelector(".cr-error")),l(this,$,a(this,g).querySelector(".cr-status")),l(this,U,a(this,g).querySelector(".cr-retry")),l(this,z,a(this,g).querySelector(".cr-footer a")),a(this,g).host.dataset.theme=t.theme??"system"},Te=function(){a(this,C).addEventListener("click",()=>{let t=a(this,w).dataset.open==="true";m(this,d,j).call(this,!t)}),a(this,g).querySelector(".cr-close")?.addEventListener("click",()=>m(this,d,j).call(this,!1)),a(this,U).addEventListener("click",()=>void m(this,d,re).call(this,a(this,W))),a(this,S).addEventListener("click",t=>{let s=t.target.closest("[data-suggestion]");s?.dataset.suggestion&&m(this,d,re).call(this,s.dataset.suggestion)}),a(this,g).querySelector(".cr-composer")?.addEventListener("submit",t=>{t.preventDefault(),a(this,u).status==="streaming"?m(this,d,Se).call(this):m(this,d,Ce).call(this)}),a(this,g).addEventListener("keydown",t=>{if(!a(this,w)||a(this,w).dataset.open!=="true")return;if(t.key==="Escape"){t.preventDefault(),m(this,d,j).call(this,!1);return}if(t.key!=="Tab")return;let n=Array.from(a(this,w).querySelectorAll('button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'));if(!n.length)return;let s=n[0],o=n[n.length-1];t.shiftKey&&a(this,g).activeElement===s?(t.preventDefault(),o.focus()):!t.shiftKey&&a(this,g).activeElement===o&&(t.preventDefault(),s.focus())})},j=function(t){if(!a(this,w))return;a(this,w).dataset.open=t?"true":"false",a(this,w).setAttribute("aria-hidden",String(!t));let n=a(this,C).querySelector(".cr-launcher-icon-open"),s=a(this,C).querySelector(".cr-launcher-icon-close");n&&s&&(t?(n.setAttribute("hidden",""),s.removeAttribute("hidden")):(n.removeAttribute("hidden"),s.setAttribute("hidden","")));let o=te(a(this,v));a(this,C).setAttribute("aria-label",t?o.close:o.open),t?(a(this,w).removeAttribute("inert"),a(this,C).setAttribute("aria-expanded","true"),a(this,L).focus()):(a(this,w).setAttribute("inert",""),a(this,C).setAttribute("aria-expanded","false"),a(this,C).focus())},Ce=async function(){let t=a(this,L).value.trim();t&&(a(this,L).value="",await m(this,d,re).call(this,t))},re=async function(t){let n=a(this,v);if(!n||!t.trim()||!B(a(this,u)))return;l(this,W,t.trim());let s=J(a(this,u),a(this,W));l(this,u,s.state),l(this,K,s.assistantMessageId);let o=++le(this,M)._,i=new AbortController;l(this,_,i),m(this,d,q).call(this);try{for await(let c of D(n,{message:a(this,W),threadId:a(this,u).threadId??void 0},void 0,i.signal)){if(o!==a(this,M))return;if(l(this,u,Q(a(this,u),c,s.assistantMessageId)),m(this,d,q).call(this),c.type==="error"||c.type==="unsupported"||c.type==="done")break}}catch{o===a(this,M)&&(l(this,u,{...a(this,u),status:"error",errorMessage:"Something went wrong. Please try again."}),m(this,d,q).call(this))}finally{o===a(this,M)&&l(this,_,null)}},Se=function(){a(this,_)?.abort(),l(this,M,a(this,M)+1),l(this,_,null),l(this,u,{...a(this,u),status:"canceled",errorMessage:te(a(this,v)).canceled}),m(this,d,q).call(this)},q=function(){if(!a(this,v))return;let t=te(a(this,v));a(this,S).replaceChildren();for(let i of a(this,u).messages){let c=document.createElement("div");c.className="cr-message",c.dataset.role=i.role,i.role==="assistant"?(ee(c,i.content),i.sourceRefs?.length&&m(this,d,Ae).call(this,c,i.sourceRefs,t),i.suggestions?.length&&a(this,u).status!=="streaming"&&m(this,d,Re).call(this,c,i.suggestions,t)):c.textContent=i.content,i.role==="assistant"&&a(this,u).status==="streaming"&&i.id===a(this,K)&&(c.dataset.streaming="true"),a(this,S).appendChild(c)}a(this,S).scrollTop=a(this,S).scrollHeight;let n=!!a(this,u).errorMessage;a(this,N).hidden=!n,a(this,N).textContent=a(this,u).errorMessage??"",a(this,U).hidden=!n||!a(this,W);let s="";a(this,u).status==="streaming"?s=a(this,u).transportState==="submitted"?t.submitted:t.working:a(this,u).status==="input-required"&&(s=t.inputRequired),a(this,$).hidden=!s,a(this,$).textContent=s;let o=a(this,u).status==="streaming";a(this,L).disabled=o,a(this,I).disabled=!o&&!B(a(this,u)),a(this,I).textContent="",a(this,I).dataset.state=o?"stop":"send",a(this,I).setAttribute("aria-label",o?t.stop:t.send)},Ae=function(t,n,s){let o=document.createElement("div");o.className="cr-sources",o.setAttribute("aria-label",s.sources);for(let i of n){let c=Z(i.url),f=c?document.createElement("a"):document.createElement("span");f.className="cr-source",f.textContent=i.title??i.sourceRefId,c&&f instanceof HTMLAnchorElement&&(f.href=c,f.target="_blank",f.rel="noopener noreferrer"),o.appendChild(f)}t.appendChild(o)},Re=function(t,n,s){let o=document.createElement("div");o.className="cr-suggestions",o.setAttribute("aria-label",s.suggestions);for(let i of n){let c=document.createElement("button");c.type="button",c.className="cr-suggestion",c.dataset.suggestion=i,c.textContent=i,o.appendChild(c)}t.appendChild(o)};function V(e=customElements){e.get(ce)||e.define(ce,X)}function Je(e=document.currentScript){if(e)return e;let r=document.querySelectorAll('script[src*="embed/widget.js"], script[data-contextrocket-api-key], script[data-contextrocket-handle]');for(let t=r.length-1;t>=0;t-=1){let n=r.item(t);if(n&&H(n))return n}return null}function Y(e=Je()){if(!e)return null;if(!H(e))return console.warn("[ContextRocket] live embed requires data-contextrocket-api-base; omit data-contextrocket-mode for a canned demo"),null;V();let t=document.createElement(ce);for(let n of e.attributes)n.name.startsWith("data-")&&t.setAttribute(n.name,n.value);return document.body.appendChild(t),t}V();typeof document<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>Y()):Y());return _e(Qe);})();
