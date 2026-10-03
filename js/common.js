/* El Djazair Idjar — maquette Webminds. Données issues du site eldjazairidjar.dz */
const EDI = {
  tel_dg: "+213 (0)20 107 799",
  tel_com: "+213 (0)20 107 215",
  mail: "commercial@eldjazairidjar.dz",
  adresse: "Bâtiment N° 01, Cité AADL, la Concorde, Bir Mourad Raïs, Alger",
  // Taux annuel indicatif : non publié par EDI, à valider
  tauxIndicatif: 0.085,
  vr: 1000,
  produits: [
    {id:"automobile", nom:"Leasing Automobile", court:"Automobile", ex:"Un véhicule utilitaire de livraison", prix:4500000,
     desc:"Financement destiné à l’acquisition de vos véhicules utilitaires et de tourisme.",
     biens:["Véhicules utilitaires","Véhicules de tourisme","Flottes d’entreprise"]},
    {id:"transport", nom:"Leasing Transport", court:"Transport", ex:"Un camion porteur", prix:14000000,
     desc:"Financement destiné à l’acquisition de votre matériel de transport.",
     biens:["Camions et tracteurs routiers","Semi-remorques","Bus et minibus"]},
    {id:"medical", nom:"Leasing Médical", court:"Médical", ex:"Un échographe pour votre cabinet", prix:6000000,
     desc:"Financement destiné à l’acquisition des équipements médicaux.",
     biens:["Imagerie et échographie","Équipements de laboratoire","Fauteuils et matériel dentaire"]},
    {id:"equipements", nom:"Leasing Équipements", court:"Équipements", ex:"Une machine de production", prix:9000000,
     desc:"Financement destiné à l’acquisition des équipements et machines de production.",
     biens:["Machines de production","Lignes de conditionnement","Équipements industriels"]},
    {id:"btp", nom:"Leasing BTP", court:"BTP", ex:"Une pelle hydraulique", prix:22000000,
     desc:"Financement réservé à l’acquisition des engins et équipements du secteur du bâtiment, travaux publics et hydraulique.",
     biens:["Engins de terrassement","Grues et nacelles","Matériel hydraulique"]},
    {id:"immobilier", nom:"Leasing Immobilier", court:"Immobilier", ex:"Un local professionnel", prix:35000000,
     desc:"Financement destiné à l’acquisition de vos locaux professionnels.",
     biens:["Bureaux","Locaux commerciaux","Ateliers et entrepôts"]}
  ],
  avantages:[
    "La possibilité de financer la totalité des équipements",
    "La comptabilisation du crédit-bail est à l’avantage du client",
    "Un délai court de traitement du dossier",
    "Des acquisitions selon le choix du client",
    "Le maintien des avantages accordés par l’AAPI",
    "Des loyers déductibles de la base imposable"
  ],
  eligibilite:[
    "Entreprises de droit algérien et professionnels",
    "Secteurs nécessitant des équipements standards",
    "Au moins deux (02) années d’activité, en extension ou en développement"
  ],
  conditions:[
    "Financement total de la demande",
    "Durée de location de 3 à 5 ans",
    "Premier loyer majoré de 10 % à 30 % maximum",
    "Valeur résiduelle de 1 000 DA",
    "Remboursement anticipé possible après paiement de 50 % du financement",
    "Loyers mensuels"
  ],
  reseau:[
    {v:"Alger", r:"Siège · Région Centre", lat:36.73, lon:3.05, siege:true},
    {v:"Akbou", r:"Représentation régionale", lat:36.46, lon:4.53},
    {v:"Sétif", r:"Représentation régionale", lat:36.19, lon:5.41},
    {v:"Batna", r:"Représentation régionale", lat:35.56, lon:6.17},
    {v:"Oran", r:"Représentation régionale", lat:35.70, lon:-0.63}
  ]
};

