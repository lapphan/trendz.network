import React from "react";
import { Card, Container, CardTitle, CardText, Button } from "reactstrap";

import Link from "next/link";

const ErrorPage = ({ path }) => {
  return (
    <div className="wrapper">
      <div className="main">
        <br/>
        <br/>
        <Card>
          <Container>
            <Card className="single-card">
              <CardTitle>KHÔNG TỒN TẠI</CardTitle>
              <CardText>Đường dẫn: /{path}</CardText>
              <br />
              <CardText>Đường dẫn của bạn hiện đang không khả dụng.</CardText>
              <Link href="/dashboard">
                <Button>Quay về trang chủ</Button>
              </Link>
            </Card>
          </Container>
        </Card>
      </div>
    </div>
  );
};

export async function getServerSideProps({ params }) {
  const path = params.path;
  return {
    props: { path },
  };
}

export default ErrorPage;
