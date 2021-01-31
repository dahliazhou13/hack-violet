import React from 'react'
import { useEffect } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Nav from '../../component/Nav/Nav';
import axios from 'axios';
import './Home.css';
import { LinearProgress } from '@material-ui/core';
axios.defaults.baseURL = 'https://delivery-node-api-1214.herokuapp.com/';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export default GoogleApiWrapper({
    apiKey: 'AIzaSyAVrli7ak5or6NSoSbNxLEud4c1xrYi0Uk'
})(Home);

const mapStyles = {
    width: '100%',
    height: '50vh',
};

function Home(props) {
    const [currentUserLocation, setCurrentUserLocation] = useState({
        latlng: '', lat: '', lng: ''
    });
    const [isMapLoading, setIsMapLoading] = useState(false);
    const [orderLocations, setOrderLocations] = useState(
        [{ lat: 47.49855629475769, lng: -122.14184416996333 },
        { latitude: 47.359423, longitude: -122.021071 },
        { latitude: 47.2052192687988, longitude: -121.988426208496 },
        { latitude: 47.6307081, longitude: -122.1434325 },
        { latitude: 47.3084488, longitude: -122.2140121 },
        { latitude: 47.5524695, longitude: -122.0425407 }]
    )

    const history = useHistory();
    const [showMap, setShowMap] = useState(false)
    const options = {
        enableHighAccuracy: true
    }

    useEffect(() => {
        alert('fetching your current location');
        getOrders();
    }, [history])

    const getOrders = () => {
        setIsMapLoading(true)
        axios.get('/orders/all')
            .then(function (response) {
                // handle success
                console.log(response);
                setOrderLocations(response.data)
                setIsMapLoading(false);
                setShowMap(true);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
    }

    // get location
    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(displayLocation, showError, options)
        }
        else {
            // M.toast({ html: '', classes: 'rounded' });
            alert('Sorry, your browser does not support this feature... Please Update your Browser to enjoy it');
        }
    }

    // displayLocation
    const displayLocation = (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        const latlng = { lat, lng }
        console.log({ lat, lng })
        setCurrentUserLocation({ latlng, lat, lng });
        setShowMap(true);
    }

    const showError = (error) => {
        // mapArea.style.display = "block"
        switch (error.code) {
            case error.PERMISSION_DENIED:
                return alert("You denied the request for your location.")
            case error.POSITION_UNAVAILABLE:
                return alert("Your Location information is unavailable.")
            case error.TIMEOUT:
                return alert("Your request timed out. Please try again")
            case error.UNKNOWN_ERROR:
                return alert("An unknown error occurred please try again after some time.")
            default:
                return alert("something went wrong")
        }
    }


    const displayMarkers = () => {
        return orderLocations.map((deliveryLoc, index) => {
            return <Marker key={index} id={index} position={{
                lat: deliveryLoc.latitude,
                lng: deliveryLoc.longitude
            }}
                onClick={() => console.log("You clicked me!")} >

            </Marker>

        })
    }


    return (
        <div className="container">
            <div className="welcome_text">
                <h3>Good afternoon Jen!</h3>
                <h5>what would you like to order today?</h5>
            </div>
            <div className="map_container">
                {isMapLoading && <div>
                    <LinearProgress />
                    <h5>Fetching orders, please wait ...</h5>
                </div>}
                {showMap && <Map
                    google={props.google}
                    zoom={8}
                    style={mapStyles}
                    initialCenter={{ lat: 43.78283060722152, lng: -79.4143353267212 }}
                >
                    {displayMarkers()}
                </Map>}
            </div>
            <Nav />
        </div>
    )
}

