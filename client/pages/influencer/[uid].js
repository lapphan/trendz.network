import React from "react";
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

const Influencer = ({ influencer }) => {
  const renderImage = () => {
    console.log("line 30" + influencer);
    if (
      influencer.user.avatar !== undefined &&
      influencer.user.avatar !== null
    ) {
      if (influencer.user.avatar.formats.thumbnail !== undefined) {
        return API_URL + influencer.user.avatar.formats.thumbnail.url;
      } else return "/256x186.svg";
    } else return "/256x186.svg";
  };
  return (
    <div className="wrapper">
      <div className="main">
        <Card>
          <Container>
              <Card className="single-card">
                <CardImg
                  src={renderImage()}
                  alt="Card image cap"
                  className="campaign-detail-img"
                />
                <CardBody>
                  <CardTitle>{influencer.user.name}</CardTitle>
                  <CardText>{influencer.user.username}</CardText>

                  {/* <CardSubtitle>
                    <strong>Thể loại:</strong>
                  </CardSubtitle> */}

                  {/* <CardText>
                    {influencer.category.name} -{" "}
                    {influencer.category.description}
                  </CardText> */}
                  {/* <CardSubtitle>
                    <strong>Kênh:</strong>
                  </CardSubtitle>
                    <>
                      <CardText>
                        <strong>{influencer.name}</strong>
                      </CardText>
                      <CardText>
                        <strong>Website:</strong>{" "}
                        <a href="##">{influencer.info.website}</a>
                      </CardText>
                      <CardText>
                        <strong>Địa chỉ:</strong> {influencer.info.address}
                      </CardText>
                      <CardText>
                        <strong>Liên hệ:</strong> {influencer.info.phone}
                      </CardText>
                    </>
                  ) : (
                    ""
                  )} */}
                </CardBody>
              </Card>
          </Container>
        </Card>
      </div>
    </div>
  );
};

export async function getServerSideProps({ params }) {
  const url = API_URL + `/influencer-details?_where[user.id]=${params.uid}`;
  const get_resolve = await axios.get(url);
  const influencer = get_resolve.data[0];
  return{
    props:{influencer}
  }
}

export default Influencer;
