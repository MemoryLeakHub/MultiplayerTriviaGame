import {TileType} from "./BoardTile"
function GameUIPlayer({player}: {player}) {

  return (
    <div className={ "w-[250px] rounded-lg mt-2 ml-2" }>
          <div className=
          {
            (player.type === TileType.PLAYER_BLUE) ?  "bg-blue-100 border border-blue-400 text-blue-900 px-4 py-3 rounded relative" :
            (player.type === TileType.PLAYER_GREEN) ? "bg-teal-100 border border-teal-400 text-emerald-900 px-4 py-3 rounded relative" 
            : "bg-red-100 border border-red-400 text-red-900 px-4 py-3 rounded relative"
          } role="alert">
      
        <strong className="font-bold">{player.username}</strong>
        <span className="block sm:inline ml-2">{player.totalValue}</span>
      
      </div>
    </div>
  );
}
export default GameUIPlayer;
