import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Register from "./components/Register";
import Login from "./components/Login";
import TodoPage from "./TodoPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { isAuthenticated } from "./utils";

export default function App() {
  console.log("isAuthenticated", isAuthenticated());
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Register />}></Route>
          <Route path="/login" element={<Login />}></Route>
          {/* Protected Route for /todo */}
          <Route
            element={<ProtectedRoute isAuthenticated={isAuthenticated()} />}
          >
            <Route path="/todo" element={<TodoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
