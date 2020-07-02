import { ATTR_TYPE_DEPENDENT } from '../constants'
import i18n from '../i18n'

export function attributesToChartLabels (attributes) {
  return attributes
    .filter(attribute => attribute.type === ATTR_TYPE_DEPENDENT)
    .map(attribute => ({
      key: attribute.id,
      label: i18n.t('attributes:' + attribute.name + '.name')
    }))
}
