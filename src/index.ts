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

  private pointerIsDown: boolean = false;
  private lastKnownPointerPosition: Vector;

  constructor() {
    super({ displayMode: DisplayMode.FullScreen, width: 128, height: 128, suppressConsoleBootMessage: true, suppressPlayButton: true });
  }

  public start() {

    this.tiles = [];
    // Create new scene with a player
    this.levelOne = new LevelOne(this);

    for (let i = 0; i < 9; i++){
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
      this.addTileOnGrid();
    },
    interval: 1000, repeats: true});

    this.screen.resolution = {width: 256, height: 256};
    this.levelOne.add(this.newTileTimer);
    this.add('levelOne', this.levelOne);

    this.input.keyboard.on('release', (evt) => {
      if (evt.key == Input.Keys.Space) {
        this.addTileOnGrid();
      }
    });

    this.input.pointers.primary.on('down', (evt) => {
      this.pointerIsDown = true;
      this.lastKnownPointerPosition = evt.worldPos;
    });

    this.input.pointers.primary.on('up', (evt) => {
      this.pointerIsDown = false;
    });

    // Automatically load all default resources
    const loader = new Loader(Object.values(Resources));

    return super.start(loader);
  }

  public onPostUpdate(engine, delta){
    // If the pointer is holding down on an edge of the screen, accelerate tiles in that direction.

    if (this.pointerIsDown){
      let position = this.lastKnownPointerPosition;
      let worldBounds = this.getWorldBounds();
      let xTouchRegionWidth = worldBounds.width / 3;
      let yTouchRegionHeight = worldBounds.height / 3;

      let dx = 0;
      let dy = 0;

      if (position.x > xTouchRegionWidth * 2){
        // touching right side of screen
        dx = 1;
      }
      else if (position.x < xTouchRegionWidth){
        // touching left side of screen
        dx = -1;
      }

      if (position.y > yTouchRegionHeight * 2){
        // touching bottom of screen
        dy = 1;
      }
      else if (position.y < yTouchRegionHeight){
        dy = -1;
      }
      if (dx != 0 || dy != 0){
        for (let tile of this.tiles.filter(tile => !tile.isKilled())){
          tile.accelerate(dx, dy);
        }
      }
    }

  }

  private addTileOnGrid(){
    if (this.tiles.filter(tile => !tile.isKilled()).length > 64) {
      return; // max number of active tiles tiles
    }
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
