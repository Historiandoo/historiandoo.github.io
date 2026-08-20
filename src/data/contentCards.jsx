import caravela from '../assets/caravela.png';
import decolonialidade from '../assets/decolonialidade.png';
import cartaPeroVaz from '../assets/cartaPeroVaz.png';
import antecedentesPreColonial from '../assets/antecedentesPreColonial.png';

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

    {
        id: 4,
        title: "Antecedentes do Período Pré-Colonial",
        description: "Como se deu o início de tudo",
        image: antecedentesPreColonial,
        route: "/antecedentesPreColonial"
    }
]

export default cardsHome;