import React from 'react';
import { Map, Marker, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import { isGDO, getResizeFactor } from './Utils';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import PropTypes from 'prop-types';

class MiniMap extends React.Component {

    static propTypes = {
        data: PropTypes.object
    };

    state = {
        position: [ 50, -2 ],
        zoom: isGDO() ? 3.1 : 1
    };

    render() {
        const markers = this.props.data.markers;
        const greenIcon = new L.Icon({
            iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/' +
            'master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/' +
            'images/marker-shadow.png',
            iconSize: [ 25 / getResizeFactor(), 41 / getResizeFactor() ],
            iconAnchor: [ 12 / getResizeFactor(), 41 / getResizeFactor() ],
            popupAnchor: [ 1 / getResizeFactor(), -34 / getResizeFactor() ],
            shadowSize: [ 41 / getResizeFactor(), 41 / getResizeFactor() ]
        });
        const createClusterCustomIcon = function(){
            return greenIcon;
        };

        return <Map center={ this.state.position } zoom={ this.state.zoom }
                    maxZoom={ 19 } zoomControl={ false } minZoom={ 0.1 }
                    zoomSnap={ 0.1 } style={ { filter:'brightness(200%)' } }>
            <TileLayer
                url={"https://cartodb-basemaps-{s}.global.ssl.fastly.net/"
                + "dark_all/{z}/{x}/{y}{r}.png"}
                attribution="&copy; <a href=&quot;http://osm.org/
                copyright&quot;>OpenStreetMap</a> contributors"
                subdomains="abcd"
                maxzoom="19"
            />
            {/* maxClusterRadius - decreasing radius = more, smaller clusters*/}
            <MarkerClusterGroup iconCreateFunction={ createClusterCustomIcon }
                                maxClusterRadius={ 20 / getResizeFactor() }>
                {markers.map(function(markerDict, markerIndex) {
                    return <Marker key={ `${ markerIndex }marker` }
                                   position={
                                       [ markerDict.lat, markerDict.lng ] }
                                   icon={ greenIcon } />;
                })}
            </MarkerClusterGroup>
        </Map>;
    }

}

export default MiniMap;