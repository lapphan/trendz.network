import axios from "axios";
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
import { CircularProgress } from "@material-ui/core";

import InfluencerChannelPage from "../../components/Channel/Influencer";
import EmployeeChannelPage from "../../components/Channel/Employee";
import AdminChannelPage from "../../components/Channel/Admin";

const { API_URL } = process.env;

const Channel = ({ chid }) => {
  const { state } = useAuth();
  const signal = axios.CancelToken.source();
  const [channel, setChannel] = useState(null);

  const RenderRole = () => {
    if (state.user.id == channel[0].user.id) {
      return (
        <InfluencerChannelPage
          chid={chid}
          channel={channel[0]}
        />
      );
    } else if (state.user.role.name == "Employee") {
      return (
        <EmployeeChannelPage
          chid={chid}
          channel={channel[0]}
        />
      );
    } else if (state.user.role.name == "Admin") {
      return (
        <AdminChannelPage
          chid={chid}
          channel={channel[0]}
        />
      );
    }
  };

  useEffect(() => {
    if (state.jwt === "") Router.push("/login");
    else {
      let mounted = true;
      const fetchChannel = async () => {
        const channel_url = API_URL + `/channels?_where[id]=${chid}`;
        try {
          const get_channel = await axios.get(channel_url, {
            headers: {
              Authorization: `Bearer ${state.jwt}`,
            },
          });
          if (mounted) {
            try {
              setChannel(get_channel.data);
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
      fetchChannel();

      return function cleanup() {
        mounted = false;
        signal.cancel();
      };
    }
  }, []);

  return (
    <div className="wrapper">
      <div className="main">
        {channel !== null ? (
          <Card>
            <CardBody>
              <RenderRole />
            </CardBody>
          </Card>
        ) : (
          <Card>
            <br />
            <CircularProgress />
            <br />
          </Card>
        )}
      </div>
    </div>
  );
};

export async function getStaticPaths() {
  const channelIdsUrl = API_URL + "/channels/getid";
  const get_resolve = await axios.get(channelIdsUrl);
  const channelIds = get_resolve.data;
  const paths = channelIds.map((channelId) => ({
    params: { chid: channelId.id.toString() },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const chid = params.chid;
  return {
    props: { chid },
  };
}

export default Channel;
