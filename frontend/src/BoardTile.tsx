import { Container, Sprite, Graphics, BLEND_MODES, filters, Ticker } from "pixi.js";

export enum TileType {
  PLAYER_RED,
  PLAYER_BLUE,
  PLAYER_GREEN,
  NONE
}
export enum TileAnimationState { 
  FILLED,
  NONE
}
export interface BoardTileConfig {
  x: number;
  y: number;
  tilePosition: number;
  tileType: TileType;
  resources: any;
}

export class BoardTile {
  public container: Container = new Container();
  public animationContainer: Container = new Container();

  ticker: Ticker = Ticker.shared
  circle = new Graphics();
  tileSprite: Sprite
  tileAnimatedSprite: Sprite
  tileAnimationState: TileAnimationState  = TileAnimationState.NONE
  tileAnimationDurationSeconds: number = 2
  tileBlurFilter = [new filters.BlurFilter(8)]
  currentTileType: TileType = TileType.NONE
  isAnimating: Boolean = false
  constructor(
    public props: {
      config: BoardTileConfig;
      boardContainer: Container;
      boardTilesContainer: Container;
    }
  ) {
    //this.container.addChild(this.animationContainer);
    this.currentTileType = this.props.config.tileType
    this.ticker.autoStart = false;
    this.container.interactive = true

    const atlas = this.getAtlasFromTilePosition();

    this.tileSprite = this.getTileSprite(atlas, this.props.config.tileType);
    this.tileAnimatedSprite = this.getTileSprite(atlas, this.props.config.tileType);

    this.initContainerSetup(true);


    props.boardTilesContainer.addChild(this.container);
    this.container.on('pointerdown', (e: any) => {
      this.onTileClick(atlas);
    });

  }

  // Because we are changing the [x,y] position of our boardContainer wrapper
  // we are calculating it as if there was no change
  private initContainerSetup(isInitial = false) {
    if (this.tileSprite === undefined || this.tileAnimatedSprite === undefined) {
      return;
    }

      this.container.x = this.props.config.x - this.props.boardContainer.x;
      this.container.y = this.props.config.y - this.props.boardContainer.y;
      this.container.addChild(this.tileSprite);

    if (this.currentTileType === this.props.config.tileType) {
      return;
    }

    console.log("this.currentTileType : " + this.currentTileType)
    console.log("this.props.config.tileType : " + this.props.config.tileType)
    this.currentTileType = this.props.config.tileType

    const circleRadius = 35
    
    
    this.circle.beginFill(0xffffff);
    this.circle.drawCircle(0, 0, circleRadius);
    this.circle.endFill();
    this.circle.x = this.tileAnimatedSprite.width/2 + circleRadius;
    this.circle.y = this.tileAnimatedSprite.height/2 + circleRadius;
    this.circle.pivot.x = circleRadius;
    this.circle.pivot.y = circleRadius;
    this.circle.alpha = 0
    this.setCircleSizeAndCenter(circleRadius*2,circleRadius*2)
    console.log("this.circle.width : " + this.circle.width);
    this.tileAnimatedSprite.filters = this.tileBlurFilter;
    
    this.container.addChild(this.tileAnimatedSprite);
    this.container.addChild(this.circle);
    console.log(this.container.children)
    this.tileAnimatedSprite.mask = this.circle;
    this.tileTransitionAnimation(2)

  }

  onTileChange(count: number) {
    console.log("current Number : " + count + " texture : " + this.tileSprite.texture.textureCacheIds)
  }
  private onTileClick(atlas: any) { 
    if (this.isAnimating) {
      return;
    }
    this.props.config.tileType = (this.props.config.tileType == TileType.PLAYER_BLUE) ? TileType.PLAYER_RED : TileType.PLAYER_BLUE

    this.tileSprite.texture = this.getTileSprite(atlas, this.currentTileType).texture;
    this.tileAnimatedSprite.texture = this.getTileSprite(atlas, this.props.config.tileType).texture;

    console.log("click")
    this.initContainerSetup()
  }
  private tileTransitionAnimation(duration: number) { 
    if (this.tileSprite === undefined || this.tileAnimatedSprite === undefined) {
      return
    }
    this.isAnimating = true
    
    const mask = this.circle
    const tile = this.tileAnimatedSprite
    tile.alpha = 1
    mask.alpha = 1
    
    let initialWidth = mask.width
    let initialHeight = mask.width
    let seconds = 0
    const animate = (delta: number) => {
      seconds += (1 / 60) * delta;
      if (seconds <= duration) {
        //console.log(seconds)
        const percent = seconds/duration

        this.setCircleSizeAndCenter(
          initialWidth + (percent * tile.width),
          initialHeight + (percent * tile.height)
        )
     
      } else { 
        this.isAnimating = false
        this.tileSprite.texture = this.tileAnimatedSprite.texture
        //this.container.removeChildren()
        tile.alpha = 0
        this.ticker.remove(animate)
      }
    };
    this.ticker.add(animate);
    this.ticker.start()
  }

  private setCircleSizeAndCenter(width: number, height: number) { 
    if (this.tileSprite === undefined || this.tileAnimatedSprite === undefined) {
      return;
    }

    const mask = this.circle
    const tile = this.tileAnimatedSprite

    this.circle.width = width
    this.circle.height = height
        
    this.circle.x = (tile.width/2 + mask.width/2);
    this.circle.y = (tile.height/2 + mask.height/2);
  }

  private getTileSprite(atlas: string, tileType: TileType) {
    const sheetAtlas = this.props.config.resources[atlas];
    const tilePosition = this.props.config.tilePosition;
    const playerType = tileType;

    const tileSprite = new Sprite(
      sheetAtlas.textures[
        "map_segment_" +
          this.getTileTypeAsText(playerType) +
          "_" +
          tilePosition +
          ".png"
      ]
    );

    console.log(tileSprite);
    return tileSprite;
  }

  private getTileTypeAsText(playerType: TileType) {
    if (playerType === TileType.PLAYER_RED) {
      return "red";
    } else if (playerType === TileType.PLAYER_GREEN) {
      return "green";
    } else if (playerType === TileType.PLAYER_BLUE) {
      return "blue";
    } else {
      return "grey";
    }
  }

  private getAtlasFromTilePosition() {
    const tilePosition = this.props.config.tilePosition;
    let atlas = "./assets/atlas_tiles_1.json";
    switch (tilePosition) {
      case 1:
        atlas = "./assets/atlas_tiles_1.json";
        break;
      case 2:
        atlas = "./assets/atlas_tiles_2.json";
        break;
    }

    return atlas;
  }
}
