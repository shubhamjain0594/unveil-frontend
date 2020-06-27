import React from 'react';
import axios from 'axios';
import User from './User';
import config from '../config';
import CPGLogo from './CPGLogo';
import PropTypes from 'prop-types';

const urljoin = require('url-join');
const fake_data = require('../data/data.json');

class DataViewHelper extends React.Component {

    constructor(props){
        super(props);
        this.props = props;
        this.createUsers = this.createUsers.bind(this);
    }

    static propTypes = {
        data: PropTypes.array
    };

    createUsers(data) {
        const tableView = [];

        // add each user to table view
        for (let i = 0; i < config.maxDevicesPerScreen; i++) {
            if (i < data.length){
                // dataDict is the dict of a specific device of the list
                // it assumes list is of max-length 3
                tableView.push(<User
                    key={ `user${ data[ i ].Device_Info[ 'MAC Address' ] }` }
                    dataDict={ data[ i ] }/>);
            } else {
                tableView.push(<div className="UserContainer"></div>);
            }
        }
        return tableView;
    }

    render() {
        const tableView = this.createUsers(this.props.data);
        const widthPercentage = 100/tableView.length;
        return (
            tableView.map(function(user, index) { // executed if data is a list
                return <div key={ `user${ index }` }
                            className="ContainerCol" style={
                    { maxWidth:`${ widthPercentage }%` } }>{user}</div>;
            }));
    }
}

class DataView extends React.Component {
    constructor(props){
        super(props);
        this.props = props;
        this.state = { data: this.selectData(fake_data), session: 0 };
    }

    static propTypes = {
        start: PropTypes.number
    };

    static defaultProps = {
        start: 0
    };

    selectData(data) {
        return data.length > this.props.start ? data.slice(
            this.props.start, Math.min(
                this.props.start + config.maxDevicesPerScreen,
                data.length)): [];
    }

    fetchData() {
        const fetch_session_url = urljoin(
            config.url, 'display/get/', config.ap_screen);
        axios.get(fetch_session_url).then(
            res => {
                if (res.data.id !== this.state.session) {
                    this.setState({ session: res.data.id });
                    if (this.state.session !== config.disabledSessionIndicator
                        && this.state.session !== config.fakeSessionID) {
                        const fetch_data_url = urljoin(
                            config.url, 'ap/session/', this.state.session);
                        axios.get(fetch_data_url).then(
                            res => {
                                const data = this.selectData(res.data.results);
                                this.setState({ data: data });
                            }
                        );
                    } else if (this.state.session === config.fakeSessionID) {
                        this.setState({ data: this.selectData(fake_data) });
                    }
                }
            }
        );
    }

    componentDidMount(){
        this.fetchDataInterval = setInterval(
            this.fetchData.bind(this), config.updateTime);
    }

    componentWillUnmount() {
        clearInterval(this.fetchDataInterval);
    }

    render() {
        // require('../css/visualisation.css');
        require('../css/responsive.css');
        if (this.state.session === config.disabledSessionIndicator ||
            !this.state.data.length){
            return <CPGLogo/>;
        } else {
            return <DataViewHelper data={ this.state.data }/>;
        }

    }
}

export default DataView;