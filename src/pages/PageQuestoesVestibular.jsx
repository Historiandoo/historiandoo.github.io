import React, {useState} from 'react';
import questions from '../data/dataQuestoesVestibular.json';

function PageQuestoesVestibular () {
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
            question.tag.some((tag) => tag.toLowerCase().includes(searchText)
        );

        const vestibularMatch =
        vestibular === 'All' ||
        question.vestibular === vestibular;

        const yearMatch =
        year === 'All' ||
        question.year === year;

        const periodMatch =
        period === 'All' ||
        question.perido === period;

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
    
}
