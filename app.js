const offers=[
{id:1,company:"Decathlon",title:"Business Developer — Alternance",city:"Lille",contract:"Apprentissage",level:"Bac+3",remote:"Hybride",salary:1100,match:96,tag:"Nouveau"},
{id:2,company:"Castorama",title:"Responsable développement commercial",city:"Templemars",contract:"Apprentissage",level:"Bac+3",remote:"Présentiel",salary:1050,match:94,tag:"Très bon match"},
{id:3,company:"Leroy Merlin",title:"Chargé de développement commercial",city:"Lezennes",contract:"Apprentissage",level:"Bac+3",remote:"Hybride",salary:1150,match:92,tag:"Nouveau"},
{id:4,company:"IKEA",title:"Commercial B2B — Alternance",city:"Lomme",contract:"Apprentissage",level:"Bac+3",remote:"Présentiel",salary:1000,match:89,tag:""},
{id:5,company:"ManoMano",title:"Business Developer Junior",city:"Paris",contract:"Apprentissage",level:"Bac+3",remote:"Hybride",salary:1350,match:88,tag:""},
{id:6,company:"Boulanger",title:"Conseiller commercial B2B",city:"Lesquin",contract:"Professionnalisation",level:"Bac+2",remote:"Présentiel",salary:980,match:86,tag:""},
{id:7,company:"Sopra Steria",title:"Business Development Assistant",city:"Lille",contract:"Apprentissage",level:"Bac+3",remote:"Hybride",salary:1200,match:85,tag:"Nouveau"},
{id:8,company:"Auchan",title:"Assistant chef de secteur",city:"Villeneuve-d'Ascq",contract:"Apprentissage",level:"Bac+3",remote:"Présentiel",salary:1050,match:84,tag:""},
{id:9,company:"Orange",title:"Chargé de développement commercial",city:"Lille",contract:"Apprentissage",level:"Bac+3",remote:"Hybride",salary:1250,match:83,tag:""},
{id:10,company:"Rexel",title:"Technico-commercial — Alternance",city:"Faches-Thumesnil",contract:"Apprentissage",level:"Bac+3",remote:"Présentiel",salary:1080,match:82,tag:""},
{id:11,company:"Veepee",title:"Business Developer",city:"Paris",contract:"Apprentissage",level:"Bac+3",remote:"Hybride",salary:1300,match:81,tag:""},
{id:12,company:"Renault Trucks",title:"Assistant commercial pièces",city:"Lille",contract:"Apprentissage",level:"Bac+2",remote:"Présentiel",salary:1000,match:80,tag:""}
];
let favorites=JSON.parse(localStorage.getItem("favorites")||"[]");
let applications=JSON.parse(localStorage.getItem("applications")||"[]");
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

