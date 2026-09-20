/* CyberLab UI Motion Engine — Ethan GALEA */
(function(){
  const ready=()=>document.body&&document.body.classList.add('cyber-page-ready');
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
  const prefersReduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const revealSelector='.panel,.project,.card,.post,.rail-card,.math-card,.earnedCard,.q,.notice,.kpi,.spec,.badge,.mission,.hero,.hero-card';
  document.querySelectorAll(revealSelector).forEach((el,i)=>{
    if(el.closest('.hidden'))return;
    el.classList.add('cyber-reveal','cyber-glow-hover');
    if(i<6)el.classList.add('cyber-stagger-'+Math.min(6,(i%6)+1));
  });
  if(!prefersReduced && 'IntersectionObserver' in window){
    const io=new IntersectionObserver((entries)=>{
      entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('cyber-visible');io.unobserve(e.target)}})
    },{threshold:.08,rootMargin:'0px 0px -30px'});
    document.querySelectorAll('.cyber-reveal').forEach(el=>io.observe(el));
  }else document.querySelectorAll('.cyber-reveal').forEach(el=>el.classList.add('cyber-visible'));
  document.querySelectorAll('button,.btn,.top-action,.feedBtn,.side-btn').forEach(el=>{
    el.addEventListener('click',function(ev){
      if(prefersReduced||el.disabled)return;
      const r=el.getBoundingClientRect(),size=Math.max(r.width,r.height)*.32;
      const s=document.createElement('span');s.className='cyber-ripple';s.style.width=s.style.height=size+'px';
      s.style.left=(ev.clientX-r.left-size/2)+'px';s.style.top=(ev.clientY-r.top-size/2)+'px';el.appendChild(s);
      setTimeout(()=>s.remove(),600);
    });
  });
  document.querySelectorAll('img[src*="logo.png"],.brand-logo,.hero-logo').forEach(img=>img.classList.add('cyber-logo-float'));
  if(!prefersReduced&&window.matchMedia?.('(pointer:fine)').matches){
    window.addEventListener('pointermove',e=>{
      document.body.classList.add('cyber-pointer');
      document.documentElement.style.setProperty('--mx',e.clientX+'px');
      document.documentElement.style.setProperty('--my',e.clientY+'px');
    },{passive:true});
    document.querySelectorAll('.project,.card,.panel,.post,.rail-card,.math-card,.earnedCard,.q,.kpi,.spec,.badge,.mission').forEach(el=>{
      let raf=0;
      el.addEventListener('pointermove',e=>{
        const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
        if(raf)cancelAnimationFrame(raf);
        raf=requestAnimationFrame(()=>{el.style.setProperty('--cyber-x',x.toFixed(2));el.style.setProperty('--cyber-y',y.toFixed(2))});
      });
      el.addEventListener('pointerleave',()=>{el.style.removeProperty('--cyber-x');el.style.removeProperty('--cyber-y')});
    });
  }
})();
