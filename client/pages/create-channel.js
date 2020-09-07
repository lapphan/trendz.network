import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/userContext';
import Router from 'next/router';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Label,
  FormGroup,
  Input,
  Container,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Form,
} from 'reactstrap';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { errorLog } from '../utils/functions/error-log-snackbar';
import { Editor } from '@tinymce/tinymce-react';
import { Link } from '@material-ui/core';

const { API_URL } = process.env;
const CreateChannel = () => {
  const { state } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const signal = axios.CancelToken.source();

  const [channelState, setChannel] = useState({
    name: '',
    description: '',
    address: '',
    website: '',
    phone: '',
    user: state.user.id,
    category: '',
  });
  const [tempData, setTempData] = useState({
    id: '',
    name: '',
    channelId: '',
    channelName: '',
  });
  const [isAbleToSubmit, setIsAbleToSubmit] = useState(false);

  const [categories, setCategories] = useState({
    categories: [],
  });

  const handleChannelChange = (event) => {
    const { name, value } = event.target;
    setChannel((previousState) => {
      return { ...previousState, [name]: value };
    });
  };

  const handleContentChange = (description, editor) => {
    setChannel((previousState) => {
      return { ...previousState, description };
    });
  };

  const handleCategoryChange = (id, name) => {
    setTempData({
      id: id,
      name: name,
      channelId: '',
      channelName: '',
    });
  };

  const createChannel = async (channel) => {
    try {
      await axios({
        method: 'POST',
        headers: {
          Authorization: `Bearer ${state.jwt}`,
        },
        url: `${API_URL}/channels`,
        data: channel,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleChannelSubmit = async () => {
    try {
      const channel = {
        name: channelState.name,
        description: channelState.description,
        address: channelState.address,
        website: channelState.website,
        phone: channelState.phone,
        user: state.user.id,
        category: tempData.id,
      };
      createChannel(channel);
      Router.push('/');
      return enqueueSnackbar('Tạo Channel thành công!', {
        variant: 'success',
      });
    } catch (error) {
      return enqueueSnackbar(errorLog(error.message), { variant: 'error' });
    }
  };

  useEffect(() => {
    if (
      channelState.name !== '' &&
      channelState.description !== '' &&
      channelState.phone !== '' &&
      channelState.website !== '' &&
      channelState.address !== ''
    ) {
      setIsAbleToSubmit(true);
    }
  }, [channelState]);

  useEffect(() => {
    if (state.jwt === '') Router.push('/login');
    else if (state.user.role.name !== 'Influencer') Router.push('/');
    else {
      let mounted = true;
      //fetch Categories
      const fetchCategory = async () => {
        const url = API_URL + '/categories';
        try {
          const get_resolve = await axios.get(url, {
            cancelToken: signal.token,
            headers: {
              Authorization: `Bearer ${state.jwt}`,
            },
          });
          if (mounted) {
            setCategories({ categories: get_resolve.data });
          }
        } catch (error) {
          if (axios.isCancel(error) && error.message !== undefined) {
            console.log('Error: ', error.message);
          } else {
            console.log(error);
          }
        }
      };
      fetchCategory();
      return function cleanup() {
        mounted = false;
        signal.cancel();
      };
    }
  }, [state]);

  return (
    <div>
      <div className='wrapper'>
        <div className='main'>
          <Container>
            <Card>
              <CardHeader>
                <h3 className='title'>Tạo Channel</h3>
              </CardHeader>
              <CardBody>
                <Form className='form'>
                  <FormGroup>
                    <Label for='name'>Tên kênh</Label>
                    <Input
                      type='name'
                      id='name'
                      name='name'
                      onChange={handleChannelChange}
                      value={channelState.name}
                      placeholder='Tên kênh'
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for='description'>Chi tiết</Label>
                    <Editor
                      apiKey='awf8d12nkj02oekbnk7t8xx283a5kexhscdfvpj9sd8h22ox'
                      id='description'
                      placeholder='Chi tiết kênh của bạn...'
                      onEditorChange={handleContentChange}
                      value={channelState.description}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for='address'>Địa chỉ</Label>
                    <Input
                      type='address'
                      id='address'
                      name='address'
                      onChange={handleChannelChange}
                      value={channelState.address}
                      placeholder='Địa chỉ...'
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for='website'>Website</Label>
                    <Input
                      id='website'
                      type='website'
                      name='website'
                      placeholder='Website...'
                      onChange={handleChannelChange}
                      value={channelState.website}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for='phone'>Số điện thoại</Label>
                    <Input
                      id='phone'
                      type='phone'
                      name='phone'
                      placeholder='Số điện thoại...'
                      onChange={handleChannelChange}
                      value={channelState.phone}
                      required
                    />
                  </FormGroup>
                  <FormGroup className='col-md-3'>
                    <Label for='channel'>Chọn Danh mục</Label>
                    <br />
                    <UncontrolledDropdown group>
                      <DropdownToggle
                        caret
                        color='secondary'
                        data-toggle='dropdown'
                        className='mydropdown'
                      >
                        {tempData.name === ''
                          ? 'Chọn Danh mục...'
                          : tempData.name}
                      </DropdownToggle>
                      <DropdownMenu className='dropdown-menu'>
                        {categories.categories.map((category) => (
                          <DropdownItem
                            key={category.id}
                            onClick={(event) => {
                              event.preventDefault();
                              handleCategoryChange(category.id, category.name);
                            }}
                          >
                            {category.name}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </FormGroup>
                </Form>
                <br />

                <div className='form-button'>
                  <Link href='/dashboard'>
                    <Button className='btn-neutral' color='primary'>
                      Hủy
                    </Button>
                  </Link>
                  <Button
                    color='primary'
                    disabled={!isAbleToSubmit}
                    onClick={handleChannelSubmit}
                  >
                    Tạo
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Container>
        </div>
      </div>
    </div>
  );
};
export default CreateChannel;
