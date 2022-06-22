import Popup from "../../components/Popup";


let notification = {
    "guid":"62464c8d-361f-4979-aaaf-8f731e83a2cb",
    "time":1655860433,
    "nodeId":15,
    "latitude":-0.19530121369111075,
    "longitude":22.01638254907382,
    "sound_type":"vehicle",
    "probability":88,
    "sound":"http://95.217.2.100:8000/55020-4-0-2.wav",
    "resolved":false
}

let empty = {}

describe('Popup.cy.js', () => {
  it('Has default values', () => {
    cy.mount(<Popup lastNotification={notification} countStart={2}/>)
    cy.get('.popup').should('have.class', '!bottom-0')
  })

  it('Should change on button click', () => {
    cy.mount(<Popup lastNotification={notification} countStart={2}/>)
    cy.get('.bg-red-600').click()
    cy.get('.popup').should('have.class', 'closed')
  })

  it('Should be empty without notification', () => {
    cy.mount(<Popup lastNotification={empty} countStart={2}/>)
    cy.get('.capitalize').should('not.have', 'vehicle')
  })

  it('Should have a name with notification', () => {
    cy.mount(<Popup lastNotification={notification} countStart={2}/>)
    cy.get('.capitalize').should('contain', 'vehicle')
  })

  it('Should not have a progress circle when not playing', () => {
    cy.mount(<Popup lastNotification={notification} countStart={2}/>)
    cy.get('.rounded-full').should('have.css', 'background-color', 'rgb(240, 240, 240)')
  })

  it('Should have a working progress circle', () => {
    cy.mount(<Popup lastNotification={notification} countStart={2}/>)
    cy.get('.rounded-full').click()
    cy.get('.rounded-full').should('not.have.css', 'background', 'rgb(240, 240, 240)')
    cy.get('.rounded-full').should('have.css', 'background')
  })
})