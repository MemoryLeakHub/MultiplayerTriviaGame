import { BoardTile, TileType } from "./BoardTile";

export const tilesList: any = (config: any) => {
  return [
    // Tile 1
    new BoardTile({
      config: {
        xInner: -1,
        yInner: -1,
        x: 201,
        y: 348,
        tilePosition: 1,
        tileType: TileType.NONE,
        resources: config.resources
      },
      boardContainer: config.boardContainer,
      boardTilesContainer: config.boardTilesContainer
    }),
    // Tile 2
    new BoardTile({
      config: {
        xInner: 190,
        yInner: -1,
        x: 325,
        y: 401,
        tilePosition: 2,
        tileType: TileType.NONE,
        resources: config.resources
      },
      boardContainer: config.boardContainer,
      boardTilesContainer: config.boardTilesContainer
    }),
    // Tile 3
    new BoardTile({
      config: {
        xInner: -1,
        yInner: -1,
        x: 325,
        y: 517,
        tilePosition: 3,
        tileType: TileType.NONE,
        resources: config.resources
      },
      boardContainer: config.boardContainer,
      boardTilesContainer: config.boardTilesContainer
    }),
    // Tile 4
    new BoardTile({
      config: {
        xInner: -1,
        yInner: -1,
        x: 446,
        y: 467,
        tilePosition: 4,
        tileType: TileType.NONE,
        resources: config.resources
      },
      boardContainer: config.boardContainer,
      boardTilesContainer: config.boardTilesContainer
    }),
    // Tile 5
    new BoardTile({
      config: {
        xInner: -1,
        yInner: -1,
        x: 578,
        y: 314,
        tilePosition: 5,
        tileType: TileType.NONE,
        resources: config.resources
      },
      boardContainer: config.boardContainer,
      boardTilesContainer: config.boardTilesContainer
    }),
    // Tile 6
    new BoardTile({
      config: {
        xInner: -1,
        yInner: -1,
        x: 638,
        y: 466,
        tilePosition: 6,
        tileType: TileType.NONE,
        resources: config.resources
      },
      boardContainer: config.boardContainer,
      boardTilesContainer: config.boardTilesContainer
    }),
    // Tile 7
    new BoardTile({
      config: {
        xInner: -1,
        yInner: -1,
        x: 699,
        y: 345,
        tilePosition: 7,
        tileType: TileType.NONE,
        resources: config.resources
      },
      boardContainer: config.boardContainer,
      boardTilesContainer: config.boardTilesContainer
    }),
    // Tile 8
    new BoardTile({
      config: {
        xInner: -1,
        yInner: -1,
        x: 699,
        y: 270,
        tilePosition: 8,
        tileType: TileType.NONE,
        resources: config.resources
      },
      boardContainer: config.boardContainer,
      boardTilesContainer: config.boardTilesContainer
    }),
    // Tile 9
    new BoardTile({
      config: {
        xInner: -1,
        yInner: 30,
        x: 581,
        y: 143,
        tilePosition: 9,
        tileType: TileType.NONE,
        resources: config.resources
      },
      boardContainer: config.boardContainer,
      boardTilesContainer: config.boardTilesContainer
    }),
    // Tile 10
    new BoardTile({
      config: {
        xInner: -1,
        yInner: -1,
        x: 700,
        y: 141,
        tilePosition: 10,
        tileType: TileType.NONE,
        resources: config.resources
      },
      boardContainer: config.boardContainer,
      boardTilesContainer: config.boardTilesContainer
    }),
    // Tile 11
    new BoardTile({
      config: {
        xInner: -1,
        yInner: 200,
        x: 820,
        y: 83,
        tilePosition: 11,
        tileType: TileType.NONE,
        resources: config.resources
      },
      boardContainer: config.boardContainer,
      boardTilesContainer: config.boardTilesContainer
    }),
    // Tile 12
    new BoardTile({
      config: {
        xInner: -1,
        yInner: -1,
        x: 904,
        y: 215,
        tilePosition: 12,
        tileType: TileType.NONE,
        resources: config.resources
      },
      boardContainer: config.boardContainer,
      boardTilesContainer: config.boardTilesContainer
    }),
    // Tile 13
    new BoardTile({
      config: {
        xInner: -1,
        yInner: -1,
        x: 516,
        y: 19,
        tilePosition: 13,
        tileType: TileType.NONE,
        resources: config.resources
      },
      boardContainer: config.boardContainer,
      boardTilesContainer: config.boardTilesContainer
    }),
    // Tile 14
    new BoardTile({
      config: {
        xInner: -1,
        yInner: -1,
        x: 701,
        y: 18,
        tilePosition: 14,
        tileType: TileType.NONE,
        resources: config.resources,
      },
      boardContainer: config.boardContainer,
      boardTilesContainer: config.boardTilesContainer
    })
  ];
};
