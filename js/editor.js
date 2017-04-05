const c = document.getElementById('canvas');
const ctx = c.getContext('2d');

c.width = 1024;
c.height = 1024;

const t = document.getElementById('texturePicker');
const tCtx = t.getContext('2d');

var globalTileSize = globalTileSize || 64;
var painting = false;

const Map = function(mapSize, tileSize) {
    globalTileSize = tileSize;

    var xPos = 0;
    var yPos = 0;

    this.tileSize = tileSize;

    this.generateTiles = function() {
        for (var i = 0; i < mapSize; i++) {
            if (xPos + this.tileSize > c.width) {
                xPos = 0; yPos += this.tileSize;
            }

            // Draw empty tile
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

    t.width = globalTileSize * 3;

    var xPos = 0;
    var yPos = 0;

    var tileSize = map.tileSize;
    var storedTex = { data: null, x: null, y: null };

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

        var selectX, selectY;

        for (var gridX = 0; mouseX > gridX; gridX+=tileSize) selectX = gridX;
        for (var gridY = 0; mouseY > gridY; gridY+=tileSize) selectY = gridY;

        console.log(selectX, selectY);

        // Check if tile has already been selected, then redraw the previous selection
        if (storedTex.data) tCtx.putImageData(storedTex.data, storedTex.x, storedTex.y);

        // Store the data of the texture and it's position
        storedTex.data = tCtx.getImageData(selectX, selectY, tileSize, tileSize);
        storedTex.x = selectX;
        storedTex.y = selectY;

        // Paint a selection border around the currently selected tile
        tCtx.strokeStyle = 'black';
        tCtx.strokeRect(selectX + 1, selectY + 1, tileSize - 2, tileSize - 2);
    };

    this.paint = function(e) {
        if (painting && storedTex.data) {
            var mouseX = e.layerX;
            var mouseY = e.layerY;

            var selectX, selectY;

            for (var gridX = 0; mouseX > gridX; gridX+=tileSize) selectX = gridX;
            for (var gridY = 0; mouseY > gridY; gridY+=tileSize) selectY = gridY;

            console.log(selectX, selectY);

            ctx.putImageData(storedTex.data, selectX, selectY);
        }
    };
};
