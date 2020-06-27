import React, { Component } from 'react';
import config from '../../config';
import PropTypes from 'prop-types';
import { createAxiosInstance } from './utils';

const urljoin = require('url-join');

class DemoController extends Component {

    constructor(props) {
        super(props);
        this.axiosInstance = createAxiosInstance(props.token);
    }

    static propTypes = {
        token: PropTypes.string
    };

    displaySession(session) {
        if (session === null||(typeof session === 'undefined')){
            session = config.disabledSessionIndicator;
        }
        const url = urljoin(config.url, 'display/post/');
        this.axiosInstance.post(url, {
            screen: config.setup_screen, session: session }).then(
                _unused__res => {
            }
        );
    }

    render() {
        return (
            <div className="d-flex justify-content-between">
                <h5 className="m-3">Setup Screen Controls</h5>
                <button onClick={ () => this.displaySession('1') } type="button"
                        className="btn btn-lg btn-info m-1">Step 1</button>
                <button onClick={ () => this.displaySession('2') } type="button"
                        className="btn btn-lg btn-info m-1">Step 2</button>
                <button onClick={ () => this.displaySession('3') } type="button"
                        className="btn btn-lg btn-info m-1">Step 3</button>
                <button onClick={ () => this.displaySession('4') } type="button"
                        className="btn btn-lg btn-info m-1">Setup</button>
                <button onClick={ () => this.displaySession(
                    config.disabledSessionIndicator) } type="button"
                        className="btn btn-lg btn-info m-1">Hide screen</button>
            </div>
        );
    }
}

export default DemoController;