const apiKey = "c53ccb548a4a8ed07366e4029acbf455";
const apiEndpoint = "https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/original";
const movieTrailerkey = "AIzaSyAV74Shpyw_Aov7ux6po4GJ1Ti_Z8oLhS8";


const apipath = {
    fetchAllCategories: `${apiEndpoint}/genre/movie/list?api_key=${apiKey}`,
    fetchMoviesList:(id) => `${apiEndpoint}/discover/movie?api_key=${apiKey}&with_genres=${id}`,
    fetchTrending:`${apiEndpoint}/trending/all/day?api_key=${apiKey}&language=en-US`,
    fetchMovieTrailer: (query) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${movieTrailerkey}`
}


function init(){
    fetchTrendingMovies();
    fetchandBuildAllSections();
}

function fetchTrendingMovies(){
    fetchandBuildMovieSection(apipath.fetchTrending, "Trending movies")
    .then(list => {
        const randomindex = parseInt(Math.random() * list.length);
        buildBannersection(list[randomindex]);
    }).catch(err =>{
        console.error(err);
    });
}

function buildBannersection(movie){
    const Bannercont = document.getElementById('banner-section');
    Bannercont.style.backgroundImage = `url('${imgPath}${movie.backdrop_path}')`;
    const div = document.createElement('div');
    div.innerHTML = `
    <h2 class="banner_title">${movie.title}</h2>
    <p class="banner_overview">${movie.overview && movie.overview.length > 200 ? movie.overview.slice(0,200).trim()+ '...':movie.overview}</p>
    <div class="action-buttons-cont">
        <button class="action-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="ltr-4z3qvp e1svuwfo1" data-name="Play" aria-hidden="true"><path d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z" fill="currentColor"></path></svg> &nbsp;Play</button>
        <button class="action-button moreinfo"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="ltr-4z3qvp e1svuwfo1" data-name="CircleI" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z" fill="currentColor"></path></svg> &nbsp; More info</button>
    </div>
    `
    div.className = 'banner-cont container';
    Bannercont.append(div)
}

function fetchandBuildAllSections(){
    fetch(apipath.fetchAllCategories)
    .then(res => res.json())
    .then(res => {
        const categories = res.genres;
        if(Array.isArray(categories) && categories.length){
            categories.forEach(category => {
                fetchandBuildMovieSection(apipath.fetchMoviesList(category.id), category.name);
            })
        }
        console.table(categories)
    })
    .catch(err => console.error(err));
}

function fetchandBuildMovieSection(fetchurl, categoryName){
        // console.table(fetchurl, categoryName);
        return fetch(fetchurl)
        .then(res => res.json())
        .then(res => {
            // console.table(res.results);
            const movies = res.results;
            if(Array.isArray(movies) &&  movies.length) {
                buildMoviesSection(movies, categoryName);
            }
            return movies;
        })
        .catch(err => console.error(err))
}

function buildMoviesSection(list, categoryName){ 
    // console.log(list, categoryName)

    const moviesCont = document.getElementById("movies-cont")

    const movieslist = list.map(item => {
        return `
        <div class="movie-item" onclick="searchMoviesTrailer('${item.title}', 'yt${item.id}')">
        <img class="movie-item-img" src="${imgPath}${item.backdrop_path}" alt="${item.title}" loading="lazy" />
        <div class="iframe-wrap" id="yt${item.id}"></div>
        </div>
        `
    });

    const moviesSection = `
    <h2 class="movies-section-heading"  >${categoryName}<spam class="Explore-tag">Explore All</spam> </h2>
            <div class="movies-row" id="Movies">
                ${movieslist}    
            </div>
    `

    const div = document.createElement('div');
    div.className = "movies-cont"
    div.innerHTML = moviesSection;

    moviesCont.append(div);
}

function searchMoviesTrailer(movieName, iframid){
    if(!movieName) return;

    fetch(apipath.fetchMovieTrailer(movieName))
    .then(res => res.json())
    .then(res => {
        console.log(res);
        // return;
        const bestResult = res.items[0];
        if(!bestResult){
            return;
        }
        // console.log(bestResult)
        // const youtubeUrl = `https://www.youtube.com/watch?v=${bestResult.id.videoId}`;
        // console.log(youtubeUrl)
        // window.open(youtubeUrl, 'blank');

        const elements = document.getElementById(iframid);
        console.log(elements, iframid);
        
        const div = document.createElement('div');
        div.innerHTML = `<iframe width="245px" height="150px" src="https://www.youtube.com/embed/${bestResult.id.videoId}?autoplay=1&control=0&mute=1&showinfo=0"></iframe>`
        elements.append(div);
    })
    .catch(err => {
        console.log(err);
    })
}


window.addEventListener('load', function() {
    init();
    window.addEventListener('scroll', function(){
        const header = document.getElementById('header');
        if (window.scrollY > 5) header.classList.add('black-bg')
        else header.classList.remove('black-bg');
    })
})