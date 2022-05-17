import { Get, Post } from '../http';

function getProfile() {
  return Get('/profile/profile');
}

function postInitProfile({ profile_name }) {
  return Post('/profile/init_profile', {
    profile_name
  });
}

function postBindTel({ profile_tel }) {
  return Post('/profile/bind_tel', {
    profile_tel
  });

}

function postChangeProfileName({ profile_new_name }) {
  return Post('/profile/change_profile_name', {
    profile_new_name
  });
}

function getResource() {
  return Get('/resource/resource');
}

function postChangeResourceName({ resource_unique_id, resource_new_name }) {
  return Post('/resource/change_resource_name', {
    resource_unique_id,
    resource_new_name
  });
}

export {
  getProfile,
  postInitProfile,
  postBindTel,
  postChangeProfileName,
  getResource,
  postChangeResourceName
}