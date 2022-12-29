import {TileType} from "./BoardTile"
function GameUIQuestionNumberPlayer({player, place}) {

  const getPlace = () => {
    if (place == 1) {
      return " 1st : " + player.answer
    } else if (place == 2) {
      return " 2nd : " + player.answer
    } else {
      return " 3rd : " + player.answer
    }
  }

  return (
    <div className={ "w-[250px] rounded-lg mt-2 ml-2" }>
          <div className=
          {
            (player.type == TileType.PLAYER_BLUE) ?  "bg-blue-100 border border-blue-400 text-blue-900 px-4 py-3 rounded relative" :
            (player.type == TileType.PLAYER_GREEN) ? "bg-teal-100 border border-teal-400 text-emerald-900 px-4 py-3 rounded relative" 
            : "bg-red-100 border border-red-400 text-red-900 px-4 py-3 rounded relative"
          } role="alert">
      
        <strong className="font-bold">{player.username}</strong>
        <span className="block sm:inline ml-2">{getPlace()}</span>
      
      </div>
    </div>
  );
}
export default GameUIQuestionNumberPlayer;
