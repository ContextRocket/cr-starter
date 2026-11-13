"use strict";var ContextRocketWidget=(()=>{var Ue=Object.defineProperty;var Kt=Object.getOwnPropertyDescriptor;var Vt=Object.getOwnPropertyNames;var Gt=Object.prototype.hasOwnProperty;var at=t=>{throw TypeError(t)};var Qt=(t,n)=>{for(var e in n)Ue(t,e,{get:n[e],enumerable:!0})},Jt=(t,n,e,a)=>{if(n&&typeof n=="object"||typeof n=="function")for(let o of Vt(n))!Gt.call(t,o)&&o!==e&&Ue(t,o,{get:()=>n[o],enumerable:!(a=Kt(n,o))||a.enumerable});return t};var Xt=t=>Jt(Ue({},"__esModule",{value:!0}),t);var Oe=(t,n,e)=>n.has(t)||at("Cannot "+e);var r=(t,n,e)=>(Oe(t,n,"read from private field"),e?e.call(t):n.get(t)),y=(t,n,e)=>n.has(t)?at("Cannot add the same private member more than once"):n instanceof WeakSet?n.add(t):n.set(t,e),f=(t,n,e,a)=>(Oe(t,n,"write to private field"),a?a.call(t,e):n.set(t,e),e),h=(t,n,e)=>(Oe(t,n,"access private method"),e);var De=(t,n,e,a)=>({set _(o){f(t,n,o,e)},get _(){return r(t,n,a)}});var I0={};Qt(I0,{ContextRocketChatElement:()=>ye,applyTransportEvent:()=>Ie,beginSend:()=>Fe,buildPoweredByHref:()=>me,canSend:()=>Ce,collectEmbedA2aSubscribe:()=>bt,createInitialChatState:()=>fe,mountFromScriptTag:()=>Ee,parseWidgetConfig:()=>X,registerContextRocketChatElement:()=>ke,renderMarkdown:()=>We,resetMessageIdCounter:()=>wt,streamEmbedA2aSubscribe:()=>he});function _e(t,n=typeof document>"u"?"":document.documentElement.lang){if(t==="en"||t==="es"||t==="de"||t==="zh")return t;let e=n.trim().toLowerCase().split(/[-_]/)[0];return e==="es"||e==="de"||e==="zh"?e:"en"}var Yt={en:{defaultTitle:"Ask ContextRocket",poweredBy:"Powered by ContextRocket",poweredByLabel:"Powered by",generic:"Something went wrong. Try again.",demoResponse:"This preview uses sample content to show the structured response cards this chat can render. Configure live mode to connect an organization\u2019s agent.",demoProgress:"Preview only \xB7 reviewing sample sources",demoEvidenceTitle:"Example source",demoEvidenceExcerpt:"Sample evidence demonstrates how an answer can cite its source.",demoEvidenceTitleTwo:"A second source",demoEvidenceExcerptTwo:"Each card uses a typed JSON Render component.",demoQuestion:"Which topic would you like to explore next?",demoProposal:"A sample proposal shows how an idea can be summarized.",demoProposalTwo:"Related proposals can be grouped together.",demoSuggestions:["Can you tell me more?","What should I explore next?","Show me an example."],open:"Open chat",close:"Close chat",expand:"Expand chat",collapse:"Exit full screen",send:"Send",stop:"Stop response",retry:"Try again",placeholder:"Ask a question\u2026",working:"Thinking\u2026",submitted:"Connecting\u2026",inputRequired:"A response is needed to continue.",canceled:"Response stopped. You can try again.",interrupted:"The connection ended before the answer was complete. Please try again.",unsupported:"This content is not available in this chat. Please try again.",sources:"Sources",suggestions:"Suggested follow-ups",unavailable:"This response card is unavailable.",evidence:"Evidence",question:"Question",proposals:"Proposals",representation:"Representation",emptyTitle:"Start a conversation",emptyDescription:"Ask a question to explore what I can help you find.",suggestionPrompts:"Suggestions",suggestionCards:"Response cards",suggestionGroup:"Opening suggestions",defaultSuggestions:["What can you help me find?","How do your answers use sources?","What can I ask about?"],componentSuggestions:[{label:"Preview all response cards"},{component:"Evidence",label:"Show an evidence card"},{component:"Progress",label:"Show a progress card"},{component:"Question",label:"Preview a question card"},{component:"ProposalBatch",label:"Show a proposal card"},{component:"Representation",label:"Show a representation card"}]},es:{defaultTitle:"Pregunta a ContextRocket",poweredBy:"Con tecnolog\xEDa de ContextRocket",poweredByLabel:"Con tecnolog\xEDa de",generic:"Algo sali\xF3 mal. Int\xE9ntalo de nuevo.",demoResponse:"Esta vista previa usa contenido de ejemplo para mostrar las tarjetas estructuradas del chat. Configura el modo en vivo para conectar el agente de una organizaci\xF3n.",demoProgress:"Vista previa \xB7 revisando fuentes de ejemplo",demoEvidenceTitle:"Fuente de ejemplo",demoEvidenceExcerpt:"La evidencia de ejemplo muestra c\xF3mo una respuesta puede citar su fuente.",demoEvidenceTitleTwo:"Otra fuente",demoEvidenceExcerptTwo:"Cada tarjeta utiliza un componente JSON Render tipado.",demoQuestion:"\xBFQu\xE9 tema te gustar\xEDa explorar ahora?",demoProposal:"Una propuesta de ejemplo muestra c\xF3mo resumir una idea.",demoProposalTwo:"Las propuestas relacionadas se pueden agrupar.",demoSuggestions:["\xBFPuedes contarme m\xE1s?","\xBFQu\xE9 puedo explorar ahora?","Mu\xE9strame un ejemplo."],open:"Abrir chat",close:"Cerrar chat",expand:"Expandir chat",collapse:"Salir de pantalla completa",send:"Enviar",stop:"Detener respuesta",retry:"Intentar de nuevo",placeholder:"Haz una pregunta\u2026",working:"Pensando\u2026",submitted:"Conectando\u2026",inputRequired:"Se necesita una respuesta para continuar.",canceled:"Respuesta detenida. Puedes intentarlo de nuevo.",interrupted:"La conexi\xF3n termin\xF3 antes de completar la respuesta. Int\xE9ntalo de nuevo.",unsupported:"Este contenido no est\xE1 disponible en este chat. Int\xE9ntalo de nuevo.",sources:"Fuentes",suggestions:"Sugerencias",unavailable:"Esta tarjeta de respuesta no est\xE1 disponible.",evidence:"Evidencias",question:"Pregunta",proposals:"Propuestas",representation:"Representaci\xF3n",emptyTitle:"Inicia una conversaci\xF3n",emptyDescription:"Haz una pregunta para descubrir qu\xE9 puedo ayudarte a encontrar.",suggestionPrompts:"Sugerencias",suggestionCards:"Tarjetas de respuesta",suggestionGroup:"Sugerencias iniciales",defaultSuggestions:["\xBFQu\xE9 puedes ayudarme a encontrar?","\xBFC\xF3mo usas fuentes en tus respuestas?","\xBFSobre qu\xE9 puedo preguntar?"],componentSuggestions:[{label:"Ver todas las tarjetas de respuesta"},{component:"Evidence",label:"Mu\xE9strame una tarjeta de evidencia"},{component:"Progress",label:"Mu\xE9strame una tarjeta de progreso"},{component:"Question",label:"Ver una tarjeta de pregunta"},{component:"ProposalBatch",label:"Mu\xE9strame una tarjeta de propuesta"},{component:"Representation",label:"Mu\xE9strame una tarjeta de representaci\xF3n"}]},de:{defaultTitle:"Frag ContextRocket",poweredBy:"Mit ContextRocket",poweredByLabel:"Mit",generic:"Etwas ist schiefgelaufen. Versuch es erneut.",demoResponse:"Diese Vorschau verwendet Beispieldaten f\xFCr die strukturierten Antwortkarten. Richte den Live-Modus ein, um den Agenten einer Organisation zu verbinden.",demoProgress:"Vorschau \xB7 Beispielquellen werden gepr\xFCft",demoEvidenceTitle:"Beispielquelle",demoEvidenceExcerpt:"Beispielbelege zeigen, wie eine Antwort ihre Quelle zitieren kann.",demoEvidenceTitleTwo:"Eine weitere Quelle",demoEvidenceExcerptTwo:"Jede Karte verwendet eine typisierte JSON-Render-Komponente.",demoQuestion:"Welches Thema m\xF6chtest du als N\xE4chstes erkunden?",demoProposal:"Ein Beispielvorschlag zeigt, wie sich eine Idee zusammenfassen l\xE4sst.",demoProposalTwo:"Verwandte Vorschl\xE4ge lassen sich gruppieren.",demoSuggestions:["Kannst du mehr dazu sagen?","Was kann ich als N\xE4chstes erkunden?","Zeig mir ein Beispiel."],open:"Chat \xF6ffnen",close:"Chat schlie\xDFen",expand:"Chat maximieren",collapse:"Vollbild verlassen",send:"Senden",stop:"Antwort stoppen",retry:"Erneut versuchen",placeholder:"Frage stellen\u2026",working:"Denkt nach\u2026",submitted:"Verbindung wird hergestellt\u2026",inputRequired:"F\xFCr die Fortsetzung ist eine Antwort erforderlich.",canceled:"Antwort gestoppt. Du kannst es erneut versuchen.",interrupted:"Die Verbindung endete vor Abschluss der Antwort. Bitte erneut versuchen.",unsupported:"Dieser Inhalt ist in diesem Chat nicht verf\xFCgbar. Bitte erneut versuchen.",sources:"Quellen",suggestions:"Vorschl\xE4ge",unavailable:"Diese Antwortkarte ist nicht verf\xFCgbar.",evidence:"Belege",question:"Frage",proposals:"Vorschl\xE4ge",representation:"Darstellung",emptyTitle:"Gespr\xE4ch beginnen",emptyDescription:"Stelle eine Frage und entdecke, wobei ich dir helfen kann.",suggestionPrompts:"Vorschl\xE4ge",suggestionCards:"Antwortkarten",suggestionGroup:"Einstiegsvorschl\xE4ge",defaultSuggestions:["Wobei kannst du mir helfen?","Wie belegst du deine Antworten?","Was kann ich fragen?"],componentSuggestions:[{label:"Alle Antwortkarten ansehen"},{component:"Evidence",label:"Zeig mir eine Quellenkarte"},{component:"Progress",label:"Zeig mir eine Fortschrittskarte"},{component:"Question",label:"Eine Fragekarte ansehen"},{component:"ProposalBatch",label:"Zeig mir eine Vorschlagskarte"},{component:"Representation",label:"Zeig mir eine Repr\xE4sentationskarte"}]},zh:{defaultTitle:"\u8BE2\u95EE ContextRocket",poweredBy:"\u7531 ContextRocket \u63D0\u4F9B\u652F\u6301",poweredByLabel:"\u7531\u4EE5\u4E0B\u63D0\u4F9B\u652F\u6301",generic:"\u51FA\u4E86\u70B9\u95EE\u9898\uFF0C\u8BF7\u91CD\u8BD5\u3002",demoResponse:"\u6B64\u9884\u89C8\u4F7F\u7528\u793A\u4F8B\u5185\u5BB9\u5C55\u793A\u804A\u5929\u53EF\u5448\u73B0\u7684\u7ED3\u6784\u5316\u56DE\u590D\u5361\u7247\u3002\u914D\u7F6E\u5B9E\u65F6\u6A21\u5F0F\u5373\u53EF\u8FDE\u63A5\u7EC4\u7EC7\u4EE3\u7406\u3002",demoProgress:"\u9884\u89C8 \xB7 \u6B63\u5728\u68C0\u67E5\u793A\u4F8B\u6765\u6E90",demoEvidenceTitle:"\u793A\u4F8B\u6765\u6E90",demoEvidenceExcerpt:"\u793A\u4F8B\u8BC1\u636E\u5C55\u793A\u4E86\u56DE\u590D\u5982\u4F55\u5F15\u7528\u6765\u6E90\u3002",demoEvidenceTitleTwo:"\u53E6\u4E00\u4E2A\u6765\u6E90",demoEvidenceExcerptTwo:"\u6BCF\u5F20\u5361\u7247\u90FD\u4F7F\u7528\u7C7B\u578B\u5316\u7684 JSON Render \u7EC4\u4EF6\u3002",demoQuestion:"\u63A5\u4E0B\u6765\u60F3\u4E86\u89E3\u54EA\u4E2A\u4E3B\u9898\uFF1F",demoProposal:"\u793A\u4F8B\u65B9\u6848\u5C55\u793A\u4E86\u5982\u4F55\u603B\u7ED3\u4E00\u4E2A\u60F3\u6CD5\u3002",demoProposalTwo:"\u76F8\u5173\u65B9\u6848\u53EF\u4EE5\u7EC4\u5408\u5C55\u793A\u3002",demoSuggestions:["\u53EF\u4EE5\u518D\u8BE6\u7EC6\u4ECB\u7ECD\u5417\uFF1F","\u63A5\u4E0B\u6765\u53EF\u4EE5\u4E86\u89E3\u4EC0\u4E48\uFF1F","\u7ED9\u6211\u770B\u4E00\u4E2A\u793A\u4F8B\u3002"],open:"\u6253\u5F00\u804A\u5929",close:"\u5173\u95ED\u804A\u5929",expand:"\u5C55\u5F00\u804A\u5929",collapse:"\u9000\u51FA\u5168\u5C4F",send:"\u53D1\u9001",stop:"\u505C\u6B62\u56DE\u590D",retry:"\u91CD\u8BD5",placeholder:"\u8BF7\u8F93\u5165\u95EE\u9898\u2026",working:"\u6B63\u5728\u601D\u8003\u2026",submitted:"\u6B63\u5728\u8FDE\u63A5\u2026",inputRequired:"\u8BF7\u586B\u5199\u56DE\u590D\u540E\u7EE7\u7EED\u3002",canceled:"\u56DE\u590D\u5DF2\u505C\u6B62\uFF0C\u60A8\u53EF\u4EE5\u91CD\u8BD5\u3002",interrupted:"\u8FDE\u63A5\u5728\u56DE\u590D\u5B8C\u6210\u524D\u4E2D\u65AD\uFF0C\u8BF7\u91CD\u8BD5\u3002",unsupported:"\u6B64\u804A\u5929\u6682\u4E0D\u652F\u6301\u8BE5\u5185\u5BB9\uFF0C\u8BF7\u91CD\u8BD5\u3002",sources:"\u6765\u6E90",suggestions:"\u540E\u7EED\u5EFA\u8BAE",unavailable:"\u6B64\u56DE\u590D\u5361\u7247\u6682\u4E0D\u53EF\u7528\u3002",evidence:"\u4F9D\u636E",question:"\u95EE\u9898",proposals:"\u65B9\u6848",representation:"\u8868\u793A\u65B9\u5F0F",emptyTitle:"\u5F00\u59CB\u5BF9\u8BDD",emptyDescription:"\u63D0\u51FA\u95EE\u9898\uFF0C\u770B\u770B\u6211\u80FD\u4E3A\u60A8\u67E5\u627E\u4EC0\u4E48\u3002",suggestionPrompts:"\u5EFA\u8BAE",suggestionCards:"\u56DE\u590D\u5361\u7247",suggestionGroup:"\u5F00\u573A\u5EFA\u8BAE",defaultSuggestions:["\u60A8\u80FD\u5E2E\u6211\u67E5\u627E\u4EC0\u4E48\uFF1F","\u60A8\u7684\u56DE\u7B54\u5982\u4F55\u5F15\u7528\u6765\u6E90\uFF1F","\u6211\u53EF\u4EE5\u8BE2\u95EE\u54EA\u4E9B\u5185\u5BB9\uFF1F"],componentSuggestions:[{label:"\u9884\u89C8\u6240\u6709\u56DE\u590D\u5361\u7247"},{component:"Evidence",label:"\u663E\u793A\u8BC1\u636E\u5361\u7247"},{component:"Progress",label:"\u663E\u793A\u8FDB\u5EA6\u5361\u7247"},{component:"Question",label:"\u9884\u89C8\u95EE\u9898\u5361\u7247"},{component:"ProposalBatch",label:"\u663E\u793A\u65B9\u6848\u5361\u7247"},{component:"Representation",label:"\u663E\u793A\u8868\u793A\u5361\u7247"}]}};function P(t){return Yt[_e(t.locale)]}var Zt="contextrocket.agent.response.v2",e0=/^[A-Za-z0-9][A-Za-z0-9_.:-]{0,179}$/,t0=new Set(["__proto__","prototype","constructor"]),W=t=>typeof t=="object"&&t!==null&&!Array.isArray(t),j=t=>typeof t=="string"&&e0.test(t)&&!t0.has(t),pe=(t,n,e=!1)=>typeof t=="string"&&t.length<=n&&(e||!!t.trim());function r0(t,n){if(!W(n))return!1;let e=Object.keys(n).sort().join(",");return t==="Evidence"?e==="refs"&&Array.isArray(n.refs)&&n.refs.length>0&&n.refs.length<=20&&n.refs.every(a=>W(a)&&Object.keys(a).every(o=>o==="title"||o==="excerpt")&&pe(a.title,160)&&(a.excerpt===void 0||pe(a.excerpt,500,!0))):t==="Progress"?e==="completed,stage,total"&&pe(n.stage,240)&&(n.completed===null&&n.total===null||Number.isInteger(n.completed)&&Number.isInteger(n.total)&&n.completed>=0&&n.total>0&&n.completed<=n.total):t==="Question"?["id,interactionId,question,questionId","id,inputRef,interactionId,question,questionId"].includes(e)&&j(n.id)&&j(n.interactionId)&&j(n.questionId)&&pe(n.question,1e3)&&(n.inputRef===void 0||W(n.inputRef)):t==="ProposalBatch"?e==="views"&&Array.isArray(n.views)&&n.views.length>0&&n.views.length<=10&&n.views.every(a=>W(a)&&Object.keys(a).sort().join(",")==="id,summary,workItemId"&&j(a.id)&&j(a.workItemId)&&pe(a.summary,280,!0))&&new Set(n.views.map(a=>a.id)).size===n.views.length:t==="Representation"?e==="id,organizationId,representationId"&&j(n.id)&&j(n.organizationId)&&j(n.representationId):!1}function Ne(t){if(!W(t)||!W(t.metadata)||!Object.prototype.hasOwnProperty.call(t,"data")||Object.prototype.hasOwnProperty.call(t,"kind"))return;let n=["text","url","raw","data"].filter(d=>Object.prototype.hasOwnProperty.call(t,d));if(n.length!==1||n[0]!=="data"||t.metadata["cr.catalog"]!==Zt||t.metadata["cr.component"]!=="agent_ui")return;let e=t.data;if(!W(e)||Object.keys(e).sort().join(",")!=="component,spec"||e.component!=="agent_ui")return null;try{if(new TextEncoder().encode(JSON.stringify(e)).length>65536)return null}catch{return null}let a=e.spec;if(!W(a)||Object.keys(a).sort().join(",")!=="elements,root"||a.root!=="response"||!W(a.elements))return null;let o=a.elements,s=Object.keys(o);if(s.length<2||s.length>33||!s.every(j))return null;let i=o.response;if(!W(i)||Object.keys(i).sort().join(",")!=="children,props,type"||i.type!=="Response"||!W(i.props)||Object.keys(i.props).length!==0||!Array.isArray(i.children))return null;let c=[];for(let d of i.children){if(!j(d))return null;c.push(d)}if(new Set(c).size!==c.length||c.length!==s.length-1||c.some(d=>!Object.prototype.hasOwnProperty.call(o,d))||s.some(d=>d!=="response"&&!c.includes(d)))return null;for(let d of c){let u=o[d];if(!W(u)||Object.keys(u).sort().join(",")!=="children,props,type"||!Array.isArray(u.children)||u.children.length!==0||typeof u.type!="string"||!r0(u.type,u.props))return null}return a}async function*ot(t,n){let e=new TextDecoder,a="",o="message",s=[],i=()=>{t.cancel()};n?.addEventListener("abort",i,{once:!0});try{for(;!n?.aborted;){let{done:c,value:d}=await t.read();if(c)break;a+=e.decode(d,{stream:!0});let u=a.split(`
`);a=u.pop()??"";for(let p of u)p.startsWith("event:")?o=p.slice(6).trim():p.startsWith("data:")?s.push(p.slice(5).trim()):p===""&&s.length>0&&(yield{type:o,data:s.join(`
`)},o="message",s.length=0)}}finally{n?.removeEventListener("abort",i);try{await t.cancel()}finally{t.releaseLock()}}}var b="contextrocket",Ae=120,st=400,it=100,n0="#FF2B67",ge="#0E0F13",ae="#FFFFFF",a0=2048;function x(t,...n){for(let e of n){let a=t.getAttribute(e)?.trim();if(a)return a}}function Me(t,n){return["true","1","yes"].includes(t.getAttribute(n)?.trim().toLowerCase()??"")}function q(t,n){if(!t)return;let e=t.replace(/[\u0000-\u001f\u007f]/g,"").trim();return e?e.slice(0,n):void 0}function oe(t,n){if(!(!t||t.length>a0))try{let e=new URL(t,n);return e.protocol!=="https:"&&e.protocol!=="http:"?void 0:t}catch{return}}function A(t){if(t)return/^(#[0-9a-f]{3,8}|rgb(a)?\([^)]{1,80}\)|hsl(a)?\([^)]{1,80}\))$/i.test(t)?t:void 0}function o0(t){let n=t.trim();if(/^#[0-9a-f]{3}$/i.test(n))return`#${n.slice(1).split("").map(e=>e+e).join("").toUpperCase()}`;if(/^#[0-9a-f]{6}$/i.test(n))return n.toUpperCase()}function ct(t){let n=[1,3,5].map(e=>{let a=Number.parseInt(t.slice(e,e+2),16)/255;return a<=.04045?a/12.92:((a+.055)/1.055)**2.4});return n[0]*.2126+n[1]*.7152+n[2]*.0722}function dt(t,n){let e=[ct(t),ct(n)].sort((a,o)=>o-a);return(e[0]+.05)/(e[1]+.05)}function s0(t){let n=t?.trim();if(!n||n.toLowerCase()==="pink")return{background:n0,foreground:ae};if(n.toLowerCase()==="ink")return{background:ge,foreground:ae};let e=o0(n);return e?dt(e,ae)>=3?{background:e,foreground:ae}:dt(e,ge)>=3?{background:e,foreground:ge}:{background:ge,foreground:ae}:{background:ge,foreground:ae}}function X(t){let n=x(t,`data-${b}-api-key`),e=x(t,`data-${b}-handle`),o=x(t,`data-${b}-subject-kind`)==="person"?"person":"company",s=x(t,`data-${b}-api-base`),c=x(t,`data-${b}-mode`)==="live"?"live":"demo";if(c==="live"&&!s)return null;let d=x(t,`data-${b}-accent`),u=s0(x(t,`data-${b}-launcher-color`)),p=x(t,`data-${b}-greeting`),g=x(t,`data-${b}-title`),k=x(t,`data-${b}-header-logo`),m=x(t,`data-${b}-header-background`),v=x(t,`data-${b}-header-foreground`),_=x(t,`data-${b}-subtitle`),D=x(t,`data-${b}-title-badge`),qt=x(t,`data-${b}-launcher-appearance`),Ut=x(t,`data-${b}-agent-avatar-style`),Ot=x(t,`data-${b}-agent-identity`),Ye=x(t,`data-${b}-agent-header-start`),Ze=x(t,`data-${b}-agent-header-end`),Se=x(t,`data-${b}-launcher-avatar-background`),et=x(t,`data-${b}-agent-avatar`),tt=x(t,`data-${b}-launcher-avatar`),rt=x(t,`data-${b}-ref`),$e=x(t,`data-${b}-position`),Dt=x(t,`data-${b}-locale`),ze=x(t,`data-${b}-powered-by-logo`),_t=Me(t,`data-${b}-consent-gate`),nt=x(t,`data-${b}-suggestions`),je;if(nt)try{let Te=JSON.parse(nt);if(Array.isArray(Te)){let ue=Te.filter(qe=>typeof qe=="string").map(qe=>qe.trim().slice(0,200)).filter(Boolean).slice(0,5);ue.length&&(je=ue)}}catch{}let Nt={backgroundColor:x(t,`data-${b}-background`),foregroundColor:x(t,`data-${b}-foreground`),surfaceColor:x(t,`data-${b}-surface`),mutedColor:x(t,`data-${b}-muted`),borderColor:x(t,`data-${b}-border`)};return{...s?{apiBaseUrl:s.replace(/\/$/,"")}:{},mode:c,...n?{apiKey:n}:{},...e?{handle:e}:{},subjectKind:o,...A(d)?{accentColor:A(d)}:{},launcherColor:u.background,launcherForeground:u.foreground,...q(p,st)?{greeting:q(p,st)}:{},...q(g,Ae)?{title:q(g,Ae)}:{},...oe(k,t.ownerDocument.baseURI)?{headerLogoUrl:oe(k,t.ownerDocument.baseURI)}:{},...A(m)?{headerBackgroundColor:A(m)}:{},...A(v)?{headerForegroundColor:A(v)}:{},...q(_,Ae)?{subtitle:q(_,Ae)}:{},...q(D,24)?{titleBadge:q(D,24)}:{},...qt==="portrait"?{launcherAppearance:"portrait"}:{},...A(Se)||Se?.toLowerCase()==="transparent"?{launcherAvatarBackground:Se.toLowerCase()==="transparent"?"transparent":A(Se)}:{},...Ut==="cutout"?{agentAvatarStyle:"cutout"}:{},agentIdentity:Ot==="probe"?"probe":"contextrocket",...A(Ye)?{agentHeaderStartColor:A(Ye)}:{},...A(Ze)?{agentHeaderEndColor:A(Ze)}:{},...oe(et,t.ownerDocument.baseURI)?{agentAvatarUrl:oe(et,t.ownerDocument.baseURI)}:{},...oe(tt,t.ownerDocument.baseURI)?{launcherAvatarUrl:oe(tt,t.ownerDocument.baseURI)}:{},...q(rt,it)?{ref:q(rt,it)}:{},...Object.fromEntries(Object.entries(Nt).flatMap(([Te,ue])=>A(ue)?[[Te,A(ue)]]:[])),...ze==="ink"||ze==="white"?{poweredByLogo:ze}:{},..._t?{consentGate:!0}:{},...je?{suggestions:je}:{},...$e==="bottom-right"||$e==="bottom-left"?{position:$e}:{},...Me(t,`data-${b}-fullscreen`)?{fullscreen:!0}:{},...Me(t,`data-${b}-fullscreen-on-open`)?{fullscreenOnOpen:!0}:{},...Me(t,`data-${b}-fullscreen-on-load`)?{fullscreenOnLoad:!0}:{},locale:_e(Dt,t.ownerDocument.documentElement.lang)}}function lt(t){if(!t.apiBaseUrl)return null;let n=t.apiBaseUrl.replace(/\/$/,"");if(!t.handle)return`${n}/a2a`;let e=t.subjectKind??"company";return`${n}/${e}/${encodeURIComponent(t.handle)}/a2a`}function ut(t,n,e){return`${t.replace(/\/$/,"")}/${n}/${encodeURIComponent(e)}/agent-card.json`}function me(t){let n="https://contextrocket.com",e=t.ref??t.handle??"widget";return`${n}?ref=${encodeURIComponent(e)}`}function i0(t=fetch){return{request:(n,e)=>t(n,e)}}var mt=i0(),c0=new Set(["submitted","working","input-required","completed","canceled","failed"]),d0="1.0";function l0(t,n){let e=P(t),a={progress:{type:"Progress",props:{stage:e.demoProgress,completed:2,total:4},children:[]},evidence:{type:"Evidence",props:{refs:[{title:e.demoEvidenceTitle,excerpt:e.demoEvidenceExcerpt},{title:e.demoEvidenceTitleTwo,excerpt:e.demoEvidenceExcerptTwo}]},children:[]},question:{type:"Question",props:{id:"demo-question",question:e.demoQuestion,interactionId:"demo-interaction",questionId:"demo-question-1"},children:[]},proposals:{type:"ProposalBatch",props:{views:[{id:"demo-proposal-1",workItemId:"demo-work-1",summary:e.demoProposal},{id:"demo-proposal-2",workItemId:"demo-work-2",summary:e.demoProposalTwo}]},children:[]},representation:{type:"Representation",props:{id:"demo-representation",organizationId:"demo-organization",representationId:"demo-artifact"},children:[]}},s=n?{Evidence:"evidence",Progress:"progress",Question:"question",ProposalBatch:"proposals",Representation:"representation"}[n]:null,i=s?[s]:["progress","evidence","question","proposals","representation"],c=Object.fromEntries(i.map(d=>[d,a[d]]));return c.response={type:"Response",props:{},children:i},{root:"response",elements:c}}function u0(t){if(typeof t!="string"||!t)return null;let n=t.replace(/^TASK_STATE_/,"").toLowerCase().replace(/_/g,"-");return ft(n)?n:null}var ht=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,Y="Something went wrong. Please try again.",p0="The connection ended before the answer was complete. Please try again.",pt="This content is not available in this chat. Please try again.";function M(t){return typeof t=="object"&&t!==null}function ft(t){return typeof t=="string"&&c0.has(t)}function g0(t){return!M(t)||!Array.isArray(t.parts)?[]:t.parts.flatMap(n=>!M(n)||typeof n.text!="string"||!n.text?[]:[n.text])}function Ct(t){return M(t)?M(t.metadata)?t.metadata:{}:{}}function m0(...t){for(let n of t){let e=Ct(n).source_refs;if(!Array.isArray(e))continue;return e.flatMap(o=>!M(o)||typeof o.sourceRefId!="string"?[]:[{sourceRefId:o.sourceRefId.slice(0,200),...typeof o.title=="string"?{title:o.title.slice(0,160)}:{},...typeof o.excerpt=="string"?{excerpt:o.excerpt.slice(0,600)}:{},...typeof o.url=="string"?{url:o.url.slice(0,2e3)}:{}}]).slice(0,8)}}function h0(...t){for(let n of t){let e=Ct(n).suggestions;if(Array.isArray(e))return e.filter(a=>typeof a=="string").map(a=>a.trim().slice(0,200)).filter(Boolean).slice(0,5)}}function Re(t,n,...e){let a=m0(...e),o=h0(...e),s=f0(...e);return{type:"meta",state:t,terminal:n,...a?{sourceRefs:a}:{},...o?{suggestions:o}:{},...s.spec?{responseSpec:s.spec}:{},...s.unavailable?{unavailable:!0}:{}}}function f0(...t){for(let n of t)if(!(!M(n)||!Array.isArray(n.parts)))for(let e of n.parts){let a=Ne(e);if(a!==void 0)return a?{spec:a}:{unavailable:!0}}return{}}function C0(t){let n=M(t.status)?t.status:void 0,e=u0(n?.state);if(!ft(e))return[];let a=typeof t.taskId=="string"?t.taskId:void 0,o=[t,n,n?.message];if(e==="failed"||e==="canceled")return[Re(e,!0,...o),{type:"error",message:Y,reason:"generic"}];let s=w0(...o);return e==="completed"||e==="input-required"?[Re(e,!0,...o),...s,{type:"done",taskId:a}]:[Re(e,!1,...o),...s]}function b0(t){let n=M(t.artifact)?t.artifact:void 0,e=g0(n).map(a=>({type:"delta",text:a}));return e.push(Re("working",!1,t,n)),e}function v0(t){if(!M(t)||t.jsonrpc!=="2.0")return[{type:"unsupported",message:pt}];if(t.error!==void 0&&t.error!==null)return[{type:"error",message:Y,reason:"generic"}];let n=t.result;return M(n)?M(n.statusUpdate)?C0(n.statusUpdate):M(n.artifactUpdate)?b0(n.artifactUpdate):[{type:"unsupported",message:pt}]:[]}function w0(...t){for(let n of t){if(!M(n))continue;let e=M(n.metadata)?n.metadata:n,a=typeof n.contextId=="string"&&n.contextId||typeof e.thread_id=="string"&&e.thread_id||typeof e.threadId=="string"&&e.threadId||void 0;if(a&&ht.test(a))return[{type:"session",threadId:a}]}return[]}function y0(t){try{return v0(JSON.parse(t))}catch{return[{type:"error",message:Y,reason:"generic"}]}}async function*x0(t,n){if(t)for await(let e of ot(t.getReader(),n))for(let a of y0(e.data))yield a}async function*L0(t,n,e){let a=n.threadId??"demo-thread";yield{type:"meta",state:"working"};for(let o of P(t).demoResponse.split(/(\s+)/)){if(e?.aborted)return;o&&(yield{type:"delta",text:o}),await new Promise(s=>setTimeout(s,o.trim()?18:4))}yield{type:"meta",state:"working",responseSpec:l0(t,n.demoCard),suggestions:[...P(t).demoSuggestions]},!e?.aborted&&(yield{type:"session",threadId:a},yield{type:"done",taskId:"demo-task"})}var gt=new WeakMap;async function*he(t,n,e=mt,a){if(a?.aborted)return;if(t.mode==="demo"){yield*L0(t,n,a);return}let o=n.messageId??gt.get(n)??crypto.randomUUID();n.messageId==null&&gt.set(n,o);let s={messageId:o,role:"ROLE_USER",parts:[{text:n.message}]};n.threadId&&ht.test(n.threadId)&&(s.contextId=n.threadId);let i={};t.handle&&(i.handle=t.handle);let c=t.locale?.trim().toLowerCase().split(/[-_]/,1)[0];(c==="en"||c==="es"||c==="de")&&(i.scope={answer_locale:c});let d={jsonrpc:"2.0",id:`embed-chat-${crypto.randomUUID()}`,method:"SendStreamingMessage",params:{message:s,metadata:i}},u=lt(t);if(!u){yield{type:"error",message:Y,reason:"generic"};return}let p={"content-type":"application/json",accept:"text/event-stream","a2a-version":d0};t.locale&&(p["accept-language"]=t.locale),t.apiKey&&(p["x-api-key"]=t.apiKey);let g;try{g=await e.request(u,{method:"POST",headers:p,body:JSON.stringify(d),signal:a})}catch{if(a?.aborted)return;yield{type:"error",message:Y,reason:"generic"};return}if(!g.ok){yield{type:"error",message:Y,reason:"generic"};return}if(!(g.headers.get("content-type")??"").includes("text/event-stream")){yield{type:"error",message:Y,reason:"generic"};return}let m=!1;for await(let v of x0(g.body,a))(v.type==="done"||v.type==="error"||v.type==="unsupported"||v.type==="meta"&&v.terminal)&&(m=!0),yield v;!a?.aborted&&!m&&(yield{type:"error",message:p0,reason:"interrupted"})}async function bt(t,n,e=mt,a){let o=[];for await(let s of he(t,n,e,a))o.push(s);return o}function fe(t){return{status:"idle",messages:t?[{id:"greeting",role:"assistant",content:t}]:[],errorMessage:null,errorReason:null,threadId:null,transportState:null}}var Ke=0;function vt(t){return Ke+=1,`${t}-${Ke}`}function wt(){Ke=0}function Fe(t,n){let e=vt("user"),a=vt("assistant");return{assistantMessageId:a,state:{...t,status:"streaming",errorMessage:null,errorReason:null,messages:[...t.messages,{id:e,role:"user",content:n},{id:a,role:"assistant",content:""}]}}}function Ie(t,n,e){switch(n.type){case"delta":return n.text?{...t,messages:t.messages.map(a=>a.id===e&&a.role==="assistant"?{...a,content:a.content+n.text}:a)}:t;case"session":return{...t,threadId:n.threadId};case"error":return{...t,status:"error",errorMessage:n.message,errorReason:n.reason??"generic"};case"unsupported":return{...t,status:"error",errorMessage:n.message,errorReason:"unsupported"};case"done":return{...t,status:"complete"};case"meta":{let a=n.sourceRefs||n.suggestions||n.responseSpec||n.unavailable?t.messages.map(o=>o.id===e&&o.role==="assistant"?{...o,...n.sourceRefs?{sourceRefs:n.sourceRefs}:{},...n.suggestions?{suggestions:n.suggestions}:{},...n.responseSpec?{responseSpec:n.responseSpec}:{},...n.unavailable?{responseSpec:void 0}:{},...n.unavailable?{responseUnavailable:!0}:{}}:o):t.messages;return{...t,messages:a,transportState:n.state,status:n.terminal&&n.state==="input-required"?"input-required":n.terminal&&n.state==="canceled"?"canceled":t.status}}default:return t}}function Ce(t){return t.status!=="streaming"}function Pe(t){if(t)try{let n=new URL(t);return n.protocol!=="http:"&&n.protocol!=="https:"?void 0:n.href}catch{return}}function B(t){return t.replace(/[&<>"']/g,n=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[n])}function We(t,n){let e=n.split(/\r?\n/),a=!1,o=[],s=(i,c)=>{let d=document.createElement("p");c&&(d.className=c),Ve(d,i),t.appendChild(d)};for(let i of e){if(i.trim().startsWith("```")){if(a){let p=document.createElement("pre"),g=document.createElement("code");g.textContent=o.join(`
`),p.appendChild(g),t.appendChild(p),o=[]}a=!a;continue}if(a){o.push(i);continue}let c=i.match(/^#{1,6}\s+(.+)$/);if(c){let p=document.createElement("p");p.className="cr-markdown-heading";let g=document.createElement("strong");g.textContent=c[1],p.appendChild(g),t.appendChild(p);continue}let d=i.match(/^\s*[-*+]\s+(.+)$/);if(d){let p=document.createElement("ul"),g=document.createElement("li");Ve(g,d[1]),p.appendChild(g),t.appendChild(p);continue}let u=i.match(/^\s*\d+[.)]\s+(.+)$/);if(u){let p=document.createElement("ol"),g=document.createElement("li");Ve(g,u[1]),p.appendChild(g),t.appendChild(p);continue}i.trim()&&s(i)}if(a&&o.length>0){let i=document.createElement("pre"),c=document.createElement("code");c.textContent=o.join(`
`),i.appendChild(c),t.appendChild(i)}}function Ve(t,n){let e=/(\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|__([^_]+)__|`([^`]+)`|\*([^*]+)\*|_([^_]+)_)/g,a=0;for(let o of n.matchAll(e)){let s=o.index??0;if(s>a&&t.appendChild(document.createTextNode(n.slice(a,s))),o[2]&&o[3]){let i=Pe(o[3]);if(i){let c=document.createElement("a");c.href=i,c.target="_blank",c.rel="noopener noreferrer",c.textContent=o[2],t.appendChild(c)}else t.appendChild(document.createTextNode(o[2]))}else if(o[4]||o[5]||o[7]||o[8]){let i=document.createElement(o[4]||o[5]?"strong":"em");i.textContent=o[4]||o[5]||o[7]||o[8]||"",t.appendChild(i)}else if(o[6]){let i=document.createElement("code");i.textContent=o[6],t.appendChild(i)}a=s+o[0].length}a<n.length&&t.appendChild(document.createTextNode(n.slice(a)))}function yt(t="#0e0f13"){return`
:host {
  all: initial;
  /* font-sans */
  font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  /* text-base \u2014 let children use the Tailwind type scale */
  font-size: 1rem;
  line-height: 1.5rem;
  color: #111827; /* gray-900 */
  -webkit-font-smoothing: antialiased;

  --cr-accent: ${t};
  --cr-launcher-bg: #FF2B67;
  --cr-launcher-fg: #FFFFFF;
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
  --cr-fab-shadow: 0 10px 28px -10px rgba(14,15,19,.55);
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
    right: max(0.5rem, env(safe-area-inset-right, 0px));
    bottom: calc(max(0.5rem, env(safe-area-inset-bottom, 0px)) + var(--cr-fab-lift, 0px));
  }

  .cr-root .cr-panel {
    width: min(28rem, calc(100vw - 2rem));
    height: min(37.5rem, calc(100dvh - 2rem));
  }

  .cr-root[data-position="bottom-left"] {
    right: auto;
    left: max(1rem, env(safe-area-inset-left, 0px));
  }

  .cr-root .cr-launcher {
    width: 3rem;
    height: 3rem;
    border-radius: 0.875rem;
  }
}

.cr-root[data-fullscreen="true"] .cr-launcher {
  display: none;
}

.cr-panel[data-open="true"] ~ .cr-launcher {
  display: none;
}

/* 56px rounded-square Rocket launcher */
.cr-launcher {
  width: 3.5rem;
  height: 3.5rem;
  border: none;
  border-radius: 1rem;
  background: var(--cr-launcher-bg);
  color: var(--cr-launcher-fg);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  appearance: none;
  -webkit-appearance: none;
  outline: none;
  box-shadow: var(--cr-fab-shadow);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  pointer-events: auto;
}

.cr-launcher:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 32px -10px rgba(14,15,19,.6);
}

.cr-root[data-launcher-appearance="portrait"] .cr-launcher {
  width: 4rem; height: 4rem; overflow: hidden; isolation: isolate;
  border: 2px solid rgba(255,255,255,.96); border-radius: 50%;
  background: var(--cr-launcher-avatar-bg, linear-gradient(145deg, #fff 4%, #e6e5f3 48%, #8b8fb8 100%));
  box-shadow: 0 8px 26px -8px rgba(49,48,78,.42), 0 0 0 1px rgba(108,115,168,.16);
}
@media (max-width: 30rem) {
  .cr-root[data-launcher-appearance="portrait"] .cr-launcher { width: 3rem; height: 3rem; }
}
.cr-root[data-launcher-appearance="portrait"] .cr-launcher:hover {
  box-shadow: 0 12px 30px -8px rgba(49,48,78,.5), 0 0 0 3px rgba(108,115,168,.18);
}
.cr-root[data-launcher-appearance="portrait"] .cr-launcher .cr-launcher-avatar {
  width: 100%; height: 100%; border: 0; border-radius: inherit;
  object-fit: contain; object-position: center bottom; box-shadow: none;
}
.cr-root[data-launcher-appearance="portrait"] .cr-launcher::after {
  content: ""; position: absolute; z-index: 2; inset: -20%;
  background: linear-gradient(110deg, transparent 38%, rgba(255,255,255,.58) 50%, transparent 62%);
  transform: translateX(-120%); pointer-events: none;
  animation: cr-launcher-sheen 8s ease-in-out infinite;
}
.cr-root[data-launcher-appearance="portrait"] .cr-launcher .cr-launcher-avatar { position: relative; z-index: 1; }
@keyframes cr-launcher-sheen {
  0%, 74%, 100% { transform: translateX(-120%); opacity: 0; }
  78% { opacity: .8; }
  88% { transform: translateX(120%); opacity: 0; }
}

.cr-launcher:focus-visible {
  outline: 2px solid var(--cr-focus);
  outline-offset: 3px;
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

.cr-launcher .cr-launcher-avatar {
  width: calc(100% - .5rem);
  height: calc(100% - .5rem);
  border: 2px solid rgba(255,255,255,.96);
  border-radius: 9999px;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(14,15,19,.24);
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
.cr-probe .cr-agent-avatar { position: relative; z-index: 1; display: block; width: 100%; height: 100%; object-fit: cover; border-radius: inherit; }
.cr-probe[data-identity="contextrocket"] { border-radius: 9999px; background: #0e0f13; color: #fff; }
.cr-probe .cr-agent-mark { position: relative; z-index: 1; display: block; width: 68%; height: 68%; object-fit: contain; }
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
.cr-root[data-header-logo="true"] .cr-header {
  min-height: 4rem;
  background: var(--cr-header-bg, #0E0F13);
  color: var(--cr-header-fg, #FFFFFF);
  border-bottom-color: color-mix(in srgb, var(--cr-header-fg, #FFFFFF) 14%, transparent);
}
.cr-title-brand-logo { display: block; width: auto; height: auto; max-width: 8rem; max-height: 2.5rem; object-fit: contain; }
.cr-root[data-header-logo="true"] .cr-close,
.cr-root[data-header-logo="true"] .cr-fullscreen-toggle { color: var(--cr-header-fg, #FFFFFF); }
.cr-root[data-header-logo="true"] .cr-close:hover,
.cr-root[data-header-logo="true"] .cr-fullscreen-toggle:hover { background: rgb(255 255 255 / .12); color: var(--cr-header-fg, #FFFFFF); }
.cr-root[data-header-logo="true"] .cr-close:focus-visible,
.cr-root[data-header-logo="true"] .cr-fullscreen-toggle:focus-visible { outline-color: var(--cr-header-fg, #FFFFFF); }

.cr-title-copy { display: grid; min-width: 0; }
.cr-title-heading { display: flex; align-items: center; gap: .4rem; min-width: 0; }
.cr-title-subtitle { margin-top: .05rem; color: var(--cr-muted); font-size: .6875rem; font-weight: 500; line-height: 1.1rem; }
.cr-title-subtitle[hidden], .cr-title-badge[hidden] { display: none; }
.cr-title-badge { display: inline-flex; align-items: center; padding: .05rem .35rem; border-radius: .35rem; font-size: .68em; font-weight: 750; line-height: 1.2; }
.cr-root[data-agent-avatar-style="cutout"] .cr-panel { overflow: hidden; border-radius: 1.5rem; }
.cr-root[data-agent-avatar-style="cutout"] .cr-header {
  position: relative; z-index: 2; min-height: 5.75rem; padding: .75rem 1rem .75rem 7rem;
  overflow: visible; border: 0; border-radius: 1.5rem 1.5rem 0 0; color: #fff;
  background: linear-gradient(100deg, var(--cr-agent-header-start, #fff) 0%, #a2a7cd 15%, #7c83b4 34%, var(--cr-agent-header-end, #6c73a8) 100%);
}
.cr-root[data-agent-avatar-style="cutout"] .cr-title { color: #fff; z-index: 1; font-size: 1.2rem; font-weight: 750; line-height: 1.35; letter-spacing: -.015em; }
.cr-root[data-agent-avatar-style="cutout"] .cr-title-text { text-shadow: 0 1px 2px rgba(38,43,85,.2); }
.cr-root[data-agent-avatar-style="cutout"] .cr-title-subtitle { color: rgba(255,255,255,.94); font-size: .9rem; font-weight: 550; line-height: 1.35; text-shadow: 0 1px 2px rgba(38,43,85,.18); }
.cr-root[data-agent-avatar-style="cutout"] .cr-title-badge { background: #fff; color: #252b5c; font-size: .7rem; letter-spacing: -.01em; text-shadow: none; }
.cr-root[data-agent-avatar-style="cutout"] .cr-header-actions { z-index: 2; align-self: flex-start; gap: .45rem; }
.cr-root[data-agent-avatar-style="cutout"] .cr-close {
  width: 2.75rem; height: 2.75rem; min-width: 2.75rem; min-height: 2.75rem;
  border: 1px solid rgba(255,255,255,.88); border-radius: .875rem;
  background: rgba(255,255,255,.94); color: #172554;
  box-shadow: 0 2px 8px rgba(32,35,72,.12);
}
.cr-root[data-agent-avatar-style="cutout"] .cr-close:hover { background: #fff; color: #0e1745; box-shadow: 0 4px 12px rgba(32,35,72,.2); transform: translateY(-1px); }
.cr-root[data-agent-avatar-style="cutout"] .cr-fullscreen-toggle { color: rgba(255,255,255,.82); background: rgba(255,255,255,.08); border-radius: .875rem; }
.cr-root[data-agent-avatar-style="cutout"] .cr-fullscreen-toggle:hover { background: rgba(255,255,255,.2); color: #fff; }
.cr-root[data-agent-avatar-style="cutout"] .cr-close svg { display: block; width: 1.25rem; height: 1.25rem; }
.cr-root[data-agent-avatar-style="cutout"] .cr-title-probe {
  position: absolute; left: .75rem; bottom: 0; z-index: 3;
  width: 5rem; height: 5.75rem; margin: 0; overflow: visible;
}
.cr-root[data-agent-avatar-style="cutout"] .cr-title-probe .cr-agent-avatar {
  width: 100%; height: 100%; object-fit: contain; object-position: center bottom;
  border-radius: 0; filter: drop-shadow(0 4px 6px rgba(30,31,55,.16));
}
.cr-root[data-agent-avatar-style="cutout"] .cr-title-probe[data-working="true"] .cr-agent-avatar {
  animation: cr-avatar-breathe 2.8s ease-in-out infinite;
}
.cr-root[data-agent-avatar-style="cutout"] .cr-messages {
  position: relative; z-index: 1; margin-top: -.8rem; padding-top: 1.75rem;
  border-radius: 1.5rem 1.5rem 0 0; background: var(--cr-card);
}
.cr-root[data-agent-avatar-style="cutout"] .cr-message[data-welcome="true"] {
  max-width: 100%; padding: .35rem 1rem 1rem; border-radius: 0;
  background: transparent; color: #111b50; font-size: 1.12rem; line-height: 1.55;
  letter-spacing: -.012em;
}
.cr-root[data-agent-avatar-style="cutout"] .cr-message[data-welcome="true"] strong { font-weight: 750; color: #07194c; }
@keyframes cr-avatar-breathe { 50% { transform: translateY(-2px); filter: drop-shadow(0 7px 9px rgba(30,31,55,.2)); } }
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

.cr-fullscreen-toggle [hidden] { display: none !important; }

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

/* Full-screen chat uses the viewport as a composed experience, not a stretched drawer. */
.cr-panel[data-fullscreen="true"] {
  background: var(--cr-card);
}
.cr-panel[data-fullscreen="true"] .cr-header {
  min-height: 4.25rem;
  padding: max(1rem, env(safe-area-inset-top, 0px)) clamp(1.25rem, 4vw, 4rem) 1rem;
  border-radius: 0;
}
.cr-panel[data-fullscreen="true"] .cr-messages {
  width: 100%;
  max-width: 60rem;
  margin-inline: auto;
  padding: clamp(1.5rem, 5vh, 4rem) clamp(1rem, 4vw, 3rem);
}
.cr-panel[data-fullscreen="true"] .cr-messages[data-welcome="true"] {
  justify-content: center;
  gap: clamp(1.25rem, 3vh, 2rem);
}
.cr-panel[data-fullscreen="true"] .cr-message[data-welcome="true"] {
  width: 100%;
  max-width: 48rem;
  padding: 0;
  font-size: clamp(1.5rem, 2.5vw, 2.25rem);
  line-height: 1.4;
  letter-spacing: -.02em;
}
.cr-panel[data-fullscreen="true"] .cr-opening-suggestions {
  width: 100%;
  max-width: 48rem;
  margin: .5rem auto 0;
  gap: 1rem;
}
.cr-panel[data-fullscreen="true"] .cr-suggestion-tabs { gap: .75rem; }
.cr-panel[data-fullscreen="true"] .cr-suggestion-tab {
  min-height: 3rem;
  padding: .65rem 1.15rem;
  font-size: .875rem;
}
.cr-panel[data-fullscreen="true"] .cr-suggestion-items { gap: .75rem; }
.cr-panel[data-fullscreen="true"] .cr-suggestion-items:not([data-view="cards"]) {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
}
.cr-panel[data-fullscreen="true"] .cr-suggestion-items[data-view="cards"] {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));
  gap: 1rem;
}
.cr-panel[data-fullscreen="true"] .cr-suggestion {
  min-height: 3.5rem;
  padding: .8rem 1rem;
  border-radius: 1rem;
  font-size: .9375rem;
  line-height: 1.45;
  text-align: left;
  white-space: normal;
  box-shadow: 0 1px 2px rgb(14 15 19 / .04);
}
.cr-panel[data-fullscreen="true"] .cr-composer {
  width: min(60rem, calc(100% - 2.5rem));
  margin: 0 auto .75rem;
  padding: 1rem 1.25rem;
}
.cr-panel[data-fullscreen="true"] .cr-input { min-height: 3rem; font-size: 1rem; }
.cr-panel[data-fullscreen="true"] .cr-send { width: 3.25rem; height: 3.25rem; }
.cr-panel[data-fullscreen="true"] .cr-footer {
  padding-bottom: max(.625rem, env(safe-area-inset-bottom, 0px));
}
.cr-panel[data-fullscreen="true"] .cr-empty { width: 100%; max-width: 48rem; margin-inline: auto; }

.cr-root[data-agent-avatar-style="cutout"] .cr-panel[data-fullscreen="true"] .cr-header {
  min-height: 7.5rem;
  padding: 1rem clamp(1.25rem, 4vw, 4rem) 1rem clamp(9rem, 12vw, 12rem);
}
.cr-root[data-agent-avatar-style="cutout"] .cr-panel[data-fullscreen="true"] .cr-title {
  font-size: clamp(1.35rem, 1.8vw, 1.75rem);
}
.cr-root[data-agent-avatar-style="cutout"] .cr-panel[data-fullscreen="true"] .cr-title-subtitle {
  font-size: clamp(.9rem, 1.2vw, 1.1rem);
}
.cr-root[data-agent-avatar-style="cutout"] .cr-panel[data-fullscreen="true"] .cr-title-probe {
  left: clamp(1.25rem, 4vw, 3rem);
  width: 6.25rem;
  height: 7.1rem;
}

@media (max-width: 30rem) {
  .cr-panel[data-fullscreen="true"] .cr-header { min-height: 4rem; padding-inline: .75rem; }
  .cr-panel[data-fullscreen="true"] .cr-messages { max-width: none; padding: 1.25rem; }
  .cr-panel[data-fullscreen="true"] .cr-messages[data-welcome="true"] { justify-content: center; }
  .cr-panel[data-fullscreen="true"] .cr-message[data-welcome="true"] { font-size: 1.4rem; }
  .cr-panel[data-fullscreen="true"] .cr-opening-suggestions { margin-top: 0; }
  .cr-panel[data-fullscreen="true"] .cr-suggestion-items:not([data-view="cards"]),
  .cr-panel[data-fullscreen="true"] .cr-suggestion-items[data-view="cards"] { grid-template-columns: 1fr; }
  .cr-panel[data-fullscreen="true"] .cr-composer { width: calc(100% - 1.5rem); padding: .75rem; }
  .cr-panel[data-fullscreen="true"] .cr-footer { padding-inline: .75rem; }
  .cr-root[data-agent-avatar-style="cutout"] .cr-panel[data-fullscreen="true"] .cr-header {
    min-height: 6.5rem;
    padding: .75rem .75rem .75rem 6.25rem;
  }
  .cr-root[data-agent-avatar-style="cutout"] .cr-panel[data-fullscreen="true"] .cr-title { font-size: 1.1rem; }
  .cr-root[data-agent-avatar-style="cutout"] .cr-panel[data-fullscreen="true"] .cr-title-subtitle { font-size: .78rem; }
  .cr-root[data-agent-avatar-style="cutout"] .cr-panel[data-fullscreen="true"] .cr-title-probe {
    left: .75rem; width: 4.75rem; height: 6.25rem;
  }
  .cr-root[data-agent-avatar-style="cutout"] .cr-panel[data-fullscreen="true"] .cr-close {
    width: 2.75rem; height: 2.75rem; min-width: 2.75rem; min-height: 2.75rem;
  }
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

@media (max-width: 26rem) {
  .cr-root[data-agent-avatar-style="cutout"] .cr-header { padding-left: 6.25rem; }
  .cr-root[data-agent-avatar-style="cutout"] .cr-title { font-size: 1.05rem; }
  .cr-root[data-agent-avatar-style="cutout"] .cr-title-subtitle { font-size: .78rem; }
  .cr-root[data-agent-avatar-style="cutout"] .cr-title-probe { width: 4.5rem; height: 5.8rem; }
  .cr-root[data-agent-avatar-style="cutout"] .cr-close { width: 2.5rem; height: 2.5rem; min-width: 2.5rem; min-height: 2.5rem; }
}

@media (prefers-reduced-motion: reduce) {
  .cr-launcher, .cr-root[data-agent-avatar-style="cutout"] .cr-title-probe .cr-agent-avatar { animation: none !important; }
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
.cr-suggestions-label { flex: 0 0 100%; color: var(--cr-muted); font-size: .6875rem; font-weight: 700; letter-spacing: .06em; line-height: 1rem; text-transform: uppercase; }

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
`.trim()}function xt(t){return t.some(n=>n==="fixed"||n==="sticky")}function Lt(t,n,e=12){if(t.bottom<=t.top||t.right<=t.left)return 0;let a=t.bottom-t.top,o=t.top;for(let s=0;s<=n.length;s+=1){let i=n.filter(d=>d.bottom>d.top&&d.right>t.left&&d.left<t.right&&d.bottom>o&&d.top<o+a);if(!i.length)break;let c=Math.min(...i.map(d=>d.top-a-e));if(c>=o)break;o=c}return Math.ceil(t.top-o)}var kt=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3630 3475">
<path fill="currentColor" fill-rule="evenodd" d="M674 1643c6,-8 11,-16 16,-23l1 -1c8,-11 17,-22 25,-34 32,-42 65,-83 99,-121 34,-39 68,-76 103,-111l0 0c112,-112 232,-209 359,-292 130,-85 267,-155 407,-209 142,-55 288,-93 434,-115 147,-22 294,-27 437,-14l154 13c10,1 17,8 18,18l13 154c12,144 7,291 -14,437 -22,146 -60,291 -115,434 -54,140 -124,277 -209,407 -83,127 -180,247 -292,359 -35,35 -72,70 -111,104 -39,34 -80,67 -122,99 -12,9 -24,18 -35,26 -8,6 -16,11 -23,17 20,57 38,114 52,172 16,63 28,126 38,190 1,8 -2,15 -8,19l-404 301c-9,6 -21,5 -27,-4 -3,-3 -4,-7 -4,-11 -1,-105 -13,-211 -38,-315 -25,-103 -61,-205 -109,-303l-90 -183c-5,-9 -1,-20 8,-25l0 0 197 -110c33,-19 66,-39 99,-60 33,-22 65,-44 95,-67 29,-22 59,-46 88,-72 29,-25 58,-53 88,-83 85,-85 159,-177 222,-272 65,-99 117,-201 158,-306 31,-81 56,-164 73,-247 16,-77 25,-154 29,-230 -76,3 -153,13 -230,29 -83,17 -166,41 -247,73 -105,40 -208,93 -306,158 -96,63 -187,137 -272,222l-1 1c-29,29 -56,57 -81,87 -26,30 -50,59 -72,88 -24,31 -46,63 -67,95 -21,32 -41,65 -60,98l-111 197c-5,9 -17,13 -26,8l-182 -91c-96,-48 -196,-84 -297,-109 -103,-25 -206,-39 -309,-41 -11,0 -19,-9 -19,-20 0,-4 1,-8 4,-11l300 -403c4,-6 12,-9 18,-8l0 0c62,9 124,22 185,38 56,15 112,32 167,52zm800 349c99,-220 99,-158 0,-379 220,99 158,99 379,0 -99,220 -99,158 0,379 -220,-99 -158,-99 -379,0zm1252 -1238l0 0m-1824 1810l0 0c52,52 78,121 78,189l0 0c0,69 -26,137 -79,190 -54,54 -154,109 -262,155 -129,55 -271,97 -360,110 -11,1 -20,-6 -22,-17 0,-2 0,-4 0,-6 13,-89 55,-231 109,-360 46,-108 101,-208 155,-262l1 -1c52,-52 121,-78 189,-78l0 0c69,0 137,26 190,79l0 0zm-644 622c1,-8 8,-15 17,-16m249 -607c8,-7 19,-6 26,1"/><path fill="currentColor" d="M3416 641c69,180 34,145 214,214 -180,69 -145,34 -214,214 -69,-180 -34,-145 -214,-214 180,-69 145,-34 214,-214z"/><path fill="currentColor" d="M3079 0c93,243 45,196 288,288 -243,93 -196,45 -288,288 -93,-243 -45,-196 -288,-288 243,-93 196,-45 288,-288z"/>
</svg>
`;var Et=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9193 1236">
<path fill="#14151A" fill-rule="evenodd" d="M 240.0,584.0 C 242.0,581.0 244.0,578.0 246.0,576.0 L 246.0,576.0 C 249.0,572.0 252.0,568.0 255.0,564.0 C 266.0,549.0 278.0,535.0 290.0,521.0 C 302.0,507.0 314.0,494.0 327.0,482.0 L 327.0,482.0 C 367.0,442.0 410.0,408.0 455.0,378.0 C 501.0,348.0 550.0,323.0 600.0,304.0 C 651.0,284.0 702.0,271.0 754.0,263.0 C 806.0,255.0 858.0,254.0 909.0,258.0 L 964.0,263.0 C 967.0,263.0 970.0,266.0 970.0,269.0 L 975.0,324.0 C 979.0,375.0 978.0,427.0 970.0,479.0 C 962.0,531.0 949.0,583.0 929.0,633.0 C 910.0,683.0 885.0,731.0 855.0,778.0 C 826.0,823.0 791.0,866.0 751.0,906.0 C 739.0,918.0 725.0,931.0 711.0,943.0 C 697.0,955.0 683.0,967.0 668.0,978.0 C 664.0,981.0 660.0,984.0 655.0,987.0 C 652.0,989.0 649.0,991.0 647.0,993.0 C 654.0,1013.0 660.0,1033.0 666.0,1054.0 C 672.0,1076.0 676.0,1099.0 679.0,1122.0 C 679.0,1125.0 678.0,1127.0 676.0,1129.0 L 532.0,1236.0 C 529.0,1238.0 525.0,1238.0 522.0,1235.0 C 521.0,1234.0 521.0,1232.0 521.0,1231.0 C 521.0,1194.0 516.0,1156.0 507.0,1119.0 C 498.0,1082.0 485.0,1046.0 468.0,1011.0 L 436.0,946.0 C 434.0,943.0 436.0,939.0 439.0,937.0 L 439.0,937.0 L 509.0,898.0 C 521.0,891.0 533.0,884.0 544.0,877.0 C 556.0,869.0 567.0,861.0 578.0,853.0 C 588.0,845.0 599.0,837.0 609.0,827.0 C 619.0,818.0 630.0,808.0 640.0,798.0 C 670.0,768.0 697.0,735.0 719.0,701.0 C 742.0,666.0 761.0,629.0 775.0,592.0 C 786.0,563.0 795.0,534.0 801.0,504.0 C 807.0,477.0 810.0,449.0 811.0,422.0 C 784.0,423.0 756.0,427.0 729.0,432.0 C 699.0,438.0 670.0,447.0 641.0,458.0 C 604.0,472.0 567.0,491.0 532.0,514.0 C 498.0,536.0 465.0,563.0 435.0,593.0 L 435.0,593.0 C 425.0,603.0 415.0,613.0 406.0,624.0 C 397.0,635.0 388.0,645.0 380.0,655.0 C 372.0,666.0 364.0,677.0 356.0,689.0 C 349.0,700.0 341.0,712.0 335.0,724.0 L 296.0,794.0 C 294.0,797.0 290.0,799.0 287.0,797.0 L 222.0,765.0 C 188.0,748.0 152.0,735.0 116.0,726.0 C 80.0,717.0 43.0,712.0 6.0,711.0 C 2.0,711.0 -1.0,708.0 -1.0,704.0 C -1.0,702.0 0.0,701.0 0.0,700.0 L 107.0,557.0 C 109.0,555.0 111.0,554.0 114.0,554.0 L 114.0,554.0 C 136.0,557.0 158.0,562.0 180.0,568.0 C 200.0,573.0 220.0,579.0 239.0,586.0 L 240.0,584.0 M 525.0,708.0 C 560.0,630.0 560.0,652.0 525.0,573.0 C 603.0,608.0 581.0,608.0 660.0,573.0 C 625.0,651.0 625.0,629.0 660.0,708.0 C 582.0,673.0 604.0,673.0 525.0,708.0 M 970.0,268.0 L 970.0,268.0 M 322.0,912.0 L 322.0,912.0 C 341.0,931.0 350.0,955.0 350.0,979.0 L 350.0,979.0 C 350.0,1003.0 341.0,1028.0 322.0,1046.0 C 303.0,1065.0 267.0,1085.0 229.0,1101.0 C 183.0,1120.0 133.0,1135.0 101.0,1140.0 C 97.0,1141.0 94.0,1138.0 93.0,1134.0 C 93.0,1133.0 93.0,1133.0 93.0,1132.0 C 98.0,1100.0 112.0,1050.0 132.0,1004.0 C 148.0,966.0 168.0,930.0 187.0,911.0 L 187.0,911.0 C 206.0,893.0 230.0,883.0 254.0,883.0 L 254.0,883.0 C 278.0,883.0 303.0,892.0 321.0,911.0 L 321.0,911.0 L 322.0,912.0 M 93.0,1133.0 C 93.0,1130.0 96.0,1128.0 99.0,1127.0 M 188.0,911.0 C 191.0,909.0 195.0,909.0 197.0,911.0"/>
<path fill="#FF2B67" d="M 1095.0,0.0 C 1128.0,86.0 1111.0,70.0 1198.0,103.0 C 1112.0,136.0 1128.0,119.0 1095.0,206.0 C 1062.0,120.0 1079.0,136.0 992.0,103.0 C 1078.0,70.0 1062.0,87.0 1095.0,0.0"/>
<path fill="#FF2B67" d="M 1215.0,228.0 C 1239.0,292.0 1227.0,280.0 1291.0,304.0 C 1227.0,328.0 1239.0,316.0 1215.0,380.0 C 1191.0,316.0 1203.0,328.0 1139.0,304.0 C 1203.0,280.0 1191.0,292.0 1215.0,228.0"/>
<path fill="#14151A" fill-rule="evenodd" d="M 1705.0,1134.0 C 1641.0,1134.0 1582.0,1118.0 1529.0,1087.0 C 1476.0,1056.0 1434.0,1014.0 1404.0,961.0 C 1374.0,908.0 1358.0,850.0 1358.0,787.0 C 1358.0,724.0 1373.0,666.0 1404.0,613.0 C 1435.0,560.0 1476.0,518.0 1529.0,488.0 C 1582.0,457.0 1641.0,442.0 1705.0,442.0 C 1744.0,442.0 1782.0,448.0 1818.0,460.0 C 1854.0,472.0 1886.0,489.0 1916.0,511.0 C 1921.0,515.0 1924.0,520.0 1924.0,525.0 C 1924.0,529.0 1922.0,533.0 1919.0,537.0 L 1842.0,638.0 C 1838.0,643.0 1833.0,646.0 1828.0,646.0 C 1824.0,646.0 1820.0,645.0 1816.0,642.0 C 1800.0,631.0 1782.0,622.0 1763.0,616.0 C 1744.0,610.0 1725.0,606.0 1706.0,606.0 C 1675.0,606.0 1647.0,614.0 1620.0,630.0 C 1593.0,646.0 1572.0,668.0 1556.0,696.0 C 1540.0,724.0 1532.0,755.0 1532.0,788.0 C 1532.0,822.0 1540.0,852.0 1556.0,880.0 C 1572.0,908.0 1593.0,930.0 1620.0,946.0 C 1647.0,962.0 1675.0,970.0 1706.0,970.0 C 1728.0,970.0 1747.0,967.0 1764.0,962.0 C 1781.0,957.0 1798.0,947.0 1817.0,933.0 C 1821.0,930.0 1826.0,929.0 1830.0,929.0 C 1835.0,929.0 1840.0,932.0 1844.0,937.0 L 1919.0,1038.0 C 1923.0,1043.0 1924.0,1048.0 1924.0,1051.0 C 1924.0,1055.0 1922.0,1060.0 1917.0,1063.0 C 1888.0,1086.0 1855.0,1103.0 1819.0,1115.0 C 1783.0,1127.0 1745.0,1133.0 1706.0,1133.0 L 1705.0,1134.0 M 2306.0,1136.0 C 2250.0,1136.0 2199.0,1123.0 2153.0,1096.0 C 2107.0,1069.0 2070.0,1033.0 2043.0,988.0 C 2016.0,943.0 2003.0,893.0 2003.0,839.0 C 2003.0,784.0 2017.0,734.0 2044.0,688.0 C 2071.0,642.0 2108.0,606.0 2155.0,579.0 C 2202.0,552.0 2253.0,539.0 2309.0,539.0 C 2365.0,539.0 2416.0,552.0 2463.0,579.0 C 2510.0,606.0 2547.0,642.0 2574.0,688.0 C 2601.0,734.0 2615.0,784.0 2615.0,839.0 C 2615.0,893.0 2601.0,943.0 2574.0,988.0 C 2547.0,1034.0 2509.0,1070.0 2462.0,1096.0 C 2415.0,1122.0 2364.0,1136.0 2308.0,1136.0 L 2306.0,1136.0 M 2308.0,982.0 C 2334.0,982.0 2358.0,976.0 2380.0,963.0 C 2402.0,950.0 2419.0,933.0 2432.0,911.0 C 2445.0,889.0 2451.0,865.0 2451.0,838.0 C 2451.0,811.0 2445.0,786.0 2432.0,764.0 C 2419.0,742.0 2402.0,724.0 2380.0,712.0 C 2358.0,699.0 2334.0,693.0 2308.0,693.0 C 2281.0,693.0 2257.0,699.0 2235.0,712.0 C 2213.0,725.0 2196.0,742.0 2183.0,764.0 C 2170.0,786.0 2164.0,811.0 2164.0,838.0 C 2164.0,865.0 2170.0,889.0 2183.0,911.0 C 2196.0,933.0 2213.0,950.0 2235.0,963.0 C 2257.0,976.0 2281.0,982.0 2308.0,982.0 M 3087.0,538.0 C 3133.0,538.0 3174.0,549.0 3209.0,570.0 C 3244.0,591.0 3271.0,621.0 3291.0,660.0 C 3310.0,699.0 3320.0,744.0 3320.0,794.0 L 3320.0,1103.0 C 3320.0,1116.0 3314.0,1122.0 3301.0,1122.0 L 3178.0,1122.0 C 3165.0,1122.0 3159.0,1116.0 3159.0,1103.0 L 3159.0,813.0 C 3159.0,774.0 3149.0,744.0 3130.0,721.0 C 3111.0,698.0 3085.0,687.0 3051.0,687.0 C 3027.0,687.0 3005.0,693.0 2985.0,704.0 C 2965.0,715.0 2948.0,730.0 2936.0,749.0 C 2924.0,768.0 2918.0,787.0 2918.0,807.0 L 2918.0,1105.0 C 2918.0,1118.0 2912.0,1124.0 2899.0,1124.0 L 2776.0,1124.0 C 2763.0,1124.0 2757.0,1118.0 2757.0,1105.0 L 2757.0,569.0 C 2757.0,556.0 2763.0,550.0 2776.0,550.0 L 2870.0,550.0 C 2880.0,550.0 2888.0,555.0 2892.0,565.0 L 2912.0,614.0 C 2934.0,593.0 2961.0,575.0 2994.0,562.0 C 3027.0,548.0 3058.0,541.0 3087.0,541.0 L 3087.0,538.0 M 3653.0,1103.0 C 3653.0,1116.0 3647.0,1122.0 3634.0,1122.0 L 3511.0,1122.0 C 3498.0,1122.0 3492.0,1116.0 3492.0,1103.0 L 3492.0,697.0 L 3444.0,697.0 C 3431.0,697.0 3425.0,691.0 3425.0,678.0 L 3425.0,566.0 C 3425.0,553.0 3431.0,547.0 3444.0,547.0 L 3490.0,547.0 L 3490.0,444.0 C 3490.0,432.0 3496.0,425.0 3507.0,423.0 L 3632.0,399.0 C 3633.0,399.0 3635.0,399.0 3637.0,399.0 C 3642.0,399.0 3646.0,401.0 3649.0,404.0 C 3652.0,407.0 3653.0,411.0 3653.0,417.0 L 3653.0,549.0 L 3742.0,549.0 C 3755.0,549.0 3761.0,555.0 3761.0,568.0 L 3761.0,680.0 C 3761.0,693.0 3755.0,699.0 3742.0,699.0 L 3652.0,699.0 L 3652.0,1105.0 L 3653.0,1103.0 M 4136.0,1136.0 C 4079.0,1136.0 4027.0,1122.0 3982.0,1096.0 C 3937.0,1069.0 3901.0,1033.0 3875.0,987.0 C 3850.0,941.0 3837.0,892.0 3837.0,838.0 C 3837.0,784.0 3849.0,734.0 3873.0,688.0 C 3897.0,642.0 3931.0,606.0 3974.0,579.0 C 4017.0,552.0 4067.0,538.0 4122.0,538.0 C 4182.0,538.0 4233.0,551.0 4277.0,577.0 C 4321.0,603.0 4354.0,638.0 4377.0,683.0 C 4400.0,728.0 4411.0,780.0 4411.0,837.0 C 4411.0,850.0 4410.0,862.0 4409.0,874.0 C 4408.0,886.0 4401.0,892.0 4389.0,892.0 L 4002.0,892.0 C 4012.0,924.0 4030.0,948.0 4056.0,966.0 C 4081.0,984.0 4110.0,993.0 4142.0,993.0 C 4163.0,993.0 4181.0,990.0 4198.0,984.0 C 4215.0,978.0 4231.0,970.0 4247.0,959.0 C 4251.0,956.0 4255.0,954.0 4259.0,954.0 C 4264.0,954.0 4269.0,957.0 4273.0,963.0 L 4331.0,1046.0 C 4334.0,1050.0 4335.0,1054.0 4335.0,1058.0 C 4335.0,1063.0 4332.0,1068.0 4327.0,1072.0 C 4301.0,1093.0 4271.0,1108.0 4239.0,1120.0 C 4206.0,1131.0 4172.0,1137.0 4135.0,1137.0 L 4136.0,1136.0 M 4252.0,773.0 C 4243.0,742.0 4228.0,718.0 4206.0,701.0 C 4185.0,684.0 4158.0,676.0 4127.0,676.0 C 4097.0,676.0 4070.0,685.0 4048.0,702.0 C 4026.0,719.0 4010.0,743.0 4001.0,774.0 L 4252.0,774.0 L 4252.0,773.0 M 4694.0,1109.0 C 4689.0,1118.0 4681.0,1122.0 4671.0,1122.0 L 4521.0,1122.0 C 4516.0,1122.0 4512.0,1121.0 4509.0,1119.0 C 4506.0,1117.0 4504.0,1114.0 4504.0,1110.0 C 4504.0,1107.0 4505.0,1103.0 4508.0,1099.0 L 4694.0,829.0 L 4520.0,571.0 C 4517.0,566.0 4516.0,563.0 4516.0,560.0 C 4516.0,557.0 4517.0,554.0 4520.0,552.0 C 4523.0,550.0 4527.0,549.0 4532.0,549.0 L 4684.0,549.0 C 4694.0,549.0 4702.0,553.0 4707.0,562.0 L 4792.0,715.0 L 4877.0,562.0 C 4880.0,557.0 4882.0,554.0 4886.0,552.0 C 4890.0,550.0 4894.0,549.0 4899.0,549.0 L 5052.0,549.0 C 5057.0,549.0 5061.0,550.0 5064.0,552.0 C 5067.0,554.0 5068.0,557.0 5068.0,560.0 C 5068.0,564.0 5067.0,568.0 5064.0,571.0 L 4895.0,829.0 L 5076.0,1100.0 C 5079.0,1104.0 5080.0,1108.0 5080.0,1111.0 C 5080.0,1115.0 5079.0,1117.0 5076.0,1120.0 C 5073.0,1122.0 5069.0,1123.0 5064.0,1123.0 L 4913.0,1123.0 C 4903.0,1123.0 4895.0,1119.0 4890.0,1110.0 L 4791.0,942.0 L 4693.0,1110.0 L 4694.0,1109.0 M 5377.0,1103.0 C 5377.0,1116.0 5371.0,1122.0 5358.0,1122.0 L 5235.0,1122.0 C 5222.0,1122.0 5216.0,1116.0 5216.0,1103.0 L 5216.0,697.0 L 5168.0,697.0 C 5155.0,697.0 5149.0,691.0 5149.0,678.0 L 5149.0,566.0 C 5149.0,553.0 5155.0,547.0 5168.0,547.0 L 5214.0,547.0 L 5214.0,444.0 C 5214.0,432.0 5220.0,425.0 5231.0,423.0 L 5356.0,399.0 C 5357.0,399.0 5359.0,399.0 5361.0,399.0 C 5366.0,399.0 5370.0,401.0 5373.0,404.0 C 5376.0,407.0 5377.0,411.0 5377.0,417.0 L 5377.0,549.0 L 5466.0,549.0 C 5479.0,549.0 5485.0,555.0 5485.0,568.0 L 5485.0,680.0 C 5485.0,693.0 5479.0,699.0 5466.0,699.0 L 5376.0,699.0 L 5376.0,1105.0 L 5377.0,1103.0 M 5618.0,1122.0 C 5605.0,1122.0 5599.0,1116.0 5599.0,1103.0 L 5599.0,474.0 C 5599.0,461.0 5605.0,455.0 5618.0,455.0 L 5887.0,455.0 C 5933.0,455.0 5973.0,465.0 6009.0,484.0 C 6044.0,503.0 6072.0,530.0 6092.0,564.0 C 6112.0,598.0 6122.0,638.0 6122.0,682.0 C 6122.0,724.0 6113.0,761.0 6096.0,791.0 C 6079.0,821.0 6054.0,846.0 6023.0,865.0 L 6141.0,1100.0 C 6143.0,1104.0 6144.0,1107.0 6144.0,1110.0 C 6144.0,1114.0 6143.0,1117.0 6140.0,1119.0 C 6137.0,1121.0 6133.0,1122.0 6128.0,1122.0 L 5976.0,1122.0 C 5966.0,1122.0 5958.0,1117.0 5954.0,1108.0 L 5861.0,909.0 C 5856.0,909.0 5850.0,909.0 5841.0,909.0 L 5772.0,909.0 L 5772.0,1103.0 C 5772.0,1116.0 5766.0,1122.0 5753.0,1122.0 L 5620.0,1122.0 L 5618.0,1122.0 M 5871.0,765.0 C 5886.0,765.0 5899.0,761.0 5910.0,754.0 C 5922.0,746.0 5931.0,736.0 5938.0,724.0 C 5945.0,711.0 5948.0,698.0 5948.0,684.0 C 5948.0,659.0 5941.0,640.0 5926.0,626.0 C 5911.0,613.0 5894.0,606.0 5872.0,606.0 L 5769.0,606.0 L 5769.0,766.0 L 5871.0,766.0 L 5871.0,765.0 M 6530.0,1137.0 C 6474.0,1137.0 6423.0,1124.0 6377.0,1097.0 C 6331.0,1070.0 6294.0,1034.0 6267.0,989.0 C 6240.0,944.0 6227.0,894.0 6227.0,840.0 C 6227.0,785.0 6241.0,735.0 6268.0,689.0 C 6295.0,643.0 6332.0,607.0 6379.0,580.0 C 6426.0,553.0 6477.0,540.0 6533.0,540.0 C 6589.0,540.0 6640.0,553.0 6687.0,580.0 C 6734.0,607.0 6771.0,643.0 6798.0,689.0 C 6825.0,735.0 6839.0,785.0 6839.0,840.0 C 6839.0,894.0 6825.0,944.0 6798.0,989.0 C 6771.0,1035.0 6733.0,1071.0 6686.0,1097.0 C 6639.0,1123.0 6588.0,1137.0 6532.0,1137.0 L 6530.0,1137.0 M 6532.0,983.0 C 6558.0,983.0 6582.0,977.0 6604.0,964.0 C 6626.0,951.0 6643.0,934.0 6656.0,912.0 C 6669.0,890.0 6675.0,866.0 6675.0,839.0 C 6675.0,812.0 6669.0,787.0 6656.0,765.0 C 6643.0,743.0 6626.0,725.0 6604.0,713.0 C 6582.0,700.0 6558.0,694.0 6532.0,694.0 C 6505.0,694.0 6481.0,700.0 6459.0,713.0 C 6437.0,726.0 6420.0,743.0 6407.0,765.0 C 6394.0,787.0 6388.0,812.0 6388.0,839.0 C 6388.0,866.0 6394.0,890.0 6407.0,912.0 C 6420.0,934.0 6437.0,951.0 6459.0,964.0 C 6481.0,977.0 6505.0,983.0 6532.0,983.0 M 7238.0,1137.0 C 7182.0,1137.0 7131.0,1124.0 7086.0,1097.0 C 7041.0,1070.0 7006.0,1034.0 6980.0,989.0 C 6955.0,943.0 6942.0,894.0 6942.0,840.0 C 6942.0,785.0 6955.0,735.0 6980.0,689.0 C 7005.0,643.0 7040.0,607.0 7086.0,580.0 C 7131.0,553.0 7182.0,540.0 7239.0,540.0 C 7276.0,540.0 7311.0,546.0 7344.0,557.0 C 7377.0,568.0 7406.0,584.0 7432.0,604.0 C 7437.0,609.0 7440.0,613.0 7440.0,618.0 C 7440.0,622.0 7439.0,626.0 7436.0,630.0 L 7376.0,716.0 C 7372.0,722.0 7367.0,725.0 7362.0,725.0 C 7359.0,725.0 7355.0,724.0 7350.0,720.0 C 7334.0,709.0 7318.0,701.0 7302.0,695.0 C 7286.0,689.0 7267.0,686.0 7247.0,686.0 C 7221.0,686.0 7198.0,693.0 7176.0,706.0 C 7154.0,719.0 7137.0,737.0 7124.0,761.0 C 7111.0,784.0 7105.0,810.0 7105.0,840.0 C 7105.0,868.0 7112.0,894.0 7125.0,917.0 C 7138.0,940.0 7156.0,958.0 7178.0,971.0 C 7200.0,984.0 7224.0,991.0 7249.0,991.0 C 7270.0,991.0 7288.0,988.0 7304.0,983.0 C 7320.0,977.0 7336.0,969.0 7352.0,958.0 C 7357.0,955.0 7361.0,953.0 7364.0,953.0 C 7369.0,953.0 7374.0,956.0 7378.0,962.0 L 7438.0,1048.0 C 7441.0,1052.0 7443.0,1057.0 7443.0,1061.0 C 7443.0,1065.0 7441.0,1069.0 7437.0,1072.0 C 7411.0,1093.0 7381.0,1109.0 7348.0,1120.0 C 7315.0,1131.0 7279.0,1137.0 7240.0,1137.0 L 7238.0,1137.0 M 8135.0,1100.0 C 8137.0,1104.0 8139.0,1108.0 8139.0,1111.0 C 8139.0,1114.0 8138.0,1117.0 8135.0,1119.0 C 8132.0,1121.0 8128.0,1122.0 8123.0,1122.0 L 7976.0,1122.0 C 7966.0,1122.0 7958.0,1118.0 7953.0,1110.0 L 7815.0,899.0 L 7750.0,970.0 L 7750.0,1104.0 C 7750.0,1117.0 7744.0,1123.0 7731.0,1123.0 L 7608.0,1123.0 C 7595.0,1123.0 7589.0,1117.0 7589.0,1104.0 L 7589.0,400.0 C 7589.0,387.0 7595.0,381.0 7608.0,381.0 L 7731.0,381.0 C 7744.0,381.0 7750.0,387.0 7750.0,400.0 L 7750.0,760.0 L 7915.0,560.0 C 7921.0,553.0 7929.0,549.0 7938.0,549.0 L 8105.0,549.0 C 8110.0,549.0 8114.0,550.0 8117.0,552.0 C 8120.0,554.0 8121.0,557.0 8121.0,560.0 C 8121.0,564.0 8119.0,568.0 8115.0,572.0 L 7924.0,780.0 L 8134.0,1100.0 L 8135.0,1100.0 M 8500.0,1137.0 C 8443.0,1137.0 8391.0,1123.0 8346.0,1097.0 C 8301.0,1070.0 8265.0,1034.0 8239.0,988.0 C 8214.0,942.0 8201.0,893.0 8201.0,839.0 C 8201.0,785.0 8213.0,735.0 8237.0,689.0 C 8261.0,643.0 8295.0,607.0 8338.0,580.0 C 8381.0,553.0 8431.0,539.0 8486.0,539.0 C 8546.0,539.0 8597.0,552.0 8641.0,578.0 C 8685.0,604.0 8718.0,639.0 8741.0,684.0 C 8764.0,729.0 8775.0,781.0 8775.0,838.0 C 8775.0,851.0 8774.0,863.0 8773.0,875.0 C 8772.0,887.0 8765.0,893.0 8753.0,893.0 L 8366.0,893.0 C 8376.0,925.0 8394.0,949.0 8420.0,967.0 C 8445.0,985.0 8474.0,994.0 8506.0,994.0 C 8527.0,994.0 8545.0,991.0 8562.0,985.0 C 8579.0,979.0 8595.0,971.0 8611.0,960.0 C 8615.0,957.0 8619.0,955.0 8623.0,955.0 C 8628.0,955.0 8633.0,958.0 8637.0,964.0 L 8695.0,1047.0 C 8698.0,1051.0 8699.0,1055.0 8699.0,1059.0 C 8699.0,1064.0 8696.0,1069.0 8691.0,1073.0 C 8665.0,1094.0 8635.0,1109.0 8603.0,1121.0 C 8570.0,1132.0 8536.0,1138.0 8499.0,1138.0 L 8500.0,1137.0 M 8616.0,774.0 C 8607.0,743.0 8592.0,719.0 8570.0,702.0 C 8549.0,685.0 8522.0,677.0 8491.0,677.0 C 8461.0,677.0 8434.0,686.0 8412.0,703.0 C 8390.0,720.0 8374.0,744.0 8365.0,775.0 L 8616.0,775.0 L 8616.0,774.0 M 9084.0,1103.0 C 9084.0,1116.0 9078.0,1122.0 9065.0,1122.0 L 8942.0,1122.0 C 8929.0,1122.0 8923.0,1116.0 8923.0,1103.0 L 8923.0,697.0 L 8875.0,697.0 C 8862.0,697.0 8856.0,691.0 8856.0,678.0 L 8856.0,566.0 C 8856.0,553.0 8862.0,547.0 8875.0,547.0 L 8921.0,547.0 L 8921.0,444.0 C 8921.0,432.0 8927.0,425.0 8938.0,423.0 L 9063.0,399.0 C 9064.0,399.0 9066.0,399.0 9068.0,399.0 C 9073.0,399.0 9077.0,401.0 9080.0,404.0 C 9083.0,407.0 9084.0,411.0 9084.0,417.0 L 9084.0,549.0 L 9173.0,549.0 C 9186.0,549.0 9192.0,555.0 9192.0,568.0 L 9192.0,680.0 C 9192.0,693.0 9186.0,699.0 9173.0,699.0 L 9083.0,699.0 L 9083.0,1105.0 L 9084.0,1103.0"/>
</svg>
`;var St=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44288 5953">
<path fill="#FFFFFF" fill-rule="evenodd" d="M 1155.0,2814.0 C 1165.0,2800.0 1174.0,2787.0 1183.0,2775.0 L 1184.0,2773.0 C 1198.0,2754.0 1212.0,2735.0 1227.0,2716.0 C 1282.0,2644.0 1338.0,2574.0 1396.0,2508.0 C 1454.0,2442.0 1512.0,2378.0 1573.0,2318.0 L 1573.0,2318.0 C 1764.0,2127.0 1971.0,1960.0 2188.0,1818.0 C 2411.0,1672.0 2645.0,1553.0 2885.0,1460.0 C 3129.0,1366.0 3378.0,1300.0 3628.0,1263.0 C 3879.0,1226.0 4131.0,1217.0 4377.0,1238.0 L 4640.0,1260.0 C 4656.0,1261.0 4669.0,1275.0 4670.0,1291.0 L 4692.0,1554.0 C 4713.0,1800.0 4704.0,2052.0 4667.0,2303.0 C 4630.0,2553.0 4564.0,2802.0 4470.0,3046.0 C 4377.0,3286.0 4258.0,3520.0 4112.0,3743.0 C 3970.0,3960.0 3803.0,4166.0 3612.0,4358.0 C 3552.0,4418.0 3488.0,4477.0 3421.0,4535.0 C 3354.0,4593.0 3285.0,4650.0 3212.0,4704.0 C 3192.0,4719.0 3172.0,4734.0 3152.0,4749.0 C 3138.0,4759.0 3125.0,4769.0 3112.0,4778.0 C 3147.0,4875.0 3177.0,4973.0 3202.0,5072.0 C 3229.0,5179.0 3251.0,5288.0 3266.0,5398.0 C 3268.0,5411.0 3262.0,5424.0 3251.0,5430.0 L 2558.0,5945.0 C 2543.0,5956.0 2522.0,5953.0 2512.0,5938.0 C 2508.0,5932.0 2505.0,5925.0 2505.0,5918.0 C 2504.0,5738.0 2482.0,5557.0 2439.0,5378.0 C 2397.0,5201.0 2334.0,5027.0 2251.0,4858.0 L 2097.0,4544.0 C 2089.0,4528.0 2095.0,4509.0 2111.0,4500.0 L 2111.0,4500.0 L 2448.0,4311.0 C 2505.0,4279.0 2562.0,4245.0 2618.0,4208.0 C 2674.0,4171.0 2729.0,4133.0 2781.0,4093.0 C 2831.0,4055.0 2881.0,4014.0 2932.0,3969.0 C 2981.0,3926.0 3031.0,3879.0 3083.0,3828.0 C 3229.0,3682.0 3356.0,3525.0 3464.0,3361.0 C 3575.0,3192.0 3665.0,3016.0 3734.0,2836.0 C 3788.0,2697.0 3829.0,2555.0 3859.0,2412.0 C 3886.0,2280.0 3903.0,2149.0 3909.0,2018.0 C 3778.0,2024.0 3646.0,2040.0 3515.0,2067.0 C 3373.0,2096.0 3231.0,2138.0 3091.0,2192.0 C 2911.0,2261.0 2735.0,2352.0 2566.0,2462.0 C 2402.0,2569.0 2246.0,2696.0 2099.0,2843.0 L 2097.0,2845.0 C 2048.0,2894.0 2002.0,2944.0 1958.0,2993.0 C 1913.0,3044.0 1872.0,3095.0 1835.0,3143.0 C 1795.0,3196.0 1756.0,3250.0 1720.0,3305.0 C 1684.0,3360.0 1650.0,3416.0 1617.0,3474.0 L 1427.0,3812.0 C 1418.0,3828.0 1398.0,3834.0 1382.0,3825.0 L 1070.0,3670.0 C 905.0,3588.0 734.0,3525.0 561.0,3482.0 C 385.0,3438.0 207.0,3415.0 31.0,3412.0 C 13.0,3412.0 -2.0,3397.0 -2.0,3378.0 C -2.0,3371.0 0.0,3364.0 4.0,3359.0 L 517.0,2669.0 C 524.0,2659.0 537.0,2654.0 549.0,2656.0 L 549.0,2656.0 C 655.0,2672.0 761.0,2694.0 867.0,2721.0 C 963.0,2746.0 1059.0,2776.0 1153.0,2810.0 L 1155.0,2814.0 M 2526.0,3412.0 C 2695.0,3035.0 2695.0,3141.0 2526.0,2763.0 C 2904.0,2932.0 2797.0,2932.0 3175.0,2763.0 C 3006.0,3140.0 3006.0,3034.0 3175.0,3412.0 C 2797.0,3243.0 2904.0,3243.0 2526.0,3412.0 M 4670.0,1291.0 L 4670.0,1291.0 M 1546.0,4392.0 L 1547.0,4393.0 C 1636.0,4483.0 1681.0,4600.0 1681.0,4718.0 L 1681.0,4718.0 C 1681.0,4836.0 1636.0,4954.0 1546.0,5043.0 C 1453.0,5136.0 1282.0,5230.0 1097.0,5308.0 C 876.0,5402.0 633.0,5474.0 480.0,5496.0 C 462.0,5499.0 445.0,5486.0 443.0,5468.0 C 443.0,5465.0 443.0,5461.0 443.0,5458.0 C 465.0,5305.0 537.0,5063.0 631.0,4842.0 C 710.0,4657.0 804.0,4486.0 897.0,4393.0 L 899.0,4391.0 C 989.0,4302.0 1105.0,4258.0 1222.0,4258.0 L 1222.0,4258.0 C 1340.0,4258.0 1457.0,4303.0 1547.0,4392.0 L 1547.0,4392.0 L 1546.0,4392.0 M 442.0,5457.0 C 444.0,5443.0 455.0,5431.0 470.0,5429.0 M 897.0,4390.0 C 910.0,4379.0 930.0,4379.0 942.0,4392.0"/>
<path fill="#FF2B67" d="M 5274.0,0.0 C 5433.0,416.0 5352.0,335.0 5768.0,494.0 C 5352.0,653.0 5433.0,572.0 5274.0,988.0 C 5115.0,572.0 5196.0,653.0 4780.0,494.0 C 5196.0,335.0 5115.0,416.0 5274.0,0.0"/>
<path fill="#FF2B67" d="M 5851.0,1098.0 C 5969.0,1406.0 5909.0,1346.0 6217.0,1464.0 C 5909.0,1582.0 5969.0,1522.0 5851.0,1830.0 C 5733.0,1522.0 5793.0,1582.0 5485.0,1464.0 C 5793.0,1346.0 5733.0,1406.0 5851.0,1098.0"/>
<path fill="#FFFFFF" fill-rule="evenodd" d="M 8213.0,5464.0 C 7903.0,5464.0 7621.0,5389.0 7366.0,5239.0 C 7110.0,5090.0 6910.0,4888.0 6762.0,4634.0 C 6615.0,4380.0 6542.0,4100.0 6542.0,3795.0 C 6542.0,3490.0 6616.0,3210.0 6762.0,2956.0 C 6909.0,2702.0 7110.0,2500.0 7364.0,2354.0 C 7619.0,2207.0 7901.0,2134.0 8212.0,2134.0 C 8401.0,2134.0 8582.0,2163.0 8755.0,2220.0 C 8928.0,2278.0 9085.0,2360.0 9225.0,2465.0 C 9250.0,2485.0 9264.0,2508.0 9264.0,2534.0 C 9264.0,2554.0 9256.0,2574.0 9241.0,2594.0 L 8871.0,3079.0 C 8850.0,3104.0 8827.0,3118.0 8802.0,3118.0 C 8782.0,3118.0 8762.0,3111.0 8742.0,3097.0 C 8665.0,3043.0 8580.0,3001.0 8488.0,2970.0 C 8397.0,2939.0 8305.0,2923.0 8212.0,2923.0 C 8064.0,2923.0 7926.0,2961.0 7798.0,3038.0 C 7670.0,3115.0 7568.0,3221.0 7490.0,3355.0 C 7413.0,3489.0 7375.0,3637.0 7375.0,3799.0 C 7375.0,3961.0 7414.0,4109.0 7490.0,4243.0 C 7567.0,4377.0 7670.0,4483.0 7799.0,4560.0 C 7927.0,4638.0 8065.0,4677.0 8212.0,4677.0 C 8317.0,4677.0 8410.0,4664.0 8490.0,4637.0 C 8570.0,4611.0 8656.0,4565.0 8747.0,4499.0 C 8768.0,4486.0 8789.0,4478.0 8809.0,4478.0 C 8835.0,4478.0 8858.0,4491.0 8878.0,4517.0 L 9241.0,5004.0 C 9258.0,5028.0 9266.0,5050.0 9266.0,5068.0 C 9266.0,5089.0 9255.0,5109.0 9232.0,5128.0 C 9090.0,5236.0 8932.0,5320.0 8759.0,5378.0 C 8585.0,5437.0 8403.0,5467.0 8213.0,5467.0 L 8213.0,5464.0 M 11109.0,5475.0 C 10841.0,5475.0 10595.0,5410.0 10372.0,5283.0 C 10149.0,5155.0 9971.0,4981.0 9841.0,4761.0 C 9711.0,4542.0 9646.0,4302.0 9646.0,4041.0 C 9646.0,3776.0 9711.0,3533.0 9842.0,3312.0 C 9973.0,3091.0 10151.0,2917.0 10376.0,2788.0 C 10601.0,2659.0 10847.0,2594.0 11116.0,2594.0 C 11385.0,2594.0 11633.0,2659.0 11858.0,2788.0 C 12083.0,2917.0 12261.0,3091.0 12392.0,3312.0 C 12523.0,3533.0 12588.0,3776.0 12588.0,4041.0 C 12588.0,4302.0 12522.0,4542.0 12390.0,4761.0 C 12258.0,4981.0 12079.0,5154.0 11853.0,5283.0 C 11627.0,5411.0 11379.0,5475.0 11109.0,5475.0 M 11118.0,4732.0 C 11245.0,4732.0 11360.0,4702.0 11467.0,4641.0 C 11573.0,4580.0 11657.0,4497.0 11719.0,4391.0 C 11781.0,4285.0 11811.0,4168.0 11811.0,4038.0 C 11811.0,3907.0 11781.0,3788.0 11719.0,3681.0 C 11657.0,3574.0 11573.0,3490.0 11467.0,3429.0 C 11361.0,3368.0 11245.0,3338.0 11118.0,3338.0 C 10990.0,3338.0 10873.0,3368.0 10767.0,3429.0 C 10661.0,3490.0 10577.0,3574.0 10515.0,3681.0 C 10453.0,3787.0 10422.0,3906.0 10422.0,4038.0 C 10422.0,4168.0 10453.0,4285.0 10515.0,4391.0 C 10577.0,4497.0 10660.0,4580.0 10767.0,4641.0 C 10873.0,4702.0 10990.0,4732.0 11118.0,4732.0 M 14870.0,2594.0 C 15094.0,2594.0 15291.0,2645.0 15460.0,2747.0 C 15629.0,2849.0 15761.0,2994.0 15853.0,3181.0 C 15946.0,3367.0 15993.0,3584.0 15993.0,3829.0 L 15993.0,5315.0 C 15993.0,5376.0 15963.0,5406.0 15902.0,5406.0 L 15307.0,5406.0 C 15246.0,5406.0 15216.0,5376.0 15216.0,5315.0 L 15216.0,3916.0 C 15216.0,3730.0 15170.0,3581.0 15078.0,3471.0 C 14986.0,3360.0 14859.0,3305.0 14697.0,3305.0 C 14583.0,3305.0 14476.0,3333.0 14377.0,3386.0 C 14278.0,3440.0 14199.0,3511.0 14141.0,3601.0 C 14082.0,3690.0 14052.0,3784.0 14052.0,3881.0 L 14052.0,5315.0 C 14052.0,5376.0 14022.0,5406.0 13961.0,5406.0 L 13367.0,5406.0 C 13306.0,5406.0 13276.0,5376.0 13276.0,5315.0 L 13276.0,2732.0 C 13276.0,2671.0 13306.0,2641.0 13367.0,2641.0 L 13822.0,2641.0 C 13872.0,2641.0 13907.0,2664.0 13927.0,2712.0 L 14026.0,2947.0 C 14132.0,2845.0 14264.0,2761.0 14421.0,2695.0 C 14578.0,2628.0 14728.0,2595.0 14871.0,2595.0 L 14870.0,2594.0 M 17598.0,5315.0 C 17598.0,5376.0 17568.0,5406.0 17507.0,5406.0 L 16912.0,5406.0 C 16851.0,5406.0 16821.0,5376.0 16821.0,5315.0 L 16821.0,3360.0 L 16592.0,3360.0 C 16531.0,3360.0 16501.0,3330.0 16501.0,3269.0 L 16501.0,2732.0 C 16501.0,2671.0 16531.0,2641.0 16592.0,2641.0 L 16816.0,2641.0 L 16816.0,2143.0 C 16816.0,2086.0 16844.0,2053.0 16899.0,2042.0 L 17500.0,1925.0 C 17506.0,1924.0 17513.0,1923.0 17523.0,1923.0 C 17548.0,1923.0 17566.0,1931.0 17580.0,1946.0 C 17594.0,1962.0 17601.0,1982.0 17601.0,2008.0 L 17601.0,2642.0 L 18030.0,2642.0 C 18091.0,2642.0 18121.0,2672.0 18121.0,2733.0 L 18121.0,3270.0 C 18121.0,3331.0 18091.0,3361.0 18030.0,3361.0 L 17598.0,3361.0 L 17598.0,5316.0 L 17598.0,5315.0 M 19925.0,5475.0 C 19649.0,5475.0 19401.0,5410.0 19182.0,5281.0 C 18963.0,5151.0 18791.0,4977.0 18669.0,4757.0 C 18546.0,4537.0 18485.0,4298.0 18485.0,4039.0 C 18485.0,3777.0 18543.0,3536.0 18659.0,3315.0 C 18776.0,3095.0 18938.0,2920.0 19147.0,2789.0 C 19356.0,2659.0 19593.0,2593.0 19858.0,2593.0 C 20145.0,2593.0 20393.0,2655.0 20604.0,2779.0 C 20814.0,2902.0 20975.0,3073.0 21085.0,3291.0 C 21196.0,3509.0 21251.0,3757.0 21251.0,4034.0 C 21251.0,4095.0 21247.0,4154.0 21242.0,4214.0 C 21236.0,4271.0 21204.0,4299.0 21146.0,4299.0 L 19283.0,4299.0 C 19333.0,4451.0 19420.0,4570.0 19542.0,4655.0 C 19664.0,4740.0 19803.0,4783.0 19958.0,4783.0 C 20057.0,4783.0 20147.0,4769.0 20227.0,4740.0 C 20307.0,4712.0 20385.0,4671.0 20462.0,4617.0 C 20482.0,4602.0 20502.0,4594.0 20522.0,4594.0 C 20546.0,4594.0 20568.0,4607.0 20588.0,4635.0 L 20869.0,5035.0 C 20883.0,5055.0 20890.0,5073.0 20890.0,5092.0 C 20890.0,5118.0 20878.0,5141.0 20853.0,5161.0 C 20727.0,5260.0 20585.0,5337.0 20429.0,5391.0 C 20272.0,5446.0 20105.0,5472.0 19927.0,5472.0 L 19925.0,5475.0 M 20483.0,3728.0 C 20440.0,3577.0 20367.0,3461.0 20263.0,3381.0 C 20159.0,3300.0 20033.0,3260.0 19884.0,3260.0 C 19737.0,3260.0 19610.0,3301.0 19503.0,3383.0 C 19395.0,3465.0 19319.0,3581.0 19276.0,3728.0 L 20483.0,3728.0 M 22611.0,5345.0 C 22587.0,5386.0 22550.0,5407.0 22501.0,5407.0 L 21777.0,5407.0 C 21752.0,5407.0 21733.0,5401.0 21719.0,5391.0 C 21704.0,5380.0 21697.0,5367.0 21697.0,5350.0 C 21697.0,5334.0 21704.0,5315.0 21718.0,5295.0 L 22614.0,3994.0 L 21776.0,2751.0 C 21762.0,2729.0 21755.0,2711.0 21755.0,2696.0 C 21755.0,2680.0 21762.0,2666.0 21776.0,2656.0 C 21791.0,2646.0 21810.0,2641.0 21834.0,2641.0 L 22566.0,2641.0 C 22616.0,2641.0 22653.0,2662.0 22676.0,2705.0 L 23087.0,3444.0 L 23497.0,2705.0 C 23509.0,2682.0 23523.0,2666.0 23540.0,2656.0 C 23557.0,2646.0 23578.0,2641.0 23604.0,2641.0 L 24340.0,2641.0 C 24364.0,2641.0 24383.0,2646.0 24397.0,2656.0 C 24410.0,2666.0 24418.0,2679.0 24418.0,2696.0 C 24418.0,2714.0 24412.0,2733.0 24400.0,2751.0 L 23583.0,3994.0 L 24456.0,5297.0 C 24469.0,5315.0 24474.0,5333.0 24474.0,5350.0 C 24474.0,5367.0 24468.0,5380.0 24453.0,5391.0 C 24439.0,5402.0 24420.0,5407.0 24396.0,5407.0 L 23669.0,5407.0 C 23620.0,5407.0 23583.0,5386.0 23559.0,5345.0 L 23081.0,4534.0 L 22610.0,5345.0 L 22611.0,5345.0 M 25904.0,5315.0 C 25904.0,5376.0 25874.0,5406.0 25813.0,5406.0 L 25218.0,5406.0 C 25157.0,5406.0 25127.0,5376.0 25127.0,5315.0 L 25127.0,3360.0 L 24898.0,3360.0 C 24837.0,3360.0 24807.0,3330.0 24807.0,3269.0 L 24807.0,2732.0 C 24807.0,2671.0 24837.0,2641.0 24898.0,2641.0 L 25122.0,2641.0 L 25122.0,2143.0 C 25122.0,2086.0 25150.0,2053.0 25205.0,2042.0 L 25806.0,1925.0 C 25812.0,1924.0 25819.0,1923.0 25829.0,1923.0 C 25854.0,1923.0 25872.0,1931.0 25886.0,1946.0 C 25900.0,1962.0 25907.0,1982.0 25907.0,2008.0 L 25907.0,2642.0 L 26336.0,2642.0 C 26397.0,2642.0 26427.0,2672.0 26427.0,2733.0 L 26427.0,3270.0 C 26427.0,3331.0 26397.0,3361.0 26336.0,3361.0 L 25904.0,3361.0 L 25904.0,5316.0 L 25904.0,5315.0 M 27067.0,5406.0 C 27006.0,5406.0 26976.0,5376.0 26976.0,5315.0 L 26976.0,2286.0 C 26976.0,2225.0 27006.0,2195.0 27067.0,2195.0 L 28363.0,2195.0 C 28583.0,2195.0 28780.0,2241.0 28951.0,2333.0 C 29122.0,2425.0 29254.0,2554.0 29350.0,2719.0 C 29445.0,2884.0 29493.0,3074.0 29493.0,3287.0 C 29493.0,3491.0 29451.0,3666.0 29368.0,3811.0 C 29284.0,3956.0 29167.0,4075.0 29016.0,4167.0 L 29583.0,5298.0 C 29592.0,5316.0 29596.0,5333.0 29596.0,5346.0 C 29596.0,5364.0 29589.0,5379.0 29575.0,5389.0 C 29560.0,5400.0 29541.0,5405.0 29516.0,5405.0 L 28785.0,5405.0 C 28735.0,5405.0 28699.0,5382.0 28678.0,5336.0 L 28229.0,4378.0 C 28206.0,4379.0 28174.0,4380.0 28131.0,4380.0 L 27799.0,4380.0 L 27799.0,5313.0 C 27799.0,5374.0 27769.0,5404.0 27708.0,5404.0 L 27068.0,5404.0 L 27067.0,5406.0 M 28288.0,3684.0 C 28358.0,3684.0 28421.0,3666.0 28478.0,3629.0 C 28535.0,3592.0 28579.0,3543.0 28611.0,3482.0 C 28643.0,3421.0 28659.0,3357.0 28659.0,3288.0 C 28659.0,3168.0 28624.0,3075.0 28553.0,3010.0 C 28483.0,2946.0 28397.0,2913.0 28295.0,2913.0 L 27799.0,2913.0 L 27799.0,3683.0 L 28288.0,3683.0 L 28288.0,3684.0 M 31464.0,5474.0 C 31196.0,5474.0 30950.0,5409.0 30727.0,5282.0 C 30504.0,5154.0 30326.0,4980.0 30196.0,4760.0 C 30066.0,4541.0 30001.0,4301.0 30001.0,4040.0 C 30001.0,3775.0 30066.0,3532.0 30197.0,3311.0 C 30328.0,3090.0 30506.0,2916.0 30731.0,2787.0 C 30956.0,2658.0 31202.0,2593.0 31471.0,2593.0 C 31740.0,2593.0 31988.0,2658.0 32213.0,2787.0 C 32438.0,2916.0 32616.0,3090.0 32747.0,3311.0 C 32878.0,3532.0 32943.0,3775.0 32943.0,4040.0 C 32943.0,4301.0 32877.0,4541.0 32745.0,4760.0 C 32613.0,4980.0 32434.0,5153.0 32208.0,5282.0 C 31982.0,5410.0 31734.0,5474.0 31464.0,5474.0 M 31473.0,4731.0 C 31600.0,4731.0 31715.0,4701.0 31822.0,4640.0 C 31928.0,4579.0 32012.0,4496.0 32074.0,4390.0 C 32136.0,4284.0 32166.0,4167.0 32166.0,4037.0 C 32166.0,3906.0 32136.0,3787.0 32074.0,3680.0 C 32012.0,3573.0 31928.0,3489.0 31822.0,3428.0 C 31716.0,3367.0 31600.0,3337.0 31473.0,3337.0 C 31345.0,3337.0 31228.0,3367.0 31122.0,3428.0 C 31016.0,3489.0 30932.0,3573.0 30870.0,3680.0 C 30808.0,3786.0 30777.0,3905.0 30777.0,4037.0 C 30777.0,4167.0 30808.0,4284.0 30870.0,4390.0 C 30932.0,4496.0 31015.0,4579.0 31122.0,4640.0 C 31228.0,4701.0 31345.0,4731.0 31473.0,4731.0 M 34873.0,5474.0 C 34602.0,5474.0 34358.0,5409.0 34141.0,5280.0 C 33923.0,5151.0 33753.0,4977.0 33631.0,4758.0 C 33508.0,4538.0 33447.0,4299.0 33447.0,4038.0 C 33447.0,3774.0 33508.0,3533.0 33630.0,3312.0 C 33752.0,3092.0 33921.0,2917.0 34140.0,2787.0 C 34358.0,2658.0 34604.0,2593.0 34879.0,2593.0 C 35059.0,2593.0 35228.0,2620.0 35385.0,2673.0 C 35543.0,2726.0 35684.0,2802.0 35810.0,2899.0 C 35836.0,2921.0 35849.0,2944.0 35849.0,2968.0 C 35849.0,2986.0 35842.0,3006.0 35828.0,3028.0 L 35537.0,3442.0 C 35517.0,3471.0 35494.0,3485.0 35468.0,3485.0 C 35452.0,3485.0 35432.0,3478.0 35408.0,3462.0 C 35331.0,3409.0 35253.0,3368.0 35175.0,3341.0 C 35098.0,3313.0 35008.0,3300.0 34908.0,3300.0 C 34785.0,3300.0 34670.0,3332.0 34565.0,3396.0 C 34460.0,3460.0 34376.0,3548.0 34313.0,3660.0 C 34251.0,3772.0 34220.0,3898.0 34220.0,4038.0 C 34220.0,4175.0 34252.0,4300.0 34315.0,4411.0 C 34378.0,4522.0 34462.0,4609.0 34569.0,4673.0 C 34675.0,4736.0 34789.0,4768.0 34911.0,4768.0 C 35010.0,4768.0 35099.0,4754.0 35177.0,4728.0 C 35256.0,4701.0 35333.0,4661.0 35409.0,4608.0 C 35432.0,4593.0 35452.0,4585.0 35469.0,4585.0 C 35495.0,4585.0 35518.0,4599.0 35538.0,4628.0 L 35829.0,5042.0 C 35844.0,5063.0 35852.0,5084.0 35852.0,5104.0 C 35852.0,5124.0 35843.0,5142.0 35824.0,5159.0 C 35698.0,5260.0 35555.0,5337.0 35395.0,5392.0 C 35235.0,5447.0 35062.0,5474.0 34875.0,5474.0 L 34873.0,5474.0 M 39195.0,5295.0 C 39207.0,5313.0 39213.0,5332.0 39213.0,5350.0 C 39213.0,5366.0 39207.0,5380.0 39192.0,5390.0 C 39179.0,5400.0 39159.0,5405.0 39135.0,5405.0 L 38428.0,5405.0 C 38379.0,5405.0 38342.0,5385.0 38318.0,5345.0 L 37652.0,4328.0 L 37339.0,4668.0 L 37339.0,5313.0 C 37339.0,5374.0 37309.0,5404.0 37248.0,5404.0 L 36654.0,5404.0 C 36593.0,5404.0 36563.0,5374.0 36563.0,5313.0 L 36563.0,1922.0 C 36563.0,1861.0 36593.0,1831.0 36654.0,1831.0 L 37248.0,1831.0 C 37309.0,1831.0 37339.0,1861.0 37339.0,1922.0 L 37339.0,3655.0 L 38135.0,2690.0 C 38164.0,2655.0 38202.0,2638.0 38247.0,2638.0 L 39049.0,2638.0 C 39074.0,2638.0 39093.0,2642.0 39108.0,2651.0 C 39122.0,2660.0 39129.0,2673.0 39129.0,2690.0 C 39129.0,2710.0 39119.0,2730.0 39099.0,2750.0 L 38180.0,3752.0 L 39194.0,5295.0 L 39195.0,5295.0 M 40953.0,5474.0 C 40677.0,5474.0 40429.0,5409.0 40210.0,5280.0 C 39991.0,5150.0 39819.0,4976.0 39697.0,4756.0 C 39574.0,4536.0 39513.0,4297.0 39513.0,4038.0 C 39513.0,3776.0 39571.0,3535.0 39687.0,3314.0 C 39804.0,3094.0 39966.0,2919.0 40175.0,2788.0 C 40384.0,2658.0 40621.0,2592.0 40886.0,2592.0 C 41173.0,2592.0 41421.0,2654.0 41632.0,2778.0 C 41842.0,2901.0 42003.0,3072.0 42113.0,3290.0 C 42224.0,3508.0 42279.0,3756.0 42279.0,4033.0 C 42279.0,4094.0 42275.0,4153.0 42270.0,4213.0 C 42264.0,4270.0 42232.0,4298.0 42174.0,4298.0 L 40311.0,4298.0 C 40361.0,4450.0 40448.0,4569.0 40570.0,4654.0 C 40692.0,4739.0 40831.0,4782.0 40986.0,4782.0 C 41085.0,4782.0 41175.0,4768.0 41255.0,4739.0 C 41335.0,4711.0 41413.0,4670.0 41490.0,4616.0 C 41510.0,4601.0 41530.0,4593.0 41550.0,4593.0 C 41574.0,4593.0 41596.0,4606.0 41616.0,4634.0 L 41897.0,5034.0 C 41911.0,5054.0 41918.0,5072.0 41918.0,5091.0 C 41918.0,5117.0 41906.0,5140.0 41881.0,5160.0 C 41755.0,5259.0 41613.0,5336.0 41457.0,5390.0 C 41300.0,5445.0 41133.0,5471.0 40955.0,5471.0 L 40953.0,5474.0 M 41511.0,3727.0 C 41468.0,3576.0 41395.0,3460.0 41291.0,3380.0 C 41187.0,3299.0 41061.0,3259.0 40912.0,3259.0 C 40765.0,3259.0 40638.0,3300.0 40531.0,3382.0 C 40423.0,3464.0 40347.0,3580.0 40304.0,3727.0 L 41511.0,3727.0 M 43765.0,5314.0 C 43765.0,5375.0 43735.0,5405.0 43674.0,5405.0 L 43079.0,5405.0 C 43018.0,5405.0 42988.0,5375.0 42988.0,5314.0 L 42988.0,3359.0 L 42759.0,3359.0 C 42698.0,3359.0 42668.0,3329.0 42668.0,3268.0 L 42668.0,2731.0 C 42668.0,2670.0 42698.0,2640.0 42759.0,2640.0 L 42983.0,2640.0 L 42983.0,2142.0 C 42983.0,2085.0 43011.0,2052.0 43066.0,2041.0 L 43667.0,1924.0 C 43673.0,1923.0 43680.0,1922.0 43690.0,1922.0 C 43715.0,1922.0 43733.0,1930.0 43747.0,1945.0 C 43761.0,1961.0 43768.0,1981.0 43768.0,2007.0 L 43768.0,2641.0 L 44197.0,2641.0 C 44258.0,2641.0 44288.0,2671.0 44288.0,2732.0 L 44288.0,3269.0 C 44288.0,3330.0 44258.0,3360.0 44197.0,3360.0 L 43765.0,3360.0 L 43765.0,5315.0 L 43765.0,5314.0"/>
</svg>
`;var Ge=(t="#FFFFFF")=>`data:image/svg+xml,${encodeURIComponent(kt.replaceAll("currentColor",t))}`,Tt=t=>`data:image/svg+xml,${encodeURIComponent(t)}`,At={ink:Tt(Et),white:Tt(St)},T0=48,A0=new Set(["Evidence","Progress","Question","ProposalBatch","Representation"]);function M0(t){return t!==void 0&&A0.has(t)}var Qe="contextrocket-chat",R0="cr_cookie_consent",Mt="cr:consent-change",L,w,C,N,ee,K,se,ie,te,$,V,U,G,F,ce,Q,re,R,I,S,T,z,O,de,le,ne,J,xe,l,Rt,Ft,Le,E,It,Pt,Je,be,Be,Wt,ve,Z,Bt,He,Ht,H,we,Xe,$t,zt,jt,ye=class extends HTMLElement{constructor(){super();y(this,l);y(this,L,null);y(this,w,fe());y(this,C);y(this,N,0);y(this,ee,null);y(this,K,"");y(this,se);y(this,ie);y(this,te,null);y(this,$,[]);y(this,V,"questions");y(this,U,null);y(this,G,0);y(this,F,!1);y(this,ce,!1);y(this,Q,0);y(this,re,!1);y(this,R);y(this,I);y(this,S);y(this,T);y(this,z);y(this,O);y(this,de);y(this,le);y(this,ne);y(this,J);y(this,xe);y(this,Le,()=>{f(this,re,!0);let e=r(this,C).querySelector(".cr-root");e&&(e.hidden=!1,e.style.removeProperty("display"))});y(this,E,()=>{r(this,Q)||f(this,Q,window.requestAnimationFrame(()=>{f(this,Q,0),h(this,l,It).call(this)}))});f(this,C,this.attachShadow({mode:"open"}))}static get observedAttributes(){return["data-contextrocket-api-key","data-contextrocket-handle","data-contextrocket-subject-kind","data-contextrocket-mode","data-contextrocket-api-base","data-contextrocket-accent","data-contextrocket-launcher-color","data-contextrocket-greeting","data-contextrocket-title","data-contextrocket-header-logo","data-contextrocket-header-background","data-contextrocket-header-foreground","data-contextrocket-subtitle","data-contextrocket-title-badge","data-contextrocket-launcher-appearance","data-contextrocket-launcher-avatar-background","data-contextrocket-agent-avatar-style","data-contextrocket-agent-header-start","data-contextrocket-agent-header-end","data-contextrocket-agent-avatar","data-contextrocket-launcher-avatar","data-contextrocket-ref","data-contextrocket-background","data-contextrocket-foreground","data-contextrocket-surface","data-contextrocket-muted","data-contextrocket-border","data-contextrocket-powered-by-logo","data-contextrocket-suggestions","data-contextrocket-position","data-contextrocket-fullscreen","data-contextrocket-fullscreen-on-open","data-contextrocket-fullscreen-on-load","data-contextrocket-locale"]}connectedCallback(){f(this,L,X(this)),r(this,L)&&(this.lang=r(this,L).locale,f(this,w,fe(r(this,L).greeting)),h(this,l,Pt).call(this),h(this,l,Ft).call(this),h(this,l,Wt).call(this),h(this,l,H).call(this),r(this,E).call(this),window.addEventListener("scroll",r(this,E),!0),window.addEventListener(Mt,r(this,Le)),window.addEventListener("resize",r(this,E)),window.visualViewport?.addEventListener("scroll",r(this,E)),window.visualViewport?.addEventListener("resize",r(this,E)),document.addEventListener("input",r(this,E),!0),document.addEventListener("change",r(this,E),!0),document.addEventListener("toggle",r(this,E),!0),h(this,l,Z).call(this,r(this,L).fullscreenOnLoad===!0),h(this,l,ve).call(this,r(this,L).fullscreenOnLoad===!0),h(this,l,Be).call(this))}disconnectedCallback(){window.removeEventListener(Mt,r(this,Le)),window.removeEventListener("scroll",r(this,E),!0),window.removeEventListener("resize",r(this,E)),window.visualViewport?.removeEventListener("scroll",r(this,E)),window.visualViewport?.removeEventListener("resize",r(this,E)),document.removeEventListener("input",r(this,E),!0),document.removeEventListener("change",r(this,E),!0),document.removeEventListener("toggle",r(this,E),!0),r(this,Q)&&window.cancelAnimationFrame(r(this,Q))}attributeChangedCallback(){if(!this.isConnected)return;let e=X(this);if(!e||(f(this,L,e),this.lang=e.locale,!r(this,J)))return;let a=P(e),o=r(this,C).querySelector(".cr-root");o.lang=this.lang,r(this,C).querySelector(".cr-title-text").textContent=e.title??a.defaultTitle;let s=r(this,C).querySelector(".cr-title-subtitle");s.textContent=e.subtitle??"",s.hidden=!e.subtitle;let i=r(this,C).querySelector(".cr-title-badge");i.textContent=e.titleBadge??"",i.hidden=!e.titleBadge,r(this,S).setAttribute("aria-label",e.title??a.defaultTitle),r(this,C).querySelector(".cr-close").setAttribute("aria-label",a.close),r(this,I).hidden=!(e.fullscreen||e.fullscreenOnOpen||e.fullscreenOnLoad),r(this,I).setAttribute("aria-label",r(this,F)?a.collapse:a.expand),!e.fullscreen&&!e.fullscreenOnOpen&&!e.fullscreenOnLoad&&h(this,l,Z).call(this,!1),r(this,R).setAttribute("aria-label",r(this,S).dataset.open==="true"?a.close:a.open),r(this,z).placeholder=a.placeholder,r(this,z).setAttribute("aria-label",a.placeholder),r(this,ne).textContent=a.retry,r(this,J).setAttribute("aria-label",a.poweredBy),r(this,J).querySelector(".powered-by-label").textContent=a.poweredByLabel,r(this,xe).src=At[e.poweredByLogo??"ink"],r(this,C).querySelector(".cr-launcher-icon-open").src=Ge(e.launcherForeground);let c=r(this,C).querySelector(".cr-launcher-icon-open"),d=r(this,C).querySelector(".cr-launcher-avatar");c.hidden=!!e.launcherAvatarUrl,d&&(d.hidden=!e.launcherAvatarUrl,e.launcherAvatarUrl&&(d.src=e.launcherAvatarUrl)),o.dataset.launcherAppearance=e.launcherAppearance??"brand",o.dataset.agentAvatarStyle=e.agentAvatarStyle??"circle",h(this,l,H).call(this),r(this,J).href=me(e),this.style.setProperty("--cr-accent",e.accentColor??"#0e0f13"),h(this,l,Je).call(this,e),r(this,C).querySelector(".cr-root")?.setAttribute("data-position",e.position??"bottom-right"),r(this,E).call(this),e.suggestions&&f(this,$,e.suggestions),h(this,l,Be).call(this)}};L=new WeakMap,w=new WeakMap,C=new WeakMap,N=new WeakMap,ee=new WeakMap,K=new WeakMap,se=new WeakMap,ie=new WeakMap,te=new WeakMap,$=new WeakMap,V=new WeakMap,U=new WeakMap,G=new WeakMap,F=new WeakMap,ce=new WeakMap,Q=new WeakMap,re=new WeakMap,R=new WeakMap,I=new WeakMap,S=new WeakMap,T=new WeakMap,z=new WeakMap,O=new WeakMap,de=new WeakMap,le=new WeakMap,ne=new WeakMap,J=new WeakMap,xe=new WeakMap,l=new WeakSet,Rt=function(){try{let e=JSON.parse(localStorage.getItem(R0)||"null");if(!e||typeof e!="object")return!1;let a=e;return a.version===2&&!!a.preferences&&typeof a.preferences=="object"||a.version===1&&typeof a.choice=="string"}catch{return!1}},Ft=function(){if(!r(this,L)?.consentGate)return;f(this,re,h(this,l,Rt).call(this));let e=r(this,C).querySelector(".cr-root");e&&(e.hidden=!r(this,re),e.style.display=r(this,re)?"":"none")},Le=new WeakMap,E=new WeakMap,It=function(){let e=r(this,C).querySelector(".cr-root");if(!e||!r(this,R))return;if(r(this,R).hidden){e.style.removeProperty("--cr-fab-lift");return}if(!window.matchMedia("(max-width: 30rem)").matches){e.style.removeProperty("--cr-fab-lift");return}e.style.removeProperty("--cr-fab-lift");let a=r(this,R).getBoundingClientRect(),o=Array.from(document.querySelectorAll('input:not([type="hidden"]), select, textarea, button, a[href], [role="button"], [tabindex="0"]')).flatMap(i=>{let c=window.getComputedStyle(i);if(c.display==="none"||c.visibility==="hidden")return[];let d=i,u=[];for(;d&&d!==document.body;)u.push(window.getComputedStyle(d).position),d=d.parentElement;if(!xt(u))return[];let p=i.getBoundingClientRect(),g=i.closest("label"),k=i.parentElement,m=k?.getBoundingClientRect(),v=g?.getBoundingClientRect()??(k&&k!==document.body&&m&&m.height<=p.height+64&&m.width>=p.width?m:p);return v.width>0&&v.height>0?[{top:v.top,right:v.right,bottom:v.bottom,left:v.left}]:[]}),s=Lt({top:a.top,right:a.right,bottom:a.bottom,left:a.left},o);s>0?e.style.setProperty("--cr-fab-lift",`${s}px`):e.style.removeProperty("--cr-fab-lift")},Pt=function(){let e=r(this,L),a=P(e),o=document.createElement("style");o.textContent=yt(e.accentColor);let s=document.createElement("div");s.className="cr-root",s.lang=this.lang,s.dataset.position=e.position??"bottom-right",s.dataset.headerLogo=String(!!e.headerLogoUrl),s.innerHTML=`
      <div class="cr-panel" data-open="false" data-position="${B(e.position??"bottom-right")}" part="panel" role="dialog" aria-modal="true" aria-hidden="true" aria-label="${B(e.title??a.defaultTitle)}" inert>
        <header class="cr-header">
          <h2 class="cr-title"${e.headerLogoUrl?` aria-label="${B(e.title??a.defaultTitle)}"`:""}>${e.headerLogoUrl?`<img class="cr-title-brand-logo" src="${B(e.headerLogoUrl)}" alt="" aria-hidden="true">`:`<span class="cr-title-probe"></span><span class="cr-title-copy"><span class="cr-title-heading"><span class="cr-title-text">${B(e.title??a.defaultTitle)}</span><span class="cr-title-badge"${e.titleBadge?"":" hidden"}>${B(e.titleBadge??"")}</span></span><span class="cr-title-subtitle"${e.subtitle?"":" hidden"}>${B(e.subtitle??"")}</span></span>`}</h2>
          <div class="cr-header-actions">
            <button type="button" class="cr-fullscreen-toggle" aria-label="${a.expand}" aria-pressed="false"${e.fullscreen||e.fullscreenOnOpen||e.fullscreenOnLoad?"":" hidden"}>
              <svg class="cr-fullscreen-expand-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M16 3h3a2 2 0 0 1 2 2v3"/><path d="M21 16v3a2 2 0 0 1-2 2h-3"/><path d="M8 21H5a2 2 0 0 1-2-2v-3"/></svg>
              <svg class="cr-fullscreen-collapse-icon" hidden xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 8V5"/><path d="M8 8H5"/><path d="M16 8h3"/><path d="M16 8V5"/><path d="M16 16v3"/><path d="M16 16h3"/><path d="M8 16H5"/><path d="M8 16v3"/></svg>
            </button>
            <button type="button" class="cr-close" aria-label="${a.close}"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>
          </div>
        </header>
        <div class="cr-messages" part="messages" role="log" aria-live="polite"></div>
        <p class="cr-status" role="status" aria-live="polite" hidden></p>
        <p class="cr-error" role="alert" hidden part="error"></p>
        <button type="button" class="cr-retry" hidden>${a.retry}</button>
        <form class="cr-composer" part="composer">
          <input class="cr-input" type="text" autocomplete="off" placeholder="${a.placeholder}" aria-label="${a.placeholder}" />
          <button class="cr-send" type="submit" data-state="send" aria-label="${a.send}"></button>
        </form>
        <footer class="cr-footer" part="footer">
          <a class="powered-by-badge" href="${B(me(e))}" target="_blank" rel="noopener noreferrer" aria-label="${B(a.poweredBy)}">
            <span class="powered-by-label">${B(a.poweredByLabel)}</span>
            <img class="powered-by-logo" src="${At[e.poweredByLogo??"ink"]}" alt="ContextRocket" width="149" height="20">
          </a>
        </footer>
      </div>
      <button type="button" class="cr-launcher" aria-label="${a.open}" aria-expanded="false" aria-controls="contextrocket-chat-panel" part="launcher">
        <img class="cr-launcher-icon-open" src="${Ge(e.launcherForeground)}" alt="" width="28" height="28" aria-hidden="true"${e.launcherAvatarUrl?" hidden":""}>
        <img class="cr-launcher-avatar"${e.launcherAvatarUrl?` src="${B(e.launcherAvatarUrl)}"`:""} alt="" width="44" height="44" aria-hidden="true"${e.launcherAvatarUrl?"":" hidden"}>
      </button>
    `,r(this,C).replaceChildren(o,s),f(this,S,r(this,C).querySelector(".cr-panel")),r(this,S).id="contextrocket-chat-panel";let i=r(this,C).querySelector(".cr-title-probe");if(i){let u=h(this,l,be).call(this,!1);u.classList.add("cr-title-probe"),i.replaceWith(u)}r(this,C).querySelector(".cr-title-brand-logo")?.addEventListener("error",u=>{let p=u.currentTarget,g=h(this,l,be).call(this,!1);g.classList.add("cr-title-probe");let k=document.createElement("span");k.className="cr-title-text",k.textContent=e.title??a.defaultTitle,p.replaceWith(g,k),s.dataset.headerLogo="false"}),s.dataset.launcherAppearance=e.launcherAppearance??"brand",s.dataset.agentAvatarStyle=e.agentAvatarStyle??"circle";let c=r(this,C).querySelector(".cr-title-text");c&&(c.textContent=e.title??a.defaultTitle),f(this,R,r(this,C).querySelector(".cr-launcher"));let d=r(this,C).querySelector(".cr-launcher-avatar");d?.addEventListener("error",()=>{d.getAttribute("src")===r(this,L)?.launcherAvatarUrl&&(d.hidden=!0,r(this,C).querySelector(".cr-launcher-icon-open").hidden=!1)}),f(this,I,r(this,C).querySelector(".cr-fullscreen-toggle")),f(this,T,r(this,C).querySelector(".cr-messages")),f(this,z,r(this,C).querySelector(".cr-input")),f(this,O,r(this,C).querySelector(".cr-send")),f(this,de,r(this,C).querySelector(".cr-error")),f(this,le,r(this,C).querySelector(".cr-status")),f(this,ne,r(this,C).querySelector(".cr-retry")),f(this,J,r(this,C).querySelector(".cr-footer a")),f(this,xe,r(this,C).querySelector(".powered-by-logo")),h(this,l,Je).call(this,e)},Je=function(e){let a=[["--cr-launcher-bg",e.launcherColor??"#FF2B67"],["--cr-launcher-fg",e.launcherForeground??"#FFFFFF"],["--cr-launcher-avatar-bg",e.launcherAvatarBackground],["--cr-agent-header-start",e.agentHeaderStartColor],["--cr-agent-header-end",e.agentHeaderEndColor],["--cr-header-bg",e.headerBackgroundColor],["--cr-header-fg",e.headerForegroundColor],["--cr-theme-background",e.backgroundColor],["--cr-theme-foreground",e.foregroundColor],["--cr-theme-surface",e.surfaceColor],["--cr-theme-muted",e.mutedColor],["--cr-theme-border",e.borderColor]];for(let[s,i]of a)i?this.style.setProperty(s,i):this.style.removeProperty(s);let o=r(this,C).querySelector(".cr-root");o&&(o.dataset.headerLogo=String(!!e.headerLogoUrl))},be=function(e){let a=document.createElement("span");a.className="cr-probe",a.dataset.working=String(e);let o=r(this,L)?.agentIdentity??"contextrocket";if(a.dataset.identity=r(this,L)?.agentAvatarUrl?"custom":o,a.setAttribute("aria-hidden","true"),r(this,L)?.agentAvatarUrl){let s=document.createElement("img");s.className="cr-agent-avatar",s.src=r(this,L).agentAvatarUrl,s.alt="",s.loading="lazy",s.decoding="async",a.appendChild(s)}else if(o==="probe")a.innerHTML='<svg viewBox="0 0 64 64" focusable="false"><path d="M32 6c11 0 18 7.5 18 18v17c0 7-5.5 12-12.5 12h-11C19.5 53 14 48 14 41V24C14 13.5 21 6 32 6z"/><rect x="17" y="21" width="30" height="10" rx="5" class="cr-probe-visor"/><rect x="34.5" y="23" width="4" height="6" rx=".8" class="cr-probe-eye"/><rect x="22" y="54.5" width="6" height="3.5" rx="1.75" class="cr-probe-foot"/><rect x="36" y="54.5" width="6" height="3.5" rx="1.75" class="cr-probe-foot"/></svg>';else{let s=document.createElement("img");s.className="cr-agent-mark",s.src=Ge("#FFFFFF"),s.alt="",s.decoding="async",a.appendChild(s)}return a},Be=async function(){let e=r(this,L);if(!e||e.mode!=="live"||e.suggestions?.length||!e.apiBaseUrl||!e.handle){f(this,G,r(this,G)+1),f(this,U,null);let u=r(this,$).length>0;f(this,$,[]),u&&!h(this,l,we).call(this)&&h(this,l,H).call(this);return}let a=e.handle,o=e.apiBaseUrl,s=e.subjectKind??"company",i=`${o}
${s}
${a}`;if(r(this,U)===i)return;f(this,U,i);let c=++De(this,G)._,d=r(this,$).length>0;f(this,$,[]),d&&!h(this,l,we).call(this)&&h(this,l,H).call(this);try{let u=await fetch(ut(o,s,a),{method:"GET",mode:"cors",credentials:"omit",headers:{accept:"application/json"}});if(c!==r(this,G))return;if(!u.ok){f(this,U,null);return}let p=await u.json();if(c!==r(this,G))return;if(!p||typeof p!="object"){f(this,U,null);return}let g=p.skills;if(!Array.isArray(g)){f(this,U,null);return}let k=g.flatMap(m=>{if(!m||typeof m!="object")return[];let v=m.examples;return Array.isArray(v)?v:[]}).filter(m=>typeof m=="string").map(m=>m.trim().slice(0,200)).filter(Boolean).slice(0,5);k.length&&!h(this,l,we).call(this)&&(f(this,$,k),h(this,l,H).call(this))}catch{c===r(this,G)&&f(this,U,null)}},Wt=function(){r(this,R).addEventListener("click",()=>{let e=r(this,S).dataset.open==="true";e||h(this,l,Z).call(this,r(this,L)?.fullscreenOnOpen===!0),h(this,l,ve).call(this,!e)}),r(this,C).querySelector(".cr-close")?.addEventListener("click",()=>h(this,l,ve).call(this,!1)),r(this,I).addEventListener("click",()=>h(this,l,Z).call(this,!r(this,F))),r(this,ne).addEventListener("click",()=>void h(this,l,He).call(this,r(this,K),r(this,se),r(this,ie))),r(this,T).addEventListener("click",e=>{let a=e.target,o=a.closest("[data-suggestion-tab]");if(o?.dataset.suggestionTab==="questions"||o?.dataset.suggestionTab==="cards"){let i=o.dataset.suggestionTab;f(this,V,i),h(this,l,H).call(this),r(this,T).querySelector(`[data-suggestion-tab="${i}"]`)?.focus({preventScroll:!0});return}let s=a.closest("[data-suggestion]");if(s?.dataset.suggestion){let i=M0(s.dataset.demoCard)?s.dataset.demoCard:void 0;h(this,l,He).call(this,s.dataset.suggestion,void 0,i)}}),r(this,C).querySelector(".cr-composer")?.addEventListener("submit",e=>{e.preventDefault(),r(this,w).status==="streaming"?h(this,l,Ht).call(this):h(this,l,Bt).call(this)}),r(this,C).addEventListener("keydown",e=>{if(!(e instanceof KeyboardEvent)||!r(this,S)||r(this,S).dataset.open!=="true")return;if(e.key==="Escape"){e.preventDefault(),r(this,F)?(h(this,l,Z).call(this,!1),r(this,I).focus()):h(this,l,ve).call(this,!1);return}if(e.key!=="Tab")return;let a=Array.from(r(this,S).querySelectorAll(["button:not([disabled]):not([hidden])","input:not([disabled]):not([hidden])","a[href]:not([hidden])",'[tabindex]:not([tabindex="-1"]):not([hidden])'].join(", "))).filter(c=>!c.closest("[hidden], [inert]"));if(!a.length)return;let o=a[0],s=a[a.length-1],i=r(this,C).activeElement;!i||!a.includes(i)?(e.preventDefault(),(e.shiftKey?s:o).focus()):e.shiftKey&&i===o?(e.preventDefault(),s.focus()):!e.shiftKey&&i===s&&(e.preventDefault(),o.focus())})},ve=function(e){if(!r(this,S))return;let a=r(this,S).dataset.open==="true";e||h(this,l,Z).call(this,!1),r(this,S).dataset.open=e?"true":"false",r(this,S).setAttribute("aria-hidden",String(!e));let o=P(r(this,L));r(this,R).setAttribute("aria-label",e?o.close:o.open),e?(r(this,C).querySelector(".cr-root")?.style.removeProperty("--cr-fab-lift"),h(this,l,Be).call(this),r(this,S).removeAttribute("inert"),r(this,R).setAttribute("aria-expanded","true"),(r(this,z).disabled?r(this,O):r(this,z)).focus()):(r(this,S).setAttribute("inert",""),r(this,R).setAttribute("aria-expanded","false"),r(this,E).call(this),a&&r(this,R).focus())},Z=function(e){if(!r(this,S))return;let a=r(this,L)?.fullscreen||r(this,L)?.fullscreenOnOpen||r(this,L)?.fullscreenOnLoad;f(this,F,!!(e&&a));let o=r(this,C).querySelector(".cr-root");if(o&&(o.dataset.fullscreen=String(r(this,F))),r(this,S).dataset.fullscreen=String(r(this,F)),!r(this,I))return;let s=P(r(this,L));r(this,I).setAttribute("aria-label",r(this,F)?s.collapse:s.expand),r(this,I).setAttribute("aria-pressed",String(r(this,F)));let i=r(this,I).querySelector(".cr-fullscreen-expand-icon"),c=r(this,I).querySelector(".cr-fullscreen-collapse-icon");r(this,F)?(i?.setAttribute("hidden",""),c?.removeAttribute("hidden")):(i?.removeAttribute("hidden"),c?.setAttribute("hidden","")),r(this,R).hidden=r(this,F),r(this,E).call(this)},Bt=async function(){let e=r(this,z).value.trim();e&&(r(this,z).value="",await h(this,l,He).call(this,e))},He=async function(e,a,o){let s=r(this,L);if(!s||!e.trim()||!Ce(r(this,w)))return;f(this,K,e.trim()),f(this,se,a??crypto.randomUUID()),f(this,ie,o);let i=Fe(r(this,w),r(this,K));f(this,w,i.state),f(this,ee,i.assistantMessageId),f(this,ce,!0);let c=++De(this,N)._,d=new AbortController;f(this,te,d),h(this,l,H).call(this),r(this,O).focus();try{for await(let u of he(s,{message:r(this,K),messageId:r(this,se),threadId:r(this,w).threadId??void 0,demoCard:r(this,ie)},void 0,d.signal)){if(c!==r(this,N))return;if(f(this,w,Ie(r(this,w),u,i.assistantMessageId)),h(this,l,H).call(this),u.type==="error"||u.type==="unsupported"||u.type==="done")break}}catch{c===r(this,N)&&(f(this,w,{...r(this,w),status:"error",errorMessage:null,errorReason:"generic"}),h(this,l,H).call(this))}finally{c===r(this,N)&&f(this,te,null)}},Ht=function(){r(this,te)?.abort(),f(this,N,r(this,N)+1),f(this,te,null),f(this,w,{...r(this,w),status:"canceled",errorMessage:P(r(this,L)).canceled,errorReason:null}),h(this,l,H).call(this)},H=function(){if(!r(this,L))return;let e=P(r(this,L)),a=r(this,T).scrollTop,o=r(this,T).scrollHeight-r(this,T).clientHeight-a,s=r(this,ce)||o<=T0,i=r(this,C).querySelector(".cr-title-probe");i&&(i.dataset.working=String(r(this,w).status==="streaming")),f(this,ce,!1),r(this,T).replaceChildren();let c=h(this,l,we).call(this);if(r(this,T).dataset.welcome=String(!c),r(this,w).messages.length===0){let m=document.createElement("div");m.className="cr-empty",m.dataset.suggestionsView=r(this,V);let v=h(this,l,be).call(this,!1);v.classList.add("cr-probe-large");let _=document.createElement("h3");_.textContent=e.emptyTitle;let D=document.createElement("p");D.textContent=e.emptyDescription,(r(this,L).agentAvatarUrl||r(this,L).agentIdentity==="probe")&&m.appendChild(v),m.append(_,D,h(this,l,Xe).call(this,e)),r(this,T).appendChild(m)}let d=c?void 0:r(this,w).messages.find(m=>m.role==="assistant"&&m.content.trim())?.id;for(let m of r(this,w).messages){if(m.role==="assistant"&&!m.content.trim()&&!m.sourceRefs?.length&&!m.suggestions?.length&&!m.responseSpec&&!m.responseUnavailable&&!(r(this,w).status==="streaming"&&m.id===r(this,ee)))continue;let v=document.createElement("div");v.className="cr-message",v.dataset.role=m.role;let _=m.role==="assistant"&&m.id===d;if(_&&(v.dataset.welcome="true"),m.role==="assistant"){if(_||v.appendChild(h(this,l,be).call(this,r(this,w).status==="streaming"&&m.id===r(this,ee))),We(v,m.content),m.responseSpec&&h(this,l,$t).call(this,v,m.responseSpec),m.responseUnavailable){let D=document.createElement("p");D.className="cr-unavailable",D.textContent=e.unavailable,v.appendChild(D)}m.sourceRefs?.length&&h(this,l,zt).call(this,v,m.sourceRefs,e),m.suggestions?.length&&r(this,w).status!=="streaming"&&h(this,l,jt).call(this,v,m.suggestions,e)}else v.textContent=m.content;m.role==="assistant"&&r(this,w).status==="streaming"&&m.id===r(this,ee)&&(v.dataset.streaming="true"),r(this,T).appendChild(v)}c===!1&&r(this,w).messages.length>0&&r(this,T).appendChild(h(this,l,Xe).call(this,e)),r(this,T).scrollTop=s?r(this,T).scrollHeight:a;let u=r(this,w).status==="error"?r(this,w).errorReason==="interrupted"?e.interrupted:r(this,w).errorReason==="unsupported"?e.unsupported:e.generic:r(this,w).status==="canceled"?e.canceled:"",p=!!u;r(this,de).hidden=!p,r(this,de).textContent=u,r(this,ne).hidden=!p||!r(this,K);let g="";r(this,w).status==="streaming"?g=r(this,w).transportState==="submitted"?e.submitted:e.working:r(this,w).status==="input-required"&&(g=e.inputRequired),r(this,le).hidden=!g,r(this,le).textContent=g;let k=r(this,w).status==="streaming";r(this,T).setAttribute("aria-busy",String(k)),r(this,z).disabled=k,r(this,O).disabled=!k&&!Ce(r(this,w)),r(this,O).textContent="",r(this,O).dataset.state=k?"stop":"send",r(this,O).setAttribute("aria-label",k?e.stop:e.send)},we=function(){return r(this,w).messages.some(e=>e.role==="user")},Xe=function(e){let a=document.createElement("div");a.className="cr-opening-suggestions";let o=document.createElement("div");o.className="cr-suggestion-tabs",o.setAttribute("role","group"),o.setAttribute("aria-label",e.suggestionGroup);let s=[{id:"questions",label:e.suggestionPrompts},{id:"cards",label:e.suggestionCards}];for(let p of s){let g=document.createElement("button");g.type="button",g.className="cr-suggestion-tab",g.dataset.suggestionTab=p.id,g.setAttribute("aria-pressed",String(r(this,V)===p.id)),g.textContent=p.label,o.appendChild(g)}let i=r(this,L)?.suggestions,c=i?.length?i:r(this,$).length?r(this,$):e.defaultSuggestions,d=r(this,V)==="questions"?c.map(p=>({label:p})):e.componentSuggestions,u=document.createElement("div");u.className="cr-suggestion-items",u.dataset.view=r(this,V);for(let p of d){let g=document.createElement("button");g.type="button",g.className="cr-suggestion",g.dataset.suggestion=p.label,"component"in p&&p.component&&(g.dataset.demoCard=p.component),g.textContent=p.label,u.appendChild(g)}return a.append(o,u),a},$t=function(e,a){let o=P(r(this,L)),s=document.createElement("section");s.className="cr-agent-response";for(let i of a.elements.response.children){let c=a.elements[i],d=document.createElement("article");if(d.className=`cr-agent-card cr-agent-card-${c.type.toLowerCase()}`,c.type==="Progress"){let u=document.createElement("strong");if(u.textContent=c.props.stage,d.appendChild(u),typeof c.props.total=="number"){let p=document.createElement("span");p.textContent=`${c.props.completed} / ${c.props.total}`,d.appendChild(p)}}else if(c.type==="Evidence"){let u=document.createElement("strong");u.textContent=o.evidence,d.appendChild(u);for(let p of c.props.refs){let g=document.createElement("div");g.className="cr-agent-evidence";let k=document.createElement("strong");if(k.textContent=p.title,g.appendChild(k),p.excerpt){let m=document.createElement("p");m.textContent=p.excerpt,g.appendChild(m)}d.appendChild(g)}}else if(c.type==="Question"){let u=document.createElement("strong");u.textContent=o.question,d.append(u,document.createTextNode(c.props.question))}else if(c.type==="ProposalBatch"){let u=document.createElement("strong");u.textContent=o.proposals,d.appendChild(u);for(let p of c.props.views){let g=document.createElement("p");g.textContent=p.summary,d.appendChild(g)}}else if(c.type==="Representation"){let u=document.createElement("strong");u.textContent=o.representation,d.appendChild(u)}s.appendChild(d)}e.appendChild(s)},zt=function(e,a,o){let s=document.createElement("div");s.className="cr-sources",s.setAttribute("aria-label",o.sources);for(let i of a){let c=Pe(i.url),d=c?document.createElement("a"):document.createElement("span");d.className="cr-source",d.textContent=i.title??i.sourceRefId,c&&d instanceof HTMLAnchorElement&&(d.href=c,d.target="_blank",d.rel="noopener noreferrer"),s.appendChild(d)}e.appendChild(s)},jt=function(e,a,o){let s=document.createElement("div");s.className="cr-suggestions",s.setAttribute("aria-label",o.suggestions);let i=document.createElement("span");i.className="cr-suggestions-label",i.setAttribute("aria-hidden","true"),i.textContent=o.suggestions,s.appendChild(i);for(let c of a){let d=document.createElement("button");d.type="button",d.className="cr-suggestion",d.dataset.suggestion=c,d.textContent=c,s.appendChild(d)}e.appendChild(s)};function ke(t=customElements){t.get(Qe)||t.define(Qe,ye)}function F0(t=document.currentScript){if(t)return t;let n=document.querySelectorAll('script[src*="embed/widget.js"], script[data-contextrocket-api-key], script[data-contextrocket-handle]');for(let e=n.length-1;e>=0;e-=1){let a=n.item(e);if(a&&X(a))return a}return null}function Ee(t=F0()){if(!t)return null;if(!X(t))return console.warn("[ContextRocket] live embed requires data-contextrocket-api-base; omit data-contextrocket-mode for a canned demo"),null;ke();let e=document.createElement(Qe);for(let a of t.attributes)a.name.startsWith("data-")&&e.setAttribute(a.name,a.value);return document.body.appendChild(e),e}ke();typeof document<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>Ee()):Ee());return Xt(I0);})();
