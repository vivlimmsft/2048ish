import { Actor, CollisionType, Color, Input, Label, SpriteSheet, vec, Vector } from 'excalibur';
import { Resources } from '../../resources';
import { Game } from '../../index';

export class Tile extends Actor {
  private tileValue : number;
  private speed : number = 20;
  private mergeAlignmentDistance = 8;
  private mergeMinimumVelocity = 10;
  private label : Label;
  private isMerged : boolean;
  private mergedWith : Tile | undefined;
  private mergeProgressCountdown : number;
  private mergeOriginalPosition : Vector;
  private spriteSheet : SpriteSheet;
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

          // Require a minimum alignment for the centers of the two tiles before considering merging them.
          if (Math.abs(tileA.pos.x - tileB.pos.x) < this.mergeAlignmentDistance || Math.abs(tileA.pos.y - tileB.pos.y) < this.mergeAlignmentDistance)
          {
            // Require either one of the tiles to be moving towards the other.
            if (
              (Math.abs(tileA.body.vel.x) > Math.abs(tileA.body.vel.y) && // tile A is moving horizontally more than it is vertically
                tileA.body.vel.x > this.mergeMinimumVelocity && tileB.pos.x > tileA.pos.x || // tile A moving right and tile B is to the right of tile A
                tileA.body.vel.x < -1 * this.mergeMinimumVelocity && tileB.pos.x < tileA.pos.x) || // tile A moving left and tile B is to the left of tile A
              (Math.abs(tileB.body.vel.x) > Math.abs(tileB.body.vel.y) && // tile B is moving horizontally more than it is vertically
                tileB.body.vel.x > this.mergeMinimumVelocity && tileA.pos.x > tileB.pos.x || // tile B moving right and tile A is to the right of tile B
                tileB.body.vel.x < -1 * this.mergeMinimumVelocity && tileA.pos.x < tileB.pos.x) || // tile B moving left and tile A is to the left of tile B
              (Math.abs(tileA.body.vel.y) > Math.abs(tileA.body.vel.x) && // tile A is moving vertically more than it is vertically
                tileA.body.vel.y > this.mergeMinimumVelocity && tileB.pos.y < tileA.pos.y || // tile A moving down and tile B is to the bottom of tile A
                tileA.body.vel.y < -1 * this.mergeMinimumVelocity && tileB.pos.y > tileA.pos.y) || // tile A moving up and tile B is to the top of tile A
              (Math.abs(tileB.body.vel.y) > Math.abs(tileB.body.vel.x) && // tile B is moving vertically more than it is vertically
                tileB.body.vel.y > this.mergeMinimumVelocity && tileA.pos.y < tileB.pos.y || // tile B moving down and tile A is to the bottom of tile A
                tileB.body.vel.y < -1 * this.mergeMinimumVelocity && tileA.pos.y < tileB.pos.y) // tile A moving up and tile A is to the top of tile B
            ){
              // begin merging the tiles.
              tileA.tileValue += tileB.tileValue;
              tileB.tileValue = tileA.tileValue;
              tileB.body.collider.type = CollisionType.PreventCollision;
              tileB.isMerged = true;
              tileB.mergedWith = tileA;
              tileB.mergeProgressCountdown = 100;
              tileB.mergeOriginalPosition = tileB.pos.clone();

              tileA.setDrawingForValue();
              tileB.setDrawingForValue();
            }
          }
        }
      }
    })
  }


  onInitialize() {
    this.spriteSheet = new SpriteSheet(Resources.Tile, 4, 4, 32, 32);

    for (let i = 0; i < 16; i++) {
      this.addDrawing(i, this.spriteSheet.getSprite(i));
    }

    this.setDrawingForValue();
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

  private setDrawingForValue(){
    let index = Math.log2(this.tileValue);
    if (index < 0 || index > 16)
    {
      index = 0;
    }

    this.setDrawing(index);
  }
}
