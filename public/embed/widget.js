var ContextRocketWidget=(()=>{var ae=Object.defineProperty;var qe=Object.getOwnPropertyDescriptor;var Ue=Object.getOwnPropertyNames;var $e=Object.prototype.hasOwnProperty;var pe=e=>{throw TypeError(e)};var ze=(e,r)=>{for(var t in r)ae(e,t,{get:r[t],enumerable:!0})},De=(e,r,t,n)=>{if(r&&typeof r=="object"||typeof r=="function")for(let a of Ue(r))!$e.call(e,a)&&a!==t&&ae(e,a,{get:()=>r[a],enumerable:!(n=qe(r,a))||n.enumerable});return e};var Be=e=>De(ae({},"__esModule",{value:!0}),e);var oe=(e,r,t)=>r.has(e)||pe("Cannot "+t);var s=(e,r,t)=>(oe(e,r,"read from private field"),t?t.call(e):r.get(e)),h=(e,r,t)=>r.has(e)?pe("Cannot add the same private member more than once"):r instanceof WeakSet?r.add(e):r.set(e,t),g=(e,r,t,n)=>(oe(e,r,"write to private field"),n?n.call(e,t):r.set(e,t),t),f=(e,r,t)=>(oe(e,r,"access private method"),t);var ge=(e,r,t,n)=>({set _(a){g(e,r,a,t)},get _(){return s(e,r,n)}});var st={};ze(st,{ContextRocketChatElement:()=>Y,applyTransportEvent:()=>te,beginSend:()=>ee,buildPoweredByHref:()=>V,canSend:()=>K,collectEmbedA2aSubscribe:()=>Ee,createInitialChatState:()=>G,mountFromScriptTag:()=>Q,parseWidgetConfig:()=>H,registerContextRocketChatElement:()=>J,renderMarkdown:()=>ne,resetMessageIdCounter:()=>Ce,streamEmbedA2aSubscribe:()=>j});function ie(e,r=typeof document>"u"?"":document.documentElement.lang){if(e==="en"||e==="es"||e==="de")return e;let t=r.trim().toLowerCase().split(/[-_]/)[0];return t==="es"||t==="de"?t:"en"}var Ne={en:{defaultTitle:"Ask ContextRocket",poweredBy:"Powered by ContextRocket",generic:"Something went wrong. Try again.",demoResponse:"This is a canned ContextRocket demo response. Configure live mode with an organization handle when you are ready to connect your own knowledge base.",open:"Open chat",close:"Close chat",send:"Send",stop:"Stop response",retry:"Try again",placeholder:"Ask a question\u2026",working:"Working\u2026",submitted:"Connecting\u2026",inputRequired:"A response is needed to continue.",canceled:"Response stopped. You can try again.",interrupted:"The connection ended before the answer was complete. Please try again.",unsupported:"This content is not available in this chat. Please try again.",sources:"Sources",suggestions:"Suggested follow-ups"},es:{defaultTitle:"Pregunta a ContextRocket",poweredBy:"Con tecnolog\xEDa de ContextRocket",generic:"Algo sali\xF3 mal. Int\xE9ntalo de nuevo.",demoResponse:"Esta es una respuesta de demostraci\xF3n de ContextRocket. Configura el modo en vivo con el handle de tu organizaci\xF3n para conectar tu propio contenido.",open:"Abrir chat",close:"Cerrar chat",send:"Enviar",stop:"Detener respuesta",retry:"Intentar de nuevo",placeholder:"Haz una pregunta\u2026",working:"Trabajando\u2026",submitted:"Conectando\u2026",inputRequired:"Se necesita una respuesta para continuar.",canceled:"Respuesta detenida. Puedes intentarlo de nuevo.",interrupted:"La conexi\xF3n termin\xF3 antes de completar la respuesta. Int\xE9ntalo de nuevo.",unsupported:"Este contenido no est\xE1 disponible en este chat. Int\xE9ntalo de nuevo.",sources:"Fuentes",suggestions:"Sugerencias"},de:{defaultTitle:"Frag ContextRocket",poweredBy:"Mit ContextRocket",generic:"Etwas ist schiefgelaufen. Versuch es erneut.",demoResponse:"Dies ist eine Demo-Antwort von ContextRocket. Konfiguriere den Live-Modus mit dem Handle deiner Organisation, um deine eigenen Inhalte zu verbinden.",open:"Chat \xF6ffnen",close:"Chat schlie\xDFen",send:"Senden",stop:"Antwort stoppen",retry:"Erneut versuchen",placeholder:"Frage stellen\u2026",working:"Wird bearbeitet\u2026",submitted:"Verbindung wird hergestellt\u2026",inputRequired:"F\xFCr die Fortsetzung ist eine Antwort erforderlich.",canceled:"Antwort gestoppt. Du kannst es erneut versuchen.",interrupted:"Die Verbindung endete vor Abschluss der Antwort. Bitte erneut versuchen.",unsupported:"Dieser Inhalt ist in diesem Chat nicht verf\xFCgbar. Bitte erneut versuchen.",sources:"Quellen",suggestions:"Vorschl\xE4ge"}};function R(e){return Ne[ie(e.locale)]}async function*me(e,r){let t=new TextDecoder,n="",a="message",o=[],c=()=>{e.cancel()};r?.addEventListener("abort",c,{once:!0});try{for(;!r?.aborted;){let{done:i,value:d}=await e.read();if(i)break;n+=t.decode(d,{stream:!0});let E=n.split(`
`);n=E.pop()??"";for(let u of E)u.startsWith("event:")?a=u.slice(6).trim():u.startsWith("data:")?o.push(u.slice(5).trim()):u===""&&o.length>0&&(yield{type:a,data:o.join(`
`)},a="message",o.length=0)}}finally{r?.removeEventListener("abort",c);try{await e.cancel()}finally{e.releaseLock()}}}function Fe(e=fetch){return{request:(r,t)=>e(r,t)}}var he=Fe(),Oe=new Set(["submitted","working","input-required","completed","canceled","failed"]),je="1.0";function be(e){if(typeof e!="string"||!e)return null;let r=e.replace(/^TASK_STATE_/,"").toLowerCase().replace(/_/g,"-");return ce(r)?r:null}var xe=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,A="Something went wrong. Please try again.",Ge="The connection ended before the answer was complete. Please try again.",Ke="This content is not available in this chat. Please try again.";function y(e){return typeof e=="object"&&e!==null}function ce(e){return typeof e=="string"&&Oe.has(e)}function ye(e){return!y(e)||!Array.isArray(e.parts)?[]:e.parts.flatMap(r=>!y(r)||typeof r.text!="string"||!r.text?[]:[r.text])}function we(e){return y(e)?y(e.metadata)?e.metadata:{}:{}}function Ve(...e){for(let r of e){let t=we(r).source_refs;if(!Array.isArray(t))continue;return t.flatMap(a=>!y(a)||typeof a.sourceRefId!="string"?[]:[{sourceRefId:a.sourceRefId.slice(0,200),...typeof a.title=="string"?{title:a.title.slice(0,160)}:{},...typeof a.excerpt=="string"?{excerpt:a.excerpt.slice(0,600)}:{},...typeof a.url=="string"?{url:a.url.slice(0,2e3)}:{}}]).slice(0,8)}}function Xe(...e){for(let r of e){let t=we(r).suggestions;if(Array.isArray(t))return t.filter(n=>typeof n=="string").map(n=>n.trim().slice(0,200)).filter(Boolean).slice(0,5)}}function W(e,r,...t){let n=Ve(...t),a=Xe(...t);return{type:"meta",state:e,terminal:r,...n?{sourceRefs:n}:{},...a?{suggestions:a}:{}}}function Ye(e){let r=y(e.status)?e.status:void 0,t=be(r?.state);if(!ce(t))return[];let n=typeof e.taskId=="string"?e.taskId:void 0,a=[e,r];if(t==="failed"||t==="canceled")return[W(t,!0,...a),{type:"error",message:A,reason:"generic"}];let o=ve(...a);return t==="completed"||t==="input-required"?[W(t,!0,...a),...o,{type:"done",taskId:n}]:[W(t,!1,...a),...o]}function Je(e){let r=y(e.artifact)?e.artifact:void 0,t=ye(r).map(n=>({type:"delta",text:n}));return t.push(W("working",!1,e,r)),t}function Qe(e){let r=e.type;if(r==="TaskArtifactUpdateEvent"){let c=ye(e.artifact).map(i=>({type:"delta",text:i}));return c.push(W("working",!1,e,e.artifact)),c}if(r!=="TaskStatusUpdateEvent")return[{type:"unsupported",message:Ke}];let t=typeof e.id=="string"?e.id:void 0,n=y(e.status)?e.status:void 0,a=be(n?.state);if(!ce(a))return[];if(a==="failed"||a==="canceled")return[W(a,!0,n,e),{type:"error",message:A,reason:"generic"}];let o=ve(n,e);return a==="completed"||a==="input-required"||e.final===!0?[W(a,!0,n,e),...o,{type:"done",taskId:t}]:[W(a,!1,n,e),...o]}function Ze(e){if(!y(e))return[{type:"error",message:A,reason:"generic"}];if(e.error!==void 0&&e.error!==null)return[{type:"error",message:A,reason:"generic"}];let r=e.result;return y(r)?y(r.statusUpdate)?Ye(r.statusUpdate):y(r.artifactUpdate)?Je(r.artifactUpdate):Qe(r):[]}function ve(...e){for(let r of e){if(!y(r))continue;let t=y(r.metadata)?r.metadata:r,n=typeof t.thread_id=="string"&&t.thread_id||typeof t.threadId=="string"&&t.threadId||void 0;if(n&&xe.test(n))return[{type:"session",threadId:n}]}return[]}function et(e){try{return Ze(JSON.parse(e))}catch{return[{type:"error",message:A,reason:"generic"}]}}async function*tt(e,r){if(e)for await(let t of me(e.getReader(),r))for(let n of et(t.data))yield n}async function*rt(e,r,t){let n=r.threadId??"demo-thread";yield{type:"meta",state:"working"};for(let a of R(e).demoResponse.split(/(\s+)/)){if(t?.aborted)return;a&&(yield{type:"delta",text:a}),await new Promise(o=>setTimeout(o,a.trim()?18:4))}t?.aborted||(yield{type:"session",threadId:n},yield{type:"done",taskId:"demo-task"})}var fe=new WeakMap;async function*j(e,r,t=he,n){if(n?.aborted)return;if(e.mode==="demo"){yield*rt(e,r,n);return}let a=r.messageId??fe.get(r)??crypto.randomUUID();r.messageId==null&&fe.set(r,a);let o={messageId:a,role:"ROLE_USER",parts:[{text:r.message}]};r.threadId&&xe.test(r.threadId)&&(o.contextId=r.threadId);let c={};e.handle&&(c.handle=e.handle);let i={jsonrpc:"2.0",id:`embed-chat-${crypto.randomUUID()}`,method:"SendStreamingMessage",params:{message:o,metadata:c}},d=`${e.apiBaseUrl.replace(/\/$/,"")}/api/agent/a2a`,E={"content-type":"application/json",accept:"text/event-stream","a2a-version":je};e.apiKey&&(E["x-api-key"]=e.apiKey);let u;try{u=await t.request(d,{method:"POST",headers:E,body:JSON.stringify(i),signal:n})}catch{if(n?.aborted)return;yield{type:"error",message:A,reason:"generic"};return}if(!u.ok){yield{type:"error",message:A,reason:"generic"};return}if(!(u.headers.get("content-type")??"").includes("text/event-stream")){yield{type:"error",message:A,reason:"generic"};return}let Z=!1;for await(let $ of tt(u.body,n))($.type==="done"||$.type==="error"||$.type==="unsupported"||$.type==="meta"&&$.terminal)&&(Z=!0),yield $;!n?.aborted&&!Z&&(yield{type:"error",message:Ge,reason:"interrupted"})}async function Ee(e,r,t=he,n){let a=[];for await(let o of j(e,r,t,n))a.push(o);return a}function G(e){return{status:"idle",messages:e?[{id:"greeting",role:"assistant",content:e}]:[],errorMessage:null,errorReason:null,threadId:null,transportState:null}}var de=0;function ke(e){return de+=1,`${e}-${de}`}function Ce(){de=0}function ee(e,r){let t=ke("user"),n=ke("assistant");return{assistantMessageId:n,state:{...e,status:"streaming",errorMessage:null,errorReason:null,messages:[...e.messages,{id:t,role:"user",content:r},{id:n,role:"assistant",content:""}]}}}function te(e,r,t){switch(r.type){case"delta":return r.text?{...e,messages:e.messages.map(n=>n.id===t&&n.role==="assistant"?{...n,content:n.content+r.text}:n)}:e;case"session":return{...e,threadId:r.threadId};case"error":return{...e,status:"error",errorMessage:r.message,errorReason:r.reason??"generic"};case"unsupported":return{...e,status:"error",errorMessage:r.message,errorReason:"unsupported"};case"done":return{...e,status:"complete"};case"meta":{let n=r.sourceRefs||r.suggestions?e.messages.map(a=>a.id===t&&a.role==="assistant"?{...a,...r.sourceRefs?{sourceRefs:r.sourceRefs}:{},...r.suggestions?{suggestions:r.suggestions}:{}}:a):e.messages;return{...e,messages:n,transportState:r.state,status:r.terminal&&r.state==="input-required"?"input-required":r.terminal&&r.state==="canceled"?"canceled":e.status}}default:return e}}function K(e){return e.status!=="streaming"}var k="contextrocket",Te=120,Se=400,Re=100;function C(e,...r){for(let t of r){let n=e.getAttribute(t)?.trim();if(n)return n}}function z(e,r){if(!e)return;let t=e.replace(/[\u0000-\u001f\u007f]/g,"").trim();return t?t.slice(0,r):void 0}function We(e){if(e)return/^(#[0-9a-f]{3,8}|rgb(a)?\([^)]{1,80}\)|hsl(a)?\([^)]{1,80}\))$/i.test(e)?e:void 0}function H(e){let r=C(e,`data-${k}-api-key`),t=C(e,`data-${k}-handle`),n=C(e,`data-${k}-api-base`),o=C(e,`data-${k}-mode`)==="live"?"live":"demo";if(o==="live"&&!n)return null;let c=C(e,`data-${k}-accent`),i=C(e,`data-${k}-greeting`),d=C(e,`data-${k}-title`),E=C(e,`data-${k}-ref`),u=C(e,`data-${k}-theme`),b=C(e,`data-${k}-position`),Z=C(e,`data-${k}-locale`);return{...n?{apiBaseUrl:n.replace(/\/$/,"")}:{},mode:o,...r?{apiKey:r}:{},...t?{handle:t}:{},...We(c)?{accentColor:We(c)}:{},...z(i,Se)?{greeting:z(i,Se)}:{},...z(d,Te)?{title:z(d,Te)}:{},...z(E,Re)?{ref:z(E,Re)}:{},...u==="system"||u==="light"||u==="dark"?{theme:u}:{},...b==="bottom-right"||b==="bottom-left"?{position:b}:{},locale:ie(Z,e.ownerDocument.documentElement.lang)}}function V(e){let r="https://www.contextrocket.ai",t=e.ref??e.handle??"widget";return`${r}?ref=${encodeURIComponent(t)}`}function re(e){if(e)try{let r=new URL(e);return r.protocol!=="http:"&&r.protocol!=="https:"?void 0:r.href}catch{return}}function D(e){return e.replace(/[&<>"']/g,r=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[r])}function ne(e,r){let t=r.split(/\r?\n/),n=!1,a=[],o=(c,i)=>{let d=document.createElement("p");i&&(d.className=i),le(d,c),e.appendChild(d)};for(let c of t){if(c.trim().startsWith("```")){if(n){let u=document.createElement("pre"),b=document.createElement("code");b.textContent=a.join(`
`),u.appendChild(b),e.appendChild(u),a=[]}n=!n;continue}if(n){a.push(c);continue}let i=c.match(/^#{1,6}\s+(.+)$/);if(i){let u=document.createElement("p");u.className="cr-markdown-heading";let b=document.createElement("strong");b.textContent=i[1],u.appendChild(b),e.appendChild(u);continue}let d=c.match(/^\s*[-*+]\s+(.+)$/);if(d){let u=document.createElement("ul"),b=document.createElement("li");le(b,d[1]),u.appendChild(b),e.appendChild(u);continue}let E=c.match(/^\s*\d+[.)]\s+(.+)$/);if(E){let u=document.createElement("ol"),b=document.createElement("li");le(b,E[1]),u.appendChild(b),e.appendChild(u);continue}c.trim()&&o(c)}if(n&&a.length>0){let c=document.createElement("pre"),i=document.createElement("code");i.textContent=a.join(`
`),c.appendChild(i),e.appendChild(c)}}function le(e,r){let t=/(\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|__([^_]+)__|`([^`]+)`|\*([^*]+)\*|_([^_]+)_)/g,n=0;for(let a of r.matchAll(t)){let o=a.index??0;if(o>n&&e.appendChild(document.createTextNode(r.slice(n,o))),a[2]&&a[3]){let c=re(a[3]);if(c){let i=document.createElement("a");i.href=c,i.target="_blank",i.rel="noopener noreferrer",i.textContent=a[2],e.appendChild(i)}else e.appendChild(document.createTextNode(a[2]))}else if(a[4]||a[5]||a[7]||a[8]){let c=document.createElement(a[4]||a[5]?"strong":"em");c.textContent=a[4]||a[5]||a[7]||a[8]||"",e.appendChild(c)}else if(a[6]){let c=document.createElement("code");c.textContent=a[6],e.appendChild(c)}n=o+a[0].length}n<r.length&&e.appendChild(document.createTextNode(r.slice(n)))}function Ae(e="#ff2b67"){return`
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

/* Rounded icon button with a 44px minimum touch target. */
.cr-close {
  border: none;
  background: transparent;
  color: var(--cr-muted);
  cursor: pointer;
  font-size: 1.125rem; /* text-lg */
  line-height: 1;
  width: 2rem;
  height: 2rem;
  min-width: 2.75rem;
  min-height: 2.75rem;
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
  min-height: 2.75rem;
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
  min-height: 2.75rem;
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

.cr-input:focus-visible {
  outline: 2px solid var(--cr-accent);
  outline-offset: 2px;
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
  min-height: 2.75rem;
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
`.trim()}var ue="contextrocket-chat",w,p,m,M,B,I,N,_,v,x,S,T,L,F,O,q,U,l,Me,Ie,X,Le,se,He,P,Pe,_e,Y=class extends HTMLElement{constructor(){super();h(this,l);h(this,w,null);h(this,p,G());h(this,m);h(this,M,0);h(this,B,null);h(this,I,"");h(this,N);h(this,_,null);h(this,v);h(this,x);h(this,S);h(this,T);h(this,L);h(this,F);h(this,O);h(this,q);h(this,U);g(this,m,this.attachShadow({mode:"open"}))}static get observedAttributes(){return["data-contextrocket-api-key","data-contextrocket-handle","data-contextrocket-mode","data-contextrocket-api-base","data-contextrocket-accent","data-contextrocket-greeting","data-contextrocket-title","data-contextrocket-ref","data-contextrocket-theme","data-contextrocket-position","data-contextrocket-locale"]}connectedCallback(){g(this,w,H(this)),s(this,w)&&(this.lang=s(this,w).locale,g(this,p,G(s(this,w).greeting)),f(this,l,Me).call(this),f(this,l,Ie).call(this),f(this,l,P).call(this),f(this,l,X).call(this,!1))}attributeChangedCallback(){if(!this.isConnected)return;let t=H(this);if(!t||(g(this,w,t),this.lang=t.locale,!s(this,U)))return;let n=R(t),a=s(this,m).querySelector(".cr-root");a.lang=this.lang,s(this,m).querySelector(".cr-title").textContent=t.title??n.defaultTitle,s(this,x).setAttribute("aria-label",t.title??n.defaultTitle),s(this,m).querySelector(".cr-close").setAttribute("aria-label",n.close),s(this,v).setAttribute("aria-label",s(this,x).dataset.open==="true"?n.close:n.open),s(this,T).placeholder=n.placeholder,s(this,T).setAttribute("aria-label",n.placeholder),s(this,q).textContent=n.retry,s(this,U).querySelector("span").textContent=n.poweredBy,f(this,l,P).call(this),s(this,U).href=V(t),this.style.setProperty("--cr-accent",t.accentColor??"#ff2b67"),this.dataset.theme=t.theme??"system",s(this,m).querySelector(".cr-root")?.setAttribute("data-position",t.position??"bottom-right")}};w=new WeakMap,p=new WeakMap,m=new WeakMap,M=new WeakMap,B=new WeakMap,I=new WeakMap,N=new WeakMap,_=new WeakMap,v=new WeakMap,x=new WeakMap,S=new WeakMap,T=new WeakMap,L=new WeakMap,F=new WeakMap,O=new WeakMap,q=new WeakMap,U=new WeakMap,l=new WeakSet,Me=function(){let t=s(this,w),n=R(t),a=document.createElement("style");a.textContent=Ae(t.accentColor);let o=document.createElement("div");o.className="cr-root",o.lang=this.lang,o.dataset.position=t.position??"bottom-right",o.innerHTML=`
      <div class="cr-panel" data-open="false" data-position="${D(t.position??"bottom-right")}" part="panel" role="dialog" aria-modal="true" aria-hidden="true" aria-label="${D(t.title??n.defaultTitle)}" inert>
        <header class="cr-header">
          <h2 class="cr-title">${D(t.title??n.defaultTitle)}</h2>
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
          <a class="powered-by-badge" href="${D(V(t))}" target="_blank" rel="noopener noreferrer">
            <img src="/brand/cr-icon-red.svg" alt="" width="14" height="14" aria-hidden="true">
            <span>${D(n.poweredBy)}</span>
          </a>
        </footer>
      </div>
      <button type="button" class="cr-launcher" aria-label="${n.open}" aria-expanded="false" aria-controls="contextrocket-chat-panel" part="launcher">
        <svg class="cr-launcher-icon-open" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
        <svg class="cr-launcher-icon-close" hidden xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
    `,s(this,m).replaceChildren(a,o),g(this,x,s(this,m).querySelector(".cr-panel")),s(this,x).id="contextrocket-chat-panel",g(this,v,s(this,m).querySelector(".cr-launcher")),g(this,S,s(this,m).querySelector(".cr-messages")),g(this,T,s(this,m).querySelector(".cr-input")),g(this,L,s(this,m).querySelector(".cr-send")),g(this,F,s(this,m).querySelector(".cr-error")),g(this,O,s(this,m).querySelector(".cr-status")),g(this,q,s(this,m).querySelector(".cr-retry")),g(this,U,s(this,m).querySelector(".cr-footer a")),this.dataset.theme=t.theme??"system"},Ie=function(){s(this,v).addEventListener("click",()=>{let t=s(this,x).dataset.open==="true";f(this,l,X).call(this,!t)}),s(this,m).querySelector(".cr-close")?.addEventListener("click",()=>f(this,l,X).call(this,!1)),s(this,q).addEventListener("click",()=>void f(this,l,se).call(this,s(this,I),s(this,N))),s(this,S).addEventListener("click",t=>{let a=t.target.closest("[data-suggestion]");a?.dataset.suggestion&&f(this,l,se).call(this,a.dataset.suggestion)}),s(this,m).querySelector(".cr-composer")?.addEventListener("submit",t=>{t.preventDefault(),s(this,p).status==="streaming"?f(this,l,He).call(this):f(this,l,Le).call(this)}),s(this,m).addEventListener("keydown",t=>{if(!(t instanceof KeyboardEvent)||!s(this,x)||s(this,x).dataset.open!=="true")return;if(t.key==="Escape"){t.preventDefault(),f(this,l,X).call(this,!1);return}if(t.key!=="Tab")return;let n=Array.from(s(this,x).querySelectorAll('button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'));if(!n.length)return;let a=n[0],o=n[n.length-1];t.shiftKey&&s(this,m).activeElement===a?(t.preventDefault(),o.focus()):!t.shiftKey&&s(this,m).activeElement===o&&(t.preventDefault(),a.focus())})},X=function(t){if(!s(this,x))return;s(this,x).dataset.open=t?"true":"false",s(this,x).setAttribute("aria-hidden",String(!t));let n=s(this,v).querySelector(".cr-launcher-icon-open"),a=s(this,v).querySelector(".cr-launcher-icon-close");n&&a&&(t?(n.setAttribute("hidden",""),a.removeAttribute("hidden")):(n.removeAttribute("hidden"),a.setAttribute("hidden","")));let o=R(s(this,w));s(this,v).setAttribute("aria-label",t?o.close:o.open),t?(s(this,x).removeAttribute("inert"),s(this,v).setAttribute("aria-expanded","true"),s(this,T).focus()):(s(this,x).setAttribute("inert",""),s(this,v).setAttribute("aria-expanded","false"),s(this,v).focus())},Le=async function(){let t=s(this,T).value.trim();t&&(s(this,T).value="",await f(this,l,se).call(this,t))},se=async function(t,n){let a=s(this,w);if(!a||!t.trim()||!K(s(this,p)))return;g(this,I,t.trim()),g(this,N,n??crypto.randomUUID());let o=ee(s(this,p),s(this,I));g(this,p,o.state),g(this,B,o.assistantMessageId);let c=++ge(this,M)._,i=new AbortController;g(this,_,i),f(this,l,P).call(this);try{for await(let d of j(a,{message:s(this,I),messageId:s(this,N),threadId:s(this,p).threadId??void 0},void 0,i.signal)){if(c!==s(this,M))return;if(g(this,p,te(s(this,p),d,o.assistantMessageId)),f(this,l,P).call(this),d.type==="error"||d.type==="unsupported"||d.type==="done")break}}catch{c===s(this,M)&&(g(this,p,{...s(this,p),status:"error",errorMessage:null,errorReason:"generic"}),f(this,l,P).call(this))}finally{c===s(this,M)&&g(this,_,null)}},He=function(){s(this,_)?.abort(),g(this,M,s(this,M)+1),g(this,_,null),g(this,p,{...s(this,p),status:"canceled",errorMessage:R(s(this,w)).canceled,errorReason:null}),f(this,l,P).call(this)},P=function(){if(!s(this,w))return;let t=R(s(this,w));s(this,S).replaceChildren();for(let i of s(this,p).messages){if(i.role==="assistant"&&!i.content.trim()&&!i.sourceRefs?.length&&!i.suggestions?.length&&!(s(this,p).status==="streaming"&&i.id===s(this,B)))continue;let d=document.createElement("div");d.className="cr-message",d.dataset.role=i.role,i.role==="assistant"?(ne(d,i.content),i.sourceRefs?.length&&f(this,l,Pe).call(this,d,i.sourceRefs,t),i.suggestions?.length&&s(this,p).status!=="streaming"&&f(this,l,_e).call(this,d,i.suggestions,t)):d.textContent=i.content,i.role==="assistant"&&s(this,p).status==="streaming"&&i.id===s(this,B)&&(d.dataset.streaming="true"),s(this,S).appendChild(d)}s(this,S).scrollTop=s(this,S).scrollHeight;let n=s(this,p).status==="error"?s(this,p).errorReason==="interrupted"?t.interrupted:s(this,p).errorReason==="unsupported"?t.unsupported:t.generic:s(this,p).status==="canceled"?t.canceled:"",a=!!n;s(this,F).hidden=!a,s(this,F).textContent=n,s(this,q).hidden=!a||!s(this,I);let o="";s(this,p).status==="streaming"?o=s(this,p).transportState==="submitted"?t.submitted:t.working:s(this,p).status==="input-required"&&(o=t.inputRequired),s(this,O).hidden=!o,s(this,O).textContent=o;let c=s(this,p).status==="streaming";s(this,T).disabled=c,s(this,L).disabled=!c&&!K(s(this,p)),s(this,L).textContent="",s(this,L).dataset.state=c?"stop":"send",s(this,L).setAttribute("aria-label",c?t.stop:t.send)},Pe=function(t,n,a){let o=document.createElement("div");o.className="cr-sources",o.setAttribute("aria-label",a.sources);for(let c of n){let i=re(c.url),d=i?document.createElement("a"):document.createElement("span");d.className="cr-source",d.textContent=c.title??c.sourceRefId,i&&d instanceof HTMLAnchorElement&&(d.href=i,d.target="_blank",d.rel="noopener noreferrer"),o.appendChild(d)}t.appendChild(o)},_e=function(t,n,a){let o=document.createElement("div");o.className="cr-suggestions",o.setAttribute("aria-label",a.suggestions);for(let c of n){let i=document.createElement("button");i.type="button",i.className="cr-suggestion",i.dataset.suggestion=c,i.textContent=c,o.appendChild(i)}t.appendChild(o)};function J(e=customElements){e.get(ue)||e.define(ue,Y)}function nt(e=document.currentScript){if(e)return e;let r=document.querySelectorAll('script[src*="embed/widget.js"], script[data-contextrocket-api-key], script[data-contextrocket-handle]');for(let t=r.length-1;t>=0;t-=1){let n=r.item(t);if(n&&H(n))return n}return null}function Q(e=nt()){if(!e)return null;if(!H(e))return console.warn("[ContextRocket] live embed requires data-contextrocket-api-base; omit data-contextrocket-mode for a canned demo"),null;J();let t=document.createElement(ue);for(let n of e.attributes)n.name.startsWith("data-")&&t.setAttribute(n.name,n.value);return document.body.appendChild(t),t}J();typeof document<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>Q()):Q());return Be(st);})();
