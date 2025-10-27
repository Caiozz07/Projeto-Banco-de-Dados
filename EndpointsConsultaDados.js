const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const app = express();
app.use(express.json());
//ajustar banco de dados
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',           
  database: 'seu_banco',  
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
// Listar todos os usuários
app.get('/usuarios', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id_usuario, nome_completo, email, telefone, bloco, apartamento, id_perfil FROM Usuarios'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});
// Buscar um usuário por ID
app.get('/usuarios/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Usuarios WHERE id_usuario = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ erro: 'Usuário não encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});
// Criar novo usuário
app.post('/usuarios', async (req, res) => {
  try {
    const { nome_completo, email, senha, telefone, bloco, apartamento, id_perfil } = req.body;

    if (!nome_completo || !email || !senha)
      return res.status(400).json({ erro: 'Campos obrigatórios: nome_completo, email, senha' });

    const hashed = await bcrypt.hash(senha, 10);
    const [result] = await pool.query(
      `INSERT INTO Usuarios (nome_completo, email, senha, telefone, bloco, apartamento, id_perfil)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nome_completo, email, hashed, telefone || null, bloco || null, apartamento || null, id_perfil || null]
    );
    res.status(201).json({ mensagem: 'Usuário criado com sucesso', id_usuario: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(400).json({ erro: 'Email já cadastrado' });
    res.status(500).json({ erro: err.message });
  }
});
// Atualizar usuário
app.put('/usuarios/:id', async (req, res) => {
  try {
    const { nome_completo, email, senha, telefone, bloco, apartamento, id_perfil } = req.body;
    const campos = [];
    const valores = [];

    if (nome_completo) { campos.push('nome_completo = ?'); valores.push(nome_completo); }
    if (email) { campos.push('email = ?'); valores.push(email); }
    if (senha) {
      const hashed = await bcrypt.hash(senha, 10);
      campos.push('senha = ?');
      valores.push(hashed);
    }
    if (telefone) { campos.push('telefone = ?'); valores.push(telefone); }
    if (bloco) { campos.push('bloco = ?'); valores.push(bloco); }
    if (apartamento) { campos.push('apartamento = ?'); valores.push(apartamento); }
    if (id_perfil) { campos.push('id_perfil = ?'); valores.push(id_perfil); }

    if (campos.length === 0) return res.status(400).json({ erro: 'Nenhum campo para atualizar' });

    valores.push(req.params.id);
    const sql = `UPDATE Usuarios SET ${campos.join(', ')} WHERE id_usuario = ?`;
    const [result] = await pool.query(sql, valores);

    if (result.affectedRows === 0)
      return res.status(404).json({ erro: 'Usuário não encontrado' });

    res.json({ mensagem: 'Usuário atualizado com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});
// Deletar usuário
app.delete('/usuarios/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM Usuarios WHERE id_usuario = ?', [req.params.id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    res.json({ mensagem: 'Usuário excluído com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});
//rotas de perfis
app.get('/perfis', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Perfis');
    res.json(rows);
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

app.post('/perfis', async (req, res) => {
  try {
    const { nome_perfil } = req.body;
    const [result] = await pool.query('INSERT INTO Perfis (nome_perfil) VALUES (?)', [nome_perfil]);
    res.status(201).json({ mensagem: 'Perfil criado', id_perfil: result.insertId });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});
//rotas de categorias
app.get('/categorias', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Categorias');
    res.json(rows);
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

app.post('/categorias', async (req, res) => {
  try {
    const { nome_categoria } = req.body;
    const [result] = await pool.query('INSERT INTO Categorias (nome_categoria) VALUES (?)', [nome_categoria]);
    res.status(201).json({ mensagem: 'Categoria criada', id_categoria: result.insertId });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});
// Listar notícias 
app.get('/noticias', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT n.id_noticia, n.titulo, n.descricao, n.data_publicacao,
             c.nome_categoria, u.nome_completo AS autor
      FROM Noticias n
      JOIN Categorias c ON n.id_categoria = c.id_categoria
      JOIN Usuarios u ON n.id_usuario = u.id_usuario
      ORDER BY n.data_publicacao DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});
// Criar notícia
app.post('/noticias', async (req, res) => {
  try {
    const { titulo, descricao, data_publicacao, id_categoria, id_usuario } = req.body;
    const [result] = await pool.query(
      `INSERT INTO Noticias (titulo, descricao, data_publicacao, id_categoria, id_usuario)
       VALUES (?, ?, ?, ?, ?)`,
      [titulo, descricao, data_publicacao, id_categoria, id_usuario]
    );
    res.status(201).json({ mensagem: 'Notícia criada', id_noticia: result.insertId });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});
//inicialização
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));