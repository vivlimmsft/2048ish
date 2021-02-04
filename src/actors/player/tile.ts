import { Actor, CollisionType, Color, Input, Label, vec, Vector } from 'excalibur';
import { Resources } from '../../resources';
import { Game } from '../../index';

export class Tile extends Actor {
  private tileValue : number;
  private speed : number = 20;
  private mergeAlignmentDistance = 8;
  private label : Label;
  private isMerged : boolean;
  private mergedWith : Tile | undefined;
  private mergeProgressCountdown : number;
  private mergeOriginalPosition : Vector;
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
        if (tileA.tileValue == tileB.tileValue){
          // these tiles have the same value, and are candidates for merging.

          if (tileA.isMerged || tileB.isMerged){
            // don't merge them-- one or both of them are already merged with another tile.
            return;
          }

          if (Math.abs(tileA.pos.x - tileB.pos.x) < this.mergeAlignmentDistance || Math.abs(tileA.pos.y - tileB.pos.y) < this.mergeAlignmentDistance)
          {
            tileA.tileValue += tileB.tileValue;
            tileB.tileValue = tileA.tileValue;
            //tileB.kill();
            tileB.body.collider.type = CollisionType.PreventCollision;
            tileB.isMerged = true;
            tileB.mergedWith = tileA;
            tileB.mergeProgressCountdown = 100;
            tileB.mergeOriginalPosition = tileB.pos.clone();
          }
        }
      }
    })
  }


  onInitialize() {
    this.addDrawing(Resources.Tile);
  }

  public draw(engine, delta){
    if (this.isKilled()){
      return;
    }
    super.draw(engine, delta);
    this.label.draw(engine, delta);
  }


  public update(engine, delta) {
    if (this.isKilled()){
      return;
    }

    if (this.isMerged){ // special behavior for merging tiles-- ignore keyboard input, move toward the center of the merge target and disappear when arriving there
      if (this.mergeProgressCountdown <= 0){
        this.kill(); // merge is complete, remove the tile.
        return;
      }

      const scale = this.mergeProgressCountdown / 100.0;
      this.mergeProgressCountdown -= 10;
      let dx = (this.mergeOriginalPosition.x - this.mergedWith.pos.x) * scale;
      let dy = (this.mergeOriginalPosition.y - this.mergedWith.pos.y) * scale;
      let newX = this.mergedWith.pos.x + dx;
      let newY = this.mergedWith.pos.y + dy;
      this.pos.setTo(newX, newY);
    }
    else {
      if (
        engine.input.keyboard.isHeld(Input.Keys.W) ||
        engine.input.keyboard.isHeld(Input.Keys.Up)
      ) {
        this.accelerate(0, -1);
      }
      if (
        engine.input.keyboard.isHeld(Input.Keys.S) ||
        engine.input.keyboard.isHeld(Input.Keys.Down)
      ) {
        this.accelerate(0, 1);
      }
      if (
        engine.input.keyboard.isHeld(Input.Keys.A) ||
        engine.input.keyboard.isHeld(Input.Keys.Left)
      ) {
        this.accelerate(-1, 0);
      }

      if (
        engine.input.keyboard.isHeld(Input.Keys.D) ||
        engine.input.keyboard.isHeld(Input.Keys.Right)
      ) {
        this.accelerate(1, 0);
      }
    }

    this.label.pos.x = this.pos.x - 4;
    this.label.pos.y = this.pos.y + 4;
    this.label.text = this.tileValue.toString();
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
  }

  public accelerate(x: number, y: number){
    this.vel.setTo(this.vel.x + (this.speed * x), this.vel.y + (this.speed * y));
  }
}
