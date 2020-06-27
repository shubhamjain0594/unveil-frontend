import React, { Component } from 'react';
import config from '../../config';
import PropTypes from 'prop-types';
import { createAxiosInstance } from './utils';

const urljoin = require('url-join');

class StatusController extends Component{
    constructor(props) {
        super(props);
        this.state = {
            pi: [],
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
            pi: state.pi
        };
    }

    updatePi() {
        const url = urljoin(config.url, 'status/list/');
        this.state.axiosInstance.get(url).then(
            res => {
                this.setState({ pi: res.data });
            }
        );
    }

    componentDidMount() {
        this.updatePiInterval = setInterval(
            this.updatePi.bind(this), config.updateTime);
    }

    componentWillUnmount() {
        clearInterval(this.updatePiInterval);
    }

    render() {
        return (
            <div className="container justify-content-center">
                <table className="table table-bordered">
                    <tbody>
                    <tr>
                        <th scope="col">MAC</th>
                        <th scope="col">Status</th>
                        <th scope="col">Last Updated</th>
                        <th scope="col">Connected Users</th>
                    </tr>
                    {this.state.pi.map(function(pi_status, _unused__index) {
                        return (
                            <tr key={ pi_status[ 'mac' ] }>
                                <td>{pi_status[ 'mac' ]}</td>
                                <td>{pi_status[ 'state' ]}</td>
                                <td>{pi_status[ 'updated_at' ]}</td>
                                <td>{pi_status[ 'ap_details' ][
                                    'connected_users' ]}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default StatusController;