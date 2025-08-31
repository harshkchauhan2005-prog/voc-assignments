const items = [
  {
    id: 'sf-1',
    title: 'Reel – Travel Snack Hacks',
    category: 'Short-form',
    thumb: 'https://images.unsplash.com/photo-1544531587-39fe9fcfbef2?q=80&w=1200&auto=format&fit=crop',
    url: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
    type: 'video'
  },
  {
    id: 'lf-1',
    title: 'Founder Talk – Scaling D2C in India',
    category: 'Long-form',
    thumb: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop',
    url: 'https://www.youtube.com/embed/5O0YDHiosD0',
    type: 'youtube'
  },
  {
    id:'gm-1',
    title:'Gaming Montage – Clutch Highlights',
    category:'Gaming',
    thumb:'https://images.unsplash.com/photo-1639771411254-1f00266565a1?q=80&w=1200&auto=format&fit=crop',
    url:'https://samplelib.com/lib/preview/mp4/sample-20s.mp4',
    type:'video'
  }
];


const CATEGORIES = ['All','Short-form','Long-form','Gaming'];


const grid = document.getElementById('grid');
const filters = document.getElementById('filters');
const q = document.getElementById('q');
const empty = document.getElementById('empty');

CATEGORIES.forEach((c,i)=>{
  const chip=document.createElement('button');
  chip.className='chip'+(i===0?' active':'');
  chip.textContent=c; chip.dataset.cat=c;
  chip.addEventListener('click',()=>{
    document.querySelectorAll('.chip').forEach(el=>el.classList.remove('active'));
    chip.classList.add('active');
    render();
  });
  filters.appendChild(chip);
});

function cardTemplate(item){
  return `
  <article class="card" data-id="${item.id}" data-title="${item.title.toLowerCase()}">
    <div class="thumb">
      <img src="${item.thumb}" alt="${item.title} thumbnail" loading="lazy"/>
      <span class="badge">${item.category}</span>
    </div>
    <div class="card-body">
      <div class="title">${item.title}</div>
    </div>
  </article>`;
}

function getActiveCategory(){
  return document.querySelector('.chip.active')?.dataset.cat || 'All';
}

function render(){
  const cat=getActiveCategory();
  const term=q.value.trim().toLowerCase();
  let list=[...items];
  if(cat!=='All') list=list.filter(i=>i.category===cat);
  if(term) list=list.filter(i=> i.title.toLowerCase().includes(term));

  grid.innerHTML=list.map(cardTemplate).join('');
  empty.classList.toggle('show', list.length===0);

  grid.querySelectorAll('.card').forEach(card=>{
    card.addEventListener('click',()=>openLightbox(card.dataset.id));
  });
}

q.addEventListener('input', ()=> render());


const lightbox=document.getElementById('lightbox');
const lbClose=document.getElementById('lbClose');
const lbTitle=document.getElementById('lbTitle');
const lbMedia=document.getElementById('lbMedia');

function openLightbox(id){
  const item=items.find(x=>x.id===id);
  if(!item) return;
  lbTitle.textContent=item.title;
  lbMedia.innerHTML = item.type==='youtube' 
    ? `<iframe src="${item.url}?autoplay=1&rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`
    : `<video src="${item.url}" controls autoplay></video>`;
  lightbox.classList.add('open');
  document.body.style.overflow='hidden';
}

function closeLightbox(){
  lightbox.classList.remove('open');
  lbMedia.innerHTML='';
  document.body.style.overflow='';
}

lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e)=>{ if(e.target===lightbox) closeLightbox(); });


  document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault(); // stops page refresh
    alert("✅ Thank you! Your message has been sent successfully.");
  });


render();
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const headerOffset = 95; // adjust to your sticky header height
      const elementPosition = target.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  });
});
