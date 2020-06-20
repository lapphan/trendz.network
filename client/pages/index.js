import React, { useEffect } from 'react'
import Layout from '../components/layout'
import { Container } from 'reactstrap';

const Home = (props) => {
  useEffect(() => {
    document.body.classList.toggle('index-page');
    return () => {
      document.body.classList.toggle('index-page');
    };
  }, []);
  return(
  <Layout>
    
    <div className="page-header header-filter">
        <div className="squares square1" />
        <div className="squares square2" />
        <div className="squares square3" />
        <div className="squares square4" />
        <div className="squares square5" />
        <div className="squares square6" />
        <div className="squares square7" />
        <Container>
          <div className="content-center brand">
            <h1 className="h1-seo">Trendz Network</h1>
            <h3 className="d-none d-sm-block">Awesome network</h3>
          </div>
        </Container>
      </div>
    
    <style jsx>
      {`
        
      `}
    </style>
  </Layout>
)}

export default Home