import { Table, Row, Col, Form } from 'react-bootstrap'
import { useQuery } from '@apollo/client'
import { useState } from 'react'
import { convertDateToDate, convertNumber } from '../util/conversions'

const Commands = () => {
  return (
    <div>
      <Row className="p-4">
        <h2>Kuvat</h2>
      </Row>
      <Row className="p-4">
        <h2>Aitan lämpöpatteri</h2>
      </Row>
      <Row className="p-4">
        <h2>Kodin valot</h2>
      </Row>
    </div>
  )
}

export default Commands
