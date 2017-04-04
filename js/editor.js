const c = document.getElementById('canvas');
const ctx = c.getContext('2d');

c.width = 1024;
c.height = 1024;

// Add sources to texture sheets here:
const textureSheets = ['images/texture_sheet_01.png', 'images/texture_sheet_02.png'];

const t = document.getElementById('texturePicker');
const tCtx = t.getContext('2d');

const tileSize = 64;

t.width = 256;
t.height = tileSize;

var painting = false;

const Map = function(mapSize, tileSize) {
    var xPos = 0;
    var yPos = 0;

    this.tileSize = tileSize;

    this.generateTiles = function() {
        for (var i = 0; i < mapSize; i++) {
            if (xPos + this.tileSize > c.width) {
                xPos = 0; yPos += this.tileSize;
            }

            // Draw tile
            ctx.fillStyle = 'white';
            ctx.fillRect(xPos, yPos, this.tileSize, this.tileSize);
            ctx.strokStyle = 'white';
            ctx.strokeRect(xPos, yPos, this.tileSize, this.tileSize);

            xPos += this.tileSize;
        }
        console.log('Drew [ ' + i + ' ] tiles');
    };
};

const TexturePicker = function(map, sheets) {
    var self = this;

    var xPos = 0;
    var yPos = 0;

    var tileSize = map.tileSize;
    var storedTex;

    this.createTextureSheet = function(src, callback) {
        var sheet = new Image();
        sheet.src = src;

        sheet.onload = function() {
            var w = sheet.width;
            var h = sheet.height;

            var nrOfTiles = (w/tileSize) * (h/tileSize);

            callback(sheet, nrOfTiles)
        };
    };

    // Resizes the texture canvas if the number of textures don't fit
    this.resizeCanvas = function() {
        var oldCanvas = tCtx.getImageData(0, 0, t.width, t.height);
        t.height = yPos + tileSize;
        tCtx.putImageData(oldCanvas, 0, 0);
    };

    this.generateTextures = function() {
        for (var i = 0; i < sheets.length; i++) {

            this.createTextureSheet(sheets[i], function(sheet, nrOfTiles) {
                var xSheetPos = 0;
                var ySheetPos = 0;

                for (var j = 0; j < nrOfTiles; j++) {
                    // Increase height of texture canvas if the nr of tiles don't fit
                    if (yPos + tileSize > t.height) {
                        self.resizeCanvas();
                        xPos = 0;
                    }

                    // If the tiles don't fit the width of the texture canvas, draw on the next line
                    if (xPos + tileSize > t.width) {
                        xPos = 0; yPos += tileSize;
                    }

                    // If the all tiles on image sheet were drawn horizontally, take tiles from the next line
                    if (xSheetPos + tileSize > sheet.width) {
                        xSheetPos = 0; ySheetPos += tileSize;
                    }

                    tCtx.drawImage(sheet, xSheetPos, ySheetPos, tileSize, tileSize, xPos, yPos, tileSize, tileSize);
                    xSheetPos += tileSize;
                    xPos += tileSize;
                }
                console.log('Drew [ ' + nrOfTiles + ' ] textures');
            });

        }
        console.log('Drew [ ' + i + ' ] texture-tiles');
    };

    this.selectTexture = function(e) {
        var mouseX = e.layerX;
        var mouseY = e.layerY;

        var gridX = 0;
        var gridY = 0;

        var selectX, selectY;

        for (mouseX; mouseX > gridX; gridX+=tileSize) selectX = gridX;
        for (mouseY; mouseY > gridY; gridY+=tileSize) selectY = gridY;

        console.log(selectX, selectY);

        storedTex = tCtx.getImageData(selectX, selectY, tileSize, tileSize);

    };

    this.paint = function(e) {
        if (painting && storedTex) {
            var mouseX = e.layerX;
            var mouseY = e.layerY;

            var gridX = 0;
            var gridY = 0;

            var selectX, selectY;

            for (mouseX; mouseX > gridX; gridX+=tileSize) selectX = gridX;
            for (mouseY; mouseY > gridY; gridY+=tileSize) selectY = gridY;

            console.log(selectX, selectY);

            ctx.putImageData(storedTex, selectX, selectY);
        }
    };
};
