import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Icon, Modal, Button, Table, Message } from 'semantic-ui-react'
import ReactMarkdown from 'react-markdown'
import { useTranslation } from 'react-i18next'

InputHelp.propTypes = {
  attribute: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    defaultUnit: PropTypes.string,
    thresholds: PropTypes.arrayOf(PropTypes.array)
  })
}

function InputHelp ({ attribute }) {
  const [isModalOpen, setModalOpen] = useState(false)
  const { name, description, defaultUnit, thresholds } = attribute
  const { t } = useTranslation()
  function handleModalOpen (event) {
    setModalOpen(true)
  }

  function handleCloseModal (event) {
    setModalOpen(false)
  }

  return (
    <div className="input-help">
      <Icon circular color="teal" name="help" onClick={handleModalOpen} />
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        size="tiny"
        closeIcon
      >
        <Modal.Header>{name}</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            {description ? (
              // Markdown is used to parse links in descriptions
              // We may gradually relax `allowedTypes` as time goes on,
              // but for now, keep it to only the bare minimum needed
              <ReactMarkdown
                source={t('attributes:' + name + '.description')}
                unwrapDisallowed
                linkTarget={(url, text, title) => '_blank'}
                allowedTypes={['root', 'text', 'paragraph', 'link']}
              />
            ) : (
              <p>{t('inputHelp.noDescription')}</p>
            )}
          </Modal.Description>
          {thresholds && (
            <>
              <h4>{t('inputHelp.thresholds')}</h4>
              <Table attached="top" compact>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>
                      {t('inputHelp.threshold')}
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      {t('inputHelp.minimum')}
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      {t('inputHelp.maximum')}
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {thresholds.map((row, index) => (
                    <Table.Row key={index}>
                      <Table.Cell>{index + 1}</Table.Cell>
                      <Table.Cell>
                        {index === 0 ? '≥ ' : '> '}
                        {row[0]} {defaultUnit}
                      </Table.Cell>
                      <Table.Cell>
                        {(typeof row[1] !== 'undefined' &&
                          `≤ ${row[1]} ${defaultUnit}`) ||
                          '∞'}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
              <Message info size="tiny" attached="bottom">
                <p>
                  <strong>{t('inputHelp.note')}:</strong>{' '}
                  {t('inputHelp.noteText')}
                </p>
              </Message>
            </>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" onClick={handleCloseModal}>
            OK
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  )
}

export default InputHelp
