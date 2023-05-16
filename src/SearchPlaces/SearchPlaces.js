import React, {useEffect, useState} from 'react';
import "./SearchPlaces.css"

import { gql } from 'graphql-request';

import PlaceSearchBlock from '../PlaceSearchBlock/PlaceSearchBlock';
import PlaceFoundBlock from '../PlaceFoundBlock/PlaceFoundBlock';

function SearchPlaces (props) {

    const [places, setPlaces] = useState([]);
    const [placeDivStyle, setPlaceDivStyle] = useState("placesDiv");

    const [searchString, setSearchString] = useState("");

    const [place, setPlace] = useState(null);

    let query = gql`
        query GetPlacesByName {
            getPlacesByName(searchString: "${searchString}") {
                id
                name
                paradigm
                rating
                images {
                    id
                    path
                }
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
                if (a.data.getPlacesByName.length !== 0) {
                    setPlaceDivStyle("placesDiv placesDivBorders");
                } else {
                    setPlaceDivStyle("placesDiv");
                }
                setPlaces(a.data.getPlacesByName);
            });            
        }
    }, [searchString])

    function onChoose2 (place) {
        setPlace(place);
        setPlaces([]);
        setSearchString("");
        setPlaceDivStyle("placesDiv");
    }

    return(
        <div className='places'>
            <input className={props.placeSearchbarStyle} onChange={(e) => setSearchString(e.target.value)} value={searchString} type="text" placeholder='Type to search'></input>
            <div className={props.placeFoundDivStyle}>
                <PlaceFoundBlock onDechoose={props.onDechoose} key={place?.id} place={place}/>
            </div>
            <div className={placeDivStyle}>
                {places.map((place) => <PlaceSearchBlock onChoose2={onChoose2} onChoose={props.onChoose} key={place.id} place={place}/>)}
            </div>
        </div>
    )
}

export default SearchPlaces;