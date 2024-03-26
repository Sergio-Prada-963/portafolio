import React from "react"
import "../scss/main.scss"
import Navbar from "../components/navbar/navbar"
import Proyects from "../components/proyects/proyects"

class App extends React.Component {
  render() {
    return (
      <div>
        <header>
          <Navbar />
          <Proyects />
        </header>
      </div>
    )
  }
}

export default App;
