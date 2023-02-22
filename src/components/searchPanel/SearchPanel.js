import { Formik, Form, Field, ErrorMessage } from "formik";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import useMarvelService from "../../services/MarvelService";
import './SearchPanel.scss'

const SearchPanel = () => {
    const [charName, setCharName] = useState(null);
    const [char, setChar] = useState(null);
    const [searchComplete, setSearchComplete] = useState(null);

    const { getCharacterByName} = useMarvelService();

    useEffect(() => {
        updateChar();
    }, [charName])

    const onCharLoaded = (char) => {
        setChar(char);
        console.log(char.id)
        setSearchComplete(true);
    }

    const updateChar = () => {
        if(charName===null) return;
        getCharacterByName(charName)
            .then(onCharLoaded)
            .catch(searchError);
    }

    const searchError = () => {
        setSearchComplete(false);
    }


    return(
        <div className="search">
            <div className="search__title">
                Or find a character by name:
            </div>
            <Formik
                initialValues={{ text: ''}}
                validate={values => {
                    const errors = {};
                    if (!values.text) {
                    errors.text = 'This field is required';
                    }
                    return errors;
                }}
                onSubmit={values => {
                    setCharName(values.text.trim().replace(/ /g, '%20'));
                    values.text='';
                }}
                >
                {() => (
                    <Form className="search__form">
                    <Field type="text" name="text" className="search__form-input" placeholder='Enter name'/>
                    <button type="submit" className="button button__main">
                        <div className="inner">Submit</div>
                    </button>
                    <ErrorMessage className="search__form-negative" name="text" component="div" />
                    {searchComplete===true?<>
                        <div className="search__form-positive">There is! Visit {charName} page?</div>
                        <Link to={`/character/${char.id}`} className="button button__secondary">
                            <div className="inner">TO PAGE</div>
                        </Link>
                    </> :null}
                    {searchComplete===false?<div className="search__form-negative">The character was not found. Check the name and try again</div> :null}
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default SearchPanel