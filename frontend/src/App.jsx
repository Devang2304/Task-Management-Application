import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Todo from "./pages/Todo";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { saveProfile } from "./redux/actions/authActions";
import NotFound from "./pages/NotFound";

function App() {

  const authState = useSelector(state => state.authReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    dispatch(saveProfile(token));
  }, [authState.isLoggedIn, dispatch]);


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={authState.isLoggedIn ? <Navigate to="/" /> : <Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/todos/add" element={authState.isLoggedIn ? <Todo /> : <Navigate to="/login" state={{ redirectUrl: "/todos/add" }} />} />
          <Route path="/todos/:todoId" element={authState.isLoggedIn ? <Todo /> : <Navigate to="/login" state={{ redirectUrl: window.location.pathname }} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
