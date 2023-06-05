import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import Loader from './utils/Loader';
import Tooltip from './utils/Tooltip';

const Todos = () => {

  const authState = useSelector(state => state.authReducer);
  const [todos, settodos] = useState([]);
  const [fetchData, { loading }] = useFetch();

  const fetchTodos = useCallback(() => {
    const config = { url: "/todos", method: "get", headers: { Authorization: authState.token } };
    fetchData(config, { showSuccessToast: false }).then(data => settodos(data.todos));
  }, [authState.token, fetchData]);

  useEffect(() => {
    if (!authState.isLoggedIn) return;
    fetchTodos();
  }, [authState.isLoggedIn, fetchTodos]);


  const handleDelete = (id) => {
    const config = { url: `/todos/${id}`, method: "delete", headers: { Authorization: authState.token } };
    fetchData(config).then(() => fetchTodos());
  }


  return (
    <>
      <div className="my-2 mx-auto max-w-[700px] py-4">

        { todos.length !== 0 && <h2 className='my-2 ml-2 md:ml-0 text-xl'>Your To-Do ({todos.length})</h2>}
        {loading ? (
          <Loader />
        ) : (
          <div>
            {todos.length === 0 ? (

              <div className='w-[600px] h-[300px] flex items-center justify-center gap-4'>
                <span>No To-Do found</span>
                <Link to="/todos/add" className="bg-blue-500 text-white hover:bg-blue-600 font-medium rounded-md px-4 py-2">+ Add new task </Link>
              </div>

            ) : (
              todos.map((todo, index) => (
                <div key={todo._id} className='bg-white my-4 p-4 text-gray-600 rounded-md shadow-md'>
                  <div className='flex'>

                    <span className='font-medium'>To-Do #{index + 1}</span>

                    <Tooltip text={"Edit this todo"} position={"top"}>
                      <Link to={`/todos/${todo._id}`} className='ml-auto mr-2 text-green-600 cursor-pointer'>
                        <i className="fa-solid fa-pen"></i>
                      </Link>
                    </Tooltip>

                    <Tooltip text={"Delete this Todo"} position={"top"}>
                      <span className='text-red-500 cursor-pointer' onClick={() => handleDelete(todo._id)}>
                        <i className="fa-solid fa-trash"></i>
                      </span>
                    </Tooltip>

                  </div>
                  <div className='whitespace-pre'>{todo.description}</div>
                </div>
              ))

            )}
          </div>
        )}
      </div>
    </>
  )

}

export default Todos