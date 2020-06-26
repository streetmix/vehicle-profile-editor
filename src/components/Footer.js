import React from 'react'
import { ReactComponent as NUMOLogo } from '../images/logo_numo.svg'
import { ReactComponent as StreetmixLogo } from '../images/logo_streetmix.svg'
import './Footer.css'
import { useTranslation } from 'react-i18next'

function Footer (props) {
  const { t } = useTranslation()
  return (
    <footer>
      <p>
        {t('footer.part1')}
        <a
          href="https://www.numo.global/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <NUMOLogo
            style={{
              height: '2.5em'
            }}
          />
          {/* <img src={numoLogo} alt="" /> */}
        </a>
        {t('footer.and')}
        <a
          href="https://streetmix.net/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <StreetmixLogo
            style={{
              height: '1.2em'
            }}
          />
          {/* <img
            src={streetmixLogo}
            alt="Streetmix"
          /> */}
        </a>
      </p>
    </footer>
  )
}

export default Footer
