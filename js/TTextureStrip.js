function TTexture(stageID, href, x, y, width, height, numTilesX, numTilesY) {
  this.StageID = stageID;
  this.Href = href;
  this.X = x;
  this.Y = y;
  this.Width = width;
  this.Height = height;
  this.numTilesX = numTilesX;
  this.numTilesY = numTilesY;
}

function TTextureStrip(owner, parent, banshee) {
  var m_href = "";
  var m_numTilesX = 0;
  var m_numTilesY = 0;
  var m_numStages = 0;
  var m_startStageID = 0;

  this.ReadProperty = function(name, value) {
    switch (name) {
      case 'xlink:href':
        m_href = value;
        break;
      case 'fccs:numTilesX':
        m_numTilesX = bansheeTranslateValue(value, m_numTilesX);
        break;
      case 'fccs:numTilesY':
        m_numTilesY = bansheeTranslateValue(value, m_numTilesY);
        break;
      case 'fccs:numStages':
        m_numStages = bansheeTranslateValue(value, m_numStages);
        break;
      case 'fccs:startStageID':
        m_startStageID = bansheeTranslateValue(value, m_startStageID);
        break;
      default:
        throw "Unknown attribute name '" + name + "'";
        break;
    }
  };

  this.GetTextures = function() {
    var textures = [];
    for(var i=0; i<m_numStages; i++) {

      var textureWidth = this.w / m_numTilesX;
      var textureHeight = this.h / m_numTilesY;
      var posX = (i%m_numTilesX) * textureWidth;
      var posY = Math.floor(i/m_numTilesX) * textureHeight;

      var texture = new TTexture(i, m_href, posX, posY, textureWidth, textureHeight, m_numTilesX, m_numTilesY);
      textures.push(texture);
    }
    return textures;
  };
}