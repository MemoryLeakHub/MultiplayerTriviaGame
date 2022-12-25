import { BoardTile, TileType } from "./BoardTile";

export const tilesList: any = (config: any) => {
  return [
    // Tile 1
    new BoardTile({
      config: {
        x: 516,
        y: 19,
        tilePosition: 1,
        tileType: TileType.PLAYER_BLUE,
        resources: config.resources
      },
      boardContainer: config.boardContainer,
      boardTilesContainer: config.boardTilesContainer
    }),
    // Tile 2
    new BoardTile({
      config: {
        x: 701,
        y: 18,
        tilePosition: 2,
        tileType: TileType.PLAYER_RED,
        resources: config.resources
      },
      boardContainer: config.boardContainer,
      boardTilesContainer: config.boardTilesContainer
    })
  ];
};
