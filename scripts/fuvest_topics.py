"""Editorial subject labels; question and answer text always comes from PDFs."""
TOPICS = {
2017: {17:'Arte barroca',24:'Cultura medieval',25:'Democracia na Grécia Antiga',26:'Renascimento e humanismo',27:'Crise do Antigo Regime e revoltas coloniais',28:'Rotas comerciais medievais',29:'Revolução Industrial',30:'Abolição e imigração',31:'Guerras mundiais',32:'Reformas urbanas e Revolta da Vacina',33:'Ditadura militar e redemocratização',34:'Revolução Neolítica',41:'Era Vargas e secas no Nordeste',44:'Industrialização brasileira',45:'Modernismo e patrimônio cultural'},
2018: dict(zip(range(58,69), ['Mundo helenístico','Feudalismo e sociedade medieval','Conquista da América','Economia colonial: açúcar e mineração','Independências na América','Descolonização africana','Declaração Universal dos Direitos Humanos','Chile de Salvador Allende','Fascismo e futurismo','Holocausto e nazismo','Revolução Científica e Iluminismo'])),
2019: dict(zip([1]+list(range(79,91)), ['Povos indígenas e agricultura','Imigração e política migratória','Roma Antiga e arcos do triunfo','Mulheres e Iluminismo','Migrações e guerras no século XX','Revolução Cultural chinesa','Economia brasileira e Era Vargas','Revolução Industrial','Proclamação da República','Revolução Francesa','Apartheid na África do Sul','Escravidão e abolicionismo','Liberalismo e revoluções do século XIX'])),
2020: dict(zip(range(59,69), ['Peste Negra e crise medieval','Comércio transaariano','Legislação trabalhista e Era Vargas','Grandes Navegações','Brasil holandês','Conquista e colonização da América','Ditadura militar e cultura','Guerra Fria e golpes na América Latina','Independência dos Estados Unidos','História da leitura e da educação'])),
2021: dict(zip(range(34,45), ['Grandes Navegações','Mineração e economia colonial americana','Expansão territorial do Brasil colonial','Economia do Brasil Império','Cabanagem e Período Regencial','República Oligárquica','Fascismo e nazismo','Arte do Renascimento','Urbanização e desigualdade social','Grécia Antiga e condição feminina','Escravidão indígena e africana'])),
2022: dict(zip(range(79,91), ['Revolução Industrial e operariado','Migrações e retirantes','Canudos e Primeira República','Economia colonial brasileira','Revolta dos Malês','Grécia Antiga e Guerra do Peloponeso','Arte do Renascimento','Ditaduras na História','Vanguardas culturais latino-americanas','Segunda Guerra Mundial','Extrema direita contemporânea','Patrimônio histórico e povos indígenas'])),
2023: {2:'Sufrágio feminino no Brasil',3:'Movimento negro e cidadania',40:'Centenário da Independência e modernização',41:'Povos indígenas e identidades',42:'Trabalho e controle social no Brasil colonial',43:'Modernismo e vanguardas',44:'Imigração italiana no Brasil',45:'Fascismo italiano',46:'Democracia ateniense',47:'Revolução Gloriosa e parlamentarismo',48:'Golpe de 1964 e Reformas de Base',49:'Dissolução da União Soviética',53:'Imperialismo e fronteiras africanas'},
2024: {3:'Representação indígena na arte',6:'Economia açucareira no Brasil colonial',7:'Abolicionismo e Lei dos Sexagenários',22:'Iluminismo e Enciclopédia',44:'Industrialização brasileira',45:'Crise de 1929',46:'Cafeicultura e expansão econômica',52:'Ditadura militar e cultura urbana',74:'Civilizações africanas antigas',75:'Reino de Axum e comércio africano',76:'Revolução Cubana e Guerra Fria',77:'Revolução Iraniana',86:'Agricultura dos povos indígenas',87:'Conquista da América',88:'Conquista espanhola e Império Asteca'},
2025: {1:'Patrimônio cultural indígena e colonialismo',4:'Povos indígenas e colonização',8:'Iconoclastia no Império Bizantino',13:'Colonização da América',14:'Confederação do Equador',39:'Peronismo na Argentina',79:'Migrações e crise do Império Romano',81:'Cafeicultura e economia imperial',85:'Inconfidência Mineira',86:'Modernismo brasileiro',87:'Sociedades africanas e comércio atlântico',90:'Era Vargas e nacionalismo'},
2026: {9:'Direitos das mulheres no século XIX',10:'Cultura afro-brasileira e patrimônio',12:'Sufrágio feminino e cidadania',19:'Ditadura militar e arte de resistência',20:'Colonialismo e povos indígenas nos Andes',21:'Jesuítas e colonização do Brasil',45:'Humanismo renascentista',46:'Arte barroca',49:'Rotas da Seda e intercâmbio cultural',50:'Islamismo e peregrinação',54:'Democracia ateniense',88:'Abolição do tráfico atlântico e escravidão'},
}
WRITTEN_TOPICS = {
2017: ['Reformas pombalinas e povos indígenas','Cafeicultura no Brasil Império','Guerra Civil dos Estados Unidos','Urbanização e exclusão social','Populismo na América Latina','Trabalho na Antiguidade e na modernidade'],
2018: ['Povos indígenas da América','Absolutismo e despotismo esclarecido','Guerra do Ópio e imperialismo','Migrações e trabalho no Brasil','Abolição da escravidão','Revolução Russa e cultura'],
2019: ['Governo Juscelino Kubitschek','Padre Antônio Vieira e União Ibérica','Movimentos sociais de 1968','Reforma Protestante e iconoclastia','Etiópia e diáspora negra','Era Vargas e propaganda política'],
2020: ['Futebol e colonialismo português','Antigo Regime e punição','Povos indígenas e colonização','Corte portuguesa e Independência','Colonização da América espanhola','Crise de Suez e Guerra Fria'],
2021: ['Primeira República e urbanização','Lei de Terras e trabalho livre','Crises políticas de 1945, 1954 e 1964','Cristianismo e Império Romano','Grandes Navegações e conquista','Economia colonial brasileira'],
2022: ['Império espanhol e Contrarreforma','Independência dos Estados Unidos','Era Vargas e propaganda','Movimento negro e Constituição de 1988','Rondon e povos indígenas','Revolução Praieira'],
2023: ['Independências do Brasil e do Uruguai','Movimento operário e Revolução Industrial','Reino do Congo e relações com Portugal','Tropicalismo e ditadura militar','Helenismo e Renascimento','Cafeicultura, ferrovias e imigração'],
2024: ['Feudalismo e castelos medievais','Proclamação da República','Pompeia e Hiroshima','Pan-africanismo e descolonização','Guerra do Vietnã e pacifismo','Ditadura militar e milagre econômico'],
2025: ['Crise medieval e caça às bruxas','Brasil holandês e povos indígenas','Ditadura militar e resistência cultural','Imperialismo na África','Brasil Império e relações de dominação','Povos mesoamericanos e cacau'],
2026: ['Grandes Navegações e mentalidades','Educação e cidadania no Brasil Império','China contemporânea','Universidades na Baixa Idade Média','Estados Unidos e crise econômica','Colonialismo português em Angola e Moçambique'],
}

def update_manifest(path):
    import json
    data=json.loads(path.read_text(encoding='utf8'))
    for y,topics in TOPICS.items():
        data[str(y)]['history']={str(n):t for n,t in topics.items()}
        data[str(y)]['writtenTopics']={str(n+1):t for n,t in enumerate(WRITTEN_TOPICS[y])}
    path.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf8')

if __name__=='__main__':
    from pathlib import Path
    update_manifest(Path(__file__).resolve().parents[1]/'data/question-bank/fuvest-import-manifest.json')
