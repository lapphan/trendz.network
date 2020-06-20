/**
 *
 * Footer
 *
 */

import React from 'react';
//import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTwitter,
  faFacebook,
  faInstagram,
} from '@fortawesome/free-brands-svg-icons';

import {
  Button,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
  UncontrolledTooltip,
} from 'reactstrap';

function Footer() {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col md="3">
            <h2 className="title">Trendz•Network</h2>
          </Col>
          <Col md="3">
            <Nav>
              <NavItem>
                <NavLink>
                  Home
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink>
                  Landing
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink>
                  Register
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink>
                  Profile
                </NavLink>
              </NavItem>
            </Nav>
          </Col>
          <Col md="3">
            <Nav>
              <NavItem>
                <NavLink href="#">Contact Us</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#">About Us</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#">Blog</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="https://opensource.org/licenses/MIT">
                  License
                </NavLink>
              </NavItem>
            </Nav>
          </Col>
          <Col md="3">
            <h3 className="title">Follow us:</h3>
            <div className="btn-wrapper profile">
              <Button
                className="btn-icon btn-neutral btn-round btn-simple"
                color="default"
                href="#"
                id="tooltip622135962"
                target="_blank"
              >
                <i className="fab">
                  <FontAwesomeIcon icon={faTwitter} />{' '}
                </i>
              </Button>
              <UncontrolledTooltip delay={0} target="tooltip622135962">
                Follow us
              </UncontrolledTooltip>
              <Button
                className="btn-icon btn-neutral btn-round btn-simple"
                color="default"
                href="#"
                id="tooltip230450801"
                target="_blank"
              >
                <i className="fab">
                  <FontAwesomeIcon icon={faFacebook} />{' '}
                </i>
              </Button>
              <UncontrolledTooltip delay={0} target="tooltip230450801">
                Like us
              </UncontrolledTooltip>
              <Button
                className="btn-icon btn-neutral btn-round btn-simple"
                color="default"
                href="#"
                id="tooltip318450378"
                target="_blank"
              >
                <i className="fab">
                  <FontAwesomeIcon icon={faInstagram} />{' '}
                </i>
              </Button>
              <UncontrolledTooltip delay={0} target="tooltip318450378">
                Follow us
              </UncontrolledTooltip>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

// Footer.defaultProps = {
//   // links: [],
//   // onSubmit: e => e.preventDefault(),
// };
// Footer.propTypes = {
//   // links: PropTypes.array,
//   // onSubmit: PropTypes.func,
// };

export default Footer;
