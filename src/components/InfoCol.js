import React from 'react';
import Table from './Table';
import config from '../config';
import PropTypes from 'prop-types';

class InfoCol extends React.Component {

    static propTypes = {
        data: PropTypes.object
    };

    render() {
        const data = this.props.data;
        const coordinateSubstrStart = 0;
        const coordinateSubstrEnd = 5;
        const noBorderTableStyle = {
            width: '100%',
            border: 'none',
            borderCollapse: 'collapse'
        };

        const sortedPhones = Object.keys(data.phones).map(function(key) {
            return [ key, data.phones[ key ] ];
        });

        sortedPhones.sort(function(first, second) {
            return second[ 1 ] - first[ 1 ];
        });

        const markersExtracted = data.markers.map(function(dict) {
            const city = dict.city ? dict.city + ', ' : '';
            const county = dict.county ? dict.county + ', ' : '';
            const state = dict.state ? dict.state + ', ' : '';
            const country = dict.country ? dict.country : '';
            const address = city + county + state + country;
            const lat = dict.lat.toString().substring(
                coordinateSubstrStart, coordinateSubstrEnd);
            const lng = dict.lng.toString().substring(
                coordinateSubstrStart, coordinateSubstrEnd);
            return [ '| ' + dict.ssid + ', Lat: ' + lat + ' Lng: ' + lng,
                '| Address: ' + address ];
        });

        // console.log(sortedPhones, markersExtracted);
        return <div id="infoCol">
            <div id="addressDiv">
                <hr/>
                <Table type="list" info={ markersExtracted } rotating={ true }
                       maxRows={ config.maxEntriesForAP }
                       tableStyle={ noBorderTableStyle }/>
                <hr/>
            </div>
            <div id="phonesDiv">
                <Table type="listOfListsAllItems" info={ sortedPhones }
                       maxRows={ config.maxEntriesForMan }
                       widthDistribution={ [ '80%', '20%' ] }/>
            </div>
        </div>;
    }

}

export default InfoCol;
