import { TileType } from "./BoardTile";


function GameUIShowRoundStage({state}) {

  console.log(state.tileAttackOrder);
  return (
    <div className="flex m-auto w-[300px] h-[40px] absolute bottom-0 grid grid-cols-12 gap-1 ml-2">
        {
          state.tileAttackOrder.map((value, index) => {

            let style = " rounded-full w-[20px] h-[20px] "

            if (value == TileType.PLAYER_BLUE) {
              style += " bg-blue-700 "
            } else if (value == TileType.PLAYER_GREEN) {
              style += " bg-green-700 "
            } else {
              style += " bg-red-700 "
            }
            
            if (index == state.tileAttackRound) {
              style += " opacity-100 border-2 border-yellow-300 shadow-lg shadow-indigo-500/40 animate-bounce "
            } else {
              style += " opacity-30 "
            }
            return (
              <div className={style}></div>
            )
          })
        }
    </div>
  );
}
export default GameUIShowRoundStage;
