import './index.scss';

function Menu(props: { show: string, onClose: ()=>void}) {
  return (
    <div className={`Side-menu ${props.show}`}>
        <div className="background" onClick={props.onClose}/>
        <div className="link-bar">
          <div className="top" onClick={props.onClose}>
            <p>&times;</p>
          </div>
          <div className="links">
            <a href="#">About</a>
            <a href="#">News</a>
            <a href="#">Contact Us</a>
          </div>
          <div className="bottom"/>
        </div>
      </div>
  );
}

export default Menu;
