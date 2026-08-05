// frontend/src/App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ListingsPage from "./components/ListingsPage";
import PropertyDetailPage from "./components/PropertyDetailPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ListingsPage />} />
        <Route path="/property/:id" element={<PropertyDetailPage />} />
        <Route path="*" element={<ListingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
