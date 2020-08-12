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
    $open_datetime: DateTime
    $close_datetime: DateTime
    $approve: Boolean
  	$completed: Boolean
  ) {
    createCampaign(
      input: {
        data: {
          title: $title
          content: $content
          picture: $picture
          status: $status
          completed: $completed
          approve: $approve
          user: $user
          category: $category
          channels: $channels
          campaignTTL: {
            open_datetime: $open_datetime
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
