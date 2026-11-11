"use strict";var ContextRocketWidget=(()=>{var T0=Object.defineProperty;var he=Object.getOwnPropertyDescriptor;var Ce=Object.getOwnPropertyNames;var fe=Object.prototype.hasOwnProperty;var H0=e=>{throw TypeError(e)};var be=(e,r)=>{for(var t in r)T0(e,t,{get:r[t],enumerable:!0})},ye=(e,r,t,s)=>{if(r&&typeof r=="object"||typeof r=="function")for(let o of Ce(r))!fe.call(e,o)&&o!==t&&T0(e,o,{get:()=>r[o],enumerable:!(s=he(r,o))||s.enumerable});return e};var we=e=>ye(T0({},"__esModule",{value:!0}),e);var M0=(e,r,t)=>r.has(e)||H0("Cannot "+t);var n=(e,r,t)=>(M0(e,r,"read from private field"),t?t.call(e):r.get(e)),f=(e,r,t)=>r.has(e)?H0("Cannot add the same private member more than once"):r instanceof WeakSet?r.add(e):r.set(e,t),h=(e,r,t,s)=>(M0(e,r,"write to private field"),s?s.call(e,t):r.set(e,t),t),m=(e,r,t)=>(M0(e,r,"access private method"),t);var A0=(e,r,t,s)=>({set _(o){h(e,r,o,t)},get _(){return n(e,r,s)}});var Xe={};be(Xe,{ContextRocketChatElement:()=>u0,applyTransportEvent:()=>y0,beginSend:()=>b0,buildPoweredByHref:()=>o0,canSend:()=>c0,collectEmbedA2aSubscribe:()=>Y0,createInitialChatState:()=>i0,mountFromScriptTag:()=>m0,parseWidgetConfig:()=>N,registerContextRocketChatElement:()=>g0,renderMarkdown:()=>v0,resetMessageIdCounter:()=>ee,streamEmbedA2aSubscribe:()=>a0});function R0(e,r=typeof document>"u"?"":document.documentElement.lang){if(e==="en"||e==="es"||e==="de"||e==="zh")return e;let t=r.trim().toLowerCase().split(/[-_]/)[0];return t==="es"||t==="de"||t==="zh"?t:"en"}var ve={en:{defaultTitle:"Ask ContextRocket",poweredBy:"Powered by ContextRocket",poweredByLabel:"Powered by",generic:"Something went wrong. Try again.",demoResponse:"This preview uses sample content to show the structured response cards this chat can render. Configure live mode to connect an organization\u2019s agent.",demoProgress:"Preview only \xB7 reviewing sample sources",demoEvidenceTitle:"Example source",demoEvidenceExcerpt:"Sample evidence demonstrates how an answer can cite its source.",demoEvidenceTitleTwo:"A second source",demoEvidenceExcerptTwo:"Each card uses a typed JSON Render component.",demoQuestion:"Which topic would you like to explore next?",demoProposal:"A sample proposal shows how an idea can be summarized.",demoProposalTwo:"Related proposals can be grouped together.",open:"Open chat",close:"Close chat",expand:"Expand chat",collapse:"Exit full screen",send:"Send",stop:"Stop response",retry:"Try again",placeholder:"Ask a question\u2026",working:"Thinking\u2026",submitted:"Connecting\u2026",inputRequired:"A response is needed to continue.",canceled:"Response stopped. You can try again.",interrupted:"The connection ended before the answer was complete. Please try again.",unsupported:"This content is not available in this chat. Please try again.",sources:"Sources",suggestions:"Suggested follow-ups",unavailable:"This response card is unavailable.",evidence:"Evidence",question:"Question",proposals:"Proposals",representation:"Representation",emptyTitle:"Start a conversation",emptyDescription:"Ask a question to explore what I can help you find.",suggestionPrompts:"Suggestions",suggestionCards:"Response cards",suggestionGroup:"Opening suggestions",defaultSuggestions:["What can you help me find?","How do your answers use sources?","What can I ask about?"],componentSuggestions:[{label:"Preview all response cards"},{component:"Evidence",label:"Show an evidence card"},{component:"Progress",label:"Show a progress card"},{component:"Question",label:"Preview a question card"},{component:"ProposalBatch",label:"Show a proposal card"},{component:"Representation",label:"Show a representation card"}]},es:{defaultTitle:"Pregunta a ContextRocket",poweredBy:"Con tecnolog\xEDa de ContextRocket",poweredByLabel:"Con tecnolog\xEDa de",generic:"Algo sali\xF3 mal. Int\xE9ntalo de nuevo.",demoResponse:"Esta vista previa usa contenido de ejemplo para mostrar las tarjetas estructuradas del chat. Configura el modo en vivo para conectar el agente de una organizaci\xF3n.",demoProgress:"Vista previa \xB7 revisando fuentes de ejemplo",demoEvidenceTitle:"Fuente de ejemplo",demoEvidenceExcerpt:"La evidencia de ejemplo muestra c\xF3mo una respuesta puede citar su fuente.",demoEvidenceTitleTwo:"Otra fuente",demoEvidenceExcerptTwo:"Cada tarjeta utiliza un componente JSON Render tipado.",demoQuestion:"\xBFQu\xE9 tema te gustar\xEDa explorar ahora?",demoProposal:"Una propuesta de ejemplo muestra c\xF3mo resumir una idea.",demoProposalTwo:"Las propuestas relacionadas se pueden agrupar.",open:"Abrir chat",close:"Cerrar chat",expand:"Expandir chat",collapse:"Salir de pantalla completa",send:"Enviar",stop:"Detener respuesta",retry:"Intentar de nuevo",placeholder:"Haz una pregunta\u2026",working:"Pensando\u2026",submitted:"Conectando\u2026",inputRequired:"Se necesita una respuesta para continuar.",canceled:"Respuesta detenida. Puedes intentarlo de nuevo.",interrupted:"La conexi\xF3n termin\xF3 antes de completar la respuesta. Int\xE9ntalo de nuevo.",unsupported:"Este contenido no est\xE1 disponible en este chat. Int\xE9ntalo de nuevo.",sources:"Fuentes",suggestions:"Sugerencias",unavailable:"Esta tarjeta de respuesta no est\xE1 disponible.",evidence:"Evidencias",question:"Pregunta",proposals:"Propuestas",representation:"Representaci\xF3n",emptyTitle:"Inicia una conversaci\xF3n",emptyDescription:"Haz una pregunta para descubrir qu\xE9 puedo ayudarte a encontrar.",suggestionPrompts:"Sugerencias",suggestionCards:"Tarjetas de respuesta",suggestionGroup:"Sugerencias iniciales",defaultSuggestions:["\xBFQu\xE9 puedes ayudarme a encontrar?","\xBFC\xF3mo usas fuentes en tus respuestas?","\xBFSobre qu\xE9 puedo preguntar?"],componentSuggestions:[{label:"Ver todas las tarjetas de respuesta"},{component:"Evidence",label:"Mu\xE9strame una tarjeta de evidencia"},{component:"Progress",label:"Mu\xE9strame una tarjeta de progreso"},{component:"Question",label:"Ver una tarjeta de pregunta"},{component:"ProposalBatch",label:"Mu\xE9strame una tarjeta de propuesta"},{component:"Representation",label:"Mu\xE9strame una tarjeta de representaci\xF3n"}]},de:{defaultTitle:"Frag ContextRocket",poweredBy:"Mit ContextRocket",poweredByLabel:"Mit",generic:"Etwas ist schiefgelaufen. Versuch es erneut.",demoResponse:"Diese Vorschau verwendet Beispieldaten f\xFCr die strukturierten Antwortkarten. Richte den Live-Modus ein, um den Agenten einer Organisation zu verbinden.",demoProgress:"Vorschau \xB7 Beispielquellen werden gepr\xFCft",demoEvidenceTitle:"Beispielquelle",demoEvidenceExcerpt:"Beispielbelege zeigen, wie eine Antwort ihre Quelle zitieren kann.",demoEvidenceTitleTwo:"Eine weitere Quelle",demoEvidenceExcerptTwo:"Jede Karte verwendet eine typisierte JSON-Render-Komponente.",demoQuestion:"Welches Thema m\xF6chtest du als N\xE4chstes erkunden?",demoProposal:"Ein Beispielvorschlag zeigt, wie sich eine Idee zusammenfassen l\xE4sst.",demoProposalTwo:"Verwandte Vorschl\xE4ge lassen sich gruppieren.",open:"Chat \xF6ffnen",close:"Chat schlie\xDFen",expand:"Chat maximieren",collapse:"Vollbild verlassen",send:"Senden",stop:"Antwort stoppen",retry:"Erneut versuchen",placeholder:"Frage stellen\u2026",working:"Denkt nach\u2026",submitted:"Verbindung wird hergestellt\u2026",inputRequired:"F\xFCr die Fortsetzung ist eine Antwort erforderlich.",canceled:"Antwort gestoppt. Du kannst es erneut versuchen.",interrupted:"Die Verbindung endete vor Abschluss der Antwort. Bitte erneut versuchen.",unsupported:"Dieser Inhalt ist in diesem Chat nicht verf\xFCgbar. Bitte erneut versuchen.",sources:"Quellen",suggestions:"Vorschl\xE4ge",unavailable:"Diese Antwortkarte ist nicht verf\xFCgbar.",evidence:"Belege",question:"Frage",proposals:"Vorschl\xE4ge",representation:"Darstellung",emptyTitle:"Gespr\xE4ch beginnen",emptyDescription:"Stelle eine Frage und entdecke, wobei ich dir helfen kann.",suggestionPrompts:"Vorschl\xE4ge",suggestionCards:"Antwortkarten",suggestionGroup:"Einstiegsvorschl\xE4ge",defaultSuggestions:["Wobei kannst du mir helfen?","Wie belegst du deine Antworten?","Was kann ich fragen?"],componentSuggestions:[{label:"Alle Antwortkarten ansehen"},{component:"Evidence",label:"Zeig mir eine Quellenkarte"},{component:"Progress",label:"Zeig mir eine Fortschrittskarte"},{component:"Question",label:"Eine Fragekarte ansehen"},{component:"ProposalBatch",label:"Zeig mir eine Vorschlagskarte"},{component:"Representation",label:"Zeig mir eine Repr\xE4sentationskarte"}]},zh:{defaultTitle:"\u8BE2\u95EE ContextRocket",poweredBy:"\u7531 ContextRocket \u63D0\u4F9B\u652F\u6301",poweredByLabel:"\u7531\u4EE5\u4E0B\u63D0\u4F9B\u652F\u6301",generic:"\u51FA\u4E86\u70B9\u95EE\u9898\uFF0C\u8BF7\u91CD\u8BD5\u3002",demoResponse:"\u6B64\u9884\u89C8\u4F7F\u7528\u793A\u4F8B\u5185\u5BB9\u5C55\u793A\u804A\u5929\u53EF\u5448\u73B0\u7684\u7ED3\u6784\u5316\u56DE\u590D\u5361\u7247\u3002\u914D\u7F6E\u5B9E\u65F6\u6A21\u5F0F\u5373\u53EF\u8FDE\u63A5\u7EC4\u7EC7\u4EE3\u7406\u3002",demoProgress:"\u9884\u89C8 \xB7 \u6B63\u5728\u68C0\u67E5\u793A\u4F8B\u6765\u6E90",demoEvidenceTitle:"\u793A\u4F8B\u6765\u6E90",demoEvidenceExcerpt:"\u793A\u4F8B\u8BC1\u636E\u5C55\u793A\u4E86\u56DE\u590D\u5982\u4F55\u5F15\u7528\u6765\u6E90\u3002",demoEvidenceTitleTwo:"\u53E6\u4E00\u4E2A\u6765\u6E90",demoEvidenceExcerptTwo:"\u6BCF\u5F20\u5361\u7247\u90FD\u4F7F\u7528\u7C7B\u578B\u5316\u7684 JSON Render \u7EC4\u4EF6\u3002",demoQuestion:"\u63A5\u4E0B\u6765\u60F3\u4E86\u89E3\u54EA\u4E2A\u4E3B\u9898\uFF1F",demoProposal:"\u793A\u4F8B\u65B9\u6848\u5C55\u793A\u4E86\u5982\u4F55\u603B\u7ED3\u4E00\u4E2A\u60F3\u6CD5\u3002",demoProposalTwo:"\u76F8\u5173\u65B9\u6848\u53EF\u4EE5\u7EC4\u5408\u5C55\u793A\u3002",open:"\u6253\u5F00\u804A\u5929",close:"\u5173\u95ED\u804A\u5929",expand:"\u5C55\u5F00\u804A\u5929",collapse:"\u9000\u51FA\u5168\u5C4F",send:"\u53D1\u9001",stop:"\u505C\u6B62\u56DE\u590D",retry:"\u91CD\u8BD5",placeholder:"\u8BF7\u8F93\u5165\u95EE\u9898\u2026",working:"\u6B63\u5728\u601D\u8003\u2026",submitted:"\u6B63\u5728\u8FDE\u63A5\u2026",inputRequired:"\u8BF7\u586B\u5199\u56DE\u590D\u540E\u7EE7\u7EED\u3002",canceled:"\u56DE\u590D\u5DF2\u505C\u6B62\uFF0C\u60A8\u53EF\u4EE5\u91CD\u8BD5\u3002",interrupted:"\u8FDE\u63A5\u5728\u56DE\u590D\u5B8C\u6210\u524D\u4E2D\u65AD\uFF0C\u8BF7\u91CD\u8BD5\u3002",unsupported:"\u6B64\u804A\u5929\u6682\u4E0D\u652F\u6301\u8BE5\u5185\u5BB9\uFF0C\u8BF7\u91CD\u8BD5\u3002",sources:"\u6765\u6E90",suggestions:"\u540E\u7EED\u5EFA\u8BAE",unavailable:"\u6B64\u56DE\u590D\u5361\u7247\u6682\u4E0D\u53EF\u7528\u3002",evidence:"\u4F9D\u636E",question:"\u95EE\u9898",proposals:"\u65B9\u6848",representation:"\u8868\u793A\u65B9\u5F0F",emptyTitle:"\u5F00\u59CB\u5BF9\u8BDD",emptyDescription:"\u63D0\u51FA\u95EE\u9898\uFF0C\u770B\u770B\u6211\u80FD\u4E3A\u60A8\u67E5\u627E\u4EC0\u4E48\u3002",suggestionPrompts:"\u5EFA\u8BAE",suggestionCards:"\u56DE\u590D\u5361\u7247",suggestionGroup:"\u5F00\u573A\u5EFA\u8BAE",defaultSuggestions:["\u60A8\u80FD\u5E2E\u6211\u67E5\u627E\u4EC0\u4E48\uFF1F","\u60A8\u7684\u56DE\u7B54\u5982\u4F55\u5F15\u7528\u6765\u6E90\uFF1F","\u6211\u53EF\u4EE5\u8BE2\u95EE\u54EA\u4E9B\u5185\u5BB9\uFF1F"],componentSuggestions:[{label:"\u9884\u89C8\u6240\u6709\u56DE\u590D\u5361\u7247"},{component:"Evidence",label:"\u663E\u793A\u8BC1\u636E\u5361\u7247"},{component:"Progress",label:"\u663E\u793A\u8FDB\u5EA6\u5361\u7247"},{component:"Question",label:"\u9884\u89C8\u95EE\u9898\u5361\u7247"},{component:"ProposalBatch",label:"\u663E\u793A\u65B9\u6848\u5361\u7247"},{component:"Representation",label:"\u663E\u793A\u8868\u793A\u5361\u7247"}]}};function W(e){return ve[R0(e.locale)]}var xe="contextrocket.agent.response.v2",Le=/^[A-Za-z0-9][A-Za-z0-9_.:-]{0,179}$/,Ee=new Set(["__proto__","prototype","constructor"]),R=e=>typeof e=="object"&&e!==null&&!Array.isArray(e),j=e=>typeof e=="string"&&Le.test(e)&&!Ee.has(e),s0=(e,r,t=!1)=>typeof e=="string"&&e.length<=r&&(t||!!e.trim());function ke(e,r){if(!R(r))return!1;let t=Object.keys(r).sort().join(",");return e==="Evidence"?t==="refs"&&Array.isArray(r.refs)&&r.refs.length>0&&r.refs.length<=20&&r.refs.every(s=>R(s)&&Object.keys(s).every(o=>o==="title"||o==="excerpt")&&s0(s.title,160)&&(s.excerpt===void 0||s0(s.excerpt,500,!0))):e==="Progress"?t==="completed,stage,total"&&s0(r.stage,240)&&(r.completed===null&&r.total===null||Number.isInteger(r.completed)&&Number.isInteger(r.total)&&r.completed>=0&&r.total>0&&r.completed<=r.total):e==="Question"?["id,interactionId,question,questionId","id,inputRef,interactionId,question,questionId"].includes(t)&&j(r.id)&&j(r.interactionId)&&j(r.questionId)&&s0(r.question,1e3)&&(r.inputRef===void 0||R(r.inputRef)):e==="ProposalBatch"?t==="views"&&Array.isArray(r.views)&&r.views.length>0&&r.views.length<=10&&r.views.every(s=>R(s)&&Object.keys(s).sort().join(",")==="id,summary,workItemId"&&j(s.id)&&j(s.workItemId)&&s0(s.summary,280,!0))&&new Set(r.views.map(s=>s.id)).size===r.views.length:e==="Representation"?t==="id,organizationId,representationId"&&j(r.id)&&j(r.organizationId)&&j(r.representationId):!1}function W0(e){if(!R(e)||!R(e.metadata)||!Object.prototype.hasOwnProperty.call(e,"data")||Object.prototype.hasOwnProperty.call(e,"kind"))return;let r=["text","url","raw","data"].filter(u=>Object.prototype.hasOwnProperty.call(e,u));if(r.length!==1||r[0]!=="data"||e.metadata["cr.catalog"]!==xe||e.metadata["cr.component"]!=="agent_ui")return;let t=e.data;if(!R(t)||Object.keys(t).sort().join(",")!=="component,spec"||t.component!=="agent_ui")return null;try{if(new TextEncoder().encode(JSON.stringify(t)).length>65536)return null}catch{return null}let s=t.spec;if(!R(s)||Object.keys(s).sort().join(",")!=="elements,root"||s.root!=="response"||!R(s.elements))return null;let o=s.elements,a=Object.keys(o);if(a.length<2||a.length>33||!a.every(j))return null;let i=o.response;if(!R(i)||Object.keys(i).sort().join(",")!=="children,props,type"||i.type!=="Response"||!R(i.props)||Object.keys(i.props).length!==0||!Array.isArray(i.children))return null;let c=[];for(let u of i.children){if(!j(u))return null;c.push(u)}if(new Set(c).size!==c.length||c.length!==a.length-1||c.some(u=>!Object.prototype.hasOwnProperty.call(o,u))||a.some(u=>u!=="response"&&!c.includes(u)))return null;for(let u of c){let g=o[u];if(!R(g)||Object.keys(g).sort().join(",")!=="children,props,type"||!Array.isArray(g.children)||g.children.length!==0||typeof g.type!="string"||!ke(g.type,g.props))return null}return s}async function*D0(e,r){let t=new TextDecoder,s="",o="message",a=[],i=()=>{e.cancel()};r?.addEventListener("abort",i,{once:!0});try{for(;!r?.aborted;){let{done:c,value:u}=await e.read();if(c)break;s+=t.decode(u,{stream:!0});let g=s.split(`
`);s=g.pop()??"";for(let p of g)p.startsWith("event:")?o=p.slice(6).trim():p.startsWith("data:")?a.push(p.slice(5).trim()):p===""&&a.length>0&&(yield{type:o,data:a.join(`
`)},o="message",a.length=0)}}finally{r?.removeEventListener("abort",i);try{await e.cancel()}finally{e.releaseLock()}}}var x="contextrocket",$0=120,z0=400,_0=100;function E(e,...r){for(let t of r){let s=e.getAttribute(t)?.trim();if(s)return s}}function I0(e,r){return["true","1","yes"].includes(e.getAttribute(r)?.trim().toLowerCase()??"")}function X(e,r){if(!e)return;let t=e.replace(/[\u0000-\u001f\u007f]/g,"").trim();return t?t.slice(0,r):void 0}function C0(e){if(e)return/^(#[0-9a-f]{3,8}|rgb(a)?\([^)]{1,80}\)|hsl(a)?\([^)]{1,80}\))$/i.test(e)?e:void 0}function N(e){let r=E(e,`data-${x}-api-key`),t=E(e,`data-${x}-handle`),o=E(e,`data-${x}-subject-kind`)==="person"?"person":"company",a=E(e,`data-${x}-api-base`),c=E(e,`data-${x}-mode`)==="live"?"live":"demo";if(c==="live"&&!a)return null;let u=E(e,`data-${x}-accent`),g=E(e,`data-${x}-greeting`),p=E(e,`data-${x}-title`),d=E(e,`data-${x}-ref`),b=E(e,`data-${x}-position`),w=E(e,`data-${x}-locale`),q=E(e,`data-${x}-powered-by-logo`),q0=E(e,`data-${x}-suggestions`),k0;if(q0)try{let h0=JSON.parse(q0);if(Array.isArray(h0)){let n0=h0.filter(S0=>typeof S0=="string").map(S0=>S0.trim().slice(0,200)).filter(Boolean).slice(0,5);n0.length&&(k0=n0)}}catch{}let me={backgroundColor:E(e,`data-${x}-background`),foregroundColor:E(e,`data-${x}-foreground`),surfaceColor:E(e,`data-${x}-surface`),mutedColor:E(e,`data-${x}-muted`),borderColor:E(e,`data-${x}-border`)};return{...a?{apiBaseUrl:a.replace(/\/$/,"")}:{},mode:c,...r?{apiKey:r}:{},...t?{handle:t}:{},subjectKind:o,...C0(u)?{accentColor:C0(u)}:{},...X(g,z0)?{greeting:X(g,z0)}:{},...X(p,$0)?{title:X(p,$0)}:{},...X(d,_0)?{ref:X(d,_0)}:{},...Object.fromEntries(Object.entries(me).flatMap(([h0,n0])=>C0(n0)?[[h0,C0(n0)]]:[])),...q==="ink"||q==="white"?{poweredByLogo:q}:{},...k0?{suggestions:k0}:{},...b==="bottom-right"||b==="bottom-left"?{position:b}:{},...I0(e,`data-${x}-fullscreen`)?{fullscreen:!0}:{},...I0(e,`data-${x}-fullscreen-on-open`)?{fullscreenOnOpen:!0}:{},...I0(e,`data-${x}-fullscreen-on-load`)?{fullscreenOnLoad:!0}:{},locale:R0(w,e.ownerDocument.documentElement.lang)}}function N0(e){if(!e.apiBaseUrl)return null;let r=e.apiBaseUrl.replace(/\/$/,"");if(!e.handle)return`${r}/a2a`;let t=e.subjectKind??"company";return`${r}/${t}/${encodeURIComponent(e.handle)}/a2a`}function U0(e,r,t){return`${e.replace(/\/$/,"")}/${r}/${encodeURIComponent(t)}/agent-card.json`}function o0(e){let r="https://contextrocket.com",t=e.ref??e.handle??"widget";return`${r}?ref=${encodeURIComponent(t)}`}function Se(e=fetch){return{request:(r,t)=>e(r,t)}}var G0=Se(),Te=new Set(["submitted","working","input-required","completed","canceled","failed"]),Me="1.0";function Ae(e,r){let t=W(e),s={progress:{type:"Progress",props:{stage:t.demoProgress,completed:2,total:4},children:[]},evidence:{type:"Evidence",props:{refs:[{title:t.demoEvidenceTitle,excerpt:t.demoEvidenceExcerpt},{title:t.demoEvidenceTitleTwo,excerpt:t.demoEvidenceExcerptTwo}]},children:[]},question:{type:"Question",props:{id:"demo-question",question:t.demoQuestion,interactionId:"demo-interaction",questionId:"demo-question-1"},children:[]},proposals:{type:"ProposalBatch",props:{views:[{id:"demo-proposal-1",workItemId:"demo-work-1",summary:t.demoProposal},{id:"demo-proposal-2",workItemId:"demo-work-2",summary:t.demoProposalTwo}]},children:[]},representation:{type:"Representation",props:{id:"demo-representation",organizationId:"demo-organization",representationId:"demo-artifact"},children:[]}},a=r?{Evidence:"evidence",Progress:"progress",Question:"question",ProposalBatch:"proposals",Representation:"representation"}[r]:null,i=a?[a]:["progress","evidence","question","proposals","representation"],c=Object.fromEntries(i.map(u=>[u,s[u]]));return c.response={type:"Response",props:{},children:i},{root:"response",elements:c}}function Re(e){if(typeof e!="string"||!e)return null;let r=e.replace(/^TASK_STATE_/,"").toLowerCase().replace(/_/g,"-");return J0(r)?r:null}var V0=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,U="Something went wrong. Please try again.",We="The connection ended before the answer was complete. Please try again.",K0="This content is not available in this chat. Please try again.";function S(e){return typeof e=="object"&&e!==null}function J0(e){return typeof e=="string"&&Te.has(e)}function Ie(e){return!S(e)||!Array.isArray(e.parts)?[]:e.parts.flatMap(r=>!S(r)||typeof r.text!="string"||!r.text?[]:[r.text])}function X0(e){return S(e)?S(e.metadata)?e.metadata:{}:{}}function Pe(...e){for(let r of e){let t=X0(r).source_refs;if(!Array.isArray(t))continue;return t.flatMap(o=>!S(o)||typeof o.sourceRefId!="string"?[]:[{sourceRefId:o.sourceRefId.slice(0,200),...typeof o.title=="string"?{title:o.title.slice(0,160)}:{},...typeof o.excerpt=="string"?{excerpt:o.excerpt.slice(0,600)}:{},...typeof o.url=="string"?{url:o.url.slice(0,2e3)}:{}}]).slice(0,8)}}function Be(...e){for(let r of e){let t=X0(r).suggestions;if(Array.isArray(t))return t.filter(s=>typeof s=="string").map(s=>s.trim().slice(0,200)).filter(Boolean).slice(0,5)}}function f0(e,r,...t){let s=Pe(...t),o=Be(...t),a=je(...t);return{type:"meta",state:e,terminal:r,...s?{sourceRefs:s}:{},...o?{suggestions:o}:{},...a.spec?{responseSpec:a.spec}:{},...a.unavailable?{unavailable:!0}:{}}}function je(...e){for(let r of e)if(!(!S(r)||!Array.isArray(r.parts)))for(let t of r.parts){let s=W0(t);if(s!==void 0)return s?{spec:s}:{unavailable:!0}}return{}}function Oe(e){let r=S(e.status)?e.status:void 0,t=Re(r?.state);if(!J0(t))return[];let s=typeof e.taskId=="string"?e.taskId:void 0,o=[e,r,r?.message];if(t==="failed"||t==="canceled")return[f0(t,!0,...o),{type:"error",message:U,reason:"generic"}];let a=He(...o);return t==="completed"||t==="input-required"?[f0(t,!0,...o),...a,{type:"done",taskId:s}]:[f0(t,!1,...o),...a]}function Fe(e){let r=S(e.artifact)?e.artifact:void 0,t=Ie(r).map(s=>({type:"delta",text:s}));return t.push(f0("working",!1,e,r)),t}function qe(e){if(!S(e)||e.jsonrpc!=="2.0")return[{type:"unsupported",message:K0}];if(e.error!==void 0&&e.error!==null)return[{type:"error",message:U,reason:"generic"}];let r=e.result;return S(r)?S(r.statusUpdate)?Oe(r.statusUpdate):S(r.artifactUpdate)?Fe(r.artifactUpdate):[{type:"unsupported",message:K0}]:[]}function He(...e){for(let r of e){if(!S(r))continue;let t=S(r.metadata)?r.metadata:r,s=typeof r.contextId=="string"&&r.contextId||typeof t.thread_id=="string"&&t.thread_id||typeof t.threadId=="string"&&t.threadId||void 0;if(s&&V0.test(s))return[{type:"session",threadId:s}]}return[]}function De(e){try{return qe(JSON.parse(e))}catch{return[{type:"error",message:U,reason:"generic"}]}}async function*$e(e,r){if(e)for await(let t of D0(e.getReader(),r))for(let s of De(t.data))yield s}async function*ze(e,r,t){let s=r.threadId??"demo-thread";yield{type:"meta",state:"working"};for(let o of W(e).demoResponse.split(/(\s+)/)){if(t?.aborted)return;o&&(yield{type:"delta",text:o}),await new Promise(a=>setTimeout(a,o.trim()?18:4))}yield{type:"meta",state:"working",responseSpec:Ae(e,r.demoCard)},!t?.aborted&&(yield{type:"session",threadId:s},yield{type:"done",taskId:"demo-task"})}var Q0=new WeakMap;async function*a0(e,r,t=G0,s){if(s?.aborted)return;if(e.mode==="demo"){yield*ze(e,r,s);return}let o=r.messageId??Q0.get(r)??crypto.randomUUID();r.messageId==null&&Q0.set(r,o);let a={messageId:o,role:"ROLE_USER",parts:[{text:r.message}]};r.threadId&&V0.test(r.threadId)&&(a.contextId=r.threadId);let i={};e.handle&&(i.handle=e.handle);let c={jsonrpc:"2.0",id:`embed-chat-${crypto.randomUUID()}`,method:"SendStreamingMessage",params:{message:a,metadata:i}},u=N0(e);if(!u){yield{type:"error",message:U,reason:"generic"};return}let g={"content-type":"application/json",accept:"text/event-stream","a2a-version":Me};e.apiKey&&(g["x-api-key"]=e.apiKey);let p;try{p=await t.request(u,{method:"POST",headers:g,body:JSON.stringify(c),signal:s})}catch{if(s?.aborted)return;yield{type:"error",message:U,reason:"generic"};return}if(!p.ok){yield{type:"error",message:U,reason:"generic"};return}if(!(p.headers.get("content-type")??"").includes("text/event-stream")){yield{type:"error",message:U,reason:"generic"};return}let b=!1;for await(let w of $e(p.body,s))(w.type==="done"||w.type==="error"||w.type==="unsupported"||w.type==="meta"&&w.terminal)&&(b=!0),yield w;!s?.aborted&&!b&&(yield{type:"error",message:We,reason:"interrupted"})}async function Y0(e,r,t=G0,s){let o=[];for await(let a of a0(e,r,t,s))o.push(a);return o}function i0(e){return{status:"idle",messages:e?[{id:"greeting",role:"assistant",content:e}]:[],errorMessage:null,errorReason:null,threadId:null,transportState:null}}var P0=0;function Z0(e){return P0+=1,`${e}-${P0}`}function ee(){P0=0}function b0(e,r){let t=Z0("user"),s=Z0("assistant");return{assistantMessageId:s,state:{...e,status:"streaming",errorMessage:null,errorReason:null,messages:[...e.messages,{id:t,role:"user",content:r},{id:s,role:"assistant",content:""}]}}}function y0(e,r,t){switch(r.type){case"delta":return r.text?{...e,messages:e.messages.map(s=>s.id===t&&s.role==="assistant"?{...s,content:s.content+r.text}:s)}:e;case"session":return{...e,threadId:r.threadId};case"error":return{...e,status:"error",errorMessage:r.message,errorReason:r.reason??"generic"};case"unsupported":return{...e,status:"error",errorMessage:r.message,errorReason:"unsupported"};case"done":return{...e,status:"complete"};case"meta":{let s=r.sourceRefs||r.suggestions||r.responseSpec||r.unavailable?e.messages.map(o=>o.id===t&&o.role==="assistant"?{...o,...r.sourceRefs?{sourceRefs:r.sourceRefs}:{},...r.suggestions?{suggestions:r.suggestions}:{},...r.responseSpec?{responseSpec:r.responseSpec}:{},...r.unavailable?{responseSpec:void 0}:{},...r.unavailable?{responseUnavailable:!0}:{}}:o):e.messages;return{...e,messages:s,transportState:r.state,status:r.terminal&&r.state==="input-required"?"input-required":r.terminal&&r.state==="canceled"?"canceled":e.status}}default:return e}}function c0(e){return e.status!=="streaming"}function w0(e){if(e)try{let r=new URL(e);return r.protocol!=="http:"&&r.protocol!=="https:"?void 0:r.href}catch{return}}function K(e){return e.replace(/[&<>"']/g,r=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[r])}function v0(e,r){let t=r.split(/\r?\n/),s=!1,o=[],a=(i,c)=>{let u=document.createElement("p");c&&(u.className=c),B0(u,i),e.appendChild(u)};for(let i of t){if(i.trim().startsWith("```")){if(s){let p=document.createElement("pre"),d=document.createElement("code");d.textContent=o.join(`
`),p.appendChild(d),e.appendChild(p),o=[]}s=!s;continue}if(s){o.push(i);continue}let c=i.match(/^#{1,6}\s+(.+)$/);if(c){let p=document.createElement("p");p.className="cr-markdown-heading";let d=document.createElement("strong");d.textContent=c[1],p.appendChild(d),e.appendChild(p);continue}let u=i.match(/^\s*[-*+]\s+(.+)$/);if(u){let p=document.createElement("ul"),d=document.createElement("li");B0(d,u[1]),p.appendChild(d),e.appendChild(p);continue}let g=i.match(/^\s*\d+[.)]\s+(.+)$/);if(g){let p=document.createElement("ol"),d=document.createElement("li");B0(d,g[1]),p.appendChild(d),e.appendChild(p);continue}i.trim()&&a(i)}if(s&&o.length>0){let i=document.createElement("pre"),c=document.createElement("code");c.textContent=o.join(`
`),i.appendChild(c),e.appendChild(i)}}function B0(e,r){let t=/(\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|__([^_]+)__|`([^`]+)`|\*([^*]+)\*|_([^_]+)_)/g,s=0;for(let o of r.matchAll(t)){let a=o.index??0;if(a>s&&e.appendChild(document.createTextNode(r.slice(s,a))),o[2]&&o[3]){let i=w0(o[3]);if(i){let c=document.createElement("a");c.href=i,c.target="_blank",c.rel="noopener noreferrer",c.textContent=o[2],e.appendChild(c)}else e.appendChild(document.createTextNode(o[2]))}else if(o[4]||o[5]||o[7]||o[8]){let i=document.createElement(o[4]||o[5]?"strong":"em");i.textContent=o[4]||o[5]||o[7]||o[8]||"",e.appendChild(i)}else if(o[6]){let i=document.createElement("code");i.textContent=o[6],e.appendChild(i)}s=a+o[0].length}s<r.length&&e.appendChild(document.createTextNode(r.slice(s)))}function te(e="#0e0f13"){return`
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
  --cr-focus: var(--cr-theme-foreground, #0E0F13);
  --cr-accent-soft: color-mix(in srgb, var(--cr-accent) 9%, var(--cr-theme-background, #FAF9F6));
  --cr-border: color-mix(in srgb, var(--cr-theme-border, #E3E0D9) 65%, transparent);
  --cr-border-strong: var(--cr-theme-border, #E3E0D9);
  --cr-muted: var(--cr-theme-muted, #5E616B);
  --cr-bg: var(--cr-theme-background, #FAF9F6);
  --cr-card: var(--cr-theme-surface, #FFFFFF);
  --cr-text: var(--cr-theme-foreground, #0E0F13);
  --cr-secondary: color-mix(in srgb, var(--cr-theme-muted, #F4F2ED) 38%, var(--cr-theme-background, #FAF9F6));
  --cr-secondary-fg: var(--cr-theme-foreground, #0E0F13);

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
  /* The hidden panel's layout box must not block the page behind the widget. */
  pointer-events: none;
}

.cr-root[data-position="bottom-left"] {
  right: auto;
  left: var(--tw-space-6);
  align-items: flex-start;
}

@media (max-width: 30rem) {
  .cr-root {
    right: max(1rem, env(safe-area-inset-right, 0px));
    bottom: max(1rem, env(safe-area-inset-bottom, 0px));
  }

  .cr-root .cr-panel {
    width: min(28rem, calc(100vw - 2rem));
    height: min(37.5rem, calc(100dvh - 2rem));
  }

  .cr-root[data-position="bottom-left"] {
    right: auto;
    left: max(1rem, env(safe-area-inset-left, 0px));
  }

  .cr-launcher {
    width: 3rem;
    height: 3rem;
  }
}

.cr-root[data-fullscreen="true"] .cr-launcher {
  display: none;
}

.cr-panel[data-open="true"] ~ .cr-launcher {
  display: none;
}

/* size-14 rounded-full */
.cr-launcher {
  width: 3.5rem;
  height: 3.5rem;
  border: none;
  border-radius: 9999px;
  background: #0e0f13;
  color: #ecedf1;
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
  pointer-events: auto;
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

.cr-launcher img {
  width: 1.75rem;
  height: 1.75rem;
  display: block;
  object-fit: contain;
}

.cr-launcher [hidden] {
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
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: none;
  outline: 1px solid var(--cr-border);
  outline-offset: -1px;
  border-radius: var(--tw-radius-2xl);
  background: var(--cr-bg);
  color: var(--cr-text);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translateY(0.75rem) scale(0.985);
  transform-origin: bottom right;
  transition: opacity 180ms ease, transform 220ms cubic-bezier(.2,.8,.2,1), visibility 220ms;
  box-shadow: var(--cr-panel-shadow);
}

.cr-panel[data-open="true"] {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transform: translateY(0) scale(1);
}

.cr-panel[data-fullscreen="true"] {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  max-height: none;
  border-radius: 0;
  outline: none;
  transform: none;
  transform-origin: center;
}

.cr-root[data-position="bottom-left"] .cr-panel { transform-origin: bottom left; }

.cr-probe {
  display: inline-grid;
  place-items: center;
  position: relative;
  width: 1.5rem;
  height: 1.5rem;
  margin: 0 0.375rem 0 0;
  vertical-align: middle;
  color: var(--cr-text);
}
.cr-probe svg { position: relative; z-index: 1; width: 100%; height: 100%; overflow: visible; }
.cr-probe[data-working="true"]::before {
  content: "";
  position: absolute;
  inset: -0.2rem;
  border: 1px solid color-mix(in srgb, var(--cr-accent) 38%, transparent);
  border-radius: 9999px;
  animation: cr-probe-pulse 1.8s ease-out infinite;
  pointer-events: none;
}
@keyframes cr-probe-pulse {
  0% { transform: scale(.78); opacity: .65; }
  100% { transform: scale(1.38); opacity: 0; }
}
.cr-probe-large { width: 4rem; height: 4rem; margin: 0 0 1rem; padding: .65rem; border-radius: 9999px; background: #0e0f13; color: #ecedf1; }
.cr-empty { display: flex; flex: 1; min-height: 12rem; flex-direction: column; align-items: center; justify-content: safe center; padding: 2rem; text-align: center; }
.cr-empty[data-suggestions-view="cards"] { justify-content: flex-start; padding: .75rem 1rem; }
.cr-empty[data-suggestions-view="cards"] .cr-probe-large { width: 2.5rem; height: 2.5rem; margin-bottom: .5rem; padding: .375rem; }
.cr-empty[data-suggestions-view="cards"] p { display: none; }
.cr-empty[data-suggestions-view="cards"] .cr-suggestion-tabs { flex-wrap: nowrap; gap: .375rem; }
.cr-empty[data-suggestions-view="cards"] .cr-suggestion-tab { min-width: 0; flex: 1; padding: .375rem .5rem; font-size: .6875rem; white-space: nowrap; }
.cr-empty h3 { margin: 0; color: var(--cr-text); font-size: 1rem; font-weight: 650; letter-spacing: -.02em; }
.cr-empty p { max-width: 18rem; margin: .4rem 0 0; color: var(--cr-muted); font-size: .875rem; line-height: 1.5; }
.cr-probe path, .cr-probe-foot { fill: currentColor; }
.cr-probe-visor { fill: #0e0f13; }
.cr-probe-eye { fill: #ff2b67; transform-origin: center; }
.cr-probe[data-working="true"] .cr-probe-eye { animation: cr-scan 1.4s ease-in-out infinite alternate; }
@keyframes cr-scan { from { transform: translateX(-6px); opacity: .45; } to { transform: translateX(5px); opacity: 1; } }
.cr-agent-response { display: grid; gap: .5rem; margin-top: .75rem; }
.cr-agent-card { display: grid; gap: .35rem; padding: .75rem; border: 1px solid var(--cr-border-strong); border-radius: .75rem; background: var(--cr-bg); font-size: .8125rem; }
.cr-agent-card > strong { color: var(--cr-accent); }
.cr-agent-card p { margin: 0; color: var(--cr-muted); }
.cr-agent-evidence { padding-top: .4rem; border-top: 1px solid var(--cr-border); }
.cr-agent-evidence p { margin-top: .2rem; }
.cr-unavailable { margin-top: .5rem !important; color: var(--cr-muted); font-size: .8rem; }

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

.cr-header-actions {
  display: flex;
  align-items: center;
  gap: var(--tw-space-1);
  flex-shrink: 0;
}

.cr-fullscreen-toggle {
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border: 0;
  border-radius: var(--tw-radius-md);
  background: transparent;
  color: var(--cr-muted);
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.cr-fullscreen-toggle:hover {
  background: var(--cr-card);
  color: var(--cr-text);
}

.cr-fullscreen-toggle:focus-visible,
.cr-close:focus-visible {
  outline: 2px solid var(--cr-focus);
  outline-offset: 2px;
}

/* text-sm/6 font-semibold */
.cr-title {
  display: flex;
  align-items: center;
  gap: 0.625rem;
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

.cr-panel[data-fullscreen="true"] .cr-header {
  min-height: 3.5rem;
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

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; transition-duration: .01ms !important; }
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

.cr-status:not([hidden])::before {
  content: "";
  display: inline-block;
  width: .375rem;
  height: .375rem;
  margin: 0 .5rem .05rem 0;
  border-radius: 9999px;
  background: var(--cr-accent);
  animation: cr-status-pulse 1.4s ease-in-out infinite;
}

@keyframes cr-status-pulse {
  50% { opacity: .4; transform: scale(.82); }
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

.cr-opening-suggestions {
  display: grid;
  gap: var(--tw-space-2);
  margin: var(--tw-space-3) var(--tw-space-4) 0;
}

.cr-suggestion-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--tw-space-2);
}

.cr-suggestion-tab {
  min-height: 2.25rem;
  border: 1px solid var(--cr-border-strong);
  border-radius: 9999px;
  background: var(--cr-bg);
  color: var(--cr-muted);
  padding: var(--tw-space-1_5) var(--tw-space-3);
  font: inherit;
  font-size: var(--tw-text-xs);
  cursor: pointer;
}

.cr-suggestion-tab[aria-pressed="true"] {
  border-color: var(--cr-text);
  background: var(--cr-text);
  color: var(--cr-bg);
}

.cr-suggestion-tab:focus-visible,
.cr-suggestion:focus-visible {
  outline: 2px solid var(--cr-focus);
  outline-offset: 2px;
}

.cr-suggestion-items {
  display: flex;
  flex-wrap: wrap;
  gap: var(--tw-space-2);
}

.cr-suggestion-items[data-view="cards"] {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: stretch;
}

.cr-suggestion-items[data-view="cards"] .cr-suggestion {
  min-width: 0;
  min-height: 2.25rem;
  border-radius: var(--tw-radius-lg);
  background: var(--cr-card);
  padding: var(--tw-space-1) var(--tw-space-2);
  text-align: left;
  white-space: normal;
  font-size: .6875rem;
  line-height: 1rem;
}

.cr-suggestion-items[data-view="cards"] .cr-suggestion:first-child {
  grid-column: 1 / -1;
  text-align: center;
}

.cr-suggestion-items[data-view="cards"] .cr-suggestion:last-child:nth-child(2n) {
  grid-column: 1 / -1;
  text-align: center;
}

@media (max-width: 30rem) {
  /* The centered empty state otherwise shrink-wraps this group on narrow phones. */
  .cr-empty {
    padding: 1.25rem;
  }

  .cr-empty .cr-probe-large {
    width: 3rem;
    height: 3rem;
    margin-bottom: 0.5rem;
    padding: 0.5rem;
  }

  .cr-empty .cr-opening-suggestions {
    width: 100%;
  }

  .cr-empty .cr-suggestion-tabs,
  .cr-empty .cr-suggestion-items {
    justify-content: center;
  }

  .cr-empty .cr-suggestion-tab {
    padding: var(--tw-space-1_5) var(--tw-space-2);
    font-size: var(--tw-text-xs);
  }

  .cr-empty .cr-suggestion-items[data-view="cards"] {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
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
  flex-direction: row;
  align-items: center;
  gap: var(--tw-space-3);
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
  width: auto;
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
  outline: 2px solid var(--cr-focus);
  outline-offset: 2px;
}

.cr-input::placeholder {
  color: var(--cr-muted); /* placeholder:text-gray-400-ish */
}

/* size-11 rounded-full send \u2014 matches ChatFab */
.cr-send {
  align-self: center;
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

.cr-send:focus-visible {
  outline: 2px solid var(--cr-focus);
  outline-offset: 3px;
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
  flex-direction: column;
  min-height: 2.75rem;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  color: var(--cr-muted);
  text-decoration: none;
  opacity: 0.85;
  transition: opacity 0.2s ease, color 0.2s ease;
}

.powered-by-badge .powered-by-label {
  color: var(--cr-muted);
  font-size: 0.5rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  line-height: 1;
  text-transform: uppercase;
}

.powered-by-badge .powered-by-logo {
  display: block;
  width: auto;
  height: 1.25rem;
}

.powered-by-badge:hover,
.powered-by-badge:focus-visible {
  color: var(--cr-text);
  opacity: 1;
}
`.trim()}var re=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3630 3475">
<path fill="currentColor" fill-rule="evenodd" d="M674 1643c6,-8 11,-16 16,-23l1 -1c8,-11 17,-22 25,-34 32,-42 65,-83 99,-121 34,-39 68,-76 103,-111l0 0c112,-112 232,-209 359,-292 130,-85 267,-155 407,-209 142,-55 288,-93 434,-115 147,-22 294,-27 437,-14l154 13c10,1 17,8 18,18l13 154c12,144 7,291 -14,437 -22,146 -60,291 -115,434 -54,140 -124,277 -209,407 -83,127 -180,247 -292,359 -35,35 -72,70 -111,104 -39,34 -80,67 -122,99 -12,9 -24,18 -35,26 -8,6 -16,11 -23,17 20,57 38,114 52,172 16,63 28,126 38,190 1,8 -2,15 -8,19l-404 301c-9,6 -21,5 -27,-4 -3,-3 -4,-7 -4,-11 -1,-105 -13,-211 -38,-315 -25,-103 -61,-205 -109,-303l-90 -183c-5,-9 -1,-20 8,-25l0 0 197 -110c33,-19 66,-39 99,-60 33,-22 65,-44 95,-67 29,-22 59,-46 88,-72 29,-25 58,-53 88,-83 85,-85 159,-177 222,-272 65,-99 117,-201 158,-306 31,-81 56,-164 73,-247 16,-77 25,-154 29,-230 -76,3 -153,13 -230,29 -83,17 -166,41 -247,73 -105,40 -208,93 -306,158 -96,63 -187,137 -272,222l-1 1c-29,29 -56,57 -81,87 -26,30 -50,59 -72,88 -24,31 -46,63 -67,95 -21,32 -41,65 -60,98l-111 197c-5,9 -17,13 -26,8l-182 -91c-96,-48 -196,-84 -297,-109 -103,-25 -206,-39 -309,-41 -11,0 -19,-9 -19,-20 0,-4 1,-8 4,-11l300 -403c4,-6 12,-9 18,-8l0 0c62,9 124,22 185,38 56,15 112,32 167,52zm800 349c99,-220 99,-158 0,-379 220,99 158,99 379,0 -99,220 -99,158 0,379 -220,-99 -158,-99 -379,0zm1252 -1238l0 0m-1824 1810l0 0c52,52 78,121 78,189l0 0c0,69 -26,137 -79,190 -54,54 -154,109 -262,155 -129,55 -271,97 -360,110 -11,1 -20,-6 -22,-17 0,-2 0,-4 0,-6 13,-89 55,-231 109,-360 46,-108 101,-208 155,-262l1 -1c52,-52 121,-78 189,-78l0 0c69,0 137,26 190,79l0 0zm-644 622c1,-8 8,-15 17,-16m249 -607c8,-7 19,-6 26,1"/><path fill="#FF2B67" d="M3416 641c69,180 34,145 214,214 -180,69 -145,34 -214,214 -69,-180 -34,-145 -214,-214 180,-69 145,-34 214,-214z"/><path fill="#FF2B67" d="M3079 0c93,243 45,196 288,288 -243,93 -196,45 -288,288 -93,-243 -45,-196 -288,-288 243,-93 196,-45 288,-288z"/>
</svg>
`;var ne=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9193 1236">
<path fill="#14151A" fill-rule="evenodd" d="M 240.0,584.0 C 242.0,581.0 244.0,578.0 246.0,576.0 L 246.0,576.0 C 249.0,572.0 252.0,568.0 255.0,564.0 C 266.0,549.0 278.0,535.0 290.0,521.0 C 302.0,507.0 314.0,494.0 327.0,482.0 L 327.0,482.0 C 367.0,442.0 410.0,408.0 455.0,378.0 C 501.0,348.0 550.0,323.0 600.0,304.0 C 651.0,284.0 702.0,271.0 754.0,263.0 C 806.0,255.0 858.0,254.0 909.0,258.0 L 964.0,263.0 C 967.0,263.0 970.0,266.0 970.0,269.0 L 975.0,324.0 C 979.0,375.0 978.0,427.0 970.0,479.0 C 962.0,531.0 949.0,583.0 929.0,633.0 C 910.0,683.0 885.0,731.0 855.0,778.0 C 826.0,823.0 791.0,866.0 751.0,906.0 C 739.0,918.0 725.0,931.0 711.0,943.0 C 697.0,955.0 683.0,967.0 668.0,978.0 C 664.0,981.0 660.0,984.0 655.0,987.0 C 652.0,989.0 649.0,991.0 647.0,993.0 C 654.0,1013.0 660.0,1033.0 666.0,1054.0 C 672.0,1076.0 676.0,1099.0 679.0,1122.0 C 679.0,1125.0 678.0,1127.0 676.0,1129.0 L 532.0,1236.0 C 529.0,1238.0 525.0,1238.0 522.0,1235.0 C 521.0,1234.0 521.0,1232.0 521.0,1231.0 C 521.0,1194.0 516.0,1156.0 507.0,1119.0 C 498.0,1082.0 485.0,1046.0 468.0,1011.0 L 436.0,946.0 C 434.0,943.0 436.0,939.0 439.0,937.0 L 439.0,937.0 L 509.0,898.0 C 521.0,891.0 533.0,884.0 544.0,877.0 C 556.0,869.0 567.0,861.0 578.0,853.0 C 588.0,845.0 599.0,837.0 609.0,827.0 C 619.0,818.0 630.0,808.0 640.0,798.0 C 670.0,768.0 697.0,735.0 719.0,701.0 C 742.0,666.0 761.0,629.0 775.0,592.0 C 786.0,563.0 795.0,534.0 801.0,504.0 C 807.0,477.0 810.0,449.0 811.0,422.0 C 784.0,423.0 756.0,427.0 729.0,432.0 C 699.0,438.0 670.0,447.0 641.0,458.0 C 604.0,472.0 567.0,491.0 532.0,514.0 C 498.0,536.0 465.0,563.0 435.0,593.0 L 435.0,593.0 C 425.0,603.0 415.0,613.0 406.0,624.0 C 397.0,635.0 388.0,645.0 380.0,655.0 C 372.0,666.0 364.0,677.0 356.0,689.0 C 349.0,700.0 341.0,712.0 335.0,724.0 L 296.0,794.0 C 294.0,797.0 290.0,799.0 287.0,797.0 L 222.0,765.0 C 188.0,748.0 152.0,735.0 116.0,726.0 C 80.0,717.0 43.0,712.0 6.0,711.0 C 2.0,711.0 -1.0,708.0 -1.0,704.0 C -1.0,702.0 0.0,701.0 0.0,700.0 L 107.0,557.0 C 109.0,555.0 111.0,554.0 114.0,554.0 L 114.0,554.0 C 136.0,557.0 158.0,562.0 180.0,568.0 C 200.0,573.0 220.0,579.0 239.0,586.0 L 240.0,584.0 M 525.0,708.0 C 560.0,630.0 560.0,652.0 525.0,573.0 C 603.0,608.0 581.0,608.0 660.0,573.0 C 625.0,651.0 625.0,629.0 660.0,708.0 C 582.0,673.0 604.0,673.0 525.0,708.0 M 970.0,268.0 L 970.0,268.0 M 322.0,912.0 L 322.0,912.0 C 341.0,931.0 350.0,955.0 350.0,979.0 L 350.0,979.0 C 350.0,1003.0 341.0,1028.0 322.0,1046.0 C 303.0,1065.0 267.0,1085.0 229.0,1101.0 C 183.0,1120.0 133.0,1135.0 101.0,1140.0 C 97.0,1141.0 94.0,1138.0 93.0,1134.0 C 93.0,1133.0 93.0,1133.0 93.0,1132.0 C 98.0,1100.0 112.0,1050.0 132.0,1004.0 C 148.0,966.0 168.0,930.0 187.0,911.0 L 187.0,911.0 C 206.0,893.0 230.0,883.0 254.0,883.0 L 254.0,883.0 C 278.0,883.0 303.0,892.0 321.0,911.0 L 321.0,911.0 L 322.0,912.0 M 93.0,1133.0 C 93.0,1130.0 96.0,1128.0 99.0,1127.0 M 188.0,911.0 C 191.0,909.0 195.0,909.0 197.0,911.0"/>
<path fill="#FF2B67" d="M 1095.0,0.0 C 1128.0,86.0 1111.0,70.0 1198.0,103.0 C 1112.0,136.0 1128.0,119.0 1095.0,206.0 C 1062.0,120.0 1079.0,136.0 992.0,103.0 C 1078.0,70.0 1062.0,87.0 1095.0,0.0"/>
<path fill="#FF2B67" d="M 1215.0,228.0 C 1239.0,292.0 1227.0,280.0 1291.0,304.0 C 1227.0,328.0 1239.0,316.0 1215.0,380.0 C 1191.0,316.0 1203.0,328.0 1139.0,304.0 C 1203.0,280.0 1191.0,292.0 1215.0,228.0"/>
<path fill="#14151A" fill-rule="evenodd" d="M 1705.0,1134.0 C 1641.0,1134.0 1582.0,1118.0 1529.0,1087.0 C 1476.0,1056.0 1434.0,1014.0 1404.0,961.0 C 1374.0,908.0 1358.0,850.0 1358.0,787.0 C 1358.0,724.0 1373.0,666.0 1404.0,613.0 C 1435.0,560.0 1476.0,518.0 1529.0,488.0 C 1582.0,457.0 1641.0,442.0 1705.0,442.0 C 1744.0,442.0 1782.0,448.0 1818.0,460.0 C 1854.0,472.0 1886.0,489.0 1916.0,511.0 C 1921.0,515.0 1924.0,520.0 1924.0,525.0 C 1924.0,529.0 1922.0,533.0 1919.0,537.0 L 1842.0,638.0 C 1838.0,643.0 1833.0,646.0 1828.0,646.0 C 1824.0,646.0 1820.0,645.0 1816.0,642.0 C 1800.0,631.0 1782.0,622.0 1763.0,616.0 C 1744.0,610.0 1725.0,606.0 1706.0,606.0 C 1675.0,606.0 1647.0,614.0 1620.0,630.0 C 1593.0,646.0 1572.0,668.0 1556.0,696.0 C 1540.0,724.0 1532.0,755.0 1532.0,788.0 C 1532.0,822.0 1540.0,852.0 1556.0,880.0 C 1572.0,908.0 1593.0,930.0 1620.0,946.0 C 1647.0,962.0 1675.0,970.0 1706.0,970.0 C 1728.0,970.0 1747.0,967.0 1764.0,962.0 C 1781.0,957.0 1798.0,947.0 1817.0,933.0 C 1821.0,930.0 1826.0,929.0 1830.0,929.0 C 1835.0,929.0 1840.0,932.0 1844.0,937.0 L 1919.0,1038.0 C 1923.0,1043.0 1924.0,1048.0 1924.0,1051.0 C 1924.0,1055.0 1922.0,1060.0 1917.0,1063.0 C 1888.0,1086.0 1855.0,1103.0 1819.0,1115.0 C 1783.0,1127.0 1745.0,1133.0 1706.0,1133.0 L 1705.0,1134.0 M 2306.0,1136.0 C 2250.0,1136.0 2199.0,1123.0 2153.0,1096.0 C 2107.0,1069.0 2070.0,1033.0 2043.0,988.0 C 2016.0,943.0 2003.0,893.0 2003.0,839.0 C 2003.0,784.0 2017.0,734.0 2044.0,688.0 C 2071.0,642.0 2108.0,606.0 2155.0,579.0 C 2202.0,552.0 2253.0,539.0 2309.0,539.0 C 2365.0,539.0 2416.0,552.0 2463.0,579.0 C 2510.0,606.0 2547.0,642.0 2574.0,688.0 C 2601.0,734.0 2615.0,784.0 2615.0,839.0 C 2615.0,893.0 2601.0,943.0 2574.0,988.0 C 2547.0,1034.0 2509.0,1070.0 2462.0,1096.0 C 2415.0,1122.0 2364.0,1136.0 2308.0,1136.0 L 2306.0,1136.0 M 2308.0,982.0 C 2334.0,982.0 2358.0,976.0 2380.0,963.0 C 2402.0,950.0 2419.0,933.0 2432.0,911.0 C 2445.0,889.0 2451.0,865.0 2451.0,838.0 C 2451.0,811.0 2445.0,786.0 2432.0,764.0 C 2419.0,742.0 2402.0,724.0 2380.0,712.0 C 2358.0,699.0 2334.0,693.0 2308.0,693.0 C 2281.0,693.0 2257.0,699.0 2235.0,712.0 C 2213.0,725.0 2196.0,742.0 2183.0,764.0 C 2170.0,786.0 2164.0,811.0 2164.0,838.0 C 2164.0,865.0 2170.0,889.0 2183.0,911.0 C 2196.0,933.0 2213.0,950.0 2235.0,963.0 C 2257.0,976.0 2281.0,982.0 2308.0,982.0 M 3087.0,538.0 C 3133.0,538.0 3174.0,549.0 3209.0,570.0 C 3244.0,591.0 3271.0,621.0 3291.0,660.0 C 3310.0,699.0 3320.0,744.0 3320.0,794.0 L 3320.0,1103.0 C 3320.0,1116.0 3314.0,1122.0 3301.0,1122.0 L 3178.0,1122.0 C 3165.0,1122.0 3159.0,1116.0 3159.0,1103.0 L 3159.0,813.0 C 3159.0,774.0 3149.0,744.0 3130.0,721.0 C 3111.0,698.0 3085.0,687.0 3051.0,687.0 C 3027.0,687.0 3005.0,693.0 2985.0,704.0 C 2965.0,715.0 2948.0,730.0 2936.0,749.0 C 2924.0,768.0 2918.0,787.0 2918.0,807.0 L 2918.0,1105.0 C 2918.0,1118.0 2912.0,1124.0 2899.0,1124.0 L 2776.0,1124.0 C 2763.0,1124.0 2757.0,1118.0 2757.0,1105.0 L 2757.0,569.0 C 2757.0,556.0 2763.0,550.0 2776.0,550.0 L 2870.0,550.0 C 2880.0,550.0 2888.0,555.0 2892.0,565.0 L 2912.0,614.0 C 2934.0,593.0 2961.0,575.0 2994.0,562.0 C 3027.0,548.0 3058.0,541.0 3087.0,541.0 L 3087.0,538.0 M 3653.0,1103.0 C 3653.0,1116.0 3647.0,1122.0 3634.0,1122.0 L 3511.0,1122.0 C 3498.0,1122.0 3492.0,1116.0 3492.0,1103.0 L 3492.0,697.0 L 3444.0,697.0 C 3431.0,697.0 3425.0,691.0 3425.0,678.0 L 3425.0,566.0 C 3425.0,553.0 3431.0,547.0 3444.0,547.0 L 3490.0,547.0 L 3490.0,444.0 C 3490.0,432.0 3496.0,425.0 3507.0,423.0 L 3632.0,399.0 C 3633.0,399.0 3635.0,399.0 3637.0,399.0 C 3642.0,399.0 3646.0,401.0 3649.0,404.0 C 3652.0,407.0 3653.0,411.0 3653.0,417.0 L 3653.0,549.0 L 3742.0,549.0 C 3755.0,549.0 3761.0,555.0 3761.0,568.0 L 3761.0,680.0 C 3761.0,693.0 3755.0,699.0 3742.0,699.0 L 3652.0,699.0 L 3652.0,1105.0 L 3653.0,1103.0 M 4136.0,1136.0 C 4079.0,1136.0 4027.0,1122.0 3982.0,1096.0 C 3937.0,1069.0 3901.0,1033.0 3875.0,987.0 C 3850.0,941.0 3837.0,892.0 3837.0,838.0 C 3837.0,784.0 3849.0,734.0 3873.0,688.0 C 3897.0,642.0 3931.0,606.0 3974.0,579.0 C 4017.0,552.0 4067.0,538.0 4122.0,538.0 C 4182.0,538.0 4233.0,551.0 4277.0,577.0 C 4321.0,603.0 4354.0,638.0 4377.0,683.0 C 4400.0,728.0 4411.0,780.0 4411.0,837.0 C 4411.0,850.0 4410.0,862.0 4409.0,874.0 C 4408.0,886.0 4401.0,892.0 4389.0,892.0 L 4002.0,892.0 C 4012.0,924.0 4030.0,948.0 4056.0,966.0 C 4081.0,984.0 4110.0,993.0 4142.0,993.0 C 4163.0,993.0 4181.0,990.0 4198.0,984.0 C 4215.0,978.0 4231.0,970.0 4247.0,959.0 C 4251.0,956.0 4255.0,954.0 4259.0,954.0 C 4264.0,954.0 4269.0,957.0 4273.0,963.0 L 4331.0,1046.0 C 4334.0,1050.0 4335.0,1054.0 4335.0,1058.0 C 4335.0,1063.0 4332.0,1068.0 4327.0,1072.0 C 4301.0,1093.0 4271.0,1108.0 4239.0,1120.0 C 4206.0,1131.0 4172.0,1137.0 4135.0,1137.0 L 4136.0,1136.0 M 4252.0,773.0 C 4243.0,742.0 4228.0,718.0 4206.0,701.0 C 4185.0,684.0 4158.0,676.0 4127.0,676.0 C 4097.0,676.0 4070.0,685.0 4048.0,702.0 C 4026.0,719.0 4010.0,743.0 4001.0,774.0 L 4252.0,774.0 L 4252.0,773.0 M 4694.0,1109.0 C 4689.0,1118.0 4681.0,1122.0 4671.0,1122.0 L 4521.0,1122.0 C 4516.0,1122.0 4512.0,1121.0 4509.0,1119.0 C 4506.0,1117.0 4504.0,1114.0 4504.0,1110.0 C 4504.0,1107.0 4505.0,1103.0 4508.0,1099.0 L 4694.0,829.0 L 4520.0,571.0 C 4517.0,566.0 4516.0,563.0 4516.0,560.0 C 4516.0,557.0 4517.0,554.0 4520.0,552.0 C 4523.0,550.0 4527.0,549.0 4532.0,549.0 L 4684.0,549.0 C 4694.0,549.0 4702.0,553.0 4707.0,562.0 L 4792.0,715.0 L 4877.0,562.0 C 4880.0,557.0 4882.0,554.0 4886.0,552.0 C 4890.0,550.0 4894.0,549.0 4899.0,549.0 L 5052.0,549.0 C 5057.0,549.0 5061.0,550.0 5064.0,552.0 C 5067.0,554.0 5068.0,557.0 5068.0,560.0 C 5068.0,564.0 5067.0,568.0 5064.0,571.0 L 4895.0,829.0 L 5076.0,1100.0 C 5079.0,1104.0 5080.0,1108.0 5080.0,1111.0 C 5080.0,1115.0 5079.0,1117.0 5076.0,1120.0 C 5073.0,1122.0 5069.0,1123.0 5064.0,1123.0 L 4913.0,1123.0 C 4903.0,1123.0 4895.0,1119.0 4890.0,1110.0 L 4791.0,942.0 L 4693.0,1110.0 L 4694.0,1109.0 M 5377.0,1103.0 C 5377.0,1116.0 5371.0,1122.0 5358.0,1122.0 L 5235.0,1122.0 C 5222.0,1122.0 5216.0,1116.0 5216.0,1103.0 L 5216.0,697.0 L 5168.0,697.0 C 5155.0,697.0 5149.0,691.0 5149.0,678.0 L 5149.0,566.0 C 5149.0,553.0 5155.0,547.0 5168.0,547.0 L 5214.0,547.0 L 5214.0,444.0 C 5214.0,432.0 5220.0,425.0 5231.0,423.0 L 5356.0,399.0 C 5357.0,399.0 5359.0,399.0 5361.0,399.0 C 5366.0,399.0 5370.0,401.0 5373.0,404.0 C 5376.0,407.0 5377.0,411.0 5377.0,417.0 L 5377.0,549.0 L 5466.0,549.0 C 5479.0,549.0 5485.0,555.0 5485.0,568.0 L 5485.0,680.0 C 5485.0,693.0 5479.0,699.0 5466.0,699.0 L 5376.0,699.0 L 5376.0,1105.0 L 5377.0,1103.0 M 5618.0,1122.0 C 5605.0,1122.0 5599.0,1116.0 5599.0,1103.0 L 5599.0,474.0 C 5599.0,461.0 5605.0,455.0 5618.0,455.0 L 5887.0,455.0 C 5933.0,455.0 5973.0,465.0 6009.0,484.0 C 6044.0,503.0 6072.0,530.0 6092.0,564.0 C 6112.0,598.0 6122.0,638.0 6122.0,682.0 C 6122.0,724.0 6113.0,761.0 6096.0,791.0 C 6079.0,821.0 6054.0,846.0 6023.0,865.0 L 6141.0,1100.0 C 6143.0,1104.0 6144.0,1107.0 6144.0,1110.0 C 6144.0,1114.0 6143.0,1117.0 6140.0,1119.0 C 6137.0,1121.0 6133.0,1122.0 6128.0,1122.0 L 5976.0,1122.0 C 5966.0,1122.0 5958.0,1117.0 5954.0,1108.0 L 5861.0,909.0 C 5856.0,909.0 5850.0,909.0 5841.0,909.0 L 5772.0,909.0 L 5772.0,1103.0 C 5772.0,1116.0 5766.0,1122.0 5753.0,1122.0 L 5620.0,1122.0 L 5618.0,1122.0 M 5871.0,765.0 C 5886.0,765.0 5899.0,761.0 5910.0,754.0 C 5922.0,746.0 5931.0,736.0 5938.0,724.0 C 5945.0,711.0 5948.0,698.0 5948.0,684.0 C 5948.0,659.0 5941.0,640.0 5926.0,626.0 C 5911.0,613.0 5894.0,606.0 5872.0,606.0 L 5769.0,606.0 L 5769.0,766.0 L 5871.0,766.0 L 5871.0,765.0 M 6530.0,1137.0 C 6474.0,1137.0 6423.0,1124.0 6377.0,1097.0 C 6331.0,1070.0 6294.0,1034.0 6267.0,989.0 C 6240.0,944.0 6227.0,894.0 6227.0,840.0 C 6227.0,785.0 6241.0,735.0 6268.0,689.0 C 6295.0,643.0 6332.0,607.0 6379.0,580.0 C 6426.0,553.0 6477.0,540.0 6533.0,540.0 C 6589.0,540.0 6640.0,553.0 6687.0,580.0 C 6734.0,607.0 6771.0,643.0 6798.0,689.0 C 6825.0,735.0 6839.0,785.0 6839.0,840.0 C 6839.0,894.0 6825.0,944.0 6798.0,989.0 C 6771.0,1035.0 6733.0,1071.0 6686.0,1097.0 C 6639.0,1123.0 6588.0,1137.0 6532.0,1137.0 L 6530.0,1137.0 M 6532.0,983.0 C 6558.0,983.0 6582.0,977.0 6604.0,964.0 C 6626.0,951.0 6643.0,934.0 6656.0,912.0 C 6669.0,890.0 6675.0,866.0 6675.0,839.0 C 6675.0,812.0 6669.0,787.0 6656.0,765.0 C 6643.0,743.0 6626.0,725.0 6604.0,713.0 C 6582.0,700.0 6558.0,694.0 6532.0,694.0 C 6505.0,694.0 6481.0,700.0 6459.0,713.0 C 6437.0,726.0 6420.0,743.0 6407.0,765.0 C 6394.0,787.0 6388.0,812.0 6388.0,839.0 C 6388.0,866.0 6394.0,890.0 6407.0,912.0 C 6420.0,934.0 6437.0,951.0 6459.0,964.0 C 6481.0,977.0 6505.0,983.0 6532.0,983.0 M 7238.0,1137.0 C 7182.0,1137.0 7131.0,1124.0 7086.0,1097.0 C 7041.0,1070.0 7006.0,1034.0 6980.0,989.0 C 6955.0,943.0 6942.0,894.0 6942.0,840.0 C 6942.0,785.0 6955.0,735.0 6980.0,689.0 C 7005.0,643.0 7040.0,607.0 7086.0,580.0 C 7131.0,553.0 7182.0,540.0 7239.0,540.0 C 7276.0,540.0 7311.0,546.0 7344.0,557.0 C 7377.0,568.0 7406.0,584.0 7432.0,604.0 C 7437.0,609.0 7440.0,613.0 7440.0,618.0 C 7440.0,622.0 7439.0,626.0 7436.0,630.0 L 7376.0,716.0 C 7372.0,722.0 7367.0,725.0 7362.0,725.0 C 7359.0,725.0 7355.0,724.0 7350.0,720.0 C 7334.0,709.0 7318.0,701.0 7302.0,695.0 C 7286.0,689.0 7267.0,686.0 7247.0,686.0 C 7221.0,686.0 7198.0,693.0 7176.0,706.0 C 7154.0,719.0 7137.0,737.0 7124.0,761.0 C 7111.0,784.0 7105.0,810.0 7105.0,840.0 C 7105.0,868.0 7112.0,894.0 7125.0,917.0 C 7138.0,940.0 7156.0,958.0 7178.0,971.0 C 7200.0,984.0 7224.0,991.0 7249.0,991.0 C 7270.0,991.0 7288.0,988.0 7304.0,983.0 C 7320.0,977.0 7336.0,969.0 7352.0,958.0 C 7357.0,955.0 7361.0,953.0 7364.0,953.0 C 7369.0,953.0 7374.0,956.0 7378.0,962.0 L 7438.0,1048.0 C 7441.0,1052.0 7443.0,1057.0 7443.0,1061.0 C 7443.0,1065.0 7441.0,1069.0 7437.0,1072.0 C 7411.0,1093.0 7381.0,1109.0 7348.0,1120.0 C 7315.0,1131.0 7279.0,1137.0 7240.0,1137.0 L 7238.0,1137.0 M 8135.0,1100.0 C 8137.0,1104.0 8139.0,1108.0 8139.0,1111.0 C 8139.0,1114.0 8138.0,1117.0 8135.0,1119.0 C 8132.0,1121.0 8128.0,1122.0 8123.0,1122.0 L 7976.0,1122.0 C 7966.0,1122.0 7958.0,1118.0 7953.0,1110.0 L 7815.0,899.0 L 7750.0,970.0 L 7750.0,1104.0 C 7750.0,1117.0 7744.0,1123.0 7731.0,1123.0 L 7608.0,1123.0 C 7595.0,1123.0 7589.0,1117.0 7589.0,1104.0 L 7589.0,400.0 C 7589.0,387.0 7595.0,381.0 7608.0,381.0 L 7731.0,381.0 C 7744.0,381.0 7750.0,387.0 7750.0,400.0 L 7750.0,760.0 L 7915.0,560.0 C 7921.0,553.0 7929.0,549.0 7938.0,549.0 L 8105.0,549.0 C 8110.0,549.0 8114.0,550.0 8117.0,552.0 C 8120.0,554.0 8121.0,557.0 8121.0,560.0 C 8121.0,564.0 8119.0,568.0 8115.0,572.0 L 7924.0,780.0 L 8134.0,1100.0 L 8135.0,1100.0 M 8500.0,1137.0 C 8443.0,1137.0 8391.0,1123.0 8346.0,1097.0 C 8301.0,1070.0 8265.0,1034.0 8239.0,988.0 C 8214.0,942.0 8201.0,893.0 8201.0,839.0 C 8201.0,785.0 8213.0,735.0 8237.0,689.0 C 8261.0,643.0 8295.0,607.0 8338.0,580.0 C 8381.0,553.0 8431.0,539.0 8486.0,539.0 C 8546.0,539.0 8597.0,552.0 8641.0,578.0 C 8685.0,604.0 8718.0,639.0 8741.0,684.0 C 8764.0,729.0 8775.0,781.0 8775.0,838.0 C 8775.0,851.0 8774.0,863.0 8773.0,875.0 C 8772.0,887.0 8765.0,893.0 8753.0,893.0 L 8366.0,893.0 C 8376.0,925.0 8394.0,949.0 8420.0,967.0 C 8445.0,985.0 8474.0,994.0 8506.0,994.0 C 8527.0,994.0 8545.0,991.0 8562.0,985.0 C 8579.0,979.0 8595.0,971.0 8611.0,960.0 C 8615.0,957.0 8619.0,955.0 8623.0,955.0 C 8628.0,955.0 8633.0,958.0 8637.0,964.0 L 8695.0,1047.0 C 8698.0,1051.0 8699.0,1055.0 8699.0,1059.0 C 8699.0,1064.0 8696.0,1069.0 8691.0,1073.0 C 8665.0,1094.0 8635.0,1109.0 8603.0,1121.0 C 8570.0,1132.0 8536.0,1138.0 8499.0,1138.0 L 8500.0,1137.0 M 8616.0,774.0 C 8607.0,743.0 8592.0,719.0 8570.0,702.0 C 8549.0,685.0 8522.0,677.0 8491.0,677.0 C 8461.0,677.0 8434.0,686.0 8412.0,703.0 C 8390.0,720.0 8374.0,744.0 8365.0,775.0 L 8616.0,775.0 L 8616.0,774.0 M 9084.0,1103.0 C 9084.0,1116.0 9078.0,1122.0 9065.0,1122.0 L 8942.0,1122.0 C 8929.0,1122.0 8923.0,1116.0 8923.0,1103.0 L 8923.0,697.0 L 8875.0,697.0 C 8862.0,697.0 8856.0,691.0 8856.0,678.0 L 8856.0,566.0 C 8856.0,553.0 8862.0,547.0 8875.0,547.0 L 8921.0,547.0 L 8921.0,444.0 C 8921.0,432.0 8927.0,425.0 8938.0,423.0 L 9063.0,399.0 C 9064.0,399.0 9066.0,399.0 9068.0,399.0 C 9073.0,399.0 9077.0,401.0 9080.0,404.0 C 9083.0,407.0 9084.0,411.0 9084.0,417.0 L 9084.0,549.0 L 9173.0,549.0 C 9186.0,549.0 9192.0,555.0 9192.0,568.0 L 9192.0,680.0 C 9192.0,693.0 9186.0,699.0 9173.0,699.0 L 9083.0,699.0 L 9083.0,1105.0 L 9084.0,1103.0"/>
</svg>
`;var se=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44288 5953">
<path fill="#FFFFFF" fill-rule="evenodd" d="M 1155.0,2814.0 C 1165.0,2800.0 1174.0,2787.0 1183.0,2775.0 L 1184.0,2773.0 C 1198.0,2754.0 1212.0,2735.0 1227.0,2716.0 C 1282.0,2644.0 1338.0,2574.0 1396.0,2508.0 C 1454.0,2442.0 1512.0,2378.0 1573.0,2318.0 L 1573.0,2318.0 C 1764.0,2127.0 1971.0,1960.0 2188.0,1818.0 C 2411.0,1672.0 2645.0,1553.0 2885.0,1460.0 C 3129.0,1366.0 3378.0,1300.0 3628.0,1263.0 C 3879.0,1226.0 4131.0,1217.0 4377.0,1238.0 L 4640.0,1260.0 C 4656.0,1261.0 4669.0,1275.0 4670.0,1291.0 L 4692.0,1554.0 C 4713.0,1800.0 4704.0,2052.0 4667.0,2303.0 C 4630.0,2553.0 4564.0,2802.0 4470.0,3046.0 C 4377.0,3286.0 4258.0,3520.0 4112.0,3743.0 C 3970.0,3960.0 3803.0,4166.0 3612.0,4358.0 C 3552.0,4418.0 3488.0,4477.0 3421.0,4535.0 C 3354.0,4593.0 3285.0,4650.0 3212.0,4704.0 C 3192.0,4719.0 3172.0,4734.0 3152.0,4749.0 C 3138.0,4759.0 3125.0,4769.0 3112.0,4778.0 C 3147.0,4875.0 3177.0,4973.0 3202.0,5072.0 C 3229.0,5179.0 3251.0,5288.0 3266.0,5398.0 C 3268.0,5411.0 3262.0,5424.0 3251.0,5430.0 L 2558.0,5945.0 C 2543.0,5956.0 2522.0,5953.0 2512.0,5938.0 C 2508.0,5932.0 2505.0,5925.0 2505.0,5918.0 C 2504.0,5738.0 2482.0,5557.0 2439.0,5378.0 C 2397.0,5201.0 2334.0,5027.0 2251.0,4858.0 L 2097.0,4544.0 C 2089.0,4528.0 2095.0,4509.0 2111.0,4500.0 L 2111.0,4500.0 L 2448.0,4311.0 C 2505.0,4279.0 2562.0,4245.0 2618.0,4208.0 C 2674.0,4171.0 2729.0,4133.0 2781.0,4093.0 C 2831.0,4055.0 2881.0,4014.0 2932.0,3969.0 C 2981.0,3926.0 3031.0,3879.0 3083.0,3828.0 C 3229.0,3682.0 3356.0,3525.0 3464.0,3361.0 C 3575.0,3192.0 3665.0,3016.0 3734.0,2836.0 C 3788.0,2697.0 3829.0,2555.0 3859.0,2412.0 C 3886.0,2280.0 3903.0,2149.0 3909.0,2018.0 C 3778.0,2024.0 3646.0,2040.0 3515.0,2067.0 C 3373.0,2096.0 3231.0,2138.0 3091.0,2192.0 C 2911.0,2261.0 2735.0,2352.0 2566.0,2462.0 C 2402.0,2569.0 2246.0,2696.0 2099.0,2843.0 L 2097.0,2845.0 C 2048.0,2894.0 2002.0,2944.0 1958.0,2993.0 C 1913.0,3044.0 1872.0,3095.0 1835.0,3143.0 C 1795.0,3196.0 1756.0,3250.0 1720.0,3305.0 C 1684.0,3360.0 1650.0,3416.0 1617.0,3474.0 L 1427.0,3812.0 C 1418.0,3828.0 1398.0,3834.0 1382.0,3825.0 L 1070.0,3670.0 C 905.0,3588.0 734.0,3525.0 561.0,3482.0 C 385.0,3438.0 207.0,3415.0 31.0,3412.0 C 13.0,3412.0 -2.0,3397.0 -2.0,3378.0 C -2.0,3371.0 0.0,3364.0 4.0,3359.0 L 517.0,2669.0 C 524.0,2659.0 537.0,2654.0 549.0,2656.0 L 549.0,2656.0 C 655.0,2672.0 761.0,2694.0 867.0,2721.0 C 963.0,2746.0 1059.0,2776.0 1153.0,2810.0 L 1155.0,2814.0 M 2526.0,3412.0 C 2695.0,3035.0 2695.0,3141.0 2526.0,2763.0 C 2904.0,2932.0 2797.0,2932.0 3175.0,2763.0 C 3006.0,3140.0 3006.0,3034.0 3175.0,3412.0 C 2797.0,3243.0 2904.0,3243.0 2526.0,3412.0 M 4670.0,1291.0 L 4670.0,1291.0 M 1546.0,4392.0 L 1547.0,4393.0 C 1636.0,4483.0 1681.0,4600.0 1681.0,4718.0 L 1681.0,4718.0 C 1681.0,4836.0 1636.0,4954.0 1546.0,5043.0 C 1453.0,5136.0 1282.0,5230.0 1097.0,5308.0 C 876.0,5402.0 633.0,5474.0 480.0,5496.0 C 462.0,5499.0 445.0,5486.0 443.0,5468.0 C 443.0,5465.0 443.0,5461.0 443.0,5458.0 C 465.0,5305.0 537.0,5063.0 631.0,4842.0 C 710.0,4657.0 804.0,4486.0 897.0,4393.0 L 899.0,4391.0 C 989.0,4302.0 1105.0,4258.0 1222.0,4258.0 L 1222.0,4258.0 C 1340.0,4258.0 1457.0,4303.0 1547.0,4392.0 L 1547.0,4392.0 L 1546.0,4392.0 M 442.0,5457.0 C 444.0,5443.0 455.0,5431.0 470.0,5429.0 M 897.0,4390.0 C 910.0,4379.0 930.0,4379.0 942.0,4392.0"/>
<path fill="#FF2B67" d="M 5274.0,0.0 C 5433.0,416.0 5352.0,335.0 5768.0,494.0 C 5352.0,653.0 5433.0,572.0 5274.0,988.0 C 5115.0,572.0 5196.0,653.0 4780.0,494.0 C 5196.0,335.0 5115.0,416.0 5274.0,0.0"/>
<path fill="#FF2B67" d="M 5851.0,1098.0 C 5969.0,1406.0 5909.0,1346.0 6217.0,1464.0 C 5909.0,1582.0 5969.0,1522.0 5851.0,1830.0 C 5733.0,1522.0 5793.0,1582.0 5485.0,1464.0 C 5793.0,1346.0 5733.0,1406.0 5851.0,1098.0"/>
<path fill="#FFFFFF" fill-rule="evenodd" d="M 8213.0,5464.0 C 7903.0,5464.0 7621.0,5389.0 7366.0,5239.0 C 7110.0,5090.0 6910.0,4888.0 6762.0,4634.0 C 6615.0,4380.0 6542.0,4100.0 6542.0,3795.0 C 6542.0,3490.0 6616.0,3210.0 6762.0,2956.0 C 6909.0,2702.0 7110.0,2500.0 7364.0,2354.0 C 7619.0,2207.0 7901.0,2134.0 8212.0,2134.0 C 8401.0,2134.0 8582.0,2163.0 8755.0,2220.0 C 8928.0,2278.0 9085.0,2360.0 9225.0,2465.0 C 9250.0,2485.0 9264.0,2508.0 9264.0,2534.0 C 9264.0,2554.0 9256.0,2574.0 9241.0,2594.0 L 8871.0,3079.0 C 8850.0,3104.0 8827.0,3118.0 8802.0,3118.0 C 8782.0,3118.0 8762.0,3111.0 8742.0,3097.0 C 8665.0,3043.0 8580.0,3001.0 8488.0,2970.0 C 8397.0,2939.0 8305.0,2923.0 8212.0,2923.0 C 8064.0,2923.0 7926.0,2961.0 7798.0,3038.0 C 7670.0,3115.0 7568.0,3221.0 7490.0,3355.0 C 7413.0,3489.0 7375.0,3637.0 7375.0,3799.0 C 7375.0,3961.0 7414.0,4109.0 7490.0,4243.0 C 7567.0,4377.0 7670.0,4483.0 7799.0,4560.0 C 7927.0,4638.0 8065.0,4677.0 8212.0,4677.0 C 8317.0,4677.0 8410.0,4664.0 8490.0,4637.0 C 8570.0,4611.0 8656.0,4565.0 8747.0,4499.0 C 8768.0,4486.0 8789.0,4478.0 8809.0,4478.0 C 8835.0,4478.0 8858.0,4491.0 8878.0,4517.0 L 9241.0,5004.0 C 9258.0,5028.0 9266.0,5050.0 9266.0,5068.0 C 9266.0,5089.0 9255.0,5109.0 9232.0,5128.0 C 9090.0,5236.0 8932.0,5320.0 8759.0,5378.0 C 8585.0,5437.0 8403.0,5467.0 8213.0,5467.0 L 8213.0,5464.0 M 11109.0,5475.0 C 10841.0,5475.0 10595.0,5410.0 10372.0,5283.0 C 10149.0,5155.0 9971.0,4981.0 9841.0,4761.0 C 9711.0,4542.0 9646.0,4302.0 9646.0,4041.0 C 9646.0,3776.0 9711.0,3533.0 9842.0,3312.0 C 9973.0,3091.0 10151.0,2917.0 10376.0,2788.0 C 10601.0,2659.0 10847.0,2594.0 11116.0,2594.0 C 11385.0,2594.0 11633.0,2659.0 11858.0,2788.0 C 12083.0,2917.0 12261.0,3091.0 12392.0,3312.0 C 12523.0,3533.0 12588.0,3776.0 12588.0,4041.0 C 12588.0,4302.0 12522.0,4542.0 12390.0,4761.0 C 12258.0,4981.0 12079.0,5154.0 11853.0,5283.0 C 11627.0,5411.0 11379.0,5475.0 11109.0,5475.0 M 11118.0,4732.0 C 11245.0,4732.0 11360.0,4702.0 11467.0,4641.0 C 11573.0,4580.0 11657.0,4497.0 11719.0,4391.0 C 11781.0,4285.0 11811.0,4168.0 11811.0,4038.0 C 11811.0,3907.0 11781.0,3788.0 11719.0,3681.0 C 11657.0,3574.0 11573.0,3490.0 11467.0,3429.0 C 11361.0,3368.0 11245.0,3338.0 11118.0,3338.0 C 10990.0,3338.0 10873.0,3368.0 10767.0,3429.0 C 10661.0,3490.0 10577.0,3574.0 10515.0,3681.0 C 10453.0,3787.0 10422.0,3906.0 10422.0,4038.0 C 10422.0,4168.0 10453.0,4285.0 10515.0,4391.0 C 10577.0,4497.0 10660.0,4580.0 10767.0,4641.0 C 10873.0,4702.0 10990.0,4732.0 11118.0,4732.0 M 14870.0,2594.0 C 15094.0,2594.0 15291.0,2645.0 15460.0,2747.0 C 15629.0,2849.0 15761.0,2994.0 15853.0,3181.0 C 15946.0,3367.0 15993.0,3584.0 15993.0,3829.0 L 15993.0,5315.0 C 15993.0,5376.0 15963.0,5406.0 15902.0,5406.0 L 15307.0,5406.0 C 15246.0,5406.0 15216.0,5376.0 15216.0,5315.0 L 15216.0,3916.0 C 15216.0,3730.0 15170.0,3581.0 15078.0,3471.0 C 14986.0,3360.0 14859.0,3305.0 14697.0,3305.0 C 14583.0,3305.0 14476.0,3333.0 14377.0,3386.0 C 14278.0,3440.0 14199.0,3511.0 14141.0,3601.0 C 14082.0,3690.0 14052.0,3784.0 14052.0,3881.0 L 14052.0,5315.0 C 14052.0,5376.0 14022.0,5406.0 13961.0,5406.0 L 13367.0,5406.0 C 13306.0,5406.0 13276.0,5376.0 13276.0,5315.0 L 13276.0,2732.0 C 13276.0,2671.0 13306.0,2641.0 13367.0,2641.0 L 13822.0,2641.0 C 13872.0,2641.0 13907.0,2664.0 13927.0,2712.0 L 14026.0,2947.0 C 14132.0,2845.0 14264.0,2761.0 14421.0,2695.0 C 14578.0,2628.0 14728.0,2595.0 14871.0,2595.0 L 14870.0,2594.0 M 17598.0,5315.0 C 17598.0,5376.0 17568.0,5406.0 17507.0,5406.0 L 16912.0,5406.0 C 16851.0,5406.0 16821.0,5376.0 16821.0,5315.0 L 16821.0,3360.0 L 16592.0,3360.0 C 16531.0,3360.0 16501.0,3330.0 16501.0,3269.0 L 16501.0,2732.0 C 16501.0,2671.0 16531.0,2641.0 16592.0,2641.0 L 16816.0,2641.0 L 16816.0,2143.0 C 16816.0,2086.0 16844.0,2053.0 16899.0,2042.0 L 17500.0,1925.0 C 17506.0,1924.0 17513.0,1923.0 17523.0,1923.0 C 17548.0,1923.0 17566.0,1931.0 17580.0,1946.0 C 17594.0,1962.0 17601.0,1982.0 17601.0,2008.0 L 17601.0,2642.0 L 18030.0,2642.0 C 18091.0,2642.0 18121.0,2672.0 18121.0,2733.0 L 18121.0,3270.0 C 18121.0,3331.0 18091.0,3361.0 18030.0,3361.0 L 17598.0,3361.0 L 17598.0,5316.0 L 17598.0,5315.0 M 19925.0,5475.0 C 19649.0,5475.0 19401.0,5410.0 19182.0,5281.0 C 18963.0,5151.0 18791.0,4977.0 18669.0,4757.0 C 18546.0,4537.0 18485.0,4298.0 18485.0,4039.0 C 18485.0,3777.0 18543.0,3536.0 18659.0,3315.0 C 18776.0,3095.0 18938.0,2920.0 19147.0,2789.0 C 19356.0,2659.0 19593.0,2593.0 19858.0,2593.0 C 20145.0,2593.0 20393.0,2655.0 20604.0,2779.0 C 20814.0,2902.0 20975.0,3073.0 21085.0,3291.0 C 21196.0,3509.0 21251.0,3757.0 21251.0,4034.0 C 21251.0,4095.0 21247.0,4154.0 21242.0,4214.0 C 21236.0,4271.0 21204.0,4299.0 21146.0,4299.0 L 19283.0,4299.0 C 19333.0,4451.0 19420.0,4570.0 19542.0,4655.0 C 19664.0,4740.0 19803.0,4783.0 19958.0,4783.0 C 20057.0,4783.0 20147.0,4769.0 20227.0,4740.0 C 20307.0,4712.0 20385.0,4671.0 20462.0,4617.0 C 20482.0,4602.0 20502.0,4594.0 20522.0,4594.0 C 20546.0,4594.0 20568.0,4607.0 20588.0,4635.0 L 20869.0,5035.0 C 20883.0,5055.0 20890.0,5073.0 20890.0,5092.0 C 20890.0,5118.0 20878.0,5141.0 20853.0,5161.0 C 20727.0,5260.0 20585.0,5337.0 20429.0,5391.0 C 20272.0,5446.0 20105.0,5472.0 19927.0,5472.0 L 19925.0,5475.0 M 20483.0,3728.0 C 20440.0,3577.0 20367.0,3461.0 20263.0,3381.0 C 20159.0,3300.0 20033.0,3260.0 19884.0,3260.0 C 19737.0,3260.0 19610.0,3301.0 19503.0,3383.0 C 19395.0,3465.0 19319.0,3581.0 19276.0,3728.0 L 20483.0,3728.0 M 22611.0,5345.0 C 22587.0,5386.0 22550.0,5407.0 22501.0,5407.0 L 21777.0,5407.0 C 21752.0,5407.0 21733.0,5401.0 21719.0,5391.0 C 21704.0,5380.0 21697.0,5367.0 21697.0,5350.0 C 21697.0,5334.0 21704.0,5315.0 21718.0,5295.0 L 22614.0,3994.0 L 21776.0,2751.0 C 21762.0,2729.0 21755.0,2711.0 21755.0,2696.0 C 21755.0,2680.0 21762.0,2666.0 21776.0,2656.0 C 21791.0,2646.0 21810.0,2641.0 21834.0,2641.0 L 22566.0,2641.0 C 22616.0,2641.0 22653.0,2662.0 22676.0,2705.0 L 23087.0,3444.0 L 23497.0,2705.0 C 23509.0,2682.0 23523.0,2666.0 23540.0,2656.0 C 23557.0,2646.0 23578.0,2641.0 23604.0,2641.0 L 24340.0,2641.0 C 24364.0,2641.0 24383.0,2646.0 24397.0,2656.0 C 24410.0,2666.0 24418.0,2679.0 24418.0,2696.0 C 24418.0,2714.0 24412.0,2733.0 24400.0,2751.0 L 23583.0,3994.0 L 24456.0,5297.0 C 24469.0,5315.0 24474.0,5333.0 24474.0,5350.0 C 24474.0,5367.0 24468.0,5380.0 24453.0,5391.0 C 24439.0,5402.0 24420.0,5407.0 24396.0,5407.0 L 23669.0,5407.0 C 23620.0,5407.0 23583.0,5386.0 23559.0,5345.0 L 23081.0,4534.0 L 22610.0,5345.0 L 22611.0,5345.0 M 25904.0,5315.0 C 25904.0,5376.0 25874.0,5406.0 25813.0,5406.0 L 25218.0,5406.0 C 25157.0,5406.0 25127.0,5376.0 25127.0,5315.0 L 25127.0,3360.0 L 24898.0,3360.0 C 24837.0,3360.0 24807.0,3330.0 24807.0,3269.0 L 24807.0,2732.0 C 24807.0,2671.0 24837.0,2641.0 24898.0,2641.0 L 25122.0,2641.0 L 25122.0,2143.0 C 25122.0,2086.0 25150.0,2053.0 25205.0,2042.0 L 25806.0,1925.0 C 25812.0,1924.0 25819.0,1923.0 25829.0,1923.0 C 25854.0,1923.0 25872.0,1931.0 25886.0,1946.0 C 25900.0,1962.0 25907.0,1982.0 25907.0,2008.0 L 25907.0,2642.0 L 26336.0,2642.0 C 26397.0,2642.0 26427.0,2672.0 26427.0,2733.0 L 26427.0,3270.0 C 26427.0,3331.0 26397.0,3361.0 26336.0,3361.0 L 25904.0,3361.0 L 25904.0,5316.0 L 25904.0,5315.0 M 27067.0,5406.0 C 27006.0,5406.0 26976.0,5376.0 26976.0,5315.0 L 26976.0,2286.0 C 26976.0,2225.0 27006.0,2195.0 27067.0,2195.0 L 28363.0,2195.0 C 28583.0,2195.0 28780.0,2241.0 28951.0,2333.0 C 29122.0,2425.0 29254.0,2554.0 29350.0,2719.0 C 29445.0,2884.0 29493.0,3074.0 29493.0,3287.0 C 29493.0,3491.0 29451.0,3666.0 29368.0,3811.0 C 29284.0,3956.0 29167.0,4075.0 29016.0,4167.0 L 29583.0,5298.0 C 29592.0,5316.0 29596.0,5333.0 29596.0,5346.0 C 29596.0,5364.0 29589.0,5379.0 29575.0,5389.0 C 29560.0,5400.0 29541.0,5405.0 29516.0,5405.0 L 28785.0,5405.0 C 28735.0,5405.0 28699.0,5382.0 28678.0,5336.0 L 28229.0,4378.0 C 28206.0,4379.0 28174.0,4380.0 28131.0,4380.0 L 27799.0,4380.0 L 27799.0,5313.0 C 27799.0,5374.0 27769.0,5404.0 27708.0,5404.0 L 27068.0,5404.0 L 27067.0,5406.0 M 28288.0,3684.0 C 28358.0,3684.0 28421.0,3666.0 28478.0,3629.0 C 28535.0,3592.0 28579.0,3543.0 28611.0,3482.0 C 28643.0,3421.0 28659.0,3357.0 28659.0,3288.0 C 28659.0,3168.0 28624.0,3075.0 28553.0,3010.0 C 28483.0,2946.0 28397.0,2913.0 28295.0,2913.0 L 27799.0,2913.0 L 27799.0,3683.0 L 28288.0,3683.0 L 28288.0,3684.0 M 31464.0,5474.0 C 31196.0,5474.0 30950.0,5409.0 30727.0,5282.0 C 30504.0,5154.0 30326.0,4980.0 30196.0,4760.0 C 30066.0,4541.0 30001.0,4301.0 30001.0,4040.0 C 30001.0,3775.0 30066.0,3532.0 30197.0,3311.0 C 30328.0,3090.0 30506.0,2916.0 30731.0,2787.0 C 30956.0,2658.0 31202.0,2593.0 31471.0,2593.0 C 31740.0,2593.0 31988.0,2658.0 32213.0,2787.0 C 32438.0,2916.0 32616.0,3090.0 32747.0,3311.0 C 32878.0,3532.0 32943.0,3775.0 32943.0,4040.0 C 32943.0,4301.0 32877.0,4541.0 32745.0,4760.0 C 32613.0,4980.0 32434.0,5153.0 32208.0,5282.0 C 31982.0,5410.0 31734.0,5474.0 31464.0,5474.0 M 31473.0,4731.0 C 31600.0,4731.0 31715.0,4701.0 31822.0,4640.0 C 31928.0,4579.0 32012.0,4496.0 32074.0,4390.0 C 32136.0,4284.0 32166.0,4167.0 32166.0,4037.0 C 32166.0,3906.0 32136.0,3787.0 32074.0,3680.0 C 32012.0,3573.0 31928.0,3489.0 31822.0,3428.0 C 31716.0,3367.0 31600.0,3337.0 31473.0,3337.0 C 31345.0,3337.0 31228.0,3367.0 31122.0,3428.0 C 31016.0,3489.0 30932.0,3573.0 30870.0,3680.0 C 30808.0,3786.0 30777.0,3905.0 30777.0,4037.0 C 30777.0,4167.0 30808.0,4284.0 30870.0,4390.0 C 30932.0,4496.0 31015.0,4579.0 31122.0,4640.0 C 31228.0,4701.0 31345.0,4731.0 31473.0,4731.0 M 34873.0,5474.0 C 34602.0,5474.0 34358.0,5409.0 34141.0,5280.0 C 33923.0,5151.0 33753.0,4977.0 33631.0,4758.0 C 33508.0,4538.0 33447.0,4299.0 33447.0,4038.0 C 33447.0,3774.0 33508.0,3533.0 33630.0,3312.0 C 33752.0,3092.0 33921.0,2917.0 34140.0,2787.0 C 34358.0,2658.0 34604.0,2593.0 34879.0,2593.0 C 35059.0,2593.0 35228.0,2620.0 35385.0,2673.0 C 35543.0,2726.0 35684.0,2802.0 35810.0,2899.0 C 35836.0,2921.0 35849.0,2944.0 35849.0,2968.0 C 35849.0,2986.0 35842.0,3006.0 35828.0,3028.0 L 35537.0,3442.0 C 35517.0,3471.0 35494.0,3485.0 35468.0,3485.0 C 35452.0,3485.0 35432.0,3478.0 35408.0,3462.0 C 35331.0,3409.0 35253.0,3368.0 35175.0,3341.0 C 35098.0,3313.0 35008.0,3300.0 34908.0,3300.0 C 34785.0,3300.0 34670.0,3332.0 34565.0,3396.0 C 34460.0,3460.0 34376.0,3548.0 34313.0,3660.0 C 34251.0,3772.0 34220.0,3898.0 34220.0,4038.0 C 34220.0,4175.0 34252.0,4300.0 34315.0,4411.0 C 34378.0,4522.0 34462.0,4609.0 34569.0,4673.0 C 34675.0,4736.0 34789.0,4768.0 34911.0,4768.0 C 35010.0,4768.0 35099.0,4754.0 35177.0,4728.0 C 35256.0,4701.0 35333.0,4661.0 35409.0,4608.0 C 35432.0,4593.0 35452.0,4585.0 35469.0,4585.0 C 35495.0,4585.0 35518.0,4599.0 35538.0,4628.0 L 35829.0,5042.0 C 35844.0,5063.0 35852.0,5084.0 35852.0,5104.0 C 35852.0,5124.0 35843.0,5142.0 35824.0,5159.0 C 35698.0,5260.0 35555.0,5337.0 35395.0,5392.0 C 35235.0,5447.0 35062.0,5474.0 34875.0,5474.0 L 34873.0,5474.0 M 39195.0,5295.0 C 39207.0,5313.0 39213.0,5332.0 39213.0,5350.0 C 39213.0,5366.0 39207.0,5380.0 39192.0,5390.0 C 39179.0,5400.0 39159.0,5405.0 39135.0,5405.0 L 38428.0,5405.0 C 38379.0,5405.0 38342.0,5385.0 38318.0,5345.0 L 37652.0,4328.0 L 37339.0,4668.0 L 37339.0,5313.0 C 37339.0,5374.0 37309.0,5404.0 37248.0,5404.0 L 36654.0,5404.0 C 36593.0,5404.0 36563.0,5374.0 36563.0,5313.0 L 36563.0,1922.0 C 36563.0,1861.0 36593.0,1831.0 36654.0,1831.0 L 37248.0,1831.0 C 37309.0,1831.0 37339.0,1861.0 37339.0,1922.0 L 37339.0,3655.0 L 38135.0,2690.0 C 38164.0,2655.0 38202.0,2638.0 38247.0,2638.0 L 39049.0,2638.0 C 39074.0,2638.0 39093.0,2642.0 39108.0,2651.0 C 39122.0,2660.0 39129.0,2673.0 39129.0,2690.0 C 39129.0,2710.0 39119.0,2730.0 39099.0,2750.0 L 38180.0,3752.0 L 39194.0,5295.0 L 39195.0,5295.0 M 40953.0,5474.0 C 40677.0,5474.0 40429.0,5409.0 40210.0,5280.0 C 39991.0,5150.0 39819.0,4976.0 39697.0,4756.0 C 39574.0,4536.0 39513.0,4297.0 39513.0,4038.0 C 39513.0,3776.0 39571.0,3535.0 39687.0,3314.0 C 39804.0,3094.0 39966.0,2919.0 40175.0,2788.0 C 40384.0,2658.0 40621.0,2592.0 40886.0,2592.0 C 41173.0,2592.0 41421.0,2654.0 41632.0,2778.0 C 41842.0,2901.0 42003.0,3072.0 42113.0,3290.0 C 42224.0,3508.0 42279.0,3756.0 42279.0,4033.0 C 42279.0,4094.0 42275.0,4153.0 42270.0,4213.0 C 42264.0,4270.0 42232.0,4298.0 42174.0,4298.0 L 40311.0,4298.0 C 40361.0,4450.0 40448.0,4569.0 40570.0,4654.0 C 40692.0,4739.0 40831.0,4782.0 40986.0,4782.0 C 41085.0,4782.0 41175.0,4768.0 41255.0,4739.0 C 41335.0,4711.0 41413.0,4670.0 41490.0,4616.0 C 41510.0,4601.0 41530.0,4593.0 41550.0,4593.0 C 41574.0,4593.0 41596.0,4606.0 41616.0,4634.0 L 41897.0,5034.0 C 41911.0,5054.0 41918.0,5072.0 41918.0,5091.0 C 41918.0,5117.0 41906.0,5140.0 41881.0,5160.0 C 41755.0,5259.0 41613.0,5336.0 41457.0,5390.0 C 41300.0,5445.0 41133.0,5471.0 40955.0,5471.0 L 40953.0,5474.0 M 41511.0,3727.0 C 41468.0,3576.0 41395.0,3460.0 41291.0,3380.0 C 41187.0,3299.0 41061.0,3259.0 40912.0,3259.0 C 40765.0,3259.0 40638.0,3300.0 40531.0,3382.0 C 40423.0,3464.0 40347.0,3580.0 40304.0,3727.0 L 41511.0,3727.0 M 43765.0,5314.0 C 43765.0,5375.0 43735.0,5405.0 43674.0,5405.0 L 43079.0,5405.0 C 43018.0,5405.0 42988.0,5375.0 42988.0,5314.0 L 42988.0,3359.0 L 42759.0,3359.0 C 42698.0,3359.0 42668.0,3329.0 42668.0,3268.0 L 42668.0,2731.0 C 42668.0,2670.0 42698.0,2640.0 42759.0,2640.0 L 42983.0,2640.0 L 42983.0,2142.0 C 42983.0,2085.0 43011.0,2052.0 43066.0,2041.0 L 43667.0,1924.0 C 43673.0,1923.0 43680.0,1922.0 43690.0,1922.0 C 43715.0,1922.0 43733.0,1930.0 43747.0,1945.0 C 43761.0,1961.0 43768.0,1981.0 43768.0,2007.0 L 43768.0,2641.0 L 44197.0,2641.0 C 44258.0,2641.0 44288.0,2671.0 44288.0,2732.0 L 44288.0,3269.0 C 44288.0,3330.0 44258.0,3360.0 44197.0,3360.0 L 43765.0,3360.0 L 43765.0,5315.0 L 43765.0,5314.0"/>
</svg>
`;var Ke=`data:image/svg+xml,${encodeURIComponent(re.replaceAll("currentColor","#ECEDF1"))}`,oe=e=>`data:image/svg+xml,${encodeURIComponent(e)}`,ae={ink:oe(ne),white:oe(se)},Qe=48,Ge=new Set(["Evidence","Progress","Question","ProposalBatch","Representation"]);function Ve(e){return e!==void 0&&Ge.has(e)}var j0="contextrocket-chat",v,C,y,H,G,D,Y,Z,V,P,$,O,z,T,e0,M,A,L,k,B,F,t0,r0,J,_,p0,l,ie,O0,x0,L0,ce,d0,Q,de,E0,le,I,l0,F0,ue,pe,ge,u0=class extends HTMLElement{constructor(){super();f(this,l);f(this,v,null);f(this,C,i0());f(this,y);f(this,H,0);f(this,G,null);f(this,D,"");f(this,Y);f(this,Z);f(this,V,null);f(this,P,[]);f(this,$,"questions");f(this,O,null);f(this,z,0);f(this,T,!1);f(this,e0,!1);f(this,M);f(this,A);f(this,L);f(this,k);f(this,B);f(this,F);f(this,t0);f(this,r0);f(this,J);f(this,_);f(this,p0);h(this,y,this.attachShadow({mode:"open"}))}static get observedAttributes(){return["data-contextrocket-api-key","data-contextrocket-handle","data-contextrocket-subject-kind","data-contextrocket-mode","data-contextrocket-api-base","data-contextrocket-accent","data-contextrocket-greeting","data-contextrocket-title","data-contextrocket-ref","data-contextrocket-background","data-contextrocket-foreground","data-contextrocket-surface","data-contextrocket-muted","data-contextrocket-border","data-contextrocket-powered-by-logo","data-contextrocket-suggestions","data-contextrocket-position","data-contextrocket-fullscreen","data-contextrocket-fullscreen-on-open","data-contextrocket-fullscreen-on-load","data-contextrocket-locale"]}connectedCallback(){h(this,v,N(this)),n(this,v)&&(this.lang=n(this,v).locale,h(this,C,i0(n(this,v).greeting)),m(this,l,ie).call(this),m(this,l,ce).call(this),m(this,l,I).call(this),m(this,l,Q).call(this,n(this,v).fullscreenOnLoad===!0),m(this,l,d0).call(this,n(this,v).fullscreenOnLoad===!0),m(this,l,L0).call(this))}attributeChangedCallback(){if(!this.isConnected)return;let t=N(this);if(!t||(h(this,v,t),this.lang=t.locale,!n(this,_)))return;let s=W(t),o=n(this,y).querySelector(".cr-root");o.lang=this.lang,n(this,y).querySelector(".cr-title-text").textContent=t.title??s.defaultTitle,n(this,L).setAttribute("aria-label",t.title??s.defaultTitle),n(this,y).querySelector(".cr-close").setAttribute("aria-label",s.close),n(this,A).hidden=!(t.fullscreen||t.fullscreenOnOpen||t.fullscreenOnLoad),n(this,A).setAttribute("aria-label",n(this,T)?s.collapse:s.expand),!t.fullscreen&&!t.fullscreenOnOpen&&!t.fullscreenOnLoad&&m(this,l,Q).call(this,!1),n(this,M).setAttribute("aria-label",n(this,L).dataset.open==="true"?s.close:s.open),n(this,B).placeholder=s.placeholder,n(this,B).setAttribute("aria-label",s.placeholder),n(this,J).textContent=s.retry,n(this,_).setAttribute("aria-label",s.poweredBy),n(this,_).querySelector(".powered-by-label").textContent=s.poweredByLabel,n(this,p0).src=ae[t.poweredByLogo??"ink"],m(this,l,I).call(this),n(this,_).href=o0(t),this.style.setProperty("--cr-accent",t.accentColor??"#0e0f13"),m(this,l,O0).call(this,t),n(this,y).querySelector(".cr-root")?.setAttribute("data-position",t.position??"bottom-right"),t.suggestions&&h(this,P,t.suggestions),m(this,l,L0).call(this)}};v=new WeakMap,C=new WeakMap,y=new WeakMap,H=new WeakMap,G=new WeakMap,D=new WeakMap,Y=new WeakMap,Z=new WeakMap,V=new WeakMap,P=new WeakMap,$=new WeakMap,O=new WeakMap,z=new WeakMap,T=new WeakMap,e0=new WeakMap,M=new WeakMap,A=new WeakMap,L=new WeakMap,k=new WeakMap,B=new WeakMap,F=new WeakMap,t0=new WeakMap,r0=new WeakMap,J=new WeakMap,_=new WeakMap,p0=new WeakMap,l=new WeakSet,ie=function(){let t=n(this,v),s=W(t),o=document.createElement("style");o.textContent=te(t.accentColor);let a=document.createElement("div");a.className="cr-root",a.lang=this.lang,a.dataset.position=t.position??"bottom-right",a.innerHTML=`
      <div class="cr-panel" data-open="false" data-position="${K(t.position??"bottom-right")}" part="panel" role="dialog" aria-modal="true" aria-hidden="true" aria-label="${K(t.title??s.defaultTitle)}" inert>
        <header class="cr-header">
          <h2 class="cr-title"><span class="cr-title-probe"></span><span class="cr-title-text">${K(t.title??s.defaultTitle)}</span></h2>
          <div class="cr-header-actions">
            <button type="button" class="cr-fullscreen-toggle" aria-label="${s.expand}" aria-pressed="false"${t.fullscreen||t.fullscreenOnOpen||t.fullscreenOnLoad?"":" hidden"}>
              <svg class="cr-fullscreen-expand-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6"/><path d="m21 3-7 7"/><path d="M9 21H3v-6"/><path d="m3 21 7-7"/></svg>
              <svg class="cr-fullscreen-collapse-icon" hidden xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3v6H2"/><path d="m2 9 7-7"/><path d="M16 21v-6h6"/><path d="m22 15-7 7"/></svg>
            </button>
            <button type="button" class="cr-close" aria-label="${s.close}">\xD7</button>
          </div>
        </header>
        <div class="cr-messages" part="messages" role="log" aria-live="polite"></div>
        <p class="cr-status" role="status" aria-live="polite" hidden></p>
        <p class="cr-error" role="alert" hidden part="error"></p>
        <button type="button" class="cr-retry" hidden>${s.retry}</button>
        <form class="cr-composer" part="composer">
          <input class="cr-input" type="text" autocomplete="off" placeholder="${s.placeholder}" aria-label="${s.placeholder}" />
          <button class="cr-send" type="submit" data-state="send" aria-label="${s.send}"></button>
        </form>
        <footer class="cr-footer" part="footer">
          <a class="powered-by-badge" href="${K(o0(t))}" target="_blank" rel="noopener noreferrer" aria-label="${K(s.poweredBy)}">
            <span class="powered-by-label">${K(s.poweredByLabel)}</span>
            <img class="powered-by-logo" src="${ae[t.poweredByLogo??"ink"]}" alt="ContextRocket" width="149" height="20">
          </a>
        </footer>
      </div>
      <button type="button" class="cr-launcher" aria-label="${s.open}" aria-expanded="false" aria-controls="contextrocket-chat-panel" part="launcher">
        <img class="cr-launcher-icon-open" src="${Ke}" alt="" width="26" height="26" aria-hidden="true">
        <svg class="cr-launcher-icon-close" hidden xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
    `,n(this,y).replaceChildren(o,a),h(this,L,n(this,y).querySelector(".cr-panel")),n(this,L).id="contextrocket-chat-panel",n(this,y).querySelector(".cr-title-probe")?.replaceWith(m(this,l,x0).call(this,!1));let i=n(this,y).querySelector(".cr-title-text");i&&(i.textContent=t.title??s.defaultTitle),h(this,M,n(this,y).querySelector(".cr-launcher")),h(this,A,n(this,y).querySelector(".cr-fullscreen-toggle")),h(this,k,n(this,y).querySelector(".cr-messages")),h(this,B,n(this,y).querySelector(".cr-input")),h(this,F,n(this,y).querySelector(".cr-send")),h(this,t0,n(this,y).querySelector(".cr-error")),h(this,r0,n(this,y).querySelector(".cr-status")),h(this,J,n(this,y).querySelector(".cr-retry")),h(this,_,n(this,y).querySelector(".cr-footer a")),h(this,p0,n(this,y).querySelector(".powered-by-logo")),m(this,l,O0).call(this,t)},O0=function(t){let s=[["--cr-theme-background",t.backgroundColor],["--cr-theme-foreground",t.foregroundColor],["--cr-theme-surface",t.surfaceColor],["--cr-theme-muted",t.mutedColor],["--cr-theme-border",t.borderColor]];for(let[o,a]of s)a?this.style.setProperty(o,a):this.style.removeProperty(o)},x0=function(t){let s=document.createElement("span");return s.className="cr-probe",s.dataset.working=String(t),s.setAttribute("aria-hidden","true"),s.innerHTML='<svg viewBox="0 0 64 64" focusable="false"><path d="M32 6c11 0 18 7.5 18 18v17c0 7-5.5 12-12.5 12h-11C19.5 53 14 48 14 41V24C14 13.5 21 6 32 6z"/><rect x="17" y="21" width="30" height="10" rx="5" class="cr-probe-visor"/><rect x="34.5" y="23" width="4" height="6" rx=".8" class="cr-probe-eye"/><rect x="22" y="54.5" width="6" height="3.5" rx="1.75" class="cr-probe-foot"/><rect x="36" y="54.5" width="6" height="3.5" rx="1.75" class="cr-probe-foot"/></svg>',s},L0=async function(){let t=n(this,v);if(!t||t.mode!=="live"||t.suggestions?.length||!t.apiBaseUrl||!t.handle){h(this,z,n(this,z)+1),h(this,O,null);let g=n(this,P).length>0;h(this,P,[]),g&&!m(this,l,l0).call(this)&&m(this,l,I).call(this);return}let s=t.handle,o=t.apiBaseUrl,a=t.subjectKind??"company",i=`${o}
${a}
${s}`;if(n(this,O)===i)return;h(this,O,i);let c=++A0(this,z)._,u=n(this,P).length>0;h(this,P,[]),u&&!m(this,l,l0).call(this)&&m(this,l,I).call(this);try{let g=await fetch(U0(o,a,s),{method:"GET",mode:"cors",credentials:"omit",headers:{accept:"application/json"}});if(c!==n(this,z))return;if(!g.ok){h(this,O,null);return}let p=await g.json();if(c!==n(this,z))return;if(!p||typeof p!="object"){h(this,O,null);return}let d=p.skills;if(!Array.isArray(d)){h(this,O,null);return}let b=d.flatMap(w=>{if(!w||typeof w!="object")return[];let q=w.examples;return Array.isArray(q)?q:[]}).filter(w=>typeof w=="string").map(w=>w.trim().slice(0,200)).filter(Boolean).slice(0,5);b.length&&!m(this,l,l0).call(this)&&(h(this,P,b),m(this,l,I).call(this))}catch{c===n(this,z)&&h(this,O,null)}},ce=function(){n(this,M).addEventListener("click",()=>{let t=n(this,L).dataset.open==="true";t||m(this,l,Q).call(this,n(this,v)?.fullscreenOnOpen===!0),m(this,l,d0).call(this,!t)}),n(this,y).querySelector(".cr-close")?.addEventListener("click",()=>m(this,l,d0).call(this,!1)),n(this,A).addEventListener("click",()=>m(this,l,Q).call(this,!n(this,T))),n(this,J).addEventListener("click",()=>void m(this,l,E0).call(this,n(this,D),n(this,Y),n(this,Z))),n(this,k).addEventListener("click",t=>{let s=t.target,o=s.closest("[data-suggestion-tab]");if(o?.dataset.suggestionTab==="questions"||o?.dataset.suggestionTab==="cards"){let i=o.dataset.suggestionTab;h(this,$,i),m(this,l,I).call(this),n(this,k).querySelector(`[data-suggestion-tab="${i}"]`)?.focus({preventScroll:!0});return}let a=s.closest("[data-suggestion]");if(a?.dataset.suggestion){let i=Ve(a.dataset.demoCard)?a.dataset.demoCard:void 0;m(this,l,E0).call(this,a.dataset.suggestion,void 0,i)}}),n(this,y).querySelector(".cr-composer")?.addEventListener("submit",t=>{t.preventDefault(),n(this,C).status==="streaming"?m(this,l,le).call(this):m(this,l,de).call(this)}),n(this,y).addEventListener("keydown",t=>{if(!(t instanceof KeyboardEvent)||!n(this,L)||n(this,L).dataset.open!=="true")return;if(t.key==="Escape"){t.preventDefault(),n(this,T)?(m(this,l,Q).call(this,!1),n(this,A).focus()):m(this,l,d0).call(this,!1);return}if(t.key!=="Tab")return;let s=Array.from(n(this,L).querySelectorAll(["button:not([disabled]):not([hidden])","input:not([disabled]):not([hidden])","a[href]:not([hidden])",'[tabindex]:not([tabindex="-1"]):not([hidden])'].join(", "))).filter(c=>!c.closest("[hidden], [inert]"));if(!s.length)return;let o=s[0],a=s[s.length-1],i=n(this,y).activeElement;!i||!s.includes(i)?(t.preventDefault(),(t.shiftKey?a:o).focus()):t.shiftKey&&i===o?(t.preventDefault(),a.focus()):!t.shiftKey&&i===a&&(t.preventDefault(),o.focus())})},d0=function(t){if(!n(this,L))return;let s=n(this,L).dataset.open==="true";t||m(this,l,Q).call(this,!1),n(this,L).dataset.open=t?"true":"false",n(this,L).setAttribute("aria-hidden",String(!t));let o=n(this,M).querySelector(".cr-launcher-icon-open"),a=n(this,M).querySelector(".cr-launcher-icon-close");o&&a&&(t?(o.setAttribute("hidden",""),a.removeAttribute("hidden")):(o.removeAttribute("hidden"),a.setAttribute("hidden","")));let i=W(n(this,v));n(this,M).setAttribute("aria-label",t?i.close:i.open),t?(m(this,l,L0).call(this),n(this,L).removeAttribute("inert"),n(this,M).setAttribute("aria-expanded","true"),(n(this,B).disabled?n(this,F):n(this,B)).focus()):(n(this,L).setAttribute("inert",""),n(this,M).setAttribute("aria-expanded","false"),s&&n(this,M).focus())},Q=function(t){if(!n(this,L))return;let s=n(this,v)?.fullscreen||n(this,v)?.fullscreenOnOpen||n(this,v)?.fullscreenOnLoad;h(this,T,!!(t&&s));let o=n(this,y).querySelector(".cr-root");if(o&&(o.dataset.fullscreen=String(n(this,T))),n(this,L).dataset.fullscreen=String(n(this,T)),!n(this,A))return;let a=W(n(this,v));n(this,A).setAttribute("aria-label",n(this,T)?a.collapse:a.expand),n(this,A).setAttribute("aria-pressed",String(n(this,T)));let i=n(this,A).querySelector(".cr-fullscreen-expand-icon"),c=n(this,A).querySelector(".cr-fullscreen-collapse-icon");n(this,T)?(i?.setAttribute("hidden",""),c?.removeAttribute("hidden")):(i?.removeAttribute("hidden"),c?.setAttribute("hidden","")),n(this,M).hidden=n(this,T)},de=async function(){let t=n(this,B).value.trim();t&&(n(this,B).value="",await m(this,l,E0).call(this,t))},E0=async function(t,s,o){let a=n(this,v);if(!a||!t.trim()||!c0(n(this,C)))return;h(this,D,t.trim()),h(this,Y,s??crypto.randomUUID()),h(this,Z,o);let i=b0(n(this,C),n(this,D));h(this,C,i.state),h(this,G,i.assistantMessageId),h(this,e0,!0);let c=++A0(this,H)._,u=new AbortController;h(this,V,u),m(this,l,I).call(this),n(this,F).focus();try{for await(let g of a0(a,{message:n(this,D),messageId:n(this,Y),threadId:n(this,C).threadId??void 0,demoCard:n(this,Z)},void 0,u.signal)){if(c!==n(this,H))return;if(h(this,C,y0(n(this,C),g,i.assistantMessageId)),m(this,l,I).call(this),g.type==="error"||g.type==="unsupported"||g.type==="done")break}}catch{c===n(this,H)&&(h(this,C,{...n(this,C),status:"error",errorMessage:null,errorReason:"generic"}),m(this,l,I).call(this))}finally{c===n(this,H)&&h(this,V,null)}},le=function(){n(this,V)?.abort(),h(this,H,n(this,H)+1),h(this,V,null),h(this,C,{...n(this,C),status:"canceled",errorMessage:W(n(this,v)).canceled,errorReason:null}),m(this,l,I).call(this)},I=function(){if(!n(this,v))return;let t=W(n(this,v)),s=n(this,k).scrollTop,o=n(this,k).scrollHeight-n(this,k).clientHeight-s,a=n(this,e0)||o<=Qe;h(this,e0,!1),n(this,k).replaceChildren();let i=m(this,l,l0).call(this);if(n(this,C).messages.length===0){let d=document.createElement("div");d.className="cr-empty",d.dataset.suggestionsView=n(this,$);let b=m(this,l,x0).call(this,!1);b.classList.add("cr-probe-large");let w=document.createElement("h3");w.textContent=t.emptyTitle;let q=document.createElement("p");q.textContent=t.emptyDescription,d.append(b,w,q,m(this,l,F0).call(this,t)),n(this,k).appendChild(d)}for(let d of n(this,C).messages){if(d.role==="assistant"&&!d.content.trim()&&!d.sourceRefs?.length&&!d.suggestions?.length&&!d.responseSpec&&!d.responseUnavailable&&!(n(this,C).status==="streaming"&&d.id===n(this,G)))continue;let b=document.createElement("div");if(b.className="cr-message",b.dataset.role=d.role,d.role==="assistant"){if(b.appendChild(m(this,l,x0).call(this,n(this,C).status==="streaming"&&d.id===n(this,G))),v0(b,d.content),d.responseSpec&&m(this,l,ue).call(this,b,d.responseSpec),d.responseUnavailable){let w=document.createElement("p");w.className="cr-unavailable",w.textContent=t.unavailable,b.appendChild(w)}d.sourceRefs?.length&&m(this,l,pe).call(this,b,d.sourceRefs,t),d.suggestions?.length&&n(this,C).status!=="streaming"&&m(this,l,ge).call(this,b,d.suggestions,t)}else b.textContent=d.content;d.role==="assistant"&&n(this,C).status==="streaming"&&d.id===n(this,G)&&(b.dataset.streaming="true"),n(this,k).appendChild(b)}i===!1&&n(this,C).messages.length>0&&n(this,k).appendChild(m(this,l,F0).call(this,t)),n(this,k).scrollTop=a?n(this,k).scrollHeight:s;let c=n(this,C).status==="error"?n(this,C).errorReason==="interrupted"?t.interrupted:n(this,C).errorReason==="unsupported"?t.unsupported:t.generic:n(this,C).status==="canceled"?t.canceled:"",u=!!c;n(this,t0).hidden=!u,n(this,t0).textContent=c,n(this,J).hidden=!u||!n(this,D);let g="";n(this,C).status==="streaming"?g=n(this,C).transportState==="submitted"?t.submitted:t.working:n(this,C).status==="input-required"&&(g=t.inputRequired),n(this,r0).hidden=!g,n(this,r0).textContent=g;let p=n(this,C).status==="streaming";n(this,k).setAttribute("aria-busy",String(p)),n(this,B).disabled=p,n(this,F).disabled=!p&&!c0(n(this,C)),n(this,F).textContent="",n(this,F).dataset.state=p?"stop":"send",n(this,F).setAttribute("aria-label",p?t.stop:t.send)},l0=function(){return n(this,C).messages.some(t=>t.role==="user")},F0=function(t){let s=document.createElement("div");s.className="cr-opening-suggestions";let o=document.createElement("div");o.className="cr-suggestion-tabs",o.setAttribute("role","group"),o.setAttribute("aria-label",t.suggestionGroup);let a=[{id:"questions",label:t.suggestionPrompts},{id:"cards",label:t.suggestionCards}];for(let p of a){let d=document.createElement("button");d.type="button",d.className="cr-suggestion-tab",d.dataset.suggestionTab=p.id,d.setAttribute("aria-pressed",String(n(this,$)===p.id)),d.textContent=p.label,o.appendChild(d)}let i=n(this,v)?.suggestions,c=i?.length?i:n(this,P).length?n(this,P):t.defaultSuggestions,u=n(this,$)==="questions"?c.map(p=>({label:p})):t.componentSuggestions,g=document.createElement("div");g.className="cr-suggestion-items",g.dataset.view=n(this,$);for(let p of u){let d=document.createElement("button");d.type="button",d.className="cr-suggestion",d.dataset.suggestion=p.label,"component"in p&&p.component&&(d.dataset.demoCard=p.component),d.textContent=p.label,g.appendChild(d)}return s.append(o,g),s},ue=function(t,s){let o=W(n(this,v)),a=document.createElement("section");a.className="cr-agent-response";for(let i of s.elements.response.children){let c=s.elements[i],u=document.createElement("article");if(u.className=`cr-agent-card cr-agent-card-${c.type.toLowerCase()}`,c.type==="Progress"){let g=document.createElement("strong");if(g.textContent=c.props.stage,u.appendChild(g),typeof c.props.total=="number"){let p=document.createElement("span");p.textContent=`${c.props.completed} / ${c.props.total}`,u.appendChild(p)}}else if(c.type==="Evidence"){let g=document.createElement("strong");g.textContent=o.evidence,u.appendChild(g);for(let p of c.props.refs){let d=document.createElement("div");d.className="cr-agent-evidence";let b=document.createElement("strong");if(b.textContent=p.title,d.appendChild(b),p.excerpt){let w=document.createElement("p");w.textContent=p.excerpt,d.appendChild(w)}u.appendChild(d)}}else if(c.type==="Question"){let g=document.createElement("strong");g.textContent=o.question,u.append(g,document.createTextNode(c.props.question))}else if(c.type==="ProposalBatch"){let g=document.createElement("strong");g.textContent=o.proposals,u.appendChild(g);for(let p of c.props.views){let d=document.createElement("p");d.textContent=p.summary,u.appendChild(d)}}else if(c.type==="Representation"){let g=document.createElement("strong");g.textContent=o.representation,u.appendChild(g)}a.appendChild(u)}t.appendChild(a)},pe=function(t,s,o){let a=document.createElement("div");a.className="cr-sources",a.setAttribute("aria-label",o.sources);for(let i of s){let c=w0(i.url),u=c?document.createElement("a"):document.createElement("span");u.className="cr-source",u.textContent=i.title??i.sourceRefId,c&&u instanceof HTMLAnchorElement&&(u.href=c,u.target="_blank",u.rel="noopener noreferrer"),a.appendChild(u)}t.appendChild(a)},ge=function(t,s,o){let a=document.createElement("div");a.className="cr-suggestions",a.setAttribute("aria-label",o.suggestions);for(let i of s){let c=document.createElement("button");c.type="button",c.className="cr-suggestion",c.dataset.suggestion=i,c.textContent=i,a.appendChild(c)}t.appendChild(a)};function g0(e=customElements){e.get(j0)||e.define(j0,u0)}function Je(e=document.currentScript){if(e)return e;let r=document.querySelectorAll('script[src*="embed/widget.js"], script[data-contextrocket-api-key], script[data-contextrocket-handle]');for(let t=r.length-1;t>=0;t-=1){let s=r.item(t);if(s&&N(s))return s}return null}function m0(e=Je()){if(!e)return null;if(!N(e))return console.warn("[ContextRocket] live embed requires data-contextrocket-api-base; omit data-contextrocket-mode for a canned demo"),null;g0();let t=document.createElement(j0);for(let s of e.attributes)s.name.startsWith("data-")&&t.setAttribute(s.name,s.value);return document.body.appendChild(t),t}g0();typeof document<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>m0()):m0());return we(Xe);})();
