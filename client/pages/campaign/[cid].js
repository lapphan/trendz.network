import { useRouter, withRouter } from "next/router";
import { useAuth } from "../../context/userContext";
import React, { useEffect, useState } from "react";
import Router from "next/router";
import axios from "axios";
import Datetime from "react-datetime";
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardSubtitle,
  Container,
  CardTitle,
  CardText,
  Row,
  Modal,
  ModalBody,
  ModalFooter,
  Spinner,
  Form,
  FormGroup,
  Label,
  Input,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

const { API_URL } = process.env;

const Post = () => {
  const router = useRouter();
  const { cid } = router.query;
  const { state } = useAuth();
  const [isLoading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState({
    campaignTTL: [
      {
        open_datetime: "",
        close_datetime: "",
      },
    ],
    category: {},
    channels: [],
    content: "",
    picture: [],
    user: {},
    title: "",
    status: null,
  });
  const [date, setDate] = useState(Datetime.moment().subtract(1, "day"));

  const [categories, setCategories] = useState({
    categories: [],
  });

  const [tempData, setTempData] = useState({
    categoryId: "",
    categoryName: "",
    channelId: "",
    channelName: "",
  });

  const [campaignModal, setCampaignModal] = useState(false);
  const toggleCampaignModal = () => {
    setCampaignModal(!campaignModal);
  };
  const [tempCampaign, setTempCampaign] = useState(campaign);

  var valid = function (current) {
    return current.isAfter(date);
  };

  var validStartDate = function (current) {
    return current.isAfter(Datetime.moment().subtract(1, "day"));
  };

  const renderButton = () => {
    if (state.user.id == campaign.channels[0].user) {
      return (
        <div className="form-button">
          <Button
            className="btn-neutral"
            color="primary"
            onClick={handleReject}
          >
            Từ chối
          </Button>
          <Button color="primary" onClick={handleAccept}>
            Xác nhận
          </Button>
        </div>
      );
    } else if (state.user.id == campaign.user.id) {
      return (
        <div className="form-button">
          <Button
            className="btn-neutral"
            color="primary"
            onClick={toggleCampaignModal}
          >
            Chỉnh sửa
          </Button>
          <Button color="primary" onClick={handleDelete}>
            Xóa
          </Button>
        </div>
      );
    } else return <p></p>;
  };

  //influencer reject campaign
  const handleReject = async () => {
    const status = {
      status: false,
    };
    try {
      await axios({
        method: "PUT",
        headers: {
          Authorization: `Bearer ${state.jwt}`,
        },
        url: `${API_URL}/campaigns/${cid}`,
        data: status,
      });
    } catch (e) {
      console.log(e);
    }
    return;
  };

  //influencer accept campaign
  const handleAccept = async () => {
    const status = {
      status: true,
    };
    try {
      await axios({
        method: "PUT",
        headers: {
          Authorization: `Bearer ${state.jwt}`,
        },
        url: `${API_URL}/campaigns/${cid}`,
        data: status,
      });
    } catch (e) {
      console.log(e);
    }
    return;
  };

  //creator edit campaign
  const handleCampaignChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setTempCampaign((previousState) => {
      return { ...previousState, [name]: value };
    });
  };

  const handleStartDateChange = (event) => {
    if (event._d !== undefined) {
      const value = event._d.toISOString();
      setTempCampaign((previousState) => {
        return {
          ...previousState,
          campaignTTL: [
            {
              open_datetime: value,
              close_datetime: previousState.campaignTTL[0].close_datetime,
            },
          ],
        };
      });
      setDate(value);
    } else return;
  };

  const handleEndDateChange = (event) => {
    if (event._d !== undefined) {
      const value = event._d.toISOString();
      setTempCampaign((previousState) => {
        return {
          ...previousState,
          campaignTTL: [
            {
              open_datetime: previousState.campaignTTL[0].open_datetime,
              close_datetime: value,
            },
          ],
        };
      });
    } else return;
  };

  const handleCategoryChange = (id, name) => {
    setTempCampaign((previousState) => {
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
    setTempCampaign((previousState) => {
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

  const handleEditSubmit = async () => {
    setCampaign((previousState) => {
      return {
        ...previousState,
        campaignTTL: tempCampaign.campaignTTL,
        category: tempCampaign.category,
        channels: tempCampaign.channels,
        content: tempCampaign.content,
        title: tempCampaign.title,
      };
    });
    const upload_resolve = await axios({
      method: "PUT",
      headers: {
        Authorization: `Bearer ${state.jwt}`,
      },
      url: `${API_URL}/campaigns/${cid}`,
      data: tempCampaign,
    });
  };

  //creator delete campaign
  const handleDelete = async () => {
    try {
      await axios({
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${state.jwt}`,
        },
        url: `${API_URL}/campaigns/${cid}`,
      });
    } catch (e) {
      console.log(e);
    }
    return;
  };

  const renderImage = () => {
    if (campaign.picture[0] !== undefined) {
      if (campaign.picture[0].formats.medium !== undefined) {
        return API_URL + campaign.picture[0].formats.medium.url;
      } else if (campaign.picture[1].formats.medium !== undefined) {
        return API_URL + campaign.picture[1].formats.medium.url;
      } else return "/256x186.svg";
    } else return "/256x186.svg";
  };

  const renderEditModal = () => {
    return (
      <Modal isOpen={campaignModal} toggle={toggleCampaignModal}>
        <div className="modal-header">
          <h4 className="modal-title" id="avatarModal">
            <strong>Cập nhật Campaign</strong>
          </h4>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-hidden="true"
            onClick={toggleCampaignModal}
          >
            <i className="tim-icons icon-simple-remove" />
          </button>
        </div>
        <ModalBody>
          <Form className="form">
            <FormGroup className="modal-items">
              <Label for="title">Tiêu đề</Label>
              <Input
                type="text"
                id="title"
                name="title"
                onChange={handleCampaignChange}
                value={tempCampaign.title}
                placeholder="Tiêu đề"
                required
                className="modal-items"
              />
            </FormGroup>
            <FormGroup className="modal-items">
              <Label for="content">Nội dung</Label>
              <Input
                type="textarea"
                id="content"
                placeholder="Nội dung..."
                name="content"
                onChange={handleCampaignChange}
                value={tempCampaign.content}
                required
                className="modal-items"
              />
            </FormGroup>
            <div className="form-row">
              <FormGroup className="col-md-4">
                <Label for="startDate" className="modal-items">
                  Chọn Ngày bắt đầu
                </Label>
                <Datetime
                  onChange={handleStartDateChange}
                  value={tempCampaign.campaignTTL[0].open_datetime.toISOString}
                  required
                  isValidDate={validStartDate}
                  className="modal-items"
                />
              </FormGroup>
              <FormGroup className="col-md-4">
                <Label for="endDate" className="modal-items">
                  Chọn Ngày kết thúc
                </Label>
                <Datetime
                  onChange={handleEndDateChange}
                  value={tempCampaign.campaignTTL[0].close_datetime.toISOString}
                  required
                  isValidDate={valid}
                  className="modal-items"
                />
              </FormGroup>
            </div>
            <div className="form-row">
              <FormGroup className="col-md-4">
                <Label for="channel" className="modal-items">
                  Chọn Danh mục
                </Label>
                <br />
                <UncontrolledDropdown group>
                  <DropdownToggle
                    caret
                    color="secondary"
                    data-toggle="dropdown"
                    className="mydropdown"
                  >
                    {tempCampaign.category === null
                      ? "Chọn Danh mục..."
                      : tempData.categoryName}
                  </DropdownToggle>
                  <DropdownMenu>
                    {categories.categories.map((category) => (
                      <DropdownItem
                        key={category.id}
                        onClick={(event) => {
                          event.preventDefault();
                          handleCategoryChange(category.id, category.name);
                        }}
                      >
                        {category.name}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </UncontrolledDropdown>
              </FormGroup>
              <FormGroup className="col-md-4">
                <Label for="channel" className="modal-items">
                  Chọn Kênh
                </Label>
                <br />
                <UncontrolledDropdown group>
                  <DropdownToggle
                    caret
                    color="secondary"
                    data-toggle="dropdown"
                  >
                    {tempCampaign.channels === null
                      ? "Chọn Kênh..."
                      : tempData.channelName}
                  </DropdownToggle>
                  {tempCampaign.category !== null ? (
                    <DropdownMenu>
                      {categories.categories
                        .find((x) => x.id === tempCampaign.category.id)
                        .channels.map((channel) => (
                          <DropdownItem
                            key={channel.id}
                            onClick={(event) => {
                              event.preventDefault();
                              handleChannelsChange(channel.id, channel.name);
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
            </div>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleCampaignModal}>
            Hủy
          </Button>
          <Button
            color="primary"
            onClick={() => {
              handleEditSubmit();
              toggleCampaignModal();
              Router.reload();
            }}
          >
            Lưu
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

  useEffect(() => {
    if (state.jwt === "") Router.push("/login");
    else {
      let mountedCampaign = true;
      let mountedCategory = true;
      try {
        const fetchCampaign = async () => {
          const url = API_URL + `/campaigns/${cid}`;
          const get_resolve = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${state.jwt}`,
            },
          });
          if (mountedCampaign) {
            setCampaign({
              user: get_resolve.data.user,
              campaignTTL: get_resolve.data.campaignTTL,
              category: get_resolve.data.category,
              channels: get_resolve.data.channels,
              picture: get_resolve.data.picture,
              status: get_resolve.data.status,
              title: get_resolve.data.title,
              content: get_resolve.data.content,
            });
            setTempCampaign({
              user: get_resolve.data.user,
              campaignTTL: get_resolve.data.campaignTTL,
              category: get_resolve.data.category,
              channels: get_resolve.data.channels,
              picture: get_resolve.data.picture,
              status: get_resolve.data.status,
              title: get_resolve.data.title,
              content: get_resolve.data.content,
            });
          }
        };
        const fetchCategory = async () => {
          const url = API_URL + "/categories";
          const get_resolve = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${state.jwt}`,
            },
          });
          if (mountedCategory) {
            setCategories({ categories: get_resolve.data });
          }
        };
        fetchCategory();
        fetchCampaign().then(setLoading(false));
      } catch (error) {
        if (axios.isCancel(error) && error.message !== undefined) {
          console.log("Error: ", error.message);
        } 
      }

      return function cleanup() {
        mounted = false;
        signal.cancel();
      };
    }
  }, [state]);

  return (
    <div className="wrapper">
      <div className="main">
        <Container>
          <Card>
            {tempCampaign.title !== "" ? renderEditModal() : ""}
            <CardBody>
              <Row>
                {isLoading === false ? (
                  <Container>
                    <Card className="single-card">
                      <CardImg
                        src={renderImage()}
                        alt="Card image cap"
                        className="campaign-detail-img"
                      />
                      <CardBody>
                        <CardTitle>{campaign.title}</CardTitle>
                        <CardText>{campaign.content}</CardText>
                        <CardSubtitle>
                          <strong>Thể loại:</strong>
                        </CardSubtitle>
                        {campaign.category !== undefined ? (
                          <CardText>
                            {campaign.category.name} -{" "}
                            {campaign.category.description}
                          </CardText>
                        ) : (
                          ""
                        )}
                        <CardSubtitle>
                          <strong>Kênh:</strong>
                        </CardSubtitle>
                        {campaign.channels[0] !== undefined ? (
                          <>
                            <CardText>
                              <strong>{campaign.channels[0].name}</strong>
                            </CardText>
                            <CardText>
                              <strong>Website:</strong>{" "}
                              <a href="##">{campaign.channels[0].website}</a>
                            </CardText>
                            <CardText>
                              <strong>Địa chỉ:</strong>{" "}
                              {campaign.channels[0].address}
                            </CardText>
                            <CardText>
                              <strong>Liên hệ:</strong>{" "}
                              {campaign.channels[0].phone}
                            </CardText>
                          </>
                        ) : (
                          ""
                        )}
                        <CardSubtitle>
                          <strong>Trạng thái:</strong>
                        </CardSubtitle>
                        <CardText>
                          {campaign.status
                            ? "Đang hoạt động"
                            : "Ngừng hoạt động"}
                        </CardText>
                        <CardSubtitle>
                          <strong>Người tạo:</strong>
                        </CardSubtitle>
                        <CardText>
                          {campaign.user !== undefined
                            ? campaign.user.username
                            : ""}
                        </CardText>
                        <CardSubtitle>
                          <strong>Thời gian:</strong>
                        </CardSubtitle>
                        {campaign.campaignTTL[0] !== undefined ? (
                          <CardText>
                            {"Từ " +
                              new Date(
                                campaign.campaignTTL[0].open_datetime
                              ).toLocaleDateString("en-GB") +
                              " - Đến " +
                              new Date(
                                campaign.campaignTTL[0].close_datetime
                              ).toLocaleDateString("en-GB")}
                          </CardText>
                        ) : (
                          ""
                        )}
                        {campaign.channels[0] !== undefined
                          ? renderButton()
                          : ""}
                      </CardBody>
                    </Card>
                  </Container>
                ) : (
                  <Spinner />
                )}
              </Row>
            </CardBody>
          </Card>
        </Container>
      </div>
    </div>
  );
};

export default withRouter(Post);
