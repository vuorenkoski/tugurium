import { useQuery } from "@apollo/client";
import { SENSOR_DATA, ALL_SENSORS } from "./queries";

const App = () => {
  const sensors = useQuery(ALL_SENSORS);
  const data = useQuery(SENSOR_DATA, {
    variables: { sensorName: "CINS" },
  });

  let sensorList = [];
  if (sensors.data) {
    sensorList = sensors.data.allSensors;
  }

  let measurementList = [];
  if (data.data) {
    measurementList = data.data.sensorData;
  }

  return (
    <div>
      <h2>Tempview</h2>
      <table>
        <tbody>
          <tr>
            <th>name</th>
            <th>description</th>
            <th>unit</th>
          </tr>
          {sensorList.map((a) => (
            <tr key={a.sensorName}>
              <td>{a.sensorName}</td>
              <td>{a.sensorFullname}</td>
              <td>{a.sensorUnit}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <table>
        <tbody>
          <tr>
            <th>timestamp</th>
            <th>value</th>
          </tr>
          {measurementList.map((a) => (
            <tr key={a.timestamp}>
              <td>{a.timestamp}</td>
              <td>{a.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
