import React, { useState } from 'react';

import { Form, Button, Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';

import NavScrollExample from '../navbar';
import Footer from '../common/footer';




/**
 * Carditem Component: Renders a single card with market data for a commodity.
 * @param {object} props - The properties passed to the component.
 * @param {object} props.record - An object containing the market data for one entry.
 */
function Carditem({ record }) {
    return (
        <Card className="text-center h-100 shadow-sm rounded">
            <Card.Header className="fw-bold bg-success-subtle">{record.commodity}</Card.Header>
            <Card.Body>
                <Card.Title className="text-success">{record.market}</Card.Title>
                <Card.Text>
                    <span className="fw-semibold">Variety:</span> {record.variety}
                </Card.Text>
                <Card.Text>
                    <span className="fw-semibold">Grade:</span> {record.grade}
                </Card.Text>
                <Card.Text className="text-muted">
                    {/* Last updated: {new Date(record.arrival_date).toLocaleDateString()} */}
                    Last updated: {record.arrival_date}
                </Card.Text>
            </Card.Body>
            <Card.Footer className="d-flex flex-column flex-md-row justify-content-around align-items-center gap-2 bg-light">
                <Button variant="success" disabled size="sm">Min: ₹{record.min_price}</Button>
                <Button variant="warning" disabled size="sm">Avg: ₹{record.modal_price}</Button>
                <Button variant="danger" disabled size="sm">Max: ₹{record.max_price}</Button>
            </Card.Footer>
        </Card>
    );
}


/**
 * InputMarInfo Component: Renders the input form for state and district.
 * @param {object} props - The properties passed from the parent component.
 */
function InputMarInfo({ stateName, setStateName, district, setDistrict, handleSubmit, loading }) {
    return (
        <Container className="py-4">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="p-4 shadow-sm rounded">
                        <h2 className="mb-4 text-center">Find Local Market Rates</h2>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="formBasicState">
                                <Form.Label>State Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="e.g., Uttar Pradesh"
                                    value={stateName}
                                    onChange={(e) => setStateName(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicDistrict">
                                <Form.Label>District Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="e.g., Agra"
                                    value={district}
                                    onChange={(e) => setDistrict(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <div className="d-grid">
                                <Button variant="primary" type="submit" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                            {' '}Loading...
                                        </>
                                    ) : (
                                        'Submit'
                                    )}
                                </Button>
                            </div>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

/**
 * MarketRate Component: The main component that manages state and renders the application.
 */
function MarketRate() {
    // State to hold the value of the input fields
    const [stateName, setStateName] = useState('');
    const [district, setDistrict] = useState('');

    // State to hold the fetched market data
    const [marketData, setMarketData] = useState([]);

    // State for loading and error handling
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    /**
     * Handles the form submission event. This function is now async.
     * @param {React.FormEvent<HTMLFormElement>} event - The form submission event.
     */
    const handleSubmit = async (event) => {
        // Prevent the default browser behavior of refreshing the page.
        event.preventDefault();

        // Basic validation
        if (!stateName.trim() || !district.trim()) {
            setError('Please fill out both state and district fields.');
            return;
        }

        setLoading(true);
        setError('');
        setMarketData([]); // Clear previous results

        // --- Start of modified fetch logic to handle pagination ---
        const apiKey = "579b464db66ec23bdd000001a5b2a555ad6443d364f5e4439b9ff113";
       const baseUrl = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";
         
        let allFetchedRecords = [];
        let offset = 0;
        const limit = 1000;
        let fetchErrorOccurred = false;

        while (true) {
            const apiUrl = `${baseUrl}?api-key=${apiKey}&format=json&limit=${limit}&offset=${offset}&filters[state]=${stateName}&filters[district]=${district}`;

            try {
                const res = await fetch(apiUrl);
                if (!res.ok) {
                    throw new Error(`Network response was not ok (status: ${res.status})`);
                }
                const finalResp = await res.json();

                const newRecords = finalResp.records;

                // If the API returns no more records, we've fetched everything.
                if (!newRecords || newRecords.length === 0) {
                    break; // Exit the loop
                }

                // Add the newly fetched records and prepare for the next page.
                allFetchedRecords = allFetchedRecords.concat(newRecords);
                offset += limit;

            } catch (fetchError) {
                console.error("Fetch Error during pagination:", fetchError);
                setError('Failed to fetch data. The API might be down or your request could not be processed. Please try again later.');
                fetchErrorOccurred = true;
                break; // Exit loop on error
            }
        }

        setLoading(false);

        if (!fetchErrorOccurred) {
            if (allFetchedRecords.length > 0) {
                setMarketData(allFetchedRecords);
            } else {
                setError('No market data found for the specified location. Please check your spelling or try another location.');
            }
        }
        // --- End of modified fetch logic ---
    };

    return (
        <div className="bg-light" style={{ minHeight: '100vh' }}>
            <NavScrollExample />
          
            <InputMarInfo 
                stateName={stateName}
                setStateName={setStateName}
                district={district}
                setDistrict={setDistrict}
                handleSubmit={handleSubmit}
                loading={loading}
            />
    
            <Container>
                {/* Show error message if any */}
                {error && <Alert variant="danger">{error}</Alert>}

                {/* Show results only if there is data */}
                {marketData.length > 0 && (
                    <Row xs={1} md={2} lg={3} className="g-4">
                        {marketData.map((record, index) => (
                            // Use a more robust key, like a combination of fields if 'id' is not unique
                            <Col key={`${record.market}-${record.commodity}-${index}`}>
                                <Carditem record={record} />
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>

            <Footer />
        </div>
    );
}

// Export the main component. You can rename the file to MLR.js or whatever you prefer.
export default MarketRate;
