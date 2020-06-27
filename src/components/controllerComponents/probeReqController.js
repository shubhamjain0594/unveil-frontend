import React, { Component } from 'react';
import config from '../../config';
import { createAxiosInstance } from './utils';
import PropTypes from 'prop-types';

const urljoin = require('url-join');

class ProbeRequestController extends Component{
    constructor(props) {
        super(props);
        this.state = {
            list_sessions: [],
            display_id: 0,
            axiosInstance: createAxiosInstance(props.token)
        };
    }

    static propTypes = {
        token: PropTypes.string
    };

    static defaultProps = {
        token: '1234'
    };

    static getDerivedStateFromProps(props, state) {
        return {
            axiosInstance: createAxiosInstance(props.token),
            list_sessions: state.list_sessions,
            display_id: state.display_id
        };
    }

    updateResultsList() {
        const url = urljoin(config.url, 'probe/list/');
        this.state.axiosInstance.get(url).then(
            res => {
                res.data.results.sort(function(first, second) {
                    return new Date(second[ 'creation_time' ]) -
                        new Date(first[ 'creation_time' ]);
                });
                this.setState({ list_sessions: res.data.results });
            }
        );
    }

    displayZoom(event) {
        const url =  urljoin(config.url, 'display/zoom/');
        this.state.axiosInstance.post(url, { screen: config.probe_screen,
            zoom: parseInt(event.target.innerHTML, 10) }).then(
            _unused__res => {
            }
        );
    }

    displaySessionHelper(event, session) {
        if (session === null||(typeof session === 'undefined')){
            session = config.disabledSessionIndicator;
        }
        const url =  urljoin(config.url, 'display/post/');
        this.state.axiosInstance.post(url, { screen: config.probe_screen,
            session: session, zoom: config.minZoom }).then(
            _unused__res => {
            }
        );
    }

    displaySession(event) {
        this.displaySessionHelper(event, event.target.innerHTML);
    }

    componentDidMount() {
        this.updateResultsListInterval = setInterval(
            this.updateResultsList.bind(this), config.updateTime);
    }

    componentWillUnmount() {
        clearInterval(this.updateResultsListInterval);
    }

    render() {
        const zoomLevels = Array(Math.ceil((
            config.maxZoom - config.minZoom) / config.zoomInterval) + 1).fill(
                config.minZoom).map(
            (x, y) => x + y * config.zoomInterval);
        return (
            <div className="container justify-content-center">
                <button className="btn btn-primary mb-4" onClick={
                    this.displaySessionHelper.bind(this) }>
                    Hide Probe Requests
                </button>
                <div className="row top-bottom-buffer">
                    <div className="col-sm-4">
                        <h5 className="m-2">Zoom Levels</h5>
                    </div>
                    <div className="col-sm-8">
                        {zoomLevels.map(function(elem, _unused__index) {
                            return (<button
                                className="btn btn-outline-primary m-1"
                                onClick={ this.displayZoom.bind(this) }
                                key={ elem }>{elem}</button>);
                        }, this)}
                    </div>
                </div>
                <table className="table table-bordered">
                    <tbody>
                    <tr>
                        <th scope="col">Session ID</th>
                        <th scope="col">Created on</th>
                        <th scope="col">Rating</th>
                    </tr>
                    <tr key={ config.fakeSessionID }>
                        <td>
                            <button type="button"
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={ this.displaySession.bind(this) }>
                                {config.fakeSessionID}
                            </button>
                        </td>
                        <td></td>
                        <td></td>
                    </tr>
                    {this.state.list_sessions.map(function(
                        elem, _unused__index) {
                        return (
                            <tr key={ elem[ 'session_id' ] }>
                                <td>
                                    <button type="button"
                                            className="btn btn-outline-primary
                                            btn-sm" onClick={
                                        this.displaySession.bind(
                                            this) }>
                                        {elem[ 'session_id' ]}
                                    </button>
                                </td>
                                <td>{(new Date(
                                    elem[ 'creation_time' ])
                                    .toLocaleString())}</td>
                                <td>{elem[ 'rating' ]}</td>
                            </tr>
                        );
                    }, this)}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default ProbeRequestController;