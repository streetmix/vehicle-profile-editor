/**
 * This is the method used to determine if the vehicle needs a to give more data, meeting
 * more requirements increase the data that needs to be provided.
 * @param {Object} levels - An object where each key-value pair is attribute id
 *          and the level between 1-4. This is the same object that is
 *          passed to react-d3-radar.
 * @returns {Object} - returns the code to render the drivers licence requirements
 */
import React from 'react'
import i18n from '../i18n'
import { Grid, Rating, Button } from 'semantic-ui-react'
export function calculateDataLevelRequired (levels) {
  const array = Object.values(levels).filter(Number.isFinite)
  const keys = Object.keys(levels)
  let counter = 0
  if (array.length > 0) {
    for (const element of keys) {
      if (
        element === 'weight' ||
        element === 'speed' ||
        element === 'emissions' ||
        element === 'footprint'
      ) {
        if (levels[element] > 2) {
          counter++
        }
      }
    }
  }

  if (counter === 1) {
    return (
      <Grid.Row columns={2}>
        <Grid.Column textAlign="center">
          <Rating rating={1} maxRating={5} disabled floated="right" />
        </Grid.Column>
        <Grid.Column>
          <Button fluid>{i18n.t('resultOptions.seeRequirements')}</Button>
        </Grid.Column>
      </Grid.Row>
    )
  } else if (counter === 2) {
    return (
      <Grid.Row columns={2}>
        <Grid.Column textAlign="center">
          <Rating rating={3} maxRating={5} disabled floated="right" />
        </Grid.Column>
        <Grid.Column>
          <Button fluid>{i18n.t('resultOptions.seeRequirements')}</Button>
        </Grid.Column>
      </Grid.Row>
    )
  } else if (counter === 3) {
    return (
      <Grid.Row columns={2}>
        <Grid.Column textAlign="center">
          <Rating rating={4} maxRating={5} disabled floated="right" />
        </Grid.Column>
        <Grid.Column>
          <Button fluid>{i18n.t('resultOptions.seeRequirements')}</Button>
        </Grid.Column>
      </Grid.Row>
    )
  } else if (counter === 4) {
    return (
      <Grid.Row columns={2}>
        <Grid.Column textAlign="center">
          <Rating rating={5} maxRating={5} disabled floated="right" />
        </Grid.Column>
        <Grid.Column>
          <Button fluid>{i18n.t('resultOptions.seeRequirements')}</Button>
        </Grid.Column>
      </Grid.Row>
    )
  } else {
    return (
      <Grid.Row columns={2}>
        <Grid.Column textAlign="center">
          <Rating rating={0} maxRating={5} disabled floated="right" />
        </Grid.Column>
        <Grid.Column>
          <Button disabled fluid>
            {i18n.t('resultOptions.notNecessary')}
          </Button>
        </Grid.Column>
      </Grid.Row>
    )
  }
}
