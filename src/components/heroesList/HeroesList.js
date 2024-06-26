import { useHttp } from '../../hooks/http.hook';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { heroesFetching, heroesFetched, heroesFetchingError } from '../../actions';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE

const HeroesList = () => {
    const { heroes, heroesLoadingStatus, filter } = useSelector(state => state);
    const dispatch = useDispatch();
    const { request } = useHttp();


    useEffect(() => {
        dispatch(heroesFetching());
        request("http://localhost:3001/heroes")
            .then(data => {
                dispatch(heroesFetched(data))
            })
            .catch(() => dispatch(heroesFetchingError()))
    }, [])

    const deleteHero = (id) => {
        dispatch(heroesFetching());
        request(`http://localhost:3001/heroes/${id}`, 'DELETE')
            .then(() => dispatch(heroesFetched(heroes)))
            .catch(() => dispatch(heroesFetchingError()))
    }

    if (heroesLoadingStatus === "loading") {
        return <Spinner />;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderHeroesList = (arr) => {

        console.log('problem');
        console.log(heroes);
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Героев пока нет</h5>
        }


        return arr.filter(item => item.element === filter || filter === 'all').map(({ id, ...props }) => {
            return <HeroesListItem key={id} id={id} onDelete={() => deleteHero(id)} {...props}  />
        })

    }

    const elements = renderHeroesList(heroes);
    return (
        <ul>
            {elements}
        </ul>
    )
}

export default HeroesList;