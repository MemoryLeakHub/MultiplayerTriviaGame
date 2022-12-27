import React, { useRef, useEffect, useState } from "react";
import { Application, Sprite, Container } from "pixi.js";
import { BoardTile } from "./BoardTile";
import { tilesList } from "./Tiles";
import GameUiLogin from "./GameUILogin";
import GameUILobby from "./GameUILobby";
import client from '@urturn/client'
import { Timer } from "easytimer.js";

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
  const [showLobby, setShowLobby] = useState(false)
  const [assetsFinishedLoading, setAssetsFInishedLoading] = useState(false)
  const [tilesChose, setTilesChosen] = useState([])
  const [timer, setTimer] = useState(0)

  const {
    state: {
      status = "",
      playerIdToPlayerState = {},
      mapConnectedSections = [],
      phaseTimerStart = null,
      phaseTimerTotal = null
    } = {},
    roomStartContext,
    players = [], finished,
  } = roomState;

  const pickTilesClick = (event: any) => {
    setCount(count + 1);

    if (tiles != null) {
      var currentTile = tiles[1] as BoardTile
      currentTile.onTileChange(count)
    }
  };
  const handleClick = (event: any) => {
    setCount(count + 1);

    if (tiles != null) {
      var currentTile = tiles[1] as BoardTile
      currentTile.onTileChange(count)
    }
  };
  useEffect(() => {
    const setupCurPlr = async () => {
      const newCurPlr = await client.getLocalPlayer();
      setCurPlr(newCurPlr);
    };
    setupCurPlr();
  }, []);

  function getTimeLeftSecs(startTime, timeoutMs) {
    const timeoutDateMs = new Date(startTime).getTime() + timeoutMs;
    const nowMs = client.now();
    const timeLeftSecs = (timeoutDateMs - nowMs) / 1000;
    return timeLeftSecs;
  }

  useEffect(() => {
    if (phaseTimerStart != null && phaseTimerTotal != null ) {
      const intervalId = setInterval(() => {  
        var left = getTimeLeftSecs(phaseTimerStart, phaseTimerTotal)
        console.log("left : ", left)
        console.log("client.now() : ", client.now())
        if (left <= 0) {
          client.makeMove({ InGameMoveStatusFront: "PickStartingTileEnd" });
          clearInterval(intervalId);
        }
      }, 1000)
    
      return () => clearInterval(intervalId); //This is important
  
    }
  }, [phaseTimerStart, phaseTimerTotal ]);

  


  useEffect(() => {
    const onStateChanged = (newBoardGame) => {
      console.log("state changed")
      console.log(newBoardGame)
      setRoomState(newBoardGame);
    };
    client.events.on('stateChanged', onStateChanged);
    return () => {
      client.events.off('stateChanged', onStateChanged);
    };
  }, []);

  useEffect(() => {
    if (!assetsFinishedLoading) {
      return;
    }
    if (roomState == null || curPlr == null) {
      return;
    }
    const currentPlayer = playerIdToPlayerState[curPlr.id]
    if (status === "PrepGame") {
      if (currentPlayer.status === "Login")  {
        setShowLoign(true)
      } else if (currentPlayer.status === "Lobby") {
        setShowLobby(true)
      }
    }

    console.log("updated roomState 222 ")
    console.log(roomState)
  }, [assetsFinishedLoading, roomState, curPlr]);

  useEffect(() => {
    if (tiles != null) {
      tiles.map((currentTile:BoardTile) => {
        currentTile.updateState(roomState)
      })
    }
  }, [roomState,tiles]);

  useEffect(() => {
    // On first render create our application
    const game = new Application({
      view: canvasEle.current!,
      width: 1200,
      height: 720
    });

    // const setupCurPlr = async () => {
    //   const newCurPlr = await client.getLocalPlayer();
    //   setCurPlr(newCurPlr);

    //   client.makeMove({ username: "test user" })
    // };
    // setupCurPlr();

    // Start the PixiJS app
    game.start();
    [
      "./assets/map_full.png",
      "./assets/map_walls_plus_separators.png",
      "./assets/atlas_tiles_1.json",
      "./assets/atlas_tiles_2.json",
      "./assets/atlas_tiles_3.json",
      "./assets/atlas_tiles_4.json",
      "./assets/atlas_tiles_5.json",
      "./assets/atlas_tiles_6.json",
      "./assets/atlas_tiles_7.json",
      "./assets/atlas_tiles_8.json",
      "./assets/atlas_tiles_9.json",
      "./assets/atlas_tiles_10.json",
      "./assets/atlas_tiles_11.json",
      "./assets/atlas_tiles_12.json",
      "./assets/atlas_tiles_13.json",
      "./assets/atlas_tiles_14.json",
      "./assets/x_tile.png"
    ].forEach(r => { game.loader.add(r); });
    game.loader.onProgress.add((loader, resources) => { 
      setPreLoadProgress(loader.progress)
      if (Math.round(loader.progress) == 100) {
        setAssetsFInishedLoading(true)
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

  const onLoginClick = username => {
    client.makeMove({ username: username })
  }
  const onStartGameClick = () => {
   client.makeMove({ startGame: true })
  }

  return (
    <div className="flex h-screen">
      <div className="m-auto">
        <canvas ref={canvasEle} />
        { // if we are not in the game show the Login or Lobby
            (status !== "InGame") ? 
            <div className="w-[1200px] h-[720px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              {(!showLobby) ? // is not logged
                 <GameUiLogin preLoadProgress={preLoadProgress} showLogin={showLogin} onLoginClick={onLoginClick} /> 
                 : 
                 <GameUILobby playerIdToPlayerState={playerIdToPlayerState} onStartGameClick={onStartGameClick} /> 
              }
            </div>
            : ""
        }
      </div>
    </div>
  );
}
export default App;
