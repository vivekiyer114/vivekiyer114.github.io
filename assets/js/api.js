var Api = (function(){
   
    const baseUrl = 'http://www.omdbapi.com/';

    function get(url,params){
        url = appendApiKey(url)

        var urlToFetch = baseUrl+url;
        return fetch(urlToFetch,{
                method:'GET'
            }).then(resp => resp.json())
    }

    function appendApiKey(url){
        return url + '&apikey=4a93dce0';
    }

    return {
        get,
    }

})()