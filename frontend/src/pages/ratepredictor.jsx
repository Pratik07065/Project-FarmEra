import React, { useState } from 'react';
import { Form, Button, Card, Row, Col, Container, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

const PricePredictor = () => {
    // 1. State for Form Inputs
    const [formData, setFormData] = useState({
        State: '',
        District: '',
        Market: '',
        Commodity: 'Onion',
        Arrival_Date: '' // Captured as YYYY-MM-DD from input
    });

    // 2. State for API Response and UI flow
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setPrediction(null);

        // --- NECESSARY CHANGE: Format date to DD-MM-YYYY for your Python backend ---
        const [year, month, day] = formData.Arrival_Date.split('-');
        const payload = {
            ...formData,
            Arrival_Date: `${day}-${month}-${year}`
        };

        try {
            // --- API CONNECTION ---
            // Replace 'http://127.0.0.1:5000' with your actual backend URL if deployed
            const response = await axios.post('http://127.0.0.1:5000/predict', payload);
            
            // Success: Store the prediction data in state
            setPrediction(response.data);
        } catch (err) {
            console.error("Connection Error:", err);
            setError("Unable to connect to the prediction server. Please ensure the Flask backend is running and CORS is enabled.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col lg={7}>
                    <Card className="shadow-lg border-0 rounded-4">
                        <Card.Body className="p-4 p-md-5">
                            <div className="text-center mb-4">
                                <h2 className="fw-bold text-success">Onion Price Forecasting</h2>
                                <p className="text-muted">Enter market details to get AI-powered price predictions</p>
                            </div>

                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6} className="mb-3">
                                        <Form.Label className="fw-semibold">State</Form.Label>
                                        <Form.Control type="text" name="State" placeholder="e.g. Maharashtra" onChange={handleChange} required className="rounded-3" />
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <Form.Label className="fw-semibold">District</Form.Label>
                                        <Form.Control type="text" name="District" placeholder="e.g. Nashik" onChange={handleChange} required className="rounded-3" />
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">Market Name</Form.Label>
                                    <Form.Control type="text" name="Market" placeholder="e.g. Lasalgaon" onChange={handleChange} required className="rounded-3" />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold">Date of Arrival</Form.Label>
                                    <Form.Control type="date" name="Arrival_Date" onChange={handleChange} required className="rounded-3" />
                                </Form.Group>

                                <Button variant="success" type="submit" className="w-100 py-3 fw-bold rounded-3 shadow-sm" disabled={loading}>
                                    {loading ? (
                                        <><Spinner animation="border" size="sm" className="me-2" /> Processing Data...</>
                                    ) : 'Predict Market Price'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>

                    {/* ERROR HANDLING */}
                    {error && <Alert variant="danger" className="mt-4 shadow-sm rounded-3 text-center">{error}</Alert>}

                    {/* PREDICTION DISPLAY */}
                    {prediction && (
                        <Card className="mt-4 border-0 shadow rounded-4 bg-light overflow-hidden">
                            <div className="bg-success py-2 text-center text-white fw-bold uppercase small" style={{letterSpacing: '1px'}}>
                                PREDICTED MARKET RATES (per Quintal)
                            </div>
                            <Card.Body className="py-4">
                                <Row className="align-items-center text-center">
                                    <Col xs={4}>
                                        <div className="text-muted small mb-1">Min Price</div>
                                        <h4 className="fw-bold mb-0 text-dark">₹{prediction.min_price}</h4>
                                    </Col>
                                    <Col xs={4} className="border-start border-end">
                                        <div className="text-success small mb-1 fw-bold">Modal Price</div>
                                        <h2 className="fw-bold mb-0 text-success">₹{prediction.modal_price}</h2>
                                    </Col>
                                    <Col xs={4}>
                                        <div className="text-muted small mb-1">Max Price</div>
                                        <h4 className="fw-bold mb-0 text-dark">₹{prediction.max_price}</h4>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default PricePredictor;