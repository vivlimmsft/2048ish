import { Actor, CollisionType, Color, Input, vec } from 'excalibur';
import { Resources } from '../../resources';
import { Game } from '../../index';

export class Tile extends Actor {
  private tileValue : number;
  private speed : number = 20;
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


  public update(engine, delta) {
    if (
      engine.input.keyboard.isHeld(Input.Keys.W) ||
      engine.input.keyboard.isHeld(Input.Keys.Up)
    ) {
      this.accelerate(0, this.speed * -1);
    }
    if (
      engine.input.keyboard.isHeld(Input.Keys.S) ||
      engine.input.keyboard.isHeld(Input.Keys.Down)
    ) {
      this.accelerate(0, this.speed * +1);
    }
    if (
      engine.input.keyboard.isHeld(Input.Keys.A) ||
      engine.input.keyboard.isHeld(Input.Keys.Left)
    ) {
      this.accelerate(this.speed * -1, 0);
    }

    if (
      engine.input.keyboard.isHeld(Input.Keys.D) ||
      engine.input.keyboard.isHeld(Input.Keys.Right)
    ) {
      this.accelerate(this.speed, 0);
    }
    super.update(engine, delta);
  }

  private accelerate(x: number, y: number){
    this.vel.setTo(this.vel.x + x, this.vel.y + y);
  }
}
