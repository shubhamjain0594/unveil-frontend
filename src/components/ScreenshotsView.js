/* eslint react/prop-types: 0 */
import React from 'react';
import axios from 'axios';
import config from '../config';
import CPGLogo from './CPGLogo';
import Gallery from 'react-photo-gallery';
import PropTypes from 'prop-types';
import { trimURL } from './Utils';

const urljoin = require('url-join');
const fake_data = require('../data/images.json');


const ShowImage = ({
    _unused__index,
    _unused__onClick,
    photo,
    _unused__margin,
    _unused__direction,
    _unused__top,
    _unused__left
}) => {
    const maxLengthURL = 120;
    return (
        <div className={ 'Screenshot' }>
            <img src={ photo.src } alt={ photo.alt } key={ photo.key }/>
            <div className="caption">
                {trimURL(photo.alt, maxLengthURL)}
            </div>
        </div>
    );
};

class ScreenshotsViewHelper extends React.Component {

    constructor(props){
        super(props);
        this.props = props;
        this.state = { photos: props.data };
        this.numPhotosShown = 4;
    }

    static propTypes = {
        data: PropTypes.array
    };

    static defaultProps = {
        data: []
    };

    selectPhotos() {
        if (this.state.photos.length > this.numPhotosShown) {
            this.setState({ photos: this.state.photos.slice(
                this.numPhotosShown, this.state.photos.length).concat(
                    this.state.photos.slice(0, this.numPhotosShown)) });
        }
    }

    componentDidMount() {
        this.selectPhotosInterval = setInterval(
            this.selectPhotos.bind(this), 7000);
    }

    componentWillUnmount() {
        clearInterval(this.selectPhotosInterval);
    }

    render() {
        const photos = [];
        for (let index = 0; index < this.state.photos.length; index++){
            const datum = this.state.photos[ index ];
            if (index < this.numPhotosShown){
                photos.push({
                    src: `data:image/png;base64, ${ datum[ 0 ] }`,
                    width: 16,
                    height: 9,
                    alt: datum[ 1 ],
                    key: index.toString()
                });
            }
        }
        const setupStyle = {
            backgroundImage: 'url("/img/news_background.svg")',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            width: '100vw',
            height: '100vh'
        };

        return (
            <div style={ setupStyle }>
                <div className="ScreenshotsContainer">
                    <Gallery photos={ photos } margin={ 0 }
                             targetRowHeight={ 1080 } columns={ 2 }
                             renderImage={ ShowImage }/>
                </div>
            </div>
        );
    }
}

class ScreenshotsView extends React.Component {
    constructor(props){
        super(props);
        this.props = props;
        this.state = { data: [], session: config.disabledSessionIndicator };
    }

    static defaultProps = {
        start: 0
    };

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
                            config.url, 'ap/screenshots/', this.state.session);
                        axios.get(fetch_data_url).then(
                            res => {
                                this.setState({ data: res.data.screenshots });
                            }, _unused__err => {
                                // console.log(_unused__err);
                            }
                        );
                    } else if (this.state.session === config.fakeSessionID) {
                        this.setState({ data: fake_data });
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
        require('bootstrap/dist/css/bootstrap.min.css');
        if (this.state.session === 0 || this.state.data.length === 0){
            return <CPGLogo/>;
        } else {
            return <ScreenshotsViewHelper data={ this.state.data }/>;
        }

    }
}

export default ScreenshotsView;