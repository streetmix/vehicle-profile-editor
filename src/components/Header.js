import React from 'react'
import { Header } from 'semantic-ui-react'

function AppHeader () {
  return (
    <>
      <Header as="h1">
        Periodic Table of Mobility
        <Header.Subheader>A policy guidance tool by NUMO</Header.Subheader>
      </Header>
      <p>
        This platform helps assess the impact of any vehicle (existing or
        hypothetical) depending on its attributes. There are pre-loaded values
        that you can choose to learn the policy implications of existing
        vehicles. You can add customized characteristics, or create new vehicle
        types as well.{' '}
        <a
          href="https://docs.google.com/document/d/12ScqqGQSCZSE1zgaixuP0Bmj3tuMna_z6HjODMeJiIE/edit#heading=h.7eer7omi37fl"
          rel="noreferrer"
        >
          Learn why this tool exists and how to offer feedback.
        </a>
      </p>
    </>
  )
}

export default AppHeader
