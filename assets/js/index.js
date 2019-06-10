var MovieApp = (function(){
    var movieData;
    var myMovieData = localStorage.getItem('myMovieData') ? JSON.parse(localStorage.getItem('myMovieData')) : [];
    var myMovieDataIds = myMovieData.map(m => m.imdbID);
    
    function init(){
        fetchMovieList();
        listenToSearchInput();
        listenToSortInput();
        listenToTabClick();
        
    }

    function listenToAdd(){
        var movieItems = document.querySelectorAll('.movie-item');
        const L = movieItems.length;
        for (var c = 0; c < L ; c++){
            var currAddEl = movieItems[c].getElementsByTagName('button')[0] ;
            currAddEl.addEventListener('click',addToMyMovies);
        }
    }
    
    function addToMyMovies(e){
        var id = e.target.attributes['data-movie-id'].value;
        var movie = movieData.filter(m => m.imdbID === id)[0];
        myMovieData.push(movie);
        localStorage.setItem('myMovieData',JSON.stringify(myMovieData));
        e.target.innerHTML = 'Added'
        e.target.setAttribute('disabled',true)
    }

    function listenToSortInput(){
        var sortEls = document.getElementsByClassName('sort-handler');
        const L = sortEls.length;
        for (var c = 0; c < L ; c++){
            var currSortEl = sortEls[c];
            currSortEl.addEventListener('click',setActiveSort);
        }
    }

    function setActiveSort(e){
        var el = e.target;
        var classes = el.classList;
        var sortType = el.attributes['data-type'].value;
        
        var sortFunction = sortType === 'title' ? sortByTitle : sortByYear;

        if (classes.contains('active')){
            el.classList.remove('active');
            movieData = movieData.reverse()
        }else{
            el.classList.add('active');
            movieData = movieData.sort((a,b) => sortFunction(a,b,"ascending"))
        }

        renderMovieList(movieData)
    }

    function sortByYear(a,b,order){
        if (order === 'ascending'){
            if (b.Year > a.Year)return -1;
            else if (a.Year < b.Year)return 1;
            else return 0
        }else{
            if (b.Year > a.Year)return 1;
            else if (a.Year < b.Year)return -1;
            else return 0
        }
    }

    function sortByTitle(a,b,order){
        
        var btitle = b.Title.toLowerCase();
        var atitle = a.Title.toLowerCase();
        
        if (order === 'ascending'){
            if (btitle > atitle)return -1;
            else if (atitle < btitle)return 1;
            else return 0
        }else{
            if (btitle > atitle)return 1;
            else if (atitle < btitle)return -1;
            else return 0
        }
    }

    function listenToTabClick(){
        var tabEls = document.querySelectorAll('.navigation li');
        const L = tabEls.length;
        for (var c = 0; c < L ; c++){
            var currTabEl = tabEls[c];
            currTabEl.addEventListener('click',setActiveTab);
        }
    }

    function setActiveTab(e){
        var el = e.target;
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

        if (type === 'personal'){
            renderMovieList(myMovieData)
        }else{
            renderMovieList(movieData)
        }
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
        movieData = movieList;  // Store the list globally


        

        var movieListContainer = document.getElementsByClassName('list-wrapper')[0];
        var listEls = '';
        for (var c = 0; c < movieList.length ; c++){
            var currentMovie = movieList[c];
            fetchPoster(currentMovie.Poster,c);

            const movieExist = myMovieDataIds.indexOf(currentMovie.imdbID) >= 0;
            var movieItem = `
                <div class='movie-item' >
                    <img src='https://m.media-amazon.com/images/G/01/imdb/images/nopicture/medium/film-3385785534._CB483791896_.png' />
                    <div class="cta-wrapper" >
                        <button data-movie-id='${currentMovie.imdbID}' ${movieExist ? 'disabled' : ''} id='add' >${movieExist ? 'Added' : 'Add'}</button>
                    </div>
                    <div class="content-wrapper" >
                        <div class="title" >${currentMovie.Title}</div>
                        <div class="year" >${currentMovie.Year}</div>
                    </div>
                </div>
            `
            
            listEls += movieItem
        }
        movieListContainer.innerHTML = listEls;
        listenToAdd();
    }

    function fetchPoster(poster,index){
        var dummyPoster = "https://m.media-amazon.com/images/G/01/imdb/images/nopicture/medium/film-3385785534._CB483791896_.png";
        
        fetch(poster)
        .then(resp => {
            var posterToLoad = resp.status === 200 ? poster : dummyPoster
            var imgEl = document.querySelectorAll('.movie-item img')[index];
            imgEl.src = posterToLoad;
        })
    }

    return {
        init
    }

})();

MovieApp.init();


