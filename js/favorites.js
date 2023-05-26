import { GithubUser } from "./GithubUser.js"

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
   
  }

  // para carregar os dados
  load() {
    const entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []

    this.entries = entries
  }

  // para salvar as modificações no localStorage
  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }


  async add(username) {
    try {
      const userExists = this.entries.find(entry => entry.login === username)
      if(userExists) {
        throw new Error('Usuário já favoritado.')
      }

      const user = await GithubUser.search(username)

      if(user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()


    } catch(error) {
      alert(error.message)
    }
  }

  delete(user) {
    const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

    this.entries = filteredEntries

    this.update()
    this.save()
  }

  
  toggleNoFavorites() {
    const noFavorites = this.root.querySelector(".no-fav")
    const tableContent = this.root.querySelector(".table-content")

    if(this.entries.lenght === 0) {
      noFavorites.classList.remove("hide")
      tableContent.classList.add("hide")
    } else {
      noFavorites.classList.add("hide")
      tableContent.classList.remove("hide")
    }

  }


}




export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector('tbody')

    this.update()
    this.onAdd()
  }


  onAdd() {
    const addButton = this.root.querySelector('.search button')
    addButton.onclick = () => {
      const {value} = this.root.querySelector('.search input')

      this.add(value)
    }
  }


  update() {
    this.removeAllTr()
 

    this.entries.forEach( user => {
      const row = this.createRow()

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Tem certeza que deseja deletar essa linha?')
        if(isOk) {
          this.delete(user)

        }
      }
      
      this.tbody.append(row)
      this.toggleNoFavorites()
      })

    }



  createRow() {
    const tr = document.createElement('tr')

    const content = `
      <td class="user">
        <img src="https://github.com/milenarendt.png" alt="Imagem de perfil do usuário">
        <a href="https://github.com/milenarendt" target="_blank">
          <p>Milena Arendt</p>
          <span>milenarendt</span>
        </a>
      </td>

      <td class="repositories">
        123
      </td>

      <td class="followers">
        1234
      </td>

      <td class="action">
        <button class="remove">Remover</button>
      </td>
    `

    tr.innerHTML = content

    return tr
  }


  removeAllTr() {
   this.tbody.querySelectorAll('tr')
    .forEach((tr) => {
      tr.remove()
    })
  }


}