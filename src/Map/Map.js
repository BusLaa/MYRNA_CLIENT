import React, {useState, useEffect} from 'react';
import { gql } from 'graphql-request';

import PlaceBlock from '../PlaceBlock/PlaceBlock';

import './Map.css';

import * as ol from 'ol';
import * as proj from 'ol/proj';
import * as source from 'ol/source';
import * as layer from 'ol/layer';
import * as geom from 'ol/geom';
import * as style from 'ol/style';

import homeMarkerImg from '../img/homemarker3.png';

function Map (props) {

  const [places, setPlaces] = useState([]);
  const [nearPlaces, setNearPlaces] = useState([]);

  const [userLocation, setUserLocation] = useState({});

  const [iconLatitude, setIconLatitude] = useState(0);
  const [iconLongitude, setIconLongitude] = useState(0);

  let home = new ol.Feature({
    geometry: new geom.Point(proj.fromLonLat([iconLongitude, iconLatitude])),
    name: 'Home',
  });

  const [markers, setMarkers] = useState([home]);

  const [mapStyle, setMapStyle] = useState("map");
  const [map, setMap] = useState({});
  
  let query = gql`
    query GetAllPlaces {
      getAllPlaces {
        id
        name
        paradigm 
        images {
          id
          path
        }
        location {
          id
          latitude
          longitude
        }
      }
    }
  `;

  let query2 = gql`
    query GetUserById {
      getUserById(id: ${localStorage.getItem("user_id")}) {
          location {
            id
            latitude
            longitude
          }
      }
    } 
  `;

  async function getData() {
      try {
          return await fetch(process.env.REACT_APP_SERVER_IP, {
              headers: {'Content-Type': 'application/json'},
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

  async function getData2() {
    try {
        return await fetch(process.env.REACT_APP_SERVER_IP, {
            headers: {'Content-Type': 'application/json', 'verify-token': localStorage.getItem("token")},
            method: 'POST',
            body: JSON.stringify({"query": query2})
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
    
    getData().then((a) => {
      console.log(a);
      setPlaces([].concat(places, a.data.getAllPlaces));
    })    

    getData2().then((a) => {
      setUserLocation(a.data.getUserById.location);
      setIconLatitude(a.data.getUserById.location?.latitude); 
      setIconLongitude(a.data.getUserById.location?.longitude);
    })
  }, []);

  useEffect(() => {
    document.getElementById("map").innerHTML = "";
    setMap(map => new ol.Map({
      target: 'map', controls: [],
      layers: [
        new layer.Tile({
          source: new source.OSM(),
        }),
        new layer.Vector({
          source: new source.Vector({
            features: markers
          }),
          style: new style.Style({
            image: new style.Icon({
              anchor: [0.5, 46],
              anchorXUnits: 'fraction',
              anchorYUnits: 'pixels',
              src: homeMarkerImg
            })
          })
        })
      ],
      view: new ol.View({
        center: proj.fromLonLat([userLocation?.longitude || 27.7952597, userLocation?.latitude || 59.3912168]),
        zoom: 12
      })
    }))
  }, [markers, userLocation]);

  useEffect(() => {
    markers[0] = new ol.Feature({
      geometry: new geom.Point(proj.fromLonLat([iconLongitude, iconLatitude])),
      name: 'Home',
    });
  }, [iconLatitude, iconLongitude]);

  return(
      <div className='mapPage slide'>
          <p className='mapPageText'>Map</p>
          <div className='mapDiv'>
            <div id="map" className="map">
              <p></p>
              <div id="popup"></div>
            </div>
          </div>
          <p className="nearPlacesText"> Places near you </p>
          <div className='nearPlacesSearch'>
              <input type="text" placeholder='Pitsameistrid...'></input>
              <input type="button" value=" Search "></input>
          </div>
          <div className='nearPlacesDiv'>
            <div className="nearPlaces">
              { places.map( (place) => <PlaceBlock key={place.id} place={place}/> ) }
            </div>
          </div>
      </div>
  )

}

export default Map;