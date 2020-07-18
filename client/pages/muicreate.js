import React, { useEffect, useState } from "react";
import { useAuth } from "../context/userContext";
import Router from "next/router";
import PerfectScrollbar from "perfect-scrollbar";
import { useSnackbar } from 'notistack';
import { CREATE_CAMPAIGN } from "../graphql/mutations/campaign/create";
import { useMutation } from "react-apollo";
import { isEmpty } from "lodash";
import axios from "axios";
import { errorLog } from "../utils/functions/error-log-snackbar";
import Datetime from "react-datetime";

import {Container,makeStyles, Card} from '@material-ui/core';

let ps = null;
const { API_URL } = process.env;

const useStyles = makeStyles(({ spacing, palette }) => ({
    paper: {
        marginTop: spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#5e72e4'
      },
  }));

const muiCreate = () => {
  const { state } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const signal = axios.CancelToken.source();
  const classes = useStyles();
  const [campaignState, setCampaign] = useState({
    title: "",
    content: "",
    picture: [],
    status: null,
    user: state.user.id,
    category: null,
    channels: [],
    open_datetime: new Date().toISOString(),
    close_datetime: new Date().toISOString(),
  });

  const [categories, setCategories] = useState({
    categories: [],
  });

  const [tempData, setTempData] = useState({
    categoryId: "",
    categoryName: "",
    channelId: "",
    channelName: "",
  });

  const [picture, setPicture] = useState({
    file: null,
    loading: false,
    submmited: false,
  });

  const [date, setDate] = useState(Datetime.moment().subtract(1, "day"));
  var valid = function (current) {
    return current.isAfter(date);
  };

  var validStartDate = function (current) {
    return current.isAfter(Datetime.moment().subtract(1, "day"));
  };

  const [requestCreateCampaignMutation] = useMutation(CREATE_CAMPAIGN, {
    variables: campaignState,
  });

  const handleCampaignChange = (event) => {
    const { name, value } = event.target;
    setCampaign((previousState) => {
      return { ...previousState, [name]: value };
    });
  };

  const handleStartDateChange = (event) => {
    if (event._d !== undefined) {
      const value = event._d.toISOString();
      setCampaign((previousState) => {
        return {
          ...previousState,
          open_datetime: value,
        };
      });
      setDate(value);
    } else return;
  };

  const handleEndDateChange = (event) => {
    if (event._d !== undefined) {
      const value = event._d.toISOString();
      setCampaign((previousState) => {
        return {
          ...previousState,
          close_datetime: value,
        };
      });
    } else return;
  };

  const handleImageChange = (event) => {
    setPicture({
      file: event.target.files[0],
      submmited: false,
    });
  };

  const handleCategoryChange = (id, name) => {
    setCampaign((previousState) => {
      return { ...previousState, category: id };
    });
    setTempData({
      categoryId: id,
      categoryName: name,
      channelId: "",
      channelName: "",
    });
  };

  const handleChannelsChange = (id, name) => {
    setCampaign((previousState) => {
      return { ...previousState, channels: [id] };
    });
    setTempData((previousState) => {
      return {
        ...previousState,
        channelId: id,
        channelName: name,
      };
    });
  };

  const handleImageSubmit = async (event) => {
    event.preventDefault();
    setPicture((previousState) => {
      return {
        ...previousState,
        loading: true,
      };
    });
    const data = new FormData();
    data.append("files", picture.file);
    const upload_resolve = await axios({
      method: "POST",
      headers: {
        Authorization: `Bearer ${state.jwt}`,
      },
      url: `${API_URL}/upload`,
      data,
    });
    setPicture((previousState) => {
      return {
        ...previousState,
        loading: false,
        submmited: true,
      };
    });
    setCampaign((previousState) => {
      return {
        ...previousState,
        picture: [...previousState.picture, upload_resolve.data[0].id],
      };
    });
  };

  const handleCampaignSubmit = async () => {
    if (isEmpty(campaignState.title) || isEmpty(campaignState.content)) {
      enqueueSnackbar(
        "Không đủ thông tin! Vui lòng kiểm tra lại!",
        { variant: 'error' }
      )
    } else
      try {
        await requestCreateCampaignMutation();
        Router.push("/dashboard");
        return enqueueSnackbar(
          "Tạo campaign thành công!",{variant: 'success'}
        )
      } catch (error) {
        return enqueueSnackbar(errorLog(error.message),{variant:'error'});
      }
  };

  useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      document.documentElement.className += " perfect-scrollbar-on";
      document.documentElement.classList.remove("perfect-scrollbar-off");
      let tables = document.querySelectorAll(".table-responsive");
      for (let i = 0; i < tables.length; i++) {
        ps = new PerfectScrollbar(tables[i]);
      }
    }
    document.body.classList.toggle("create-page");
    return () => {
      if (navigator.platform.indexOf("Win") > 1) {
        ps.destroy();
        document.documentElement.className += " perfect-scrollbar-off";
        document.documentElement.classList.remove("perfect-scrollbar-on");
      }
      document.body.classList.toggle("create-page");
    };
  });

  useEffect(() => {
    if (state.jwt === "") Router.push("/login");
    else {
      let mounted = true;
      const url = API_URL + "/categories";
      try {
        const fetchCategory = async () => {
          const get_resolve = await axios.get(url, {
            cancelToken: signal.token,
            headers: {
              Authorization: `Bearer ${state.jwt}`,
            },
          });
          if (mounted) {
            setCategories({ categories: get_resolve.data });
          }
        };
        fetchCategory();
      } catch (error) {
        if (axios.isCancel(error) && error.message !== undefined) {
          console.log("Error: ", error.message);
        } else {
          throw error;
        }
      }
      return function cleanup() {
        mounted = false;
        signal.cancel();
      };
    }
  }, [state]);

  return (
    <Container>
      <Card className={classes.paper}>
          next 
          <br/>
          next 
          <br/>
          next 
          <br/>
          next 
          <br/>
          next 
          <br/>
          next 
          <br/>
          
      </Card>
    </Container>
  );
};

export default muiCreate;
