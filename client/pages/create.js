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
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import axios from "axios";

import Datetime from "react-datetime";

let ps = null;

const Create = () => {
  const { state } = useAuth();

  const [campaignState, setCampaign] = useState({
    title: "",
    content: "",
    picture: null,
    status: true,
    user: state.user.id,
    category: null,
    channels: null,
    campaignTTL: {
      open_datime: new Date(),
      close_datetime: new Date(),
    },
  });

  //TODO: useEffect to get categories, fetch channels based on category chosed 
  //handleCategoryChange() and handleChannelChange() bind directly to campaignState
  //mutate handleSubmitCampaign

  const [picture, setPicture] = useState({
    file: null,
    loading: false,
    submmited: false,
  });

  const handleCampaignChange = (event) => {
    const { name, value } = event.target;
    setCampaign((previousState) => {
      return { ...previousState, [name]: value };
    });
  };

  const handleStartDateChange = (event) => {
    if (event._d !== undefined) {
      const value = event._d;
      setCampaign((previousState) => {
        return { ...previousState, 
          campaignTTL:{
            open_datime: value,
            close_datetime: previousState.campaignTTL.close_datetime 
          }
        };
      });
    } else return;
  };

  const handleEndDateChange = (event) => {
    if (event._d !== undefined) {
      const value = event._d;
      setCampaign((previousState) => {
        return { ...previousState, 
          campaignTTL:{
            open_datime: previousState.campaignTTL.open_datime,
            close_datetime: value 
          }
        };
      });
    } else return;
  };

  const handleImageChange = (event) => {
    setPicture({
      file: event.target.files[0],
      submmited: false,
    });
  };

  const handleRadioChange = (event) => {
    const status = event.currentTarget.value === 'true' ? true:false
    setCampaign((previousState) => {
      return { ...previousState, status };
    });
  };

  // async function fetchCategory(state) {
  //   const { API_URL } = process.env;

  //   const requestOptions = {
  //     method: "GET",
  //     headers: {
  //       Authorization: `Bearer ${state.jwt}`,
  //     },
  //   };

  //   const res = await fetch(`${API_URL}/users/me`, requestOptions);
  //   const user = await res.json();
  //   setUser()
  //   return console.log(user);
  // }

  const handleImageSubmit = async (event) => {
    event.preventDefault();
    setPicture((previousState) => {
      return {
        ...previousState,
        loading: true,
      };
    });

    const data = new FormData();
    data.append("files", picture.file);
    const { API_URL } = process.env;
    const upload_resolve = await axios({
      method: "POST",
      headers: {
        Authorization: `Bearer ${state.jwt}`,
      },
      url: `${API_URL}/upload`,
      data,
    });
    setPicture((previousState) => {
      return {
        ...previousState,
        loading: false,
        submmited: true,
      };
    });
    setCampaign((previousState) => {
      return { ...previousState, picture: upload_resolve.data[0].id };
    });
  };

  const handleCampaignSubmit = () => {
    console.log(campaignState)
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
    document.body.classList.toggle("create-page");
    return () => {
      if (navigator.platform.indexOf("Win") > 1) {
        ps.destroy();
        document.documentElement.className += " perfect-scrollbar-off";
        document.documentElement.classList.remove("perfect-scrollbar-on");
      }
      document.body.classList.toggle("create-page");
    };
  });

  useEffect(() => {
    if (state.jwt === "") Router.push("/login");
  }, [state]);

  if (state.jwt !== "")
    return (
      <Layout>
        <div className="wrapper">
          <div className="main">
            <Container>
              <Card>
                <CardHeader>
                  <h3 className="title">Tạo campaign</h3>
                </CardHeader>
                <CardBody>
                  <form>
                    <FormGroup>
                      <Label for="title">Tiêu đề</Label>
                      <Input
                        type="text"
                        id="title"
                        name="title"
                        onChange={handleCampaignChange}
                        value={campaignState.title}
                        placeholder="Tiêu đề"
                        required
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="content">Nội dung</Label>
                      <Input
                        type="textarea"
                        id="content"
                        placeholder="Nội dung..."
                        name="content"
                        onChange={handleCampaignChange}
                        value={campaignState.content}
                        required
                      />
                    </FormGroup>
                    <div className="form-row">
                      <FormGroup className="col-md-4">
                        <Label for="startDate">Chọn Ngày bắt đầu</Label>
                        <Datetime
                          onChange={handleStartDateChange}
                          value={campaignState.campaignTTL.open_datime}
                          required
                        />
                      </FormGroup>
                      <FormGroup className="col-md-4">
                        <Label for="endDate">Chọn Ngày kết thúc</Label>
                        <Datetime
                          onChange={handleEndDateChange}
                          value={campaignState.campaignTTL.close_datetime}
                          required
                        />
                      </FormGroup>
                    </div>
                    <div className="FileUpload">
                      <form onSubmit={handleImageSubmit}>
                        <Label for="picture">Chọn ảnh...</Label>
                        <br />
                        <input type="file" onChange={handleImageChange} />
                        <Button>Tải lên</Button>
                      </form>
                      {picture.loading ? <p>Đang tải lên...</p> : null}
                    </div>
                    {picture.submmited ? <p>Đã tải lên!</p> : <p></p>}
                    <br />
                    <div className="form-row">
                      <FormGroup className="col-md-4">
                        <Label for="channel">Chọn Danh mục</Label>
                        <br />
                        <UncontrolledDropdown group>
                          <DropdownToggle
                            caret
                            color="secondary"
                            data-toggle="dropdown"
                            className="mydropdown"
                          >
                            Choose...
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem>Action</DropdownItem>
                            <DropdownItem>Another Action</DropdownItem>
                            <DropdownItem>Something else here</DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </FormGroup>
                      <FormGroup className="col-md-4">
                        <Label for="channel">Chọn Kênh</Label>
                        <br />
                        <UncontrolledDropdown group>
                          <DropdownToggle
                            caret
                            color="secondary"
                            data-toggle="dropdown"
                          >
                            Choose...
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem>Action</DropdownItem>
                            <DropdownItem>Another Action</DropdownItem>
                            <DropdownItem>Something else here</DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </FormGroup>
                    </div>
                    <div className="form-row">
                      <FormGroup check inline className="form-check-radio">
                        <Label className="form-check-label">
                          <Input
                            type="radio"
                            name="status"
                            id="status"
                            value="true"
                            checked={campaignState.status === true}
                            onChange={handleRadioChange}
                          />
                          Active<span className="form-check-sign"></span>
                        </Label>
                      </FormGroup>
                      <FormGroup check inline className="form-check-radio">
                        <Label className="form-check-label">
                          <Input
                            type="radio"
                            name="status"
                            id="status"
                            value="false"
                            checked={campaignState.status===false}
                            onChange={handleRadioChange}
                            />
                            Inactive
                          <span className="form-check-sign"></span>
                        </Label>
                      </FormGroup>
                    </div>
                  </form>
                  <div className="form-button">
                    <Button className="btn-neutral" color="primary">
                      Hủy
                    </Button>
                    <Button color="primary" onClick={handleCampaignSubmit}>
                      Tạo
                    </Button>
                  </div>
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
