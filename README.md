# Platformer Phaser 3

## Alluno

- Nome: André Azevedo
- Numero: 33388

## Descricao do Jogo

Este projeto e um jogo 2D do genero platformer desenvolvido com Phaser 3 e TypeScript.

O jogador escolhe uma personagem e percorre niveis com plataformas, obstaculos ou inimigos. O objetivo e chegar a meta de cada nivel sem perder todas as vidas.

Funcionalidades implementadas:

- Menu principal
- Escolha de personagem
- Menu de niveis
- 3 niveis jogaveis
- Sistema de vidas
- Game Over
- Ecra de nivel completo
- Menu de pausa
- Menu de opcoes
- Visualizador de mapas
- Sistema de niveis bloqueados/desbloqueados
- Suporte multilingue
- Musica e efeitos sonoros
- Fisica Arcade com colisoes e overlaps

## Tecnologias Usadas

- Phaser 3.90.0
- TypeScript
- Vite
- HTML/CSS
- npm

O Phaser foi incluido atraves de `npm`, como dependencia do projeto.

## Como Executar

Entrar na pasta do projeto:

```bash
cd Platformer
```

Instalar dependencias:

```bash
npm install
```

No Windows, se o PowerShell bloquear o `npm`, usar:

```bash
npm.cmd install
```

Executar em modo desenvolvimento:

```bash
npm run dev-nolog
```

ou no Windows:

```bash
npm.cmd run dev-nolog
```

Abrir no browser o endereco indicado pelo terminal, normalmente:

```text
http://localhost:8080
```

Se a porta `8080` estiver ocupada, o Vite pode usar `8081`.

## Controlos

- `A` ou seta esquerda: mover para a esquerda
- `D` ou seta direita: mover para a direita
- `W`, `↑` ou espaco: saltar
- É possivel fazer duplo salto
- `ESC`: abrir menu de pausa
- Rato: navegar nos menus e opcoes

## Regras do Jogo

- O jogador comeca com 3 vidas.
- Ao cair fora do mapa ou tocar em obstaculos, perde vida.
- Se perder todas as vidas, aparece o ecra de Game Over.
- Ao chegar a finish line, o nivel é completado.
- O nivel 1 comeca desbloqueado.
- O nivel 2 é desbloquiado depois de completar o nivel 1.
- O nivel 3 é desbloquiado depois de completar o nivel 2.
- Existe uma opcao para desbloquear todos os niveis temporariamente para testes.

## Niveis

### Nivel 1

Nivel inicial com plataformas e decoracao de floresta.

### Nivel 2

Nivel com ambiente industrial/laboratorio com acido e spikes como obstaculos.

### Nivel 3

Nivel com ambiente de cemiterio, zombies inimigos.

## Suporte Multilingue

O jogo suporta varias linguas atraves de ficheiros JSON:

- Portugues
- Ingles
- Espanhol
- Alemao
- Chines

Os textos da interface sao obtidos atraves do sistema `i18n.ts`, evitando strings duplicadas espalhadas pelo codigo.

A lingua escolhida fica guardada no browser atraves de `localStorage`.

## Audio

O jogo inclui musica de fundo e sons de interface.

Formatos usados:

- `.mp3` para musica
- `.ogg` para efeitos sonoros

O volume pode ser alterado no menu de opcoes.

## Assets Multimedia

O projeto usa:

- Imagens `.png` para personagens, botoes, fundos, tiles e objetos
- Audio `.mp3` e `.ogg`
- Sprites organizados por personagem e animacao
- Tilesets separados por nivel

Os assets principais encontram-se em:

```text
Platformer/public/assets/
```

As imagens sao carregadas no `Preloader.ts` e usadas atraves de chaves Phaser, por exemplo:

```ts
this.load.image('level2-spike', 'tilesets/level2/Spike.png');
```

## Estrutura do Projeto

```text
Platformer/
|-- index.html
|-- package.json
|-- public/
|   |-- style.css
|   `-- assets/
|-- src/
|   |-- main.ts
|   `-- game/
|       |-- main.ts
|       |-- i18n.ts
|       |-- locales/
|       `-- scenes/
|           |-- Boot.ts
|           |-- Preloader.ts
|           |-- MainMenu.ts
|           |-- CharacterMenu.ts
|           |-- LevelMenu.ts
|           |-- Game.ts
|           |-- PauseMenu.ts
|           |-- OptionsOverlay.ts
|           |-- GameOver.ts
|           |-- LevelComplete.ts
|           `-- Levels/
```

## Organizacao do Codigo

- `Boot.ts`: carregamento inicial minimo
- `Preloader.ts`: carregamento dos assets
- `MainMenu.ts`: menu principal
- `CharacterMenu.ts`: escolha de personagem
- `LevelMenu.ts`: escolha de nivel
- `Game.ts`: logica principal do jogo
- `GameUI.ts`: vidas e botao de pausa
- `PlayerController.ts`: movimento e animacoes do jogador
- `LevelProgress.ts`: bloqueio/desbloqueio de niveis
- `AudioManager.ts`: musica e volume
- `i18n.ts`: sistema de traducoes
- `level1.ts`, `level2.ts`, `level3.ts`: construcao dos niveis
- `finishLine.ts`: criacao da meta

## Conceitos Phaser Usados

- Scenes
- `preload`, `create` e `update`
- Sprites e imagens
- Fisica Arcade
- Static groups
- Colliders
- Overlaps
- Input por teclado
- Input por rato
- Camara com follow
- Sistema de som
- Animacoes de sprites

## Observacoes

O jogo deve ser executado atraves de servidor local, nao diretamente por `file://`.

Este projeto usa Vite, por isso deve ser iniciado com `npm run dev-nolog` ou compilado com:

```bash
npm run build
```
