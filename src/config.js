import { isGDO } from './components/Utils';
import runtimeConfig from './runtimeConfig';



const config = {
    url: runtimeConfig.url,
    probe_screen: 'B',
    ap_screen: 'C',
    setup_screen: 'A',
    updateTime: 1000,
    minZoom: isGDO() ? 9 : 5, // 9 for GDO, 5 for Desktop
    maxZoom: isGDO() ? 17 : 13, // 17 for GDO, 13 for Desktop
    // Maximum entries on information column of probe requests
    maxEntriesForAP: 10,
    // Maximum entries of manufacturers that should be shown
    maxEntriesForMan: 7,
    zoomInterval: 2,
    showTooltipAfter: isGDO() ? 14 : 10, // 14 for GDO, 10 for Desktop
    fakeSessionID: 'fake',
    maxDevicesPerScreen: isGDO() ? 3 : 4, // 3 for GDO, 4 for Desktop
    disabledSessionIndicator: 0,
    mainMapCenter: runtimeConfig.mainMapCenter,
    tooltipRadius: [50, 70, 75],
    tooltipUsersGroup: [4, 8],
    zoomIntervalTime: 1000
};

export default config;