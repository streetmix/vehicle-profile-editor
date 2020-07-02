/**
 * This is the method used to determine where the vehicle should move, meeting
 * more requirements changed the space that needs to be provided.
 * @param {Object} levels - An object where each key-value pair is attribute id
 *          and the level between 1-4. This is the same object that is
 *          passed to react-d3-radar.
 * @returns {Object} - returns the code to render the drivers licence requirements
 */
import React from 'react'
import i18n from '../i18n'
import { Grid, Segment } from 'semantic-ui-react'
export function calculateSpaceRequired (levels) {
  const array = Object.values(levels).filter(Number.isFinite)
  const keys = Object.keys(levels)
  let counter = 0
  if (array.length > 0) {
    for (const element of keys) {
      if (
        element === 'weight' ||
        element === 'speed' ||
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
      <Grid.Row columns={4}>
        <Grid.Column textAlign="center">
          <Segment basic textAlign="center">
            {i18n.t('resultOptions.sidewalk')}
          </Segment>
        </Grid.Column>
        <Grid.Column textAlign="center">
          <Segment basic textAlign="center">
            {i18n.t('resultOptions.nextPUDO')}
          </Segment>
        </Grid.Column>
        <Grid.Column textAlign="center">
          <Segment basic textAlign="center">
            {i18n.t('resultOptions.nextMove')}
          </Segment>
        </Grid.Column>
        <Grid.Column textAlign="center">
          <Segment basic disabled textAlign="center">
            {i18n.t('resultOptions.farMove')}
          </Segment>
        </Grid.Column>
      </Grid.Row>
    )
  } else if (counter === 2) {
    return (
      <Grid.Row columns={4}>
        <Grid.Column textAlign="center">
          <Segment basic disabled textAlign="center">
            {i18n.t('resultOptions.sidewalk')}
          </Segment>
        </Grid.Column>
        <Grid.Column textAlign="center">
          <Segment basic textAlign="center">
            {i18n.t('resultOptions.nextPUDO')}
          </Segment>
        </Grid.Column>
        <Grid.Column textAlign="center">
          <Segment basic textAlign="center">
            {i18n.t('resultOptions.nextMove')}
          </Segment>
        </Grid.Column>
        <Grid.Column textAlign="center">
          <Segment basic disabled textAlign="center">
            {i18n.t('resultOptions.farMove')}
          </Segment>
        </Grid.Column>
      </Grid.Row>
    )
  } else if (counter === 3) {
    return (
      <Grid.Row columns={4}>
        <Grid.Column textAlign="center">
          <Segment basic disabled textAlign="center">
            {i18n.t('resultOptions.sidewalk')}
          </Segment>
        </Grid.Column>
        <Grid.Column textAlign="center">
          <Segment basic textAlign="center">
            {i18n.t('resultOptions.nextPUDO')}
          </Segment>
        </Grid.Column>
        <Grid.Column textAlign="center">
          <Segment basic textAlign="center">
            {i18n.t('resultOptions.nextMove')}
          </Segment>
        </Grid.Column>
        <Grid.Column textAlign="center">
          <Segment basic disabled textAlign="center">
            {i18n.t('resultOptions.farMove')}
          </Segment>
        </Grid.Column>
      </Grid.Row>
    )
  } else if (counter === 4) {
    return (
      <Grid.Row columns={4}>
        <Grid.Column textAlign="center">
          <Segment basic disabled textAlign="center">
            {i18n.t('resultOptions.sidewalk')}
          </Segment>
        </Grid.Column>
        <Grid.Column textAlign="center">
          <Segment basic textAlign="center">
            {i18n.t('resultOptions.nextPUDO')}
          </Segment>
        </Grid.Column>
        <Grid.Column textAlign="center">
          <Segment basic disabled textAlign="center">
            {i18n.t('resultOptions.nextMove')}
          </Segment>
        </Grid.Column>
        <Grid.Column basic textAlign="center">
          <Segment textAlign="center">
            {i18n.t('resultOptions.farMove')}
          </Segment>
        </Grid.Column>
      </Grid.Row>
    )
  } else {
    return (
      <Grid.Row columns={4}>
        <Grid.Column textAlign="center">
          <Segment basic textAlign="center">
            {i18n.t('resultOptions.sidewalk')}
          </Segment>
        </Grid.Column>
        <Grid.Column textAlign="center">
          <Segment basic disabled textAlign="center">
            {i18n.t('resultOptions.nextPUDO')}
          </Segment>
        </Grid.Column>
        <Grid.Column textAlign="center">
          <Segment basic disabled textAlign="center">
            {i18n.t('resultOptions.nextMove')}
          </Segment>
        </Grid.Column>
        <Grid.Column textAlign="center">
          <Segment basic disabled textAlign="center">
            {i18n.t('resultOptions.farMove')}
          </Segment>
        </Grid.Column>
      </Grid.Row>
    )
  }
}
