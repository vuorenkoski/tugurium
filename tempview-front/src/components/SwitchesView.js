import { Table, Row, Col, Button } from 'react-bootstrap'
import { useQuery, useMutation, useSubscription } from '@apollo/client'
import { ALL_SWITCHES, SET_SWITCH_COMMAND, STATUS_CHANGED } from '../queries'
import { convertDate } from '../util/conversions'

const SwitchesView = () => {
  const switches = useQuery(ALL_SWITCHES, {
    fetchPolicy: 'network-only',
  })

  const [setSwitch] = useMutation(SET_SWITCH_COMMAND, {
    refetchQueries: [{ query: ALL_SWITCHES }],
  })

  useSubscription(STATUS_CHANGED)

  const handleClick = async (sw) => {
    const variables = {
      command: !sw.command,
      setSwitchId: Number(sw.id),
    }
    await setSwitch({ variables })
  }

  return (
    <div>
      <Row className="p-4">
        <Col>
          <h2>Kytkimet</h2>
        </Col>
      </Row>

      <Row className="p-4">
        {!switches.data && <Col>Lataa tietoja...</Col>}

        <Col className="col-auto">
          {switches.data && (
            <Table striped>
              <tbody>
                <tr>
                  <th>Kytkin</th>
                  <th>Tila</th>
                  <th>Komento</th>
                  <th>Aikaleima</th>
                </tr>
                {switches.data.allSwitches.map((sw) => (
                  <tr key={sw.id}>
                    <td>{sw.description}</td>
                    <td>{sw.on ? <div>ON</div> : <div>OFF</div>}</td>
                    <td>
                      <Button
                        variant={sw.command ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => handleClick(sw)}
                      >
                        {sw.command ? <div>ON</div> : <div>OFF</div>}
                      </Button>
                    </td>
                    <td>{convertDate(Number(sw.updatedAt) / 1000)}</td>
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

export default SwitchesView
