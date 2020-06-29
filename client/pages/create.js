import React, { useEffect, useState, useContext } from "react";
import Layout from "../components/layout";
import { useAuth } from "../context/userContext";
import Router from "next/router";
import PerfectScrollbar from "perfect-scrollbar";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Label,
  FormGroup,
  Input,
  Container,
} from "reactstrap";

import Datetime from "react-datetime";

let ps = null;

const Create = () => {
  const { state } = useAuth();

  const [startDate, setStartDate] = useState({
    date: new Date(),
  });

  const [endDate, setEndDate] = useState({
    date: new Date(),
  });

  const handleStartDateChange = (event) => {
    console.log(event)
    const { _d } = event.target;
    setStartDate((previousState) => {
      return { ...previousState, date: _d };
    });
  };

  const handleEndDateChange = (event) => {
    console.log(event)
    const { value } = event._d;
    setEndDate((previousState) => {
      return { ...previousState, date: value };
    });
  };

  //const [user, setUser] = useState()

  // async function fetchUser(state) {
  //   const { API_URL } = process.env;

  //   const requestOptions = {
  //     method: "GET",
  //     headers: {
  //       Authorization: `Bearer ${state.jwt}`,
  //     },
  //   };

  //   const res = await fetch(`${API_URL}/users/me`, requestOptions);
  //   const user = await res.json();
  //   // setUser()
  //   return console.log(user);
  // }

  // useEffect(() => {
  //   fetchUser(state);
  // }, [state]);

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
              <Card>
                <CardHeader>
                  <h3 className="title">Tạo campaign</h3>
                </CardHeader>
                <CardBody>
                  <form>
                    <FormGroup>
                      <Label for="title">Tiêu đề</Label>
                      <Input type="text" id="title" placeholder="Tiêu đề" />
                    </FormGroup>
                    <FormGroup>
                      <Label for="content">Nội dung</Label>
                      <Input
                        type="textarea"
                        id="content"
                        placeholder="Nội dung..."
                      />
                    </FormGroup>
                    <div className="form-row">
                      <FormGroup className="col-md-4">
                        <Label for="startDate">Chọn Ngày bắt đầu</Label>
                        <Datetime
                          onChange={handleStartDateChange}
                          value={startDate.date}
                        />
                      </FormGroup>
                      <FormGroup className="col-md-4">
                        <Label for="endDate">Chọn Ngày kết thúc</Label>
                        <Datetime
                          onChange={handleEndDateChange}
                          value={endDate.date}
                        />
                      </FormGroup>
                    </div>
                    <FormGroup>
                      <Button>
                        <Label for="picture">Ảnh</Label>
                        <Input type="file" id="picture" />
                      </Button>
                    </FormGroup>
                    <div className="form-row">
                      <FormGroup className="col-md-4">
                        <Label for="category">Chọn Danh mục</Label>
                        <Input type="select" name="select" id="category">
                          <option>Choose...</option>
                          <option>...</option>
                        </Input>
                      </FormGroup>
                      <FormGroup className="col-md-4">
                        <Label for="channel">Chọn Kênh</Label>
                        <Input type="select" name="select" id="channel">
                          <option>Choose...</option>
                          <option>...</option>
                        </Input>
                      </FormGroup>
                    </div>
                    <div className="form-row">
                      <FormGroup check inline className="form-check-radio">
                        <Label className="form-check-label">
                          <Input
                            type="radio"
                            name="exampleRadios1"
                            id="exampleRadios11"
                            value="active"
                            defaultChecked
                          />
                          Active<span className="form-check-sign"></span>
                        </Label>
                      </FormGroup>
                      <FormGroup check inline className="form-check-radio">
                        <Label className="form-check-label">
                          <Input
                            type="radio"
                            name="exampleRadios1"
                            id="exampleRadios12"
                            value="inactive"
                          />
                          Inactive<span className="form-check-sign"></span>
                        </Label>
                      </FormGroup>
                    </div>
                    <div className="form-button">
                      <Button className="btn-neutral" color="primary">
                        Hủy
                      </Button>
                      <Button type="submit" color="primary">
                        Tạo
                      </Button>
                    </div>
                  </form>
                </CardBody>
              </Card>
            </Container>
          </div>
        </div>
      </Layout>
    );
  else return null;
};

export default Create;
