# Music Hub - Playlist Management System

### Start the Application

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/music-hub
JWT_SECRET=VALUE_HERE

SPOTIFY_CLIENT_ID=VALUE_HERE
SPOTIFY_CLIENT_SECRET=VALUE_HERE
```

Create a `.env` file in the `client` directory:

```env

```

Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

Run Server

```bash
# Start the server (from server directory)
cd server
npm run dev

# Start the client (from client directory, in a new terminal)
cd client
npm start
```

### API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/signin` - User login

### Collections
- `GET /collections` - Get user's collections
- `GET /collections/:id` - Get specific collection
- `POST /collections` - Create new collection
- `PUT /collections/:id` - Update collection
- `DELETE /collections/:id` - Delete collection

### Tracks
- `GET /search?q=query` - Search tracks
- `GET /trending` - Get trending tracks
- `GET /new-releases` - Get new releases
- `GET /featured` - Get featured playlists
- `POST /collections/:id/tracks` - Add track to collection
- `DELETE /collections/:id/tracks/:trackId` - Remove track from collection
