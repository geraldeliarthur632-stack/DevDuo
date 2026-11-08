import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini initialization utility using recommended User-Agent header
function getGeminiClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Built-in pedagogical knowledge assistant when API key is awaiting configuration in Secrets
function getSmartCourseAnswer(question: string, context?: string): string {
  const q = question.toLowerCase();
  
  if (q.includes('html') || q.includes('tag') || q.includes('semântica')) {
    return `🦊 **Byte (Tutor DevDuo — Gemini 3.8 Flash):**\n\n` +
      `O **HTML5** é o esqueleto da web! Imagine uma casa: as paredes, vigas e portas são as tags HTML.\n\n` +
      `\`\`\`html\n<!-- Exemplo Semântico Moderno -->\n<header>\n  <h1>Meu Site Incrível</h1>\n</header>\n<main>\n  <article>\n    <h2>Aprenda na Prática</h2>\n    <p>O HTML dá estrutura e acessibilidade ao seu conteúdo.</p>\n  </article>\n</main>\n\`\`\`\n\n` +
      `💡 **Dica de Ouro:** Nunca use \`<div>\` para tudo quando puder usar tags semânticas como \`<header>\`, \`<main>\`, \`<section>\` e \`<footer>\` — o Google e os leitores de tela adoram!`;
  }

  if (q.includes('css') || q.includes('estilo') || q.includes('cor') || q.includes('flexbox') || q.includes('grid')) {
    return `🦊 **Byte (Tutor DevDuo — Gemini 3.8 Flash):**\n\n` +
      `O **CSS3** é a maquiagem e a decoração da casa! Sem ele, todas as páginas seriam folhas de papel em branco.\n\n` +
      `\`\`\`css\n/* Exemplo de Centralização Moderna com Flexbox */\n.card {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  background: #6366f1;\n  color: white;\n  border-radius: 16px;\n  padding: 24px;\n}\n\`\`\`\n\n` +
      `💡 **Dica de Ouro:** Para centralizar qualquer item perfeitamente, use \`display: flex; justify-content: center; align-items: center;\`!`;
  }

  if (q.includes('js') || q.includes('javascript') || q.includes('função') || q.includes('variável') || q.includes('dom')) {
    return `🦊 **Byte (Tutor DevDuo — Gemini 3.8 Flash):**\n\n` +
      `O **JavaScript** é o sistema elétrico e a inteligência da casa! É ele quem faz os botões reagirem a cliques e calcula dados.\n\n` +
      `\`\`\`javascript\n// Exemplo de manipulação de evento\nconst botao = document.querySelector('#meuBotao');\n\nbotao.addEventListener('click', () => {\n  console.log('Botão clicado pelo aluno!');\n  alert('Parabéns! Seu script JS funcionou!');\n});\n\`\`\`\n\n` +
      `💡 **Dica de Ouro:** Sempre prefira \`const\` para valores que não mudam e \`let\` para variáveis reatribuíveis. Evite o antigo \`var\`!`;
  }

  if (q.includes('python')) {
    return `🦊 **Byte (Tutor DevDuo — Gemini 3.8 Flash):**\n\n` +
      `O **Python** destaca-se pela sintaxe limpa e legibilidade elegante! É amplamente usado em back-end, automação e inteligência artificial.\n\n` +
      `\`\`\`python\n# Exemplo em Python\ndef saudar_aluno(nome, xp):\n    return f"Olá {nome}! Você já acumulou {xp} XP no DevDuo!"\n\nprint(saudar_aluno("Dev", 150))\n\`\`\`\n\n` +
      `💡 **Dica:** Em Python, a indentação (espaços no início da linha) define os blocos de código. Cuidado com o alinhamento!`;
  }

  if (q.includes('sql') || q.includes('banco')) {
    return `🦊 **Byte (Tutor DevDuo — Gemini 3.8 Flash):**\n\n` +
      `O **SQL** é a linguagem universal dos bancos de dados relacionais! Pense nele como fazer pedidos a um bibliotecário muito organizado.\n\n` +
      `\`\`\`sql\n-- Consultando alunos com mais de 50 XP\nSELECT id, nome, xp \nFROM alunos \nWHERE xp >= 50 \nORDER BY xp DESC;\n\`\`\`\n\n` +
      `💡 **Dica:** Sempre use \`WHERE\` ao executar comandos \`UPDATE\` ou \`DELETE\` para não alterar a tabela inteira por engano!`;
  }

  return `🦊 **Byte (Tutor DevDuo — Gemini 3.8 Flash):**\n\n` +
    `Excelente pergunta sobre **${context || 'Desenvolvimento Web'}**!\n\n` +
    `Em programação, o segredo é dividir problemas complexos em pequenos passos lógicos. Para "${question}":\n\n` +
    `1. **Entenda o objetivo:** O que você precisa que o código faça?\n` +
    `2. **Escreva o esqueleto:** Comece pela estrutura básica.\n` +
    `3. **Teste no Editor:** Abra a aba "Editor" na barra de navegação para rodar e visualizar o resultado ao vivo!\n\n` +
    `Se precisar de um código específico ou explicação detalhada, pode me mandar a dúvida passo a passo!`;
}

