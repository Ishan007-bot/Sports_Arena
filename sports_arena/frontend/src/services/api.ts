const API_BASE_URL = 'http://localhost:5000/api';

// Tournament API calls
export const tournamentAPI = {
  // Create tournament
  create: async (tournament: any) => {
    const response = await fetch(`${API_BASE_URL}/tournaments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tournament),
    });
    return response.json();
  },

  // Get all tournaments
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/tournaments`);
    return response.json();
  },

  // Get tournament by ID
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/tournaments/${id}`);
    return response.json();
  },

  // Update tournament
  update: async (id: string, tournament: any) => {
    const response = await fetch(`${API_BASE_URL}/tournaments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tournament),
    });
    return response.json();
  },

  // Delete tournament
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/tournaments/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }
};

// Match API calls
export const matchAPI = {
  // Create match
  create: async (match: any) => {
    const response = await fetch(`${API_BASE_URL}/matches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(match),
    });
    return response.json();
  },

  // Get all matches
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/matches`);
    return response.json();
  },

  // Get matches by tournament
  getByTournament: async (tournamentId: string) => {
    const response = await fetch(`${API_BASE_URL}/matches/tournament/${tournamentId}`);
    return response.json();
  },

  // Update match
  update: async (id: string, match: any) => {
    const response = await fetch(`${API_BASE_URL}/matches/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(match),
    });
    return response.json();
  },

  // Update match status
  updateStatus: async (id: string, status: string) => {
    const response = await fetch(`${API_BASE_URL}/matches/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    return response.json();
  },

  // Delete match
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/matches/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }
};

// Team API calls
export const teamAPI = {
  // Create team
  create: async (team: any) => {
    const response = await fetch(`${API_BASE_URL}/teams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(team),
    });
    return response.json();
  },

  // Get all teams
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/teams`);
    return response.json();
  },

  // Update team
  update: async (id: string, team: any) => {
    const response = await fetch(`${API_BASE_URL}/teams/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(team),
    });
    return response.json();
  },

  // Delete team
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/teams/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }
};

// Scoring API calls
export const scoringAPI = {
  // Update match score
  updateScore: async (matchId: string, scoringData: any) => {
    const response = await fetch(`${API_BASE_URL}/scoring/${matchId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scoringData),
    });
    return response.json();
  },

  // Get match scoring data
  getScoring: async (matchId: string) => {
    const response = await fetch(`${API_BASE_URL}/scoring/${matchId}`);
    return response.json();
  }
};

