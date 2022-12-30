import { useEffect, useState } from "react"
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
function GameUIPhaseProgress({timeLeft, phase}: {timeLeft, phase}) {

  const [key, setKey] = useState(0);
  const phaseText = () => {
    if (phase === "PickStartingTile") {
      return "Pick Your Starting Tile"
    } else if (phase === "PickEmptyTile") {
      return "Pick 2 Empty tiles"
    } else if (phase === "EmptyTileBattle") {
      return "Give Your Answer"
    } else if (phase === "PickTileToAttack") {
      return "Choose tile to attack"
    }  else if (phase === "PickTileToAttackBattle") {
      return "Pick Answer"
    }  else if (phase === "ShowAnswersPickTileToAttackBattle") {
      return "Battle Results"
    }  else { 
      return ""
    }
  }

  useEffect(() => {
    setKey(key+1)
  }, [phase, key]);
  return (
    <div className="w-[200px] h-[220px] absolute top-[200px] left-2 ">
      <div className=" relative">
         <CountdownCircleTimer
            key={key}
            isPlaying
            duration={timeLeft}
            colors={['#004777', '#F7B801', '#A30000', '#A30000']}
            colorsTime={[7, 5, 2, 0]}
          >
            {
              ({ remainingTime }) => (
                <div>
                <div role="timer" aria-live="assertive">
                  <h1 className="text-5xl font-extrabold text-orange-800 text-center">{remainingTime}</h1> 
                </div>
                <div className="absolute mt-20 left-0 w-[180px]">
                  <h1 className="text-2xl font-extrabold text-dark-800 text-center">{phaseText()}</h1> 
                </div>
                </div>
              )
            }
          </CountdownCircleTimer>
      </div>
      </div>
  );
}
export default GameUIPhaseProgress;
