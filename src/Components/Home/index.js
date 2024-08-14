import {Component} from 'react'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  initial: 'INITIAL',
}

class Home extends Component {
  state = {
    activeCategory: categoriesList[0].id,
    filteredProjectsList: [],
    apiStatus: apiConstants.initial,
  }

  componentDidMount() {
    this.getProjects()
  }

  retryApi = () => {
    this.getProjects()
  }

  onSelectActiveCategoryId = event => {
    console.log(event.target.value)
    this.setState({activeCategory: event.target.value}, this.getProjects)
  }

  getProjects = async () => {
    this.setState({apiStatus: apiConstants.inProgress})
    const {activeCategory} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${activeCategory}`
    const response = await fetch(url)
    const data = await response.json()
    console.log(data.projects)
    console.log(response)
    if (response.ok === true) {
      const updatedData = data.projects.map(eachProject => ({
        id: eachProject.id,
        name: eachProject.name,
        imageUrl: eachProject.image_url,
      }))
      this.setState({
        filteredProjectsList: updatedData,
        apiStatus: apiConstants.success,
      })
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  renderHeader = () => (
    <div className="header">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
        alt="website logo"
        className="website-logo"
      />
    </div>
  )

  renderDropdownList = () => {
    const {activeCategory} = this.state
    console.log(activeCategory)
    return (
      <select
        value={activeCategory}
        onChange={this.onSelectActiveCategoryId}
        className="select-section"
      >
        {categoriesList.map(each => (
          <option key={each.id} value={each.id}>
            {each.displayText}
          </option>
        ))}
      </select>
    )
  }

  renderProjects = () => {
    const {filteredProjectsList} = this.state
    const {id, name, imageUrl} = filteredProjectsList
    return (
      <ul className="projects-section">
        {filteredProjectsList.map(each => (
          <li key={each.id} className="project-container">
            <img
              src={each.imageUrl}
              alt={each.name}
              className="project-image"
            />
            <p className="project-name">{each.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  renderSuccessView = () => (
    <div>
      {this.renderDropdownList()}
      {this.renderProjects()}
    </div>
  )

  renderFailureView = () => (
    <div className="failure-page">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.retryApi} className="retry-button">
        Retry
      </button>
    </div>
  )

  renderLoader = () => (
    <div data-testid="loader" className="loader">
      <Loader type="TailSpin" color="#00bfff" height={100} width={100} />
    </div>
  )

  renderView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.success:
        return this.renderSuccessView()
      case apiConstants.failure:
        return this.renderFailureView()
      case apiConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="bg-container">
        {this.renderHeader()}
        {this.renderView()}
      </div>
    )
  }
}

export default Home
