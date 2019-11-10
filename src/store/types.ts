export interface RootState {
  loading: boolean;
  user: User;
  characters: Character[];
}

export interface User {
  signedIn: boolean;
  displayName: string | null;
}

export interface Character {
  name: string;
}
