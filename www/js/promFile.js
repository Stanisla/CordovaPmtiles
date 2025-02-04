// Variables for debugging
var fileSys;
var fileEntry;
var fileData;
var fileWrite;
var corDir;
function deviceIsReady() {
    // Cordova is now initialized. Have fun!    
    var corPlatform=device.platform;
    return new Promise(async function (resolve, reject) {
        if (corPlatform != "Android") {
            console.log("platform not android", corPlatform)
            fileSys = await createBrowserFileSys(LocalFileSystem.PERSISTENT)
            fileSys=fileSys.root
        } else {
            console.log("platform android")
            fileSys = await createAndroidFileSys(cordova.file.externalDataDirectory)
        }        
        resolve()
    }).then(async function (){
        fileEntry= await getFileEntry(fileSys, "firenze.pmtiles", true)
    }).then(async function(){
        fileData=await getData("./data/firenze.pmtiles")
    }).then(async function(){        
        fileWrite=await writeFile(fileEntry,fileData)
        return fileEntry
    })
   
}
function createBrowserFileSys(fileDirectory){
    return new Promise(function(resolve,reject){
        // Get a fileSystem (folder)
        window.requestFileSystem(fileDirectory, 0, function (dirEntry) {
            resolve(dirEntry)
        });
    })
}
function createAndroidFileSys(fileDirectory){
    /** ANDROID
    * For accessing files, replace com.stanis.map with your package name
    * cordova.file.externalApplicationStorageDirectory => file:///storage/emulated/0/Android/data/com.stanis.map/firenze.pmtiles
    * cordova.file.externalCacheDirectory => file:///storage/emulated/0/Android/data/com.stanis.map/cache/firenze.pmtiles
    * cordova.file.externalDataDirectory => file:///storage/emulated/0/Android/data/com.stanis.map/files/firenze.pmtiles
    */
    return new Promise(function (resolve, reject) {
        //window.resolveLocalFileSystemURL(cordova.file.applicationStorageDirectory, function (dirEntry) {            
        window.resolveLocalFileSystemURL(fileDirectory, function (dirEntry) {            
            fileSys=dirEntry
            resolve(dirEntry)
        })
     })
}
function getFileEntry(fileDir,fileName,fileCreate){    
    return new Promise(function (resolve, reject) {
        fileDir.getFile(fileName, { create: fileCreate, exclusive: false }, function (fileEntry) {
            //console.log("fileEntry is file?" + fileEntry.isFile.toString());
            resolve(fileEntry)
        })
    })
}
function getData(url) {    
    return new Promise(function(resolve,reject){
        const fetchProm=fetch(url)       
        .then(function(res){
            if (!res.ok) {
                throw new Error(`Response status: ${response.status}`);
            } 
            return res.blob()
        }).then(function(blob){
            //console.log("got Data blob")
            resolve(blob)
        })
    })
  }
function writeFile(fileEntry, dataObj, isAppend) {
    return new Promise(function(resolve,reject){
        // Create a FileWriter object for our FileEntry (hola.txt).
        fileEntry.createWriter(function (fileWriter) {
            fileWriter.write(dataObj);
            fileWriter.onwriteend = function () {
                resolve(dataObj)            
            };
            fileWriter.onerror = function (e) {
                console.log("Failed file write: " + e.toString());
            };        
        });
    })
}
//For testing
function readFile(fileEntry) {
  return new Promise(function(resolve,reject){
    fileEntry.file(function (file) {
        var reader = new FileReader();
        reader.onloadend = function() {            
            console.log("Readed"+ this.result+" from " +fileEntry.fullPath);
            resolve(this.result)
        };
        reader.readAsArrayBuffer(file)

    }, (er)=>{console.log(er)});
  })
}