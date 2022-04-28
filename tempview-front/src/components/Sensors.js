import { Table, Row } from 'react-bootstrap'

const Sensors = ({ sensors }) => {
  return (
    <div>
      <Row className="p-4">
        <h2>Käytössä olevat sensorit</h2>
      </Row>

      <Row className="p-4">
        <Table striped>
          <tbody>
            <tr>
              <th>Nimi</th>
              <th>Kuvaus</th>
              <th>Mittayksikkö</th>
            </tr>
            {sensors.map((a) => (
              <tr key={a.sensorName}>
                <td>{a.sensorName}</td>
                <td>{a.sensorFullname}</td>
                <td>{a.sensorUnit}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
    </div>
  )
}

export default Sensors
