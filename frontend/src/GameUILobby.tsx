import { useEffect, useState } from "react"
import GameUIPlayer, { PlayerLobbyData } from "./GameUIPlayer";

function GameUILobby({playerLobbyData}: {playerLobbyData: PlayerLobbyData[], }) {

  return (
    <div className="w-full h-full backdrop-blur-xl bg-white/30 relative ">
      <div className="flex h-[720px]">
        <div className="m-auto">
          {
            playerLobbyData.map((player) => { 
              return (
                <GameUIPlayer playerLobbyData={player}/>
              );
            })
          }
          <button type="button" className=" btn btn-hollow-play h-[47px] w-full mt-4 cursor-not-allowed" > START GAME </button>
          <button type="button" className=" btn btn-hollow-not-ready h-[47px] w-full mt-4 cursor-not-allowed" disabled> START GAME </button>
        </div>
      </div>
    </div>
  );
}
export default GameUILobby;
