import React, { useRef, useEffect, useState } from "react";
import { Application, Sprite, Container } from "pixi.js";
import { BoardTile } from "./BoardTile";
import { tilesList } from "./Tiles";
import GameUiLogin from "./GameUILogin";
import GameUILobby from "./GameUILobby";
import client from '@urturn/client'
import { Timer } from "easytimer.js";
import { useSnackbar } from 'notistack';
import GameUIPlayers from "./GameUIPlayers";
import GameUIPhaseProgress from "./GameUIPhaseProgress"
import GameUIQuestion from "./GameUIQuestion"
import "./styles.css"
function App() {
  const canvasEle = useRef(null);
  const [roomState, setRoomState] = useState(client.getRoomState() || {});
  const [curPlr, setCurPlr] = useState(null);
  const [tiles, setTiles] = useState(null);
  const [preLoadProgress, setPreLoadProgress] = useState(0);
  const [showLogin, setShowLoign] = useState(false)
  const [showLobby, setShowLobby] = useState(false)
  const [assetsFinishedLoading, setAssetsFInishedLoading] = useState(false)

  const { enqueueSnackbar } = useSnackbar();

  const [timeLeft, setTimeLeft] = useState(0)
  const {
    state: {
      status = "",
      gamePhase = "",
      playerIdToPlayerState = {},
      question = {},
      mapConnectedSections = [],
      phaseTimerStart = null,
      phaseTimerTotal = null
    } = {},
    roomStartContext,
    players = [], finished,
  } = roomState;

  const onTileClick = (tile: number) => {
    console.log("onTileClick: ", tile)
    // if (roomState.state.gamePhase == "PickStartingTile") {
      client.makeMove({ InGameMoveStatusClient: "PickTilePlayerAction", data: {tile:tile} }).then(({ error }) => {
        if (error != null) {
          throw new Error(error.message);
        }
      }).catch((error) => {
        enqueueSnackbar(error.message, {
          variant: 'error',
          autoHideDuration: 3000,
        });
      });
    // }
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
      
      var timeLeft = Math.round(getTimeLeftSecs(phaseTimerStart, phaseTimerTotal))
      setTimeLeft(timeLeft)
      const intervalId = setInterval(() => {  
        var left = Math.round(getTimeLeftSecs(phaseTimerStart, phaseTimerTotal))
     
        console.log("time : " + left);
        if (left <= 0) {
          if (gamePhase == "PickStartingTile") {
            client.makeMove({ InGameMoveStatusClient: "PickStartingTileEnd", data: {tile: -1} }).then(({ error }) => {
              if (error != null) {
                throw new Error(error.message);
              }
            }).catch((error) => {
              enqueueSnackbar(error.message, {
                variant: 'error',
                autoHideDuration: 3000,
              });
            });
          } else if (gamePhase == "PickEmptyTile") {
            client.makeMove({ InGameMoveStatusClient: "PickEmptyTileEnd" }).then(({ error }) => {
              if (error != null) {
                throw new Error(error.message);
              }
            }).catch((error) => {
              enqueueSnackbar(error.message, {
                variant: 'error',
                autoHideDuration: 3000,
              });
            });
          } else if (gamePhase == "EmptyTileBattle") {
            client.makeMove({ InGameMoveStatusClient: "EmptyTileBattleEnd" }).then(({ error }) => {
              if (error != null) {
                throw new Error(error.message);
              }
            }).catch((error) => {
              enqueueSnackbar(error.message, {
                variant: 'error',
                autoHideDuration: 3000,
              });
            });
          } else if (gamePhase == "ShowEmptyTileBattleAnswers") {
            client.makeMove({ InGameMoveStatusClient: "ShowEmptyTileBattleAnswersEnd" }).then(({ error }) => {
              if (error != null) {
                throw new Error(error.message);
              }
            }).catch((error) => {
              enqueueSnackbar(error.message, {
                variant: 'error',
                autoHideDuration: 3000,
              });
            });
          }

          
          clearInterval(intervalId);
        }
      }, 1000)
    
      return () => clearInterval(intervalId); //This is important
  
    }
  }, [phaseTimerStart, phaseTimerTotal, gamePhase ]);

  
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

  // on gamestate phase change
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
    } else if (status === "InGame") {
      if (gamePhase === "PickEmptyTile") {
        
      }
    }

    console.log("updated roomState 222 ")
    console.log(roomState)
  }, [assetsFinishedLoading, status, gamePhase, curPlr, playerIdToPlayerState]);

  useEffect(() => {
    console.log("gamePhase tiles : " + gamePhase)
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
      "./assets/peons.json",
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
            onTileClick: onTileClick,
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

  const onAnswerClick = answer  => {
    client.makeMove({ InGameMoveStatusClient: "PickAnswerPlayerAction", data: {answer:answer} }).then(({ error }) => {
      if (error != null) {
        throw new Error(error.message);
      }
    }).catch((error) => {
      enqueueSnackbar(error.message, {
        variant: 'error',
        autoHideDuration: 3000,
      });
    });
  }
  const onLoginClick = username => {
    client.makeMove({ username: username }).then(({ error }) => {
      if (error != null) {
        throw new Error(error.message);
      }
    }).catch((error) => {
      enqueueSnackbar(error.message, {
        variant: 'error',
        autoHideDuration: 3000,
      });
    });
  }
  const onStartGameClick = () => {
   client.makeMove({ startGame: true }).then(({ error }) => {
    if (error != null) {
      throw new Error(error.message);
    }
  }).catch((error) => {
    enqueueSnackbar(error.message, {
      variant: 'error',
      autoHideDuration: 3000,
    });
  });
  }
  
  return (
    <div className="flex m-auto w-[1200px] h-[720px]  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="m-auto absolute">
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
            : (status == "InGame") ? 
              <div>
                <GameUIPlayers playerIdToPlayerState={playerIdToPlayerState} />

                <GameUIPhaseProgress timeLeft={timeLeft} phase={gamePhase}/>
                {
                  (gamePhase == "EmptyTileBattle" || gamePhase == "ShowEmptyTileBattleAnswers") ? 
                  <GameUIQuestion state={roomState.state} curPlayer={curPlr} onAnswer={onAnswerClick} />
                  : ""
                }
                
              </div>
              
            :  ""
        }
      </div>
    </div>
  );
}
export default App;
