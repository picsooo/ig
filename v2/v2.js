(function(){
  const $=id=>document.getElementById(id);
  let cur=EDI.produits[0], res=null;
  const prix=$("prix"), du=$("duree"), pr=$("premier"), mois=$("mois");
  const lire=()=>parseInt(prix.value.replace(/\D/g,""))||0;
  const setPrix=v=>prix.value=v.toLocaleString("fr-FR").replace(/\u202f|\u00a0/g," ");

  /* Choix du bien */
  $("biens").innerHTML=EDI.produits.map((p,i)=>`<button type="button" data-id="${p.id}" aria-pressed="${i===0}"><i style="background-image:url(${photo(p,120)});background-position:${p.pos}"></i>${p.court}</button>`).join("");
  $("fonds").innerHTML=EDI.produits.map(p=>`<div data-id="${p.id}" style="background-image:url(${photo(p,2200)});background-position:${p.pos}"></div>`).join("");
  function dessiner(){
    $("fonds").querySelectorAll("div").forEach(d=>d.classList.toggle("on",d.dataset.id===cur.id));
    $("ex").innerHTML=`<i></i>${cur.nom} · ${cur.ex}`;
    $("vitrine").style.backgroundImage=`url(${photo(cur,1800)})`; $("vitrine").style.backgroundPosition=cur.pos;
  }
  $("biens").addEventListener("click",e=>{
    const b=e.target.closest("button"); if(!b) return;
    cur=EDI.produits.find(p=>p.id===b.dataset.id);
    $("biens").querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b));
    setPrix(cur.prix); dessiner(); calc();
  });

  /* Calcul + frise */
  function calc(){
    const P=Math.max(lire(),100000), n=+du.value, p=+pr.value/100;
    res=calcLoyer(P,n,p);
    $("o-duree").textContent=`${n} mois`; $("o-premier").textContent=`${pr.value} %`;
    $("mens").textContent=fmtDA(res.mensuel);
    $("b-prem").textContent=fmtDA(res.premier); $("b-tot").textContent=fmtDA(res.total);
    const fr=$("frise"), cu=$("curseur"); fr.innerHTML=""; fr.appendChild(cu);
    for(let i=1;i<=n;i++){
      const paid=i===1?res.premier:res.premier+res.mensuel*(i-1);
      const bar=document.createElement("i"); bar.style.height=(paid/res.total*100)+"%"; fr.appendChild(bar);
    }
    const v=document.createElement("i"); v.className="vr"; v.style.height="100%"; fr.appendChild(v);
    $("f-prix").value=prix.value; $("f-bien").value=cur.id;
    mois.max=n+1; if(+mois.value>n+1) mois.value=n+1;
    position();
  }
  function position(){
    const n=+du.value, m=+mois.value, bars=$("frise").querySelectorAll("i");
    bars.forEach((b,i)=>b.classList.toggle("paye",i<m && !b.classList.contains("vr")));
    const fin=m>n;
    const paye=fin?res.total:res.premier+res.mensuel*(m-1);
    $("b-paye").textContent=fmtDA(paye); $("b-reste").textContent=fmtDA(res.total-paye);
    const fr=$("frise").getBoundingClientRect(), b=bars[m-1].getBoundingClientRect();
    $("curseur").style.left=(b.left-fr.left+b.width/2)+"px";
    $("msg").textContent = fin ? `Levée d’option : ${cur.ex.toLowerCase()} devient le vôtre pour 1 000 DA.`
      : m===1 ? `Mois 1 : vous versez le premier loyer majoré, le bien est livré et vous l’utilisez déjà.`
      : `Mois ${m} sur ${n} : vous utilisez le bien, il reste ${n-m+1} loyer${n-m+1>1?"s":""} avant la levée d’option.`;
    const prog=fin?1:(m-1)/n;
    $("vitrine").style.filter=`grayscale(${1-prog}) brightness(${.6+.4*prog})`;
    $("vitrine").classList.toggle("possede",fin);
    $("etat").textContent=fin?"Vous êtes propriétaire":"Propriété d’El Djazair Idjar, à votre disposition";
    $("cle").textContent=fin?"Levée d’option : 1 000 DA":`${Math.round(prog*100)} % du contrat`;
  }
  function depuisPointeur(x){
    const bars=$("frise").querySelectorAll("i"), fr=$("frise").getBoundingClientRect();
    const k=Math.min(bars.length,Math.max(1,Math.ceil((x-fr.left)/fr.width*bars.length)));
    mois.value=k; position();
  }
  let glisse=false;
  $("frise").addEventListener("pointerdown",e=>{glisse=true;depuisPointeur(e.clientX)});
  window.addEventListener("pointermove",e=>{if(glisse)depuisPointeur(e.clientX)});
  window.addEventListener("pointerup",()=>glisse=false);
  mois.addEventListener("input",position);
  prix.addEventListener("input",()=>{const v=lire(); if(v) setPrix(v); calc()});
  du.addEventListener("input",calc); pr.addEventListener("input",calc);
  window.addEventListener("resize",()=>res&&position());

  /* Parcours */
  const etapes=[
    ["Vous choisissez le bien","Équipement, véhicule, engin ou local, auprès du fournisseur de votre choix."],
    ["Vous déposez votre demande","En ligne, en agence CPA ou BADR, ou dans une représentation régionale."],
    ["Nous étudions le dossier","Un délai court de traitement, avec un chargé d’affaires qui vous suit."],
    ["Nous achetons le bien","El Djazair Idjar règle le fournisseur, le bien vous est livré."],
    ["Vous payez des loyers mensuels","Sur 3 à 5 ans, premier loyer majoré de 10 % à 30 %."],
    ["Le bien devient le vôtre","Levée d’option pour une valeur résiduelle de 1 000 DA."]
  ];
  let step=0;
  $("etp").innerHTML=etapes.map((e,i)=>`<li><span class="rond">${i+1}</span><div><h3>${e[0]}</h3><p>${e[1]}</p></div></li>`).join("");
  function majEtapes(){
    $("etp").querySelectorAll("li").forEach((li,i)=>{li.classList.toggle("fait",i<step);li.classList.toggle("encours",i===step)});
    $("suiv").textContent = step>=etapes.length ? "Dossier terminé" : "Étape suivante";
    $("suiv").disabled = step>=etapes.length;
  }
  $("suiv").addEventListener("click",()=>{step++;majEtapes()});
  $("raz").addEventListener("click",()=>{step=0;majEtapes()});
  majEtapes();

  /* Listes, carte, formulaire */
  const li=a=>a.map(x=>`<li>${x}</li>`).join("");
  $("l-av").innerHTML=li(EDI.avantages); $("l-el").innerHTML=li(EDI.eligibilite); $("l-co").innerHTML=li(EDI.conditions);
  const X=lon=>(lon+1.6)/9.6*100, Y=lat=>(37.3-lat)/2.8*100;
  $("pts").innerHTML=EDI.reseau.map(r=>`<div class="pt${r.siege?' s':''}" style="left:${X(r.lon)}%;top:${Y(r.lat)}%"><i></i>${r.v}</div>`).join("")
    +`<div class="pt sud" style="left:${X(3.6)}%;top:88%"><i></i>Sud · à venir</div>`;
  $("f-bien").innerHTML=EDI.produits.map(p=>`<option value="${p.id}">${p.nom}</option>`).join("");

  setPrix(cur.prix); dessiner(); calc();
  wmChrome({switchHref:"../index.html", switchLabel:"Découvrir la version corporate"});
})();
