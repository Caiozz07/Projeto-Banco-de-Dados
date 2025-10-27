CREATE TABLE Perfis (
    id_perfil INT AUTO_INCREMENT PRIMARY KEY,
    nome_perfil VARCHAR(20) NOT NULL
);

CREATE TABLE Usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome_completo VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(15),
    bloco VARCHAR(5),
    apartamento VARCHAR(5),
    id_perfil INT NOT NULL,
    FOREIGN KEY (id_perfil) REFERENCES Perfis(id_perfil)
);

CREATE TABLE Categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nome_categoria VARCHAR(30) NOT NULL
);

CREATE TABLE Noticias (
    id_noticia INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT NOT NULL,
    data_publicacao DATE NOT NULL,
    id_categoria INT NOT NULL,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_categoria) REFERENCES Categorias(id_categoria),
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
);
CREATE TABLE Manutencoes (
    id_manutencao INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    descricao TEXT NOT NULL,
    data_solicitacao DATE NOT NULL,
    status ENUM('Aberta', 'Em andamento', 'Concluída') DEFAULT 'Aberta',
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
);
CREATE TABLE Visitantes (
    id_visitante INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    documento VARCHAR(20),
    apartamento_destino VARCHAR(5),
    data_entrada DATETIME,
    data_saida DATETIME
);
CREATE TABLE Informativos (
    id_informativo INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    conteudo TEXT NOT NULL,
    data_publicacao DATE NOT NULL,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
);
INSERT INTO Perfis (nome_perfil) VALUES
('Morador'),
('Síndico'),
('Administrador');

INSERT INTO Usuarios (nome_completo, email, senha, telefone, bloco, apartamento, id_perfil) VALUES
('João Silva', 'joao@gmail.com', '123456', '(11)99999-1111', 'A', '101', 1),
('Maria Oliveira', 'maria@gmail.com', 'abc123', '(11)98888-2222', 'B', '202', 1),
('Carlos Souza', 'carlos@gmail.com', 'senha123', '(11)97777-3333', 'A', '303', 2),
('Ana Lima', 'ana@gmail.com', 'adm2024', '(11)96666-4444', 'C', '404', 3);

INSERT INTO Categorias (nome_categoria) VALUES
('Manutenção'),
('Mudança'),
('Novidade');

INSERT INTO Noticias (titulo, descricao, data_publicacao, id_categoria, id_usuario) VALUES
('Troca de lâmpadas nas áreas comuns', 'A manutenção realizará a troca de lâmpadas queimadas nas áreas comuns nesta semana.', '2025-10-10', 1, 3),
('Nova família no bloco B', 'Damos boas-vindas à família Pereira, que se mudou recentemente para o bloco B.', '2025-10-08', 2, 2),
('Assembleia geral marcada', 'Convocamos todos os moradores para a assembleia geral no próximo sábado às 10h.', '2025-10-12', 3, 4);
