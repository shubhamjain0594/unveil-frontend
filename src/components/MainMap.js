import React, { createRef } from 'react';
import { Map, Marker, TileLayer, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import PropTypes from 'prop-types';
import config from '../config';
import { getResizeFactor } from './Utils';

class MainMap extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            position: config.mainMapCenter,
            zoom: props.zoom,
            lastZoom: props.zoom,
            prevPropsZoom: props.zoom
        };
        this.markers = createRef();
    }

    static propTypes = {
        // attributes for interval zoom in
        zoomIncreaseLevel: PropTypes.number,
        zoomIntervalTime: PropTypes.number,
        data: PropTypes.object,
        zoom: PropTypes.number
    };

    static defaultProps = {
        // defaults for zooming in
        zoomIncreaseLevel: config.zoomInterval,
        zoomIntervalTime: config.zoomIntervalTime,
        data: [],
        zoom: []
    };

    static getDerivedStateFromProps(props, state) {
        if (state.prevPropsZoom !== props.zoom){
            return {
                position: MainMap.meanLatLng(props.data, props.zoom),
                zoom: props.zoom,
                lastZoom: state.zoom,
                prevPropsZoom: props.zoom
            };
        }
        return null;
    }

    static isPointNearby = (markerA, markerB, zoom) => {
        const maxLat = 180;
        const maxLong = 360;
        const scaler = Math.pow(2, -1 * zoom);
        if ((Math.abs(markerA.lat - markerB.lat) < maxLat * scaler) && (
            Math.abs(markerA.lng - markerB.lng) < maxLong * scaler)){
            return true;
        }
        return false;
    };

    static meanLatLng = (data, zoom) => { // used as a position to zoom in
        const markers = data.markers;
        let markersUK = markers.filter(
            marker => marker.country === 'United Kingdom');
        if (zoom >= config.minZoom){
            const markersList = [];
            for (let k = 0; k < markersUK.length; k++){
                let belongsToList = false;
                let listNum = null;
                const pointToAdd = markersUK[ k ];
                for (let i = 0; i < markersList.length; i++){
                    for (let j = 0; j < markersList[ i ].length; j++){
                        if (MainMap.isPointNearby(pointToAdd,
                            markersList[ i ][ j ], zoom)){
                            if (belongsToList) {
                                markersList[ listNum ].push(
                                    ...markersList[ i ]);
                                markersList[ i ] = [];
                            } else {
                                belongsToList = true;
                                markersList[ i ].push(pointToAdd);
                                listNum = i;
                            }
                            break;
                        }
                    }
                }
                if (!belongsToList) {
                    markersList.push([ pointToAdd ]);
                }
            }
            let maxUsers = 0;
            let listOfUsers = null;
            for (let k = 0; k < markersList.length; k++) {
                let numUsers = 0;
                for (let i = 0; i < markersList[ k ].length; i++){
                    numUsers += markersList[ k ][ i ].users;
                }
                if (numUsers > maxUsers) {
                    maxUsers = numUsers;
                    listOfUsers = k;
                }
            }
            markersUK = markersList[ listOfUsers ];
            let sumUsers = 0;
            let sumUserLat = 0;
            let sumUserLng = 0;
            for (let i = 0; i < markersUK.length; i++) {
                sumUsers += markersUK[ i ].users;
                sumUserLat += (markersUK[ i ].users * markersUK[ i ].lat);
                sumUserLng += (markersUK[ i ].users * markersUK[ i ].lng);
            }
            return [ sumUserLat / sumUsers, sumUserLng / sumUsers ];
        } else {
            return config.mainMapCenter;
        }
    };

    changeZoom = () => {
        // increase zoom level by number of changes, up to maxZoomIn
        const zoomVal = this.state.zoom + this.props.zoomIncreaseLevel
        <= config.maxZoom ? this.state.zoom + this.props.zoomIncreaseLevel :
            config.maxZoom;
        this.setState({
            position: MainMap.meanLatLng(this.props.data, zoomVal),
            zoom: zoomVal,
            lastZoom: this.state.zoom
        });

        if (zoomVal === config.maxZoom) {
            clearInterval(this.intervalId);
        }
    };

    componentDidMount() { // interval of changing zoom is set here
        this.intervalId = setInterval(
            this.changeZoom.bind(this), this.props.zoomIntervalTime);
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    getClusterClassAndPoint(users) {
        let c = 'marker-cluster-';
        let radius = config.tooltipRadius[0] / getResizeFactor();
        if (users < config.tooltipUsersGroup[0]) {
            c += 'small';
        } else if (users < config.tooltipUsersGroup[1]) {
            c += 'medium';
            radius = config.tooltipRadius[1] / getResizeFactor();
        } else {
            c += 'large';
            radius = config.tooltipRadius[2] / getResizeFactor();
        }
        return [ c, new L.point(radius, radius) ];
    }

    render() {
        const markers = this.props.data.markers;
        const getClusterClassAndPoint = this.getClusterClassAndPoint.bind(this);
        const createClusterCustomIcon = function(cluster) {
            const child_markers = cluster.getAllChildMarkers();
            let sum = 0;
            for (let i = 0; i < child_markers.length; i++) {
                sum += child_markers[ i ].options.users;
            }
            const clusterClassAndPoint = getClusterClassAndPoint(sum);
            const c = clusterClassAndPoint[ 0 ];
            const size = clusterClassAndPoint[ 1 ];
            return L.divIcon({
                html: `<div><span>${ sum }</span></div>`,
                className: 'marker-cluster ' + c,
                iconSize: size
            });
        };
        // show tooltip only in inner most zoom in
        const tooltipShow = this.state.zoom >= config.showTooltipAfter;
        const markersTooltip = markers.map(function(markerDict, markerIndex) {
            const clusterClassAndPoint = getClusterClassAndPoint(
                Number(markerDict.users));
            const userIcon = L.divIcon({
                html: `<div><span>${ markerDict.users }</span></div>`,
                className: 'marker-cluster ' +
                clusterClassAndPoint[ 0 ],
                iconSize: clusterClassAndPoint[ 1 ],
                iconAnchor: [ 9 / getResizeFactor(),
                    21 / getResizeFactor() ],
                tooltipAnchor: [ 0, -23 / getResizeFactor() ]
            });
            const finalPosition = markerDict.address.length <= 40 ?
                markerDict.address.length :
                markerDict.address.indexOf(',',40);
            const tooltipAddress = markerDict.address.substring(0,
                finalPosition);
            const tooltipContent = markerDict.ssid + ', ' +
                tooltipAddress;
            return <Marker key={ `${ markerIndex }marker` } position={
                [ markerDict.lat, markerDict.lng ] }
                           icon={ userIcon } users={ markerDict.users }>
                {tooltipShow &&
                <Tooltip
                    key={ `${ markerIndex }tooltip${ tooltipShow }` }
                    permanent={ tooltipShow }
                    className='tooltipLeaflet'>{tooltipContent}
                </Tooltip>
                }
            </Marker>;
        });
        // console.log(markersTooltip);
        if (this.markers.refreshClusters){
            this.markers.refreshClusters(markersTooltip);
        }
        return <Map ref={this.mapRef}
                    center={ this.state.position } zoom={ this.state.zoom }
                    maxZoom={ config.maxZoom } zoomControl={ false }
                    style={ { filter: 'brightness(200%)' } }
                    >
            <TileLayer
                url={"https://cartodb-basemaps-{s}.global.ssl.fastly.net/"
                + "dark_all/{z}/{x}/{y}{r}.png"}
                attribution='&copy; <a href="http://www.openstreetmap.org/
                copyright">OpenStreetMap</a> &copy;
                <a href="http://cartodb.com/attributions">CartoDB</a>'
                subdomains="abcd"

            />
            <MarkerClusterGroup iconCreateFunction={ createClusterCustomIcon }
             ref={this.markers}>
                {markersTooltip}
            </MarkerClusterGroup>
        </Map>;
    }

}

export default MainMap;