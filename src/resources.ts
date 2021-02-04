import { Texture } from 'excalibur';
import sword from './images/sword.png';
import tile from './images/tile.png';
import spritefont from './images/SpriteFont.png';

/**
 * Default global resource dictionary. This gets loaded immediately
 * and holds available assets for the game.
 */
const Resources = {
    Sword: new Texture(sword),
    Tile: new Texture(tile),
    SpriteFont: new Texture(spritefont),
}

export { Resources }
