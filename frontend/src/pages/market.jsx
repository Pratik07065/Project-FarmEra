import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavScrollExample from '../navbar';

const Market = () => {
  const [activeSection, setActiveSection] = useState('All_Info');
  const [allData, setAllData] = useState([]);

  // Initial States for resetting
  const initialFarmerState = { Name: '', farmerId: '', contact: '', emailId: '', product: '', quantity: '', price: '' };
  const initialMerchantState = { Name: '', merchantId: '', contact: '', emailId: '', product: '', quantity: '', price: '' };

  const [farmerForm, setFarmerForm] = useState(initialFarmerState);
  const [merchantForm, setMerchantForm] = useState(initialMerchantState);

  const API_URL = "http://127.0.0.1:5000";

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/all_info`);
      setAllData(res.data);
    } catch (err) {
      console.error("Backend not connected or /all_info route missing.");
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
      setFarmerForm(initialFarmerState);
    } catch (err) { alert("Error connecting to Backend"); }
  };

  const handleMerchantSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/merchant`, merchantForm);
      alert("Merchant Data Submitted!");
      fetchData();
      setActiveSection('All_Info');
      setMerchantForm(initialMerchantState);
    } catch (err) { alert("Error connecting to Backend"); }
  };

  return (
    <div>
      <NavScrollExample />
      <div className="market-module bg-light" style={{ minHeight: '100vh' }}>
        <Container className="py-5">
          <div className="text-center mb-5">
            <h2 className="mb-4 fw-bold text-uppercase">Market Place</h2>
            <div className="d-flex justify-content-center gap-3">
              <Button variant={activeSection === 'All_Info' ? 'primary' : 'outline-primary'} onClick={() => setActiveSection('All_Info')}>All Information</Button>
              <Button variant={activeSection === 'Farmer_Info' ? 'success' : 'outline-success'} onClick={() => setActiveSection('Farmer_Info')}>Farmer Entry</Button>
              <Button variant={activeSection === 'Merchant_Info' ? 'info' : 'outline-info'} onClick={() => setActiveSection('Merchant_Info')}>Merchant Entry</Button>
            </div>
          </div>

          {/* DASHBOARD */}
          {activeSection === 'All_Info' && (
            <Row>
              {allData.length > 0 ? allData.map((item, index) => (
                <Col md={4} key={index} className="mb-4">
                  <Card className="shadow-sm border-0 h-100">
                    <div style={{ height: '5px' }} className={item.farmerId ? 'bg-success' : 'bg-info'}></div>
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="mb-0 fw-bold">{item.Name}</h5>
                        <span className={`badge ${item.farmerId ? 'bg-success' : 'bg-info text-dark'}`}>
                          {item.farmerId ? 'Farmer' : 'Merchant'}
                        </span>
                      </div>
                      <Card.Text className="text-muted small">
                        <hr />
                        <strong>Product:</strong> {item.product}<br />
                        <strong>Quantity:</strong> {item.quantity}<br />
                        <strong>Price:</strong> {item.price}<br />
                        <strong>Contact:</strong> {item.contact}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              )) : <Col className="text-center py-5"><p>No records found.</p></Col>}
            </Row>
          )}

          {/* FARMER FORM */}
          {activeSection === 'Farmer_Info' && (
            <Row className="justify-content-center">
              <Col md={6}>
                <Card className="p-4 shadow border-0">
                  <h4 className="text-success mb-4 text-center">Farmer Entry</h4>
                  <Form onSubmit={handleFarmerSubmit}>
                    <Form.Group className="mb-2"><Form.Label>Name</Form.Label><Form.Control value={farmerForm.Name} required onChange={e => setFarmerForm({ ...farmerForm, Name: e.target.value })} /></Form.Group>
                    <Form.Group className="mb-2"><Form.Label>Farmer ID</Form.Label><Form.Control value={farmerForm.farmerId} required onChange={e => setFarmerForm({ ...farmerForm, farmerId: e.target.value })} /></Form.Group>
                    <Form.Group className="mb-2"><Form.Label>Contact</Form.Label><Form.Control value={farmerForm.contact} onChange={e => setFarmerForm({ ...farmerForm, contact: e.target.value })} /></Form.Group>
                    <Form.Group className="mb-2"><Form.Label>Email</Form.Label><Form.Control value={farmerForm.emailId} onChange={e => setFarmerForm({ ...farmerForm, emailId: e.target.value })} /></Form.Group>
                    <Form.Group className="mb-2"><Form.Label>Product</Form.Label><Form.Control value={farmerForm.product} onChange={e => setFarmerForm({ ...farmerForm, product: e.target.value })} /></Form.Group>
                    <Form.Group className="mb-2"><Form.Label>Quantity</Form.Label><Form.Control value={farmerForm.quantity} onChange={e => setFarmerForm({ ...farmerForm, quantity: e.target.value })} /></Form.Group>
                    <Form.Group className="mb-3"><Form.Label>Price</Form.Label><Form.Control value={farmerForm.price} onChange={e => setFarmerForm({ ...farmerForm, price: e.target.value })} /></Form.Group>
                    <div className="d-flex gap-2">
                      <Button variant="success" type="submit" className="w-100">Save Farmer</Button>
                      <Button variant="secondary" type="button" onClick={() => setFarmerForm(initialFarmerState)}>Reset</Button>
                    </div>
                  </Form>
                </Card>
              </Col>
            </Row>
          )}

          {/* MERCHANT FORM */}
          {activeSection === 'Merchant_Info' && (
            <Row className="justify-content-center">
              <Col md={6}>
                <Card className="p-4 shadow border-0">
                  <h4 className="text-info mb-4 text-center">Merchant Entry</h4>
                  <Form onSubmit={handleMerchantSubmit}>
                    <Form.Group className="mb-2"><Form.Label>Name</Form.Label><Form.Control value={merchantForm.Name} required onChange={e => setMerchantForm({ ...merchantForm, Name: e.target.value })} /></Form.Group>
                    <Form.Group className="mb-2"><Form.Label>Merchant ID</Form.Label><Form.Control value={merchantForm.merchantId} required onChange={e => setMerchantForm({ ...merchantForm, merchantId: e.target.value })} /></Form.Group>
                    <Form.Group className="mb-2"><Form.Label>Contact</Form.Label><Form.Control value={merchantForm.contact} onChange={e => setMerchantForm({ ...merchantForm, contact: e.target.value })} /></Form.Group>
                    <Form.Group className="mb-2"><Form.Label>Email</Form.Label><Form.Control value={merchantForm.emailId} onChange={e => setMerchantForm({ ...merchantForm, emailId: e.target.value })} /></Form.Group>
                    <Form.Group className="mb-2"><Form.Label>Product</Form.Label><Form.Control value={merchantForm.product} onChange={e => setMerchantForm({ ...merchantForm, product: e.target.value })} /></Form.Group>
                    <Form.Group className="mb-2"><Form.Label>Quantity</Form.Label><Form.Control value={merchantForm.quantity} onChange={e => setMerchantForm({ ...merchantForm, quantity: e.target.value })} /></Form.Group>
                    <Form.Group className="mb-3"><Form.Label>Price</Form.Label><Form.Control value={merchantForm.price} onChange={e => setMerchantForm({ ...merchantForm, price: e.target.value })} /></Form.Group>
                    <div className="d-flex gap-2">
                      <Button variant="info" type="submit" className="w-100">Save Merchant</Button>
                      <Button variant="secondary" type="button" onClick={() => setMerchantForm(initialMerchantState)}>Reset</Button>
                    </div>
                  </Form>
                </Card>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    </div>
  );
};

export default Market;