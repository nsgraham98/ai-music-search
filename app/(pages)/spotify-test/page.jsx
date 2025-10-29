"use client";
import React, { useState } from "react";
import { useUserAuth } from "@/context/auth-context";
import { startSpotifyAuth } from "@/lib/spotify-client-auth";

export default function SpotifyTestPage() {
  const authContext = useUserAuth();
  const user = authContext?.authUser;
  const [searchQuery, setSearchQuery] = useState("rock music");
  const [searchResults, setSearchResults] = useState(null);
  const [trackDetails, setTrackDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authStatus, setAuthStatus] = useState('Not connected');

  // Handle OAuth callback results and URL parameters
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Check for Spotify connection results
    const spotify = urlParams.get('spotify');
    const error = urlParams.get('error');
    const details = urlParams.get('details');
    const message = urlParams.get('message');
    const tempUid = urlParams.get('temp_uid');
    
    console.log('URL params:', { spotify, error, details, message, tempUid });
    
    if (spotify === 'connected') {
      if (tempUid) {
        setAuthStatus(`Connected with temporary UID: ${tempUid}`);
      } else {
        setAuthStatus('Connected successfully!');
      }
      // Clear the URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (error) {
      let errorMessage = `Spotify error: ${error}`;
      if (details) errorMessage += ` - Details: ${decodeURIComponent(details)}`;
      if (message) errorMessage += ` - Message: ${decodeURIComponent(message)}`;
      setError(errorMessage);
      setAuthStatus('Connection failed');
    }
    
    // Display URL parameters for debugging
    if (urlParams.toString()) {
      console.log('Current URL parameters:', urlParams.toString());
    }
  }, []);

  // Test Spotify authentication using the client helper
  const handleSpotifyAuth = async () => {
    console.log('handleSpotifyAuth called');
    console.log('User state:', user ? 'authenticated' : 'not authenticated');
    
    if (!user) {
      setError('Please log in first');
      return;
    }
    
    try {
      setError(null); // Clear any previous errors
      setAuthStatus('Initiating Spotify connection...');
      console.log('About to call startSpotifyAuth...');
      await startSpotifyAuth(user);
    } catch (error) {
      console.error('Auth error in handleSpotifyAuth:', error);
      setError(`Auth error: ${error.message}`);
      setAuthStatus('Connection failed');
    }
  };

  // Test Spotify search
  const testSpotifySearch = async () => {
    if (!user) {
      setError('Please log in first');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const token = await user.getIdToken();
      
      const response = await fetch('/api/spotify/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: searchQuery, // Single query for testing
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Search failed');
      }

      setSearchResults(data);
      setAuthStatus('Connected and working!');
    } catch (error) {
      setError(`Search error: ${error.message}`);
      if (error.message.includes('authentication')) {
        setAuthStatus('Not connected - need to authenticate');
      }
    } finally {
      setLoading(false);
    }
  };

  // Test getting specific track details
  const testTrackDetails = async (trackId) => {
    if (!user) return;

    setLoading(true);
    try {
      const token = await user.getIdToken();
      
      const response = await fetch(`/api/spotify/track?id=${trackId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Track fetch failed');
      }

      setTrackDetails(data);
    } catch (error) {
      setError(`Track details error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Make the auth function available globally for testing
  React.useEffect(() => {
    window.testSpotifyAuth = handleSpotifyAuth;
    window.testUser = user;
  }, [user]);

  return (
    <div style={{ padding: "2rem", maxWidth: "800px" }}>
      <h1>Spotify API Test Page</h1>
      
      {/* Auth Status */}
      <div style={{ marginBottom: "2rem", padding: "1rem", backgroundColor: "#f5f5f5", borderRadius: "4px" }}>
        <h3>Authentication Status: <span style={{ color: authStatus.includes('Connected') ? 'green' : 'red' }}>{authStatus}</span></h3>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <button 
            onClick={handleSpotifyAuth}
            style={{ padding: "0.5rem 1rem", backgroundColor: "#1db954", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            Connect to Spotify
          </button>
          <button 
            onClick={async () => {
              if (!user) {
                setError('Please log in first');
                return;
              }
              try {
                const token = await user.getIdToken();
                const response = await fetch('/api/spotify/accesstoken/init', {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ code_verifier: 'test123' })
                });
                const result = await response.json();
                console.log('Init test result:', response.status, result);
                if (response.ok) {
                  setAuthStatus('Init endpoint works!');
                } else {
                  setError(`Init test failed: ${result.error}`);
                }
              } catch (error) {
                setError(`Init test error: ${error.message}`);
              }
            }}
            style={{ padding: "0.5rem 1rem", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            Test Init Endpoint
          </button>
        </div>
      </div>

      {/* Search Test */}
      <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "4px" }}>
        <h3>Test Spotify Search API</h3>
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter search query"
            style={{ padding: "0.5rem", width: "300px", marginRight: "1rem" }}
          />
          <button 
            onClick={testSpotifySearch}
            disabled={loading}
            style={{ padding: "0.5rem 1rem", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            {loading ? 'Searching...' : 'Search Spotify'}
          </button>
        </div>
        
        {searchResults && (
          <div>
            <h4>Search Results ({searchResults.totalFound} found):</h4>
            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              {searchResults.results?.map((track, index) => (
                <div key={track.id} style={{ padding: "0.5rem", border: "1px solid #eee", marginBottom: "0.5rem" }}>
                  <strong>{track.name}</strong> by {track.artist_name}
                  <br />
                  <small>Album: {track.album_name} | Duration: {track.duration}s</small>
                  <br />
                  <button 
                    onClick={() => testTrackDetails(track.id)}
                    style={{ marginTop: "0.25rem", padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}
                  >
                    Get Details
                  </button>
                  {track.audio && (
                    <audio controls style={{ marginLeft: "1rem", height: "30px" }}>
                      <source src={track.audio} type="audio/mpeg" />
                    </audio>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Track Details Test */}
      {trackDetails && (
        <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "4px" }}>
          <h3>Track Details:</h3>
          <pre style={{ backgroundColor: "#f8f9fa", padding: "1rem", borderRadius: "4px", overflow: "auto" }}>
            {JSON.stringify(trackDetails, null, 2)}
          </pre>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div style={{ padding: "1rem", backgroundColor: "#ffe6e6", color: "#d8000c", borderRadius: "4px", marginTop: "1rem" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Debug Info */}
      <div style={{ marginTop: "2rem", padding: "1rem", backgroundColor: "#f8f9fa", borderRadius: "4px", fontSize: "0.9rem" }}>
        <h4>Debug Info:</h4>
        <p><strong>User logged in:</strong> {user ? 'Yes' : 'No'}</p>
        <p><strong>Current search query:</strong> {searchQuery}</p>
        <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
        <p><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
        <p><strong>URL Parameters:</strong> {typeof window !== 'undefined' ? window.location.search : 'N/A'}</p>
        
        <h5>Available API Routes:</h5>
        <ul>
          <li><code>POST /api/spotify/search</code> - Search for tracks</li>
          <li><code>GET /api/spotify/track?id=TRACK_ID</code> - Get track details</li>
          <li><code>GET /api/spotify/callback</code> - OAuth callback handler</li>
          <li><code>POST /api/spotify/accesstoken/init</code> - Initialize auth (store code_verifier)</li>
        </ul>
      </div>
    </div>
  );
}
