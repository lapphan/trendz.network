import { useAuth } from "../../../context/userContext";
import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardImg,
  CardSubtitle,
  CardTitle,
  CardText,
  Modal,
  ModalBody,
  ModalFooter,
  Label,
  FormGroup,
} from "reactstrap";
import { useSnackbar } from "notistack";

const { API_URL } = process.env;

const InfluencerCampaignPage = ({ chid, channel }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { state } = useAuth();
  const [tempChannel, setTempChannel] = useState(channel);
  const [statusModal, setStatusModal] = useState(false);
  const toggleStatusModal = () => {
    setStatusModal(!statusModal);
  };

  const handleEnable = async () => {
    try {
      console.log(tempChannel);
      // await axios({
      //   method: "PUT",
      //   headers: {
      //     Authorization: `Bearer ${state.jwt}`,
      //   },
      //   url: `${API_URL}/channels/${chid}`,
      //   data: tempChannel,
      // });
    } catch (e) {
      console.log(e);
    }
  };

  const renderStatus = (employeeConfirm, adminConfirm, status) => {
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

  const renderStatusModal = () => {
    return (
      <Modal isOpen={statusModal} toggle={toggleStatusModal}>
        <div className="modal-header">
          <h4 className="modal-title" id="avatarModal">
            {channel.status === true ? (
              <strong>Dừng hoạt động Channel</strong>
            ) : (
              <strong>Kích hoạt Channel</strong>
            )}
          </h4>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-hidden="true"
            onClick={toggleStatusModal}
          >
            <i className="tim-icons icon-simple-remove" />
          </button>
        </div>
        <ModalBody>
          <FormGroup className="modal-items">
            {channel.status === true ? (
              <Label>Bạn có thật sự muốn dừng hoạt động Channel này?</Label>
            ) : (
              <Label>Bạn có thật sự muốn kích hoạt Channel này?</Label>
            )}
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleStatusModal}>
            Không
          </Button>
          {channel.status === true ? (
            <Button
              color="primary"
              onClick={() => {
                try {
                  handleDisable();
                  enqueueSnackbar("Channel đã ngưng hoạt động!", {
                    variant: "success",
                  });
                } catch (error) {
                  enqueueSnackbar(
                    "Thay đổi trạng thái của Channel không thành công!",
                    {
                      variant: "error",
                    }
                  );
                }
                toggleStatusModal();
              }}
            >
              Có
            </Button>
          ) : (
            <Button
              color="primary"
              onClick={() => {
                try {
                  handleEnable();
                  enqueueSnackbar("Channel đã được kích hoạt!", {
                    variant: "success",
                  });
                } catch (error) {
                  enqueueSnackbar(
                    "Thay đổi trạng thái của Channel không thành công!",
                    {
                      variant: "error",
                    }
                  );
                }
                toggleStatusModal();
              }}
            >
              Có
            </Button>
          )}
        </ModalFooter>
      </Modal>
    );
  };

  return (
    <Card className="single-card">
      {channel.status !== null ? renderStatusModal() : ""}
      <CardImg
        src={
          channel.avatar.formats !== null
            ? `${API_URL}${channel.avatar.formats.thumbnail.url}`
            : `${API_URL}${channel.avatar.url}`
        }
        alt="Card image cap"
        className="campaign-detail-img"
      />
      <CardTitle>{channel.name}</CardTitle>
      <CardSubtitle>{channel.description}</CardSubtitle>
      <CardSubtitle>
        <strong>Thể loại:</strong>
      </CardSubtitle>
      {channel.category !== undefined ? (
        <CardText>
          {channel.category.name}
          <br />
          {channel.category.description}
        </CardText>
      ) : (
        ""
      )}
      <CardSubtitle>
        <strong>Website:</strong>
      </CardSubtitle>
      <CardText>{channel.website}</CardText>
      <CardSubtitle>
        <strong>Số điện thoại:</strong>
      </CardSubtitle>
      <CardText>{channel.phone}</CardText>
      <CardSubtitle>
        <strong>Mức giá:</strong>
      </CardSubtitle>
      <CardText>{channel.price}</CardText>
      <CardSubtitle>
        <strong>Trạng thái:</strong>
      </CardSubtitle>
      <CardText>
        {renderStatus(
          channel.employeeConfirm,
          channel.adminConfirm,
          channel.status,
        )}
      </CardText>
      {channel.employeeConfirm == false ? (
        <>
          <CardSubtitle>Lý do:</CardSubtitle>
          <CardText>{channel.employeeNote}</CardText>
        </>
      ) : (
        ""
      )}
      {channel.adminConfirm == false ? (
        <>
          <CardSubtitle>Lý do:</CardSubtitle>
          <CardText>{channel.adminNote}</CardText>
        </>
      ) : (
        ""
      )}
      <div className="form-button">
        {channel.status === true && channel.adminConfirm === true ? (
          <Button
            color="danger"
            onClick={() => {
              toggleStatusModal();
              setTempChannel((previousState) => {
                return { ...previousState, status: false };
              });
            }}
          >
            Dừng hoạt động
          </Button>
        ) : (
          ""
        )}
        {channel.status === false && channel.adminConfirm === true ? (
          <Button
            color="primary"
            onClick={() => {
              toggleStatusModal();
              setTempChannel((previousState) => {
                return { ...previousState, status: true };
              });
            }}
          >
            Kích hoạt
          </Button>
        ) : (
          ""
        )}
      </div>
    </Card>
  );
};

export default InfluencerCampaignPage;
