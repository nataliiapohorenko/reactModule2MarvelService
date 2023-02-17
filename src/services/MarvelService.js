import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {

    const {loading, request, error, clearError} = useHttp();

    const _apiBase='https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=86ab3206d3683fad9c48eea22faab2ec';
    const _baseOffset = 210;

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter)
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const checkDescr = (descr) => {
        if(descr === ''){
            return 'no description';
        } else if (descr.length>225){
            return (descr.slice(0, 225)+'...');
        } else return descr;
    }

    const _transformCharacter = (char) => {
        return{
            name: char.name,
            description: checkDescr(char.description),
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            id: char.id,
            comics: char.comics.items
        }
    }

    return {loading, error, clearError, getAllCharacters, getCharacter}
}

export default useMarvelService;