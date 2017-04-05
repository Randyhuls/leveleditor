window.onload = function() {
    // Define tileSize
    const tileSize = 64;

    // Define map
    const map = new Map(256, tileSize);

    // Add sources to texture sheets here:
    const textureSheets = ['images/texture_sheet_01.png', 'images/texture_sheet_02.png'];

    // Define texture picker
    const textures = new TexturePicker(map, textureSheets);

    map.generateTiles();
    textures.generateTextures();

    // Events - TODO: needs to be properly moved to the editor and work regardless of the instance
    t.addEventListener('click', textures.selectTexture);
    c.addEventListener('mousedown', function() { painting = true; });
    c.addEventListener('mouseup', function() { painting = false; });
    c.addEventListener('mousemove', textures.paint);
};