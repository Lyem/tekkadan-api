var Jimp = require('jimp');
import { unlink, rmdir } from 'fs';


export class Image {
    async saveAndConverterImages(file: Buffer, name: string, folder: string):Promise<Boolean>{
        try {
            Jimp.read(file).then(img =>{
                return img.quality(80).write(`uploads/${folder}/${name}.webp`);
            })
        } catch (error) {
            return false
        }
        return true
    }

    async deleteFile(file: string):Promise<Boolean>{
        try {
            unlink(`uploads/${file}`,()=>{});
        } catch (error) {
            console.log(error)
            return false
        }
        return true
    }

    async deleteFolder(file: string):Promise<Boolean>{
        rmdir(`uploads/${file}`, { recursive: true }, (err) => {
            if (err) {
                throw err;
            }
        
            console.log(`uploads/${file} is deleted!`);
        });
        return true
    }
}