window.onload = function() {
    var c = document.getElementById('canvas');
    var ctx = c.getContext('2d');

    const Map = function(nrOfTiles, tileSize, nrOfTilesX, nrOfTilesY) {
        var xPos = 0;
        var yPos = 0;
        var row = 0;

        this.tileSize = tileSize;
        this.nrOfTilesX = nrOfTilesX;
        this.nrOfTilesY = nrOfTilesY;

        this.generateTiles = function() {
            for (var i = 0; i < nrOfTiles; i++) {
                if (this.nrOfTilesX) {
                    xPos = 0; yPos += this.tileSize;
                }

                // Draw tile
                ctx.fillStyle = 'red';
                ctx.fillRect(xPos, yPos, this.tileSize, this.tileSize);

                xPos += this.tileSize;
            }
            console.log('Drew [ ' + i + ' ] tiles');
        }
    }

    const map = new Map(32, 64);
    map.generateTiles()
};