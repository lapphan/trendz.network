import { useAuth } from "../../../context/userContext";
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
import { useSnackbar } from "notistack";

const { API_URL } = process.env;

const CustomerCampaignPage = ({ campaign, categories }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { state } = useAuth();

  const [date, setDate] = useState(Datetime.moment().subtract(1, "day"));

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

  const [deleteModal, setDeleteModal] = useState(false);
  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal);
  };

  const [tempCampaign, setTempCampaign] = useState(campaign);

  var valid = function (current) {
    return current.isAfter(date);
  };

  var validStartDate = function (current) {
    return current.isAfter(Datetime.moment().subtract(1, "day"));
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

  const renderStatus = (approvalStatus, influencerStatus, status) => {
    if (approvalStatus == null) {
      return "Đang chờ cấp phép";
    }
    if (!approvalStatus) {
      return "Không được cấp phép";
    }
    if (approvalStatus && influencerStatus == null) {
      return "Đã được cấp phép - Đang chờ influencer xác nhận";
    }
    if (approvalStatus && !influencerStatus) {
      return "Đã được cấp phép - Influencer đã từ chối";
    }
    if (approvalStatus && influencerStatus && status == null) {
      return "Đã được cấp phép - Influencer đã chấp thuận - Đang hoạt động";
    } else return "Đã được cấp phép - Influencer đã chấp thuận - Đã kết thúc";
  };

  const renderDeleteModal = () => {
    <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
      <div className="modal-header">
        <h4 className="modal-title" id="avatarModal">
          <strong>Xóa Campaign</strong>
        </h4>
        <button
          type="button"
          className="close"
          data-dismiss="modal"
          aria-hidden="true"
          onClick={toggleDeleteModal}
        >
          <i className="tim-icons icon-simple-remove" />
        </button>
      </div>
      <ModalBody>
        <Label>Bạn có thật sự muốn xóa Campaign này?</Label>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggleDeleteModal}>
          Hủy
        </Button>
        <Button
          color="primary"
          onClick={() => {
            try {
              handleDelete();
              enqueueSnackbar("Xóa campaign thành công!", {
                variant: "success",
              });
              Router.push("/dashboard");
            } catch (error) {
              enqueueSnackbar("Xóa campaign không thành công!", {
                variant: "error",
              });
            }
            toggleDeleteModal();
          }}
        >
          Xóa
        </Button>
      </ModalFooter>
    </Modal>;
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
              try {
                handleEditSubmit();
                enqueueSnackbar("Chỉnh sửa thành công!", {
                  variant: "success",
                });
              } catch (error) {
                enqueueSnackbar("Chỉnh sửa không thành công!", {
                  variant: "error",
                });
              }
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

  return (
    <Row>
          {tempCampaign.title !== "" ? renderEditModal() : ""}
          {tempCampaign.title !== "" ? renderDeleteModal() : ""}
          <Card className="single-card">
            <CardImg
              src={renderImage()}
              alt="Card image cap"
              className="campaign-detail-img"
            />
            <CardBody>
              <CardTitle>{campaign.title}</CardTitle>
              <CardText
                dangerouslySetInnerHTML={{
                  __html: campaign.content,
                }}
              ></CardText>
              <CardSubtitle>
                <strong>Thể loại:</strong>
              </CardSubtitle>
              {campaign.category !== undefined ? (
                <CardText>
                  {campaign.category.name} - {campaign.category.description}
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
                    <strong>Địa chỉ:</strong> {campaign.channels[0].address}
                  </CardText>
                  <CardText>
                    <strong>Liên hệ:</strong> {campaign.channels[0].phone}
                  </CardText>
                </>
              ) : (
                ""
              )}
              <CardSubtitle>
                <strong>Trạng thái:</strong>
              </CardSubtitle>
              <CardText>
                {renderStatus(
                  campaign.approve,
                  campaign.status,
                  campaign.completed
                )}
              </CardText>
              <CardSubtitle>
                <strong>Người tạo:</strong>
              </CardSubtitle>
              <CardText>
                {campaign.user !== undefined ? campaign.user.username : ""}
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
              <div className="form-button">
                <Button
                  className="btn-neutral"
                  color="primary"
                  onClick={toggleCampaignModal}
                >
                  Chỉnh sửa
                </Button>
                <Button color="primary" onClick={toggleDeleteModal}>
                  Xóa
                </Button>
                <Button color="success">Liên hệ TrendZ</Button>
              </div>
            </CardBody>
          </Card>
    </Row>
  );
};

export default CustomerCampaignPage;
