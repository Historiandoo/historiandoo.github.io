import caravela from '../assets/caravela.png';
import decolonialidade from '../assets/decolonialidade.png';
import cartaPeroVaz from '../assets/cartaPeroVaz.png';

const cardsHome = [

    {
        id: 1,
        title: "A chegada dos portugueses ao Brasil",
        description: "O início de tudo",
        image: caravela,
        route: "/chegadaPortuguesesBrasil"
    },

    {
        id: 2,
        title: "Decolonialidade",
        description: "O que é? E por que é importante?",
        image: decolonialidade,
        route: "/decolonialidade"
    },

    {
        id: 3,
        title: "Carta de Pero Vaz de Caminha",
        description : "A Carta de Achamento do Brasil",
        image: cartaPeroVaz,
        route: "/cartaPeroVaz"
    },
]

export default cardsHome;