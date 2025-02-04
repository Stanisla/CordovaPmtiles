class CorSource{ // implements pmtiles.Source {

    constructor(file) {
        this.file=file
     }

    getBytes(offset, length) {
        const slice = this.file.slice(offset, offset + length);
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const arrayBuffer = event.target.result;
                resolve({ data: arrayBuffer });
            };
            reader.onerror = () => {
                reject(new Error("Unable to read file: " + this.file.name));
            }
            reader.readAsArrayBuffer(slice);
        })
    }

    getKey() { return this.file.name }
}

class PmTilesService {
    
    constructor(file){
        //console.log("PmTilesService constructor")
        this.fileSource=file
        //this.sourcesCache = new Map([[file.name, CorSource]]);
        this.sourcesCache = new Map();
    }

    async getSource(fileName) {
        if(this.sourcesCache.has(fileName)) {
            //console.log('has ',fileName)
            return this.sourcesCache.get(fileName);
        }
        return new Promise((resolve, reject) => {
            this.fileSource.file((fileResult) => {
                const source = new CorSource(fileResult);
                this.sourcesCache.set(fileName, source);
                resolve(source);
            }, reject);
        });
    }

    /**
     * Get's a tile from the stored pmtiles file
     * @param url - should be something like custom://filename-without-pmtiles-extention/{z}/{x}/{y}.png
     * @returns 
     */
    async getTile(url) {
        //console.log('getTile' ,url)
        const splitUrl = url.split("/");
        const fileName = splitUrl[2] ;
        const z = +splitUrl[splitUrl.length - 3];
        const x = +splitUrl[splitUrl.length - 2];
        const y = +(splitUrl[splitUrl.length - 1].split(".")[0]);
        const source = await this.getSource(fileName);
        const pmTilesProvider = new pmtiles.PMTiles(source);        
        const response = await pmTilesProvider.getZxy(z, x, y);
        return response.data;
    }
}