import React from 'react';
import InfoCol from './InfoCol';
import MainMap from './MainMap';
import MiniMap from './MiniMap';
import axios from 'axios';
import config from '../config';
import CPGLogo from './CPGLogo';
import data from '../data/mapData';
import PropTypes from 'prop-types';

const urljoin = require('url-join');

class MapViewHelper extends React.Component {

    static propTypes = {
        data: PropTypes.object,
        zoom: PropTypes.number
    };

    render() {
        return (
            <div id="MapContainer">
                <div id="leftCol">
                    <div id="minimap">
                        <MiniMap data={ this.props.data }/>
                    </div>
                    <InfoCol data={ this.props.data }/>
                    <div id="map">
                        {/* attributes to MainMap to customize zoomInterval*/}
                        <MainMap data={ this.props.data } zoom={
                            this.props.zoom }/>
                    </div>
                </div>
            </div>
        );
    }
}

class MapView extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            data: data,
            session: config.disabledSessionIndicator,
            zoom: config.minZoom
        };
    }

    fetchData() {
        const fetch_session_url = urljoin(config.url, 'display/get/',
            config.probe_screen);
        axios.get(fetch_session_url).then(
            res => {
                if (res.data.id !== this.state.session ||
                    res.data.zoom !== this.state.zoom) {
                    this.setState({ session: res.data.id,
                        zoom: res.data.zoom });
                    if (this.state.session !== config.disabledSessionIndicator
                        && this.state.session !== config.fakeSessionID) {
                        const fetch_data_url = urljoin(
                            config.url, 'probe/session/', this.state.session);
                        axios.get(fetch_data_url).then(
                            res => {
                                const data = res.data.results;
                                this.setState({ data: data });
                            }
                        );
                    }
                }
            }
        );
    }

    componentDidMount(){
        this.fetchDataInterval = setInterval(
            this.fetchData.bind(this), config.updateTime);
    }

    componentWillUnmount(){
        clearInterval(this.fetchDataInterval);
    }

    render() {
        // require('../css/visualisation.css');
        require('../css/responsive.css');
        if (this.state.session === 0){
            return <CPGLogo/>;
        } else {
            return <MapViewHelper data={ this.state.data }
                                  zoom={ this.state.zoom }/>;
        }
    }

}

export default MapView;
