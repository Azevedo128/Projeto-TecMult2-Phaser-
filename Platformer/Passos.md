**Lista De Tarefas**

Já tens uma boa base: projeto Phaser, `MainMenu`, cena `Game`, `Preloader` e um chão simples. Para transformar isso num platformer estilo Super Mario, eu seguiria esta ordem:

1. **Organizar os assets**
   - Criar pastas tipo `assets/player`, `assets/tiles`, `assets/enemies`, `assets/items`, `assets/audio`.
   - Colocar as sprites do jogador.
   - Carregar tudo no `Preloader.ts`.

2. **Criar o jogador**
   - Adicionar o player no `Game.ts`.
   - Dar física ao player.
   - Fazer colisão com o chão.
   - Adicionar animações: `idle`, `run`, `jump`, `fall`.

3. **Adicionar controlos**
   - Setas ou `A/D` para andar.
   - `Space` ou seta para cima para saltar.
   - Impedir salto infinito, deixando saltar só quando está no chão.

4. **Melhorar o chão e plataformas**
   - Trocar o retângulo castanho por tiles/imagens.
   - Criar várias plataformas.
   - Criar buracos onde o jogador pode cair.
   - Usar `staticGroup` para chão e plataformas.

5. **Criar o mapa**
   - Sem Tile Map Editor, podes criar o mapa no código.
   - Fazer uma função tipo `createLevel()`.
   - Colocar chão, blocos, plataformas e obstáculos por coordenadas.

6. **Adicionar câmara**
   - Fazer a câmara seguir o jogador.
   - Aumentar o mundo para ser maior que o ecrã.
   - Definir limites do mundo.

7. **Adicionar moedas ou itens**
   - Criar moedas colecionáveis.
   - Aumentar pontuação quando o jogador apanha uma moeda.
   - Mostrar score no ecrã.

8. **Adicionar inimigos**
   - Criar inimigos simples que andam de um lado para o outro.
   - Se o player tocar de lado, perde vida.
   - Se saltar por cima, derrota o inimigo.

9. **Adicionar vida e morte**
   - Criar sistema de vidas.
   - Se cair fora do mapa, reinicia.
   - Se perder todas as vidas, vai para `GameOver`.

10. **Criar objetivo do nível**
   - Bandeira, porta ou final do mapa.
   - Quando o jogador chega lá, mostra vitória ou passa para outro nível.

11. **Adicionar sons**
   - Som de salto.
   - Som de moeda.
   - Som de dano.
   - Música de fundo.

12. **Polir o jogo**
   - Melhorar background.
   - Adicionar parallax.
   - Ajustar velocidade e força do salto.
   - Corrigir colisões estranhas.
   - Testar várias vezes o primeiro nível.

A ordem mais importante agora seria:

```text
player -> movimento -> colisão -> plataformas -> câmara -> moedas -> inimigos -> objetivo
```

E uma nota importante: podes fazer um jogo **inspirado em Super Mario**, mas evita usar sprites, música ou personagens oficiais da Nintendo. Usa assets próprios ou gratuitos com licença permitida.