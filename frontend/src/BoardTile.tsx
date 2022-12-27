import { Container, Sprite, Graphics, BLEND_MODES, filters, Ticker, TextStyle, Text, uniformParsers } from "pixi.js";

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
  xInner: number;
  yInner: number;
  x: number;
  y: number;
  tilePosition: number;
  tileType: TileType;
  resources: any;
}

export interface Player {
  status: string,
  isBot: boolean,
  isMaster: boolean,
  type: TileType,
  mapSections: [],
  battleForTile: []
}
const style = new TextStyle({
  fontFamily: 'Arial',
  fontSize: 36,
  fontStyle: 'italic',
  fontWeight: 'bold',
  fill: ['#ffffff'], // gradient
  stroke: '#262626',
  strokeThickness: 3,
  dropShadow: true,
  dropShadowColor: '#000000',
  dropShadowBlur: 2,
  dropShadowAngle: Math.PI / 6,
  dropShadowDistance: 2,
  wordWrap: true,
  wordWrapWidth: 440,
  lineJoin: 'round',
});
export class BoardTile {
  public container: Container = new Container();
  public animationContainer: Container = new Container();
  public textContainer: Container = new Container();
  public battlePeonContainer: Container = new Container();

  greenPeon: Sprite
  redPeon:Sprite
  bluePeon:Sprite

  ticker: Ticker = Ticker.shared
  circle = new Graphics();
  tileSprite: Sprite
  tileAnimatedSprite: Sprite
  xTileSprite: Sprite
  tileAnimationState: TileAnimationState  = TileAnimationState.NONE
  tileAnimationDurationSeconds: number = 2
  tileBlurFilter = [new filters.BlurFilter(8)]
  currentTileType: TileType = TileType.NONE
  isAnimating: Boolean = false
 
  worthText = new Text("200", style);
  roomStateLocal: any
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

    // x mark
    this.xTileSprite = new Sprite(this.props.config.resources["./assets/x_tile.png"].texture);
    this.xTileSprite.alpha = 1
    this.xTileSprite.pivot.x = this.xTileSprite.width/2;
    this.xTileSprite.pivot.y = this.xTileSprite.height/2

    // text
    this.textContainer.addChild(this.worthText)
    this.textContainer.pivot.x = this.textContainer.width/2;
    this.textContainer.pivot.y = this.textContainer.height/2

    this.greenPeon = this.getPeonByType(TileType.PLAYER_GREEN)
    this.greenPeon.alpha = 0
    this.bluePeon = this.getPeonByType(TileType.PLAYER_BLUE)
    this.bluePeon.alpha = 0
    this.redPeon = this.getPeonByType(TileType.PLAYER_RED)
    this.redPeon.alpha = 0

    this.battlePeonContainer.addChild(this.greenPeon)
    this.battlePeonContainer.addChild(this.bluePeon)
    this.battlePeonContainer.addChild(this.redPeon)
    if (props.config.xInner != -1) {
      this.textContainer.x = props.config.xInner;
      this.xTileSprite.x = props.config.xInner;
      this.greenPeon.x = props.config.xInner;
      this.bluePeon.x = props.config.xInner-10;
      this.redPeon.x = props.config.xInner+10;
    } else {
      this.textContainer.x = this.container.width/2;
      this.xTileSprite.x = this.container.width/2;
      this.greenPeon.x = this.container.width/2;
      this.bluePeon.x = this.container.width/2-10;
      this.redPeon.x = this.container.width/2+10;
    }
    if (props.config.yInner != -1) {
      this.xTileSprite.y = props.config.yInner;
      this.textContainer.y = props.config.yInner;
      this.greenPeon.y = props.config.yInner;
      this.bluePeon.y = props.config.yInner;
      this.redPeon.y = props.config.yInner;
    } else {
      this.xTileSprite.y = this.container.height/2;
      this.textContainer.y = this.container.height/2;
      this.greenPeon.y = this.container.height/2;
      this.bluePeon.y = this.container.height/2;
      this.redPeon.y = this.container.height/2;
    }
  

