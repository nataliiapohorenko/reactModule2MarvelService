import { useState, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import InfiniteScroll from 'react-infinite-scroll-component';

import './charList.scss';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

const setContent = (process, Component, newItemLoading) => {
    switch (process) {
        case 'waiting':
            return <Spinner/>;
        case 'loading':
            return newItemLoading ? <Component/> : <Spinner/>;
        case 'confirmed':
            return <Component/>;
        case 'error':
            return <ErrorMessage/>
        default:
            throw new Error('Unexpected process state');
    }
}

const CharList = (props) => {
    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const {process, setProcess, getAllCharacters} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharListLoaded)
            .then(()=> setProcess('confirmed'));
    }

    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if(newCharList.length < 9) {
            ended = true;
        }

        setCharList(charList=> [...charList, ...newCharList]);
        setNewItemLoading(false);
        setOffset(offset=> offset+9);
        setCharEnded(ended)
    }

    const sizePic = (thumbnail) => {
        if(thumbnail==="http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg") {
            return ({objectFit: 'fill'});
        } else return null;
    }

    const itemRefs = useRef([]);

    const focusRef = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    function createItems (charList) {
        const elements = charList.map((item, i)=>{
            const {id, name, thumbnail} = item;
            return(
                <CSSTransition key={id} timeout={500} classNames="char__item">
                    <li className='char__item'
                    ref={el => itemRefs.current[i] = el}
                    tabIndex={0}
                    onClick={()=> {props.onCharSelected(id);
                                    focusRef(i)}}
                    onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            props.onCharSelected(id);
                            focusRef(i)
                        }
                    }}>
                    <img src={thumbnail} style={sizePic(thumbnail)} alt={name}/>
                    <div className="char__name">{name}</div>
                </li>
                </CSSTransition>
            )
        })
        return (
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {elements}
                </TransitionGroup>
            </ul>
        )
    }
    
    const elements = useMemo(()=>{
        return setContent(process, ()=> createItems(charList), newItemLoading);
    }, [process])

    return (
        <div className="char__list">
            <InfiniteScroll
                dataLength={offset-201}
                next={()=>onRequest(offset)}
                hasMore={true}
                scrollThreshold={0.95}
            >
                {elements}
            </InfiniteScroll>
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': charEnded ? 'none' : 'block'}}
                onClick={()=>onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;