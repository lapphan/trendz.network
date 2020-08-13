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
} from 'reactstrap';

import Skeleton from '@material-ui/lab/Skeleton';

const { API_URL } = process.env;

const Customer = () => {
  const { state } = useAuth();
  const [navState, setNav] = useState({
    vertical: 1,
  });

  const [influencers, setInfluencers] = useState({
    influencers: [],
  });

  const [myCampaigns, setMyCampaigns] = useState({
    campaigns: [],
  });

  const signal = axios.CancelToken.source();

  const toggleTabs = (event, stateName, index) => {
    event.preventDefault();
    setNav((previousState) => {
      return { ...previousState, [stateName]: index };
    });
  };

  const renderStatus = (status) => {
    if (status !== null) {
      if (status) {
        return 'Đang hoạt động';
      } else return 'Không hoạt động';
    } else return 'Đang chờ kích hoạt';
  };

  useEffect(() => {
    let mountedCampaign = true;
    let mountedInfluencer = true;
    const campaignUrl = API_URL + '/campaigns';
    const influencersUrl = API_URL + '/users';
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
            setMyCampaigns({
              campaigns: get_resolve.data.filter(function (campaign) {
                return campaign.user.id == state.user.id;
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
    const fetchInfluencers = async () => {
      try {
        const get_resolve = await axios.get(influencersUrl, {
          cancelToken: signal.token,
          headers: {
            Authorization: `Bearer ${state.jwt}`,
          },
        });
        if (mountedInfluencer) {
          try {
            setInfluencers({
              influencers: get_resolve.data.filter(function (user) {
                return user.role.name == 'Influencer';
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
    fetchInfluencers();
    return function cleanup() {
      mountedCampaign = false;
      mountedInfluencer = false;
      signal.cancel();
    };
  }, []);
  return (
    <div className='wrapper'>
      <div className='main'>
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
                      Influencers
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: navState.vertical === 2,
                      })}
                      onClick={(e) => toggleTabs(e, 'vertical', 2)}
                    >
                      My Campaigns
                    </NavLink>
                  </NavItem>
                </Nav>
              </Col>
              <Col>
                <TabContent activeTab={'vertical' + navState.vertical}>
                  <Link href='/create'>
                    <Button color='primary' className='btn-create'>
                      Tạo Campaign
                    </Button>
                  </Link>
                  <TabPane tabId='vertical1'>
                    <Row>
                      <CardDeck>
                        {influencers.influencers.length !== 0 ? (
                          influencers.influencers.map((influencer) => (
                            <Col md={4} key={influencer.id}>
                              <Card className='campaign-card'>
                                {influencer.avatar !== null ? (
                                  <CardImg
                                    src={`${API_URL}${influencer.avatar.formats.thumbnail.url}`}
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
                                    {influencer.name !== null ? (
                                      influencer.name
                                    ) : (
                                      <Skeleton variant='text' />
                                    )}
                                  </CardTitle>
                                  <Link
                                    href='/influencer/[uid]'
                                    as={`/influencer/${influencer.id}`}
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
                        {myCampaigns.campaigns.length !== 0 ? (
                          myCampaigns.campaigns.map((campaign) => (
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
                                    {renderStatus(campaign.status)}
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
                </TabContent>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Customer;
