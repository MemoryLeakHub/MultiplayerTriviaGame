import React, { useRef, useEffect, useState } from "react";
import { Application, Sprite, Container } from "pixi.js";
import { BoardTile, BoardTileConfig, TileType } from "./BoardTile";
import { tilesList } from "./Tiles";
import GameUI from "./GameUI";
import GameUiLogin from "./GameUILogin";
import GameUIPlayer, { PlayerLobbyData } from "./GameUIPlayer";
import GameUILobby from "./GameUILobby";
import client from '@urturn/client'
import "./styles.css"
function App() {
  const canvasEle = useRef(null);
  const [roomState, setRoomState] = useState(client.getRoomState() || {});
  const [curPlr, setCurPlr] = useState();
  const [count, setCount] = useState(0);
  const [tiles, setTiles] = useState(null);
  const [preLoadProgress, setPreLoadProgress] = useState(0);
  const [isLogged, setIsLogged] = useState(false)
  const [showLogin, setShowLoign] = useState(false)
  let playeDataList: PlayerLobbyData[] = 
  [{
    isMaster: true,
    isBot: false,
  }, 
  {
    isMaster: false,
    isBot: true
  },
  {
    isMaster:false,
    isBot:false
  }
  ]
  const handleClick = (event: any) => {
    setCount(count + 1);

    if (tiles != null) {
      var currentTile = tiles[1] as BoardTile
      currentTile.onTileChange(count)
    }
  };
  useEffect(() => {
    const onStateChanged = (newBoardGame) => {
      setRoomState(newBoardGame);
    };
    client.events.on('stateChanged', onStateChanged);
    return () => {
      client.events.off('stateChanged', onStateChanged);
    };
  }, []);
  useEffect(() => {
    const setupCurPlr = async () => {
      const newCurPlr = await client.getLocalPlayer();
      setCurPlr(newCurPlr);
    };
    setupCurPlr();
  }, []);
  useEffect(() => {
    // On first render create our application
    const game = new Application({
      view: canvasEle.current!,
      width: 1200,
      height: 720
    });

    // Start the PixiJS app
    game.start();
    [
      "./assets/map_full.png",
      "./assets/map_walls_plus_separators.png",
      "./assets/atlas_tiles_1.json",
      "./assets/atlas_tiles_2.json"
    ].forEach(r => { game.loader.add(r); });
    game.loader.onProgress.add((loader, resources) => { 
      setPreLoadProgress(loader.progress)
            if (loader.progress == 100) {
              setShowLoign(true)
            }
    });
    game.loader.load((loader, resources) => {
      
          console.log("Resources Loaded");
          console.log(resources);

          // This is our board + the walls
          const boardContainer = new Container();
          boardContainer.x = 198;
          boardContainer.y = 14;

          // This is only for our board tiles
          const boardTilesContainer = new Container();

          const tiles = tilesList({
            resources: resources,
            boardContainer: boardContainer,
            boardTilesContainer: boardTilesContainer
          });
          setTiles(tiles)
          const map = Sprite.from(resources["./assets/map_full.png"].texture);
          const mapWalls = Sprite.from(
            resources["./assets/map_walls_plus_separators.png"].texture
          );

          game.stage.addChild(map);
          game.stage.addChild(boardContainer);

          boardContainer.addChild(boardTilesContainer);
          boardContainer.addChild(mapWalls);
      
    });

    return () => {
      // On unload completely destroy the application and all of it's children
      game.destroy(true, true);
    };
  }, []);

  return (
    <div className="flex h-screen">
      <div className="m-auto">
        <canvas ref={canvasEle} />
        <div className="w-[1200px] h-[720px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {(true) ? // is not logged
             <GameUiLogin preLoadProgress={preLoadProgress} showLogin={showLogin} /> 
             : 
             <GameUILobby playerLobbyData={playeDataList} /> 
          }
        </div>
      </div>
      
    {/* <div>
      <h1>TODO: Implement your game UI here!</h1>
      <p >Current Plr: {curPlr?.username}</p>
    </div> */}
    </div>
  );
}
export default App;
