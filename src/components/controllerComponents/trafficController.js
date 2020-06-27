import React, { Component } from 'react';
import { createAxiosInstance } from './utils';
import config from '../../config';
import PropTypes from 'prop-types';

const urljoin = require('url-join');

class TrafficController extends Component{
    constructor(props) {
        super(props);
        this.state = {
            list_sessions: [],
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
            list_sessions: state.list_sessions
        };
    }

    displaySessionHelper(event, session) {
        if (session === null||(typeof session === 'undefined')){
            session = config.disabledSessionIndicator;
        }
        const url =  urljoin(config.url, 'display/post/');
        this.state.axiosInstance.post(url, {
            screen: config.ap_screen, session: session }).then(
            _unused__res => {
            }
        );
    }

    displaySession(event) {
        this.displaySessionHelper(event, event.target.innerHTML);
    }

    updateResultsList() {
        const url = urljoin(config.url, 'ap/list/');
        this.state.axiosInstance.get(url).then(
            res => {
                res.data.results.sort(function(first, second) {
                    return new Date(second[ 'creation_time' ])
                        - new Date(first[ 'creation_time' ]);
                });
                this.setState({ list_sessions: res.data.results });
            }
        );
    }

    componentDidMount() {
        this.updateResultsListInterval = setInterval(
            this.updateResultsList.bind(this), config.updateTime);
    }

    componentWillUnmount() {
        clearInterval(this.updateResultsListInterval);
    }

    render() {
        return (
            <div className="container">
                <button className="btn btn-primary mb-4" onClick={
                    this.displaySessionHelper.bind(this) }>
                    Hide AP
                </button>
                <table className="table table-bordered">
                    <tbody>
                    <tr>
                        <th scope="col">Session ID</th>
                        <th scope="col">Created on</th>
                        <th scope="col"># Devices</th>
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
                                <td>{elem[ 'num_devices' ]}</td>
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

export default TrafficController;