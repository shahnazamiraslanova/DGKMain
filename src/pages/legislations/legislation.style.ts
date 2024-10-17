import { createUseStyles } from "react-jss";

const mainColor = "#394e75";
const lightColor = "#eef1f6";
const accentColor = "#5a7cb6";
const successColor = "#4caf50";
const dangerColor = "#f44336";

const styles = {
  legislationContainer: {
    backgroundColor: "#f0f2f5",
    padding: "150px 40px 0 40px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  legisationBtns: {
    display: "flex",
    justifyContent: "space-between",
  },
  listContainer:{
    
  }
};

export const useLegislationStyles = createUseStyles(styles);
