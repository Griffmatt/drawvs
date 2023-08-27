export const GAME_MODES = [
    {
      name: "Normal",
      rotation: ["prompt", "draw"] as const,
      minPlayers: 2,
      roundsPerPlayer: 1
    },
    {
      name: "Story",
      rotation: ["story"] as const,
      minPlayers: 2,
      roundsPerPlayer: 1
    },
    {
      name: "Animation",
      rotation: ["animation"] as const,
      minPlayers: 2,
      roundsPerPlayer: 1
    },
    {
      name: "Solo",
      rotation: ["animation"] as const,
      minPlayers: 1,
      roundsPerPlayer: 5
    },
  ];