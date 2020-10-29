import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/userContext';

import axios from 'axios';
import Link from 'next/link';
import classnames from 'classnames';
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
} from 'reactstrap';

import Skeleton from '@material-ui/lab/Skeleton';

import { sortBy } from '../../../utils/filters/sortBy';
const { API_URL } = process.env;

const Influencer = () => {
  const { state } = useAuth();
  const [navState, setNav] = useState({
    vertical: 1,
  });

  const [channels, setChannels] = useState({
    channels: [],
  });

  const [categories, setCategories] = useState({
    categories: [],
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

  const [filterItems, setFilterItems] = useState({
    category: '',
    sort: '',
    search: '',
  });

  const [query, setQuery] = useState(`?_where[channels.user]=${state.user.id}`);

  const toggleTabs = (event, stateName, index) => {
    event.preventDefault();
    setNav((previousState) => {
      return { ...previousState, [stateName]: index };
    });
    setQuery('?');
    setFilterItems({
      category: '',
      sort: '',
      search: '',
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
      category: '',
      sort: '',
      search: '',
    });
  };

  const renderStatus = (approvalStatus, influencerStatus, status) => {
    if (approvalStatus == true && influencerStatus == null) {
      return 'Đang chờ influencer chấp thuận';
    }
    if (approvalStatus == true && influencerStatus == true) {
      return 'Đã được chấp thuận - Đang thực hiện';
    }
    if (approvalStatus == true && influencerStatus == false) {
      return 'Đã được cấp phép - Influencer đã từ chối';
    }
    if (approvalStatus && influencerStatus && status == false) {
      return 'Đã được cấp phép - Influencer đã chấp thuận - Đang hoạt động';
    } else return 'Đã được cấp phép - Influencer đã chấp thuận - Đã kết thúc';
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
    let query = `?_where[channels.user]=${state.user.id}`;
    if (filterItems.search !== '')
      query += '&title_contains=' + filterItems.search;
    if (filterItems.category !== '')
      query += '&_where[category.id]=' + filterItems.category;
    if (filterItems.sort !== '') query += '&' + filterItems.sort;
    setQuery(query);
  }, [filterItems]);

  useEffect(() => {
    let mountedCampaign = true;
    let mountedCategory = true;
    const campaignUrl =
      API_URL + `/campaigns?_where[channels.user]=${state.user.id}`;
    console.log(campaignUrl);
    const categoryUrl = API_URL + '/categories';
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
                return campaign.approve == true && campaign.status == null;
              }),
            });
            setApprovedCampaigns({
              campaigns: get_resolve.data.filter(function (campaign) {
                return campaign.approve && campaign.status == true;
              }),
            });
            setUnapprovedCampaigns({
              campaigns: get_resolve.data.filter(function (campaign) {
                return campaign.approve == true && campaign.status == false;
              }),
            });
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        if (axios.isCancel(error) && error.message !== undefined) {
          console.log('Error: ', error.message);
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
          console.log('Error: ', error.message);
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
            setChannels({
              channels: get_resolve.data,
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
    fetchCategories();
    fetchChannels();
    return function cleanup() {
      mountedCampaign = false;
      mountedCategory = false;
      mountedChannel = false;
      signal.cancel();
    };
  }, []);

  useEffect(() => {
    let mountedCampaign = true;
    let campaignUrl;

    if (query !== '?undefined') {
      campaignUrl = API_URL + '/campaigns' + query;
    } else campaignUrl = API_URL + '/campaigns';
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
                return campaign.approve == true && campaign.status == null;
              }),
            });
            setApprovedCampaigns({
              campaigns: get_resolve.data.filter(function (campaign) {
                return campaign.approve && campaign.status == true;
              }),
            });
            setUnapprovedCampaigns({
              campaigns: get_resolve.data.filter(function (campaign) {
                return campaign.approve == true && campaign.status == false;
              }),
            });
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        if (axios.isCancel(error) && error.message !== undefined) {
          console.log('Error: ', error.message);
        }
      }
    };
    fetchCampaign();
    return function cleanup() {
      mountedCampaign = false;
      signal.cancel();
    };
  }, [query]);

  return (
    <div className="wrapper">
      <div className="main">
  
          <Button color="primary" className="btn-create" href="/create-channel">
            Tạo Channel
          </Button>
        
        <Card>
          <CardBody>
            <Row>
              <Col md='2'>
                <Nav className='nav-pills-primary flex-column' pills>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: navState.vertical === 1,
                      })}
                      onClick={(e) => toggleTabs(e, 'vertical', 1)}
                    >
                      Campaign requests
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: navState.vertical === 2,
                      })}
                      onClick={(e) => toggleTabs(e, 'vertical', 2)}
                    >
                      Approved Campaigns
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: navState.vertical === 3,
                      })}
                      onClick={(e) => toggleTabs(e, 'vertical', 3)}
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
                      Channel của tôi
                    </NavLink>
                  </NavItem>
                </Nav>
              </Col>
              <Col>
                <TabContent activeTab={'vertical' + navState.vertical}>
                  <Row style={{ marginTop: '30px' }}>
                    <Col>
                      <Row>
                        <CardSubtitle>Tìm kiếm</CardSubtitle>
                      </Row>
                      <Row>
                        <Input
                          type='text'
                          value={filterItems.search}
                          name='search'
                          id='search'
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
                            color='secondary'
                            data-toggle='dropdown'
                            className='mydropdown'
                          >
                            {filterItems.category === ''
                              ? 'Chọn Danh mục...'
                              : categories.categories.find(
                                  (category) =>
                                    category.id === filterItems.category
                                ).name}
                          </DropdownToggle>
                          <DropdownMenu className='dropdown-menu'>
                            {categories.categories.map((category) => (
                              <DropdownItem
                                key={category.id}
                                onClick={(event) => {
                                  event.preventDefault();
                                  handleFilterItemsChange(
                                    'category',
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
                            color='secondary'
                            data-toggle='dropdown'
                            className='mydropdown'
                          >
                            {filterItems.sort === ''
                              ? 'Sắp xếp theo...'
                              : sortBy.find(
                                  (sort) => sort.value === filterItems.sort
                                ).type}
                          </DropdownToggle>
                          <DropdownMenu className='dropdown-menu'>
                            {sortBy.map((sort) => (
                              <DropdownItem
                                key={sort.id}
                                onClick={(event) => {
                                  event.preventDefault();
                                  handleFilterItemsChange('sort', sort.value);
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
                          color='warning'
                          style={{ marginTop: '19px' }}
                        >
                          Làm sạch bộ lọc
                        </Button>
                      </Row>
                    </Col>
                  </Row>
                  <Link href='/create-channel'>
                    <Button color='primary' className='btn-create'>
                      Tạo Channel
                    </Button>
                  </Link>
                  <TabPane tabId='vertical1'>
                    <Row>
                      <CardDeck>
                        {onHoldCampaigns.campaigns.length !== 0 ? (
                          onHoldCampaigns.campaigns.map((campaign) => (
                            <Col md={4} key={campaign.id}>
                              <Card className='campaign-card'>
                                {campaign.picture[0] !== undefined ? (
                                  <CardImg
                                    src={`${API_URL}${campaign.picture[0].formats.thumbnail.url}`}
                                    alt='Card image cap'
                                    className='campaign-img'
                                  />
                                ) : (
                                  <Skeleton
                                    variant='rect'
                                    width={256}
                                    height={186}
                                  />
                                )}
                                <CardBody>
                                  <CardTitle className='dashboard-card-title'>
                                    {campaign.title !== undefined ? (
                                      campaign.title
                                    ) : (
                                      <Skeleton variant='text' />
                                    )}
                                  </CardTitle>
                                  <CardSubtitle>
                                    <strong>Người tạo:</strong>{' '}
                                    {campaign.user !== null ? (
                                      campaign.user.username
                                    ) : (
                                      <Skeleton variant='text' />
                                    )}
                                  </CardSubtitle>
                                  <CardSubtitle>
                                    <strong>Trạng thái:</strong>{' '}
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
                                    <small className='text-muted'>
                                      {campaign.campaignTTL[0] !== undefined ? (
                                        new Date(
                                          campaign.campaignTTL[0].open_datetime
                                        ).toLocaleString('en-GB') +
                                        ' - ' +
                                        new Date(
                                          campaign.campaignTTL[0].close_datetime
                                        ).toLocaleString('en-GB')
                                      ) : (
                                        <Skeleton variant='text' />
                                      )}
                                    </small>
                                  </CardSubtitle>
                                  <Link
                                    href='/campaign/[cid]'
                                    as={`/campaign/${campaign.id}`}
                                  >
                                    <Button>Chi tiết</Button>
                                  </Link>
                                </CardBody>
                              </Card>
                            </Col>
                          ))
                        ) : (
                          <Spinner color='light' />
                        )}
                      </CardDeck>
                    </Row>
                  </TabPane>
                  <TabPane tabId='vertical2'>
                    <Row>
                      <CardDeck>
                        {approvedCampaigns.campaigns.length !== 0 ? (
                          approvedCampaigns.campaigns.map((campaign) => (
                            <Col md={4} key={campaign.id}>
                              <Card className='campaign-card'>
                                <CardImg
                                  src={
                                    campaign.picture[0] !== undefined
                                      ? `
                                        ${API_URL}${campaign.picture[0].formats.thumbnail.url}`
                                      : '/256x186.svg'
                                  }
                                  alt='Card image cap'
                                  className='campaign-img'
                                />
                                <CardBody>
                                  <CardTitle className='dashboard-card-title'>
                                    {campaign.title}
                                  </CardTitle>
                                  <CardSubtitle>
                                    <strong>Người tạo:</strong>{' '}
                                    {campaign.user.username}
                                  </CardSubtitle>
                                  <CardSubtitle>
                                    <strong>Trạng thái:</strong>{' '}
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
                                        ).toLocaleString('en-GB') +
                                        ' - ' +
                                        new Date(
                                          campaign.campaignTTL[0].close_datetime
                                        ).toLocaleString('en-GB')
                                      ) : (
                                        <Skeleton variant='text' />
                                      )}
                                    </small>
                                  </CardSubtitle>

                                  <Link
                                    href='/campaign/[cid]'
                                    as={`/campaign/${campaign.id}`}
                                  >
                                    <Button>Chi tiết</Button>
                                  </Link>
                                </CardBody>
                              </Card>
                            </Col>
                          ))
                        ) : (
                          <Spinner color='light' />
                        )}
                      </CardDeck>
                    </Row>
                  </TabPane>
                  <TabPane tabId='vertical3'>
                    <Row>
                      <CardDeck>
                        {unapprovedCampaigns.campaigns.length !== 0 ? (
                          unapprovedCampaigns.campaigns.map((campaign) => (
                            <Col md={4} key={campaign.id}>
                              <Card className='campaign-card'>
                                <CardImg
                                  src={
                                    campaign.picture[0] !== undefined
                                      ? `
                                        ${API_URL}${campaign.picture[0].formats.thumbnail.url}`
                                      : '/256x186.svg'
                                  }
                                  alt='Card image cap'
                                  className='campaign-img'
                                />
                                <CardBody>
                                  <CardTitle className='dashboard-card-title'>
                                    {campaign.title}
                                  </CardTitle>
                                  <CardSubtitle>
                                    <strong>Người tạo:</strong>{' '}
                                    {campaign.user.username}
                                  </CardSubtitle>
                                  <CardSubtitle>
                                    <strong>Trạng thái:</strong>{' '}
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
                                    <small className='text-muted'>
                                      {new Date(
                                        campaign.campaignTTL[0].open_datetime
                                      ).toLocaleString('en-GB') +
                                        ' - ' +
                                        new Date(
                                          campaign.campaignTTL[0].close_datetime
                                        ).toLocaleString('en-GB')}
                                    </small>
                                  </CardSubtitle>

                                  <Link
                                    href='/campaign/[cid]'
                                    as={`/campaign/${campaign.id}`}
                                  >
                                    <Button>Chi tiết</Button>
                                  </Link>
                                </CardBody>
                              </Card>
                            </Col>
                          ))
                        ) : (
                          <Spinner color='light' />
                        )}
                      </CardDeck>
                    </Row>
                  </TabPane>
                  <TabPane tabId="vertical4">
                    <Row>
                      <CardDeck>
                        {channels.channels.length !== 0 ? (
                          channels.channels.map((channel) => (
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
                                    width={350}
                                    height={320}
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

export default Influencer;
