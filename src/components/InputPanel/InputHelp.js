import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Icon, Modal, Button, Table, Message } from 'semantic-ui-react'
import ReactMarkdown from 'react-markdown'

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
        <Modal.Header>
          <Icon
            circular
            color="teal"
            name="help"
            size="tiny"
            style={{
              position: 'relative',
              top: '-3px',
              marginRight: '1em'
            }}
          />
          {name}
        </Modal.Header>
        <Modal.Content>
          <Modal.Description>
            {description ? (
              // Markdown is used to parse links in descriptions
              // We may gradually relax `allowedTypes` as time goes on,
              // but for now, keep it to only the bare minimum needed
              <ReactMarkdown
                source={description}
                unwrapDisallowed
                linkTarget={(url, text, title) => '_blank'}
                allowedTypes={['root', 'text', 'paragraph', 'link']}
              />
            ) : (
              <p>No information is available for this attribute.</p>
            )}
          </Modal.Description>
          {thresholds && (
            <>
              <h4>Thresholds</h4>
              <Table attached="top" compact>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Threshold</Table.HeaderCell>
                    <Table.HeaderCell>Minimum</Table.HeaderCell>
                    <Table.HeaderCell>Maximum</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {thresholds.map((row, index) => (
                    <Table.Row key={index}>
                      <Table.Cell>{index + 1}</Table.Cell>
                      <Table.Cell>
                        {row[0]} {defaultUnit}
                      </Table.Cell>
                      <Table.Cell>
                        {(index !== 3 && `${row[1]} ${defaultUnit}`) || '∞'}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
              <Message info size="tiny" attached="bottom">
                <p>
                  <strong>Note:</strong> The thresholds used for this attribute
                  are based on literature and expert feedback collected by NUMO.
                  A future version of this platform will include the ability to
                  adjust these thresholds.
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
