import { Table, Row, Col } from 'react-bootstrap'
import { useQuery, useSubscription } from '@apollo/client'
import { ALL_MESSAGES, NEW_MESSAGE } from '../graphql/message'
import { convertDate, convertTemp } from '../util/conversions'
import { NETWORK_ERROR, LOADING } from '../util/config'

const Home = () => {
  const messages = useQuery(ALL_MESSAGES, {
    fetchPolicy: 'network-only',
  })

  useSubscription(NEW_MESSAGE)

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
                    <td>{m.message}</td>
                    <td>{convertDate(m.createdAt)}</td>
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

export default Home
