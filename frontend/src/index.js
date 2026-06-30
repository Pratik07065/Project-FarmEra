import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";
// import reportWebVitals from './reportWebVitals';
import Home from './pages/home';
import FarmerChatbot from './pages/chatbot';
import MarketRate from './pages/marketrate';
import YieldPrediction from './pages/YieldPred';
import Ratepredictor from './pages/ratepredictor';
import Market from './pages/market';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AuthPage from './pages/auth';
import DiseasePrediction from './pages/diseaseprediction';
import ProfilePage from './pages/profile';
import AdminPanel from './pages/adminPanel';

const root = ReactDOM.createRoot(document.getElementById('root'));
let allroutes=createBrowserRouter([
  {
    path:'/',
    element:<Home/>
  },
  {
    path:'chatbot',
    element:<FarmerChatbot/>
  },
  {
    path:'market-rate',
    element:<MarketRate/>
  },
  {
    path:'yield-prediction',
    element:<YieldPrediction/>
  },
  {
    path:'rate-predictor',
    element:<Ratepredictor/>
  },
  {
    path:'market',
    element:<Market/>
  },
  {
    path:'disease-prediction',
    element:<DiseasePrediction/>
  },
   {
    path:'log',
    element:<AuthPage/>
  },
  {
    path:'profile',
    element:<ProfilePage/>
  },
  {
    path:'admin-panel',
    element:<AdminPanel/>
  }
])
root.render(
  <React.StrictMode>
    
    <RouterProvider router={allroutes}/>
  </React.StrictMode>
);

// reportWebVitals();
