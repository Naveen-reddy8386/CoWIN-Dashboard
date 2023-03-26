import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'
import './index.css'

class CowinDashboard extends Component {
  state = {vaccinationData: [], isStatus: 'PROGRASS'}

  componentDidMount() {
    this.getVaccinationData()
  }

  getVaccinationData = async () => {
    const Url = 'https://apis.ccbp.in/covid-vaccination-data'

    const response = await fetch(Url)

    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = {
        last7DaysVaccination: fetchedData.last_7_days_vaccination.map(
          eachDayData => ({
            vaccineDate: eachDayData.vaccine_date,
            dose1: eachDayData.dose_1,
            dose2: eachDayData.dose_2,
          }),
        ),
        vaccinationByAge: fetchedData.vaccination_by_age.map(range => ({
          age: range.age,
          count: range.count,
        })),
        vaccinationByGender: fetchedData.vaccination_by_gender.map(
          genderType => ({
            gender: genderType.gender,
            count: genderType.count,
          }),
        ),
      }
      this.setState({
        vaccinationData: updatedData,
        isStatus: 'SUCCESS',
      })
    } else {
      this.setState({isStatus: 'FAIL'})
    }
  }

  renderLoading = () => {
    const {isStatus} = this.state
    return (
      <div className="loading-view" data-testid="loader">
        <Loader color="#ffffff" height={80} type="ThreeDots" width={80} />
      </div>
    )
  }

  renderFail = () => (
    <div className="failure-view">
      <img
        className="failure-image"
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1 className="failure-text">Something went wrong</h1>
    </div>
  )

  renderSuccess = () => {
    const {vaccinationData} = this.state

    return (
      <div>
        <VaccinationCoverage details={vaccinationData.last7DaysVaccination} />
        <VaccinationByAge details={vaccinationData.vaccinationByAge} />
        <VaccinationByGender details={vaccinationData.vaccinationByGender} />
      </div>
    )
  }

  renderStatus = () => {
    const {isStatus} = this.state
    switch (isStatus) {
      case 'SUCCESS':
        return this.renderSuccess()
      case 'FAIL':
        return this.renderFail()
      case 'PROGRASS':
        return this.renderLoading()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="container">
        <div className="header">
          <img
            className="logo"
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
          />
          <h1 className="head">Co-WIN</h1>
        </div>
        <h1 className="heading">CoWIN Vaccination in India</h1>
        {this.renderStatus()}
      </div>
    )
  }
}
export default CowinDashboard