    //this.container.addChild(this.xTileSprite);
    this.container.addChild(this.textContainer);
    this.container.addChild(this.battlePeonContainer);
  }

  // Because we are changing the [x,y] position of our boardContainer wrapper
  // we are calculating it as if there was no change
  private initContainerSetup(isInitial = false) {
    if (this.tileSprite === undefined || this.tileAnimatedSprite === undefined) {
      return;
    }

    this.container.x = this.props.config.x - this.props.boardContainer.x;
    this.container.y = this.props.config.y - this.props.boardContainer.y;
    this.tileSprite.zIndex = 1
    if (isInitial) {
    this.container.addChild(this.tileSprite);
    }
   
    if (this.currentTileType === this.props.config.tileType) {
      return;
    }

    // console.log("this.currentTileType : " + this.currentTileType)
    // console.log("this.props.config.tileType : " + this.props.config.tileType)
    this.currentTileType = this.props.config.tileType

    // const circleRadius = 35
    
    // this.circle.beginFill(0xffffff);
    // this.circle.drawCircle(0, 0, circleRadius);
    // this.circle.endFill();
    // this.circle.x = this.tileAnimatedSprite.width/2 + circleRadius;
    // this.circle.y = this.tileAnimatedSprite.height/2 + circleRadius;
    // this.circle.pivot.x = circleRadius;
    // this.circle.pivot.y = circleRadius;
    // this.circle.alpha = 1
    // this.circle.zIndex = 2
    // this.setCircleSizeAndCenter(circleRadius*2,circleRadius*2)

    // this.tileAnimatedSprite.filters = this.tileBlurFilter;
    
    // this.tileAnimatedSprite.zIndex = 3
    // if (isInitial) {
    //   this.container.addChild(this.tileAnimatedSprite);
    //   this.container.addChild(this.circle);
    //   this.tileAnimatedSprite.mask = this.circle;
    // }
   
  
    //this.tileTransitionAnimation(2)
  }

  updateState(roomState: any) { 
    if (roomState === undefined) {
      return;
    }
    this.roomStateLocal = roomState
    this.updateWorthText(roomState)

    this.updateBattlePeon(roomState)
   
  }

  private updateBattlePeon(roomState) {
    // reset peons
    this.bluePeon.alpha = 0
    this.redPeon.alpha = 0
    this.greenPeon.alpha = 0

    console.log(roomState.state.playerIdToPlayerState)
  
    const players = roomState.state.playerIdToPlayerState as Map<string, Player>
    Object.values(players).forEach(player => {
      const playerHasTileInBattle = player.battleForTile.includes( this.props.config.tilePosition)
      console.log("playerHasTileInBattle : ", playerHasTileInBattle)
      console.log("this.props.config.tilePosition : ", this.props.config.tilePosition)
      console.log("player.battleForTile : ",player.battleForTile)
      if (player.battleForTile.length != 0 && playerHasTileInBattle ) {
        if (player.type == TileType.PLAYER_BLUE) {
          this.bluePeon.alpha = 1
        } else if (player.type == TileType.PLAYER_GREEN)  {
          this.greenPeon.alpha = 1
        } else {
          this.redPeon.alpha = 1;
        }
      } 
    });
     
  }
  private updateWorthText(roomState: any) { 
    // console.log("this.props.roomState.mapConnectedSections")
    // console.log(roomState)
    const tile = roomState.state.mapConnectedSections[this.props.config.tilePosition-1]
    if (tile.status === "ReTaken") {
      this.worthText.text = "300"
    } else  { 
      this.worthText.text = "200"
    }
    this.worthText.zIndex = 4
  }

  onTileChange(count: number) {
    //console.log("current Number : " + count + " texture : " + this.tileSprite.texture.textureCacheIds)
  }
  private onTileClick(atlas: any) { 
    console.log(this.container.children)
    if (this.isAnimating) {
      return;
    }
    this.props.config.tileType = (this.props.config.tileType == TileType.PLAYER_BLUE) ? TileType.PLAYER_RED : TileType.PLAYER_BLUE

    this.tileSprite.texture = this.getTileSprite(atlas, this.props.config.tileType).texture;
     
    // this.tileSprite.texture = this.getTileSprite(atlas, this.currentTileType).texture;
    // this.tileAnimatedSprite.texture = this.getTileSprite(atlas, this.props.config.tileType).texture;
  
    // this.tileTransitionAnimation(2)
    //console.log("click")
    //this.initContainerSetup()
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

  // 
  private getPeonByType(type: TileType) {
    const sheetAtlas = this.props.config.resources["./assets/peons.json"];
    let peon = "red_peon.png";
    switch (type) {
      case TileType.PLAYER_BLUE:
        peon = "blue_peon.png";
        break;
      case TileType.PLAYER_GREEN:
        peon = "green_peon.png";
        break;
    }

    const sprite = new Sprite(
      sheetAtlas.textures[peon]
    );
    return sprite;

  }
  private getAtlasFromTilePosition() {
    const tilePosition = this.props.config.tilePosition;
    let atlas = "./assets/atlas_tiles_13.json";
    switch (tilePosition) {
      case 1:
        atlas = "./assets/atlas_tiles_1.json";
        break;
      case 2:
        atlas = "./assets/atlas_tiles_2.json";
        break;
      case 3:
        atlas = "./assets/atlas_tiles_3.json";
        break;
      case 4:
        atlas = "./assets/atlas_tiles_4.json";
        break;
      case 5:
        atlas = "./assets/atlas_tiles_5.json";
        break;
      case 6:
        atlas = "./assets/atlas_tiles_6.json";
        break;
      case 7:
        atlas = "./assets/atlas_tiles_7.json";
        break;
      case 8:
        atlas = "./assets/atlas_tiles_8.json";
        break;
      case 9:
        atlas = "./assets/atlas_tiles_9.json";
        break;
      case 10:
        atlas = "./assets/atlas_tiles_10.json";
        break;
      case 11:
        atlas = "./assets/atlas_tiles_11.json";
        break;
      case 12:
        atlas = "./assets/atlas_tiles_12.json";
        break;
      case 13:
        atlas = "./assets/atlas_tiles_13.json";
        break;
      case 14:
        atlas = "./assets/atlas_tiles_14.json";
        break;
    }

    return atlas;
  }
}
