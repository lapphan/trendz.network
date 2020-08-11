import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/userContext";

import axios from "axios";
import Link from "next/link";
import classnames from "classnames";
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardDeck,
  CardSubtitle,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  CardTitle,
  Row,
  Col,
  Spinner,
} from "reactstrap";

const { API_URL } = process.env;

const Employee = () => {
  const { state } = useAuth();
  const [navState, setNav] = useState({
    vertical: 1,
  });

  const [onHoldCampaigns, setOnHoldCampaigns] = useState({
    campaigns: [],
  });

  const [approvedCampaigns, setApprovedCampaigns] = useState({
    campaigns: [],
  });

  const [unapprovedCampaigns, setUnapprovedCampaigns] = useState({
    campaigns: [],
  });

  const signal = axios.CancelToken.source();

  const toggleTabs = (event, stateName, index) => {
    event.preventDefault();
    setNav((previousState) => {
      return { ...previousState, [stateName]: index };
    });
  };

  const renderStatus = (approvalStatus, influencerStatus, status) => {
    if(approvalStatus==null){
      return "Đang chờ cấp phép";
    }
    if(!approvalStatus){
      return "Không được cấp phép"
    }
    if (approvalStatus && influencerStatus == null) {
        return "Đã được cấp phép - Đang chờ influencer xác nhận"; 
    }
    if(approvalStatus && !influencerStatus){
      return "Đã được cấp phép - Influencer đã từ chối"; 
    }
    if(approvalStatus && influencerStatus && status == null){
      return "Đã được cấp phép - Influencer đã chấp thuận - Đang hoạt động"; 
    }
    else return "Đã được cấp phép - Influencer đã chấp thuận - Đã kết thúc"
  };

  useEffect(() => {
    let mountedCampaign = true;
    const campaignUrl = API_URL + "/campaigns";
    const fetchCampaign = async () => {
      try {
        const get_resolve = await axios.get(campaignUrl, {
          cancelToken: signal.token,
          headers: {
            Authorization: `Bearer ${state.jwt}`,
          },
        });
        if (mountedCampaign) {
          try {
            setOnHoldCampaigns({
              campaigns: get_resolve.data.filter(function (campaign) {
                return campaign.approve == null;
              }),
            });
            setApprovedCampaigns({
              campaigns: get_resolve.data.filter(function (campaign) {
                return campaign.approve == true;
              }),
            });
            setUnapprovedCampaigns({
              campaigns: get_resolve.data.filter(function (campaign) {
                return campaign.approve == false;
              }),
            });
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        if (axios.isCancel(error) && error.message !== undefined) {
          console.log("Error: ", error.message);
        }
      }
    };
    fetchCampaign();
    return function cleanup() {
      mountedCampaign = false;
      signal.cancel();
    };
  }, []);

  return (
    <div className="wrapper">
      <div className="main">
        <Card>
          <CardBody>
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
                      Campaign requests
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: navState.vertical === 2,
                      })}
                      onClick={(e) => toggleTabs(e, "vertical", 2)}
                    >
                      Approved Campaigns
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: navState.vertical === 3,
                      })}
                      onClick={(e) => toggleTabs(e, "vertical", 3)}
                    >
                      Unapproved Campaigns
                    </NavLink>
                  </NavItem>
                </Nav>
              </Col>
              <Col>
                <TabContent activeTab={"vertical" + navState.vertical}>
                  <TabPane tabId="vertical1">
                    <Row>
                      <CardDeck>
                        {onHoldCampaigns.campaigns.length !== 0 ? (
                          onHoldCampaigns.campaigns.map((campaign) => (
                            <Col md={4} key={campaign.id}>
                              <Card className="campaign-card">
                                <CardImg
                                  src={
                                    campaign.picture[0] !== undefined
                                      ? `
                                          ${API_URL}${campaign.picture[0].formats.thumbnail.url}`
                                      : "/256x186.svg"
                                  }
                                  alt="Card image cap"
                                  className="campaign-img"
                                />
                                <CardBody>
                                  <CardTitle className="dashboard-card-title">
                                    {campaign.title}
                                  </CardTitle>
                                  <CardSubtitle>
                                    <strong>Người tạo:</strong>{" "}
                                    {campaign.user.username}
                                  </CardSubtitle>
                                  <CardSubtitle>
                                    <strong>Trạng thái:</strong>{" "}
                                    {renderStatus(campaign.approve,campaign.status, campaign.completed)}
                                  </CardSubtitle>
                                  <CardSubtitle>
                                    <strong>
                                      Ngày bắt đầu - Ngày kết thúc:
                                    </strong>
                                  </CardSubtitle>
                                  <CardSubtitle>
                                    <small className="text-muted">
                                      {new Date(
                                        campaign.campaignTTL[0].open_datetime
                                      ).toLocaleString("en-GB") +
                                        " - " +
                                        new Date(
                                          campaign.campaignTTL[0].close_datetime
                                        ).toLocaleString("en-GB")}
                                    </small>
                                  </CardSubtitle>
                                  <Link
                                    href="/campaign/[cid]"
                                    as={`/campaign/${campaign.id}`}
                                  >
                                    <Button>Chi tiết</Button>
                                  </Link>
                                </CardBody>
                              </Card>
                            </Col>
                          ))
                        ) : (
                          <Spinner color="light" />
                        )}
                      </CardDeck>
                    </Row>
                  </TabPane>
                  <TabPane tabId="vertical2">
                    <Row>
                      <CardDeck>
                        {approvedCampaigns.campaigns.length !== 0 ? (
                          approvedCampaigns.campaigns.map((campaign) => (
                            <Col md={4} key={campaign.id}>
                              <Card className="campaign-card">
                                <CardImg
                                  src={
                                    campaign.picture[0] !== undefined
                                      ? `
                                        ${API_URL}${campaign.picture[0].formats.thumbnail.url}`
                                      : "/256x186.svg"
                                  }
                                  alt="Card image cap"
                                  className="campaign-img"
                                />
                                <CardBody>
                                  <CardTitle className="dashboard-card-title">
                                    {campaign.title}
                                  </CardTitle>
                                  <CardSubtitle>
                                    <strong>Người tạo:</strong>{" "}
                                    {campaign.user.username}
                                  </CardSubtitle>
                                  <CardSubtitle>
                                    <strong>Trạng thái:</strong>{" "}
                                    {renderStatus(campaign.approve,campaign.status, campaign.completed)}
                                  </CardSubtitle>
                                  <CardSubtitle>
                                    <strong>
                                      Ngày bắt đầu - Ngày kết thúc:
                                    </strong>
                                  </CardSubtitle>
                                  <CardSubtitle>
                                    <small className="text-muted">
                                      {new Date(
                                        campaign.campaignTTL[0].open_datetime
                                      ).toLocaleString("en-GB") +
                                        " - " +
                                        new Date(
                                          campaign.campaignTTL[0].close_datetime
                                        ).toLocaleString("en-GB")}
                                    </small>
                                  </CardSubtitle>

                                  <Link
                                    href="/campaign/[cid]"
                                    as={`/campaign/${campaign.id}`}
                                  >
                                    <Button>Chi tiết</Button>
                                  </Link>
                                </CardBody>
                              </Card>
                            </Col>
                          ))
                        ) : (
                          <Spinner color="light" />
                        )}
                      </CardDeck>
                    </Row>
                  </TabPane>
                  <TabPane tabId="vertical3">
                    <Row>
                      <CardDeck>
                        {unapprovedCampaigns.campaigns.length !== 0 ? (
                          unapprovedCampaigns.campaigns.map((campaign) => (
                            <Col md={4} key={campaign.id}>
                              <Card className="campaign-card">
                                <CardImg
                                  src={
                                    campaign.picture[0] !== undefined
                                      ? `
                                        ${API_URL}${campaign.picture[0].formats.thumbnail.url}`
                                      : "/256x186.svg"
                                  }
                                  alt="Card image cap"
                                  className="campaign-img"
                                />
                                <CardBody>
                                  <CardTitle className="dashboard-card-title">
                                    {campaign.title}
                                  </CardTitle>
                                  <CardSubtitle>
                                    <strong>Người tạo:</strong>{" "}
                                    {campaign.user.username}
                                  </CardSubtitle>
                                  <CardSubtitle>
                                    <strong>Trạng thái:</strong>{" "}
                                    {renderStatus(campaign.approve,campaign.status, campaign.completed)}
                                  </CardSubtitle>
                                  <CardSubtitle>
                                    <strong>
                                      Ngày bắt đầu - Ngày kết thúc:
                                    </strong>
                                  </CardSubtitle>
                                  <CardSubtitle>
                                    <small className="text-muted">
                                      {new Date(
                                        campaign.campaignTTL[0].open_datetime
                                      ).toLocaleString("en-GB") +
                                        " - " +
                                        new Date(
                                          campaign.campaignTTL[0].close_datetime
                                        ).toLocaleString("en-GB")}
                                    </small>
                                  </CardSubtitle>

                                  <Link
                                    href="/campaign/[cid]"
                                    as={`/campaign/${campaign.id}`}
                                  >
                                    <Button>Chi tiết</Button>
                                  </Link>
                                </CardBody>
                              </Card>
                            </Col>
                          ))
                        ) : (
                          <Spinner color="light" />
                        )}
                      </CardDeck>
                    </Row>
                  </TabPane>
                </TabContent>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Employee;
