import React, { Component } from 'react';
import Table from './Table';
import { trimURL } from './Utils';

class User extends Component {

    updateInternetTraffic = () => {
        let i;
        let http = false;
        const HTTPRows = [];
        const SecureRows = [];
        const maxLengthHTTP = 60;
        const totalLength = this.props.dataDict.Internet_Traffic.length;
        for (i=0; i<totalLength; i++){
            if (this.props.dataDict.Internet_Traffic[ i ][ 2 ]==='HTTP'){
                const http_row = this.props.dataDict.Internet_Traffic[ i ];
                http_row[ 1 ] = trimURL(http_row[ 1 ], maxLengthHTTP);
                HTTPRows.push(http_row);
                http = true;
            } else {
                SecureRows.push(this.props.dataDict.Internet_Traffic[ i ]);
            }
        }
        return [ http, HTTPRows, SecureRows ];
    };

    render() {
        const data = this.props.dataDict;
        const httpPresence = this.updateInternetTraffic();
        const internetWidthDistribution = [ '20%', '45%', '15%', '20%' ];
        // console.log(httpPresence);
        const maxDnsRows = 24;
        const dnsQueries = data.DNS_Queries.slice(0, Math.min(
            maxDnsRows, data.DNS_Queries.length));
        return (
            <div className="UserContainer">
                <div className="row">
                    <header id="title">
                        Device - {data.Device_Info[ 'MAC Address' ]} -
                        {data.Device_Info[ 'OS Version' ]}
                    </header>
                </div>
                <div className="row">
                    <div id="DeviceInfo">
                        <header>Device Info</header>
                        <Table info={ data.Device_Info }
                               type='dict'
                               widthDistribution={ [ '25%', '75%' ] }/>
                    </div>
                </div>
                {/* <div className="row">*/}
                {/* <div id="AppsContainer">*/}
                {/* <header>User's Apps</header>*/}
                {/* <div className="row">*/}
                {/* <div className="col">*/}
                {/* <Table info={data.Apps.slice(0, (data.Apps.length) / 2)} type='listOfListsOne' maxRows={10}/>*/}
                {/* </div>*/}
                {/* <div className="col">*/}
                {/* <Table info={data.Apps.slice((data.Apps.length) / 2, data.Apps.length)} type='listOfListsOne' maxRows={10}/>*/}
                {/* </div>*/}
                {/* </div>*/}
                {/* </div>*/}
                {/* </div>*/}
                <div className="row">
                    <div id="DNSContainer">
                        <header>DNS Queries</header>
                        <div className="row">
                            <div className="col">
                                <Table
                                    info={ dnsQueries.slice(0,
                                        (dnsQueries.length) / 2) }
                                    type='listOfListsOne'
                                    className="TableLeft"
                                    maxRows={ maxDnsRows / 2 }/>
                            </div>
                            <div className="col">
                                <Table
                                    info={ dnsQueries.slice(
                                        dnsQueries.length / 2,
                                        dnsQueries.length) }
                                    type='listOfListsOne'
                                    className="TableRight"
                                    maxRows={ maxDnsRows / 2 }/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div id="TrafficContainer">
                        <header>Internet Traffic</header>
                        {httpPresence[ 0 ]?
                            <div>
                                <header className="tableTitle">
                                    Unsecure Traffic
                                </header>
                                <Table info={ httpPresence[ 1 ] }
                                       type='listOfListsAllItems'
                                       rotating={ true }
                                       maxRows={ 1 }
                                       widthDistribution={
                                           internetWidthDistribution }/>
                                <header id='SecureTrafficHeader'
                                        className="tableTitle">
                                    Secure Traffic
                                </header>
                                <Table info={ httpPresence[ 2 ] }
                                       type='listOfListsAllItems'
                                       rotating={ true }
                                       maxRows={ 8 }
                                       widthDistribution={
                                           internetWidthDistribution }/>
                            </div>:
                            <Table info={ data.Internet_Traffic }
                                   type='listOfListsAllItems' rotating={ true }
                                   maxRows={ 10 } widthDistribution={
                                internetWidthDistribution }/>}
                    </div>
                </div>
            </div>
        );
    }
}

export default User;
