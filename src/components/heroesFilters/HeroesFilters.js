
// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом

import { useEffect, useState } from "react";
import { useHttp } from "../../hooks/http.hook";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { heroesFetching, heroesFetched, heroesFetchingError } from '../../actions';

const HeroesFilters = () => {


    const {heroes, heroesLoadingStatus} = useSelector(state => state);
    const dispatch = useDispatch();

    const [filters, setFilters] = useState([]);

    const [activeFilter, setActiveFilter] = useState('all');

    const { request } = useHttp();

    useEffect(() => {
        request("http://localhost:3001/filters")
            .then(data => { setFilters(data) })
            .catch(() => console.log('error filters'))
    }, []);

    useEffect(() => {
        dispatch(heroesFetching());
        request("http://localhost:3001/heroes")
            .then(data => {
                dispatch(heroesFetched(data, activeFilter))
            })
            .catch(() => dispatch(heroesFetchingError()))
    }, [activeFilter])

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {
                        filters.map(item => {

                            const btnClass = classNames('btn', item.classname, {
                                active: item.name === activeFilter
                            })

                            return (
                                <button
                                    key={item.name}
                                    className={btnClass}
                                    onClick={() => setActiveFilter(item.name)}>
                                    {item.label}
                                </button>
                            )
                        })
                    }
                    {/* <button className="btn btn-outline-dark active">Все</button>
                    <button className="btn btn-danger">Огонь</button>
                    <button className="btn btn-primary">Вода</button>
                    <button className="btn btn-success">Ветер</button>
                    <button className="btn btn-secondary">Земля</button> */}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;