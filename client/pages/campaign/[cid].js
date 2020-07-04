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

  const [campaign, setCampaign] = useState({
    campaign: {},
  });

  const consoleLogger = () =>{
    console.log(campaign.campaign.picture)
  }

  useEffect(() => {
    if (state.jwt === "") Router.push("/login");
    else {
      const fetchCampaign = async () => {
        const get_resolve = await axios({
          method: "GET",
          headers: {
            Authorization: `Bearer ${state.jwt}`,
          },
          url: `${API_URL}/campaigns/${cid}`,
        });
        console.log(get_resolve.data);
        setCampaign({ campaign: get_resolve.data });
      };
      fetchCampaign();
    }
  }, [state]);

  if (state.jwt !== "")
    return (
      <Layout>
        <div className="wrapper">
          <div className="main">
            <Card>
              <CardBody>
                <Row>
                  {campaign.campaign !== undefined ? (
                    <Container>
                      <Card className="single-card">
                        {/* <CardImg
                        src={
                          campaign.campaign.picture[0] !== undefined
                          ? `
                          ${API_URL}${campaign.campaign.picture[0].formats.thumbnail.url}`
                          : "/256x186.svg"
                        }
                        alt="Card image cap"
                        className="campaign-img"
                      /> */}
                        <CardBody>
                          <CardTitle>{campaign.campaign.title}</CardTitle>
                          {/* <CardSubtitle>
                          <strong>Người tạo:</strong> {campaign.campaign.user.username}
                          </CardSubtitle>
                          <CardSubtitle>
                          <strong>Trạng thái:</strong>{" "}
                          {campaign.campaign.status ? "Hoạt động" : "Ngừng hoạt động"}
                          </CardSubtitle>
                          <CardSubtitle>
                          <strong>Ngày bắt đầu - Ngày kết thúc:</strong>
                          </CardSubtitle>
                          <CardSubtitle>
                          <small className="text-muted">
                          {new Date(
                            campaign.campaign.campaignTTL[0].open_datime
                            ).toLocaleString() +
                            " - " +
                            new Date(
                              campaign.campaign.campaignTTL[0].close_datetime
                              ).toLocaleString()}
                              </small>
                            </CardSubtitle> */}
                          <Button onClick={consoleLogger}>Tham gia</Button>
                        </CardBody>
                      </Card>
                    </Container>
                  ) : (
                    <Spinner color="light" />
                  )}
                </Row>
              </CardBody>
            </Card>
          </div>
        </div>
      </Layout>
    );
  else return null;
};

export default Post;
