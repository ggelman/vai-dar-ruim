import { 
    ShieldCheck, 
    Beer, 
    Flame, 
    Crown, 
    Timer, 
    Zap, 
    Gavel, 
    Hand, 
    HelpCircle,
    Target 
} from 'lucide-react-native';

export const LEVELS = {
    fun: { id: 'fun', label: 'Esquenta', color: '#22c55e', icon: Beer, desc: 'Sem humilhação', price: 0 },
    prohibited: { id: 'prohibited', label: 'Proibido (+18)', color: '#eab308', icon: ShieldCheck, desc: 'Bebida, flertes e revelações', price: 9.90 },
    chaos: { id: 'chaos', label: 'Vai Dar Ruim', color: '#dc2626', icon: Flame, desc: 'CAOS', price: 9.90 },
};

export const GENERIC_NAMES = [
    "O Herdeiro", "A Talarica", "O Cancelado", "A Emocionada", 
    "O Coach", "A Vegana de Taubaté", "O Faria Limer", "A Barbie Fascista",
    "O Esquerdomacho", "A Biscoiteira", "O Rei do Pix", "A CLT Sofredora",
    "O Inimigo do Fim", "A Mãe de Pet", "O Agroboy", "A Gótica",
    "O Crypto Bro", "A Pick Me Girl", "O Sigma", "A Fiscal de Postura",
    "O Hetero Top", "A Astróloga", "O Ex-BBB", "A Blogueira Falida"
];

export const GAME_LIBRARY = [
    { id: 'eu_nunca', title: 'Eu Nunca', type: 'classic', isFree: true, desc: "Exponha seus podres.", icon: Beer },
    { id: 'verdade_desafio', title: 'Verdade ou Desafio', type: 'classic', isFree: true, desc: "A verdade dói, o desafio humilha.", icon: HelpCircle },
    { id: 'desafios_rapidos', title: 'Desafios Rápidos', type: 'action', isFree: false, price: 9.90, desc: "Perca a dignidade em 15s.", icon: Zap },
    { id: 'kings', title: 'Kings Cup', type: 'card', isFree: false, price: 9.90, desc: "Regras clássicas de bar.", icon: Crown },
    { id: 'tribunal', title: 'Tribunal', type: 'voting', isFree: false, price: 9.90, desc: "Julgue seus amigos na cara dura.", icon: Gavel },
    { id: 'provavel', title: 'Mais Provável', type: 'voting', isFree: false, price: 9.90, desc: "Quem tem cara de bandido?", icon: Hand },
    { id: 'master_says', title: 'O Mestre Mandou', type: 'action', isFree: false, price: 9.90, desc: "Obedeça ou beba.", icon: Crown },
    { id: 'five_seconds', title: '5 Segundos', type: 'pressure', isFree: false, price: 9.90, desc: "Pense rápido ou beba.", icon: Timer },
    { id: 'roleta_russa', title: 'Roleta Russa', type: 'pressure', isFree: false, price: 9.90, desc: "1 chance em 6 de dar ruim.", icon: Target },
];

