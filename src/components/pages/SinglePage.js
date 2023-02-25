import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';
import AppBanner from '../appBanner/AppBanner';

const SinglePage = ({BaseComponent, itemType}) => {
    
    const {itemId} = useParams();
    const [item, setItem] = useState(null);

    const { process, setProcess, clearError, getCharacter, getComic} = useMarvelService();

    useEffect(() => {
        updateItem();
    }, [itemId])

    const onItemLoaded = (item) => {
        setItem(item);
    }

    const updateItem = () => {
        clearError();

        switch (itemType){
            case 'comic':
                getComic(itemId)
                    .then(onItemLoaded)
                    .then(()=> setProcess('confirmed'));
                break;
            case 'character':
                getCharacter(itemId)
                    .then(onItemLoaded)
                    .then(()=> setProcess('confirmed'));
        }
    }

    return (
        <>
            <AppBanner/>
            {setContent(process, BaseComponent, item)}
        </>
    )

}

export default SinglePage;