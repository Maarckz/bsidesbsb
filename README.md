# BSidesBSB 2026 — visual prototype v2

Protótipo em HTML/CSS/JS puro baseado na estrutura do site fornecido e na direção visual cyberpunk criada para a edição 2026.

## O que mudou
- Hero simplificado: a arte ocupa a seção Home e recebe apenas UI mínima.
- Logo oficial referenciada diretamente por `https://bsidesbsb.com/assets/logo.png`.
- Pôster oficial referenciado diretamente por `https://bsidesbsb.com/assets/poster.jpeg`.
- Quatro trilhas com 5 posições visíveis/roláveis por grupo.
- Carrosséis horizontais com mouse wheel, drag, touch e setas.
- Loop horizontal contínuo com 3 cópias do conjunto de cards.
- Assets da imagem-sprite foram recortados e aproveitados em trilhas, programa e patrocínio.
- Seção Conduta & Privacidade em tema claro para leitura longa.
- Navegação mobile e layout responsivo.

## Correções de conteúdo (alinhamento com o site antigo)
- Menubar: item "O Evento" voltou para "Sobre" (consistente com rodapé e site antigo).
- Hero: restaurado o fechamento "Siga o coelho branco até o outro lado."
- Sobre: parágrafo da missão restaurado ("sem a barreira do palco-plateia..."); manifesto voltou ao título "Comunidade antes de tudo" com o conteúdo completo (incluindo "Down the Rabbit Hole — descer fundo juntos").
- Sobre: readicionados os cards "Objetivos / Para onde vamos" (4 objetivos) e "No dia do evento / Experiência imersiva" (6 itens).
- Trilhas: parágrafos enriquecidos com os tópicos específicos de cada trilha (keynote de abertura, red team/OSINT, threat hunting/DFIR/GRC, workshops/lightning talks, etc.).
- Programa (Agenda): cards enriquecidos com detalhes (4 trilhas/16+ palestras, categorias do CTF — web/pwn/crypto/forense/OSINT/misc — dica de redes sociais, vagas limitadas, mapa+hospedagem).
- Histórico: readicionado o artigo "Sobre a rede BSides" (rede mundial desde 2009, capítulo Brasília desde 2025).
- Patrocinadores: parágrafo do hero ampliado com a história 2025→2026; cotas detalhadas com vagas VIP, tempo de palco, booths e menções em redes.
- FAQ: 9 respostas ampliadas para o conteúdo completo do site antigo (CFP com URL, todos os níveis, 4 trilhas explicadas, categorias do CTF, etc.).
- Código de Conduta: restaurado o conteúdo completo — intro alargada, escopo com todos os públicos, lista completa de comportamentos inaceitáveis, "Diretrizes de convivência", "Medidas e aplicação", "Como reportar" com detalhes (local/horário/testemunhas), "Apoio e segurança", destaque de proibição de retaliação e nota sobre origem BSides.
- Política de Privacidade: restaurado o conteúdo completo — coleta e uso (com opt-out de compartilhamento com patrocinadores), armazenamento, "Liberdade de recusa", "Aceitação", "Compromisso do usuário" detalhado e "Mais informações" sobre cookies.
- CSS: adicionadas regras para `.objectives-grid`, `.experience-card .check-list`, `.network-card` e estilos de destaque `.cc-highlight` / `.cc-note` na seção clara.

## Observação sobre logo/pôster
Como a conexão do ambiente de geração não permitiu empacotar as imagens remotas, o site referencia as URLs oficiais. Para uma versão 100% offline, salve esses dois arquivos dentro de `assets/official/` e troque as referências no HTML.

## v3 — ajustes solicitados
- **Sobre o evento**: removidos os stats (14/11, 100% comunidade, 4 trilhas) e o card "No dia do evento".
- **Nova seção "NO DIA DO EVENTO / Experiência imersiva"** (`#experiencia`): checklist completo + card destaque **CTF — Competição com prêmios** (o link CTF do menu agora aponta para cá).
- **Patrocinadores**: 2 fileiras no mesmo formato dos palestrantes (com arraste, setas e loop infinito) para receber as logos — coloque os arquivos em `assets/sponsors/` (ver `assets/sponsors/LEIA-ME.txt`). Enquanto não houver imagem, o card mostra "SEU LOGO AQUI".
- **Pôster oficial**: altura corrigida (não estica mais com a coluna); agora fica `sticky` acompanhando a rolagem.
- **Cursor**: replicado o cursor do 4root.com.br — seta neon que segue o mouse em tempo real, `mix-blend-mode: difference`, glitch aleatório a cada 1–3s, translúcido após 2s parado, some ao sair da janela e é desativado em telas touch. Cor adaptada ao ciano neon do site (troque o `%2311d1ff` no `styles.css` se quiser outra cor).
- **Conduta & Privacidade**: painel branco com `border-radius` sobre o fundo escuro; os textos completos agora abrem em **modais** (fechar pelo ✕, ESC, clique fora ou fundo).
- **FAQ**: seção e links removidos.
- **Contato + Footer**: agora são um bloco só — footer com logo, ícones de redes sociais (Instagram, LinkedIn e e-mail em SVG), cards de contato, navegação e barra final. O link "Contato" do menu aponta para o rodapé (`#contato`).

## v4 — ajustes solicitados
- **Sections mais largas**: largura máxima do conteúdo subiu de 1240px para 1400px (`--max`).
- **Navbar**: CTA "Quero palestrar" removido do header; links alinhados à direita; brand deslocado um pouco para a direita; itens ganham efeito de seleção no hover (underline rosa→ciano com brilho).
- **Hero**: removido o rótulo direito ("14.11.26 · Brasília"); o rótulo "FOLLOW THE WHITE RABBIT" foi para a direita com fonte maior e brilho neon.
- **Letreiro de objetivos**: os 4 blocos de objetivos foram substituídos por uma barra letreiro em loop infinito com as palavras-chave separadas por `||` em rosa neon (pausa no hover).
- **Palestrantes**: cada `track-info` agora exibe o badge circular do personagem correspondente (Coelho, Gato de Cheshire, Rainha de Copas e Chapeleiro).
- **Local**: o banner "Brasília 14.11.2026" foi movido para cima da seção de palestrantes.
- **Scrollbar personalizada** no tema do site (gradiente rosa→violeta→ciano com glow, arrastável, some quando ociosa) — ativa apenas em desktops sem `prefers-reduced-motion`.
- **Smooth scroll estilo maarckz.github.io**: leve inclinação (`skewY`) proporcional à velocidade da rolagem, com retorno suave ao parar.
- HTML limpo (tags `</main>`/`</footer>` duplicadas removidas) e conteúdo agrupado em `#warp` para o efeito de rolagem.

