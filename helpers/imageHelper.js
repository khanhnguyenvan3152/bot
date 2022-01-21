var fs = require('fs'),
var joinImages = require('join-images')

var download = function (uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};


const getMergeImage = function (home, away) {
    download(home.imageURL, `images/${home.alias}.png`, function () {
        console.log('done')
    })
    download(away.imageURL, `images/${away.alias}.png`, function () {
        console.log('done')
        joinImages.joinImages([`images/${home.alias}.png`, `images/${away.alias}.png`], { direction: 'horizontal' }).then(img => {
            img.toFile(`${home.alias}${away.alias}.png`)
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
