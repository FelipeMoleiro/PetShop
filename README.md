# PetShop

Project Report

Projeto feito para a materia de desenvolvimento web SCC0219 - Introdução ao Desenvolvimento Web - USP - 2020

Felipe Guilermmo Santuche Moleiro - 10724010

O projeto é uma site de petshop com funcionalidades de venda de itens e venda de serviços.


## Descrição do projeto:

Existem dois tipos de usuários, o Cliente e o Administrador, os dois são
salvos juntos mas os administradores guardam uma informação dizendo que são
administradores.

Os produtos são salvos com os dados relevantes sobre ele.

Os serviços são salvos com os dados relevantes sobre ele.

Os clientes tem uma lista de pets que eles são donos.

Os clientes tem um lista de produtos que representa seu carrinho.

Quando um cliente marca um serviço, é criada uma relação entre o usuário e
o serviço no dia e hora especificado.

O administrador pode editar os produtos e Serviços.

Sempre que um produto ou serviço é vendido esse valor é salvo e pode ser
consultado pelo administrador.

## Comentários sobre o código:

Temos o servidor web feito com html, css e javascript utilizando vuejs. Foi utilizado o
Vue CLI para facilitar a criação do servidor web. Nessa parte cada tela foi separada em um
arquivo vue diferente para facilitar o desenvolvimento e compreensão. Cada página está
bem modularizada e em geral pode ser analisada por si só.

Temos também uma API rodando em node js que toma conta de fornecer os dados
e fazer a conexão com o banco de dados. Todas as informações sobre os produtos,
usuários e serviços estão no banco de dados e devem ser obtidas com requests à API. Ela
está separada em mais ou menos três partes: os modelos do mongodb, as rotas a serem
utilizadas nos requests e os controladores que fazem executam os pedidos.

## Test Plan/Results:

Não foi utilizado nenhuma ferramenta de teste automático no desenvolvimento do
projeto, porém testes foram feitos para garantir o funcionamento como um todo. Os testes
feitos incluem a utilização do site e testar as funcionalidades da forma como foram
desenvolvidas, ou seja, adicionar itens ao carrinho, comprá-los, comprar serviços, adicionar
e remover pets, etc. Os resultados desses testes foram positivos e mostraram uma
funcionalidade normal. Além disso outros testes para testar casos mais raros foram feitos
como a exclusão de produtos que estavam no carrinho de um usuário, cliente tentando
comprar mais itens que o disponível em estoque, etc. Esses e outros casos foram
analisados e verificados, os que deram problemas foram refinados e corrigidos. É
impossível ter certeza que todos os testes possíveis foram realizados para todos os casos
específicos, mas em geral as funcionalidades estipuladas e os casos que tinham mais
chance de dar problema foram testados de diversas formas.


## Build Procedures:

Primeiro é necessário ter instalado o nodejs, npm e mongodb na sua máquina.

Com os programas instalados primeiro iremos arrumar o banco de dados, com o
mongodb instalado, acessar ele da maneira preferida(terminal ou interface gráfica) e criar
uma base de dados com nome ‘PetShop’ e três coleções: ‘users’, ‘services’ e ‘products’.

Após criadas, carregar os dados que foram fornecidos em formato json(para não ter que
adicionar todos os produtos e serviços do 0) a cada uma das coleções.

Com os dados carregados no bd iremos rodar a API, entrar com o terminal na pasta
Servidor e instalar as dependências do projeto com:

npm install

Depois disso, abrir o arquivo config.js e colocar o endereço de conexão com o banco
lá, com o endereço correto colocado, basta usar o comando:

npm run start

E com isso a sua API já deve estar rodando na porta 3000. Após isso iremos iniciar
o web server, para isso abra a pasta SPA/petshop. Nesta pasta temos tanto o código fonte
quanto a versão compilada. Para rodar a versão compilada basta rodar dois comandos
nesta pasta:

npm install -g serve
serve -s dist

Pronto, com isso feito já deve ser possível acessar o site na porta indicada ao rodar
o último comando.

Extra: Caso queira rodar a API em outra porta ou endereço é necessário alterar o
arquivo config.js no código fonte e compilar ele, para isso basta instalar as dependências
com npm install, e após isso rodar um npm run build. A pasta dist será atualizada e basta
rodar o “serve -s dist” novamente.
