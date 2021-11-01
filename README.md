# Story: Seu primeiro time pokemon

A idéia é testar os fundamentos de `testing`, aplicando o que foi visto no `JS Expert - Módulo 02`
num projeto simples e divertido.

Consumindo a [PokeAPI](https://pokeapi.co/), faça uma API que retorne 3 pokemóns aleatórios para
formar seu time inicial numa jornada pokemon.

## Requisitos

### Funcionalidades

1. `GET /`

Deve ser a rota padrão da aplicação ao tentar acessar qualquer rota inexistente. (ex.: `/hi`,
`/hello`)

2. `GET /team`

Deve retornar um array com 3 pokemóns aleatórios, contendo seus respectivos `name` e `moves`,
(mostrando apenas um array de strings com os 3 primeiros `moves` presentes na API. ex.:
`["mega-punch","fire-punch","thunder-punch"]`).

### Testes

- [x] mocks
- [x] stubs
- [x] spies
- [x] testes end-2-end
- [x] testes unitários
- [x] 100% de code coverage

![Img 100% code cov](img/hundredpercent.png)

### Extras

- [x] TDD e BDD, será que rola? Acho que vale a tentativa!

## Dicas

Sinta-se livre pra desenvolver sua solução da melhor maneira possível, e caso já queira uma ajuda
nos patterns e em como organizar as idéias, aqui vai:

### Arquitetura esperada

```
project
│   README.md
│   .nycrc.json
│   package.json
│
└───src
│   │   api.js
│   │
│   └───repository
│   │   │   teamRepository.js
│   │
│   └───service
│       │   teamService.js
│
└───test
│   └───e2e
│   │   │   api.test.js
│   │
│   └───mocks
│   │   │   valid-team.json
│   │   │   ...
│   │
│   └───unit
│       │   teamRepository.test.js
│       │   teamService.test.js
│
└───coverage
│   │   ...
```

### Entendendo a PokeAPI

URLs Úteis ao desafio:

- https://pokeapi.co/api/v2/pokemon
- https://pokeapi.co/api/v2/pokemon/7

## Submissão

1. Inicialize um repósitório git com um arquivo README.md contendo seu nome, quais tópicos do
   checklist foram implementados e, caso queira, um breve resumo de cada tópico.

2. Crie o projeto e os testes.

3. Coloque as instruções de como configurar e executar seu projeto e os testes no README.md (não se
   esqueça do coverage com o `nyc`).

4. Envie o link no canal `#desafios-jsexpert` da nossa comunidade no discord.

## Até quando?

Se você está pegando esse desafio na estréia, corre lá e envia pra gente até _Quarta-feira, 10 de
novembro de 2021 (10/11/2021)_!
