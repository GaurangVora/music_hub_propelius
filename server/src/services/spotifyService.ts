import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

const getAccessToken = async () => {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body.access_token);
    return data.body.access_token;
  } catch (error) {
    console.error('Error getting Spotify access token:', error);
    throw error;
  }
};

export const searchTracks = async (query: string, limit: number = 10) => {
  try {
    await getAccessToken();

    const response = await spotifyApi.searchTracks(query, {
      limit,
      offset: 0,
    });

    return response.body.tracks?.items.map(track => ({
      id: track.id,
      trackName: track.name,
      performer: track.artists.map(artist => artist.name).join(', '),
      recordTitle: track.album.name,
      coverImage: track.album.images[0]?.url || '',
      duration: track.duration_ms,
      previewUrl: track.preview_url,
    })) || [];
  } catch (error) {
    console.error('Error searching Spotify tracks:', error);
    throw error;
  }
};

export const getTrack = async (trackId: string) => {
  try {
    await getAccessToken();

    const response = await spotifyApi.getTrack(trackId);
    const track = response.body;

    return {
      id: track.id,
      trackName: track.name,
      performer: track.artists.map(artist => artist.name).join(', '),
      recordTitle: track.album.name,
      coverImage: track.album.images[0]?.url || '',
      duration: track.duration_ms,
      previewUrl: track.preview_url,
    };
  } catch (error) {
    console.error('Error getting Spotify track:', error);
    throw error;
  }
};

export const getNewReleases = async (limit: number = 20) => {
  try {
    await getAccessToken();

    const response = await spotifyApi.getNewReleases({ limit, country: 'US' });
    
    return response.body.albums?.items.map(album => ({
      id: album.id,
      trackName: album.name,
      performer: album.artists.map(artist => artist.name).join(', '),
      recordTitle: album.name,
      coverImage: album.images[0]?.url || '',
      releaseDate: album.release_date,
      albumType: album.album_type,
    })) || [];
  } catch (error) {
    console.error('Error getting new releases:', error);
    throw error;
  }
};

export const getFeaturedPlaylists = async (limit: number = 20) => {
  try {
    await getAccessToken();

    const response = await spotifyApi.getFeaturedPlaylists({ limit, country: 'US' });
    
    return response.body.playlists?.items.map(playlist => ({
      id: playlist.id,
      trackName: playlist.name,
      performer: playlist.owner.display_name,
      recordTitle: playlist.description || '',
      coverImage: playlist.images[0]?.url || '',
      trackCount: playlist.tracks.total,
    })) || [];
  } catch (error) {
    console.error('Error getting featured playlists:', error);
    throw error;
  }
};

export const getTopTracks = async (limit: number = 20) => {
  try {
    await getAccessToken();

    const response = await spotifyApi.getPlaylistTracks('37i9dQZEVXbMDoHDwVN2tF', { limit });
    
    return response.body.items?.map(item => ({
      id: item.track?.id || '',
      trackName: item.track?.name || '',
      performer: item.track?.artists.map(artist => artist.name).join(', ') || '',
      recordTitle: item.track?.album.name || '',
      coverImage: item.track?.album.images[0]?.url || '',
      duration: item.track?.duration_ms || 0,
      previewUrl: item.track?.preview_url || '',
    })).filter(track => track.id) || [];
  } catch (error) {
    console.error('Error getting top tracks:', error);
    throw error;
  }
}; 