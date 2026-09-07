(function () {
  'use strict';
  function init() {
    if(location.pathname!=='/' && location.pathname!=='/index.html')return;
    var village=document.querySelector('.village'),core=window.BlogFarm;
    if(!village || !core || document.getElementById('farm'))return;
    var farm=document.createElement('div');farm.id='farm';farm.className='farm';farm.setAttribute('aria-hidden','true');
    village.appendChild(farm);
    var header=village.closest('.header-inner'), actors=[],activeLayout='',raf=0,last=0,visible=true;
    var motion=matchMedia('(prefers-reduced-motion: reduce)');
    function element(tag,cls,parent){var e=document.createElement(tag);e.className=cls;parent.appendChild(e);return e;}
    function box(el,x,y,w,h){el.style.left=x+'px';el.style.top=y+'px';el.style.width=w+'px';el.style.height=h+'px';}
    function svg(parent,viewBox,cls){var e=document.createElementNS('http://www.w3.org/2000/svg','svg');e.setAttribute('viewBox',viewBox);e.setAttribute('class',cls);parent.appendChild(e);return e;}
    function addActor(kind,route,parent,unit,delay){
      var spec=core.sprites[kind],a=core.create(kind,route,delay,unit);
      a.size=spec.size*unit;a.el=element('span','farm__actor farm__actor--'+kind,parent);
      a.el.dataset.kind=kind;a.sprite=element('span','farm__sprite',a.el);
      a.el.style.width=a.el.style.height=a.size+'px';
      a.sprite.style.backgroundImage='url(/img/village/'+kind+'.png)';
      a.sprite.style.backgroundSize=(a.size*spec.cols)+'px '+(a.size*spec.rows)+'px';
      actors.push(a);draw(a);return a;
    }
    function draw(a){
      var p=core.pose(a),spec=core.sprites[a.kind];
      a.el.style.transform='translate('+Math.round(a.x-a.size/2)+'px,'+Math.round(a.y-a.size*spec.anchor)+'px)';
      a.el.style.zIndex=String(Math.round(a.y));
      a.sprite.style.transform=p.flip?'scaleX(-1)':'none';
      a.sprite.style.backgroundPosition=-(p.frame*a.size)+'px '+(-p.row*a.size)+'px';
      a.el.dataset.state=a.moving?'walking':'resting';
    }
    function build(scene){
      actors=[];farm.replaceChildren();
      Object.keys(scene.lots).forEach(function(key){
        var el=document.querySelector('.town-lot--'+key),p=scene.lots[key],dim=core.buildings[key];
        if(el)box(el,p[0]-dim[0]*scene.unit/2,p[1]-dim[1]*scene.unit,dim[0]*scene.unit,dim[1]*scene.unit);
      });
      var roads=svg(farm,'0 0 '+scene.width+' '+scene.height,'farm__map-paths');
      roads.setAttribute('shape-rendering','crispEdges');
      roads.innerHTML='<defs><pattern id="farm-soil" width="24" height="20" patternUnits="userSpaceOnUse"><rect width="24" height="20" fill="#b5a574"/><path d="M2 4h4v2H2zM15 13h3v2h-3z" fill="#c6b985"/><path d="M18 3h2v2h-2zM6 15h3v2H6z" fill="#a79868"/></pattern></defs>';
      scene.roads.forEach(function(points){var path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',points.map(function(p,i){return(i?'L':'M')+p.join(' ');}).join(' '));path.setAttribute('fill','none');path.setAttribute('stroke','url(#farm-soil)');path.setAttribute('stroke-width',18*scene.unit);path.setAttribute('stroke-linejoin','bevel');roads.appendChild(path);});
      var beds=element('div','farm__beds',farm);box.apply(null,[beds].concat(scene.beds));
      for(var i=0;i<6;i++){var bed=element('div','farm__bed',beds);for(var j=0;j<4;j++)element('span','farm__plant',bed);}
      var details=element('div','farm__details',farm);
      scene.trees.forEach(function(p,i){var small=i%3===0,w=(small?40:58)*scene.unit,h=(small?60:87)*scene.unit;box(element('span','farm__map-tree'+(small?' farm__map-tree--small':''),details),p[0]-w/2,p[1]-h,w,h);});
      scene.routes.rabbit.forEach(function(p){for(var n=0;n<3;n++){var tuft=element('span','farm__tuft',details);tuft.style.left=(p[0]-20+n*17)+'px';tuft.style.top=(p[1]+10+n%2*8)+'px';}});
      var pond=element('div','farm__pond',farm);box.apply(null,[pond].concat(scene.pond));
      element('div','farm__bank',pond);
      var water=element('div','farm__water',pond);
      element('i','farm__ripple farm__ripple--a',water);element('i','farm__ripple farm__ripple--b',water);
      element('i','farm__lily farm__lily--a',water);element('i','farm__lily farm__lily--b',water);
      var pw=scene.pond[2],ph=scene.pond[3],u=scene.unit;
      addActor('duck',[[pw*.25,ph*.37],[pw*.43,ph*.37]],pond,u,.8);
      addActor('duck',[[pw*.55,ph*.59],[pw*.7,ph*.59]],pond,u,3.5);
      box(element('div','farm__dock',pond),pw-58*u,ph*.67,58*u,28*u);
      var fisherman=element('span','farm__fisher',pond),size=core.sprites.player.size*u,fx=pw-18*u,fy=ph*.67+12*u;
      box(fisherman,fx-size/2,fy-size*.8125,size,size);
      fisherman.style.backgroundSize=(size*6)+'px '+(size*3)+'px';fisherman.style.backgroundPosition='0 '+(-size*2)+'px';
      var line=svg(pond,'0 0 '+pw+' '+ph,'farm__fishing-line'),tip=[fx-26*u,fy-44*u],float=[pw*.6,ph*.52];
      line.innerHTML='<path d="M'+(fx-3*u)+' '+(fy-15*u)+' L'+tip.join(' ')+'" stroke="#775237" stroke-width="'+1.4*u+'" fill="none"/><path d="M'+tip.join(' ')+' Q'+(float[0]+8*u)+' '+(tip[1]+4*u)+' '+float.join(' ')+'" stroke="#ebe3cb" stroke-width="'+.7*u+'" fill="none"/><path d="M'+float.join(' ')+' v'+3*u+'" stroke="#e98066" stroke-width="'+2.5*u+'"/><path d="M'+float[0]+' '+(float[1]+3*u)+' v'+2*u+'" stroke="#fff1dc" stroke-width="'+2.5*u+'"/>';
      element('i','farm__reeds',pond);
      Object.keys(scene.routes).forEach(function(kind,index){addActor(kind,scene.routes[kind],farm,u,1+index*.9);});
    }
    function measure(){
      var config=core.layout(document.documentElement.clientWidth),scene=config.scene;
      village.style.setProperty('--scene-width',scene.width+'px');village.style.setProperty('--scene-height',scene.height+'px');village.style.setProperty('--scene-scale',config.scale);
      header.style.setProperty('--scene-header',(310+scene.height*config.scale+35)+'px');
      if(config.key!==activeLayout){activeLayout=config.key;build(scene);}
      resume();
    }
    function allowed(){return visible && !document.hidden && !motion.matches && document.documentElement.dataset.motion!=='paused';}
    function resume(){cancelAnimationFrame(raf);raf=0;last=0;if(allowed())raf=requestAnimationFrame(tick);}
    function tick(now){raf=0;if(!allowed())return;var dt=last?Math.min((now-last)/1000,.05):0;last=now;actors.forEach(function(a){core.advance(a,dt);draw(a);});raf=requestAnimationFrame(tick);}
    measure();
    if('ResizeObserver' in window)new ResizeObserver(measure).observe(document.documentElement);
    else window.addEventListener('resize',measure);
    if('IntersectionObserver' in window)new IntersectionObserver(function(entries){visible=entries[0].isIntersecting;resume();}).observe(farm);
    document.addEventListener('visibilitychange',resume);document.addEventListener('blog:motion',resume);
    motion.addEventListener('change',resume);window.addEventListener('pageshow',resume);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
