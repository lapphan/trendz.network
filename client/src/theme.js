import { createMuiTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";

// Create a theme instance.
const theme = createMuiTheme({
  palette:{
    primary:{
      main: '#ffeafe'
    },
    secondary:{
      main:'#ccc1ff'
    },
    tertiary:{
      main:'#9ea9f0'
    },
    error:{
      main:red.A400
    },
    background:{
      default:'#553c8b'
    },
    textColor:{
      default:'#fff'
    }
  }
});

export default theme;
