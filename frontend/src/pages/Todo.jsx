import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Textarea } from '../components/utils/Input';
import Loader from '../components/utils/Loader';
import useFetch from '../hooks/useFetch';
import MainLayout from '../layouts/MainLayout';
import validateManyFields from '../validations';

const Todo = () => {

  const authState = useSelector(state => state.authReducer);
  const navigate = useNavigate();
  const [fetchData, { loading }] = useFetch();
  const { todoId } = useParams();

  const mode = todoId === undefined ? "add" : "update";
  const [todo, setTodo] = useState(null);
  const [formData, setFormData] = useState({
    description: ""
  });
  const [formErrors, setFormErrors] = useState({});


  useEffect(() => {
    document.title = mode === "add" ? "Add To-Do" : "Update To-Do";
  }, [mode]);


  useEffect(() => {
    if (mode === "update") {
      const config = { url: `/todos/${todoId}`, method: "get", headers: { Authorization: authState.token } };
      fetchData(config, { showSuccessToast: false }).then((data) => {
        setTodo(data.todo);
        setFormData({ description: data.task.description });
      });
    }
  }, [mode, authState, todoId, fetchData]);



  const handleChange = e => {
    setFormData({
      ...formData, [e.target.name]: e.target.value
    });
  }

  const handleReset = e => {
    e.preventDefault();
    setFormData({
      description: todo.description
    });
  }

  const handleSubmit = e => {
    e.preventDefault();
    const errors = validateManyFields("To-Do", formData);
    setFormErrors({});

    if (errors.length > 0) {
      setFormErrors(errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {}));
      return;
    }

    if (mode === "add") {
      const config = { url: "/todos", method: "post", data: formData, headers: { Authorization: authState.token } };
      fetchData(config).then(() => {
        navigate("/");
      });
    }
    else {
      const config = { url: `/todos/${todoId}`, method: "put", data: formData, headers: { Authorization: authState.token } };
      fetchData(config).then(() => {
        navigate("/");
      });
    }
  }


  const fieldError = (field) => (
    <p className={`mt-1 text-pink-600 text-sm ${formErrors[field] ? "block" : "hidden"}`}>
      <i className='mr-2 fa-solid fa-circle-exclamation'></i>
      {formErrors[field]}
    </p>
  )

  return (
    <>
      <MainLayout>
        <form className='m-auto my-16 max-w-[1000px] bg-white p-8 border-2 shadow-md rounded-md'>
          {loading ? (
            <Loader />
          ) : (
            <>
              <h2 className='text-center mb-4'>{mode === "add" ? "Add New To-Do" : "Edit To-Do"}</h2>
              <div className="mb-4">
                <label htmlFor="description">Description</label>
                <Textarea type="description" name="description" id="description" value={formData.description} placeholder="Write here.." onChange={handleChange} />
                {fieldError("description")}
              </div>

              <button className='bg-primary text-white px-4 py-2 font-medium hover:bg-primary-dark' onClick={handleSubmit}>{mode === "add" ? "Add To-Do" : "Update To-Do"}</button>
              <button className='ml-4 bg-red-500 text-white px-4 py-2 font-medium' onClick={() => navigate("/")}>Cancel</button>
              {mode === "update" && <button className='ml-4 bg-blue-500 text-white px-4 py-2 font-medium hover:bg-blue-600' onClick={handleReset}>Reset</button>}
            </>
          )}
        </form>
      </MainLayout>
    </>
  )
}

export default Todo