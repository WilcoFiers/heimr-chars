export interface RootState {
  loading: boolean
  user: User
  characters: Character[]
}

export interface User {
  signedIn: boolean
}

export interface Character {
  name: string
}

