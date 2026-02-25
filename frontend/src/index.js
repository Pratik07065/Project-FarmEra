import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
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
  }
])
root.render(
  <React.StrictMode>
    
    <RouterProvider router={allroutes}/>
  </React.StrictMode>
);

// reportWebVitals();
