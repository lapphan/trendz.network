import { useRouter, withRouter } from "next/router";
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
  Container,
  CardTitle,
  CardText,
  Row,
  Col,
  Spinner,
} from "reactstrap";

const { API_URL } = process.env;

const Post = () => {
  const router = useRouter();
  const { cid } = router.query;
  const { state } = useAuth();
  const [isLoading, setLoading] = useState(true);
  const signal = axios.CancelToken.source();
  const [campaign, setCampaign] = useState({
    campaignTTL: [],
    category: {},
    channels: [],
    content: "",
    picture: [],
    user: {},
    title: "",
    status: true,
  });

  const consoleLogger = () => {
    // console.log(campaign.campaignTTL[0].open_datime);
  };

  const renderImage = () => {
    if (campaign.picture[0] !== undefined) {
      if (campaign.picture[0].formats.medium !== undefined) {
        return API_URL+campaign.picture[0].formats.medium.url;
      }
      else return "/256x186.svg";  
    }
    else return "/256x186.svg";
  };

  useEffect(() => {
    if (state.jwt === "") Router.push("/login");
    else {
      let mounted = true;
      const url = API_URL + `/campaigns/${cid}`;
      const fetchCampaign = async () => {
        try {
          const get_resolve = await axios.get(url, {
            cancelToken: signal.token,
            headers: {
              Authorization: `Bearer ${state.jwt}`,
            },
          });
          if (mounted) {
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
          }
        } catch (error) {
          if (axios.isCancel(error) && error.message !== undefined) {
            console.log("Error: ", error.message);
          } else {
            throw error;
          }
        }
      };
      fetchCampaign().then(setLoading(false));
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
                        <Button onClick={consoleLogger}>Tham gia</Button>
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
