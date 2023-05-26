export class GithubUser {
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}`

    return fetch(endpoint)
      .then(data => data.json()) // tranformando o dado em tipo jason
      .then(data => ({  // pegando os dados da API do github
        login: data.login,
        name: data.name,
        public_repos: data.public_repos,
        followers: data.followers
      }))
  }

}