var fs = require('fs')
var request = require('request')
var sharp = require('sharp')
var joinImages = require('join-images')

var download = function (uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};


const getMergeImage = function (home, away,callback) {
    download(home.imageURL, `images/${home.alias}.png`, function () {
        console.log('done')
        download(away.imageURL, `images/${away.alias}.png`,async function () {
            console.log('done')
            let image1 = sharp(`images/${home.alias}.png`)
            let image2 = sharp(`images/${away.alias}.png`)
            let imageData1 = await image1.metadata()
            let imageData2 = await image2.metadata()
            if(imageData1.width > imageData2.width){
                sharp(`images/${away.alias}.png`).resize(imageData1.width,imageData1.height).toFile(`images/${away.alias}1.png`).then(()=>{
                    joinImages.joinImages([`images/${home.alias}.png`, `images/${away.alias}1.png`], { direction: 'horizontal',align:'center' }).then(img => {
                        img.toFile(`images/${home.alias}${away.alias}.png`).then(()=>{
                            callback()
                        })
                    })
                })
            }
            else{
                sharp(`images/${home.alias}.png`).resize(imageData2.width,imageData2.height).toFile(`images/${home.alias}1.png`).then(()=>{
                    joinImages.joinImages([`images/${home.alias}1.png`, `images/${away.alias}.png`], { direction: 'horizontal',align:'center' }).then(img => {
                        img.toFile(`images/${home.alias}${away.alias}.png`).then(()=>{
                            callback()
                        })
                    })
                })
                
            }
            
        })
    
    })
    
}

const removeImages = async function (home, away) {
    fs.unlink(`${home.alias}${away.alias}.png`, function () {
        fs.unlink(`images/${home.alias}.png`, function () {
            fs.unlink(`images/${away.alias}.png`, function () {
                console.log('done')
            })
        })
    })
}

module.exports = {getMergeImage,removeImages}
