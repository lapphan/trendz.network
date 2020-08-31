import { useRouter } from "next/router";
import { useAuth } from "../../context/userContext";
import React, { useEffect, useState } from "react";
import Router from "next/router";
import axios from "axios";
import {
  Card,
  CardBody,
  CardImg,
  CardSubtitle,
  Container,
  CardTitle,
  CardText,
} from "reactstrap";

const { API_URL } = process.env;

const Influencer = () => {
  const router = useRouter();
  const { uid } = router.query;
  const { state } = useAuth();
  const signal = axios.CancelToken.source();
  const [influencer, setInfluencer] = useState({
    info: {},
  });

  const renderImage = () => {
    console.log(influencer);
    if (
      influencer.info.user.avatar !== undefined &&
      influencer.info.user.avatar !== null
    ) {
      if (influencer.info.user.avatar.formats.thumbnail !== undefined) {
        return API_URL + influencer.info.user.avatar.formats.thumbnail.url;
      } else return "/256x186.svg";
    } else return "/256x186.svg";
  };

  useEffect(() => {
    if (state.jwt === "") Router.push("/login");
    else {
      let mounted = true;
      try {
        const fetchInfluencer = async () => {
          const url = API_URL + `/channels?_where[user.id]=${uid}`;
          const get_resolve = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${state.jwt}`,
            },
          });
          if (mounted) {
            console.log(get_resolve.data);
            setInfluencer({
              info: get_resolve.data[0],
            });
          }
        };
        fetchInfluencer()
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
          <Card>
                  <Container>
                    {influencer.info.user !==undefined ? (
                      <Card className="single-card">
                      <CardImg
                        src={renderImage()}
                        alt="Card image cap"
                        className="campaign-detail-img"
                      />
                      <CardBody>
                        <CardTitle>{influencer.info.user.name}</CardTitle>
                        <CardText>{influencer.info.user.username}</CardText>

                        <CardSubtitle>
                          <strong>Thể loại:</strong>
                        </CardSubtitle>

                        <CardText>
                          {influencer.info.category.name} -{" "}
                          {influencer.info.category.description}
                        </CardText>

                        <CardSubtitle>
                          <strong>Kênh:</strong>
                        </CardSubtitle>
                        {influencer.info !== undefined ? (
                          <>
                            <CardText>
                              <strong>
                                {influencer.info.name}
                              </strong>
                            </CardText>
                            <CardText>
                              <strong>Website:</strong>{" "}
                              <a href="##">
                                {influencer.info.website}
                              </a>
                            </CardText>
                            <CardText>
                              <strong>Địa chỉ:</strong>{" "}
                              {influencer.info.address}
                            </CardText>
                            <CardText>
                              <strong>Liên hệ:</strong>{" "}
                              {influencer.info.phone}
                            </CardText>
                          </>
                        ) : (
                          ""
                        )}
                      </CardBody>
                    </Card>
                    ):""}
                  </Container>
          </Card>
      </div>
    </div>
  );
};

export default Influencer;