export const DB_CONTENT = {
    // -------------------------------------------------------------------------
    // EU NUNCA (Foco: Humilhação corporativa, sexual e financeira)
    // -------------------------------------------------------------------------
    eu_nunca: [ 
        // FUN (Relatables)
        { text: "Eu nunca chorei no banheiro do trabalho.", level: 'fun' },
        { text: "Eu nunca stalkeei o ex do meu atual no LinkedIn.", level: 'fun' },
        { text: "Eu nunca fingi estar doente para não ir no rolê.", level: 'fun' },
        { text: "Eu nunca parcelei uma compra de menos de 50 reais.", level: 'fun' },
        { text: "Eu nunca mandei 'oi sumido' depois da meia-noite.", level: 'fun' },
        { text: "Eu nunca olhei o celular do namorado(a) enquanto ele dormia.", level: 'fun' },
        { text: "Eu nunca fui expulso de um grupo de WhatsApp.", level: 'fun' },
        { text: "Eu nunca tive nome sujo no Serasa.", level: 'fun' },
        { text: "Eu nunca vomitei e continuei bebendo depois.", level: 'fun' },
        { text: "Eu nunca curti foto antiga de alguém sem querer (stalker amador).", level: 'fun' },

        // PROHIBITED (Sexual/Spicy)
        { text: "Eu nunca transei no local de trabalho (escritório, estoque, banheiro).", level: 'prohibited' },
        { text: "Eu nunca fingi um orgasmo para acabar logo.", level: 'prohibited' },
        { text: "Eu nunca mandei nudes para a pessoa errada (grupo da família?).", level: 'prohibited' },
        { text: "Eu nunca fiz sexo ouvindo uma playlist vergonhosa.", level: 'prohibited' },
        { text: "Eu nunca tive um sonho erótico com alguém dessa roda.", level: 'prohibited' },
        { text: "Eu nunca transei em um carro estacionado na rua.", level: 'prohibited' },
        { text: "Eu nunca fui pego no flagra pelos pais (meus ou dele/a).", level: 'prohibited' },
        { text: "Eu nunca usei algemas ou vendas na hora H.", level: 'prohibited' },
        { text: "Eu nunca transei com alguém cujo nome eu não sabia.", level: 'prohibited' },
        { text: "Eu nunca fiz sexting no transporte público.", level: 'prohibited' },

        // CHAOS (Destruição de vidas)
        { text: "Eu nunca fiquei com ex de amigo(a) próximo(a).", level: 'chaos' },
        { text: "Eu nunca traí e nunca fui descoberto.", level: 'chaos' },
        { text: "Eu nunca tive uma DST (seja honesto, vai).", level: 'chaos' },
        { text: "Eu nunca duvidei da paternidade de um filho (ou chance de gravidez).", level: 'chaos' },
        { text: "Eu nunca fui amante sabendo que era amante.", level: 'chaos' },
        { text: "Eu nunca vazei um segredo que jurei guardar.", level: 'chaos' },
        { text: "Eu nunca desejei o mal de um chefe.", level: 'chaos' },
        { text: "Eu nunca participei de um ménage.", level: 'chaos' },
    ],

    // -------------------------------------------------------------------------
    // DESAFIOS RÁPIDOS (Foco: Ação física e vergonha alheia imediata)
    // -------------------------------------------------------------------------
    desafios_rapidos: [
        // FUN
        { text: "Imite o gemido da pessoa à sua direita.", level: 'fun' },
        { text: "Faça um story agora gritando 'EU AMO MEU EX'.", level: 'fun' },
        { text: "Beba se você estiver usando roupa íntima preta.", level: 'fun' },
        { text: "O último a tocar o teto bebe.", level: 'fun' },
        { text: "Deixe alguém ler sua última mensagem do WhatsApp.", level: 'fun' },
        
        // PROHIBITED
        { text: "Dê um chupão no pescoço de quem você escolher.", level: 'prohibited' },
        { text: "Simule sua posição sexual favorita com uma cadeira.", level: 'prohibited' },
        { text: "Tire uma peça de roupa (acessórios não contam).", level: 'prohibited' },
        { text: "Deixe a pessoa à esquerda colocar a mão dentro da sua camisa por 10s.", level: 'prohibited' },
        { text: "Mande 'Quero te dar' para o terceiro contato recente do Insta.", level: 'prohibited' },

        // CHAOS
        { text: "Ligue para o seu ex e desligue assim que atender.", level: 'chaos' },
        { text: "Mostre seu histórico de navegação (sem apagar antes).", level: 'chaos' },
        { text: "Beba um shot de tequila (ou o pior da mesa) sem as mãos.", level: 'chaos' },
        { text: "Deixe o grupo escolher uma foto sua para postar agora.", level: 'chaos' },
    ],

    // -------------------------------------------------------------------------
    // VERDADE OU DESAFIO (Foco: Perguntas invasivas)
    // -------------------------------------------------------------------------
    verdade_desafio: [
        // FUN
        { text: "Qual a maior vergonha que você passou bêbado?", type: 'verdade', level: 'fun' },
        { text: "Quem dessa roda você levaria para uma ilha deserta?", type: 'verdade', level: 'fun' },
        { text: "Imite um blogueiro fazendo publi de cinta modeladora.", type: 'desafio', level: 'fun' },
        
        // PROHIBITED
        { text: "Quem dessa roda você pegaria se ninguém soubesse?", type: 'verdade', level: 'prohibited' },
        { text: "Qual foi o lugar mais sujo onde você transou?", type: 'verdade', level: 'prohibited' },
        { text: "Dê um beijo técnico em alguém da roda.", type: 'desafio', level: 'prohibited' },
        { text: "Deixe alguém morder sua orelha.", type: 'desafio', level: 'prohibited' },
        { text: "Descreva seu orgasmo usando sons.", type: 'verdade', level: 'prohibited' },

        // CHAOS
        { text: "Qual amigo(a) da roda você acha mais fracassado(a)?", type: 'verdade', level: 'chaos' },
        { text: "Mostre a última foto da sua galeria (inclusive a Lixeira).", type: 'desafio', level: 'chaos' },
        { text: "Com qual namorado(a) de amigo você já quis transar?", type: 'verdade', level: 'chaos' },
        { text: "Faça uma lap dance em quem estiver bebendo mais.", type: 'desafio', level: 'chaos' },
    ],

    // -------------------------------------------------------------------------
    // KINGS CUP (Regras de Bar Clássicas)
    // -------------------------------------------------------------------------
    kings: [
        { rule: "Cascata (Todos bebem)", card: "A" },
        { rule: "Mulheres bebem", card: "Q" },
        { rule: "Homens bebem", card: "K" },
        { rule: "Crie uma regra (ex: proibido falar 'não')", card: "J" },
        { rule: "Você bebe", card: "10" },
        { rule: "Escolha alguém para beber", card: "9" },
        { rule: "Parceiro (Escolha alguém para beber sempre com você)", card: "8" },
        { rule: "Mestre do Dedão (Quem colocar o dedo na mesa por último bebe)", card: "7" },
    ],

    // -------------------------------------------------------------------------
    // TRIBUNAL (Julgamento de Caráter)
    // -------------------------------------------------------------------------
    tribunal: [
        // FUN
        { text: "Quem morreria primeiro num apocalipse zumbi?", level: 'fun' },
        { text: "Quem viraria coach quântico se ficasse pobre?", level: 'fun' },
        { text: "Quem gastaria todo o dinheiro do prêmio do BBB em 1 mês?", level: 'fun' },
        
        // CHAOS (Pesados)
        { text: "Quem tem mais chance de ser preso por sonegação de imposto?", level: 'chaos' },
        { text: "Quem tem 'cara de golpe'?", level: 'chaos' },
        { text: "Quem abandonaria o filho se ele nascesse feio?", level: 'chaos' },
        { text: "Quem finge ser amigo mas fala mal pelas costas?", level: 'chaos' },
        { text: "Quem vai morrer sozinho(a)?", level: 'chaos' },
        { text: "Quem tem a pior reputação sexual?", level: 'chaos' },
        { text: "Quem venderia o próprio corpo por um iPhone 16?", level: 'chaos' },
        { text: "Quem seria cancelado no Twitter por racismo/homofobia?", level: 'chaos' },
    ],

    // -------------------------------------------------------------------------
    // PROVÁVEL (Futuro Sombrio)
    // -------------------------------------------------------------------------
    provavel: [
        { text: "Quem daria o golpe da barriga?", level: 'chaos' },
        { text: "Quem abriria um OnlyFans?", level: 'prohibited' },
        { text: "Quem casaria por dinheiro com um velho(a) rico(a)?", level: 'fun' },
        { text: "Quem fugiria do próprio casamento?", level: 'fun' },
        { text: "Quem colocaria fogo na casa do ex?", level: 'chaos' },
        { text: "Quem seria preso por urinar em público?", level: 'chaos' },
        { text: "Quem entraria em um esquema de pirâmide?", level: 'chaos' },
        { text: "Quem chantagearia alguém com nudes?", level: 'chaos' },
        { text: "Quem dormiria com o chefe para ser promovido?", level: 'chaos' },
        { text: "Quem vai ter 5 filhos de 3 pais/mães diferentes?", level: 'chaos' },
        { text: "Quem vai virar a tia dos gatos?", level: 'fun' },
    ],

    // -------------------------------------------------------------------------
    // MESTRE MANDOU (Dinâmicas de Grupo)
    // -------------------------------------------------------------------------
    master_says: [
        // FUN
        { text: "Quem tiver iPhone, bebe (taxa Apple).", level: 'fun' },
        { text: "Quem estiver desempregado bebe dobrado (pra esquecer).", level: 'fun' },
        { text: "Quem for CLT, bebe (pra aguentar a semana).", level: 'fun' },
        { text: "Quem namora bebe (pra aguentar a DR).", level: 'fun' },
        { text: "Quem for solteiro bebe (pra criar coragem).", level: 'fun' },
        { text: "Quem já foi corno(a) bebe.", level: 'chaos' },
        
        // PROHIBITED
        { text: "Troque de camisa com a pessoa do sexo oposto à direita.", level: 'prohibited' },
        { text: "Sente no colo de quem você pegaria.", level: 'prohibited' },
        { text: "Dê um beijo no pescoço de quem estiver bebendo menos.", level: 'prohibited' },
        { text: "Faça uma massagem sensual no ombro do vizinho.", level: 'prohibited' },
        
        // CHAOS
        { text: "O Mestre mandou gemer o nome do ex. Quem não fizer, vira o copo.", level: 'chaos' },
        { text: "Mande um 'Oi sumido' para o ex agora. Ou beba tudo.", level: 'chaos' },
        { text: "Quem já transou nesse recinto, bebe.", level: 'chaos' },
    ],

    // -------------------------------------------------------------------------
    // 5 SEGUNDOS (Pressão Cognitiva)
    // -------------------------------------------------------------------------
    five_seconds: [
        // FUN
        { text: "Cite 3 motivos para demitir seu chefe.", level: 'fun' },
        { text: "Cite 3 marcas de cerveja barata.", level: 'fun' },
        { text: "Cite 3 desculpas para não transar.", level: 'fun' },
        
        // PROHIBITED
        { text: "Cite 3 lugares onde você já transou.", level: 'prohibited' },
        { text: "Cite 3 fetiches estranhos.", level: 'prohibited' },
        { text: "Cite 3 apelidos para o pênis.", level: 'prohibited' },
        { text: "Cite 3 posições sexuais que doem as costas.", level: 'prohibited' },
        { text: "Cite 3 categorias de pornô bizarro.", level: 'prohibited' },
        { text: "Cite 3 coisas que te fazem broxar na hora.", level: 'prohibited' },
        
        // CHAOS
        { text: "Cite 3 amigos que você pegaria se fossem solteiros.", level: 'chaos' },
        { text: "Cite 3 mentiras que você já contou para transar.", level: 'chaos' },
        { text: "Cite 3 crimes que você cometeria se não fosse preso.", level: 'chaos' },
        { text: "Cite 3 pessoas que você odeia nessa sala.", level: 'chaos' },
    ]
};