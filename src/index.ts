import { Engine, Loader, DisplayMode, Vector } from 'excalibur';
import { LevelOne } from './scenes/level-one/level-one';
import { Player } from './actors/player/player';
import { Tile } from './actors/player/tile';
import { Resources } from './resources';

/**
 * Managed game class
 */
export class Game extends Engine {
  private player: Player;
  private levelOne: LevelOne;
  private tiles: Tile[];
  private lastPointerPosition: Vector | undefined;

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


    game.input.pointers.primary.on('move', function (evt) {
      if (game.lastPointerPosition != undefined){
        const scale = 2;
        let delta = evt.pos.clone().sub(game.lastPointerPosition);
          console.log(delta);
        for (var t of game.tiles){
          t.vel.setTo(t.vel.x + (delta.x * scale), t.vel.y + (scale * delta.y));
          //t.pos.x += delta.x;
          //t.pos.y += delta.y;
        }
      }
      game.lastPointerPosition = evt.pos;
    });
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
