import React, { useEffect, useState } from "react";
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
  Form,
} from "reactstrap";

import { CREATE_CAMPAIGN } from "../graphql/mutations/campaign/create";
import { useMutation } from "react-apollo";
import { isEmpty } from "lodash";
import axios from "axios";
import { errorLog } from "../utils/functions/error-log-snackbar";
import Datetime from "react-datetime";

let ps = null;
const { API_URL } = process.env;

const Create = () => {
  const { state } = useAuth();

  const signal = axios.CancelToken.source();

  const [campaignState, setCampaign] = useState({
    title: "",
    content: "",
    picture: [],
    status: true,
    user: state.user.id,
    category: null,
    channels: [],
    open_datetime: new Date().toISOString(),
    close_datetime: new Date().toISOString(),
  });

  const [categories, setCategories] = useState({
    categories: [],
  });

  const [tempData, setTempData] = useState({
    categoryId: "",
    categoryName: "",
    channelId: "",
    channelName: "",
  });

  const [picture, setPicture] = useState({
    file: null,
    loading: false,
    submmited: false,
  });

  const [date, setDate] = useState(Datetime.moment().subtract(1, "day"));
  var valid = function (current) {
    return current.isAfter(date);
  };

  var validStartDate = function (current) {
    return current.isAfter(Datetime.moment().subtract(1, "day"));
  };

  const [requestCreateCampaignMutation] = useMutation(CREATE_CAMPAIGN, {
    variables: campaignState,
  });

  const handleCampaignChange = (event) => {
    const { name, value } = event.target;
    setCampaign((previousState) => {
      return { ...previousState, [name]: value };
    });
  };

  const handleStartDateChange = (event) => {
    if (event._d !== undefined) {
      const value = event._d.toISOString();
      setCampaign((previousState) => {
        return {
          ...previousState,
          open_datetime: value,
        };
      });
      setDate(value);
    } else return;
  };

  const handleEndDateChange = (event) => {
    if (event._d !== undefined) {
      const value = event._d.toISOString();
      setCampaign((previousState) => {
        return {
          ...previousState,
          close_datetime: value,
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
    const status = event.currentTarget.value === "true" ? true : false;
    setCampaign((previousState) => {
      return { ...previousState, status };
    });
  };

  const handleCategoryChange = (id, name) => {
    setCampaign((previousState) => {
      return { ...previousState, category: id };
    });
    setTempData({
      categoryId: id,
      categoryName: name,
      channelId: "",
      channelName: "",
    });
  };

  const handleChannelsChange = (id, name) => {
    setCampaign((previousState) => {
      return { ...previousState, channels: [id] };
    });
    setTempData((previousState) => {
      return {
        ...previousState,
        channelId: id,
        channelName: name,
      };
    });
  };

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
      return {
        ...previousState,
        picture: [...previousState.picture, upload_resolve.data[0].id],
      };
    });
  };

  const handleCampaignSubmit = async () => {
    if (isEmpty(campaignState.title) || isEmpty(campaignState.content)) {
      alert("Không đủ thông tin! Vui lòng kiểm tra lại!");
    } else
      try {
        await requestCreateCampaignMutation();
        Router.push("/dashboard");
        return alert("Tạo campaign thành công!");
      } catch (error) {
        return alert(errorLog(error.message));
      }
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
    else {
      let mounted = true;
      const url = API_URL + "/categories";
      try {
        const fetchCategory = async () => {
          const get_resolve = await axios.get(url, {
            cancelToken: signal.token,
            headers: {
              Authorization: `Bearer ${state.jwt}`,
            },
          });
          if (mounted) {
            setCategories({ categories: get_resolve.data });
          }
        };
        fetchCategory();
      } catch (error) {
        if (axios.isCancel(error) && error.message !== undefined) {
          console.log("Error: ", error.message);
        } else {
          throw error;
        }
      }
      return function cleanup() {
        mounted = false;
        signal.cancel();
      };
    }
  }, [state]);

  return (
    <div>
      <div className="wrapper">
        <div className="main">
          <Container>
            <Card>
              <CardHeader>
                <h3 className="title">Tạo campaign</h3>
              </CardHeader>
              <CardBody>
                <Form className="form">
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
                        value={campaignState.open_datetime.toISOString}
                        required
                        isValidDate={validStartDate}
                      />
                    </FormGroup>
                    <FormGroup className="col-md-4">
                      <Label for="endDate">Chọn Ngày kết thúc</Label>
                      <Datetime
                        onChange={handleEndDateChange}
                        value={campaignState.close_datetime.toISOString}
                        required
                        isValidDate={valid}
                      />
                    </FormGroup>
                  </div>
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
                          {campaignState.category === null
                            ? "Chọn Danh mục..."
                            : tempData.categoryName}
                        </DropdownToggle>
                        <DropdownMenu>
                          {categories.categories.map((category) => (
                            <DropdownItem
                              key={category.id}
                              onClick={(event) => {
                                event.preventDefault();
                                handleCategoryChange(
                                  category.id,
                                  category.name
                                );
                              }}
                            >
                              {category.name}
                            </DropdownItem>
                          ))}
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
                          {campaignState.channels === null
                            ? "Chọn Kênh..."
                            : tempData.channelName}
                        </DropdownToggle>
                        {campaignState.category !== null ? (
                          <DropdownMenu>
                            {categories.categories
                              .find((x) => x.id === campaignState.category)
                              .channels.map((channel) => (
                                <DropdownItem
                                  key={channel.id}
                                  onClick={(event) => {
                                    event.preventDefault();
                                    handleChannelsChange(
                                      channel.id,
                                      channel.name
                                    );
                                  }}
                                >
                                  {channel.name}
                                </DropdownItem>
                              ))}
                          </DropdownMenu>
                        ) : (
                          <div></div>
                        )}
                      </UncontrolledDropdown>
                    </FormGroup>
                    <FormGroup className="col-md-4">
                      <Label for="channel">Trạng thái</Label>
                      <br />
                      <FormGroup>
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
                              checked={campaignState.status === false}
                              onChange={handleRadioChange}
                            />
                            Inactive
                            <span className="form-check-sign"></span>
                          </Label>
                        </FormGroup>
                      </FormGroup>
                    </FormGroup>
                  </div>
                </Form>
                <br />
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
    </div>
  );
};

export default Create;
