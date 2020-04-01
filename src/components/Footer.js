import React from 'react'
import { ReactComponent as NUMOLogo } from '../images/logo_numo.svg'
import { ReactComponent as StreetmixLogo } from '../images/logo_streetmix.svg'
import './Footer.css'

function Footer (props) {
  return (
    <footer>
      <p>
        A project by
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
        and
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
