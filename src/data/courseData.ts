export interface Lesson {
  id: string;
  number: number;
  title: string;
  analogy?: string;
  explanation: string;
  codeExample: string;
  goldenTip?: string;
}

export interface QuizOption {
  key: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctAnswer: string;
}

export interface CourseModule {
  id: string;
  number: number;
  title: string;
  purpose: string;
  whatYouWillLearn: string[];
  quickExample: string;
  lessons: Lesson[];
  practicalExercise: string;
  quizzes: QuizQuestion[];
}

export const COURSE_MODULES: CourseModule[] = [
  {
    "id": "mod-1",
    "number": 1,
    "title": "HTML5 — Elemento por Elemento",
    "purpose": "Aprenda cada tag e elemento do HTML5 individualmente de forma isolada e prática, no estilo Coddy.tech.",
    "whatYouWillLearn": [
      "Todas as tags de estrutura: DOCTYPE, html, head, title, body",
      "Tags de texto: h1-h6, p, strong, em, mark, small, del, ins",
      "Links e atributos: a, href, target",
      "Imagens e atributos: img, src, alt",
      "Listas: ul, ol, li",
      "Formulários: form, input text, email, password, label, button, textarea",
      "Semântica: header, nav, main, section, article, footer, div, span"
    ],
    "quickExample": "<!DOCTYPE html>\n<html>\n  <head><title>Padrão HTML5</title></head>\n  <body><p>Documento oficial HTML5</p></body>\n</html>",
    "lessons": [
      {
        "id": "mod-1-lesson-1",
        "number": 1,
        "title": "<!DOCTYPE html>",
        "analogy": "É como a certidão de nascimento do documento. Avisa ao navegador: \"Atenção, este é um site moderno escrito no padrão HTML5!\"",
        "explanation": "A declaração <!DOCTYPE html> informa ao navegador qual versão do HTML está sendo utilizada. Ela deve ser sempre a PRIMEIRA linha de qualquer arquivo HTML, antes de qualquer tag, para evitar que o navegador entre no modo antigo de compatibilidade (Quirks Mode).",
        "goldenTip": "Não tem tag de fechamento e não diferencia maiúsculas de minúsculas, mas a convenção padrão da indústria é escrever exatamente <!DOCTYPE html>.",
        "codeExample": "<!DOCTYPE html>\n<html>\n  <head><title>Padrão HTML5</title></head>\n  <body><p>Documento oficial HTML5</p></body>\n</html>"
      },
      {
        "id": "mod-1-lesson-2",
        "number": 2,
        "title": "<html>",
        "analogy": "É a caixa principal que guarda todos os brinquedos. Nada pode existir fora dela.",
        "explanation": "O elemento <html> é o elemento raiz (root) de todo documento HTML. Todos os outros elementos da página devem ser descendentes diretos ou indiretos desta tag.",
        "goldenTip": "Sempre inclua o atributo lang=\"pt-BR\" na tag raiz: <html lang=\"pt-BR\"> para que leitores de tela e o Google saibam o idioma do site.",
        "codeExample": "<html lang=\"pt-BR\">\n  <head><title>Idioma Português</title></head>\n  <body><p>Olá, Brasil!</p></body>\n</html>"
      },
      {
        "id": "mod-1-lesson-3",
        "number": 3,
        "title": "<head>",
        "analogy": "É como a mente ou os bastidores do site: guarda pensamentos, configurações e instruções invisíveis para o visitante.",
        "explanation": "O elemento <head> contém metadados (dados sobre dados). Aqui ficam o título da página, codificação de caracteres, links para arquivos CSS externos, scripts e ícones.",
        "goldenTip": "Nada do que está dentro do <head> aparece diretamente desenhado na tela, exceto o título que vai na aba do navegador.",
        "codeExample": "<head>\n  <meta charset=\"UTF-8\">\n  <title>Aba do Navegador</title>\n</head>"
      },
      {
        "id": "mod-1-lesson-4",
        "number": 4,
        "title": "<title>",
        "analogy": "É a placa com o nome na porta de uma sala. Identifica quem você é antes mesmo de entrar.",
        "explanation": "O elemento <title> define o título da página que aparece na aba do navegador, na barra de favoritos e nos resultados de busca do Google.",
        "goldenTip": "Crie títulos descritivos entre 50 e 60 caracteres contendo palavras-chave relevantes para o SEO do seu site.",
        "codeExample": "<title>DevDuo - Aprenda Programação do Zero</title>"
      },
      {
        "id": "mod-1-lesson-5",
        "number": 5,
        "title": "<meta charset=\"UTF-8\">",
        "analogy": "É o tradutor universal. Garante que acentos como \"ç\", \"ã\", \"é\" e emojis não virem símbolos estranhos.",
        "explanation": "A tag <meta charset=\"UTF-8\"> declara a codificação de caracteres do documento. O UTF-8 suporta praticamente todos os idiomas e caracteres do planeta.",
        "goldenTip": "Coloque sempre como o primeiro elemento dentro do <head> para evitar erros de renderização de fontes.",
        "codeExample": "<meta charset=\"UTF-8\">"
      },
      {
        "id": "mod-1-lesson-6",
        "number": 6,
        "title": "<meta name=\"viewport\">",
        "analogy": "São os óculos de grau para smartphones: garante que o site caiba na tela do celular sem ficar minúsculo.",
        "explanation": "Define como a página deve ser dimensionada em telas móveis. Sem ela, smartphones renderizam o site com largura de desktop de 980px, forçando o usuário a dar zoom.",
        "goldenTip": "A configuração padrão obrigatória para todo site responsivo é: content=\"width=device-width, initial-scale=1.0\".",
        "codeExample": "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">"
      },
      {
        "id": "mod-1-lesson-7",
        "number": 7,
        "title": "<body>",
        "analogy": "É o palco iluminado do teatro. Tudo o que os espectadores podem ver e interagir acontece aqui.",
        "explanation": "O elemento <body> contém todo o conteúdo visível de um documento HTML: textos, imagens, vídeos, tabelas, botões, formulários e links.",
        "goldenTip": "Só pode existir um único elemento <body> por página HTML.",
        "codeExample": "<body>\n  <h1>Bem-vindo ao Meu Site</h1>\n  <p>Todo este conteúdo é visível aos olhos do visitante.</p>\n</body>"
      },
      {
        "id": "mod-1-lesson-8",
        "number": 8,
        "title": "<h1>",
        "analogy": "É a manchete principal na capa do jornal diário. Apenas o tema mais importante ganha esse destaque.",
        "explanation": "O <h1> representa o nível mais alto de título em uma página. Por padrão, navegadores exibem com a maior fonte e peso em negrito.",
        "goldenTip": "Regra de ouro de acessibilidade e SEO: use apenas UM único <h1> por página, representando o tema central do documento.",
        "codeExample": "<h1>Curso Completo de Desenvolvimento Web</h1>"
      },
      {
        "id": "mod-1-lesson-9",
        "number": 9,
        "title": "<h2>",
        "analogy": "É o título de um capítulo em um livro.",
        "explanation": "O <h2> é o segundo nível de hierarquia textual. É utilizado para dividir o conteúdo da página em grandes seções temáticas.",
        "goldenTip": "Você pode ter vários <h2> na mesma página para dividir diferentes seções lógicas.",
        "codeExample": "<h2>Módulo 1: Introdução ao HTML</h2>\n<h2>Módulo 2: Estilização com CSS</h2>"
      },
      {
        "id": "mod-1-lesson-10",
        "number": 10,
        "title": "<h3>",
        "analogy": "É o subtítulo de um parágrafo dentro de um capítulo.",
        "explanation": "O <h3> representa o terceiro nível de título. Deve ser usado como subdivisão dentro de um <h2>.",
        "goldenTip": "Nunca pule níveis de hierarquia (ex: nunca pule direto de um <h1> para um <h3> sem um <h2> antes).",
        "codeExample": "<h2>Linguagens Web</h2>\n<h3>Sintaxe Básica</h3>\n<h3>Exemplos Práticos</h3>"
      },
      {
        "id": "mod-1-lesson-11",
        "number": 11,
        "title": "<h4>",
        "analogy": "Uma seção detalhada dentro de um subtítulo.",
        "explanation": "O <h4> representa o quarto nível de cabeçalho na hierarquia do documento HTML.",
        "goldenTip": "Ideal para dividir subtemas técnicos dentro de um bloco <h3>.",
        "codeExample": "<h4>Notas de Configuração</h4>\n<p>Instruções específicas para macOS e Linux.</p>"
      },
      {
        "id": "mod-1-lesson-12",
        "number": 12,
        "title": "<h5>",
        "analogy": "Uma nota de detalhe dentro de uma subseção.",
        "explanation": "O <h5> é o quinto nível de hierarquia textual.",
        "goldenTip": "Utilize apenas quando a estrutura do texto exigir uma árvore de tópicos muito profunda.",
        "codeExample": "<h5>Versões Suportadas</h5>\n<p>Node.js v18 ou superior.</p>"
      },
      {
        "id": "mod-1-lesson-13",
        "number": 13,
        "title": "<h6>",
        "analogy": "O menor título nativo que um documento pode ter.",
        "explanation": "O <h6> representa o sexto e último nível de cabeçalho padrão suportado pelo HTML.",
        "goldenTip": "Visualmente seu tamanho nativo pode ser até menor do que um parágrafo normal.",
        "codeExample": "<h6>Aviso Legal Técnico</h6>"
      },
      {
        "id": "mod-1-lesson-14",
        "number": 14,
        "title": "<p>",
        "analogy": "É um bloco de texto normal, como um parágrafo de uma notícia ou mensagem.",
        "explanation": "O elemento <p> define um parágrafo de texto. Navegadores adicionam automaticamente uma margem superior e inferior antes e depois de cada <p>.",
        "goldenTip": "Não use tags <br> para separar parágrafos; sempre envolva cada bloco de texto em seu próprio <p>.",
        "codeExample": "<p>Este é o primeiro parágrafo do artigo.</p>\n<p>Este é o segundo parágrafo com novo pensamento.</p>"
      },
      {
        "id": "mod-1-lesson-15",
        "number": 15,
        "title": "<strong>",
        "analogy": "É como falar uma palavra em voz alta e firme para chamar a atenção.",
        "explanation": "O elemento <strong> indica que o texto possui grande importância semântica ou urgência. Além de ficar em negrito, leitores de tela mudam a entonação da voz.",
        "goldenTip": "Use <strong> para importância real (SEO e acessibilidade). Se quiser apenas deixar em negrito visual sem peso semântico, use CSS font-weight.",
        "codeExample": "<p>Atenção: o prazo final é <strong>hoje às 23h59</strong>!</p>"
      },
      {
        "id": "mod-1-lesson-16",
        "number": 16,
        "title": "<em>",
        "analogy": "É como inclinar a voz para dar ênfase especial a uma palavra em uma frase.",
        "explanation": "O elemento <em> (emphasis) adiciona ênfase semântica ao texto, alterando o significado sutil da frase. É exibido em itálico pelos navegadores.",
        "goldenTip": "Diferente da antiga tag <i> (que era puramente visual), <em> comunica aos sintetizadores de voz que a palavra deve ser enfatizada.",
        "codeExample": "<p>Eu <em>realmente</em> preciso aprender a programar.</p>"
      },
      {
        "id": "mod-1-lesson-17",
        "number": 17,
        "title": "<u>",
        "analogy": "Uma linha embaixo do texto para destacar termos específicos ou nomes próprios.",
        "explanation": "O elemento <u> adiciona um sublinhado visual ao texto.",
        "goldenTip": "Cuidado ao usar <u> na web: usuários podem confundir texto sublinhado com um link clicável!",
        "codeExample": "<p>O autor do projeto é <u>Carlos Silva</u>.</p>"
      },
      {
        "id": "mod-1-lesson-18",
        "number": 18,
        "title": "<mark>",
        "analogy": "É a caneta marca-texto amarela que você usa para grifar um trecho importante do livro.",
        "explanation": "O elemento <mark> destaca visualmente uma parte do texto com fundo colorido (geralmente amarelo brilhante).",
        "goldenTip": "Muito utilizado para destacar o termo que o usuário pesquisou em uma barra de busca.",
        "codeExample": "<p>Encontramos o resultado para <mark>programação</mark> na página 12.</p>"
      },
      {
        "id": "mod-1-lesson-19",
        "number": 19,
        "title": "<small>",
        "analogy": "São as letras miúdas de um contrato ou a nota de rodapé.",
        "explanation": "O elemento <small> representa comentários secundários, direitos autorais e termos legais que devem ter menor relevância visual.",
        "goldenTip": "Perfeito para direitos autorais em rodapés: <small>&copy; 2026 Todos os direitos reservados.</small>",
        "codeExample": "<p>Assine já o plano! <small>*Cobrança recorrente mensal.</small></p>"
      },
      {
        "id": "mod-1-lesson-20",
        "number": 20,
        "title": "<del> e <ins>",
        "analogy": "Um preço riscado na vitrine com o novo preço promocional ao lado.",
        "explanation": "<del> representa texto removido/tachado. <ins> representa texto inserido/adicionado.",
        "goldenTip": "Muito comum em lojas virtuais para mostrar promoções de \"De R$ 100 por R$ 79\".",
        "codeExample": "<p>Preço: <del>R$ 150,00</del> por <ins>R$ 99,00</ins>!</p>"
      },
      {
        "id": "mod-1-lesson-21",
        "number": 21,
        "title": "<a>",
        "analogy": "É o portal mágico que transporta o visitante de uma página para qualquer lugar do planeta.",
        "explanation": "A tag <a> (âncora) cria hiperlinks. O atributo essencial href (hypertext reference) define o destino para onde o usuário será levado.",
        "goldenTip": "Sempre defina um texto claro no link; evite escrever apenas \"clique aqui\", prefira \"Consulte a tabela de preços\".",
        "codeExample": "<a href=\"https://google.com\">Acessar o Google</a>"
      },
      {
        "id": "mod-1-lesson-22",
        "number": 22,
        "title": "target=\"_blank\"",
        "analogy": "Uma porta que abre uma sala nova sem fechar a sala em que você está.",
        "explanation": "O atributo target=\"_blank\" dentro da tag <a> instrui o navegador a abrir o link em uma nova aba.",
        "goldenTip": "Sempre adicione rel=\"noopener noreferrer\" ao usar target=\"_blank\" por motivos de segurança e desempenho.",
        "codeExample": "<a href=\"https://github.com\" target=\"_blank\" rel=\"noopener noreferrer\">Ver no GitHub</a>"
      },
      {
        "id": "mod-1-lesson-23",
        "number": 23,
        "title": "<img>",
        "analogy": "Uma moldura de quadro pendurada na parede da página.",
        "explanation": "A tag <img> insere imagens na página. É uma tag vazia (self-closing), ou seja, não precisa de </img>.",
        "goldenTip": "Os atributos src (caminho da imagem) e alt (descrição da imagem) são obrigatórios em toda tag <img>.",
        "codeExample": "<img src=\"https://picsum.photos/300/200\" alt=\"Paisagem natural com árvores\">"
      },
      {
        "id": "mod-1-lesson-24",
        "number": 24,
        "title": "alt (Texto Alternativo)",
        "analogy": "Uma descrição em áudio de uma pintura para quem não pode enxergá-la.",
        "explanation": "O atributo alt descreve o conteúdo visual da imagem para leitores de tela de pessoas cegas e é exibido caso a imagem falhe ao carregar.",
        "goldenTip": "Seja descritivo e objetivo. Nunca deixe o alt vazio a menos que a imagem seja puramente decorativa (ícone de enfeite).",
        "codeExample": "<img src=\"logo.png\" alt=\"Logotipo do DevDuo com a raposa Byte\">"
      },
      {
        "id": "mod-1-lesson-25",
        "number": 25,
        "title": "<ul>",
        "analogy": "Uma lista de compras no mercado: a ordem em que você pega os itens não importa.",
        "explanation": "O elemento <ul> (unordered list) cria uma lista de tópicos com marcadores (bolinhas pretas por padrão).",
        "goldenTip": "Dentro de um <ul> só podem existir elementos <li> diretamente como filhos.",
        "codeExample": "<ul>\n  <li>HTML5</li>\n  <li>CSS3</li>\n  <li>JavaScript</li>\n</ul>"
      },
      {
        "id": "mod-1-lesson-26",
        "number": 26,
        "title": "<ol>",
        "analogy": "Uma receita de bolo ou o pódio de uma corrida: a ordem dos passos faz toda a diferença!",
        "explanation": "O elemento <ol> (ordered list) cria uma lista numerada sequencialmente (1, 2, 3...).",
        "goldenTip": "Você pode inverter a numeração usando o atributo reversed ou começar de outro número com start=\"5\".",
        "codeExample": "<ol>\n  <li>Ligar o forno</li>\n  <li>Bater os ovos</li>\n  <li>Assar por 40 minutos</li>\n</ol>"
      },
      {
        "id": "mod-1-lesson-27",
        "number": 27,
        "title": "<li>",
        "analogy": "Cada linha individual escrita na sua lista de papel.",
        "explanation": "O elemento <li> (list item) representa um item dentro de uma lista <ul> ou <ol>.",
        "goldenTip": "Pode conter textos, links, imagens e até outras listas aninhadas dentro dele.",
        "codeExample": "<ul>\n  <li>Primeiro item</li>\n  <li>Segundo item</li>\n</ul>"
      },
      {
        "id": "mod-1-lesson-28",
        "number": 28,
        "title": "<button>",
        "analogy": "A campainha ou o interruptor de luz na parede esperando o seu clique.",
        "explanation": "O elemento <button> cria um botão interativo que dispara ações na página quando clicado.",
        "goldenTip": "Dentro de formulários, o type padrão é submit. Para botões normais com JavaScript, use sempre type=\"button\".",
        "codeExample": "<button type=\"button\" onclick=\"alert('Clicou!')\">Clique em Mim</button>"
      },
      {
        "id": "mod-1-lesson-29",
        "number": 29,
        "title": "<form>",
        "analogy": "Um envelope de correspondência onde você coloca seus dados antes de enviar pelo correio.",
        "explanation": "O elemento <form> agrupa campos interativos (inputs, selects, textareas) e envia seus valores para um servidor.",
        "goldenTip": "Os atributos mais importantes são action (URL do servidor que receberá) e method (GET ou POST).",
        "codeExample": "<form action=\"/login\" method=\"POST\">\n  <button type=\"submit\">Enviar Dados</button>\n</form>"
      },
      {
        "id": "mod-1-lesson-30",
        "number": 30,
        "title": "<input type=\"text\">",
        "analogy": "Uma linha em branco esperando você preencher seu nome.",
        "explanation": "Cria uma caixa de texto de linha única para que o usuário digite qualquer caractere livremente.",
        "goldenTip": "Use o atributo placeholder=\"Digite aqui\" para mostrar uma dica temporária dentro do campo.",
        "codeExample": "<input type=\"text\" placeholder=\"Digite seu nome completo\">"
      },
      {
        "id": "mod-1-lesson-31",
        "number": 31,
        "title": "<input type=\"email\">",
        "analogy": "Uma catraca que só deixa passar quem tem o bilhete no formato de e-mail.",
        "explanation": "Campo especializado para e-mails. O navegador valida automaticamente se o texto contém \"@\" e um domínio válido.",
        "goldenTip": "Em smartphones, o teclado abre automaticamente com a tecla \"@\" em destaque.",
        "codeExample": "<input type=\"email\" placeholder=\"seu.email@exemplo.com\" required>"
      },
      {
        "id": "mod-1-lesson-32",
        "number": 32,
        "title": "<input type=\"password\">",
        "analogy": "Um teclado com máscara que esconde o que você digita para ninguém espiar por cima do ombro.",
        "explanation": "Mascara os caracteres digitados com pontinhos pretos ou asteriscos para proteger senhas.",
        "goldenTip": "Sempre utilize HTTPS no seu site ao transmitir campos de senha para o servidor.",
        "codeExample": "<input type=\"password\" placeholder=\"Digite sua senha secreta\">"
      },
      {
        "id": "mod-1-lesson-33",
        "number": 33,
        "title": "<label>",
        "analogy": "A etiqueta colada na frente de uma gaveta que diz exatamente o que tem dentro.",
        "explanation": "O elemento <label> define uma legenda descritiva para um campo de formulário.",
        "goldenTip": "Conecte o label ao input usando o atributo for=\"campoId\": quando o usuário clica no label, o campo ganha foco!",
        "codeExample": "<label for=\"nome\">Nome Completo:</label>\n<input type=\"text\" id=\"nome\">"
      },
      {
        "id": "mod-1-lesson-34",
        "number": 34,
        "title": "<textarea>",
        "analogy": "Uma folha inteira de caderno pautado para escrever mensagens longas.",
        "explanation": "Permite a entrada de múltiplas linhas de texto. Muito usado para campos de mensagens, comentários e biografia.",
        "goldenTip": "Diferente do <input>, o <textarea> tem tag de fechamento obrigatória: <textarea></textarea>.",
        "codeExample": "<textarea rows=\"4\" cols=\"40\" placeholder=\"Escreva sua mensagem aqui...\"></textarea>"
      },
      {
        "id": "mod-1-lesson-35",
        "number": 35,
        "title": "<div>",
        "analogy": "Uma caixa organizadora de papelão para agrupar coisas dentro do armário.",
        "explanation": "O <div> (division) é um contêiner genérico de bloco que não possui significado semântico. Usado para agrupar elementos e aplicar estilos CSS.",
        "goldenTip": "Só use <div> quando nenhuma tag semântica (como <header>, <section>, <article>) fizer sentido.",
        "codeExample": "<div class=\"card\">\n  <h2>Título do Card</h2>\n  <p>Conteúdo agrupado dentro do div.</p>\n</div>"
      },
      {
        "id": "mod-1-lesson-36",
        "number": 36,
        "title": "<span>",
        "analogy": "Um pedaço de fita adesiva colorida colado em cima de uma palavra no meio de uma frase.",
        "explanation": "O <span> é um contêiner genérico em linha (inline). Não quebra linha e serve para aplicar estilos a um trecho específico de texto.",
        "goldenTip": "Use para destacar palavras isoladas: <p>O preço é <span class=\"destaque\">R$ 50</span>.</p>",
        "codeExample": "<p>Aprendendo <span style=\"color: blue;\">HTML5</span> na prática.</p>"
      },
      {
        "id": "mod-1-lesson-37",
        "number": 37,
        "title": "<header>",
        "analogy": "O topo da página, como o logotipo e o cabeçalho no topo de uma folha timbrada.",
        "explanation": "Elemento semântico que representa o cabeçalho introdutório de uma página ou de um artigo.",
        "goldenTip": "Geralmente contém o logotipo do site, o título principal e a navegação principal.",
        "codeExample": "<header>\n  <h1>Meu Site</h1>\n  <p>Construindo a web moderna</p>\n</header>"
      },
      {
        "id": "mod-1-lesson-38",
        "number": 38,
        "title": "<nav>",
        "analogy": "O mapa do shopping que mostra onde ficam as lojas e escadas.",
        "explanation": "Elemento semântico reservado especificamente para blocos de links de navegação principal.",
        "goldenTip": "Leitores de tela para cegos permitem que o usuário pule direto para o <nav> para navegar pelo site.",
        "codeExample": "<nav>\n  <a href=\"#home\">Início</a>\n  <a href=\"#aulas\">Aulas</a>\n  <a href=\"#contato\">Contato</a>\n</nav>"
      },
      {
        "id": "mod-1-lesson-39",
        "number": 39,
        "title": "<main>",
        "analogy": "O prato principal em um banquete.",
        "explanation": "Representa o conteúdo principal e exclusivo daquele documento específico.",
        "goldenTip": "Deve existir apenas UM único elemento <main> por página e ele não deve se repetir entre páginas diferentes.",
        "codeExample": "<main>\n  <h1>Conteúdo Exclusivo Desta Página</h1>\n  <p>O texto central fica aqui.</p>\n</main>"
      },
      {
        "id": "mod-1-lesson-40",
        "number": 40,
        "title": "<footer>",
        "analogy": "O rodapé assinado no final de uma carta.",
        "explanation": "Representa o rodapé da página ou de uma seção. Contém informações de autoria, copyright, links de termos de uso e redes sociais.",
        "goldenTip": "Fica no final do documento, fechando a estrutura semântica do site.",
        "codeExample": "<footer>\n  <p>&copy; 2026 DevDuo. Todos os direitos reservados.</p>\n</footer>"
      }
    ],
    "practicalExercise": "Abra o editor na barra inferior e teste o código deste elemento modificando seus valores.",
    "quizzes": [
      {
        "id": "quiz-mod-1-1",
        "question": "Qual é o objetivo principal do aprendizado elemento por elemento em HTML5 — Elemento por Elemento?",
        "options": [
          {
            "key": "A",
            "text": "Entender a função, a anatomia e a aplicação de cada código isoladamente"
          },
          {
            "key": "B",
            "text": "Decorar comandos sem compreender a prática"
          },
          {
            "key": "C",
            "text": "Misturar tudo numa aula só"
          }
        ],
        "correctAnswer": "A"
      }
    ]
  },
  {
    "id": "mod-2",
    "number": 2,
    "title": "CSS3 — Propriedade por Propriedade",
    "purpose": "Aprenda cada propriedade de estilização visual do CSS isoladamente com exemplos práticos e diretos.",
    "whatYouWillLearn": [
      "Cores e fundos: color, background-color",
      "Tipografia: font-size, font-family, font-weight, text-align",
      "Espaçamentos e dimensões: width, height, padding, margin",
      "Bordas e efeitos: border, border-radius, box-shadow",
      "Display e layouts: block, inline, display: flex, justify-content, align-items, gap, flex-direction, display: grid",
      "Pseudo-classes: :hover"
    ],
    "quickExample": "h1 {\n  color: #4f46e5;\n}",
    "lessons": [
      {
        "id": "mod-2-lesson-1",
        "number": 1,
        "title": "color (Cor do Texto)",
        "analogy": "A cor da tinta da caneta com que você escreve o texto.",
        "explanation": "A propriedade color altera a cor do texto do elemento selecionado. Aceita nomes de cores (red, blue), hexadecimal (#6366f1) ou rgb().",
        "goldenTip": "Sempre garanta contraste suficiente entre a cor do texto e o fundo para que pessoas com baixa visão consigam ler.",
        "codeExample": "h1 {\n  color: #4f46e5;\n}"
      },
      {
        "id": "mod-2-lesson-2",
        "number": 2,
        "title": "background-color (Cor de Fundo)",
        "analogy": "A cor do papel ou da parede onde o texto está desenhado.",
        "explanation": "Define a cor sólida de fundo de um elemento. Por padrão, a maioria dos elementos tem fundo transparente.",
        "goldenTip": "Pode ser combinada com background-image para carregar uma cor enquanto a imagem carrega.",
        "codeExample": "body {\n  background-color: #f8fafc;\n}"
      },
      {
        "id": "mod-2-lesson-3",
        "number": 3,
        "title": "font-size (Tamanho da Fonte)",
        "analogy": "O botão de zoom do tamanho das letras.",
        "explanation": "Controla a escala do texto. Pode usar pixels (px) ou unidades relativas modernas e acessíveis (rem, em).",
        "goldenTip": "Prefira usar rem em vez de px para tipografia, pois rem respeita as preferências de zoom do usuário.",
        "codeExample": "p {\n  font-size: 1.125rem; /* 18px */\n}"
      },
      {
        "id": "mod-2-lesson-4",
        "number": 4,
        "title": "font-family (Tipografia)",
        "analogy": "O estilo da caligrafia: letra de forma moderna, cursiva elegante ou código monoespaçado.",
        "explanation": "Especifica a família da fonte do texto. Deve incluir fontes de reserva (fallback) separadas por vírgula.",
        "goldenTip": "Sempre termine com uma fonte genérica do sistema, como sans-serif ou monospace.",
        "codeExample": "body {\n  font-family: system-ui, -apple-system, sans-serif;\n}"
      },
      {
        "id": "mod-2-lesson-5",
        "number": 5,
        "title": "font-weight (Espessura)",
        "analogy": "A grossura da ponta do pincel: do traço fininho ao traço super encorpado.",
        "explanation": "Controla o peso das letras: normal (400), bold (700) ou valores numéricos de 100 a 900.",
        "goldenTip": "Só use pesos que a sua fonte importada realmente suporta para evitar distorções no navegador.",
        "codeExample": "h1 {\n  font-weight: 800; /* Extra bold */\n}"
      },
      {
        "id": "mod-2-lesson-6",
        "number": 6,
        "title": "text-align (Alinhamento)",
        "analogy": "A régua que puxa as frases para a esquerda, para o centro ou para a direita.",
        "explanation": "Alinha o texto horizontalmente dentro do seu contêiner pai. Valores: left, center, right, justify.",
        "goldenTip": "Evite justify em sites web porque pode criar buracos estranhos de espaçamento entre palavras em telas estreitas.",
        "codeExample": ".card {\n  text-align: center;\n}"
      },
      {
        "id": "mod-2-lesson-7",
        "number": 7,
        "title": "width e height (Largura e Altura)",
        "analogy": "As dimensões de uma caixa: largura e comprimento medidos em centímetros.",
        "explanation": "Define o tamanho exato da caixa de um elemento na tela em pixels, porcentagem ou unidades de viewport (vw, vh).",
        "goldenTip": "Use max-width: 100% em imagens para que elas nunca vazem da tela em celulares.",
        "codeExample": ".banner {\n  width: 100%;\n  max-width: 600px;\n  height: 300px;\n}"
      },
      {
        "id": "mod-2-lesson-8",
        "number": 8,
        "title": "padding (Espaçamento Interno)",
        "analogy": "O acolchoamento de espuma por dentro de um tênis: afasta o seu pé das bordas duras.",
        "explanation": "Cria espaço dentro da borda do elemento, entre o conteúdo e a linha de contorno.",
        "goldenTip": "Use a ordem do relógio: padding: topo direita baixo esquerda (ex: padding: 10px 20px 10px 20px).",
        "codeExample": ".botao {\n  padding: 12px 24px;\n}"
      },
      {
        "id": "mod-2-lesson-9",
        "number": 9,
        "title": "margin (Espaçamento Externo)",
        "analogy": "O espaço pessoal entre duas pessoas em uma fila: empurra os outros elementos para longe.",
        "explanation": "Cria espaço do lado de fora da borda do elemento, afastando-o dos elementos vizinhos.",
        "goldenTip": "Use margin: 0 auto; em blocos com largura definida para centralizá-los perfeitamente na horizontal!",
        "codeExample": ".conteiner {\n  max-width: 800px;\n  margin: 0 auto;\n}"
      },
      {
        "id": "mod-2-lesson-10",
        "number": 10,
        "title": "border (Bordas)",
        "analogy": "A moldura de madeira ao redor de um espelho.",
        "explanation": "Desenha uma linha ao redor do elemento. Sintaxe abreviada: largura estilo cor.",
        "goldenTip": "Os estilos mais comuns são solid (linha contínua), dashed (tracejada) e dotted (pontilhada).",
        "codeExample": ".caixa {\n  border: 2px solid #e2e8f0;\n}"
      },
      {
        "id": "mod-2-lesson-11",
        "number": 11,
        "title": "border-radius (Bordas Arredondadas)",
        "analogy": "Lixar os cantos pontudos de uma mesa de madeira para deixá-la redonda e suave.",
        "explanation": "Arredonda os cantos da caixa. Um valor de 50% em uma caixa quadrada transforma o elemento em um círculo perfeito!",
        "goldenTip": "Muito usado em botões modernos e avatares de perfil circulares.",
        "codeExample": ".avatar {\n  width: 80px;\n  height: 80px;\n  border-radius: 50%;\n}"
      },
      {
        "id": "mod-2-lesson-12",
        "number": 12,
        "title": "box-shadow (Sombras)",
        "analogy": "A sombra que um livro faz sobre a mesa quando uma lâmpada brilha em cima dele.",
        "explanation": "Adiciona sombra projetada à caixa. Sintaxe: deslocamento-x deslocamento-y desfoque espalhamento cor.",
        "goldenTip": "Sombras suaves dão sensação de elevação e profundidade 3D moderna (efeito cartão).",
        "codeExample": ".card {\n  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);\n}"
      },
      {
        "id": "mod-2-lesson-13",
        "number": 13,
        "title": "display: block vs inline",
        "analogy": "Um tijolo grande que ocupa a linha inteira vs uma formiga que anda na mesma linha.",
        "explanation": "display: block ocupa 100% da largura e quebra linha. display: inline só ocupa o tamanho do conteúdo e não aceita largura manual.",
        "goldenTip": "display: inline-block combina o melhor dos dois: fica na mesma linha mas aceita width e height.",
        "codeExample": "span {\n  display: inline-block;\n  width: 100px;\n}"
      },
      {
        "id": "mod-2-lesson-14",
        "number": 14,
        "title": "display: flex (Ativando Flexbox)",
        "analogy": "Uma prateleira elástica mágica onde os livros se organizam sozinhos em linha perfeita.",
        "explanation": "O Flexbox transforma o elemento em um contêiner flexível unidimensional, organizando seus filhos com extrema facilidade.",
        "goldenTip": "É a ferramenta mais utilizada no mundo para alinhar barras de navegação e cartões lado a lado.",
        "codeExample": ".navbar {\n  display: flex;\n}"
      },
      {
        "id": "mod-2-lesson-15",
        "number": 15,
        "title": "justify-content (Alinhamento Horizontal Flex)",
        "analogy": "Distribuir convidados sentados ao longo de uma mesa comprida.",
        "explanation": "Controla como os itens são espaçados no eixo principal: center, space-between, space-around, flex-start, flex-end.",
        "goldenTip": "Use space-between para colocar o logo na extrema esquerda e o botão de menu na extrema direita.",
        "codeExample": ".navbar {\n  display: flex;\n  justify-content: space-between;\n}"
      },
      {
        "id": "mod-2-lesson-16",
        "number": 16,
        "title": "align-items (Alinhamento Vertical Flex)",
        "analogy": "Alinhar pessoas de alturas diferentes pela cintura ou pelo centro dos olhos.",
        "explanation": "Alinha os itens no eixo transversal (vertical por padrão). Valores: center, flex-start, flex-end, stretch.",
        "goldenTip": "O segredo mais famoso da web: display: flex; justify-content: center; align-items: center; centraliza qualquer coisa perfeitamente!",
        "codeExample": ".icone-box {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}"
      },
      {
        "id": "mod-2-lesson-17",
        "number": 17,
        "title": "gap (Espaçamento entre Itens)",
        "analogy": "A distância de 1 metro de segurança entre cada cadeira em uma sala.",
        "explanation": "Define o espaço entre colunas e linhas dentro de contêineres Flexbox ou Grid, sem precisar de margens manuais.",
        "goldenTip": "Substituiu antigas soluções com margin-right nos filhos!",
        "codeExample": ".grade {\n  display: flex;\n  gap: 16px;\n}"
      },
      {
        "id": "mod-2-lesson-18",
        "number": 18,
        "title": "flex-direction (Direção do Fluxo)",
        "analogy": "Decidir se os carros vão andar lado a lado na pista ou um atrás do outro em fila indiana.",
        "explanation": "Define a direção dos itens flexíveis: row (linha horizontal, padrão) ou column (coluna vertical).",
        "goldenTip": "Perfeito para transformar layouts de desktop (row) em layouts de celular (column) em telas pequenas.",
        "codeExample": "@media (max-width: 600px) {\n  .menu {\n    flex-direction: column;\n  }\n}"
      },
      {
        "id": "mod-2-lesson-19",
        "number": 19,
        "title": "display: grid (CSS Grid)",
        "analogy": "Um tabuleiro de xadrez com linhas e colunas perfeitamente desenhadas.",
        "explanation": "O CSS Grid é o sistema bidimensional mais poderoso do CSS, permitindo criar grades completas com linhas e colunas.",
        "goldenTip": "Ideal para galerias de fotos, murais de produtos de e-commerce e painéis dashboards.",
        "codeExample": ".galeria {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 20px;\n}"
      },
      {
        "id": "mod-2-lesson-20",
        "number": 20,
        "title": ":hover (Efeito ao Passar o Mouse)",
        "analogy": "Um botão que acende uma luz quando a sua mão se aproxima dele.",
        "explanation": "A pseudo-classe :hover aplica estilos especiais quando o cursor do usuário paira sobre o elemento.",
        "goldenTip": "Muito usado em botões para mudar a cor de fundo e indicar interatividade ao usuário.",
        "codeExample": "button:hover {\n  background-color: #4338ca;\n  transform: translateY(-2px);\n}"
      }
    ],
    "practicalExercise": "Abra o editor na barra inferior e teste o código deste elemento modificando seus valores.",
    "quizzes": [
      {
        "id": "quiz-mod-2-1",
        "question": "Qual é o objetivo principal do aprendizado elemento por elemento em CSS3 — Propriedade por Propriedade?",
        "options": [
          {
            "key": "A",
            "text": "Entender a função, a anatomia e a aplicação de cada código isoladamente"
          },
          {
            "key": "B",
            "text": "Decorar comandos sem compreender a prática"
          },
          {
            "key": "C",
            "text": "Misturar tudo numa aula só"
          }
        ],
        "correctAnswer": "A"
      }
    ]
  },
  {
    "id": "mod-3",
    "number": 3,
    "title": "JavaScript — Comando por Comando",
    "purpose": "Aprenda lógica e programação JavaScript com cada comando, palavra-chave e função explicados um por um.",
    "whatYouWillLearn": [
      "Saídas e depuração: console.log()",
      "Variáveis e tipos: let, const, String, Template Strings, Number, Boolean",
      "Operadores: matemáticos, ===, !==, lógicos",
      "Controle de fluxo: if, else",
      "Funções: function, parâmetros, return, arrow functions",
      "Listas e coleções: Array, push, pop, for",
      "Manipulação do DOM: querySelector, textContent, addEventListener click"
    ],
    "quickExample": "console.log(\"Olá, mundo! Meu script está rodando com sucesso!\");",
    "lessons": [
      {
        "id": "mod-3-lesson-1",
        "number": 1,
        "title": "console.log()",
        "analogy": "Um walkie-talkie que sussurra mensagens no ouvido do desenvolvedor para avisar o que está acontecendo.",
        "explanation": "Imprime mensagens, variáveis e objetos no console de desenvolvedor do navegador (F12). Essencial para depuração.",
        "goldenTip": "Abra as ferramentas de desenvolvedor do navegador no menu Inspecionar > Console para ver o resultado.",
        "codeExample": "console.log(\"Olá, mundo! Meu script está rodando com sucesso!\");"
      },
      {
        "id": "mod-3-lesson-2",
        "number": 2,
        "title": "let (Declarar Variável)",
        "analogy": "Uma caixa de papelão com uma etiqueta onde você pode trocar o conteúdo a qualquer momento.",
        "explanation": "let declara uma variável de escopo de bloco que pode ter seu valor alterado e reatribuído ao longo do programa.",
        "goldenTip": "Sempre prefira let no lugar do antigo var, pois let respeita os limites de blocos if/for.",
        "codeExample": "let pontuacao = 0;\npontuacao = 10; // Valor alterado\nconsole.log(pontuacao);"
      },
      {
        "id": "mod-3-lesson-3",
        "number": 3,
        "title": "const (Declarar Constante)",
        "analogy": "Um cofre trancado com chave: o que você colocou lá dentro não pode ser substituído por outra coisa.",
        "explanation": "const declara um identificador cujo valor não pode ser reatribuído. Garante estabilidade e previsibilidade ao código.",
        "goldenTip": "Por padrão, use const em tudo. Só mude para let se você tiver certeza de que o valor precisará ser reatribuído.",
        "codeExample": "const PI = 3.14159;\nconst NOME_DO_APP = \"DevDuo\";\nconsole.log(NOME_DO_APP);"
      },
      {
        "id": "mod-3-lesson-4",
        "number": 4,
        "title": "String (Texto)",
        "analogy": "Um colar de pérolas onde cada pérola é uma letra ou caractere em sequência.",
        "explanation": "Representa dados textuais. Pode ser delimitado por aspas simples (''), aspas duplas (\"\") ou crases (``).",
        "goldenTip": "Strings possuem a propriedade .length que informa quantos caracteres existem no texto.",
        "codeExample": "const mensagem = \"Aprender JavaScript é divertido!\";\nconsole.log(mensagem.length);"
      },
      {
        "id": "mod-3-lesson-5",
        "number": 5,
        "title": "Template Strings (`${}`)",
        "analogy": "Uma carta modelo com espaços em branco onde você insere automaticamente o nome de cada pessoa.",
        "explanation": "Delimitadas por crases (``), permitem embutir variáveis e expressões diretamente dentro do texto usando ${expressao}.",
        "goldenTip": "Também suportam quebra de linhas direta sem precisar de \\n.",
        "codeExample": "const aluno = \"Lucas\";\nconst xp = 150;\nconsole.log(`Parabéns, ${aluno}! Você acumulou ${xp} XP!`);"
      },
      {
        "id": "mod-3-lesson-6",
        "number": 6,
        "title": "Number (Números)",
        "analogy": "Uma calculadora digital capaz de lidar tanto com números inteiros quanto decimais.",
        "explanation": "Em JavaScript, todos os números (inteiros e com ponto flutuante) pertencem ao tipo Number.",
        "goldenTip": "Use ponto para separar decimais (ex: 19.99), nunca vírgula!",
        "codeExample": "const preco = 49.90;\nconst quantidade = 3;\nconst total = preco * quantidade;\nconsole.log(total);"
      },
      {
        "id": "mod-3-lesson-7",
        "number": 7,
        "title": "Boolean (Verdadeiro ou Falso)",
        "analogy": "Um interruptor de luz de duas posições: ligado (true) ou desligado (false).",
        "explanation": "Tipo de dado com apenas dois valores possíveis: true (verdadeiro) ou false (falso). Base de todas as decisões lógicas.",
        "goldenTip": "Resultados de comparações (como 10 > 5) geram valores booleanos.",
        "codeExample": "const estaLogado = true;\nconst temAcesso = false;\nconsole.log(estaLogado);"
      },
      {
        "id": "mod-3-lesson-8",
        "number": 8,
        "title": "Operadores Matemáticos (+, -, *, /)",
        "analogy": "As quatro operações fundamentais que você aprendeu na escola.",
        "explanation": "Realizam cálculos: soma (+), subtração (-), multiplicação (*), divisão (/) e resto da divisão (%).",
        "goldenTip": "O operador + também serve para concatenar (juntar) textos: \"Oi \" + \"Mundo\".",
        "codeExample": "const soma = 10 + 5;\nconst resto = 10 % 3; // 1 (resto de 10 dividido por 3)\nconsole.log(soma, resto);"
      },
      {
        "id": "mod-3-lesson-9",
        "number": 9,
        "title": "Operador de Igualdade Estrita (===)",
        "analogy": "Um segurança exigente que confere tanto o nome do documento quanto a foto antes de liberar a entrada.",
        "explanation": "Verifica se dois valores são iguais EM VALOR e EM TIPO. 5 === 5 é true, mas 5 === \"5\" é false.",
        "goldenTip": "Sempre use === em vez de == para evitar conversões automáticas inesperadas.",
        "codeExample": "console.log(10 === 10);   // true\nconsole.log(10 === \"10\"); // false (um é número, outro é texto)"
      },
      {
        "id": "mod-3-lesson-10",
        "number": 10,
        "title": "if (Condicional Se)",
        "analogy": "Se chover hoje, eu levo o guarda-chuva.",
        "explanation": "O if executa um bloco de código entre chaves apenas se a condição entre parênteses for verdadeira (true).",
        "goldenTip": "A condição deve sempre estar entre parênteses: if (condicao) { ... }",
        "codeExample": "const idade = 18;\nif (idade >= 18) {\n  console.log(\"Você é maior de idade!\");\n}"
      },
      {
        "id": "mod-3-lesson-11",
        "number": 11,
        "title": "else (Condicional Senão)",
        "analogy": "O plano B: se não chover, vou de bicicleta.",
        "explanation": "O else acompanha o if e é executado caso a condição do if seja falsa.",
        "goldenTip": "O else não recebe condição própria entre parênteses.",
        "codeExample": "const nota = 6;\nif (nota >= 7) {\n  console.log(\"Aprovado!\");\n} else {\n  console.log(\"Precisa de recuperação.\");\n}"
      },
      {
        "id": "mod-3-lesson-12",
        "number": 12,
        "title": "function (Funções)",
        "analogy": "Uma receita de bolo escrita no papel: você pode preparar a receita quantas vezes quiser sem precisar reescrever tudo.",
        "explanation": "Bloco reutilizável de código que realiza uma tarefa específica. É declarada com a palavra reservada function.",
        "goldenTip": "Funções deixam o código limpo, modular e fácil de manter.",
        "codeExample": "function darBoasVindas() {\n  console.log(\"Olá! Seja muito bem-vindo ao DevDuo!\");\n}\n\ndarBoasVindas(); // Chamando a função"
      },
      {
        "id": "mod-3-lesson-13",
        "number": 13,
        "title": "Parâmetros de Função",
        "analogy": "O liquidificador recebe ingredientes específicos para fazer sucos de sabores diferentes.",
        "explanation": "Parâmetros são variáveis declaradas na definição da função que recebem valores dinâmicos quando a função é chamada.",
        "goldenTip": "Você pode definir valores padrão: function somar(a, b = 0) { ... }",
        "codeExample": "function somar(a, b) {\n  return a + b;\n}\n\nconsole.log(somar(7, 3)); // 10"
      },
      {
        "id": "mod-3-lesson-14",
        "number": 14,
        "title": "Arrow Functions (() => {})",
        "analogy": "Uma forma abreviada e moderna de escrever anotações rápidas.",
        "explanation": "Sintaxe concisa introduzida no ES6 para criar funções anônimas usando uma flecha (=>).",
        "goldenTip": "Se a função tiver apenas uma linha, o return e as chaves são automáticos e opcionais.",
        "codeExample": "const dobrar = numero => numero * 2;\nconsole.log(dobrar(5)); // 10"
      },
      {
        "id": "mod-3-lesson-15",
        "number": 15,
        "title": "Array (Listas [])",
        "analogy": "Um carrinho de compras onde você coloca vários produtos numerados por posição.",
        "explanation": "Um Array é uma lista ordenada de valores. O primeiro item fica sempre na posição 0.",
        "goldenTip": "Pode guardar múltiplos tipos ao mesmo tempo: números, textos e até outros arrays.",
        "codeExample": "const frutas = [\"Maçã\", \"Banana\", \"Laranja\"];\nconsole.log(frutas[0]); // \"Maçã\""
      },
      {
        "id": "mod-3-lesson-16",
        "number": 16,
        "title": "array.push() e array.pop()",
        "analogy": "Colocar um prato novo no topo da pilha (push) e retirar o prato do topo (pop).",
        "explanation": ".push() adiciona um novo item ao final do array. .pop() remove o último item do array.",
        "goldenTip": "Ambos modificam o array original diretamente.",
        "codeExample": "const tarefas = [\"Estudar\"];\ntarefas.push(\"Praticar código\"); // Adicionou\nconsole.log(tarefas);\ntarefas.pop(); // Removeu o último"
      },
      {
        "id": "mod-3-lesson-17",
        "number": 17,
        "title": "Loop for",
        "analogy": "Dar 10 voltas correndo na pista de atletismo, contando de 1 até 10.",
        "explanation": "Estrutura de repetição que executa um bloco de código um número determinado de vezes.",
        "goldenTip": "Composta por: inicialização, condição e incremento: for (let i = 0; i < 5; i++)",
        "codeExample": "for (let i = 1; i <= 3; i++) {\n  console.log(`Contagem: ${i}`);\n}"
      },
      {
        "id": "mod-3-lesson-18",
        "number": 18,
        "title": "document.querySelector()",
        "analogy": "Uma mãozinha virtual que aponta para qualquer elemento HTML do site usando o mesmo seletor do CSS.",
        "explanation": "Permite selecionar qualquer elemento da página usando seletores CSS (ex: \"#meuId\", \".minhaClasse\", \"button\").",
        "goldenTip": "Retorna o primeiro elemento correspondente que encontrar na página.",
        "codeExample": "const botao = document.querySelector(\"#meuBotao\");\nconsole.log(botao);"
      },
      {
        "id": "mod-3-lesson-19",
        "number": 19,
        "title": "element.textContent",
        "analogy": "Apagar a lousa e escrever uma frase nova com giz.",
        "explanation": "Lê ou altera o conteúdo de texto puro de um elemento HTML selecionado.",
        "goldenTip": "Prefira textContent a innerHTML quando for inserir apenas texto, pois textContent é imune a ataques de XSS.",
        "codeExample": "const titulo = document.querySelector(\"h1\");\ntitulo.textContent = \"Novo Título Atualizado via JS!\";"
      },
      {
        "id": "mod-3-lesson-20",
        "number": 20,
        "title": "addEventListener(\"click\")",
        "analogy": "Instalar um sensor na porta: assim que alguém pisar nela, dispara o alarme.",
        "explanation": "Registra uma função de escuta que é executada toda vez que o usuário interage (clica, digita, passa o mouse) no elemento.",
        "goldenTip": "A base de toda a interatividade de botões, formulários e jogos na web!",
        "codeExample": "const btn = document.querySelector(\"button\");\nbtn.addEventListener(\"click\", () => {\n  alert(\"Você clicou no botão com sucesso!\");\n});"
      }
    ],
    "practicalExercise": "Abra o editor na barra inferior e teste o código deste elemento modificando seus valores.",
    "quizzes": [
      {
        "id": "quiz-mod-3-1",
        "question": "Qual é o objetivo principal do aprendizado elemento por elemento em JavaScript — Comando por Comando?",
        "options": [
          {
            "key": "A",
            "text": "Entender a função, a anatomia e a aplicação de cada código isoladamente"
          },
          {
            "key": "B",
            "text": "Decorar comandos sem compreender a prática"
          },
          {
            "key": "C",
            "text": "Misturar tudo numa aula só"
          }
        ],
        "correctAnswer": "A"
      }
    ]
  },
  {
    "id": "mod-4",
    "number": 4,
    "title": "Python — Comando por Comando",
    "purpose": "Aprenda sintaxe, estruturas e comandos Python do básico ao avançado, um comando por vez.",
    "whatYouWillLearn": [
      "Saída e entrada: print(), input(), f-strings",
      "Tipos primitivos: int, float, str, bool",
      "Condicionais e indentação: if, elif, else",
      "Coleções: listas [], len(), append()",
      "Laços de repetição: for in, range()",
      "Funções e dicionários: def, return, {}"
    ],
    "quickExample": "print(\"Olá, Dev! Bem-vindo ao curso de Python!\")",
    "lessons": [
      {
        "id": "mod-4-lesson-1",
        "number": 1,
        "title": "print()",
        "analogy": "O alto-falante do computador dizendo em voz alta para você ler no terminal.",
        "explanation": "A função print() exibe textos, números e variáveis diretamente na saída padrão (console).",
        "goldenTip": "Em Python 3, os parênteses são estritamente obrigatórios: print(\"Olá\").",
        "codeExample": "print(\"Olá, Dev! Bem-vindo ao curso de Python!\")"
      },
      {
        "id": "mod-4-lesson-2",
        "number": 2,
        "title": "Variáveis em Python",
        "analogy": "Uma caixa identificada com uma fita crepe. Você só escreve o nome e coloca o valor dentro.",
        "explanation": "Em Python você não precisa de let ou var. Basta atribuir o valor diretamente com o sinal de =.",
        "goldenTip": "Nomes de variáveis em Python devem usar letras minúsculas separadas por underline (snake_case).",
        "codeExample": "nome_do_aluno = \"Gabriel\"\npontos_xp = 120\nprint(nome_do_aluno, pontos_xp)"
      },
      {
        "id": "mod-4-lesson-3",
        "number": 3,
        "title": "f-strings (Interpolação)",
        "analogy": "Um telegrama pré-impresso onde você preenche os campos dinâmicos entre chaves {}.",
        "explanation": "Prefixar a string com a letra \"f\" permite colocar qualquer variável ou expressão matemática diretamente dentro de chaves {}.",
        "goldenTip": "É a maneira mais rápida, moderna e legível de formatar textos em Python desde a versão 3.6.",
        "codeExample": "linguagem = \"Python\"\nversao = 3.12\nprint(f\"Estudando {linguagem} na versão {versao}!\")"
      },
      {
        "id": "mod-4-lesson-4",
        "number": 4,
        "title": "input() (Entrada de Dados)",
        "analogy": "O garçom que pergunta: \"O que você deseja pedir?\" e anota a sua resposta.",
        "explanation": "Pausa a execução do programa e espera o usuário digitar uma resposta no teclado, retornando sempre como String.",
        "goldenTip": "Se quiser receber um número para fazer contas, converta com int(input(...)).",
        "codeExample": "nome = input(\"Qual é o seu nome? \")\nprint(f\"Prazer em te conhecer, {nome}!\")"
      },
      {
        "id": "mod-4-lesson-5",
        "number": 5,
        "title": "Tipos Numéricos: int e float",
        "analogy": "int são moedas inteiras (1, 2, 5). float são centavos quebrados (1.50, 99.90).",
        "explanation": "int representa números inteiros sem vírgula. float representa números com casas decimais (ponto flutuante).",
        "goldenTip": "Use a função type(valor) para descobrir o tipo de qualquer dado em Python.",
        "codeExample": "idade = 25       # int\naltura = 1.75    # float\nprint(type(idade), type(altura))"
      },
      {
        "id": "mod-4-lesson-6",
        "number": 6,
        "title": "if e Indentação em Python",
        "analogy": "Um trilho de trem com um desvio: se a alavanca estiver puxada, o trem entra no ramal com 4 espaços de recuo.",
        "explanation": "Em Python, a indentação (4 espaços) define quais linhas pertencem ao bloco if. Não existem chaves {}!",
        "goldenTip": "Nunca misture tabulações com espaços em branco para não causar o erro IndentationError.",
        "codeExample": "saldo = 50\nif saldo > 0:\n    print(\"Saldo positivo! Você pode continuar.\")"
      },
      {
        "id": "mod-4-lesson-7",
        "number": 7,
        "title": "else e elif",
        "analogy": "Se for segunda, trabalho. Senão, se for sábado, descanso. Senão, curto o domingo.",
        "explanation": "elif (abreviação de \"else if\") testa condições alternativas se o primeiro if for falso. O else é o caso final.",
        "goldenTip": "Você pode encadear quantos elif quiser entre o if inicial e o else final.",
        "codeExample": "nota = 8.5\nif nota >= 9:\n    print(\"Excelente!\")\nelif nota >= 7:\n    print(\"Aprovado!\")\nelse:\n    print(\"Recuperação.\")"
      },
      {
        "id": "mod-4-lesson-8",
        "number": 8,
        "title": "Listas em Python []",
        "analogy": "Uma gaveta com divisórias ordenadas numeradas a partir do zero.",
        "explanation": "Listas armazenam múltiplos valores em ordem. São criadas usando colchetes [].",
        "goldenTip": "Você pode acessar o último item de uma lista usando o índice negativo -1: minha_lista[-1].",
        "codeExample": "frutas = [\"Maçã\", \"Uva\", \"Melancia\"]\nprint(frutas[0])  # Maçã\nprint(frutas[-1]) # Melancia"
      },
      {
        "id": "mod-4-lesson-9",
        "number": 9,
        "title": "len() (Comprimento)",
        "analogy": "Uma fita métrica que conta quantos itens existem dentro da caixa ou quantas letras tem a palavra.",
        "explanation": "A função len() retorna a contagem exata de itens em uma lista, tupla, dicionário ou string.",
        "goldenTip": "len(\"DevDuo\") retorna 6.",
        "codeExample": "cursos = [\"HTML\", \"CSS\", \"JS\", \"Python\"]\nprint(f\"Total de cursos: {len(cursos)}\")"
      },
      {
        "id": "mod-4-lesson-10",
        "number": 10,
        "title": "append() (Adicionar à Lista)",
        "analogy": "Colocar mais um passageiro no vagão do trem.",
        "explanation": "O método .append(item) insere um novo elemento no final da lista existente.",
        "goldenTip": "Modifica a lista original no local e não retorna nada.",
        "codeExample": "linguagens = [\"HTML\", \"CSS\"]\nlinguagens.append(\"Python\")\nprint(linguagens)"
      },
      {
        "id": "mod-4-lesson-11",
        "number": 11,
        "title": "Loop for in",
        "analogy": "Abrir cada carta da pilha, ler o conteúdo e passar para a próxima.",
        "explanation": "Itera sobre cada elemento de uma lista ou sequência de forma extremamente elegante e legível.",
        "goldenTip": "A sintaxe em Python é quase inglês falado: for item in lista:",
        "codeExample": "alunos = [\"Ana\", \"Bruno\", \"Carlos\"]\nfor aluno in alunos:\n    print(f\"Estudante: {aluno}\")"
      },
      {
        "id": "mod-4-lesson-12",
        "number": 12,
        "title": "range() (Gerador de Números)",
        "analogy": "Uma roleta numérica que cospe números de 0 até o limite que você pedir.",
        "explanation": "range(5) gera os números de 0 a 4. Muito utilizado para controlar repetições for.",
        "goldenTip": "O número final do range nunca é incluído: range(1, 4) gera 1, 2 e 3.",
        "codeExample": "for numero in range(1, 4):\n    print(f\"Passo {numero}\")"
      },
      {
        "id": "mod-4-lesson-13",
        "number": 13,
        "title": "def (Criar Funções)",
        "analogy": "Ensinar um novo truque ao computador e dar um nome para esse truque.",
        "explanation": "A palavra def inicia a definição de uma função própria em Python.",
        "goldenTip": "Lembre-se dos dois-pontos : no final da linha e dos 4 espaços de indentação no corpo da função.",
        "codeExample": "def calcular_dobro(x):\n    return x * 2\n\nprint(calcular_dobro(10))"
      },
      {
        "id": "mod-4-lesson-14",
        "number": 14,
        "title": "Dicionários {}",
        "analogy": "Um dicionário de verdade: você procura uma palavra (chave) e encontra a definição (valor).",
        "explanation": "Estrutura que armazena pares chave: valor. Muito parecido com JSON.",
        "goldenTip": "Acesse os valores usando colchetes: dicionario[\"chave\"].",
        "codeExample": "usuario = {\n    \"nome\": \"Carla\",\n    \"xp\": 300,\n    \"nivel\": \"Avançado\"\n}\nprint(usuario[\"nome\"], usuario[\"xp\"])"
      }
    ],
    "practicalExercise": "Abra o editor na barra inferior e teste o código deste elemento modificando seus valores.",
    "quizzes": [
      {
        "id": "quiz-mod-4-1",
        "question": "Qual é o objetivo principal do aprendizado elemento por elemento em Python — Comando por Comando?",
        "options": [
          {
            "key": "A",
            "text": "Entender a função, a anatomia e a aplicação de cada código isoladamente"
          },
          {
            "key": "B",
            "text": "Decorar comandos sem compreender a prática"
          },
          {
            "key": "C",
            "text": "Misturar tudo numa aula só"
          }
        ],
        "correctAnswer": "A"
      }
    ]
  },
  {
    "id": "mod-5",
    "number": 5,
    "title": "SQL — Cláusula por Cláusula",
    "purpose": "Aprenda consultas e manipulação de bancos de dados relacionais cláusula por cláusula.",
    "whatYouWillLearn": [
      "Consultas: SELECT, SELECT *, FROM",
      "Filtros: WHERE, AND, OR",
      "Ordenação e paginação: ORDER BY, ASC, DESC, LIMIT",
      "Manipulação de dados: INSERT INTO, VALUES, UPDATE, SET, DELETE FROM",
      "Funções de agregação: COUNT()"
    ],
    "quickExample": "SELECT nome, email FROM usuarios;",
    "lessons": [
      {
        "id": "mod-5-lesson-1",
        "number": 1,
        "title": "SELECT",
        "analogy": "Apontar para o menu e escolher quais pratos você quer ver na sua mesa.",
        "explanation": "A cláusula SELECT define quais colunas da tabela devem ser retornadas na consulta.",
        "goldenTip": "Se você quiser apenas colunas específicas, liste seus nomes: SELECT nome, email.",
        "codeExample": "SELECT nome, email FROM usuarios;"
      },
      {
        "id": "mod-5-lesson-2",
        "number": 2,
        "title": "SELECT * (Todas as Colunas)",
        "analogy": "Pedir ao garçom: \"Traga absolutamente tudo o que tiver no cardápio!\"",
        "explanation": "O asterisco (*) funciona como coringa (wildcard), trazendo todas as colunas existentes da tabela.",
        "goldenTip": "Em sistemas de produção com milhões de acessos, evite SELECT * para não gastar memória e rede à toa.",
        "codeExample": "SELECT * FROM produtos;"
      },
      {
        "id": "mod-5-lesson-3",
        "number": 3,
        "title": "FROM",
        "analogy": "Dizer a qual estante da biblioteca você está se referindo.",
        "explanation": "A cláusula FROM indica de qual tabela os registros serão consultados.",
        "goldenTip": "Vem sempre logo após o SELECT.",
        "codeExample": "SELECT titulo FROM cursos;"
      },
      {
        "id": "mod-5-lesson-4",
        "number": 4,
        "title": "WHERE (Filtro de Condição)",
        "analogy": "Uma peneira fina que só deixa passar o que atende ao critério de busca.",
        "explanation": "Filtra as linhas da tabela, retornando apenas os registros onde a condição for verdadeira.",
        "goldenTip": "Valores de texto em SQL devem estar entre aspas simples: WHERE status = 'ativo'.",
        "codeExample": "SELECT * FROM alunos WHERE idade >= 18;"
      },
      {
        "id": "mod-5-lesson-5",
        "number": 5,
        "title": "AND (Múltiplas Condições)",
        "analogy": "Ter que apresentar documento com foto E comprovante de vacinação para entrar no evento.",
        "explanation": "Exige que ambas as condições sejam verdadeiras para que a linha seja retornada.",
        "goldenTip": "Você pode encadear vários ANDs na mesma consulta.",
        "codeExample": "SELECT * FROM pedidos WHERE status = 'pago' AND valor > 100;"
      },
      {
        "id": "mod-5-lesson-6",
        "number": 6,
        "title": "OR (Pelo Menos Uma Condição)",
        "analogy": "Pagar com dinheiro OU com cartão de crédito.",
        "explanation": "Retorna a linha se pelo menos uma das condições for satisfeita.",
        "goldenTip": "Use parênteses ao misturar AND com OR para definir a ordem das prioridades.",
        "codeExample": "SELECT * FROM clientes WHERE cidade = 'São Paulo' OR cidade = 'Rio de Janeiro';"
      },
      {
        "id": "mod-5-lesson-7",
        "number": 7,
        "title": "ORDER BY (Ordenação)",
        "analogy": "Organizar uma fila de pessoas por ordem alfabética ou da mais alta para a mais baixa.",
        "explanation": "Ordena as linhas retornadas com base nos valores de uma ou mais colunas.",
        "goldenTip": "Por padrão a ordenação é crescente (ASC). Para decrescente, adicione DESC.",
        "codeExample": "SELECT * FROM ranking ORDER BY pontos DESC;"
      },
      {
        "id": "mod-5-lesson-8",
        "number": 8,
        "title": "LIMIT (Limitar Resultados)",
        "analogy": "Pedir as 5 primeiras notícias da página sem carregar as 500 do arquivo.",
        "explanation": "Limita o número máximo de registros que a consulta devolverá.",
        "goldenTip": "Fundamental para criar paginação em sites e aplicativos móveis.",
        "codeExample": "SELECT * FROM cursos LIMIT 5;"
      },
      {
        "id": "mod-5-lesson-9",
        "number": 9,
        "title": "INSERT INTO e VALUES",
        "analogy": "Preencher uma nova ficha cadastral e arquivá-la na pasta de novos alunos.",
        "explanation": "Insere um ou mais novos registros dentro de uma tabela do banco de dados.",
        "goldenTip": "A ordem das colunas no INSERT deve corresponder exatamente à ordem dos valores no VALUES.",
        "codeExample": "INSERT INTO usuarios (nome, email)\nVALUES ('Mariana Costa', 'mariana@email.com');"
      },
      {
        "id": "mod-5-lesson-10",
        "number": 10,
        "title": "UPDATE e SET",
        "analogy": "Passar corretivo branco em uma ficha cadastral e atualizar o telefone do cliente.",
        "explanation": "Modifica os dados de registros já existentes na tabela.",
        "goldenTip": "CUIDADO: NUNCA execute um UPDATE sem a cláusula WHERE, senão todas as linhas da tabela serão alteradas!",
        "codeExample": "UPDATE usuarios\nSET email = 'novo.email@email.com'\nWHERE id = 42;"
      },
      {
        "id": "mod-5-lesson-11",
        "number": 11,
        "title": "DELETE FROM",
        "analogy": "Passar uma folha pela máquina trituradora de papel.",
        "explanation": "Remove permanentemente registros da tabela.",
        "goldenTip": "CUIDADO: Sem WHERE, você apagará TODOS os registros da tabela inteira!",
        "codeExample": "DELETE FROM notificacoes WHERE lida = true;"
      },
      {
        "id": "mod-5-lesson-12",
        "number": 12,
        "title": "COUNT() (Contagem de Linhas)",
        "analogy": "O contador de pessoas na catraca que registra cada visitante que passou.",
        "explanation": "Função de agregação que conta quantos registros existem que atendem ao critério.",
        "goldenTip": "COUNT(*) conta todas as linhas, enquanto COUNT(coluna) ignora valores nulos (NULL).",
        "codeExample": "SELECT COUNT(*) FROM alunos WHERE matriculado = true;"
      }
    ],
    "practicalExercise": "Abra o editor na barra inferior e teste o código deste elemento modificando seus valores.",
    "quizzes": [
      {
        "id": "quiz-mod-5-1",
        "question": "Qual é o objetivo principal do aprendizado elemento por elemento em SQL — Cláusula por Cláusula?",
        "options": [
          {
            "key": "A",
            "text": "Entender a função, a anatomia e a aplicação de cada código isoladamente"
          },
          {
            "key": "B",
            "text": "Decorar comandos sem compreender a prática"
          },
          {
            "key": "C",
            "text": "Misturar tudo numa aula só"
          }
        ],
        "correctAnswer": "A"
      }
    ]
  }
];
