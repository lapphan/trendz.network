import React, { useEffect, useState } from "react";
import { useAuth } from "../context/userContext";
import Router from "next/router";
import axios from "axios";
import classnames from "classnames";
import Link from "next/link";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardImg,
  CardDeck,
  CardSubtitle,
  Label,
  FormGroup,
  Input,
  Container,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Form,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  CardTitle,
  CardText,
  Row,
  Col,
  Spinner,
} from "reactstrap";

const { API_URL } = process.env;

const Dashboard = () => {
  const { state } = useAuth();
  const [navState, setNav] = useState({
    vertical: 1,
  });

  const [campaigns, setCampaigns] = useState({
    campaigns: [],
  });

  const [myCampaigns, setMyCampaigns] = useState({
    campaigns: [],
  });

  const toggleTabs = (event, stateName, index) => {
    event.preventDefault();
    setNav((previousState) => {
      return { ...previousState, [stateName]: index };
    });
  };

  // useEffect(()=>{

  // })

  useEffect(() => {
    if (state.jwt === "") Router.push("/login");
    else {
      const fetchCampaign = async () => {
        const get_resolve = await axios({
          method: "GET",
          headers: {
            Authorization: `Bearer ${state.jwt}`,
          },
          url: `${API_URL}/campaigns`,
        });
        setCampaigns({ campaigns: get_resolve.data });
        setMyCampaigns({campaigns: get_resolve.data.filter(function(campaign){return campaign.user.id == state.user.id})})
      };
      fetchCampaign()
    }
  }, [state]);

    return (
      <div>
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
                          All Campaigns
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames({
                            active: navState.vertical === 2,
                          })}
                          onClick={(e) => toggleTabs(e, "vertical", 2)}
                        >
                          My Campaigns
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </Col>
                  <Col>
                    <TabContent activeTab={"vertical" + navState.vertical}>
                      <TabPane tabId="vertical1">
                        <Row>
                          <CardDeck>
                            {campaigns.campaigns.length !== 0 ? (
                              campaigns.campaigns.map((campaign) => (
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
                                      <CardTitle>{campaign.title}</CardTitle>
                                      <CardSubtitle><strong>Người tạo:</strong> {campaign.user.username}</CardSubtitle>
                                      <CardSubtitle><strong>Trạng thái:</strong> {campaign.status ? "Hoạt động" : "Ngừng hoạt động"}</CardSubtitle>
                                      <CardSubtitle>
                                        <strong>Ngày bắt đầu - Ngày kết thúc:</strong>
                                      </CardSubtitle>
                                      <CardSubtitle>
                                        <small className="text-muted">
                                          {new Date(
                                            campaign.campaignTTL[0].open_datetime
                                          ).toLocaleString() +
                                            " - " +
                                            new Date(
                                              campaign.campaignTTL[0].close_datetime
                                            ).toLocaleString()}
                                        </small>
                                      </CardSubtitle>
                                      <Button>
                                        <Link href={`/campaign/${campaign.id}`}>
                                          <p>Chi tiết</p>
                                        </Link>
                                      </Button>
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
                            {myCampaigns.campaigns.length !== 0 ? (
                              myCampaigns.campaigns.map((campaign) => (
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
                                    <CardTitle>{campaign.title}</CardTitle>
                                      <CardSubtitle><strong>Người tạo:</strong> {campaign.user.username}</CardSubtitle>
                                      <CardSubtitle><strong>Trạng thái:</strong> {campaign.status ? "Hoạt động" : "Ngừng hoạt động"}</CardSubtitle>
                                      <CardSubtitle>
                                        <strong>Ngày bắt đầu - Ngày kết thúc:</strong>
                                      </CardSubtitle>
                                      <CardSubtitle>
                                        <small className="text-muted">
                                          {new Date(
                                            campaign.campaignTTL[0].open_datetime
                                          ).toLocaleString() +
                                            " - " +
                                            new Date(
                                              campaign.campaignTTL[0].close_datetime
                                            ).toLocaleString()}
                                        </small>
                                      </CardSubtitle>
                                      <Button>
                                        <Link href={`/campaign/${campaign.id}`}>
                                          <p>Chi tiết</p>
                                        </Link>
                                      </Button>
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
      </div>
    );
};

export default Dashboard;
