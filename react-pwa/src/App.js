import React, { Component, Fragment } from "react";
import axios from "axios";
import { Header, Repositories, GlobalStyle, Offline } from "./styles";

class App extends Component {
  state = {
    online: navigator.onLine,
    newRepoInput: "",
    repositories: JSON.parse(localStorage.getItem("@pwa:repositories")) || []
  };

  componentDidMount() {
    window.addEventListener("online", this.handleNetworkChange);
    window.addEventListener("offline", this.handleNetworkChange);
  }

  componentWillUnmount() {
    window.removeEventListener("online", this.handleNetworkChange);
    window.removeEventListener("offline", this.handleNetworkChange);
  }

  handleNetworkChange = () => {
    this.setState({
      online: navigator.onLine
    });
  };

  handleInputChange = e => {
    e.preventDefault();

    this.setState({
      newRepoInput: e.target.value
    });
  };

  hanleAddRepository = async () => {
    try {
      if (!this.state.newRepoInput) return;

      if (!this.state.online) {
        return alert("Você está offline, conecte-se para fazer essa ação!");
      }

      const response = await axios.get(
        `https://api.github.com/repos/${this.state.newRepoInput}`
      );

      this.setState({
        newRepoInput: "",
        repositories: [...this.state.repositories, response.data]
      });

      localStorage.setItem(
        "@pwa:repositories",
        JSON.stringify(this.state.repositories)
      );
    } catch (err) {
      return alert("Repositório não encontrado!");
    }
  };

  render() {
    return (
      <Fragment>
        <GlobalStyle />
        <Header>
          <input
            placeholder="Adicionar repositório"
            onChange={this.handleInputChange}
            value={this.state.newRepoInput}
          />

          <button onClick={this.hanleAddRepository}>Adicionar</button>
        </Header>
        <Repositories>
          {this.state.repositories.map(repository => (
            <li key={repository.id}>
              <img src={repository.owner.avatar_url} alt="avatar" />
              <div>
                <strong>{repository.name}</strong>
                <p>{repository.description}</p>
                <a href={repository.html_url}>Acessar</a>
              </div>
            </li>
          ))}
        </Repositories>

        {!this.state.online && <Offline> Você está offline </Offline>}
      </Fragment>
    );
  }
}

export default App;
