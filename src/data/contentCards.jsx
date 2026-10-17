import caravela from '../assets/illustrations/caravela.svg';
import decolonialidade from '../assets/illustrations/decolonialidade.svg';
import cartaPeroVaz from '../assets/illustrations/carta.svg';
import antecedentesPreColonial from '../assets/illustrations/pre-colonial.svg';
import pleistoceno from '../assets/illustrations/pleistoceno.svg';

const cardsData = [

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
    },

    {
        id: 5,
        title: "Pleistoceno e a Megafauna",
        description: "A popularmente conhecida 'Era do Gelo' !",
        image: pleistoceno,
        route: "/pleistoceno"
    }
]

export default cardsData;