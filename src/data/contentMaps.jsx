import ship from '../assets/illustrations/caravela.svg';
import roots from '../assets/illustrations/decolonialidade.svg';
import letter from '../assets/illustrations/carta.svg';

const mapsData = [
    {
        id: 1, title: 'A chegada dos portugueses ao Brasil', shortTitle: 'A chegada dos portugueses', image: ship, route: '/chegadaPortuguesesBrasil',
        branches: [
            { title: 'Quando?', text: 'Em 1500, com a expedição de Pedro Álvares Cabral.' },
            { title: 'Quem veio?', text: 'Portugueses, em busca de novas terras, riquezas e expansão do império.' },
            { title: 'O que aconteceu?', text: 'O encontro entre europeus e povos originários marcou o início do período pré-colonial.' },
            { title: 'Consequências', items: ['Início do processo de colonização', 'Exploração dos recursos', 'Imposição da cultura europeia'] },
        ],
    },
    {
        id: 2, title: 'Decolonialidade', shortTitle: 'Decolonialidade', image: roots, route: '/decolonialidade',
        branches: [
            { title: 'O que é?', text: 'É a crítica ao pensamento colonial e a valorização das vozes e saberes marginalizados.' },
            { title: 'Principais ideias', items: ['Questiona o eurocentrismo', 'Valoriza culturas indígenas, africanas e latino-americanas', 'Propõe novas formas de pensar e ensinar a história'] },
            { title: 'Por que é importante?', text: 'Ajuda a construir uma história mais plural, justa e inclusiva.' },
            { title: 'Objetivo', text: 'Descolonizar o conhecimento e romper com as estruturas de poder herdadas do colonialismo.' },
        ],
    },
    {
        id: 3, title: 'A Carta de Pero Vaz de Caminha', shortTitle: 'A Carta de Pero Vaz de Caminha', image: letter, route: '/cartaPeroVaz',
        branches: [
            { title: 'O que é?', text: 'É o relato de Pero Vaz de Caminha sobre a viagem e a chegada dos portugueses ao Brasil, em 1500.' },
            { title: 'Importância', text: 'É um dos primeiros registros escritos portugueses sobre o território e o encontro com os povos originários.' },
            { title: 'Características', items: ['Olhar europeu', 'Descrição da natureza, dos povos e da terra', 'Relato em primeira pessoa'] },
            { title: 'Contexto', text: 'Foi escrita para o rei de Portugal e faz parte de um momento de expansão marítima e colonização.' },
        ],
    },
];
export default mapsData;
