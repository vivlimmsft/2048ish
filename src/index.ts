import { Engine, Loader, DisplayMode, Vector, Input } from 'excalibur';
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

  constructor() {
    super({ displayMode: DisplayMode.FullScreen });
  }

  public start() {

    this.tiles = [];
    // Create new scene with a player
    this.levelOne = new LevelOne(this);

    for (let i = 0; i < 10; i++){
      this.addTileOnGrid(i,i,i);
      
    }

    game.add('levelOne', this.levelOne);

    // Automatically load all default resources
    const loader = new Loader(Object.values(Resources));

    return super.start(loader);
  }

  private addTileOnGrid(value: number, gridX: number, gridY: number){
      const tile = new Tile(game, value, gridX*32 + 16, gridY*32 + 16);
      this.levelOne.add(tile);
      this.tiles.push(tile);
  }
}

const game = new Game();
game.start().then(() => {
  game.goToScene('levelOne');
});
