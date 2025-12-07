import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, Button, Container, TextField, Typography, Paper, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  MenuItem, Select, InputLabel, FormControl, Card, CardContent, Grid, IconButton
} from '@mui/material';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Cidade {
  id: number;
  nome: string;
  populacao: number;
  latitude: number;
  longitude: number;
  paisId: number;
  pais: { nome: string };
}

interface Pais { id: number; nome: string; }
interface ClimaAPI { temperature: number; windspeed: number; }

export default function Cidades() {
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [paises, setPaises] = useState<Pais[]>([]);
  
  const [nome, setNome] = useState('');
  const [populacao, setPopulacao] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [paisId, setPaisId] = useState('');

  const [idEditando, setIdEditando] = useState<number | null>(null);
  const [clima, setClima] = useState<ClimaAPI | null>(null);
  const [cidadeClima, setCidadeClima] = useState('');

  useEffect(() => { carregarDados(); }, []);

  const carregarDados = async () => {
    try {
      const respCidades = await axios.get('http://localhost:3000/cidades');
      const respPaises = await axios.get('http://localhost:3000/paises');
      setCidades(respCidades.data);
      setPaises(respPaises.data);
    } catch (erro) { console.error(erro); }
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Salvando cidade:", { nome, latitude, longitude });

    try {
      const payload = { nome, populacao, latitude, longitude, paisId };
      if (idEditando) {
        await axios.put(`http://localhost:3000/cidades/${idEditando}`, payload);
      } else {
        await axios.post('http://localhost:3000/cidades', payload);
      }
      limparFormulario();
      carregarDados();
    } catch (erro) { alert('Erro ao salvar.'); }
  };

  const handleEditar = (c: Cidade) => {
    setNome(c.nome);
    setPopulacao(String(c.populacao));
    setLatitude(String(c.latitude));
    setLongitude(String(c.longitude));
    setPaisId(String(c.paisId));
    setIdEditando(c.id);
  };

  const handleExcluir = async (id: number) => {
    if (!confirm('Tem certeza?')) return;
    try {
      await axios.delete(`http://localhost:3000/cidades/${id}`);
      carregarDados();
    } catch (erro) { alert('Erro ao excluir.'); }
  };

  const limparFormulario = () => {
    setNome(''); setPopulacao(''); setLatitude(''); setLongitude(''); setPaisId('');
    setIdEditando(null);
  };

  const verClima = async (lat: number, lon: number, nomeCidade: string) => {
    try {
      setClima(null);
      console.log("Consultando clima", lat, lon);
      const resp = await axios.get(`http://localhost:3000/clima?lat=${lat}&lon=${lon}`);
      setClima(resp.data);
      setCidadeClima(nomeCidade);
    } catch (erro) { alert('Erro ao buscar clima.'); }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <LocationCityIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h4" color="primary">Gerenciar Cidades</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper className="form-container">
            <Typography variant="h6" gutterBottom>{idEditando ? 'Editar' : 'Nova'} Cidade</Typography>
            <Box component="form" onSubmit={handleSalvar} display="flex" flexDirection="column" gap={2}>
              <Box display="flex" gap={2}>
                <TextField label="Nome" size="small" value={nome} onChange={e => setNome(e.target.value)} fullWidth />
                <TextField label="População" type="number" size="small" value={populacao} onChange={e => setPopulacao(e.target.value)} fullWidth />
              </Box>
              <Box display="flex" gap={2}>
                <TextField label="Latitude" size="small" value={latitude} onChange={e => setLatitude(e.target.value)} fullWidth />
                <TextField label="Longitude" size="small" value={longitude} onChange={e => setLongitude(e.target.value)} fullWidth />
              </Box>
              <FormControl fullWidth size="small">
                <InputLabel>País</InputLabel>
                <Select value={paisId} label="País" onChange={e => setPaisId(e.target.value)}>
                  {paises.map(p => <MenuItem key={p.id} value={p.id}>{p.nome}</MenuItem>)}
                </Select>
              </FormControl>
              
              <Box display="flex" gap={1}>
                <Button type="submit" variant="contained" color={idEditando ? "warning" : "primary"} fullWidth>
                  {idEditando ? 'Atualizar' : 'Salvar'}
                </Button>
                {idEditando && <Button variant="outlined" onClick={limparFormulario} fullWidth>Cancelar</Button>}
              </Box>
            </Box>
          </Paper>

          <TableContainer component={Paper}>
            <Table>
              <TableHead className="tabela-header">
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>País</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cidades.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.nome}</TableCell>
                    <TableCell>{c.pais?.nome}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleEditar(c)}><EditIcon /></IconButton>
                      <IconButton color="error" onClick={() => handleExcluir(c.id)}><DeleteIcon /></IconButton>
                      <Button size="small" sx={{ ml: 1 }} onClick={() => verClima(c.latitude, c.longitude, c.nome)}>
                        <ThermostatIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          {clima && (
            <Card className="card-api">
              <CardContent>
                <ThermostatIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" color="primary">Clima em {cidadeClima}</Typography>
                <Typography variant="h3">{clima.temperature}°C</Typography>
                <Typography>Vento: {clima.windspeed} km/h</Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}