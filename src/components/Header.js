import React from 'react'
import { Header } from 'semantic-ui-react'

function AppHeader () {
  return (
    <>
      <Header as="h1">
        Vehicle profiles
        <Header.Subheader>A policy guidance tool by NUMO</Header.Subheader>
      </Header>
      <p>
        This platform helps assess the impact of any vehicle (existing or
        hypothetical) depending on its attributes. There are pre-loaded values
        that you can choose to learn the policy implications of existing
        vehicles. You can add customized characteristics, or create new vehicle
        types as well.
      </p>
    </>
  )
}

export default AppHeader
