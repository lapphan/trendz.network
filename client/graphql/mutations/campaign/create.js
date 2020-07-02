import gql from "graphql-tag";

export const CREATE_CAMPAIGN = gql`
  mutation createCampaign(
    $title: String
    $content: String
    $picture: [ID]
    $status: Boolean
    $user: ID
    $category: ID
    $channels: [ID]
    $open_datime: DateTime
    $close_datetime: DateTime
  ) {
    createCampaign(
      input: {
        data: {
          title: $title
          content: $content
          picture: $picture
          status: $status
          user: $user
          category: $category
          channels: $channels
          campaignTTL: {
            open_datime: $open_datime
            close_datetime: $close_datetime
          }
        }
      }
    ) {
      campaign {
        id
        title
        content
        status
      }
    }
  }
`;
