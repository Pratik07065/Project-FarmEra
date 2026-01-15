
import './App.css';
import Footer from './common/footer';
import Header from './common/header';
import Chatbot from './pages/chatbot';
import MarketRate from './pages/marketrate';





function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      
      {/* <MarketRate/> */}
      {/* <Chatbot/> */}
     
      <Footer />


    </div>
  );
}

export default App;
