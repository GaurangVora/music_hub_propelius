export interface UserAccount {
  id: string;
  displayName: string;
  emailAddress: string;
}

export interface MusicCollection {
  _id: string;
  title: string;
  description: string;
  owner: string;
  tracks: MusicTrack[];
  createdAt: string;
  updatedAt: string;
}

export interface MusicTrack {
  _id: string;
  spotifyTrackId: string;
  trackName: string;
  performer: string;
  recordTitle: string;
  coverImage?: string;
}

export interface SearchResult {
  id: string;
  trackName: string;
  performer: string;
  recordTitle: string;
  coverImage?: string;
}

export interface CreateCollectionData {
  title: string;
  description?: string;
}

export interface UpdateCollectionData {
  title: string;
  description?: string;
}

export interface AddTrackData {
  spotifyTrackId: string;
  trackName: string;
  performer: string;
  recordTitle: string;
  coverImage?: string;
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  userAccount: {
    id: string;
    displayName: string;
    emailAddress: string;
  };
}

export interface SignUpData {
  displayName: string;
  emailAddress: string;
  secretKey: string;
}

export interface SignInData {
  emailAddress: string;
  secretKey: string;
} 