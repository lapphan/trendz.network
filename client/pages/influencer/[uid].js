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
} from "reactstrap";

import { Skeleton } from "@material-ui/lab";

const { API_URL } = process.env;

// const Influencer = ({ influencer }) => {
const Influencer = () => {
  const router = useRouter();
  const { uid } = router.query;
  const { state } = useAuth();
  const signal = axios.CancelToken.source();
  const [influencer, setInfluencer] = useState(null);
  const renderImage = () => {
    if (
      influencer.user.avatar !== undefined &&
      influencer.user.avatar !== null
    ) {
      if (influencer.user.avatar.formats.thumbnail !== undefined) {
        return API_URL + influencer.user.avatar.formats.thumbnail.url;
      } else return "/256x186.svg";
    } else return "/256x186.svg";
  };

  useEffect(() => {
    if (state.jwt === "") Router.push("/login");
    else {
      let mounted = true;
      const fetchInfluencer = async () => {
        const url = API_URL + `/channels?_where[user.id]=${uid}`;
        try {
          const get_resolve = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${state.jwt}`,
            },
          });
          if (mounted) {
            try {
              setInfluencer(get_resolve.data[0]);
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
                  src={renderImage()}
                  alt="Card image cap"
                  className="campaign-detail-img"
                />
                <CardBody>
                  <CardTitle>{influencer.user.name}</CardTitle>
                  <CardText>{influencer.user.username}</CardText>
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