/* Icônes au trait (dessinées pour la maquette) */
const ICONS = {
  automobile:'<path d="M8 40h48M10 40l4-12c1-3 3-5 7-5h22c4 0 6 2 7 5l4 12v8H10z"/><path d="M14 30h36"/><circle cx="20" cy="48" r="5"/><circle cx="44" cy="48" r="5"/><path d="M28 23v7M36 23v7"/>',
  transport:'<path d="M6 18h30v28H6zM36 26h12l8 10v10H36z"/><path d="M40 30h7l5 6H40z"/><circle cx="16" cy="48" r="5"/><circle cx="46" cy="48" r="5"/><path d="M6 46h5M21 46h20"/>',
  medical:'<rect x="10" y="12" width="30" height="22" rx="2"/><path d="M14 30c3-8 6-12 11-12s8 4 11 12"/><path d="M25 34v8M16 42h18l2 10H14z"/><path d="M48 18v28M44 22c0-3 8-3 8 0M46 46h4"/>',
  equipements:'<rect x="8" y="22" width="40" height="24" rx="2"/><path d="M48 30h8v16h-8M14 46v6M42 46v6"/><circle cx="22" cy="34" r="6"/><path d="M34 30h8M34 36h8M22 22V12h14v10"/>',
  btp:'<path d="M6 50h34"/><rect x="8" y="38" width="28" height="8" rx="4"/><path d="M14 38v-8h14v8M28 32l12-16 12 8"/><path d="M52 24l2 10-8 2"/><circle cx="13" cy="42" r="2"/><circle cx="31" cy="42" r="2"/>',
  immobilier:'<path d="M8 52h48M12 52V20l18-8v40M30 22h22v30"/><path d="M17 26h6M17 34h6M17 42h6M36 30h4M44 30h4M36 38h4M44 38h4M38 46h8v6h-8z"/>'
};
function icon(id, cls="ico"){return `<svg class="${cls}" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[id]}</svg>`}

/* Calcul indicatif du loyer
   P : prix HT · n : durée en mois · p : premier loyer majoré (part du prix) */
function calcLoyer(P, n, p, taux=EDI.tauxIndicatif){
  const r = taux/12, k = n-1, L0 = P*p, B = P - L0, VR = EDI.vr;
  const m = (B - VR/Math.pow(1+r,k)) * r / (1 - Math.pow(1+r,-k));
  return {premier:L0, mensuel:m, n, vr:VR, total:L0 + m*k + VR};
}
const fmtDA = v => Math.round(v).toLocaleString("fr-FR").replace(/\u202f|\u00a0/g," ") + " DA";

/* Bandeau démo, pastille de version, toast, formulaires factices */
function wmChrome(opts){
  const d = document.createElement("div");
  d.className="wm-demo";
  d.innerHTML='Maquette de démonstration réalisée par <b>Webminds</b> · aucun formulaire n’est enregistré';
  document.body.appendChild(d);
  if(opts && opts.switchHref){
    const a=document.createElement("a");
    a.className="wm-switch"; a.href=opts.switchHref;
    a.innerHTML='<span class="dot"></span>'+opts.switchLabel;
    document.body.appendChild(a);
  }
  const t=document.createElement("div"); t.className="wm-toast"; t.setAttribute("role","status"); document.body.appendChild(t);
  window.wmToast = msg => {t.textContent=msg; t.classList.add("on"); clearTimeout(t._h); t._h=setTimeout(()=>t.classList.remove("on"),4200)};
  document.querySelectorAll("form[data-demo]").forEach(f=>f.addEventListener("submit",e=>{
    e.preventDefault();
    wmToast(f.dataset.demo || "Demande envoyée. Un chargé d’affaires vous rappelle sous 48 h (démonstration : rien n’est enregistré).");
    f.reset();
  }));
}

/* Logo : image du serveur EDI, sinon logotype texte */
function logoHTML(light){
  const img = light ? "" : `<img src="https://www.eldjazairidjar.dz/wp-content/uploads/2021/02/mi2logo-cwidjarv3.png" alt="El Djazair Idjar" onload="this.parentNode.classList.add('has-img')" onerror="this.remove()">`;
  return `<span class="logo${light?' logo--light':''}">
    ${img}
    <span class="logo-txt"><span class="logo-fr">El Djazair Idjar</span><span class="ar logo-ar">الجزائر إيجار</span></span>
  </span>`;
}
