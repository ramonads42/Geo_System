import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, Button, Container, TextField, Typography, Paper, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  MenuItem, Select, InputLabel, FormControl, Card, CardContent, CardMedia, Grid, IconButton
} from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';
import PublicIcon from '@mui/icons-material/Public';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Pais {
  id: number;
  nome: string;
  populacao: number;
  idioma: string;
  moeda: string;
  continenteId: number;
  continente: { nome: string };
}

interface Continente {
  id: number;
  nome: string;
}

interface DadosAPI {
  nomeOficial: string;
  bandeira: string;
  regiao: string;
}

export default function Paises() {
  const [paises, setPaises] = useState<Pais[]>([]);
  const [continentes, setContinentes] = useState<Continente[]>([]);
  
  const [nome, setNome] = useState('');
  const [populacao, setPopulacao] = useState('');
  const [idioma, setIdioma] = useState('');
  const [moeda, setMoeda] = useState('');
  const [continenteId, setContinenteId] = useState('');

  const [idEditando, setIdEditando] = useState<number | null>(null);
  const [dadosApi, setDadosApi] = useState<DadosAPI | null>(null);

  useEffect(() => { carregarDados(); }, []);

  const carregarDados = async () => {
    try {
      const respPaises = await axios.get('http://localhost:3000/paises');
      const respContinentes = await axios.get('http://localhost:3000/continentes');
      setPaises(respPaises.data);
      setContinentes(respContinentes.data);
    } catch (erro) { console.error("Erro ao carregar:", erro); }
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Enviando país:", { nome, populacao, continenteId });

    try {
      const payload = { nome, populacao, idioma, moeda, continenteId };
      
      if (idEditando) {
        await axios.put(`http://localhost:3000/paises/${idEditando}`, payload);
        setIdEditando(null);
      } else {
        await axios.post('http://localhost:3000/paises', payload);
      }

      limparFormulario();
      carregarDados();
    } catch (erro) { alert('Erro ao salvar país.'); }
  };

  const handleEditar = (p: Pais) => {
    setNome(p.nome);
    setPopulacao(String(p.populacao));
    setIdioma(p.idioma);
    setMoeda(p.moeda);
    setContinenteId(String(p.continenteId));
    setIdEditando(p.id);
  };

  const handleExcluir = async (id: number) => {
    if (!confirm('Tem certeza?')) return;
    try {
      await axios.delete(`http://localhost:3000/paises/${id}`);
      carregarDados();
    } catch (erro) { console.error("Erro ao deletar", erro); }
  };

  const limparFormulario = () => {
    setNome(''); setPopulacao(''); setIdioma(''); setMoeda(''); setContinenteId('');
    setIdEditando(null);
  };

  const verBandeira = async (nomePais: string) => {
    console.log("Buscando bandeira para:", nomePais);
    try {
      setDadosApi(null);
      const resp = await axios.get(`http://localhost:3000/info-pais/${nomePais}`);
      setDadosApi(resp.data);
    } catch (erro) { alert('País não encontrado na API.'); }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <FlagIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h4" color="primary">Gerenciar Países</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper className="form-container">
            <Typography variant="h6" gutterBottom>
              {idEditando ? 'Editar País' : 'Novo País'}
            </Typography>
            <Box component="form" onSubmit={handleSalvar} display="flex" flexDirection="column" gap={2}>
              <Box display="flex" gap={2}>
                <TextField label="Nome" size="small" value={nome} onChange={e => setNome(e.target.value)} fullWidth />
                <TextField label="População" type="number" size="small" value={populacao} onChange={e => setPopulacao(e.target.value)} fullWidth />
              </Box>
              <Box display="flex" gap={2}>
                <TextField label="Idioma" size="small" value={idioma} onChange={e => setIdioma(e.target.value)} fullWidth />
                <TextField label="Moeda" size="small" value={moeda} onChange={e => setMoeda(e.target.value)} fullWidth />
              </Box>
              <FormControl fullWidth size="small">
                <InputLabel>Continente</InputLabel>
                <Select value={continenteId} label="Continente" onChange={e => setContinenteId(e.target.value)}>
                  {continentes.map(c => <MenuItem key={c.id} value={c.id}>{c.nome}</MenuItem>)}
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
                  <TableCell>Continente</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paises.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.nome}</TableCell>
                    <TableCell>{p.continente?.nome}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleEditar(p)}><EditIcon /></IconButton>
                      <IconButton color="error" onClick={() => handleExcluir(p.id)}><DeleteIcon /></IconButton>
                      <Button size="small" sx={{ ml: 1 }} onClick={() => verBandeira(p.nome)}>
                        <PublicIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          {dadosApi && (
            <Card className="card-api">
              <CardMedia component="img" height="180" image={dadosApi.bandeira} alt="Bandeira" />
              <CardContent>
                <Typography variant="h5" color="primary">{dadosApi.nomeOficial}</Typography>
                <Typography>Região: {dadosApi.regiao}</Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}