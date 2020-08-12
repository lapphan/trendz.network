import { useAuth } from "../../../context/userContext";
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
  Spinner,
} from "reactstrap";

const { API_URL } = process.env;

const InfluencerCampaignPage = (cid) => {
  const { enqueueSnackbar } = useSnackbar();
  const { state } = useAuth();
  const signal = axios.CancelToken.source();
  const [isLoading, setLoading] = useState(true);
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
  });

  const handleInfluencerApproval = async (approved) => {
    const status = {
      status: approved,
      completed: false,
    };
    try {
      await axios({
        method: "PUT",
        headers: {
          Authorization: `Bearer ${state.jwt}`,
        },
        url: `${API_URL}/campaigns/${cid}`,
        data: status,
      });
      if (approved) {
        enqueueSnackbar("Đã chấp thuận campaign!", { variant: "success" });
      } else enqueueSnackbar("Đã từ chối campaign!", { variant: "success" });
      Router.push("/dashboard");
    } catch (e) {
      console.log(e);
      enqueueSnackbar("Đã có lỗi xảy ra, vui lòng thử lại!", {
        variant: "error",
      });
    }
    return;
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
    if (approvalStatus && influencerStatus && status == null) {
      return "Đã được cấp phép - Influencer đã chấp thuận - Đang hoạt động";
    } else return "Đã được cấp phép - Influencer đã chấp thuận - Đã kết thúc";
  };

  useEffect(() => {
    if (cid === undefined) return;
    else {
      let mountedCampaign = true;
      try {
        const fetchCampaign = async () => {
          const url = API_URL + `/campaigns/${cid}`;
          const get_resolve = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${state.jwt}`,
            },
          });
          if (mountedCampaign) {
            setCampaign({
              user: get_resolve.data.user,
              campaignTTL: get_resolve.data.campaignTTL,
              category: get_resolve.data.category,
              channels: get_resolve.data.channels,
              picture: get_resolve.data.picture,
              status: get_resolve.data.status,
              title: get_resolve.data.title,
              content: get_resolve.data.content,
              approve: get_resolve.data.approve,
              completed: get_resolve.data.completed,
              created_at: get_resolve.data.created_at,
              updated_at: get_resolve.data.updated_at,
            });
          }
        };
        fetchCampaign().then(setLoading(false));
      } catch (error) {
        if (axios.isCancel(error) && error.message !== undefined) {
          console.log("Error: ", error.message);
        }
      }

      return function cleanup() {
        mountedCampaign = false;
        signal.cancel();
      };
    }
  }, [state]);

  return (
    <Row>
      {isLoading === false ? (
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
            <div className="form-button">
              <Button
                className="btn-neutral"
                color="primary"
                onClick={() => handleInfluencerApproval(false)}
              >
                Từ chối
              </Button>
              <Button
                color="primary"
                onClick={() => handleInfluencerApproval(true)}
              >
                Xác nhận
              </Button>
            </div>
          </CardBody>
        </Card>
      ) : (
        <Spinner />
      )}
    </Row>
  );
};

export default InfluencerCampaignPage;
