import { useState } from 'react';
import Modal from './Modal';
import Menu from './Menu';
import MenuButton from './MenuButton';
import Logo from './broccoli.png';
import './App.scss';

function App() {
  const [menuShow, setMenuShow] = useState("");
  const [modalShow, setModalShow] = useState("");

  const closeModal = () => {
    setModalShow("close");
    setTimeout(()=>setModalShow(""), 400);
  }

  const closeMenu = () => {
    setMenuShow("close");
    setTimeout(()=>setMenuShow(""), 700);
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="Logo">
          <img src={Logo} alt="Logo"/>
          <h1>BROCCOLI {"&"} CO.</h1>
        </div>
        <MenuButton open={()=>setMenuShow("open")}/>
      </header>
      <div className="App-content">
        <h1>A better way</h1>
        <h1>to enjoy every day.</h1>
        <p>Be the first to know when we launch.</p>
        <button onClick={()=>setModalShow("open")}>Request an invite</button>
      </div>
      <footer className="App-footer">
        <p>Made with 💚 in Shanghai</p>
        <p>© 2020 Broccoli {"&"} Co. All rights reserved.</p>
      </footer>
      <Modal show={modalShow} onClose={closeModal}/>
      <Menu show={menuShow} onClose={closeMenu}/>
    </div>
  );
}

export default App;
