import React, { useState } from 'react'
import NavScrollExample from '../navbar'
import Footer from '../common/footer'

import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';

export default function Ratepredictor() {
    const [formData, setFormData] = useState({
    Market: "",
    Variety: "",
    Day: "",
    Month: "",
    Year: "",
    Modal_lag_1: "",
    Modal_lag_7: "",
    Modal_lag_14: ""
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Market: formData.Market,
        Variety: formData.Variety,
        Day: Number(formData.Day),
        Month: Number(formData.Month),
        Year: Number(formData.Year),
        Modal_lag_1: Number(formData.Modal_lag_1),
        Modal_lag_7: Number(formData.Modal_lag_7),
        Modal_lag_14: Number(formData.Modal_lag_14)
      })
    });

    const data = await response.json();
    setPrediction(data.Predicted_Modal_Price);
    setLoading(false);
  };
  return (
    <div>
      <NavScrollExample/>
      
     <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow">
            <Card.Body>
              <Card.Title className="text-center mb-4">
                🧅 Onion Modal Price Prediction
              </Card.Title>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-2">
                  <Form.Control
                    name="Market"
                    placeholder="Market (e.g. Pune)"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Control
                    name="Variety"
                    placeholder="Variety (e.g. Onion)"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Row>
                  <Col>
                    <Form.Control
                      name="Day"
                      type="number"
                      placeholder="Day"
                      onChange={handleChange}
                      required
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      name="Month"
                      type="number"
                      placeholder="Month"
                      onChange={handleChange}
                      required
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      name="Year"
                      type="number"
                      placeholder="Year"
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                <Form.Group className="mt-3">
                  <Form.Control
                    name="Modal_lag_1"
                    type="number"
                    placeholder="Yesterday Price"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mt-2">
                  <Form.Control
                    name="Modal_lag_7"
                    type="number"
                    placeholder="Last Week Price"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mt-2">
                  <Form.Control
                    name="Modal_lag_14"
                    type="number"
                    placeholder="2 Weeks Ago Price"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <div className="d-grid mt-4">
                  <Button variant="success" type="submit">
                    {loading ? <Spinner animation="border" size="sm" /> : "Predict Price"}
                  </Button>
                </div>
              </Form>

              {prediction && (
                <Card className="mt-4 text-center bg-light">
                  <Card.Body>
                    <h5>💰 Predicted Modal Price</h5>
                    <h3 className="text-success">₹ {prediction}</h3>
                  </Card.Body>
                </Card>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>

      <Footer/>
    </div>
  )
}
