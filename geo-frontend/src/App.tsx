import { Routes, Route, Link } from 'react-router-dom';
import { 
  AppBar, Toolbar, Typography, Button, Container, Box, 
  Paper, Grid, Card, CardContent 
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';

import LanguageIcon from '@mui/icons-material/Language';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import PublicIcon from '@mui/icons-material/Public';
import FlagIcon from '@mui/icons-material/Flag';
import LocationCityIcon from '@mui/icons-material/LocationCity';

import ContinentesPage from './Continentes';
import PaisesPage from './Paises';
import CidadesPage from './Cidades';

const cappuccinoTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#5D4037' },
    secondary: { main: '#8D6E63' },
    background: { default: '#EFEBE9', paper: '#FFFFFF' },
    text: { primary: '#3E2723', secondary: '#5D4037' }
  },
  typography: {
    fontFamily: '"Lora", "Roboto", "Arial", sans-serif',
    h4: { fontWeight: 600 },
    h6: { fontWeight: 600 }
  }
});

const Home = () => (
  <Box sx={{ mt: 4 }}>
    <Paper elevation={3} className="banner-cafeteria">
      <Box display="flex" alignItems="center" gap={2}>
        <LocalCafeIcon sx={{ fontSize: 50 }} />
        <Box>
          <Typography variant="h3" gutterBottom>Geo Sistema</Typography>
          <Typography variant="h6">Gerenciamento geográfico com elegância.</Typography>
        </Box>
      </Box>
    </Paper>

    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Card className="card-personalizado" sx={{ height: '100%', borderTop: '4px solid #5D4037' }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <PublicIcon color="primary" />
              <Typography variant="h5" color="primary">Continentes</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">Gerencie os grandes blocos de terra.</Typography>
            <Button component={Link} to="/continentes" variant="contained" color="primary" sx={{ mt: 2 }}>Acessar</Button>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid size={{ xs: 12, md: 4 }}>
        <Card className="card-personalizado" sx={{ height: '100%', borderTop: '4px solid #6D4C41' }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <FlagIcon color="primary" />
              <Typography variant="h5" color="primary">Países</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">Cadastre nações e populações.</Typography>
            <Button component={Link} to="/paises" variant="contained" color="primary" sx={{ mt: 2 }}>Acessar</Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Card className="card-personalizado" sx={{ height: '100%', borderTop: '4px solid #8D6E63' }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <LocationCityIcon color="primary" />
              <Typography variant="h5" color="primary">Cidades</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">Controle urbano e clima.</Typography>
            <Button component={Link} to="/cidades" variant="contained" color="primary" sx={{ mt: 2 }}>Acessar</Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Box>
);

function App() {
  return (
    <ThemeProvider theme={cappuccinoTheme}>
      <CssBaseline />
      
      <AppBar position="static" color="primary">
        <Toolbar>
          <LanguageIcon sx={{ mr: 2, color: '#EFEBE9' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#EFEBE9' }}>
            GEO SYSTEM
          </Typography>
          
          <Button sx={{ color: '#EFEBE9' }} component={Link} to="/">Início</Button>
          <Button sx={{ color: '#EFEBE9' }} component={Link} to="/continentes">Continentes</Button>
          <Button sx={{ color: '#EFEBE9' }} component={Link} to="/paises">Países</Button>
          <Button sx={{ color: '#EFEBE9' }} component={Link} to="/cidades">Cidades</Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/continentes" element={<ContinentesPage />} />
          <Route path="/paises" element={<PaisesPage />} />
          <Route path="/cidades" element={<CidadesPage />} />
        </Routes>
      </Container>
    </ThemeProvider>
  );
}

export default App;