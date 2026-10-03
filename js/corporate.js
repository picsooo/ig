(function(){
  const page = document.body.dataset.page || "";
  const liens = [["solutions.html","Nos solutions","solutions"],["index.html#leasing","Le leasing","leasing"],["reseau.html","Notre réseau","reseau"],["contact.html","Contact","contact"]];
  const nav = liens.map(([h,t,k])=>`<a href="${h}"${k===page?' aria-current="page"':''}>${t}</a>`).join("");

  document.body.insertAdjacentHTML("afterbegin",`
  <header class="top">
    <div class="wrap">
      <a href="index.html" aria-label="Accueil El Djazair Idjar">${logoHTML()}</a>
      <nav class="nav" aria-label="Navigation principale">${nav}<a class="btn btn--plein" href="contact.html#demande">Demander un financement</a></nav>
      <button class="burger" aria-label="Ouvrir le menu" aria-expanded="false"><span></span></button>
    </div>
    <div class="menu-mob">${nav}<a class="btn btn--plein" href="contact.html#demande">Demander un financement</a></div>
  </header>`);
  const b=document.querySelector(".burger"), m=document.querySelector(".menu-mob");
  b.addEventListener("click",()=>{const o=m.classList.toggle("ouvert");b.setAttribute("aria-expanded",o)});
  m.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{m.classList.remove("ouvert");b.setAttribute("aria-expanded",false)}));

  const sol = EDI.produits.map(p=>`<li><a href="produit.html?p=${p.id}">${p.nom}</a></li>`).join("");
  document.body.insertAdjacentHTML("beforeend",`
  <footer class="pied">
    <div class="wrap">
      <div class="cols">
        <div style="display:grid;gap:14px;align-content:start">
          ${logoHTML(true)}
          <p>Établissement financier spécialisé dans le crédit-bail, créé en 2012 pour accompagner les PME et les professionnels dans le financement de leurs investissements.</p>
        </div>
        <div><h4>Nos solutions</h4><ul>${sol}</ul></div>
        <div><h4>L’entreprise</h4><ul><li><a href="index.html#leasing">Le leasing</a></li><li><a href="reseau.html">Notre réseau</a></li><li><a href="index.html#actualites">Événements</a></li><li><a href="contact.html">Contact</a></li></ul></div>
        <div><h4>Direction commerciale</h4><ul><li>${EDI.adresse}</li><li><a href="tel:+21320107215">${EDI.tel_com}</a></li><li><a href="mailto:${EDI.mail}">${EDI.mail}</a></li><li><a href="https://www.facebook.com/LEASINGEDI/" target="_blank" rel="noopener">Facebook</a> · <a href="https://www.linkedin.com/in/el-djazair-idjar-leasing-98362116a/" target="_blank" rel="noopener">LinkedIn</a></li></ul></div>
      </div>
      <iframe class="carte-g" title="Siège d’El Djazair Idjar sur Google Maps" loading="lazy" src="https://maps.google.com/maps?q=Cit%C3%A9%20AADL%20la%20Concorde%2C%20Bir%20Mourad%20Ra%C3%AFs%2C%20Alger&z=15&output=embed"></iframe>
      <div class="bas"><span>© El Djazair Idjar Spa · Actionnaires : CPA, BADR, Asicom</span><span><a href="index.html">Français</a> · <span class="ar">العربية</span></span></div>
    </div>
  </footer>`);

  wmChrome({switchHref:"v2/index.html", switchLabel:"Découvrir la version moderne"});
})();

