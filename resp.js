burger = document.querySelector('.burger')
mainnav = document.querySelector('.main-nav')
searchbuttom = document.querySelector('.search-icon')
searchnav = document.querySelector('.search-nav')


burger.addEventListener('click', ()=>{
    mainnav.classList.toggle('h-nav-resp');
})

searchbuttom.addEventListener("click", ()=>{
    searchbuttom.classList.toggle('icon-click');
    searchnav.classList.toggle('search-click');
})

