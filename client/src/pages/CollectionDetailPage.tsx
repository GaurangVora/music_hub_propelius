import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  IconButton,
  Alert,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Fab,
  Tooltip
} from '@mui/material';
import {
  Add,
  Search,
  Delete,
  MusicNote,
  ArrowBack,
  Edit,
  Save,
  Cancel
} from '@mui/icons-material';
import { useUser } from '../contexts/UserContext';
import { collectionService } from '../services/collectionService';
import { trackService } from '../services/trackService';
import { MusicCollection, SearchResult } from '../types';

function CollectionDetailPage() {
  const { collectionId } = useParams<{ collectionId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [collection, setCollection] = useState<MusicCollection | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    if (collectionId) {
      loadCollection();
    }
  }, [collectionId]);

  const loadCollection = async () => {
    try {
      setIsLoading(true);
      const data = await collectionService.fetchCollection(collectionId!);
      setCollection(data);
      setEditTitle(data.title);
      setEditDescription(data.description || '');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to load collection');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setIsSearching(true);
      const results = await trackService.searchTracks(searchQuery);
      setSearchResults(results);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to search tracks');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddTrack = async (track: SearchResult) => {
    try {
      const updatedCollection = await trackService.addTrackToCollection(collectionId!, {
        spotifyTrackId: track.id,
        trackName: track.trackName,
        performer: track.performer,
        recordTitle: track.recordTitle,
        coverImage: track.coverImage
      });
      setCollection(updatedCollection);
      setSearchDialogOpen(false);
      setSearchQuery('');
      setSearchResults([]);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to add track');
    }
  };

  const handleRemoveTrack = async (trackId: string) => {
    try {
      const updatedCollection = await trackService.removeTrackFromCollection(collectionId!, trackId);
      setCollection(updatedCollection);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to remove track');
    }
  };

  const handleUpdateCollection = async () => {
    try {
      if (editTitle === '') {
        setError('Title is required');
        return;
      }
      const updatedCollection = await collectionService.updateCollection(collectionId!, {
        title: editTitle,
        description: editDescription
      });
      setCollection(updatedCollection);
      setIsEditing(false);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update collection');
    }
  };

  const handleDeleteCollection = async () => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      try {
        await collectionService.removeCollection(collectionId!);
        navigate('/');
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to delete collection');
      }
    }
  };

  if (!currentUser) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5">Please sign in to view collections</Typography>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!collection) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5">Collection not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' }, 
        mb: 3,
        gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            {isEditing ? (
              <Box>
                <TextField
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  variant="standard"
                  sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, fontWeight: 'bold', mb: 1 }}
                  fullWidth
                />
                <TextField
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  variant="standard"
                  placeholder="Add a description..."
                  fullWidth
                  multiline
                  rows={2}
                />
              </Box>
            ) : (
              <Box>
                <Typography variant="h4" gutterBottom>
                  {collection.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {collection.description || 'No description'}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          gap: 1,
          flexDirection: { xs: 'column', sm: 'row' },
          width: { xs: '100%', sm: 'auto' }
        }}>
          {isEditing ? (
            <>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleUpdateCollection}
                fullWidth={false}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={() => {
                  setIsEditing(false);
                  setEditTitle(collection.title);
                  setEditDescription(collection.description || '');
                }}
                fullWidth={false}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setIsEditing(true)}
                fullWidth={false}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={handleDeleteCollection}
                fullWidth={false}
              >
                Delete
              </Button>
            </>
          )}
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Tracks ({collection.tracks.length})
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setSearchDialogOpen(true)}
          >
            Add Tracks
          </Button>
        </Box>

        {collection.tracks.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'background.paper', borderRadius: 2 }}>
            <MusicNote sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No tracks yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Add some tracks to get started
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setSearchDialogOpen(true)}
            >
              Add Tracks
            </Button>
          </Box>
        ) : (
          <List>
            {collection.tracks.map((track, index) => (
              <React.Fragment key={track._id}>
                <ListItem
                  sx={{
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    mb: 1,
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar src={track.coverImage} alt={track.trackName}>
                      <MusicNote />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={track.trackName}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {track.performer}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {track.recordTitle}
                        </Typography>
                      </Box>
                    }
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveTrack(track._id)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </ListItem>
                {index < collection.tracks.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>

      <Dialog
        open={searchDialogOpen}
        onClose={() => setSearchDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Search and Add Tracks</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search for songs, artists, or albums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      onClick={handleSearch}
                      disabled={isSearching || !searchQuery.trim()}
                    >
                      {isSearching ? <CircularProgress size={20} /> : 'Search'}
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {searchResults.length > 0 && (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 2 }}>
              {searchResults.map((track) => (
                <Card key={track.id}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={track.coverImage || '/default-album.jpg'}
                    alt={track.trackName}
                  />
                  <CardContent>
                    <Typography variant="h6" noWrap>
                      {track.trackName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {track.performer}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {track.recordTitle}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      startIcon={<Add />}
                      onClick={() => handleAddTrack(track)}
                    >
                      Add to Collection
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSearchDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Tooltip title="Add Tracks">
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 16, right: 16, display: { sm: 'none' } }}
          onClick={() => setSearchDialogOpen(true)}
        >
          <Add />
        </Fab>
      </Tooltip>
    </Box>
  );
}

export default CollectionDetailPage; 