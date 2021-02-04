import { Actor, CollisionType, Color, Input, Label, vec } from 'excalibur';
import { Resources } from '../../resources';
import { Game } from '../../index';

export class Tile extends Actor {
  private tileValue : number;
  private speed : number = 20;
  private label : Label;
  constructor(game: Game, value: number, x: number, y: number) {
    super({
      pos: vec(x, y),
      width: 32,
      height: 32,
      color: new Color(255, 255, 255)
    });
    this.tileValue = value;
    this.body.collider.type = CollisionType.Active;

    this.label = new Label("n", x, y);

    this.on('precollision', (event) => {
      if (event.actor.hasOwnProperty('tileValue') && event.other.hasOwnProperty('tileValue')){
        let tileA = event.actor as Tile;
        let tileB = event.other as Tile;
        console.log("tiles colliding");
        if (tileA.tileValue == tileB.tileValue){
          tileA.tileValue += tileB.tileValue;
          tileB.kill();
        console.log("same value; removing one tile");
        }
      }
    })
  }


  onInitialize() {
    this.addDrawing(Resources.Tile);
  }

  public draw(engine, delta){
    super.draw(engine, delta);
    this.label.draw(engine, delta);
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

  public onPostUpdate(engine, delta){
    if (this.pos.x < this.width / 2){
      this.vel.x = 0;
      this.pos.x = this.width / 2;
    }

    if (this.pos.x + this.width / 2 > engine.drawWidth){
      this.vel.x = 0;
      this.pos.x = engine.drawWidth - this.width / 2
    }

    if (this.pos.y < this.height / 2){
      this.vel.y = 0;
      this.pos.y = this.height / 2;
    }

    if (this.pos.y + this.height / 2 > engine.drawHeight){
      this.vel.y = 0;
      
      this.pos.y = engine.drawHeight - this.height / 2
    }
    super.onPostUpdate(engine, delta);

    this.label.pos.x = this.pos.x;
    this.label.pos.y = this.pos.y;
    this.label.text = this.tileValue.toString();
  }

  private accelerate(x: number, y: number){
    this.vel.setTo(this.vel.x + x, this.vel.y + y);
  }
}
