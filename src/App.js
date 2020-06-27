import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import config from './config';
import loadable from '@loadable/component';

const DataView = loadable(() => import('./components/DataView'));
const MapView = loadable(() => import('./components/MapView'));
const ScreenshotView = loadable(() => import('./components/ScreenshotsView'));
const SetupView = loadable(() => import('./components/SetupView'));
const Controller = loadable(() => import('./components/Controller'));


/* eslint-disable class-methods-use-this */
class App extends Component {

    render() {
        return (
            <BrowserRouter>
                <div>
                    {/* routing for the Terminal View, C.html*/}
                    <Route exact={true} path='/data1' render={() => (
                        <div className="App">
                            <div className="ContainerRow">
                                <DataView start={0}/>
                            </div>
                        </div>)}/>
                    {/* routing for the Terminal View, D.html*/}
                    <Route exact={true} path='/data2' render={() => (
                        <div className="App">
                            <div className="ContainerRow">
                                <DataView start={config.maxDevicesPerScreen}/>
                            </div>
                        </div>)}/>
                    {/* routing for the Map View, B.html*/}
                    <Route exact={true} path='/probe' render={() => (
                        <div className="App">
                            <div className="ContainerRow">
                                <MapView/>
                            </div>
                        </div>)}/>
                    {/* routing for the First Page, A.html*/}
                    <Route exact={true} path='/setup' render={() => (
                        <div className="ContainerRow">
                            <SetupView/>
                        </div>)}/>
                    <Route exact={true} path='/screenshots' render={() => (
                        <div className="ContainerRow">
                            <ScreenshotView/>
                        </div>)}/>
                    <Route exact={true} path='/control' render={() => (
                        <div className="ContainerRow">
                            <Controller/>
                        </div>)}/>
                </div>
            </BrowserRouter>);
    }
}

export default App;
