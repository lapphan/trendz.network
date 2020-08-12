import { useAuth } from "../../../context/userContext";
import React, { useEffect, useState } from "react";
import Router from "next/router";
import axios from "axios";
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
  Col,
  Nav,
  NavLink,
  NavItem,
  TabContent,
  TabPane,
} from "reactstrap";
import classnames from "classnames";
import { useSnackbar } from "notistack";
import { makeStyles, Typography, Paper } from "@material-ui/core";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
  TimelineDot,
  Skeleton,
} from "@material-ui/lab";

//import { Paper, Typography } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import SyncIcon from "@material-ui/icons/Sync";
import LockIcon from "@material-ui/icons/Lock";

const { API_URL } = process.env;

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: "6px 16px",
    backgroundColor: "#1f2251",
  },
  success: {
    backgroundColor: "#009688",
  },
  processing: {
    backgroundColor: "#2196f3",
  },
  error: {
    backgroundColor: "#f44336",
  },
  inactive: {
    backgroundColor: "#bdbdbd",
  },
}));

const EmployeeCampaignPage = ({ campaign, influencer }) => {
  const { enqueueSnackbar } = useSnackbar();

  const classes = useStyles();

  const { state } = useAuth();

  const [navState, setNav] = useState({
    vertical: 1,
  });

  const toggleTabs = (event, stateName, index) => {
    event.preventDefault();
    setNav((previousState) => {
      return { ...previousState, [stateName]: index };
    });
  };

  //employee approve/unapprove campaign
  const handleEmployeeApproval = async (approved) => {
    const status = {
      approve: approved,
    };
    try {
      console.log(status);
      await axios({
        method: "PUT",
        headers: {
          Authorization: `Bearer ${state.jwt}`,
        },
        url: `${API_URL}/campaigns/${cid}`,
        data: status,
      });
      if (approved) {
        enqueueSnackbar("Đã chấp thuận campaign!", { variant: "success" });
      } else enqueueSnackbar("Đã từ chối campaign!", { variant: "success" });
      Router.push("/dashboard");
    } catch (e) {
      console.log(e);
      enqueueSnackbar("Đã có lỗi xảy ra, vui lòng thử lại!", {
        variant: "error",
      });
    }
    return;
  };

  const renderImage = () => {
    if (campaign.picture[0].formats !== undefined) {
      if (campaign.picture[0].formats.medium !== undefined) {
        return API_URL + campaign.picture[0].formats.medium.url;
      } else if (campaign.picture[1].formats.medium !== undefined) {
        return API_URL + campaign.picture[1].formats.medium.url;
      } else return "/256x186.svg";
    } else return "/256x186.svg";
  };

  const renderUserImage = () => {
    if (campaign.user.avatar !== undefined) {
      if (campaign.user.avatar !== undefined) {
        return API_URL + campaign.user.avatar.formats.thumbnail.url;
      } else return "/256x186.svg";
    } else return "/256x186.svg";
  };

  const renderInfluencerImage = () => {
    if (
      influencer.user.avatar !== undefined ||
      influencer.user.avatar !== null
    ) {
      if (
        influencer.user.avatar.formats !== undefined ||
        influencer.user.avatar.formats !== null
      ) {
        return API_URL + influencer.user.avatar.formats.thumbnail.url;
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

  return (
    <Row>
      <Col md="2">
        <Nav className="nav-pills-primary flex-column" pills>
          <NavItem>
            <NavLink
              className={classnames({
                active: navState.vertical === 1,
              })}
              onClick={(e) => toggleTabs(e, "vertical", 1)}
            >
              Campaign details
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({
                active: navState.vertical === 2,
              })}
              onClick={(e) => toggleTabs(e, "vertical", 2)}
            >
              Stakeholders info
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({
                active: navState.vertical === 3,
              })}
              onClick={(e) => toggleTabs(e, "vertical", 3)}
            >
              Campaign tracking
            </NavLink>
          </NavItem>
        </Nav>
      </Col>
      <Col>
        <TabContent activeTab={"vertical" + navState.vertical}>
          <TabPane tabId="vertical1">
            <Row>
              <Container>
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
                    <div className="form-button">
                      <Button
                        className="btn-neutral"
                        color="primary"
                        onClick={() => handleEmployeeApproval(false)}
                      >
                        Từ chối
                      </Button>
                      <Button
                        color="primary"
                        onClick={() => handleEmployeeApproval(true)}
                      >
                        Xác nhận
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </Container>
            </Row>
          </TabPane>
          <TabPane tabId="vertical2">
            <Row>
              <Col md={6}>
                <h3>Thông tin người tạo</h3>
                <Card className="single-card">
                  <CardImg
                    src={renderUserImage()}
                    alt="Card image cap"
                    className="campaign-detail-img"
                  />
                  <CardBody>
                    <CardTitle>{campaign.user.name}</CardTitle>
                    <CardSubtitle>
                      <strong>Giới tính:</strong>
                    </CardSubtitle>
                    {campaign.user.gender !== undefined ? (
                      <CardText>
                        {campaign.user.gender === "male" ? "Nam" : "Nữ"}
                      </CardText>
                    ) : (
                      ""
                    )}
                    <CardSubtitle>
                      <strong>Ngày sinh:</strong>
                    </CardSubtitle>
                    {campaign.user.birthDay !== undefined ? (
                      <CardText>
                        {new Date(campaign.user.birthDay).toLocaleDateString(
                          "en-GB"
                        )}
                      </CardText>
                    ) : (
                      ""
                    )}
                    <CardSubtitle>
                      <strong>Email:</strong>
                    </CardSubtitle>
                    {campaign.user.email !== undefined ? (
                      <CardText>{campaign.user.email}</CardText>
                    ) : (
                      ""
                    )}
                    <CardSubtitle>
                      <strong>Địa chỉ:</strong>
                    </CardSubtitle>
                    {campaign.user.address !== undefined ? (
                      <CardText>{campaign.user.address}</CardText>
                    ) : (
                      ""
                    )}
                    <CardSubtitle>
                      <strong>Số điện thoại:</strong>
                    </CardSubtitle>
                    {campaign.user.phoneNumber !== undefined ? (
                      <CardText>{campaign.user.phoneNumber}</CardText>
                    ) : (
                      ""
                    )}
                    <br /> <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <div className="form-button">
                      <Button color="primary">Liên hệ ngay!</Button>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col md={6}>
                <h3>Thông tin Influencer</h3>
                <Card className="single-card">
                  {influencer.avatar !== undefined ? (
                    <CardImg
                      src={renderInfluencerImage()}
                      alt="Card image cap"
                      className="campaign-detail-img"
                    />
                  ) : (
                    <Skeleton variant="rect" width={256} height={186} />
                  )}
                  <CardBody>
                    <CardTitle>{influencer.user.name}</CardTitle>
                    <CardSubtitle>
                      <strong>Giới tính:</strong>
                    </CardSubtitle>
                    {influencer.user.gender !== undefined ? (
                      <CardText>
                        {influencer.user.gender === "male" ? "Nam" : "Nữ"}
                      </CardText>
                    ) : (
                      ""
                    )}
                    <CardSubtitle>
                      <strong>Ngày sinh:</strong>
                    </CardSubtitle>
                    {influencer.user.birthDay !== undefined ? (
                      <CardText>
                        {new Date(influencer.user.birthDay).toLocaleDateString(
                          "en-GB"
                        )}
                      </CardText>
                    ) : (
                      ""
                    )}
                    <CardSubtitle>
                      <strong>Email:</strong>
                    </CardSubtitle>
                    {influencer.user.email !== undefined ? (
                      <CardText>{influencer.user.email}</CardText>
                    ) : (
                      ""
                    )}
                    <CardSubtitle>
                      <strong>Địa chỉ:</strong>
                    </CardSubtitle>
                    {influencer.user.address !== undefined ? (
                      <CardText>{influencer.user.address}</CardText>
                    ) : (
                      ""
                    )}
                    <CardSubtitle>
                      <strong>Số điện thoại:</strong>
                    </CardSubtitle>
                    {influencer.user.phoneNumber !== undefined ? (
                      <CardText>{influencer.user.phoneNumber}</CardText>
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
                          <strong>Liên hệ:</strong> {campaign.channels[0].phone}
                        </CardText>
                      </>
                    ) : (
                      ""
                    )}
                    <div className="form-button">
                      <Button color="primary">Liên hệ ngay!</Button>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="vertical3">
            <Row>
              <Timeline align="alternate">
                <TimelineItem>
                  <TimelineOppositeContent>
                    <Typography variant="body2" color="textSecondary">
                      {new Date(campaign.created_at).toLocaleString("en-GB")}
                    </Typography>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot className={classes.success}>
                      <CheckIcon />
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Paper elevation={3} className={classes.paper}>
                      <p>
                        <strong>Khởi tạo</strong>
                      </p>
                      <CardText>{campaign.user.name}</CardText>
                    </Paper>
                  </TimelineContent>
                </TimelineItem>
                {campaign.approve == null ? (
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot className={classes.processing}>
                        <SyncIcon />
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Paper elevation={3} className={classes.paper}>
                        <p>Kiểm duyệt</p>
                        <CardText>Hệ thống TrendZ đang xử lý yêu cầu</CardText>
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                ) : (
                  ""
                )}
                {campaign.approve == true ? (
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot className={classes.success}>
                        <CheckIcon />
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Paper elevation={3} className={classes.paper}>
                        <p>Kiểm duyệt</p>
                        <p>Hệ thống TrendZ đã duyệt yêu cầu</p>
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                ) : (
                  ""
                )}
                {campaign.approve == false ? (
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot className={classes.error}>
                        <CloseIcon />
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Paper elevation={3} className={classes.paper}>
                        <p>Kiểm duyệt</p>
                        <p>Hệ thống TrendZ đã từ chối yêu cầu</p>
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                ) : (
                  ""
                )}
                {campaign.status == false && campaign.approve == null ? (
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot className={classes.inactive}>
                        <LockIcon />
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Paper elevation={3} className={classes.paper}>
                        <p>Thông tin đến Influencer</p>
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                ) : (
                  ""
                )}
                {campaign.status == null && campaign.approve == null ? (
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot className={classes.inactive}>
                        <LockIcon />
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Paper elevation={3} className={classes.paper}>
                        <p>Thông tin đến Influencer</p>
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                ) : (
                  ""
                )}
                {campaign.status == null && campaign.approve == true ? (
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot className={classes.processing}>
                        <SyncIcon />
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Paper elevation={3} className={classes.paper}>
                        <p>Thông tin đến Influencer</p>
                        <p>Influencer đang xem xét yêu cầu</p>
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                ) : (
                  ""
                )}
                {campaign.status == false && campaign.approve == true ? (
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot className={classes.error}>
                        <CloseIcon />
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Paper elevation={3} className={classes.paper}>
                        <p>Thông tin từ Influencer</p>
                        <p>Influencer đã từ chối yêu cầu</p>
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                ) : (
                  ""
                )}
                {campaign.status == true ? (
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot className={classes.success}>
                        <CheckIcon />
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Paper elevation={3} className={classes.paper}>
                        <p>Thông tin từ Influencer</p>
                        <p>Influencer đã chấp thuận yêu cầu</p>
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                ) : (
                  ""
                )}
                {campaign.completed == null && campaign.status == null ? (
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot className={classes.inactive}>
                        <LockIcon />
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Paper elevation={3} className={classes.paper}>
                        <p>(Dự kiến) Kết thúc</p>
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                ) : (
                  ""
                )}
                {campaign.completed == false && campaign.status == true ? (
                  <>
                    <TimelineItem>
                      <TimelineOppositeContent>
                        <Typography variant="body2" color="textSecondary">
                          {new Date(
                            campaign.campaignTTL[0].open_datetime
                          ).toLocaleString("en-GB")}
                        </Typography>
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot className={classes.processing}>
                          <SyncIcon />
                        </TimelineDot>
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent>
                        <Paper elevation={3} className={classes.paper}>
                          <p>Thực thi</p>
                          <p>Influencer đang thực hiện</p>
                        </Paper>
                      </TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                      <TimelineOppositeContent>
                        <Typography variant="body2" color="textSecondary">
                          {new Date(
                            campaign.campaignTTL[0].close_datetime
                          ).toLocaleString("en-GB")}
                        </Typography>
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot className={classes.inactive}>
                          <LockIcon />
                        </TimelineDot>
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent>
                        <Paper elevation={3} className={classes.paper}>
                          <p>(Dự kiến) Kết thúc</p>
                        </Paper>
                      </TimelineContent>
                    </TimelineItem>
                  </>
                ) : (
                  ""
                )}
                {campaign.completed == true && campaign.status == true ? (
                  <>
                    <TimelineItem>
                      <TimelineOppositeContent>
                        <Typography variant="body2" color="textSecondary">
                          {new Date(
                            campaign.campaignTTL[0].open_datetime
                          ).toLocaleString("en-GB")}
                        </Typography>
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot className={classes.success}>
                          <CheckIcon />
                        </TimelineDot>
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent>
                        <Paper elevation={3} className={classes.paper}>
                          <p>Thực thi</p>
                          <p>Influencer đã hoàn tất yêu cầu</p>
                        </Paper>
                      </TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                      <TimelineOppositeContent>
                        <Typography variant="body2" color="textSecondary">
                          {new Date(
                            campaign.campaignTTL[0].close_datetime
                          ).toLocaleString("en-GB")}
                        </Typography>
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot className={classes.success}>
                          <CheckIcon />
                        </TimelineDot>
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent>
                        <Paper elevation={3} className={classes.paper}>
                          <p>Hoàn thành</p>
                          <p>
                            Influencer đã hoàn thành yêu cầu, dự án kết thúc!
                          </p>
                        </Paper>
                      </TimelineContent>
                    </TimelineItem>
                  </>
                ) : (
                  ""
                )}
              </Timeline>
            </Row>
          </TabPane>
        </TabContent>
      </Col>
    </Row>
  );
};

export default EmployeeCampaignPage;
