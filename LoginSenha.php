<?php
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "condominio";

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    die("Erro na conexão com o banco de dados: " . $conn->connect_error);
}

session_start();

if (isset($_GET['logout'])) {
    session_destroy();
    header("Location: login.php");
    exit;
}

$mensagem = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $senha = $_POST['senha'];

    $sql = "SELECT u.*, p.nome_perfil 
            FROM usuarios u 
            JOIN perfis p ON u.id_perfil = p.id_perfil
            WHERE u.email = '$email' AND u.senha = '$senha'";

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        $_SESSION['usuario'] = $user['nome_completo'];
        $_SESSION['perfil'] = $user['nome_perfil'];
    } else {
        $mensagem = "E-mail ou senha incorretos!";
    }
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login - Condomínio</title>
  <style>
    body {
      background-color: #c5a8ff;
      font-family: Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
    }
    .container {
      background: #fff;
      padding: 40px;
      border-radius: 20px;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
      width: 350px;
      text-align: center;
    }
    h2 {
      color: #4B0082;
      margin-bottom: 20px;
    }
    input {
      width: 100%;
      padding: 10px;
      margin: 8px 0;
      border: 1px solid #aaa;
      border-radius: 8px;
    }
    button {
      width: 100%;
      padding: 10px;
      background-color: #4B0082;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      margin-top: 10px;
    }
    button:hover {
      background-color: #6A0DAD;
    }
    .mensagem {
      color: red;
      margin-top: 10px;
    }
    .bemvindo {
      color: #4B0082;
    }
    a {
      display: inline-block;
      margin-top: 15px;
      text-decoration: none;
      color: #4B0082;
    }
  </style>
</head>
<body>
  <div class="container">

    <?php if (!isset($_SESSION['usuario'])): ?>
      <h2>Portal do Condomínio</h2>
      <form method="POST" action="">
        <input type="email" name="email" placeholder="E-mail" required>
        <input type="password" name="senha" placeholder="Senha" required>
        <button type="submit">Entrar</button>
      </form>

      <?php if ($mensagem != ""): ?>
        <p class="mensagem"><?= $mensagem ?></p>
      <?php endif; ?>

    <?php else: ?>
      <h2 class="bemvindo">Bem-vindo(a), <?= $_SESSION['usuario'] ?>!</h2>
      <p>Seu perfil: <strong><?= $_SESSION['perfil'] ?></strong></p>

      <p>Agora você pode acessar as notícias, informativos e eventos do condomínio.</p>
      <a href="?logout">Sair</a>
    <?php endif; ?>

  </div>
</body>
</html>

<?php $conn->close(); ?>
