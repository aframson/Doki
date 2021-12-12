import React from "react";
import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import styles from "assets/jss/material-kit-react/views/staticPages.js";
import Parallax from "components/Parallax/Parallax";
import { language } from "config";

const dashboardRoutes = [];

const useStyles = makeStyles(styles);

export default function AboutUs(props) {
  const classes = useStyles();
  const { ...rest } = props;

  return (
    <div>
      <Header
        color="transparent"
        routes={dashboardRoutes}
        rightLinks={<HeaderLinks />}
        fixed
        changeColorOnScroll={{
          height: 400,
          color: "white",
        }}
        {...rest}
      />
      <Parallax small filter image={require("assets/img/1-min.jpg").default} />
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classes.container}>
          <br />
          <h2 className={classes.title}>{language.about_us}</h2>
          <p className={classes.description}>
            Doki mobile and Web Apps are Platform developed by Quaker Technology
            Ltd an indigenous Ghanaian Technology Company. The App is aimed at
            transforming the Courier and delivery industry in Ghana. Quaker
            Technologies is a technology company and does not own a single motor
            bike or delivery vehicle on the Doki Platform.
          </p>
          <p className={classes.description}>
            The Doki App allows individual dispatch riders and dispatch/delivery
            companies to register on the platform, accept and fulfill orders
            from customers. To the users of the App, Doki provides an enhanced
            convenience and security to sending and receiving packages.
          </p>
          <br />
        </div>
      </div>

      <Footer />
    </div>
  );
}
