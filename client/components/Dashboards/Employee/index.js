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
  Input,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import Skeleton from "@material-ui/lab/Skeleton";

import { sortBy } from "../../../utils/filters/sortBy";

const { API_URL } = process.env;

const Employee = () => {
  const { state } = useAuth();
  const [navState, setNav] = useState({
    vertical: 1,
  });

  const [categories, setCategories] = useState({
    categories: [],
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

  const [onHoldCampaigns, setOnHoldCampaigns] = useState({
    campaigns: [],
  });

  const [approvedCampaigns, setApprovedCampaigns] = useState({
    campaigns: [],
  });

  const [unApprovedCampaigns, setUnApprovedCampaigns] = useState({
    campaigns: [],
  });

  const [filterItems, setFilterItems] = useState({
    category: "",
    sort: "",
    search: "",
  });

  const [query, setQuery] = useState("?");

  const signal = axios.CancelToken.source();

  const toggleTabs = (event, stateName, index) => {
    event.preventDefault();
    setNav((previousState) => {
      return { ...previousState, [stateName]: index };
    });
    setQuery("?");
    setFilterItems({
      category: "",
      sort: "",
      search: "",
    });
  };

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setFilterItems((previousState) => {
      return {
        ...previousState,
        [name]: value,
      };
    });
  };

  const handleFilterItemsChange = (name, value) => {
    setFilterItems((previousState) => {
      return {
        ...previousState,
        [name]: value,
      };
    });
  };

  const handleClearFilter = () => {
    setFilterItems({
      category: "",
      sort: "",
      search: "",
    });
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
    if (approvalStatus && influencerStatus && status == false) {
      return "Đã được cấp phép - Influencer đã chấp thuận - Đang hoạt động";
    } else return "Đã được cấp phép - Influencer đã chấp thuận - Đã kết thúc";
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
    let query = "?";
    if (filterItems.search !== "" && query === "?") {
      query += "title_contains=" + filterItems.search;
    } else if (filterItems.search !== "" && query !== "?")
      query += "&title_contains=" + filterItems.search;
    if (filterItems.category !== "" && query === "?") {
      query += "_where[category.id]=" + filterItems.category;
    } else if (filterItems.category !== "" && query !== "?")
      query += "&_where[category.id]=" + filterItems.category;
    if (filterItems.sort !== "" && query === "?") {
      query += filterItems.sort;
    } else if (filterItems.sort !== "" && query !== "?")
      query += "&" + filterItems.sort;
    setQuery(query);
  }, [filterItems]);

  useEffect(() => {
    let mountedCampaign = true;
    let campaignUrl;
    if (query !== "?undefined") {
      campaignUrl = API_URL + "/campaigns" + query;
    } else campaignUrl = API_URL + "/campaigns";
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
            setUnApprovedCampaigns({
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
  }, [query]);

  useEffect(() => {
    let mountedCampaign = true;
    let mountedCategory = true;
    let mountedChannel = true;
    const campaignUrl = API_URL + "/campaigns";
    const categoryUrl = API_URL + "/categories";
    const channelUrl = API_URL + "/channels";
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
    const fetchCategories = async () => {
      try {
        const get_resolve = await axios.get(categoryUrl, {
          cancelToken: signal.token,
          headers: {
            Authorization: `Bearer ${state.jwt}`,
          },
        });
        if (mountedCategory) {
          try {
            setCategories({
              categories: get_resolve.data,
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
                  return channel.employeeConfirm == null;
                }),
              });
              setApprovedChannels({
                channels: get_resolve.data.filter(function (channel) {
                  return channel.employeeConfirm == true;
                }),
              });
              setUnApprovedChannels({
                channels: get_resolve.data.filter(function (channel) {
                  return channel.employeeConfirm == false;
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
    fetchCampaign();
    fetchCategories();
    fetchChannels();
    return function cleanup() {
      mountedCampaign = false;
      mountedCategory = false;
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
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: navState.vertical === 4,
                      })}
                      onClick={(e) => toggleTabs(e, "vertical", 4)}
                    >
                      Channel requests
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: navState.vertical === 5,
                      })}
                      onClick={(e) => toggleTabs(e, "vertical", 5)}
                    >
                      Approved Channels
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: navState.vertical === 6,
                      })}
                      onClick={(e) => toggleTabs(e, "vertical", 6)}
                    >
                      Unapproved Channels
                    </NavLink>
                  </NavItem>
                </Nav>
              </Col>
              <Col>
                <TabContent activeTab={"vertical" + navState.vertical}>
                  {navState.vertical <= 3 ? (
                    <Row style={{ marginTop: "30px" }}>
                      <Col>
                        <Row>
                          <CardSubtitle>Tìm kiếm</CardSubtitle>
                        </Row>
                        <Row>
                          <Input
                            type="text"
                            value={filterItems.search}
                            name="search"
                            id="search"
                            onChange={handleSearchChange}
                          />
                        </Row>
                      </Col>
                      <Col>
                        <Row>
                          <CardSubtitle>Danh mục</CardSubtitle>
                        </Row>
                        <Row>
                          <UncontrolledDropdown group>
                            <DropdownToggle
                              caret
                              color="secondary"
                              data-toggle="dropdown"
                              className="mydropdown"
                            >
                              {filterItems.category === ""
                                ? "Chọn Danh mục..."
                                : categories.categories.find(
                                    (category) =>
                                      category.id === filterItems.category
                                  ).name}
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu">
                              {categories.categories.map((category) => (
                                <DropdownItem
                                  key={category.id}
                                  onClick={(event) => {
                                    event.preventDefault();
                                    handleFilterItemsChange(
                                      "category",
                                      category.id
                                    );
                                  }}
                                >
                                  {category.name}
                                </DropdownItem>
                              ))}
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </Row>
                      </Col>
                      <Col>
                        <Row>
                          <CardSubtitle>Sắp xếp theo</CardSubtitle>
                        </Row>
                        <Row>
                          <UncontrolledDropdown group>
                            <DropdownToggle
                              caret
                              color="secondary"
                              data-toggle="dropdown"
                              className="mydropdown"
                            >
                              {filterItems.sort === ""
                                ? "Sắp xếp theo..."
                                : sortBy.find(
                                    (sort) => sort.value === filterItems.sort
                                  ).type}
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu">
                              {sortBy.map((sort) => (
                                <DropdownItem
                                  key={sort.id}
                                  onClick={(event) => {
                                    event.preventDefault();
                                    handleFilterItemsChange("sort", sort.value);
                                  }}
                                >
                                  {sort.type}
                                </DropdownItem>
                              ))}
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </Row>
                      </Col>
                      <Col>
                        <Row>
                          <CardSubtitle></CardSubtitle>
                        </Row>
                        <Row>
                          <Button
                            onClick={handleClearFilter}
                            color="warning"
                            style={{ marginTop: "19px" }}
                          >
                            Làm sạch bộ lọc
                          </Button>
                        </Row>
                      </Col>
                    </Row>
                  ) : (
                    ""
                  )}
                  <TabPane tabId="vertical1">
                    <Row>
                      <CardDeck>
                        {onHoldCampaigns.campaigns.length !== 0 ? (
                          onHoldCampaigns.campaigns.map((campaign) => (
                            <Col md={4} key={campaign.id}>
                              <Card className="campaign-card">
                                {campaign.picture[0] !== undefined ? (
                                  <CardImg
                                    src={`${API_URL}${campaign.picture[0].formats.thumbnail.url}`}
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
                                    {campaign.title !== undefined ? (
                                      campaign.title
                                    ) : (
                                      <Skeleton variant="text" />
                                    )}
                                  </CardTitle>
                                  <CardSubtitle>
                                    <strong>Người tạo:</strong>{" "}
                                    {campaign.user !== null ? (
                                      campaign.user.username
                                    ) : (
                                      <Skeleton variant="text" />
                                    )}
                                  </CardSubtitle>
                                  <CardSubtitle>
                                    <strong>Trạng thái:</strong>{" "}
                                    {renderStatus(
                                      campaign.approve,
                                      campaign.status,
                                      campaign.completed
                                    )}
                                  </CardSubtitle>
                                  <CardSubtitle>
                                    <strong>
                                      Ngày bắt đầu - Ngày kết thúc:
                                    </strong>
                                  </CardSubtitle>
                                  <CardSubtitle>
                                    <small className="text-muted">
                                      {campaign.campaignTTL[0] !== undefined ? (
                                        new Date(
                                          campaign.campaignTTL[0].open_datetime
                                        ).toLocaleString("en-GB") +
                                        " - " +
                                        new Date(
                                          campaign.campaignTTL[0].close_datetime
                                        ).toLocaleString("en-GB")
                                      ) : (
                                        <Skeleton variant="text" />
                                      )}
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
                                    {renderStatus(
                                      campaign.approve,
                                      campaign.status,
                                      campaign.completed
                                    )}
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
                        {unApprovedCampaigns.campaigns.length !== 0 ? (
                          unApprovedCampaigns.campaigns.map((campaign) => (
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
                                    {renderStatus(
                                      campaign.approve,
                                      campaign.status,
                                      campaign.completed
                                    )}
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
                  <TabPane tabId="vertical4">
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
                  <TabPane tabId="vertical5">
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
                  <TabPane tabId="vertical6">
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

export default Employee;
