# Sports Arena Backend

A comprehensive backend API for the Sports Arena multi-sport scoring and tournament management system.

## 🚀 Features

- **Multi-Sport Support**: Cricket, Football, Basketball, Chess, Volleyball, Badminton, Table Tennis
- **Real-time Scoring**: Socket.IO integration for live score updates
- **Tournament Management**: Complete tournament lifecycle management
- **Team Management**: Team registration and player management
- **Authentication & Authorization**: JWT-based auth with role-based access
- **Database**: MongoDB with Mongoose ODM
- **Security**: Helmet, CORS, Rate limiting, Input validation
- **Performance**: Compression, Morgan logging, Error handling

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Real-time**: Socket.IO
- **Authentication**: JWT
- **Language**: TypeScript
- **Security**: Helmet, CORS, Rate limiting
- **Validation**: Express-validator

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sports-arena/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   Update the `.env` file with your configuration.

4. **Database Setup**
   - Install MongoDB locally or use MongoDB Atlas
   - Update `MONGODB_URI` in `.env`

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── models/           # MongoDB schemas
│   │   ├── User.ts
│   │   ├── Tournament.ts
│   │   ├── Team.ts
│   │   ├── Match.ts
│   │   ├── CricketScoring.ts
│   │   ├── FootballScoring.ts
│   │   ├── BasketballScoring.ts
│   │   ├── ChessScoring.ts
│   │   ├── VolleyballScoring.ts
│   │   ├── BadmintonScoring.ts
│   │   └── TableTennisScoring.ts
│   ├── routes/           # API routes
│   │   ├── auth.ts
│   │   ├── tournaments.ts
│   │   ├── teams.ts
│   │   ├── matches.ts
│   │   ├── scoring.ts
│   │   └── users.ts
│   ├── middleware/       # Custom middleware
│   │   ├── auth.ts
│   │   └── errorHandler.ts
│   ├── socket/           # Socket.IO handlers
│   │   └── socketHandlers.ts
│   └── server.ts         # Main server file
├── dist/                 # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Tournaments
- `GET /api/tournaments` - Get all tournaments
- `GET /api/tournaments/:id` - Get tournament by ID
- `POST /api/tournaments` - Create tournament
- `PUT /api/tournaments/:id` - Update tournament
- `DELETE /api/tournaments/:id` - Delete tournament

### Teams
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get team by ID
- `POST /api/teams` - Create team
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team

### Matches
- `GET /api/matches` - Get all matches
- `GET /api/matches/:id` - Get match by ID
- `POST /api/matches` - Create match
- `POST /api/matches/:id/start` - Start match
- `POST /api/matches/:id/end` - End match
- `PUT /api/matches/:id` - Update match
- `DELETE /api/matches/:id` - Delete match

### Scoring
- `GET /api/scoring/:matchId` - Get scoring data
- `POST /api/scoring/cricket/init` - Initialize cricket scoring
- `POST /api/scoring/cricket/update` - Update cricket score
- `POST /api/scoring/football/init` - Initialize football scoring
- `POST /api/scoring/football/update` - Update football score
- Similar endpoints for other sports...

## 🔌 Socket.IO Events

### Client to Server
- `join-match` - Join match room
- `leave-match` - Leave match room
- `cricket-score-update` - Update cricket score
- `football-score-update` - Update football score
- `basketball-score-update` - Update basketball score
- `chess-score-update` - Update chess score
- `volleyball-score-update` - Update volleyball score
- `badminton-score-update` - Update badminton score
- `table-tennis-score-update` - Update table tennis score

### Server to Client
- `cricket-score-updated` - Cricket score updated
- `football-score-updated` - Football score updated
- `basketball-score-updated` - Basketball score updated
- `chess-score-updated` - Chess score updated
- `volleyball-score-updated` - Volleyball score updated
- `badminton-score-updated` - Badminton score updated
- `table-tennis-score-updated` - Table tennis score updated

## 🗄️ Database Schema

### Core Models
- **User**: Authentication and user management
- **Tournament**: Tournament information and settings
- **Team**: Team registration and player management
- **Match**: Match information and basic scoring

### Sport-Specific Scoring Models
- **CricketScoring**: Detailed cricket scoring with overs, runs, wickets
- **FootballScoring**: Football scoring with goals, cards, substitutions
- **BasketballScoring**: Basketball scoring with quarters, fouls, player stats
- **ChessScoring**: Chess scoring with moves, time control, results
- **VolleyballScoring**: Volleyball scoring with sets and rally scoring
- **BadmintonScoring**: Badminton scoring with games and points
- **TableTennisScoring**: Table tennis scoring with games and service rotation

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Authorization**: Admin, Scorer, Viewer roles
- **Input Validation**: Express-validator for request validation
- **Rate Limiting**: Prevent API abuse
- **CORS**: Cross-origin resource sharing configuration
- **Helmet**: Security headers
- **Password Hashing**: bcryptjs for secure password storage

## 🚀 Deployment

### Environment Variables
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/sports-arena
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=https://your-frontend-domain.com
```

### Production Build
```bash
npm run build
npm start
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 5000
CMD ["npm", "start"]
```

## 📊 Performance Optimizations

- **Database Indexing**: Optimized queries with proper indexes
- **Compression**: Gzip compression for responses
- **Connection Pooling**: MongoDB connection pooling
- **Rate Limiting**: API rate limiting to prevent abuse
- **Caching**: Strategic caching for frequently accessed data

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run with coverage
npm run test:coverage
```

## 📝 API Documentation

The API follows RESTful conventions with comprehensive error handling and validation. All endpoints return JSON responses with consistent structure:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.

