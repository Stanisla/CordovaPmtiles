//Must wait deviceIsReady
document.addEventListener('deviceready', isReady, false);

async function isReady() {
    // Cordova is now initialized. Have fun!
    // Once device is ready, js/showMap.js
    //showMap()
    // js/promFile.js => After writing to file system,return fileEntry
    var fileLocal = await deviceIsReady()
    // js/pmTilesServ.js => Create a PMTilesService.Handles request params
    pmTileServ = new PmTilesService(fileLocal)
    // Add protocol In styles/firezeCor.json define tiles as "cordova://filename.pmtiles/{z}/{x}/{y}"
    maplibregl.addProtocol("cordova", async (params, _abortController) => {
        const data = await pmTileServ.getTile(params.url)
        return { data };
    });
    map = new maplibregl.Map({
        container: 'map',
        style: "./styles/firenzeCor.json",
        maxZoom: 24,
        maxPitch: 85,
        center: [11.16, 43.77],
        zoom: 12,
        maplibreLogo: false,
        hash: true // <- Enable hash routing
    });
}