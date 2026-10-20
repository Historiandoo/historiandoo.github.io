export default function QuestionSource({ source, answer = false }) {
    const url = answer ? source.answerUrl : source.examUrl;
    const page = answer ? source.answerPage : source.questionPage;
    if (!url || !/^https?:\/\//.test(url)) return null;
    const label = answer ? source.answerSourceType === 'commentary' ? `Resolução comentada · ${source.answerProvider || 'cursinho'}` : 'Gabarito / resposta esperada oficial' : 'Consultar prova original';
    return <a className="source-link" href={`${url.split('#')[0]}${page ? `#page=${page}` : ''}`} target="_blank" rel="noreferrer">{label}{page ? ` · p. ${page}` : ''} ↗</a>;
}
