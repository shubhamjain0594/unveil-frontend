export function isGDO() {
    return window.innerWidth > 3000;
}

export function getResizeFactor() {
    return isGDO() ? 1 : 4;
}

export function trimURL(url, maxLengthHTTP) {
    const extender = url.length > maxLengthHTTP ? '...' : '';
    url = url.substring(0, maxLengthHTTP) + extender;
    return url;
}