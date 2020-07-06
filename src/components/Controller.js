import React, { Component } from 'react';
import config from '../config';
import axios from 'axios';
import ProbeRequestController from './controllerComponents/probeReqController';
import TrafficController from './controllerComponents/trafficController';
import StatusController from './controllerComponents/statusController';
import DemoController from './controllerComponents/demoController';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import { createAxiosInstance } from './controllerComponents/utils';
import PropTypes from 'prop-types';

const urljoin = require('url-join');

class ControllerOperator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            session_id: config.disabledSessionIndicator,
            token: props.token
        };
        this.axiosInstance = createAxiosInstance(props.token);
    }

    static propTypes = {
        token: PropTypes.string
    };

    static defaultProps = {
        token: '1234'
    };

    updateSession() {
        const url = urljoin(config.url, 'session/latest/');
        this.axiosInstance.get(url).then(
            res => {
                const session_id = res.data.id;
                if (this.state.session_id !== session_id) {
                    this.setState({ session_id: session_id });
                }
            });
    }

    componentDidMount(){
        this.updateSessionInterval = setInterval(
            this.updateSession.bind(this), config.updateTime);
    }

    componentWillUnmount(){
        clearInterval(this.updateSessionInterval);
    }

    startSessionNow() {
        const url = urljoin(config.url, 'session/automate/0/');
        this.axiosInstance.post(url);
    }

    startSessionLater() {
        const url = urljoin(config.url, 'session/automate/300/');
        this.axiosInstance.post(url);
    }

    startManualSession() {
        const url = urljoin(config.url, 'session/manual/0/');
        this.axiosInstance.post(url);
    }

    endSession() {
        const url = urljoin(config.url, 'session/stop/');
        this.axiosInstance.post(url);
    }

    render() {
        const disabled = this.state.session_id !==
            config.disabledSessionIndicator;
        return (
            <div className="container">
                <div className="row top-bottom-buffer">
                    <div className="col-lg-10 offset-lg-1 align-self-center">
                        <div className="alert alert-primary">
                            <h5>Session ID: <b>{this.state.session_id}</b>
                            </h5>
                        </div>
                    </div>
                </div>
                <div className="row top-bottom-buffer">
                    {disabled ? (
                        <div
                            className="col-lg-2 offset-lg-5 align-self-center">
                            <button className="btn btn-lg btn-danger"
                                    onClick={ this.endSession.bind(this) }
                                    disabled={ !disabled }>
                                End demonstration
                            </button>
                        </div>) : (
                            <div
                            className="col-lg-2 offset-lg-2 align-self-center">
                                <button className="btn btn-lg btn-primary"
                                    onClick={ this.startSessionNow.bind(this) }>
                                Start now
                                </button>
                            </div>)
                    }{!disabled ? (
                        <div
                            className="col-lg-3 align-self-center">
                            <button className="btn btn-lg btn-primary"
                                    onClick={
                                        this.startSessionLater.bind(this) }>
                                Start after 5 mins
                            </button>
                        </div>)
                    : (<div></div>)
                }
                </div>
                <div className="row top-bottom-buffer">
                    <DemoController token={ this.state.token }/>
                </div>
                <div className="row top-bottom-buffer">
                    <div className="col-lg-6 align-self-center">
                        <ProbeRequestController token={
                            this.state.token }/></div>
                    <div className="col-lg-6 align-self-center">
                        <TrafficController token={ this.state.token }/></div>
                </div>
                <div className="row top-bottom-buffer">
                    <StatusController token={ this.state.token }/>
                </div>
            </div>
        );
    }
}

class Controller extends Component{
    constructor(props) {
        super(props);
        this.state = {
            token: 0,
            logged_in: false,
            entered_pin: ''
        };
    }

    onChange = (input) => {
        this.setState({ entered_pin: input });
    };

    onKeyPress = (button) => {
        if (button === '{enter}') {
            const url = urljoin(config.url, 'access/verify/');
            axios.post(url, { pin: this.state.entered_pin }).then(
                res => {
                    this.setState({
                        logged_in: true,
                        token: res.data.token
                    });
                }
            ).catch(
                err => {
                    this.setState({ errorMsg: err.response.data.error });
                }
            );
        }
    };

    render() {
        require('bootstrap/dist/css/bootstrap.css');
        require('../css/controller.css');
        if (!this.state.logged_in){
            return (
                <div className="container">
                    <div className="row top-bottom-buffer">
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text"
                                      id="inputGroup-pincode">6-digit PIN
                                </span>
                            </div>
                            <input type="text" className="form-control"
                                   aria-label="PIN Code"
                                   aria-describedby="inputGroup-pincode"
                                   value={ this.state.entered_pin }
                                   readOnly={ true }
                            />
                        </div>
                    </div>
                    <div className="row top-bottom-buffer">
                        <Keyboard
                            mergeDisplay={ true }
                            display={ {
                                '{enter}': 'submit'
                            } }
                            onChange={ input => this.onChange(input) }
                            onKeyPress={ button => this.onKeyPress(button) }
                            layout={ {
                                'default': [
                                    '1 2 3', '4 5 6', '7 8 9',
                                    '{bksp} 0 {enter}' ]
                            } }
                            theme={
                                'hg-theme-default ' +
                                'hg-layout-numeric numeric-theme' }
                            autoUseTouchEvents={ true }
                            inputPattern={ /^\d+$/ }
                            maxLength={ 6 }
                        />
                    </div>
                    <div className="row top-bottom-buffer">
                        {this.state.errorMsg ?
                            <div
                                className="col alert alert-danger" role="alert">
                                {this.state.errorMsg}
                            </div> : ''
                        }
                    </div>
                </div>);
        } else {
            return (
                <ControllerOperator token={ this.state.token }/>
            );
        }
    }
}

export default Controller;