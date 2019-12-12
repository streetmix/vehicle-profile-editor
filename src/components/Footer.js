import React from 'react'
import numoLogo from '../images/logo_numo.png'
import streetmixLogo from '../images/logo_streetmix.svg'
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
          <img src={numoLogo} alt="New Urban Mobility Alliance" />
        </a>
        and
        <a
          href="https://streetmix.net/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={streetmixLogo}
            alt="Streetmix"
            style={{
              height: '1em',
              opacity: 0.55
            }}
          />
        </a>
      </p>
    </footer>
  )
}

export default Footer
