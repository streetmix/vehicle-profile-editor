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
        This platform presents guidance towards the level or sustainability of
        any (existing or hypothetical) vehicle depending on its attributes.
        There are pre-loaded values that you can choose to learn the policy
        implications of existing vehicles, and you can also add characteristics
        for any other vehicle and get a result.
      </p>
    </>
  )
}

export default AppHeader
