import { Table, Row, Col } from 'react-bootstrap'
import { useQuery, useMutation, useSubscription } from '@apollo/client'
import {
  ALL_SWITCHES,
  SET_SWITCH_COMMAND,
  STATUS_CHANGED,
} from '../graphql/switch'
import { convertDate } from '../util/conversions'
import { NETWORK_ERROR, LOADING } from '../util/config'

const SwitchesView = () => {
  const switches = useQuery(ALL_SWITCHES, {
    fetchPolicy: 'network-only',
  })

  const [setSwitch] = useMutation(SET_SWITCH_COMMAND, {
    refetchQueries: [{ query: ALL_SWITCHES }],
  })

  useSubscription(STATUS_CHANGED)

  const admin = JSON.parse(localStorage.getItem('tugurium-user')).admin

  const handleClick = async (sw) => {
    const variables = {
      command: !sw.command,
      setSwitchId: Number(sw.id),
    }
    await setSwitch({ variables })
  }

  return (
    <div>
      <Row className="p-4 pb-0">
        <Col>
          <h2>Kytkimet</h2>
        </Col>
      </Row>
      {!switches.data && switches.loading && (
        <Row className="p-4 pb-0">
          <Col>
            <p>{LOADING}</p>
          </Col>
        </Row>
      )}
      {!switches.data && switches.error && switches.error.networkError && (
        <Row className="p-4 pb-0">
          <Col>
            <p className="errorMessage">{NETWORK_ERROR}</p>
          </Col>
        </Row>
      )}
      {switches.data && (
        <Row className="p-4">
          <Col className="col-auto">
            <Table striped>
              <tbody>
                <tr>
                  <th>Kytkin</th>
                  <th>Tila</th>
                  {admin && <th>Komento</th>}
                  <th>Aikaleima</th>
                </tr>
                {switches.data.allSwitches.map((sw) => (
                  <tr key={sw.id}>
                    <td>{sw.description}</td>
                    <td>
                      {sw.on ? (
                        <div className="onButton">ON</div>
                      ) : (
                        <div>OFF</div>
                      )}
                    </td>
                    {admin && (
                      <td>
                        <button
                          className={sw.command ? 'onButton' : 'offButton'}
                          size="sm"
                          onClick={() => handleClick(sw)}
                        >
                          {sw.command ? <div>ON</div> : <div>OFF</div>}
                        </button>
                      </td>
                    )}
                    <td>{convertDate(Number(sw.updatedAt) / 1000)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      )}
    </div>
  )
}

export default SwitchesView
