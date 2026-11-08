# DevDuo - Curso Web Completo

Plataforma interativa de aprendizado de desenvolvimento web (HTML, CSS, JavaScript, TypeScript, React, Node.js e mais) com trilhas de estudo, editor de código em tela cheia, quizzes práticos e suporte PWA offline.

---

## 🚀 Como Hospedar no GitHub Pages

O projeto já está 100% configurado para o GitHub Pages, com caminhos relativos (`./`), arquivo `.nojekyll`, página `404.html` para suporte a rotas e workflow do GitHub Actions.

Você pode publicar de duas formas:

### Método 1: Automático via GitHub Actions (Recomendado)

1. Envie o seu código para o repositório no GitHub:
   ```bash
   git add .
   git commit -m "Publicação no GitHub Pages"
   git push origin main
   ```
2. No seu repositório no GitHub, clique em **Settings** (Configurações).
3. No menu lateral esquerdo, vá em **Pages**.
4. Em **Build and deployment** > **Source**, selecione:
   👉 **GitHub Actions**
5. Pronto! O workflow `.github/workflows/deploy.yml` será disparado automaticamente e seu site estará no ar em poucos segundos em:
   `https://<seu-usuario>.github.io/<nome-do-repositorio>/`

---

### Método 2: Publicação Manual via Terminal (`npm run deploy`)

Se você preferir publicar através do comando direto no terminal:
1. Instale ou configure o git remoto no seu computador.
2. Execute o comando:
   ```bash
   npm run deploy
   ```
   *(Esse comando compila o projeto com `npm run build` e envia a pasta `dist` diretamente para o branch `gh-pages`)*.
3. No GitHub em **Settings** > **Pages**, selecione a branch `gh-pages` e a pasta `/ (root)`.

---

## 🌐 Configuração do Domínio Personalizado (`devduo.com`)

O projeto já contém o arquivo `CNAME` configurado com `devduo.com`.

### No GitHub:
1. No seu repositório no GitHub, acesse **Settings** > **Pages**.
2. No campo **Custom domain**, digite: `devduo.com` e clique em **Save**.
3. Marque a opção **Enforce HTTPS** (para ativar SSL/HTTPS gratuito).

### No seu provedor de DNS (Registro.br, Cloudflare, GoDaddy, Hostinger, etc.):
Configure os apontamentos DNS:
* **Tipo A** (Host: `@` ou `devduo.com`):
  * `185.199.108.153`
  * `185.199.109.153`
  * `185.199.110.153`
  * `185.199.111.153`
* **Tipo CNAME** (Host: `www`):
  * `<seu-usuario>.github.io.`

---

## 🛠️ Comandos Disponíveis

* `npm run dev`: Inicia o servidor de desenvolvimento local na porta 3000.
* `npm run build`: Gera os arquivos de produção prontos para hospedagem estática na pasta `dist/`.
* `npm run deploy`: Realiza o build e publica no branch `gh-pages`.
* `npm run lint`: Valida o TypeScript e sintaxe do projeto com zero erros.
