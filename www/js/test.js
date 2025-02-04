function writeTest(fileEntry, dataObj) {
    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function (fileWriter) {

        fileWriter.onwriteend = function () {
            console.log("Successful file write...");
            readTest(fileEntry);
        };

        fileWriter.onerror = function (e) {
            console.log("Failed file write: " + e.toString());
        };

        // If data object is not passed in,
        // create a new Blob instead.
        if (!dataObj) {
            dataObj = new Blob(["Content if there's nothing!"], { type: 'text/plain' });
        }

        fileWriter.write(dataObj);
    });
}

function readTest(fileEntry) {
    console.log("reading", fileEntry)

    fileEntry.file(function (file) {
        var reader = new FileReader();

        reader.onloadend = function () {
            console.log("Successful file read: " + this.result + " from " + fileEntry.nativeURL);
            //displayFileData(fileEntry.fullPath + ": " + this.result);
        };

        reader.readAsText(file);

    });
}

function corTest(urlCor,texto) {
    /**Browser
     * cordova.file.dataDirectory cordova.file.cacheDirectory
     * Android
     * cordova.file.applicationDirectory => Android/data/user/0/com.stanis.map/hola.txt 
     * cordova.file.cacheDirectory       => Android/data/user/0/com.stanis.map/cache/hola.txt
     * cordova.file.dataDirectory        => Android/data/user/0/com.stanis.map/files/hola.txt
     * For accessing files,replace com.stanis.map with your package name
     * cordova.file.externalApplicationStorageDirectory => file:///storage/emulated/0/Android/data/com.stanis.map/hola.txt
     * cordova.file.externalCacheDirectory =>  file:///storage/emulated/0/Android/data/com.stanis.map/cache/hola.txt
     * cordova.file.externalDataDirectory => file:///storage/emulated/0/Android/data/com.stanis.map/files/hola.txt
     */
    var fileName = "hola.txt"
    window.resolveLocalFileSystemURL(urlCor, function (rootDirEntry) {
        //rootDirEntry.getDirectory(fileDir, { create: true }, function (dirEntry) {
        const fileCreate = true;
        rootDirEntry.getFile(fileName, { create: fileCreate, exclusive: false }, function (fileEntry) {
            //dirEntry.getFile("fileName.txt", { create: true }, function (fileEntry) {
            console.log("prueba")
            //const isAppend=true
            writeTest(fileEntry, texto);
            // Success
        });
    });
}