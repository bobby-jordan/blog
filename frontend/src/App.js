import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import UsersPage from "./pages/UsersPage";
import ArticlesPage from "./pages/ArticlesPage";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/users" element={<UsersPage />} />
        <Route path="/articles" element={<ArticlesPage />} />
      </Routes>
    </Router>
  );
};

export default App;
