# Tiago Nunes dos Santos — Currículo / Portfólio

Site pessoal de uma página feito só com HTML, CSS e JavaScript puro (sem frameworks e sem build).

```
index.html     → conteúdo
style.css      → visual (tema escuro, cores e responsividade)
init.js        → configuração inicial (roda antes da página aparecer)
script.js      → menu, abertura, animações e relógio
foto.jpg       → foto de perfil
```

## Antes de publicar

1. **Foto:** para trocar, substitua `foto.jpg` na raiz por uma imagem quadrada. Se ela não existir, o site mostra as iniciais "TN".

## Publicar no GitHub Pages

O repositório já existe (`TNunes01/tiagonunes`). Para atualizar o site:

```bash
git add .
git commit -m "Novo site de currículo"
git push origin main
```

Se o Pages ainda não estiver ativado:

1. No GitHub, abra o repositório → **Settings** → **Pages**.
2. Em **Source**, escolha **Deploy from a branch**.
3. Selecione a branch **main** e a pasta **/ (root)** e clique em **Save**.
4. Em 1 ou 2 minutos o site fica disponível em `https://tnunes01.github.io/tiagonunes/`.

Para testar localmente, abra o `index.html` no navegador.
