const $=s=>document.querySelector(s),pg=document.body.dataset.p,j=u=>fetch(u).then(r=>r.json()).catch(()=>({}));
const u=s=>s?s.replace(/^\/+/,''):'',set=(i,h)=>{const e=$(i);if(e)e.innerHTML=h},sg=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,'-'),num=s=>+String(s||'').replace(/\D/g,'');
const im=(s,c='')=>s?`<img class="${c}" src="${u(s)}" alt="" loading="lazy">`:`<div class="ph ${c}">Photo</div>`;
const nav=s=>s.length>1?'<button class="pv" aria-label="Previous">&lsaquo;</button><button class="nx" aria-label="Next">&rsaquo;</button>':'';
const dots=s=>`<div class="dt">${s.map(()=>'<i></i>').join('')}</div>`;
const sl=(el,auto)=>{if(!el)return;const s=[...el.querySelectorAll('.sl')];let i=0;const g=n=>{i=(n+s.length)%s.length;s.forEach((x,k)=>x.classList.toggle('on',k===i));el.querySelectorAll('.dt i').forEach((d,k)=>d.classList.toggle('on',k===i))};const p=el.querySelector('.pv'),n=el.querySelector('.nx');if(p)p.onclick=()=>g(i-1);if(n)n.onclick=()=>g(i+1);g(0);if(auto&&s.length>1)setInterval(()=>g(i+1),5500)};
(async()=>{
const [s,h,pgs,ag,pr,b]=await Promise.all(['settings','home','pages','agents','properties','builder'].map(n=>j(`data/${n}.json`)));
const P=pr.items||[],A=ag.items||[],c=s.currency||'',rs=document.documentElement.style;
[['bg','--bg'],['ink','--ink'],['accent','--ac']].forEach(([k,v])=>s[k]&&rs.setProperty(v,s[k]));
const lg=s.logo_image?`<img class="lgi" src="${u(s.logo_image)}" alt="${s.logo_text||''}">`:(s.logo_text||s.name||'');
const L=[['index.html','Home','home'],['properties.html','Properties','prop'],['agents.html','Agents','ag'],['about.html','About','ab'],['contact.html','Contact','con']];
$('#h').innerHTML=`<div class="w bar"><a class="logo" href="index.html">${lg}</a><button class="mb" onclick="document.querySelector('nav').classList.toggle('open')">Menu</button><nav>${L.map(l=>`<a href="${l[0]}"${pg===l[2]||(pg==='det'&&l[2]==='prop')?' class="on"':''}>${l[1]}</a>`).join('')}</nav></div>`;
$('#f').innerHTML=`<div class="w"><div class="fg"><div><div class="logo">${lg}</div><p style="margin-top:12px;max-width:22em">${s.tagline||''}</p></div><div><h4>Visit</h4><p>${s.address||''}<br>${s.city||''}</p><p style="margin-top:8px">${s.hours||''}</p></div><div><h4>Contact</h4><p><a href="tel:${s.phone}">${s.phone||''}</a><br><a href="mailto:${s.email}">${s.email||''}</a></p></div></div><div class="cr">&copy; ${new Date().getFullYear()} ${s.name||''}. <a href="built-by.html">Designed by Allan Aminu</a></div></div>`;
const tag=x=>x.status&&x.status!=='Available'?x.status:x.mode==='Rent'?'For rent':'For sale';
const meta=x=>[x.beds&&x.beds+' beds',x.baths&&x.baths+' baths',x.size].filter(Boolean).join(' \u00b7 ');
const pc=x=>`<a class="cd" href="property.html?p=${sg(x.title)}"><div class="ci">${im((x.gallery||[])[0])}<span class="tg">${tag(x)}</span></div><p class="pr">${c}${x.price||''} <small>${x.price_note||''}</small></p><h3>${x.title}</h3><p class="mu">${x.location||''}</p><p class="mt">${meta(x)}</p></a>`;
const T={prop:[pgs.props_title,pgs.props_text],ag:[pgs.agents_title,pgs.agents_text],ab:[pgs.about_title,pgs.about_text],con:[pgs.contact_title,pgs.contact_text]};
if(T[pg]){set('#t1',T[pg][0]||'');set('#t2',T[pg][1]||'')}
if(pg==='home'){const S=h.slides||[];
set('#hero',S.map(x=>`<div class="sl ${x.image?'hi':''}">${x.image?im(x.image):''}<div class="tx"><div class="h1">${x.title||''}</div><p>${x.text||''}</p><a class="bt" href="${x.link||'properties.html'}">${x.button||'View properties'}</a></div></div>`).join('')+nav(S)+dots(S));sl($('#hero'),1);
set('#intro',`<h2>${h.intro_title||''}</h2><p>${h.intro_text||''}</p>`);
set('#ft',h.featured_title||'');set('#feat',P.filter(x=>x.featured).slice(0,6).map(pc).join(''));
set('#tt',h.tm_title||'');set('#tm',(h.testimonials||[]).map(x=>`<blockquote><p>${x.quote}</p><cite>${x.name}</cite></blockquote>`).join(''));
set('#cta',`<h2>${h.cta_title||''}</h2><p>${h.cta_text||''}</p><a class="bt" href="contact.html">${h.cta_button||'Contact us'}</a>`)}
if(pg==='prop'){const F=$('#fl'),o=(k,l)=>[...new Set(P.map(x=>x[k]).filter(Boolean))].map(t=>`<option>${t}</option>`).join('');
F.innerHTML=`<select name="m"><option value="">Buy or rent</option><option>Buy</option><option>Rent</option></select><select name="t"><option value="">All types</option>${o('type')}</select><select name="l"><option value="">All locations</option>${o('location')}</select><input name="x" type="number" placeholder="Max price">`;
const r=()=>{const f=F.elements,mx=+f.x.value;set('#pl',P.filter(p=>(!f.m.value||p.mode===f.m.value)&&(!f.t.value||p.type===f.t.value)&&(!f.l.value||p.location===f.l.value)&&(!mx||num(p.price)<=mx)).map(pc).join('')||'<p class="mu">No properties match.</p>')};F.oninput=r;F.onsubmit=e=>e.preventDefault();r()}
if(pg==='det'){const p=P.find(x=>sg(x.title)===new URLSearchParams(location.search).get('p'))||P[0];if(p){const g=p.gallery||[],en=`Enquiry about ${p.title} (${c}${p.price})`;
set('#g',(g.length?g:['']).map(x=>`<div class="sl">${im(x)}</div>`).join('')+nav(g)+dots(g));sl($('#g'));
set('#pi',`<p class="tg2">${tag(p)}</p><h1 style="font-size:2.4rem">${p.title}</h1><p class="mu">${p.location||''}</p><p class="pr big">${c}${p.price||''} <small>${p.price_note||''}</small></p><p class="mt">${meta(p)}</p><p class="ds">${p.description||''}</p>${(p.features||[]).length?`<ul class="ft">${p.features.map(x=>`<li>${x}</li>`).join('')}</ul>`:''}<div class="row"><a class="bt" href="https://wa.me/${s.whatsapp}?text=${encodeURIComponent(en)}">WhatsApp enquiry</a><a class="bt o" href="mailto:${s.email}?subject=${encodeURIComponent(en)}">Email</a><a class="bt o" href="tel:${s.phone}">Call</a></div>`);document.title=p.title+' | '+(s.name||'')}}
if(pg==='ag')set('#ag',A.map(x=>`<div>${im(x.photo)}<h3>${x.name}</h3><p class="mu">${x.role||''}</p><p>${x.bio||''}</p>${x.phone?`<a class="lk" href="tel:${x.phone}">${x.phone}</a>`:''}</div>`).join(''));
if(pg==='ab')set('#ab',`<div>${im(pgs.about_image)}</div><div>${(pgs.values||[]).map(x=>`<div class="val"><h3>${x.title}</h3><p>${x.text||''}</p></div>`).join('')}</div>`);
if(pg==='con'){const f=$('#fm'),pp=P.find(x=>sg(x.title)===new URLSearchParams(location.search).get('p'));if(pp)f.msg.value='Enquiry about: '+pp.title;
const t=()=>['Enquiry','Name: '+f.nm.value,'Phone: '+f.ph.value,f.msg.value].join('\n');
f.onsubmit=e=>{e.preventDefault();location.href=`mailto:${s.email}?subject=${encodeURIComponent('Property enquiry')}&body=${encodeURIComponent(t())}`};
$('#wa').onclick=()=>open(`https://wa.me/${s.whatsapp}?text=${encodeURIComponent(t())}`);
set('#ci',`<p><b>Phone</b><a href="tel:${s.phone}">${s.phone||''}</a></p><p><b>Email</b>${s.email||''}</p><p><b>Office</b>${s.address||''}, ${s.city||''}</p><p><b>Hours</b>${s.hours||''}</p>`)}
if(pg==='by'){set('#bh',b.headline||'');set('#ba',b.about||'');set('#bs',(b.services||[]).map(x=>`<div class="val"><h3>${x.title}</h3><p>${x.description||''}</p></div>`).join(''));set('#bc',`<a class="bt" href="mailto:${b.email}">Email Allan</a><a class="bt o" href="tel:${b.phone}">Call ${b.phone}</a><a class="bt o" href="https://wa.me/${b.whatsapp}">WhatsApp</a>`)}
})();