function save(){localStorage.setItem("favorites",JSON.stringify(favorites));localStorage.setItem("applications",JSON.stringify(applications));updateStats()}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
function updateStats(){$("#statOffers").textContent=offers.length;$("#statApps").textContent=applications.length;$("#statFavs").textContent=favorites.length;$("#offerCount").textContent=offers.length}
function card(o,compact=false){
 const fav=favorites.includes(o.id);
 return `<article class="offer-card">
 <div><div class="offer-top"><div><div class="company">${o.company} · ${o.city}</div><h4>${o.title}</h4></div>${compact?"":`<button class="heart ${fav?"active":""}" data-fav="${o.id}">${fav?"♥":"♡"}</button>`}</div>
 <div class="offer-meta"><span class="chip match">${o.match}% match</span><span class="chip">${o.contract}</span><span class="chip">${o.remote}</span><span class="chip">≈ ${o.salary}€/mois</span></div>
 ${o.tag?`<span class="company">${o.tag}</span>`:""}</div>
 <div class="offer-actions"><button class="secondary" data-apply="${o.id}">Suivre</button><button class="primary" data-details="${o.id}">Voir l'offre</button></div>
 </article>`;
}
function bindCards(){
 $$("[data-fav]").forEach(b=>b.onclick=()=>{const id=+b.dataset.fav;favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];save();renderAll();toast(favorites.includes(id)?"Ajouté aux favoris":"Retiré des favoris")});
 $$("[data-apply]").forEach(b=>b.onclick=()=>{const id=+b.dataset.apply;if(!applications.some(a=>a.id===id))applications.push({id,status:"À candidater"});save();renderAll();toast("Offre ajoutée à ton pipeline")});
 $$("[data-details]").forEach(b=>b.onclick=()=>{const o=offers.find(x=>x.id===+b.dataset.details);toast(`${o.title} chez ${o.company} · ${o.city}`)});
}
function filtered(){
 const q=$("#searchInput").value.toLowerCase(),loc=$("#locationInput").value.toLowerCase(),c=$("#contractFilter").value,l=$("#levelFilter").value,r=$("#remoteFilter").value;
 let arr=offers.filter(o=>(!q||[o.title,o.company,o.city].join(" ").toLowerCase().includes(q))&&(!loc||o.city.toLowerCase().includes(loc))&&(!c||o.contract===c)&&(!l||o.level===l)&&(!r||o.remote===r)&&(!$("#newOnly").checked||o.tag==="Nouveau"));
 const s=$("#sortSelect").value;if(s==="salary")arr.sort((a,b)=>b.salary-a.salary);if(s==="recent")arr.sort((a,b)=>(b.tag==="Nouveau")-(a.tag==="Nouveau"));return arr;
}
function renderOffers(){const arr=filtered();$("#offerList").innerHTML=arr.length?arr.map(o=>card(o)).join(""):`<div class="offer-card"><h4>Aucune offre ne correspond à tes filtres.</h4><div class="company">Essaie d'élargir la ville ou le métier recherché.</div></div>`;$("#resultsLabel").textContent=`${arr.length} offre${arr.length>1?"s":""}`;bindCards()}
function renderFavorites(){const arr=offers.filter(o=>favorites.includes(o.id));$("#favoriteList").innerHTML=arr.length?arr.map(o=>card(o)).join(""):`<div class="offer-card"><h4>Pas encore de favoris</h4><div class="company">Ajoute des offres avec ♡ pour les retrouver ici.</div></div>`;bindCards()}
function renderDashboard(){$("#dashboardOffers").innerHTML=offers.slice(0,3).map(o=>card(o)).join("");bindCards()}
function renderPipeline(){
 const stages=["À candidater","Candidature envoyée","Entretien","Réponse"];
 $("#pipeline").innerHTML=stages.map(stage=>`<div class="stage"><h4>${stage}</h4>${applications.filter(a=>a.status===stage).map(a=>{const o=offers.find(x=>x.id===a.id);return o?`<div class="mini-app"><strong>${o.company}</strong><div>${o.title}</div><small>${o.city} · ${o.match}% match</small><select data-status="${o.id}">${stages.map(s=>`<option ${s===stage?"selected":""}>${s}</option>`).join("")}</select></div>`:""}).join("")||'<div class="company">Aucune candidature</div>'}</div>`).join("");
 $$("[data-status]").forEach(s=>s.onchange=()=>{const a=applications.find(x=>x.id===+s.dataset.status);a.status=s.value;save();renderPipeline()});
}
function renderAll(){updateStats();renderDashboard();renderOffers();renderFavorites();renderPipeline()}
function showView(view){$$(".view").forEach(v=>v.classList.remove("active-view"));$("#"+view).classList.add("active-view");$$(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.view===view));const titles={dashboard:"Ton alternance, pilotée intelligemment.",offers:"Trouve les offres qui te correspondent.",applications:"Pilote toutes tes candidatures.",favorites:"Garde les meilleures opportunités sous la main.",profile:"Ton profil, au cœur du matching."};$("#pageTitle").textContent=titles[view]||titles.dashboard;window.scrollTo({top:0,behavior:"smooth"})}
$$("[data-view]").forEach(b=>b.onclick=()=>showView(b.dataset.view));
$("#searchBtn").onclick=renderOffers;["searchInput","locationInput","contractFilter","levelFilter","remoteFilter","newOnly","sortSelect"].forEach(id=>$("#"+id).addEventListener("input",renderOffers));
$("#addAppBtn").onclick=()=>{showView("offers");toast("Choisis une offre puis clique sur « Suivre »")};
$("#saveProfile").onclick=()=>{localStorage.setItem("profile",JSON.stringify({name:$("#profileName").value,school:$("#profileSchool").value,city:$("#profileCity").value,jobs:$("#profileJobs").value,rhythm:$("#profileRhythm").value}));toast("Profil enregistré")};
$("#themeBtn").onclick=()=>{document.body.classList.toggle("dark");localStorage.setItem("dark",document.body.classList.contains("dark"))};
$("#exportBtn").onclick=()=>{const data={favorites,applications,profile:JSON.parse(localStorage.getItem("profile")||"{}")};const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));a.download="alternance-mes-donnees.json";a.click();toast("Export téléchargé")};
if(localStorage.getItem("dark")==="true")document.body.classList.add("dark");
const p=JSON.parse(localStorage.getItem("profile")||"null");if(p){$("#profileName").value=p.name||"Théophile";$("#profileSchool").value=p.school||"";$("#profileCity").value=p.city||"Lille";$("#profileJobs").value=p.jobs||"";$("#profileRhythm").value=p.rhythm||""}
renderAll();