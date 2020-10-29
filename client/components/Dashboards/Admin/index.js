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

import Skeleton from "@material-ui/lab/Skeleton";

const { API_URL } = process.env;

const Admin = () => {
  const { state } = useAuth();
  const [navState, setNav] = useState({
    vertical: 1,
  });

  const [onHoldChannels, setOnHoldChannels] = useState({
    channels: [],
  });

  const [approvedChannels, setApprovedChannels] = useState({
    channels: [],
  });

  const [unApprovedChannels, setUnApprovedChannels] = useState({
    channels: [],
  });
  const signal = axios.CancelToken.source();

  const toggleTabs = (event, stateName, index) => {
    event.preventDefault();
    setNav((previousState) => {
      return { ...previousState, [stateName]: index };
    });
  };

  const renderChannelStatus = (employeeConfirm, adminConfirm, status) => {
    if (employeeConfirm == null ||(employeeConfirm == true && adminConfirm == null)) {
      return "Đang chờ cấp phép";
    }
    if (!employeeConfirm || !adminConfirm) {
      return "Không được cấp phép";
    }
    if (adminConfirm && employeeConfirm && status == false) {
      return "Đã được cấp phép - Đang dừng hoạt động";
    }
    if (adminConfirm && employeeConfirm && status == true) {
      return "Đã được cấp phép - Đang hoạt động";
    }
  };
  
  useEffect(() => {
    let mountedChannel = true;
    const channelUrl = API_URL + "/channels";
    const fetchChannels = async () => {
      try {
        const get_resolve = await axios.get(channelUrl, {
          cancelToken: signal.token,
          headers: {
            Authorization: `Bearer ${state.jwt}`,
          },
        });
        if (mountedChannel) {
          try {
            try {
              setOnHoldChannels({
                channels: get_resolve.data.filter(function (channel) {
                  return channel.employeeConfirm == true && channel.adminConfirm==null;
                }),
              });
              setApprovedChannels({
                channels: get_resolve.data.filter(function (channel) {
                  return channel.employeeConfirm == true && channel.adminConfirm==true;
                }),
              });
              setUnApprovedChannels({
                channels: get_resolve.data.filter(function (channel) {
                  return channel.employeeConfirm == true && channel.adminConfirm==false;
                }),
              });
            } catch (error) {
              console.log(error);
            }
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
    fetchChannels();
    return function cleanup() {
      mountedChannel = false;
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
                      Channel requests
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: navState.vertical === 2,
                      })}
                      onClick={(e) => toggleTabs(e, "vertical", 2)}
                    >
                      Approved Channels
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: navState.vertical === 3,
                      })}
                      onClick={(e) => toggleTabs(e, "vertical", 3)}
                    >
                      Unapproved Channels
                    </NavLink>
                  </NavItem>
                </Nav>
              </Col>
              <Col>
                <TabContent activeTab={"vertical" + navState.vertical}>
                  <TabPane tabId="vertical1">
                    <Row>
                      <CardDeck>
                        {onHoldChannels.channels.length !== 0 ? (
                          onHoldChannels.channels.map((channel) => (
                            <Col md={4} key={channel.id}>
                              <Card className="campaign-card">
                                {channel.avatar !== null ? (
                                  <CardImg
                                    src={`${API_URL}${channel.avatar.formats.thumbnail.url}`}
                                    alt="Card image cap"
                                    className="campaign-img"
                                  />
                                ) : (
                                  <Skeleton
                                    variant="rect"
                                    width={256}
                                    height={186}
                                  />
                                )}
                                <CardBody>
                                  <CardTitle className="dashboard-card-title">
                                    {channel.name !== undefined ? (
                                      channel.name
                                    ) : (
                                      <Skeleton variant="text" />
                                    )}
                                  </CardTitle>
                                  <CardSubtitle>
                                    <strong>Thể loại:</strong>{" "}
                                    {channel.category.name !== null ? (
                                      channel.category.name
                                    ) : (
                                      <Skeleton variant="text" />
                                    )}
                                  </CardSubtitle>
                                  <CardSubtitle>
                                    <strong>Trạng thái:</strong>{" "}
                                    {renderChannelStatus(
                                      channel.employeeConfirm,
                                      channel.adminConfirm,
                                      channel.status
                                    )}
                                  </CardSubtitle>
                                  <CardSubtitle>
                                    <strong>
                                      Ngày tạo:
                                    </strong>
                                  </CardSubtitle>
                                  <CardSubtitle>
                                    <small className="text-muted">
                                      {channel.created_at !== undefined ? (
                                        new Date(
                                          channel.created_at
                                        ).toLocaleString("en-GB")
                                      ) : (
                                        <Skeleton variant="text" />
                                      )}
                                    </small>
                                  </CardSubtitle>
                                  <CardSubtitle>
                                    <strong>Người tạo:</strong>{" "}
                                    {channel.user.username !== null ? (
                                      channel.user.username
                                    ) : (
                                      <Skeleton variant="text" />
                                    )}
                                  </CardSubtitle>
                                  <Link
                                    href="/channel/[chid]"
                                    as={`/channel/${channel.id}`}
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
                      {approvedChannels.channels.length !== 0 ? (
                          approvedChannels.channels.map((channel) => (
                            <Col md={4} key={channel.id}>
                              <Card className="campaign-card">
                                {channel.avatar !== null ? (
                                  <CardImg
                                    src={`${API_URL}${channel.avatar.formats.thumbnail.url}`}
                                    alt="Card image cap"
                                    className="campaign-img"
                                  />
                                ) : (
                                  <Skeleton
                                    variant="rect"
                                    width={256}
                                    height={186}
                                  />
                                )}
                                <CardBody>
                                  <CardTitle className="dashboard-card-title">
                                    {channel.name !== undefined ? (
                                      channel.name
                                    ) : (
                                      <Skeleton variant="text" />
                                    )}
                                  </CardTitle>
                                  <CardSubtitle>
                                    <strong>Thể loại:</strong>{" "}
                                    {channel.category.name !== null ? (
                                      channel.category.name
                                    ) : (
                                      <Skeleton variant="text" />
                                    )}
                                  </CardSubtitle>
                                  <CardSubtitle>
                                    <strong>Trạng thái:</strong>{" "}
                                    {renderChannelStatus(
                                      channel.employeeConfirm,
                                      channel.adminConfirm,
                                      channel.status
                                    )}
                                  </CardSubtitle>
                                  <CardSubtitle>
                                    <strong>
                                      Ngày tạo:
                                    </strong>
                                  </CardSubtitle>
                                  <CardSubtitle>
                                    <small className="text-muted">
                                      {channel.created_at !== undefined ? (
                                        new Date(
                                          channel.created_at
                                        ).toLocaleString("en-GB")
                                      ) : (
                                        <Skeleton variant="text" />
                                      )}
                                    </small>
                                  </CardSubtitle>
                                  <CardSubtitle>
                                    <strong>Người tạo:</strong>{" "}
                                    {channel.user.username !== null ? (
                                      channel.user.username
                                    ) : (
                                      <Skeleton variant="text" />
                                    )}
                                  </CardSubtitle>
                                  <Link
                                    href="/channel/[chid]"
                                    as={`/channel/${channel.id}`}
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
                      {unApprovedChannels.channels.length !== 0 ? (
                          unApprovedChannels.channels.map((channel) => (
                            <Col md={4} key={channel.id}>
                              <Card className="campaign-card">
                                {channel.avatar !== null ? (
                                  <CardImg
                                    src={`${API_URL}${channel.avatar.formats.thumbnail.url}`}
                                    alt="Card image cap"
                                    className="campaign-img"
                                  />
                                ) : (
                                  <Skeleton
                                    variant="rect"
                                    width={256}
                                    height={186}
                                  />
                                )}
                                <CardBody>
                                  <CardTitle className="dashboard-card-title">
                                    {channel.name !== undefined ? (
                                      channel.name
                                    ) : (
                                      <Skeleton variant="text" />
                                    )}
                                  </CardTitle>
                                  <CardSubtitle>
                                    <strong>Thể loại:</strong>{" "}
                                    {channel.category.name !== null ? (
                                      channel.category.name
                                    ) : (
                                      <Skeleton variant="text" />
                                    )}
                                  </CardSubtitle>
                                  <CardSubtitle>
                                    <strong>Trạng thái:</strong>{" "}
                                    {renderChannelStatus(
                                      channel.employeeConfirm,
                                      channel.adminConfirm,
                                      channel.status
                                    )}
                                  </CardSubtitle>
                                  <CardSubtitle>
                                    <strong>
                                      Ngày tạo:
                                    </strong>
                                  </CardSubtitle>
                                  <CardSubtitle>
                                    <small className="text-muted">
                                      {channel.created_at !== undefined ? (
                                        new Date(
                                          channel.created_at
                                        ).toLocaleString("en-GB")
                                      ) : (
                                        <Skeleton variant="text" />
                                      )}
                                    </small>
                                  </CardSubtitle>
                                  <CardSubtitle>
                                    <strong>Người tạo:</strong>{" "}
                                    {channel.user.username !== null ? (
                                      channel.user.username
                                    ) : (
                                      <Skeleton variant="text" />
                                    )}
                                  </CardSubtitle>
                                  <Link
                                    href="/channel/[chid]"
                                    as={`/channel/${channel.id}`}
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

export default Admin;
