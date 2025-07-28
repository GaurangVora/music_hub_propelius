import httpClient from './httpClient';
import { MusicCollection, CreateCollectionData, UpdateCollectionData } from '../types';

export const collectionService = {
  fetchCollections: async (): Promise<MusicCollection[]> => {
    const response = await httpClient.get('/collections');
    return response.data;
  },

  fetchCollection: async (id: string): Promise<MusicCollection> => {
    const response = await httpClient.get(`/collections/${id}`);
    return response.data;
  },

  createCollection: async (data: CreateCollectionData): Promise<MusicCollection> => {
    const response = await httpClient.post('/collections', data);
    return response.data;
  },

  updateCollection: async (id: string, data: UpdateCollectionData): Promise<MusicCollection> => {
    const response = await httpClient.put(`/collections/${id}`, data);
    return response.data;
  },

  removeCollection: async (id: string): Promise<{ message: string }> => {
    const response = await httpClient.delete(`/collections/${id}`);
    return response.data;
  },
}; 