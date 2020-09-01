import React from "react";
import PropTypes from "prop-types";
import { getDataFromTree } from "@apollo/react-ssr";
import Head from "next/head";
import initApollo from "./initApollo";

export default (App) => {
  return class WithData extends React.Component {
    // It is needed for better devtools experience. Check how react devtools shows it: "MyApp WithData"
    static displayName = `WithData(${App.displayName})`;
    // Since apolloState is required but it is missed before this method returns the new props,
    // so it is needed to provide defaults
    static defaultProps = {
      apolloState: {},
    };
    static propTypes = {
      apolloState: PropTypes.object.isRequired,
    };
    constructor(props) {
      super(props);
      // `getDataFromTree` renders the component first, the client is passed off as a property.
      // After that rendering is done using Next's normal rendering pipeline
      this.apolloClient = initApollo(props.apolloState, props.headers);
    }
    render() {
      return <App apolloClient={this.apolloClient} {...this.props} />;
    }
  };
};
