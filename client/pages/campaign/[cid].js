import { useAuth } from "../../context/userContext";
import React, { useEffect, useState } from "react";
import Router from "next/router";
import axios from "axios";
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardSubtitle,
  CardTitle,
  CardText,
  Row,
} from "reactstrap";

import { CircularProgress } from "@material-ui/core";

import CustomerCampaignPage from "../../components/Campaign/Customer";
import EmployeeCampaignPage from "../../components/Campaign/Employee";
import InfluencerCampaignPage from "../../components/Campaign/Influencer";

const { API_URL } = process.env;

const Post = ({ cid }) => {
  const { state } = useAuth();
  const signal = axios.CancelToken.source();
  const [campaign, setCampaign] = useState({
    campaignTTL: [
      {
        open_datetime: "",
        close_datetime: "",
      },
    ],
    approve: null,
    completed: null,
    category: {},
    channels: [],
    content: "",
    picture: [],
    user: {},
    title: "",
    status: null,
    created_at: "",
    updated_at: "",
    id: "",
  });
  const [categories, setCategories] = useState({
    categories: [],
  });

  const [messages, setMessages] = useState([]);

  const [influencer, setInfluencer] = useState({
    user: {},
  });

  const RenderRole = () => {
    if (state.user.id == campaign.channels[0].user) {
      console.log(campaign);
      console.log(categories);
      return (
        <InfluencerCampaignPage
          categories={categories}
          campaign={campaign}
          cid={cid}
          messages={messages}
        />
      );
    } else if (state.user.id == campaign.user.id) {
      return (
        <CustomerCampaignPage
          campaign={campaign}
          categories={categories}
          cid={cid}
          messages={messages}
        />
      );
    } else if (state.user.role.name == "Employee") {
      return (
        <EmployeeCampaignPage
          campaign={campaign}
          influencer={influencer}
          cid={cid}
          messages={messages}
        />
      );
    } else
      return (
        <Row>
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
              <Button color="success">Liên hệ TrendZ</Button>
            </CardBody>
          </Card>
          ) : (
          <Spinner />
        </Row>
      );
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
    if (approvalStatus && influencerStatus && status == false) {
      return "Đã được cấp phép - Influencer đã chấp thuận - Đang hoạt động";
    } else return "Đã được cấp phép - Influencer đã chấp thuận - Đã kết thúc";
  };

  useEffect(() => {
    if (state.jwt === "") Router.push("/login");
    else {
      let mountedData = true;
      //let mountedCategories = true;
      //let mountedInfluencer = true;
      //let mountedCampaignDetails = true;

      const fetchData = async () => {
        const campaign_url = API_URL + `/campaigns/${cid}`;

        const campaignDetail_url =
          API_URL + `/campaign-details?_where[campaign.id]=${cid}`;
        const categories_url = API_URL + "/categories";
        try {
          //axios GET methods
          const get_messages = await axios.get(campaignDetail_url, {
            cancelToken: signal.token,
            headers: {
              Authorization: `Bearer ${state.jwt}`,
            },
          });

          const get_categories = await axios.get(categories_url, {
            cancelToken: signal.token,
            headers: {
              Authorization: `Bearer ${state.jwt}`,
            },
          });

          const get_campaign = await axios.get(campaign_url, {
            cancelToken: signal.token,
            headers: {
              Authorization: `Bearer ${state.jwt}`,
            },
          });

          const influencer_url =
            API_URL + `/users/${get_campaign.data.channels[0].user}`;
          const get_influencer = await axios.get(influencer_url, {
            cancelToken: signal.token,
            headers: {
              Authorization: `Bearer ${state.jwt}`,
            },
          });
          //setState methods
          if (mountedData) {
            try {
              setInfluencer({
                user: get_influencer.data,
              });

              if (get_messages.data[0] !== undefined) {
                var fetchedMessages = get_messages.data[0].chatLog.map(
                  function (message) {
                    if (message.userMessage != null) {
                      var userAvatar = "/256x186.svg";
                      if (get_resolve.data.user.avatar !== null) {
                        userAvatar = `${API_URL}${get_resolve.data.user.avatar.formats.thumbnail.url}`;
                      }
                      var log = {
                        text: message.userMessage,
                        id: `${message.id}`,
                        sender: {
                          name: get_resolve.data.user.username,
                          uid: "customer",
                          avatar: userAvatar,
                        },
                      };
                      return log;
                    }
                    if (message.influencerMessage != null) {
                      var userAvatar = "/256x186.svg";
                      console.log(get_influencer.data);
                      if (get_influencer.data.avatar !== null) {
                        userAvatar = `${API_URL}${get_influencer.data.user.avatar.formats.thumbnail.url}`;
                      }
                      var log = {
                        text: message.influencerMessage,
                        id: `${message.id}`,
                        sender: {
                          name: get_influencer.data.username,
                          uid: "influencer",
                          avatar: userAvatar,
                        },
                      };
                      return log;
                    }
                  }
                );
              }
              setMessages(fetchedMessages);

              setCategories({
                categories: get_categories.data,
              });

              setCampaign({
                user: get_campaign.data.user,
                campaignTTL: get_campaign.data.campaignTTL,
                category: get_campaign.data.category,
                channels: get_campaign.data.channels,
                picture: get_campaign.data.picture,
                status: get_campaign.data.status,
                title: get_campaign.data.title,
                content: get_campaign.data.content,
                approve: get_campaign.data.approve,
                completed: get_campaign.data.completed,
                created_at: get_campaign.data.created_at,
                updated_at: get_campaign.data.updated_at,
                id: get_campaign.data.id,
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
      fetchData();
      return function cleanup() {
        mountedData = false;
        signal.cancel();
      };
    }
  }, []);

  return (
    <div className="wrapper">
      <div className="main">
          {campaign.content !== "" ? (
        <Card>
            <CardBody>
              <RenderRole />
            </CardBody>
        </Card>
          ) : (
            <Card>
              <br/>
              <CircularProgress />
              <br/>
            </Card>
          )}
      </div>
    </div>
  );
};

export async function getStaticPaths() {
  const campaignIdsUrl = API_URL + "/campaigns/getid";
  const get_resolve = await axios.get(campaignIdsUrl);
  const campaignIds = get_resolve.data;
  const paths = campaignIds.map((campaignId) => ({
    params: { cid: campaignId.id.toString() },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const cid = params.cid;
  return {
    props: { cid },
  };
}

export default Post;
