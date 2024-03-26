import React from "react"
import Inicio from "./elements/inicio"
import Switch from "./elements/switch"
import Menu from "./elements/menu"

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logo: '',
      menu: ''
    };
  }

  setLogoSvg = (value)=>{
    this.setState(e =>({
      logo: value
    }))
  }

  setMenuSvg = (value)=>{
    this.setState(e =>({
      menu: value
    }))
  }

  render() {
    return (
      <>
        <div className='nav_principal'>
          <Inicio logo={this.state.logo} />
          <div className='flex flex-row gap-5'>
            <Switch setMenuSvg={this.setMenuSvg} setLogoSvg={this.setLogoSvg} />
            <Menu menu={this.state.menu} />
          </div>
        </div>
      </>
    )
  }
}

export default Navbar
