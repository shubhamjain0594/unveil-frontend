import React from 'react';
import axios from 'axios';
import config from '../config';
import CPGLogo from './CPGLogo';

const urljoin = require('url-join');

class SetupView extends React.Component {
    constructor(props){
        super(props);
        this.props = props;
        this.state = { session: 0 };
    }

    fetchData() {
        const fetch_session_url = urljoin(
            config.url, 'display/get/', config.setup_screen);
        axios.get(fetch_session_url).then(
            res => {
                if (res.data.id !== this.state.session) {
                    this.setState({ session: res.data.id });
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
        require('../css/visualisation.css');
        const setupStyle = {
            backgroundImage: `url("/img/ss_${ this.state.session }.svg")`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            width: '100vw',
            height: '100vh'
        };
        if (this.state.session === 0){
            return <CPGLogo/>;
        } else {
            return (
                <div style={ setupStyle }>
                </div>
            );
        }

    }
}

export default SetupView;