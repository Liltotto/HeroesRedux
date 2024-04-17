

// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров


import { useHttp } from '../../hooks/http.hook';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as heroId } from 'uuid';

import { heroesFetching, heroesFetched, heroesFetchingError } from '../../actions';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';



const HeroesAddForm = () => {

    const { heroes } = useSelector(state => state);
    const dispatch = useDispatch();
    const { request } = useHttp();

    const [filters, setFilters] = useState([]);


    const [formData, setFormData] = useState({
        name: '',
        description: '',
        element: ''
    })


    useEffect(() => {
        request("http://localhost:3001/filters")
            .then(data => {
                data.shift();
                setFilters(data)
            })
            .catch(() => console.log('error filters'))
    }, []);

    const submitHandler = (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const json_data = Object.fromEntries(data);      
        const result_data = JSON.stringify({ id: heroId(), name: json_data.name, description: json_data.text, element: json_data.element });
        
        dispatch(heroesFetching());
        request(`http://localhost:3001/heroes`, 'POST', result_data)
            .then(data => dispatch(heroesFetched([...heroes, data])))
            .catch(() => dispatch(heroesFetchingError()))
            .finally(() => event.target.reset())
    }

    return (
        <form
            className="border p-4 shadow-lg rounded"
            onSubmit={submitHandler}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input
                    required
                    type="text"
                    name="name"
                    className="form-control"
                    id="name"
                    placeholder="Как меня зовут?" 
                    value={formData.name} 
                    onChange={event => setFormData({ ...formData, name: event.target.value })}/>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    required
                    name="text"
                    className="form-control"
                    id="text"
                    placeholder="Что я умею?"
                    style={{ "height": '130px' }}
                    value={formData.description}
                    onChange={event => setFormData({ ...formData, description: event.target.value })} />
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select
                    required
                    className="form-select"
                    id="element"
                    name="element"
                    value={formData.element}
                    onChange={event => setFormData({ ...formData, element: event.target.value })}
                    >
                    <option >Я владею элементом...</option>
                    {
                        filters.map((item) => {
                            return <option key={item.name} value={item.name}>{item.label}</option>
                        })
                    }
                    {/* <option value="fire">Огонь</option>
                    <option value="water">Вода</option>
                    <option value="wind">Ветер</option>
                    <option value="earth">Земля</option> */}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Создать</button>
        </form>
    )
}

export default HeroesAddForm;