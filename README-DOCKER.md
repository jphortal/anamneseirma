# Guia de Setup: Lovable → GitHub → Cursor → Docker

Este guia detalha como configurar o fluxo completo de desenvolvimento e deploy.

## 📋 Pré-requisitos

- Conta no GitHub
- Git instalado no PC
- Docker e Docker Compose instalados no tablet
- Cursor App instalado no PC

## 🔄 Fluxo de Trabalho

```
Lovable (edição com IA) ←→ GitHub (sync automático) ←→ Cursor (edição local) → Docker (deploy local)
```

---

## 1️⃣ Conectar Lovable ao GitHub

1. No Lovable, clique no botão **GitHub** (canto superior direito)
2. Clique em **Connect to GitHub**
3. Autorize o Lovable GitHub App
4. Clique em **Create Repository**
5. Escolha o nome do repositório

✅ **Resultado**: Mudanças no Lovable sincronizam automaticamente com GitHub

---

## 2️⃣ Clonar Repositório no PC

```bash
# Clone o repositório criado pelo Lovable
git clone https://github.com/seu-usuario/nome-do-repo.git

# Entre na pasta
cd nome-do-repo

# Abra no Cursor
cursor .
```

---

## 3️⃣ Deploy no Docker (Tablet)

### Opção A: Clonar direto no tablet

```bash
# No tablet, clone o repositório
git clone https://github.com/seu-usuario/nome-do-repo.git
cd nome-do-repo

# Build e start
docker-compose up -d lovable-app
```

### Opção B: Transferir via SCP/SFTP

```bash
# Do PC, transfira o código para o tablet
scp -r . usuario@tablet-ip:/caminho/destino/

# No tablet
cd /caminho/destino
docker-compose up -d lovable-app
```

---

## 4️⃣ Workflow de Desenvolvimento

### Editando no Lovable:

1. Faça mudanças no Lovable
2. **Automático**: Lovable faz push para GitHub
3. **Manual**: No tablet/PC, faça `git pull`
4. **Manual**: Rebuild Docker:
   ```bash
   docker-compose build lovable-app
   docker-compose up -d lovable-app
   ```

### Editando no Cursor:

1. Faça mudanças no Cursor
2. Commit e push:
   ```bash
   git add .
   git commit -m "Sua mensagem"
   git push
   ```
3. **Automático**: GitHub sincroniza com Lovable
4. **Manual**: No tablet, faça `git pull` e rebuild Docker

---

## 5️⃣ Configurar URLs do n8n

Após deploy no Docker, atualize as URLs do n8n no app:

### URLs para n8n no Docker (rede interna):
```
http://n8n:5678/webhook/seu-webhook-id
```

### URLs para n8n na nuvem (mantém como está):
```
https://jphortal.app.n8n.cloud/webhook/...
```

**Importante**: O navegador do usuário faz as requisições, então:
- Use `http://tablet-ip:5678` se acessar de outro dispositivo na rede
- Use `http://n8n:5678` apenas se todos os serviços estiverem em Docker

---

## 6️⃣ Acessar o App

Após o deploy:
```
http://tablet-ip:8080
```

Ou configure um domínio local:
```
http://radiologia.local:8080
```

---

## 🔧 Comandos Úteis

### Rebuild completo:
```bash
docker-compose down
docker-compose build --no-cache lovable-app
docker-compose up -d lovable-app
```

### Ver logs:
```bash
docker-compose logs -f lovable-app
```

### Atualizar código:
```bash
git pull
docker-compose up -d --build lovable-app
```

### Parar tudo:
```bash
docker-compose down
```

---

## 📝 Estrutura de Arquivos

```
seu-repo/
├── Dockerfile              # Configuração da imagem Docker
├── nginx.conf              # Configuração do servidor Nginx
├── docker-compose.yml      # Orquestração dos containers
├── .dockerignore           # Arquivos ignorados no build
├── src/                    # Código fonte React
├── public/                 # Arquivos estáticos
└── package.json            # Dependências Node.js
```

---

## 🔒 Segurança

- ✅ App roda na rede interna (sem exposição à internet)
- ✅ Comunicação direta entre containers Docker
- ✅ Sem necessidade de VPN
- ✅ URLs do n8n cloud continuam seguras (HTTPS)

---

## ⚡ Dicas de Performance

1. **Cache do Docker**: O build usa cache de camadas para ser mais rápido
2. **Nginx otimizado**: Compressão gzip e cache de assets estáticos
3. **Multi-stage build**: Imagem final é pequena (apenas arquivos de produção)

---

## 🆘 Troubleshooting

### App não atualiza após mudanças:
```bash
# Limpe o cache do navegador ou use Ctrl+Shift+R
# Rebuild sem cache:
docker-compose build --no-cache lovable-app
```

### Erro de conexão com n8n:
- Verifique se os containers estão na mesma rede Docker
- Use `docker network inspect clinic-network` para verificar
- Teste com `docker exec -it lovable-radiology-app ping n8n`

### Mudanças do Lovable não aparecem:
- Verifique se o GitHub está conectado
- Faça `git pull` manualmente para forçar atualização

---

## 📚 Recursos

- [Documentação Lovable](https://docs.lovable.dev/)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [Nginx Docs](https://nginx.org/en/docs/)

---

**Pronto!** Agora você tem um fluxo completo de desenvolvimento com Lovable, GitHub, Cursor e Docker. 🚀
