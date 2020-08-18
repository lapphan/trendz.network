export const campaignStatuses = [
  {
    id: 1,
    status: "Đang chờ kiểm duyệt",
    value: "approve_null=true",
  },
  {
    id: 2,
    status: "Đang chờ Influencer xác nhận",
    value: "approve=true&status_null=true",
  },
  {
    id: 3,
    status: "Influencer đã từ chối",
    value: "approve=true&status=false",
  },
  {
    id: 4,
    status: "Đang được thực hiện",
    value: "approve=true&status=true&completed=false",
  },
  {
    id: 5,
    status: "Đã hoàn thành",
    value: "approve=true&status=true&completed=true",
  },
];
