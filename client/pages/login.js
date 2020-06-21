import React, { useEffect, useState } from "react";
import classnames from "classnames";

import Layout from "../components/layout";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardImg,
  CardTitle,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
} from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faEnvelope, faLock} from '@fortawesome/free-solid-svg-icons'

// core components
//import ExamplesNavbar from "components/Navbars/ExamplesNavbar.js";

const LoginPage = () => {
  const [pointer, setPointer] = useState({
    squares1to6: "",
    squares7and8: "",
  });

  const [focus, setFocus] = useState({
    emailFocus: false,
    passwordFocus: false,
  });

  const followCursor = (event) => {
    let posX = event.clientX - window.innerWidth / 2;
    let posY = event.clientY - window.innerWidth / 6;

    setPointer((previousState) => {
      return {
        ...previousState,
        squares1to6:
          "perspective(500px) rotateY(" +
          posX * 0.05 +
          "deg) rotateX(" +
          posY * -0.05 +
          "deg)",
        squares7and8:
          "perspective(500px) rotateY(" +
          posX * 0.02 +
          "deg) rotateX(" +
          posY * -0.02 +
          "deg)",
      };
    });
  };

  useEffect(() => {
    document.body.classList.toggle("register-page");
    document.documentElement.addEventListener("mousemove", followCursor);
    return () => {
      document.body.classList.toggle("register-page");
      document.documentElement.removeEventListener("mousemove", followCursor);
    };
  }, []);

  return (
    <Layout>
      <div className="wrapper">
        <div className="page-header">
          <div className="page-header-image" />
          <div className="content">
            <Container>
              <Row>
                <Col className="offset-lg-0 offset-md-3" lg="5" md="6">
                  <div
                    className="square square-7"
                    id="square7"
                    style={{ transform: pointer.squares7and8 }}
                  />
                  <div
                    className="square square-8"
                    id="square8"
                    style={{ transform: pointer.squares7and8 }}
                  />
                  <Card className="card-register">
                    <CardHeader>
                      <CardImg
                        alt="..."
                        src={require("../assets/img/square-purple-1.png")}
                      />
                      <CardTitle tag="h4">Đăng nhập</CardTitle>
                    </CardHeader>
                    <CardBody>
                      <Form className="form">
                        <InputGroup
                          className={classnames({
                            "input-group-focus": focus.emailFocus,
                          })}
                        >
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                            <i className="tim-icons">
                              <FontAwesomeIcon icon={faEnvelope} />
                                </i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            placeholder="Email"
                            type="text"
                            onFocus={(event) =>
                              setFocus((previousState) => {
                                return {
                                  ...previousState,
                                  emailFocus: true,
                                };
                              })
                            }
                            onBlur={(event) =>
                              setFocus((previousState) => {
                                return {
                                  ...previousState,
                                  emailFocus: false,
                                };
                              })
                            }
                          />
                        </InputGroup>
                        <InputGroup
                          className={classnames({
                            "input-group-focus": focus.passwordFocus,
                          })}
                        >
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="tim-icons">
                              <FontAwesomeIcon icon={faLock} />
                                </i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            placeholder="Mật khẩu"
                            type="password"
                            onFocus={(event) =>
                              setFocus((previousState) => {
                                return {
                                  ...previousState,
                                  passwordFocus: true,
                                };
                              })
                            }
                            onBlur={(event) =>
                              setFocus((previousState) => {
                                return {
                                  ...previousState,
                                  passwordFocus: false,
                                };
                              })
                            }
                          />
                        </InputGroup>
                      </Form>
                    </CardBody>
                    <CardFooter>
                      <Button className="btn-round" color="primary" size="lg">
                        Đăng nhập
                      </Button>
                    </CardFooter>
                  </Card>
                </Col>
              </Row>
              <div className="register-bg" />
              <div
                className="square square-1"
                id="square1"
                style={{ transform: pointer.squares1to6 }}
              />
              <div
                className="square square-2"
                id="square2"
                style={{ transform: pointer.squares1to6 }}
              />
              <div
                className="square square-3"
                id="square3"
                style={{ transform: pointer.squares1to6 }}
              />
              <div
                className="square square-4"
                id="square4"
                style={{ transform: pointer.squares1to6 }}
              />
              <div
                className="square square-5"
                id="square5"
                style={{ transform: pointer.squares1to6 }}
              />
              <div
                className="square square-6"
                id="square6"
                style={{ transform: pointer.squares1to6 }}
              />
            </Container>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
