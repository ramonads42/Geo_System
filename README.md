Geo Sistema - Gerenciador Geográfico

Este projeto é uma aplicação Web desenvolvida como atividade acadêmica para o curso de Análise e Desenvolvimento de Sistemas. O objetivo é gerenciar dados geográficos (Continentes, Países e Cidades) com integração com APIs externas.


CRUD Completo:

Continentes: Cadastro, listagem, edição e exclusão.

Países: Gerenciamento de países vinculados a um continente.

Cidades: Gerenciamento de cidades vinculados a um país.

Integração com APIs Externas:

RestCountries API: Na tela de Países, ao clicar no botão de visualização, o sistema busca e exibe a bandeira oficial.

OpenMeteo API: Na tela de Cidades, o sistema utiliza a latitude e longitude cadastradas para consultar e exibir a temperatura atual.



Como Rodar o Projeto

Pré-requisitos: Ter o Node.js e o PostgreSQL instalados e rodando.



1. Configurar o Banco de Dados

Certifique-se de que o serviço do Postgres está ativo e as variáveis de ambiente (.env) estão configuradas corretamente.

2. Iniciar o Backend

No terminal, entre na pasta do servidor:

  cd geo-sistema  
  
  npm install   
  
  npx prisma migrate dev  
  
  npx nodemon src/server.ts  
  



O servidor rodará em: http://localhost:3000

3. Iniciar o Frontend

Em outro terminal, entre na pasta do site:

  cd geo-frontend  
  
  npm install  
  
  npm run dev  
  



O site rodará em: http://localhost:5173
