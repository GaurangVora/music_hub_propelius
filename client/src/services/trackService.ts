import httpClient from './httpClient';
import { SearchResult, AddTrackData, MusicCollection } from '../types';

export const trackService = {
  searchTracks: async (query: string): Promise<SearchResult[]> => {
    const response = await httpClient.get(`/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  getNewReleases: async (limit: number = 20): Promise<SearchResult[]> => {
    const response = await httpClient.get(`/new-releases?limit=${limit}`);
    return response.data;
  },

  getFeaturedPlaylists: async (limit: number = 20): Promise<SearchResult[]> => {
    const response = await httpClient.get(`/featured?limit=${limit}`);
    return response.data;
  },

  getTrendingTracks: async (limit: number = 20): Promise<SearchResult[]> => {
    const response = await httpClient.get(`/trending?limit=${limit}`);
    return response.data;
  },

  addTrackToCollection: async (collectionId: string, trackData: AddTrackData): Promise<MusicCollection> => {
    const response = await httpClient.post(`/collections/${collectionId}/tracks`, trackData);
    return response.data;
  },

  removeTrackFromCollection: async (collectionId: string, trackId: string): Promise<MusicCollection> => {
    const response = await httpClient.delete(`/collections/${collectionId}/tracks/${trackId}`);
    return response.data;
  },
}; 