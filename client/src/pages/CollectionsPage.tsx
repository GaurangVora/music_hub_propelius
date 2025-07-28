import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  Add,
  Visibility,
  Delete,
  MusicNote,
  PlaylistPlay
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { collectionService } from '../services/collectionService';
import { MusicCollection } from '../types';

const collectionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});

type CollectionFormInputs = z.infer<typeof collectionSchema>;

function CollectionsPage() {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const [collections, setCollections] = useState<MusicCollection[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CollectionFormInputs>({
    resolver: zodResolver(collectionSchema),
  });

  useEffect(() => {
    const loadCollections = async () => {
      try {
        setIsLoading(true);
        const data = await collectionService.fetchCollections();
        setCollections(data);
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to load collections');
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
      loadCollections();
    }
  }, [currentUser]);

  const onSubmit = async (data: CollectionFormInputs) => {
    try {
      const newCollection = await collectionService.createCollection(data);
      setCollections([...collections, newCollection]);
      setOpenDialog(false);
      reset();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create collection');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await collectionService.removeCollection(id);
      setCollections(collections.filter(collection => collection._id !== id));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to delete collection');
    }
  };

  const handleViewCollection = (id: string) => {
    navigate(`/collection/${id}`);
  };

  if (!currentUser) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5">Please sign in to view your collections</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'center' }, 
        mb: 4,
        gap: 2
      }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Your Collections
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Organize your favorite music into personalized collections
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
          sx={{ textTransform: 'none', minWidth: { xs: '100%', sm: 'auto' } }}
        >
          New Collection
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(auto-fill, minmax(280px, 1fr))',
            md: 'repeat(auto-fill, minmax(300px, 1fr))'
          }, 
          gap: { xs: 2, sm: 3 } 
        }}>
          {collections.map((collection) => (
            <Card 
              key={collection._id}
              elevation={2} 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <MusicNote sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" component="h2">
                    {collection.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {collection.description || 'No description'}
                </Typography>
                <Chip
                  icon={<PlaylistPlay />}
                  label={`${collection.tracks.length} tracks`}
                  size="small"
                  variant="outlined"
                />
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                <Button
                  size="small"
                  startIcon={<Visibility />}
                  onClick={() => handleViewCollection(collection._id)}
                >
                  View
                </Button>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDelete(collection._id)}
                >
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}

      {collections.length === 0 && !isLoading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <MusicNote sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No collections yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your first collection to start organizing your music
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
          >
            Create Collection
          </Button>
        </Box>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Collection</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              label="Collection Title"
              fullWidth
              margin="normal"
              {...register('title')}
              error={!!errors.title}
              helperText={errors.title?.message}
            />
            <TextField
              label="Description (optional)"
              fullWidth
              margin="normal"
              multiline
              rows={3}
              {...register('description')}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Create</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default CollectionsPage; 