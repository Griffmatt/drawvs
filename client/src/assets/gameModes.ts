export const GAME_MODES = [
    {
      name: "Normal",
      rotation: ["prompt", "draw"] as const
    },
    {
      name: "Story",
      rotation: ["story"] as const
    },
    {
      name: "Animation",
      rotation: ["animation"] as const
    },
  ];