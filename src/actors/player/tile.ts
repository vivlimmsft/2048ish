import { Actor, CollisionType, Color, vec } from 'excalibur';
import { Resources } from '../../resources';
import { Game } from '../../index';

export class Tile extends Actor {
  private tileValue : number;
  constructor(game: Game, value: number, x: number, y: number) {
    super({
      pos: vec(x, y),
      width: 32,
      height: 32,
      color: new Color(255, 255, 255)
    });
    this.tileValue = value;
    this.body.collider.type = CollisionType.Active;

    this.on("postupdate", () => {
      if (this.pos.x < this.width / 2){
        this.vel.x = 0;
        this.pos.x = this.width / 2;
      }

      if (this.pos.x + this.width / 2 > game.drawWidth){
        this.vel.x = 0;
        this.pos.x = game.drawWidth - this.width / 2
      }

      if (this.pos.y < this.height / 2){
        this.vel.y = 0;
        this.pos.y = this.height / 2;
      }

      if (this.pos.y + this.height / 2 > game.drawHeight){
        this.vel.y = 0;
        
        this.pos.y = game.drawHeight - this.height / 2
      }
    });
  }


  onInitialize() {
    this.addDrawing(Resources.Tile);
  }
}
