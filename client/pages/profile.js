import React, { useEffect, useState, useContext } from "react";
import dynamic from "next/dynamic";
const Layout = dynamic(() => import("../components/layout"));
import Datetime from "react-datetime";
import classnames from "classnames";
import { useAuth, UserContext } from "../context/userContext";
import Router from "next/router";
import PerfectScrollbar from "perfect-scrollbar";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Label,
  FormGroup,
  Form,
  Input,
  FormText,
  NavItem,
  NavLink,
  Nav,
  Table,
  TabContent,
  TabPane,
  Container,
  Row,
  Col,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

let ps = null;

const Profile = () => {
  const { state } = useAuth();
  const [tabState, setTab] = useState({
    tabs: 1,
  });

  const [user, setUser] = useState({
    fullName: "",
    address: "",
    gender: "",
    contact: "",
    dob: "",
  });

  const [userUpdate, setUserUpdate] = useState({
    fullName: "",
    address: "",
    gender: "",
    contact: "",
    dob: "",
  });

  async function fetchUser(state) {
    // const { API_URL } = process.env;
    // const requestOptions = {
    //   method: "GET",
    //   headers: {
    //     Authorization: `Bearer ${state.jwt}`,
    //   },
    // };
    // const res = await fetch(`${API_URL}/users/me`, requestOptions);
    // const user = await res.json();
    // setUser()
    //return console.log(user);
  }

  const [date] = useState(Datetime.moment().subtract(15 , "year"));
  var validBirthDay = function (current) {
    return current.isBefore(date);
  };

  const handleBirthdayChange = (event) => {
    if (event._d !== undefined) {
      const value = event._d.toISOString();
      setUserUpdate((previousState) => {
        return {
          ...previousState,
          dob: value,
        };
      });
    } else return;
  };

  const handleUserChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setUserUpdate((previousState) => {
      return {
        ...previousState,
        [name]: value,
      };
    });
  };

  const updateUser = () => {
    //TODO: POST method to update user
    setUser((previousState) => {
      return {
        ...previousState,
        fullName: userUpdate.fullName,
        address: userUpdate.address,
        gender: userUpdate.gender,
        contact: userUpdate.contact,
        dob: userUpdate.dob,
      };
    });
  };

  useEffect(() => {
    fetchUser(state);
  }, [state]);

  const toggleTabs = (event, stateName, index) => {
    event.preventDefault();
    setTab((previousState) => {
      return {
        ...previousState,
        [stateName]: index,
      };
    });
  };

  useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      document.documentElement.className += " perfect-scrollbar-on";
      document.documentElement.classList.remove("perfect-scrollbar-off");
      let tables = document.querySelectorAll(".table-responsive");
      for (let i = 0; i < tables.length; i++) {
        ps = new PerfectScrollbar(tables[i]);
      }
    }
    document.body.classList.toggle("profile-page");
    return () => {
      if (navigator.platform.indexOf("Win") > 1) {
        ps.destroy();
        document.documentElement.className += " perfect-scrollbar-off";
        document.documentElement.classList.remove("perfect-scrollbar-on");
      }
      document.body.classList.toggle("profile-page");
    };
  });

  useEffect(() => {
    if (state.jwt === "") Router.push("/login");
  }, [state]);

  if (state.jwt !== "")
    return (
      <Layout>
        <div className="wrapper">
          <div className="page-header">
            <Container>
              <Card className="card-coin card-plain">
                <CardHeader>
                  <img
                    className="img-center img-fluid rounded-circle"
                    src="/256x186.svg"
                    height="100"
                  />
                  <h3 className="title">{state.user.username}</h3>
                  {/* <p className="title">(nút đổi ảnh đại diện)</p> */}
                </CardHeader>
                <CardBody>
                  <Nav className="nav-tabs-primary justify-content-center" tabs>
                    <NavItem>
                      <NavLink
                        className={classnames({
                          active: tabState.tabs === 1 || tabState.tabs === 3,
                        })}
                        onClick={(event) => toggleTabs(event, "tabs", 1)}
                      >
                        Hồ sơ
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({
                          active: tabState.tabs === 2 || tabState.tabs === 4,
                        })}
                        onClick={(event) => toggleTabs(event, "tabs", 2)}
                      >
                        Tài khoản
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <TabContent
                    className="tab-subcategories"
                    activeTab={"tab" + tabState.tabs}
                  >
                    <TabPane tabId="tab1">
                      <Row>
                        <Label sm="5">Tên</Label>
                        <Col sm="6">
                          <h4>
                            {user.fullName === ""
                              ? "(Vui lòng cập nhật thông tin)"
                              : user.fullName}
                          </h4>
                        </Col>
                      </Row>
                      <Row>
                        <Label sm="5">Ngày sinh</Label>
                        <Col sm="6">
                          <h4>
                            {user.dob === ""
                              ? "(Vui lòng cập nhật thông tin)"
                              : new Date(user.dob).toLocaleDateString("en-GB")}
                          </h4>
                        </Col>
                      </Row>
                      <Row>
                        <Label sm="5">Số điện thoại</Label>
                        <Col sm="6">
                          <h4>
                            {user.contact === ""
                              ? "(Vui lòng cập nhật thông tin)"
                              : user.contact}
                          </h4>
                        </Col>
                      </Row>
                      <Row>
                        <Label sm="5">Giới tính</Label>
                        <Col sm="6">
                          <h4>
                            {user.gender === ""
                              ? "(Vui lòng cập nhật thông tin)"
                              : user.gender}
                          </h4>
                        </Col>
                      </Row>
                      <Row>
                        <Label sm="5">Địa chỉ</Label>
                        <Col sm="6">
                          <h4>
                            {user.address === ""
                              ? "(Vui lòng cập nhật thông tin)"
                              : user.address}
                          </h4>
                        </Col>
                      </Row>
                      <Button
                        onClick={(event) => toggleTabs(event, "tabs", 3)}
                        className="btn-simple btn-icon btn-round float-right"
                        color="warning"
                      >
                        <i className="tim-icons icon-pencil" />
                      </Button>
                    </TabPane>
                    <TabPane tabId="tab2">
                      <Row>
                        <Label sm="5">Email</Label>
                        <Col sm="6">
                          <h4>thaihieuhuynh1752@gmail.com</h4>
                        </Col>
                      </Row>
                      <Row>
                        <Label sm="5">Mật khẩu</Label>
                        <Col sm="6">
                          <Button
                            className={classnames({
                              active: tabState.tabs === 4,
                            })}
                            onClick={(event) => toggleTabs(event, "tabs", 4)}
                          >
                            Thay đổi mật khẩu
                          </Button>
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="tab3">
                      <Row>
                        <Label sm="5">Tên</Label>
                        <Col sm="4">
                          <FormGroup>
                            <Input
                              name="fullName"
                              value={userUpdate.fullName}
                              type="text"
                              onChange={handleUserChange}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Label sm="5">Ngày sinh</Label>
                        <Col sm="4">
                          <FormGroup>
                            <Datetime
                              onChange={handleBirthdayChange}
                              value={userUpdate.dob.toISOString}
                              required
                              isValidDate={validBirthDay}
                              viewMode="years"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Label sm="5">Số điện thoại</Label>
                        <Col sm="4">
                          <FormGroup>
                            <Input
                              name="contact"
                              value={userUpdate.contact}
                              type="text"
                              onChange={handleUserChange}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Label sm="5">Giới tính</Label>
                        <Col sm="4">
                          <FormGroup>
                            <UncontrolledDropdown group>
                              <DropdownToggle
                                caret
                                data-toggle="dropdown"
                                className="mydropdown"
                              >
                                {userUpdate.gender === ""
                                  ? "Giới tính..."
                                  : userUpdate.gender}
                              </DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem
                                  name="gender"
                                  value="Nam"
                                  onClick={handleUserChange}
                                >
                                  Nam
                                </DropdownItem>
                                <DropdownItem
                                  name="gender"
                                  value="Nữ"
                                  onClick={handleUserChange}
                                >
                                  Nữ
                                </DropdownItem>
                                <DropdownItem
                                  name="gender"
                                  value="Khác"
                                  onClick={handleUserChange}
                                >
                                  Khác
                                </DropdownItem>
                              </DropdownMenu>
                            </UncontrolledDropdown>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Label sm="5">Địa chỉ</Label>
                        <Col sm="4">
                          <FormGroup>
                            <Input
                              name="address"
                              value={userUpdate.address}
                              type="text"
                              onChange={handleUserChange}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Label sm="5"></Label>
                        <Button
                          onClick={(event) => {
                            setUserUpdate(user);
                            toggleTabs(event, "tabs", 1);
                          }}
                        >
                          Hủy
                        </Button>
                        <Button
                          color="primary"
                          onClick={(event) => {
                            updateUser();
                            toggleTabs(event, "tabs", 1);
                          }}
                        >
                          Lưu
                        </Button>
                      </Row>
                    </TabPane>
                    <TabPane tabId="tab4">
                      <Row>
                        <Label sm="5">Mật khẩu mới</Label>
                        <Col sm="4">
                          <FormGroup>
                            <Input type="password" />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Label sm="5">Nhập lại mật khẩu mới</Label>
                        <Col sm="4">
                          <FormGroup>
                            <Input type="password" />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Label sm="5"></Label>
                        <Button
                          onClick={(event) => toggleTabs(event, "tabs", 2)}
                        >
                          Hủy
                        </Button>
                        <Button color="primary" type="submit">
                          Lưu
                        </Button>
                      </Row>
                    </TabPane>
                  </TabContent>
                </CardBody>
              </Card>
            </Container>
          </div>
        </div>
      </Layout>
    );
  else return null;
};

export default Profile;
