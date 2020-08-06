import { useRouter, withRouter } from "next/router";
import { useAuth } from "../../context/userContext";
import React, { useEffect, useState } from "react";
import Router from "next/router";
import axios from "axios";
import Datetime from "react-datetime";
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
  Modal,
  ModalBody,
  ModalFooter,
  Spinner,
  Form,
  FormGroup,
  Label,
  Input,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

const { API_URL } = process.env;

const Influencer = () => {
  const router = useRouter();
  const { uid } = router.query;
  const { state } = useAuth();
  const [isLoading, setLoading] = useState(true);
  const signal = axios.CancelToken.source();
  const [influencer, setInfluencer] = useState({
    info: {},
  });

  const renderImage = () => {
    if (influencer.info.avatar !== undefined) {
      if (influencer.info.avatar.formats.thumbnail !== undefined) {
        return API_URL + influencer.info.avatar.formats.thumbnail.url;
      } else return "/256x186.svg";
    } else return "/256x186.svg";
  };

  useEffect(() => {
    if (state.jwt === "") Router.push("/login");
    else {
      let mounted = true;
      try {
        const fetchInfluencer = async () => {
          const url = API_URL + `/users/${uid}`;
          const get_resolve = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${state.jwt}`,
            },
          });
          if (mounted) {
            setInfluencer({
              info: get_resolve.data,
            });
          }
        };
        fetchInfluencer().then(setLoading(false));;
      } catch (error) {
        if (axios.isCancel(error) && error.message !== undefined) {
          console.log("Error: ", error.message);
        }
      }

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
                        <CardTitle>{influencer.info.name}</CardTitle>
                        <CardText>{influencer.info.username}</CardText>
                        <CardSubtitle>
                          <strong>Thể loại:</strong>
                        </CardSubtitle>
                        
                          <CardText>
                            {influencer.info.categoryDetail} -{" "}
                            {influencer.info.categoryDescription}
                          </CardText>
                        
                        <CardSubtitle>
                          <strong>Kênh:</strong>
                        </CardSubtitle>
                        {influencer.info.channels !== undefined ? (
                          <>
                            <CardText>
                              <strong>{influencer.info.channels[0].name}</strong>
                            </CardText>
                            <CardText>
                              <strong>Website:</strong>{" "}
                              <a href="##">{influencer.info.channels[0].website}</a>
                            </CardText>
                            <CardText>
                              <strong>Địa chỉ:</strong>{" "}
                              {influencer.info.channels[0].address}
                            </CardText>
                            <CardText>
                              <strong>Liên hệ:</strong>{" "}
                              {influencer.info.channels[0].phone}
                            </CardText>
                          </>
                        ) : (
                          ""
                        )}
                        
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

export default withRouter(Influencer);