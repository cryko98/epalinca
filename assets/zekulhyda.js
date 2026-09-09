/* ZEKULHYDA — zekulhyda.js v4
   Forrás: uploadolt HTML JS logika alapján */

(function(){

// ── AGE GATE ──
var ageGate = document.getElementById('AgeGate');
if(ageGate) {
  try {
    if(sessionStorage.getItem('zk_age_ok')) {
      ageGate.style.display = 'none';
      document.body.style.overflow = '';
    }
  } catch(e){}
  document.body.style.overflow = 'hidden';
  var ageYes = document.getElementById('AgeYes');
  var ageNo  = document.getElementById('AgeNo');
  if(ageYes) {
    ageYes.addEventListener('click', function(){
      try { sessionStorage.setItem('zk_age_ok','1'); } catch(e){}
      ageGate.style.transition = 'opacity 0.4s ease';
      ageGate.style.opacity = '0';
      setTimeout(function(){ ageGate.style.display='none'; document.body.style.overflow=''; }, 400);
    });
  }
  if(ageNo) {
    ageNo.addEventListener('click', function(){
      window.location.href = 'https://www.google.com';
    });
  }
}

// ── MOBILE NAV ──
var burger = document.getElementById('BurgerBtn');
var mobileNav = document.getElementById('MobileNav');
var mobileClose = document.getElementById('MobileClose');
if(burger && mobileNav) {
  burger.addEventListener('click', function(){
    mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
}
if(mobileClose && mobileNav) {
  mobileClose.addEventListener('click', function(){
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  });
}

// ── REVEAL ON SCROLL ──
var io = ('IntersectionObserver' in window)
  ? new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold:.12, rootMargin:'0px 0px -6% 0px' })
  : null;

function observe(){
  document.querySelectorAll('.reveal:not(.in)').forEach(function(el){
    if(io) io.observe(el); else el.classList.add('in');
  });
}
observe();

// ── HEADER SCROLL SHADOW ──
var header = document.querySelector('header.top');
window.addEventListener('scroll', function(){
  if(header) header.classList.toggle('scrolled', window.scrollY > 60);
}, {passive:true});

// ── CART ──
var cart = {};
var cartCount = document.getElementById('CartCount');
var drawer = document.getElementById('Drawer');
var overlay = document.getElementById('Overlay');
var drawerItems = document.getElementById('DrawerItems');
var drawerSum = document.getElementById('DrawerSum');

function openCart(){
  if(drawer) drawer.classList.add('open');
  if(overlay) overlay.classList.add('open');
}
function closeCart(){
  if(drawer) drawer.classList.remove('open');
  if(overlay) overlay.classList.remove('open');
}

var cartBtn = document.getElementById('CartBtn');
var closeBtn = document.getElementById('CloseCart');
if(cartBtn) cartBtn.addEventListener('click', openCart);
if(closeBtn) closeBtn.addEventListener('click', closeCart);
if(overlay) overlay.addEventListener('click', closeCart);

function renderCart(){
  var ids = Object.keys(cart);
  var n = 0, sub = 0;
  if(cartCount) { ids.forEach(function(id){ n += cart[id]; }); cartCount.textContent = n; }
  if(!drawerItems) return;
  if(!ids.length){
    drawerItems.innerHTML = '<p class="cart-empty">Coșul este gol.</p>';
    if(drawerSum) drawerSum.innerHTML = '';
    return;
  }
  drawerItems.innerHTML = ids.map(function(id){
    var p = window._zkProducts ? window._zkProducts[id] : null;
    if(!p) return '';
    sub += cart[id] * p.price;
    return '<div class="cart-line"><div style="width:44px;height:44px;background:#E9E3D6;display:grid;place-items:center;font-size:.7rem;color:#5E5A52;">'+id+'</div><div><b>'+p.name+'</b><br><span style="color:var(--muted-on-paper)">'+p.price+' lei</span></div><div class="q"><button data-dec="'+id+'">−</button><span>'+cart[id]+'</span><button data-inc="'+id+'">+</button><button class="rm" data-rm="'+id+'">Șterge</button></div></div>';
  }).join('');
  var ship = sub >= 250 ? 0 : (sub > 0 ? 22 : 0);
  if(drawerSum) drawerSum.innerHTML = '<div><span>Subtotal</span><span>'+sub+' lei</span></div><div><span>Livrare</span><span>'+(ship===0?'gratuită':ship+' lei')+'</span></div><div class="tot"><span>Total</span><span>'+(sub+ship)+' lei</span></div><button class="btn primary" style="width:100%;justify-content:center;margin-top:.6rem;" onclick="window.location.href=\'/cart\'">Continuă la comandă</button>';

  drawerItems.querySelectorAll('[data-inc]').forEach(function(b){ b.addEventListener('click', function(){ cart[b.dataset.inc]=(cart[b.dataset.inc]||0)+1; renderCart(); }); });
  drawerItems.querySelectorAll('[data-dec]').forEach(function(b){ b.addEventListener('click', function(){ if(cart[b.dataset.dec]>1){ cart[b.dataset.dec]--; } else { delete cart[b.dataset.dec]; } renderCart(); }); });
  drawerItems.querySelectorAll('[data-rm]').forEach(function(b){ b.addEventListener('click', function(){ delete cart[b.dataset.rm]; renderCart(); }); });
}

window.zkAddToCart = function(id, name, price){
  if(!window._zkProducts) window._zkProducts = {};
  window._zkProducts[id] = { name: name, price: price };
  cart[id] = (cart[id]||0) + 1;
  renderCart();
  openCart();
};

renderCart();

// ── DISTILAT FLAVOR BUTTONS → scroll to shop ──
var flavorsEl = document.getElementById('ds-flavors');
if(flavorsEl){
  flavorsEl.querySelectorAll('button').forEach(function(b){
    b.addEventListener('click', function(){
      var shopEl = document.getElementById('shop');
      if(shopEl) shopEl.scrollIntoView({behavior:'smooth'});
    });
  });
}

// ── BOOKING FORM ──
var bkForm = document.getElementById('BookingForm');
if(bkForm){
  bkForm.addEventListener('submit', function(e){
    e.preventDefault();
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = 'Mulțumim! Confirmăm în 24 de ore.';
    document.body.appendChild(toast);
    setTimeout(function(){ toast.remove(); }, 3200);
    bkForm.reset();
  });
}

// ── NEWSLETTER ──
var nlForm = document.getElementById('NewsletterForm');
if(nlForm){
  nlForm.addEventListener('submit', function(e){
    e.preventDefault();
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = 'Mulțumim! Te-ai înscris.';
    document.body.appendChild(toast);
    setTimeout(function(){ toast.remove(); }, 3200);
  });
}

})();
