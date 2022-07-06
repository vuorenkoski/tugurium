import { useEffect } from 'react'
import { Table, Row, Col } from 'react-bootstrap'
import { useQuery } from '@apollo/client'
import { ALL_MESSAGES, NEW_MESSAGE } from '../graphql/message'
import { convertDate } from '../util/conversions'
import { NETWORK_ERROR, LOADING } from '../util/config'

const MessagesView = () => {
  const { subscribeToMore, ...messages } = useQuery(ALL_MESSAGES, {
    fetchPolicy: 'network-only',
  })
  useEffect(() => {
    subscribeToMore({
      document: NEW_MESSAGE,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        return Object.assign({}, prev, {
          allMessages: [subscriptionData.data.newMessage, ...prev.allMessages],
        })
      },
    })
  }, [])

  return (
    <div>
      <Row className="p-4 pb-0">
        <Col>
          <h2>Viestit</h2>
        </Col>
      </Row>
      {!messages.data && messages.loading && (
        <Row className="p-4 pb-0">
          <Col>
            <p>{LOADING}</p>
          </Col>
        </Row>
      )}
      {!messages.data && messages.error && messages.error.networkError && (
        <Row className="p-4 pb-0">
          <Col>
            <p className="errorMessage">{NETWORK_ERROR}</p>
          </Col>
        </Row>
      )}
      <Row className="p-4">
        <Col className="col-auto">
          {messages.data && (
            <Table striped>
              <tbody>
                <tr>
                  <th>Laite</th>
                  <th>Viesti</th>
                  <th>Aikaleima</th>
                </tr>
                {messages.data.allMessages.map((m) => (
                  <tr key={m.id}>
                    <td>{m.from}</td>
                    <td>
                      {m.important && <b>{m.message}</b>}
                      {!m.important && m.message}
                    </td>
                    <td>{convertDate(m.createdAt / 1000)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </div>
  )
}

export default MessagesView
