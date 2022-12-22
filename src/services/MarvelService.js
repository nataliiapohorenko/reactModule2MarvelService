

class MarvelService {
_apiBase='https://gateway.marvel.com:443/v1/public/';
_apiKey = 'apikey=86ab3206d3683fad9c48eea22faab2ec'

    getResource = async (url) => {
        let res = await fetch(url);

        if(!res.ok){
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    }

    getAllCharacters = async () => {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`);
        return res.data.results.map(this._transformCharacter)
    }

    getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
        return this._transformCharacter(res.data.results[0]);
    }

    checkDescr = (descr) => {
        if(descr === ''){
            return 'no information';
        } else if (descr.length>225){
            return (descr.slice(0, 225)+'...');
        } else return descr;
    }

    _transformCharacter = (char) => {
        return{
            name: char.name,
            description: this.checkDescr(char.description),
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url
        }
    }
}

export default MarvelService;