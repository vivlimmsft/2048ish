import { Engine, Loader, DisplayMode, Vector, Input, SpriteFont, Timer } from 'excalibur';
import { LevelOne } from './scenes/level-one/level-one';
import { Player } from './actors/player/player';
import { Tile } from './actors/player/tile';
import { Resources } from './resources';

/**
 * Managed game class
 */
export class Game extends Engine {
  private levelOne: LevelOne;
  private tiles: Tile[];
  public font: SpriteFont;
  public newTileTimer: Timer;

  constructor() {
    super({ displayMode: DisplayMode.FullScreen });
  }

  public start() {

    this.tiles = [];
    // Create new scene with a player
    this.levelOne = new LevelOne(this);

    for (let i = 0; i < 4; i++){
      this.addTileOnGrid();
    }

    this.font = new SpriteFont({
      image: Resources.SpriteFont,
      alphabet: '0123456789abcdefghijklmnopqrstuvwxyz,!\'&."?- ',
      caseInsensitive: true,
      columns: 16,
      rows: 3,
      spWidth: 16,
      spHeight: 16
    });

    this.newTileTimer = new Timer({fcn: () => {
      console.log("new tile");
      //this.addTileOnGrid();
    },
    interval: 5, repeats: true});

    this.screen.resolution = {width: 256, height: 256};
    this.add('levelOne', this.levelOne);
    this.add(this.newTileTimer);

    this.input.keyboard.on('release', (evt) => {
      if (evt.key == Input.Keys.Space) {
        this.addTileOnGrid();
      }
    })

    // Automatically load all default resources
    const loader = new Loader(Object.values(Resources));

    return super.start(loader);
  }

  private addTileOnGrid(){
      let x = Math.random() * this.canvasWidth;
      let y = Math.random() * this.canvasHeight;
      let value = Math.pow(2, Math.floor(Math.random() * 3));
      const tile = new Tile(game, value, x, y);
      this.levelOne.add(tile);
      this.tiles.push(tile);
  }
}
const game = new Game();
game.start().then(() => {
  game.goToScene('levelOne');
});
