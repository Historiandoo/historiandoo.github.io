# UNESP: fonte, cobertura e reprodução

Verificado em 20/10/2026. As últimas dez edições **anuais principais concluídas** são 2017–2026. O vestibular 2027 ainda não foi aplicado; não foram incluídos processos de meio de ano.

## Cobertura

| Edição | 1ª fase | 2ª fase objetiva | 2ª fase discursiva |
|---|---:|---:|---:|
| 2017 | 12 | 0 | 4 |
| 2018 | 12 | 0 | 4 |
| 2019 | 12 | 0 | 4 |
| 2020 | 12 | 0 | 4 |
| 2021 | 24 | 8 | 0 |
| 2022 | 24 | 8 | 0 |
| 2023 | 12 | 8 | 0 |
| 2024 | 12 | 0 | 4 |
| 2025 | 12 | 0 | 4 |
| 2026 | 12 | 0 | 5 |
| **Total** | **144** | **24** | **29** |

Total: **197 registros**. A seleção abrange os blocos de conteúdo histórico e suas questões interdisciplinares: itens 31–42 da primeira fase; 21–28 da segunda fase objetiva; 1–4 do caderno discursivo de Humanas. O item 5 de 2026 também foi incluído por abordar a partilha da Índia britânica em 1947 (História/Geografia). Em 2021 e 2022 os dois dias/grupos da primeira fase foram preservados com IDs diferentes. Esses grupos não são versões permutadas da mesma prova.

Os rótulos de tema são metadados editoriais de busca, e não classificações oficiais da banca. A coleção inclui itens que articulam História com arte, cultura, pensamento político, geografia histórica e transformações sociais; não afirma que todos os itens foram classificados exclusivamente como História pela Vunesp.

## Documentos e respostas

- [Acervo institucional da Fundação VUNESP](https://www.vunesp.com.br/Institucional/EstatisticaVestibular): enumera os vestibulares e os relatórios anuais. Os relatórios contêm os cadernos originais anexados. A página Provas e Gabaritos do portal encaminha atualmente à identificação do candidato.
- [Acervo do Curso Objetivo](https://www.curso-objetivo.br/vestibular/resolucao-comentada/unesp.aspx): espelho público dos PDFs originais da VUNESP e resoluções comentadas do cursinho. O importador usa os links exatos identificados nesse acervo. `source.examUrl` e `source.answerUrl` apontam para o documento realmente utilizado, com página e identificação do caderno.
- Todas as respostas objetivas foram extraídas dos **gabaritos da VUNESP em PDF**, hospedados nesse espelho. `answerSourceType: official-key` e `answerProvider` registram explicitamente o espelho. O importador rejeita alternativas incompletas, respostas ausentes e versões conflitantes.
- Nas discursivas, `expectedAnswer` é a transcrição da **resolução do Curso Objetivo**, identificada por `answerSourceType: commentary`, e não um padrão oficial atribuído à banca. A fonte é mostrada com página. `expectedAnswerImage` preserva a resolução original, inclusive tabelas, gráficos e continuações; deve ser exibida somente após o envio da resposta.
- A segunda fase de 2021, 2022 e 2023 era objetiva. Portanto, esses itens usam alternativas e gabarito em vez de resposta discursiva.
- Cada registro tem um recorte local `questionImage`, com desenhos, mapas, charges, tabelas e alternativas gráficas preservados. Textos de apoio comuns são repetidos nos itens correspondentes. O item 40 da primeira fase de 2019 tem alternativas em forma de tabelas; o texto de cada opção orienta a consultar sua letra na imagem original.

### Exceção explícita: UNESP 2019, 2ª fase, questão 1

A questão depende da letra integral de *Mulheres de Atenas*, reproduzida na página anterior do caderno. A letra não foi copiada para a base nem para a imagem local. O enunciado orienta consultar a página 2 da prova original (`source.contextPage: 2`). As citações dessa letra foram omitidas da resolução textual, preservando a análise histórica e identificando a omissão em `source.answerTextNote`. Não há imagem da resolução desse item, que repetiria a letra integral.

## Reproduzir a importação

```powershell
python -X utf8 scripts/import_unesp.py
```

Dependências: `requests`, `pymupdf`, `Pillow`. Downloads ficam em `.cache/question-import/unesp` e não devem ser versionados. Os resultados são `data/question-bank/unesp.json` e `public/question-bank/images/unesp-*.webp`. Não há dependência de serviços externos durante o uso do site.

Foram conferidos: unicidade dos IDs, existência das imagens, correspondência entre letra e alternativas, respostas presentes, cobertura por edição/fase e amostras visuais com imagens e textos de apoio compartilhados. Não foi usado modelo de IA para gerar gabaritos ou respostas esperadas.
