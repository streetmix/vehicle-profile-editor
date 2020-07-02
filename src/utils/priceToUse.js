/**
 * This is the method used to determine if the vehicle needs for a price to be set for use, at the moment
 * it only has a need/does not need binary result but it will be expanded in the future
 * @param {Object} levels - An object where each key-value pair is attribute id
 *          and the level between 1-4. This is the same object that is
 *          passed to react-d3-radar.
 * @param {String} useCase - The use case of the vehicle in question, it impacts the necesity of the licence
 * @returns {Object} - returns the code to render the drivers licence requirements
 */
import { DEFAULT_USE_CASE } from '../constants'
import React from 'react'
import i18n from '../i18n'
import { Grid, Segment, Button, Icon } from 'semantic-ui-react'
export function calculatePriceRequired (levels, useCase) {
  const array = Object.values(levels).filter(Number.isFinite)
  const keys = Object.keys(levels)
  let counter = 0
  if (useCase !== DEFAULT_USE_CASE && typeof useCase !== 'undefined') {
    counter++
  }
  if (array.length > 0) {
    for (const element of keys) {
      if (
        element === 'footprint' ||
        element === 'emissions' ||
        element === 'speed'
      ) {
        if (levels[element] > 3) {
          counter++
        }
      }
    }
  }

  if (counter > 0) {
    return (
      <Grid.Row columns={2}>
        <Grid.Column>
          <Segment basic textAlign="center">
            {i18n.t('resultOptions.price')} <Icon name="check" />
          </Segment>
        </Grid.Column>
        <Grid.Column>
          <Button fluid>{i18n.t('resultOptions.priceDetails')}</Button>
        </Grid.Column>
      </Grid.Row>
    )
  }
  return (
    <Grid.Row columns={2}>
      <Grid.Column>
        <Segment disabled basic textAlign="center">
          {i18n.t('resultOptions.price')} <Icon name="dont" />
        </Segment>
      </Grid.Column>
      <Grid.Column>
        <Button disabled fluid>
          {i18n.t('resultOptions.notNecessary')}
        </Button>
      </Grid.Column>
    </Grid.Row>
  )
}
