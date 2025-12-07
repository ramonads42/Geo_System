import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, Button, Container, TextField, Typography, Paper, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PublicIcon from '@mui/icons-material/Public';

interface Continente {
  id: number;
  nome: string;
  descricao: string;
}

export default function Continentes() {
  const [continentes, setContinentes] = useState<Continente[]>([]);
  
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  
  const [idEditando, setIdEditando] = useState<number | null>(null);

  useEffect(() => { carregarContinentes(); }, []);

  const carregarContinentes = async () => {
    try {
      const resposta = await axios.get('http://localhost:3000/continentes');
      setContinentes(resposta.data);
    } catch (erro) { console.error("Erro busca:", erro); }
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !descricao) return;

    try {
      if (idEditando) {
        await axios.put(`http://localhost:3000/continentes/${idEditando}`, { nome, descricao });
        setIdEditando(null);
      } else {
        await axios.post('http://localhost:3000/continentes', { nome, descricao });
      }
      
      setNome(''); setDescricao('');
      carregarContinentes();
    } catch (erro) { alert('Erro ao salvar.'); }
  };

  const handleEditar = (item: Continente) => {
    setNome(item.nome);
    setDescricao(item.descricao);
    setIdEditando(item.id);
  };

  const handleExcluir = async (id: number) => {
    if (!confirm('Tem certeza?')) return;
    try {
      await axios.delete(`http://localhost:3000/continentes/${id}`);
      carregarContinentes();
    } catch (erro) { alert('Erro ao excluir (Pode haver países vinculados).'); }
  };

  const handleCancelar = () => {
    setIdEditando(null);
    setNome('');
    setDescricao('');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <PublicIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h4" color="primary">Gerenciar Continentes</Typography>
      </Box>

      <Paper className="form-container">
        <Typography variant="h6" gutterBottom>
          {idEditando ? 'Editar Continente' : 'Novo Continente'}
        </Typography>
        <Box component="form" onSubmit={handleSalvar} display="flex" gap={2} alignItems="center">
          <TextField label="Nome" size="small" value={nome} onChange={e => setNome(e.target.value)} fullWidth />
          <TextField label="Descrição" size="small" value={descricao} onChange={e => setDescricao(e.target.value)} fullWidth />
          
          <Button type="submit" variant="contained" color={idEditando ? "warning" : "primary"} size="large">
            {idEditando ? 'Atualizar' : 'Salvar'}
          </Button>
          
          {idEditando && (
            <Button variant="outlined" onClick={handleCancelar}>Cancelar</Button>
          )}
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead className="tabela-header">
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {continentes.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.id}</TableCell>
                <TableCell>{c.nome}</TableCell>
                <TableCell>{c.descricao}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleEditar(c)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleExcluir(c.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}