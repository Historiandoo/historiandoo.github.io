import React, {useState} from 'react';
import questions from '../data/dataQuestoesVestibular.json';
import CardQuestaoVestibular from '../components/questions/CardQuestoesVestibular';
import FilterQuestion from '../components/questions/FilterQuestoes';

export default function PageQuestoesVestibular () {
    const [search, setSearch] = useState('');
    const [vestibular, setVestibular] = useState('All');
    const [year, setYear] = useState('All');
    const [period, setPeriod] = useState('All');
    const [tagsSelected, setTagsSelected] = useState([]);

    const tagsAvailable = [
        ...new Set(
            questions.flatMap((question) => question.tags)
        )
    ]; 

    const toogleTag = (tag) => {
        setTagsSelected((CurrentTags) => 
        CurrentTags.includes(tag)
        ? CurrentTags.filter((item) => item !== tag)
        : [...CurrentTags, tag]
        );
    }

    const cleanFilters = () => {
        setSearch('');
        setPeriod('All');
        setVestibular('All');
        setYear('All');
        setTagsSelected([]);
    }

    const filterQuestions = questions.filter((question) => {

        const searchText = search.toLowerCase();

        const searchMatch = 
            question.statement.toLowerCase().includes(searchText) ||
            question.period.toLowerCase().includes(searchText) ||
            question.vestibular.toLowerCase().includes(searchText) ||
            question.tags.some((tag) => tag.toLowerCase().includes(searchText)
        );

        const vestibularMatch =
        vestibular === 'All' ||
        question.vestibular === vestibular;

        const yearMatch =
        year === '' ||
        year === 'All' ||
        question.year === Number(year);

        const periodMatch =
        period === 'All' ||
        question.period === period;

        const tagsMatch =
            tagsSelected.every((tag) =>
            question.tags.includes(tag)
        );

        return (
            searchMatch &&
            periodMatch &&
            yearMatch &&
            vestibularMatch &&
            tagsMatch
        );

    });

     return (

        <main className="container page-questions">

            <div className="content-page">

                <h1 className="text-center mb-3">
                    Banco de Questões
                </h1>

                <p className="text-center intro-questions">
                    Teste seus conhecimentos em História
                    com questões de vestibulares.
                </p>

                <FilterQuestion
                    search={search}
                    setSearch={setSearch}
                    vestibular={vestibular}
                    setVestibular={setVestibular}
                    year={year}
                    setYear={setYear}
                    period={period}
                    setPeriod={setPeriod}
                    tagsSelected={tagsSelected}
                    toogleTag={toogleTag}
                    tagsAvailable={tagsAvailable}
                    cleanFilters={cleanFilters}
                />

                <p className="result">
                    {filterQuestions.length} questão(ões) encontrada(s)
                </p>

                <div className="row g-4">

                    {filterQuestions.map((question) => (

                        <div
                            className="col-12 col-md-6"
                            key={question.question_id}
                        >
                            <CardQuestaoVestibular question={question} />
                        </div>

                    ))}

                </div>


                {filterQuestions.length === 0 && (

                    <div className="text-center mt-5">

                        <h4>Nenhuma questão encontrada.</h4>

                        <p>
                            Tente modificar os filtros ou buscar outro tema.
                        </p>

                    </div>

                )}

            </div>

        </main>

    );

}

