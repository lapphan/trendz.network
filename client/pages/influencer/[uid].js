import axios from "axios";
import { useRouter } from "next/router";
import { useAuth } from "../../context/userContext";
import React, { useEffect, useState } from "react";
import Router from "next/router";
import {
  Card,
  CardBody,
  CardImg,
  Container,
  CardTitle,
  CardText,
  CardDeck,
  Row,
  CardSubtitle,
  Button,
  Col
} from "reactstrap";
import Link from "next/link";
import { Skeleton } from "@material-ui/lab";

const { API_URL } = process.env;

const Influencer = () => {
  const router = useRouter();
  const { uid } = router.query;
  const { state } = useAuth();
  const signal = axios.CancelToken.source();
  const [influencer, setInfluencer] = useState(null);
  const [channels, setChannels] = useState([]);
  
  const renderChannelStatus = (employeeConfirm, adminConfirm, status) => {
    if (
      employeeConfirm == null ||
      (employeeConfirm == true && adminConfirm == null)
    ) {
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
    if (state.jwt === "") Router.push("/login");
    else {
      let mounted = true;
      const fetchInfluencer = async () => {
        const url = API_URL + `/users?_where[id]=${uid}`;
        try {
          const get_resolve = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${state.jwt}`,
            },
          });
          if (mounted) {
            try {
              setInfluencer(get_resolve.data[0]);
              setChannels(get_resolve.data[0].channels.filter((x)=>x.status!==null))
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
      fetchInfluencer();

      return function cleanup() {
        mounted = false;
        signal.cancel();
      };
    }
  }, []);

  return (
    <div className="wrapper">
      <div className="main">
        <Card>
          <Container>
            {influencer != null ? (
              <Card className="single-card">
                <CardImg
                  src={
                    influencer.avatar.formats !== null
                      ? `${API_URL}${influencer.avatar.formats.thumbnail.url}`
                      : `${API_URL}${influencer.avatar.url}`
                  }
                  alt="Card image cap"
                  className="campaign-detail-img"
                />
                <CardBody>
                  <CardTitle>{influencer.name}</CardTitle>
                  <CardText>{influencer.username}</CardText>
                <br/>
                <CardTitle>Các kênh thuộc sở hữu của {influencer.name}:</CardTitle>
                </CardBody>
                <CardBody>
                <Row>
                      <CardDeck>
                        {channels.length !== 0 ? (
                          channels.map((channel) => (
                            <Col md={4} key={channel.id}>
                              <Card className="campaign-card">
                                {channel.avatar.formats !== null ? (
                                  <CardImg
                                    src={`${API_URL}${channel.avatar.formats.thumbnail.url}`}
                                    alt="Card image cap"
                                    className="campaign-img"
                                  />
                                ) : (
                                  <Skeleton
                                    variant="rect"
                                    width={350}
                                    height={300}
                                  />
                                )}
                                <CardBody>
                                  <CardSubtitle>
                                    {channel.name !== undefined ? (
                                      <strong>{channel.name}</strong>
                                    ) : (
                                      <Skeleton variant="text" />
                                    )}
                                  </CardSubtitle>
                                  <CardText>
                                    <strong>Trạng thái:</strong>{" "}
                                    {renderChannelStatus(
                                      channel.employeeConfirm,
                                      channel.adminConfirm,
                                      channel.status
                                    )}
                                  </CardText>
                                  <CardText>
                                    <strong>Mức giá:</strong>{" "}
                                    {channel.price} VNĐ
                                  </CardText>
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
                          ""
                        )}
                      </CardDeck>
                    </Row>
                </CardBody>
              </Card>
            ) : (
              <Card className="single-card">
                <Skeleton variant="rect" width={256} height={186} />
              </Card>
            )}
          </Container>
        </Card>
      </div>
    </div>
  );
};

export default Influencer;
