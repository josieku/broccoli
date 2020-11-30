import './index.scss';

function MenuButton(props: {open: ()=>void}) {
  return (
    <div className="MenuButton" onClick={props.open}>
        <p>MENU</p>
        <div className="menu-ico">
        <div className="bar" id="top"/>
        <div className="bar" id="middle"/>
        <div className="bar" id="bottom"/>
        </div>
    </div>
  );
}

export default MenuButton;
