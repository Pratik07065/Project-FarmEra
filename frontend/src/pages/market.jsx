import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Navbar } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '../common/footer';
import NavScrollExample from '../navbar';

const Market = () => {
  const [activeSection, setActiveSection] = useState('All_Info');
  const [allData, setAllData] = useState([]);

  // Form States
  const [farmerForm, setFarmerForm] = useState({ name: '', farmer_id: '', address: '', contact: '', email: '', product: '', quantity: '', price: '' });
  const [merchantForm, setMerchantForm] = useState({ name: '', merchant_id: '', address: '', contact: '', email: '', product: '', quantity: '', price: '' });

  const API_URL = "http://127.0.0.1:5000/api";

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/all_info`);
      setAllData(res.data);
    } catch (err) {
      console.error("Backend not connected. Check if Flask is running.");
    }
  };

  useEffect(() => {
    fetchData();
    
  }, []);

  const handleFarmerSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/farmer`, farmerForm);
      alert("Farmer Data Submitted!");
      fetchData();
      setActiveSection('All_Info');
    } catch (err) { alert("Error connecting to Backend"); }
  };

  const handleMerchantSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:5000/api/merchant', merchantForm);
      alert("Merchant Data Submitted!");
      fetchData();
      setActiveSection('All_Info');
    } catch (err) { alert("Error connecting to Backend"); }
  };

  return (
    <div className="market-module bg-light">
      <NavScrollExample />
      <Container className="py-5">

        {/* DASHBOARD TOGGLE BUTTONS */}
        <div className="text-center mb-5">
          <h2 className="mb-4 fw-bold">Market Place</h2>
          <div className="d-flex justify-content-center gap-3">
            <Button
              variant={activeSection === 'All_Info' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveSection('All_Info')}
              className="px-4 py-2 shadow-sm"
            >
              All Information
            </Button>
            <Button
              variant={activeSection === 'Farmer_Info' ? 'success' : 'outline-success'}
              onClick={() => setActiveSection('Farmer_Info')}
              className="px-4 py-2 shadow-sm"
            >
              Farmer Entry
            </Button>
            <Button
              variant={activeSection === 'Merchant_Info' ? 'info' : 'outline-info'}
              onClick={() => setActiveSection('Merchant_Info')}
              className="px-4 py-2 shadow-sm text-dark"
            >
              Merchant Entry
            </Button>
          </div>
        </div>

        {/* SECTION 1: ALL INFO */}
        {activeSection === 'All_Info' && (
          <Row>
            {allData.length > 0 ? allData.map((item, index) => (
              <Col md={4} key={index} className="mb-4">
                <Card className="shadow-sm border-0 h-100">
                  <div style={{ height: '5px' }} className={item.type === 'Farmer' ? 'bg-success' : 'bg-info'}></div>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="mb-0 fw-bold">{item.name}</h5>
                      <span className={`badge ${item.type === 'Farmer' ? 'bg-success' : 'bg-info text-dark'}`}>{item.type}</span>
                    </div>
                    <Card.Text className="text-muted small">
                      <hr />
                      <strong>Product:</strong> {item.product}<br />
                      <strong>Quantity:</strong> {item.qty}<br />
                      <strong>Price:</strong> {item.price}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            )) : (
              <Col className="text-center py-5">
                <div className="p-5 border rounded bg-white shadow-sm">
                  <p className="text-muted mb-0">No records found in database.</p>
                </div>
              </Col>
            )}
          </Row>
        )}

        {/* SECTION 2: FARMER FORM */}
        {activeSection === 'Farmer_Info' && (
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <Card className="p-4 shadow border-0">
                <h4 className="text-success mb-4 text-center fw-bold">Farmer Information Form</h4>
                <Form onSubmit={handleFarmerSubmit}>
                  <Row className="mb-3">
                    <Form.Group as={Col}><Form.Label>Farmer Name</Form.Label><Form.Control required onChange={e => setFarmerForm({ ...farmerForm, name: e.target.value })} /></Form.Group>
                    <Form.Group as={Col}><Form.Label>Farmer ID</Form.Label><Form.Control required onChange={e => setFarmerForm({ ...farmerForm, farmer_id: e.target.value })} /></Form.Group>
                  </Row>
                  <Form.Group className="mb-3"><Form.Label>Address</Form.Label><Form.Control as="textarea" rows={2} onChange={e => setFarmerForm({ ...farmerForm, address: e.target.value })} /></Form.Group>
                  <Row className="mb-3">
                    <Form.Group as={Col}><Form.Label>Contact</Form.Label><Form.Control onChange={e => setFarmerForm({ ...farmerForm, contact: e.target.value })} /></Form.Group>
                    <Form.Group as={Col}><Form.Label>Email</Form.Label><Form.Control type="email" onChange={e => setFarmerForm({ ...farmerForm, email: e.target.value })} /></Form.Group>
                  </Row>
                  <Form.Group className="mb-3"><Form.Label>Product Available</Form.Label><Form.Control onChange={e => setFarmerForm({ ...farmerForm, product: e.target.value })} /></Form.Group>
                  <Row className="mb-4">
                    <Form.Group as={Col}><Form.Label>Quantity</Form.Label><Form.Control onChange={e => setFarmerForm({ ...farmerForm, quantity: e.target.value })} /></Form.Group>
                    <Form.Group as={Col}><Form.Label>Expected Price</Form.Label><Form.Control onChange={e => setFarmerForm({ ...farmerForm, price: e.target.value })} /></Form.Group>
                  </Row>
                  <Row className="mt-4">
                    <Col><Button variant="success" type="submit" className="w-100 py-2 fw-bold shadow-sm">Save Farmer Record</Button></Col>
                    <Col xs="auto"><Button variant="secondary" type="reset" className="px-4 py-2 fw-bold shadow-sm">Reset</Button></Col>
                  </Row>
                </Form>
              </Card>
            </Col>
          </Row>
        )}

        {/* SECTION 3: MERCHANT FORM */}
        {activeSection === 'Merchant_Info' && (
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <Card className="p-4 shadow border-0">
                <h4 className="text-info mb-4 text-center fw-bold text-dark">Merchant Requirement Form</h4>
                <Form onSubmit={handleMerchantSubmit}>
                  <Row className="mb-3">
                    <Form.Group as={Col}><Form.Label>Merchant Name</Form.Label><Form.Control required onChange={e => setMerchantForm({ ...merchantForm, name: e.target.value })} /></Form.Group>
                    <Form.Group as={Col}><Form.Label>Merchant ID</Form.Label><Form.Control required onChange={e => setMerchantForm({ ...merchantForm, merchant_id: e.target.value })} /></Form.Group>
                  </Row>
                  <Form.Group className="mb-3"><Form.Label>Address</Form.Label><Form.Control as="textarea" rows={2} onChange={e => setMerchantForm({ ...merchantForm, address: e.target.value })} /></Form.Group>
                  <Row className="mb-3">
                    <Form.Group as={Col}><Form.Label>Contact</Form.Label><Form.Control onChange={e => setMerchantForm({ ...merchantForm, contact: e.target.value })} /></Form.Group>
                    <Form.Group as={Col}><Form.Label>Email</Form.Label><Form.Control type="email" onChange={e => setMerchantForm({ ...merchantForm, email: e.target.value })} /></Form.Group>
                  </Row>
                  <Form.Group className="mb-3"><Form.Label>Product Required</Form.Label><Form.Control onChange={e => setMerchantForm({ ...merchantForm, product: e.target.value })} /></Form.Group>
                  <Row className="mb-4">
                    <Form.Group as={Col}><Form.Label>Quantity Needed</Form.Label><Form.Control onChange={e => setMerchantForm({ ...merchantForm, quantity: e.target.value })} /></Form.Group>
                    <Form.Group as={Col}><Form.Label>Target Price</Form.Label><Form.Control onChange={e => setMerchantForm({ ...merchantForm, price: e.target.value })} /></Form.Group>
                  </Row>
                  <Row className="mt-4">
                    <Col><Button variant="info" type="submit" className="w-100 py-2 fw-bold shadow-sm text-dark">Save Merchant Record</Button></Col>
                    <Col xs="auto"><Button variant="secondary" type="reset" className="px-4 py-2 fw-bold shadow-sm">Reset</Button></Col>
                  </Row>
                </Form>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
      <Footer />
    </div>
  );
};

export default Market;