var MovieApp = (function(){
    function init(){
        fetchMovieList();
        listenToSearchInput();
    }

    function listenToSearchInput(){
        var formEl = document.getElementsByTagName('form')[0];
        formEl.onsubmit = (e) => e.preventDefault(); 

        var searchEl = document.getElementsByClassName('title-search')[0];
        searchEl.addEventListener('keyup',function(e){
            var searchText = e.target.value;
            fetchMovieList(searchText)
        })
    }

    function fetchMovieList(search){
        search = search || 'live';
        Api.get('?s='+search)
        .then(data => data.Search)
        .then(renderMovieList)
    }

    function renderMovieList(movieList){
        if (!movieList)return;

        var movieListContainer = document.getElementsByClassName('list-wrapper')[0];
        var listEls = '';
        for (var c = 0; c < movieList.length ; c++){
            var currentMovie = movieList[c];
            fetchPoster(currentMovie.Poster,c);

            var movieItem = `
                <div style="background-image:url('https://m.media-amazon.com/images/G/01/imdb/images/nopicture/medium/film-3385785534._CB483791896_.png')" class='movie-item' >
                    <div class="content-wrapper" >
                        <div class="title" >${currentMovie.Title}</div>
                        <div class="year" >${currentMovie.Year}</div>
                    </div>
                </div>
            `
            
            listEls += movieItem
        }
        movieListContainer.innerHTML = listEls;
    }

    function fetchPoster(poster,index){
        var dummyPoster = "https://m.media-amazon.com/images/G/01/imdb/images/nopicture/medium/film-3385785534._CB483791896_.png";
        
        fetch(poster)
        .then(resp => {
            var posterToLoad = resp.status === 200 ? poster : dummyPoster
            var imgEl = document.getElementsByClassName('movie-item')[index];
            imgEl.style.backgroundImage = "url('"+posterToLoad+"')";
            imgEl.classList.add('noimage')
        })
    }

    return {
        init
    }

})();

MovieApp.init();


function setActiveTab(el){
    var tabEls = document.querySelectorAll('.navigation li');
    let type = el.attributes['data-type'].value;
    
    for (var c = 0; c < tabEls.length ; c++){
        var currentEl = tabEls[c];
        
        if (currentEl.attributes['data-type'].value === type){
            currentEl.setAttribute('class','active')
        }else{
            currentEl.setAttribute('class','')
        }
    }
}