import { useRouter } from "next/router";
import { useAuth } from "../../context/userContext";
import React, { useEffect, useState } from "react";
import Router from "next/router";
import dynamic from "next/dynamic";
const Layout = dynamic(() => import("../../components/layout"));
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

const Post = () => {
  const router = useRouter();
  const { cid } = router.query;
  const { state } = useAuth();
  const [isLoading, setLoading] = useState(true);

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

  useEffect(() => {
    if (state.jwt === "") Router.push("/login");
    else {
      const fetchCampaign = async () => {
        console.log(cid);
        const get_resolve = await axios({
          method: "GET",
          headers: {
            Authorization: `Bearer ${state.jwt}`,
          },
          url: `${API_URL}/campaigns/${cid}`,
        });
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
        setLoading(false);
      };
      fetchCampaign();
    }
  }, [state]);

  if (state.jwt !== "")
    return (
      <Layout>
        <div className="wrapper">
          <div className="main">
            <Container>
              <Card>
                <CardBody>
                  <Row>
                    {!isLoading ? (
                      <Container>
                        <Card className="single-card">
                          <CardImg
                            src={
                              campaign.picture[0].formats.medium !== undefined
                                ? `
                              ${API_URL}${campaign.picture[0].formats.medium.url}`
                                : "/256x186.svg"
                            }
                            alt="Card image cap"
                            className="campaign-detail-img"
                          />
                          <CardBody>
                            <CardTitle>{campaign.title}</CardTitle>
                            <CardText>{campaign.content}</CardText>
                            <CardSubtitle>
                              <strong>Thể loại:</strong>
                            </CardSubtitle>
                            <CardText>{campaign.category.name} - {campaign.category.description}</CardText>
                            <CardSubtitle>
                              <strong>Kênh:</strong>
                            </CardSubtitle>
                            <CardText><strong>{campaign.channels[0].name}</strong></CardText>
                            <CardText><strong>Website:</strong> <a href="##">{campaign.channels[0].website}</a></CardText>
                            <CardText><strong>Địa chỉ:</strong> {campaign.channels[0].address}</CardText>
                            <CardText><strong>Liên hệ:</strong> {campaign.channels[0].phone}</CardText>
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
                            <CardText>{campaign.user.username}</CardText>
                            <CardSubtitle>
                              <strong>Thời gian:</strong>
                            </CardSubtitle>
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
      </Layout>
    );
  else return null;
};

export default Post;