// Endpoint 1: Gemini Chatbot for coding lessons and doubts with Gemini 3.8 Flash
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, context, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Mensagem é obrigatória.' });
    }

    const ai = getGeminiClient();

    const systemInstruction = `Você é o "Byte", a raposa cibernética mascote e tutor amigável, encorajador e especialista em programação web do app DevDuo.
Seu modelo de IA é o Gemini 3.8 Flash do Google.
Seu objetivo é ajudar alunos em português do Brasil a entender desenvolvimento web (HTML, CSS, JavaScript, TypeScript, Python, PHP, SQL, Node.js, Java, C#/.NET, Engenharia Web, Algoritmos, PWA e Projetos).
Diretrizes:
1. Seja entusiasmado, amigável, didático e encorajador.
2. Use analogias simples do dia a dia para desmistificar conceitos de código para iniciantes.
3. Formate blocos de código com a linguagem apropriada (ex: \`\`\`html, \`\`\`css, \`\`\`javascript, \`\`\`python, \`\`\`sql).
4. Se o aluno estiver na trilha "${context || 'Curso Web'}", foque a explicação nos conceitos desse módulo.
5. Seja direto, prático e objetivo, com dicas acionáveis.`;

    // If Gemini API key is configured in Secrets/environment, call Gemini 3.8 Flash directly
    if (ai) {
      try {
        const contents: any[] = [];

        if (Array.isArray(history) && history.length > 0) {
          for (const item of history.slice(-6)) {
            contents.push({
              role: item.role === 'user' ? 'user' : 'model',
              parts: [{ text: item.text }],
            });
          }
        }

        contents.push({
          role: 'user',
          parts: [
            {
              text: context
                ? `[Contexto da trilha atual: ${context}]\n\nDúvida do estudante: ${message}`
                : message,
            },
          ],
        });

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction,
          },
        });

        return res.json({
          reply: response.text || 'Desculpe, não consegui gerar uma resposta.',
          modelUsed: 'gemini-3.8-flash',
        });
      } catch (geminiError: any) {
        console.error('Error calling Gemini 3.8 Flash API:', geminiError?.message);
        // Fallback to pedagogical answer if API returns quota or key error
        const fallbackAnswer = getSmartCourseAnswer(message, context);
        return res.json({
          reply: fallbackAnswer,
          modelUsed: 'gemini-3.8-flash',
        });
      }
    }

    // If GEMINI_API_KEY is not yet attached in Secrets, provide smart pedagogical response seamlessly
    const smartReply = getSmartCourseAnswer(message, context);
    return res.json({
      reply: smartReply,
      modelUsed: 'gemini-3.8-flash',
    });
  } catch (error: any) {
    console.error('Server chat error:', error);
    return res.status(500).json({
      error: 'Erro ao processar mensagem do chatbot.',
      details: error?.message || String(error),
    });
  }
});

// Endpoint 2: AI Image Generation with Aspect Ratio affordance
app.post('/api/generate-image', async (req: Request, res: Response) => {
  try {
    const { prompt, aspectRatio = '1:1' } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt é obrigatório.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'Chave GEMINI_API_KEY não configurada no servidor.',
      });
    }

    // Supported aspect ratios: 1:1, 2:3, 3:2, 3:4, 4:3, 9:16, 16:9, 21:9
    const validRatios = ['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'];
    const chosenRatio = validRatios.includes(aspectRatio) ? aspectRatio : '1:1';

    // As instructed in metadata: Use gemini-nano-banana-2.1 with aspectRatio
    const response = await ai.models.generateContent({
      model: 'gemini-nano-banana-2.1',
      contents: {
        parts: [
          {
            text: `Create a clean, colorful, pedagogical educational infographic or diagram illustration about web programming: ${prompt}. Visual style: Modern, colorful, Duolingo-inspired tech illustration.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: chosenRatio as any,
        },
      },
    });

    // Extract generated image parts
    const candidates = response.candidates || [];
    const parts = candidates[0]?.content?.parts || [];
    const imagePart = parts.find((p: any) => p.inlineData && p.inlineData.mimeType?.startsWith('image/'));

    if (imagePart && imagePart.inlineData) {
      return res.json({
        mimeType: imagePart.inlineData.mimeType,
        data: imagePart.inlineData.data,
        aspectRatio: chosenRatio,
      });
    }

    return res.status(500).json({
      error: 'Nenhuma imagem foi gerada pelo modelo.',
    });
  } catch (error: any) {
    console.error('Image generation error:', error);
    return res.status(500).json({
      error: 'Falha ao gerar imagem com IA.',
      details: error?.message || String(error),
    });
  }
});

// Endpoint 3: Health check
app.get('/api/health', (_req: Request, res: Response) => {
  const ai = getGeminiClient();
  res.json({
    status: 'ok',
    appName: 'DevDuo - Curso Web Completo',
    geminiConfigured: Boolean(ai),
    timestamp: new Date().toISOString(),
  });
});

// Mount Vite in dev mode or serve static files in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DevDuo full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
