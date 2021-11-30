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

export default function PrivacyPolicy(props) {
  const classes = useStyles();
  const { ...rest } = props;

  const sub_1_data = [
    "Your contact information and email address.",
    "Other information such as location.",
    "Payment information.",
    "Data profile regarding your online behavior on our website.",
  ];

  const sub_2_data = [
    "To enable us serve you",
    "To better understand your needs.",
    "To improve our services and products.",
    "To send you promotional emails containing the information we think you will findinteresting.",
    "To contact you to fill out surveys and participate in other types of market research.",
    "To customize our website according to your online behavior and personal preferences.",
  ];

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
      <Parallax
        small
        filter
        image={require("assets/img/header-back.png").default}
      />
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classes.container}>
          <br />
          <h2 className={classes.title}>{language.privacy_policy}</h2>
          <p className={classes.description}>
            This privacy policy will help you understand how{" "}
            <strong>Quaker Technologies Ltd</strong> uses and protects the data
            you provide to us when you visit and use our{" "}
            <strong>DOKI app</strong>.{" "}
          </p>
          <p className={classes.description}>{language.privacy_policy_para2}</p>
          <h4
            style={{
              fontWeight: "bold",
              color: "black",
              marginTop: 15,
              marginBottom: 10,
            }}
          >
            {language.privacy_policy_sub_header_1}
          </h4>
          <p className={classes.description}>{language.privacy_policy_para3}</p>
          <ul>
            {sub_1_data.map((text) => (
              <li style={{ color: "black", fontSize: 14 }}>{text}</li>
            ))}
          </ul>
          <h4
            style={{
              fontWeight: "bold",
              color: "black",
              marginTop: 15,
              marginBottom: 10,
            }}
          >
            {language.privacy_policy_sub_header_2}
          </h4>
          <p className={classes.description}>{language.privacy_policy_para4}</p>
          <ul>
            {sub_2_data.map((text) => (
              <li style={{ color: "black", fontSize: 14 }}>{text}</li>
            ))}
          </ul>
          <h4
            style={{
              fontWeight: "bold",
              color: "black",
              marginTop: 15,
              marginBottom: 10,
            }}
          >
            Safeguarding and Securing the Data
          </h4>
          <p className={classes.description}>
            <strong>Quaker Technologies Ltd</strong> is committed to securing
            your data and keeping it confidential.{" "}
            <strong>Quaker Technologies Ltd</strong> has done all in its power
            to prevent data theft, unauthorized access, and disclosure by
            implementing the latest technologies and software, which help us
            safeguard all the information we collect on our{" "}
            <strong>DOKI app</strong>.{" "}
          </p>
          {/* cookies section */}
          <h4
            style={{
              fontWeight: "bold",
              color: "black",
              marginTop: 15,
              marginBottom: 10,
            }}
          >
            Our Cookie Policy
          </h4>
          <p style={{ color: "black" }}>{language.cookie_policy_para1}</p>
          <p style={{ color: "black" }}>{language.cookie_policy_para2}</p>
          <p style={{ color: "black" }}>{language.cookie_policy_para3}</p>
          <p className={classes.description}>{language.cookie_policy_para4}</p>
          {/* linking to other sites section */}
          <h4
            style={{
              fontWeight: "bold",
              color: "black",
              marginTop: 15,
              marginBottom: 10,
            }}
          >
            Links to Other Websites
          </h4>
          <p className={classes.description}>{language.privacy_policy_para5}</p>
          {/* Data collection restriction section */}
          <h4
            style={{
              fontWeight: "bold",
              color: "black",
              marginTop: 15,
              marginBottom: 10,
            }}
          >
            Restricting the Collection of your Personal Data
          </h4>
          <p className={classes.description}>{language.privacy_policy_para6}</p>
          <p className={classes.description}>{language.privacy_policy_para7}</p>
          <p className={classes.description}>{language.privacy_policy_para8}</p>
          <p className={classes.description}>{language.privacy_policy_para9}</p>
          <br />
        </div>
      </div>
      <Footer />
    </div>
  );
}
