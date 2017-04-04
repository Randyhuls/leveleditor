window.onload = function() {
    // Define map and textures
    const map = new Map(256, tileSize);
    const textures = new TexturePicker(map, textureSheets);

    map.generateTiles();
    textures.generateTextures();

    // Events
    t.addEventListener('click', textures.selectTexture);
    c.addEventListener('mousedown', function() { painting = true; });
    c.addEventListener('mouseup', function() { painting = false; });
    c.addEventListener('mousemove', textures.paint);
};