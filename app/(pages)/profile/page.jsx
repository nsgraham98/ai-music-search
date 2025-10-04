"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Divider,
  Button,
  Avatar,
  TextField,
} from "@mui/material";
import { useUserAuth } from "@/context/auth-context";
import NavigationBar from "@/app/components/navigation/nav-bar";

export default function ProfilePage() {
  const { user } = useUserAuth();
  const [darkMode, setDarkMode] = useState(true);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    }
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: darkMode ? '#1e1e1e' : '#f5f5f5',
      }}
    >
      <NavigationBar darkMode={darkMode} setDarkMode={setDarkMode} user={user} />
      
      <Container maxWidth="md" sx={{ mt: 4, pb: 4 }}>
        <Paper
          elevation={3}
          sx={{
            bgcolor: darkMode ? '#2e2d2d' : '#ffffff',
            color: darkMode ? 'white' : '#1e1e1e',
            p: 4,
            borderRadius: 2
          }}
        >
          <Box display="flex" alignItems="center" mb={4}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: '#E03FD8',
                fontSize: 32,
                mr: 3
              }}
            >
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Profile
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage your account information
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3, bgcolor: darkMode ? '#444' : '#e0e0e0' }} />

          {/* Profile Information */}
          <Box mb={4}>
            <Typography variant="h6" mb={2}>
              Account Information
            </Typography>
            
            <TextField
              fullWidth
              label="Email"
              value={user?.email || ''}
              disabled
              sx={{
                mb: 2,
                '& .MuiInputBase-input': {
                  color: darkMode ? 'white' : '#1e1e1e'
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#aaa' : '#666'
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: darkMode ? '#444' : '#ccc'
                  }
                }
              }}
            />

            <TextField
              fullWidth
              label="Display Name"
              placeholder="Enter your display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              sx={{
                mb: 2,
                '& .MuiInputBase-input': {
                  color: darkMode ? 'white' : '#1e1e1e'
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#aaa' : '#666'
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: darkMode ? '#444' : '#ccc'
                  },
                  '&:hover fieldset': {
                    borderColor: '#E03FD8'
                  }
                }
              }}
            />
          </Box>

          <Divider sx={{ mb: 3, bgcolor: darkMode ? '#444' : '#e0e0e0' }} />

          {/* Statistics */}
          <Box mb={4}>
            <Typography variant="h6" mb={2}>
              Your Stats
            </Typography>
            <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  textAlign: 'center',
                  bgcolor: darkMode ? '#3a3939' : '#f5f5f5'
                }}
              >
                <Typography variant="h4" color="#E03FD8" fontWeight="bold">
                  0
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Searches
                </Typography>
              </Paper>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  textAlign: 'center',
                  bgcolor: darkMode ? '#3a3939' : '#f5f5f5'
                }}
              >
                <Typography variant="h4" color="#E03FD8" fontWeight="bold">
                  0
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Favorites
                </Typography>
              </Paper>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  textAlign: 'center',
                  bgcolor: darkMode ? '#3a3939' : '#f5f5f5'
                }}
              >
                <Typography variant="h4" color="#E03FD8" fontWeight="bold">
                  0
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Downloads
                </Typography>
              </Paper>
            </Box>
          </Box>

          <Button
            variant="contained"
            sx={{
              bgcolor: '#E03FD8',
              '&:hover': { bgcolor: '#c133b9' },
              color: 'white'
            }}
          >
            Save Changes
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}