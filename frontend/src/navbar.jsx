import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import logo from "./components/Logo.png"
import { Link } from 'react-router-dom';

function NavScrollExample() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary ">
      <Container fluid>
        <Navbar.Brand href={logo}>
          <img
            alt="Logo"
            src={logo}
            width="38"
            height="38"
            className="d-inline-block align-top me-2 " // me-2 adds space between the logo and text
          />
          <span className='fw-semibold'>Crop Yield Predictor</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="ms-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll>
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link}to="/yield-prediction">Yield Predictor</Nav.Link>
            <Nav.Link as={Link} to="/market-rate">Live Rate</Nav.Link>
            <Nav.Link as={Link} to="/rate-predictor">Rate Predictor</Nav.Link>
            <Nav.Link as={Link} to="/chatbot">Chatbot</Nav.Link>
            <Nav.Link as={Link} to="/market">Market</Nav.Link>
            {/* <Nav.Link href="#action5">Log/Reg</Nav.Link> */}
            <Button variant="outline-info" size='sm'>Log/Reg</Button>
          </Nav>
          {/* <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form> */}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavScrollExample;