type Rooms = Map<
  string,
  {
    gameStarted: boolean,
    users: {
      name: string
      id: string
      isAdmin: boolean
      done: boolean
    }[]
  }
>

export type { Rooms }
