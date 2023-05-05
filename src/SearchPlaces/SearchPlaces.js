import React, {useEffect, useState} from 'react';
import "./SearchPlaces.css"

import { gql } from 'graphql-request';

import Place from '../Place/Place'

function SearchPlaces (props) {

    const [places, setPlaces] = useState([]);

    const [searchString, setSearchString] = useState("");

    let query = gql`
        query GetPlacesByName {
            getPlacesByName(search: "${searchString}") {
                id
                name
                paradigm
                rating
                location {
                    id
                    city
                    country
                    postalCode
                }
            }
        }     
    `;

    async function getPlaces() {
        try {
            return await fetch(process.env.REACT_APP_SERVER_IP, {
                headers: {'Content-Type': 'application/json', 'verify-token': localStorage.getItem("token")},
                method: 'POST',
                body: JSON.stringify({"query": query})
            }).then((a) =>{
                return a.json()
            }).then((b) => { 
                return b
            })
        } catch (err) {
            console.log(err)
        }       
    }   

    useEffect(() => {
        if (searchString.length > 2) {
            getPlaces().then((a) => {
                setPlaces(a.data.getPlacesByName);
            });            
        }
    }, [searchString])

    function onChoose2 () {
        setPlaces([]);
        setSearchString("");
    }


    return(
        <div className='places'>
            <input className='addMeetingFormPlaceSearchbar' onChange={(e) => setSearchString(e.target.value)} value={searchString} type="text" placeholder='Type to search'></input>
            <div style={{height: '300px', overflowX: 'hidden', overflowY: 'auto', scrollbarGutter: "stable"}}>
                {places.map((place) => <Place onChoose2={onChoose2} onChoose={props.onChoose} key={place.id} place={place}/>)}
            </div>
        </div>
    )
}

export default SearchPlaces;