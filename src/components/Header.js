import React from 'react'
import { Header } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

function AppHeader () {
  const { t } = useTranslation()
  return (
    <>
      <Header as="h1">
        {t('header.title')}
        <Header.Subheader>{t('header.subtitle')}</Header.Subheader>
      </Header>
      <p>
        {t('header.part1')}
        <a
          href="https://docs.google.com/document/d/12ScqqGQSCZSE1zgaixuP0Bmj3tuMna_z6HjODMeJiIE/edit#heading=h.7eer7omi37fl"
          rel="noreferrer"
        >
          {t('header.link')}
        </a>
      </p>
    </>
  )
}

export default AppHeader