/* Simulateur réutilisable */
function montageSimulateur(el, defId){
  let cur = EDI.produits.find(p=>p.id===defId) || EDI.produits[0];
  el.innerHTML = `
    <h3>Simulez votre loyer</h3>
    <div class="sim-biens" role="group" aria-label="Type de bien">
      ${EDI.produits.map(p=>`<button type="button" data-id="${p.id}" aria-pressed="${p.id===cur.id}">${icon(p.id)}${p.court}</button>`).join("")}
    </div>
    <div class="champ"><label for="s-prix">Prix du bien (HT)</label>
      <div class="prix-box"><input id="s-prix" class="num" inputmode="numeric" autocomplete="off"><span>DA</span></div></div>
    <div class="champ"><label for="s-duree">Durée <output id="o-duree"></output></label><input id="s-duree" type="range" min="36" max="60" step="12"></div>
    <div class="champ"><label for="s-premier">Premier loyer majoré <output id="o-premier"></output></label><input id="s-premier" type="range" min="10" max="30" step="5" value="20"></div>
    <div class="sim-res" aria-live="polite">
      <div class="mensuel"><span>Loyer mensuel</span><strong class="num" id="r-mens"></strong></div>
      <div class="barres" id="r-barres" aria-hidden="true"></div>
      <div class="barres-leg"><span>Mois 1</span><span>Montant cumulé payé</span><span id="r-fin"></span></div>
      <dl class="num"><dt>Premier loyer</dt><dd id="r-prem"></dd><dt>Valeur résiduelle</dt><dd>1 000 DA</dd><dt>Coût total indicatif</dt><dd id="r-tot"></dd></dl>
    </div>
    <span class="avalider">Taux indicatif à valider par l’administration d’El Djazair Idjar</span>
    <a class="btn btn--plein" href="contact.html#demande" id="s-go">Déposer ma demande</a>`;
  const $=s=>el.querySelector(s), prix=$("#s-prix"), du=$("#s-duree"), pr=$("#s-premier");
  du.value=60;
  const lire=()=>parseInt(prix.value.replace(/\D/g,""))||0;
  function setPrix(v){prix.value=v.toLocaleString("fr-FR").replace(/\u202f|\u00a0/g," ")}
  function maj(){
    const P=Math.max(lire(),100000), n=+du.value, p=+pr.value/100, r=calcLoyer(P,n,p);
    $("#o-duree").textContent=`${n} mois (${n/12} ans)`; $("#o-premier").textContent=`${pr.value} %`;
    $("#r-mens").textContent=fmtDA(r.mensuel); $("#r-prem").textContent=fmtDA(r.premier); $("#r-tot").textContent=fmtDA(r.total);
    const bars=[`<i class="p" style="height:${r.premier/r.total*100}%"></i>`];
    for(let i=1;i<n;i++) bars.push(`<i style="height:${(r.premier+r.mensuel*i)/r.total*100}%"></i>`);
    bars.push(`<i class="vr" style="height:100%"></i>`);
    $("#r-barres").innerHTML=bars.join(""); $("#r-fin").textContent=`Mois ${n} + option`;
    $("#s-go").href=`contact.html?bien=${cur.id}&prix=${P}#demande`;
  }
  el.querySelectorAll(".sim-biens button").forEach(b=>b.addEventListener("click",()=>{
    cur=EDI.produits.find(p=>p.id===b.dataset.id);
    el.querySelectorAll(".sim-biens button").forEach(x=>x.setAttribute("aria-pressed",x===b));
    setPrix(cur.prix); maj();
  }));
  prix.addEventListener("input",()=>{const v=lire(); if(v) setPrix(v); maj()});
  du.addEventListener("input",maj); pr.addEventListener("input",maj);
  setPrix(cur.prix); maj();
}

/* Carte schématique : points placés selon leurs coordonnées réelles */
function carteReseau(el){
  const x = lon => (lon + 1.6) / 9.6 * 100, y = lat => (37.3 - lat) / 2.8 * 100;
  el.insertAdjacentHTML("beforeend", EDI.reseau.map(r=>
    `<div class="pt${r.siege?' siege':''}" style="left:${x(r.lon)}%;top:${y(r.lat)}%"><i></i>${r.v}</div>`).join("")
    + `<div class="pt sud" style="left:${x(3.6)}%;top:88%"><i></i>Sud · à venir</div>`);
}
