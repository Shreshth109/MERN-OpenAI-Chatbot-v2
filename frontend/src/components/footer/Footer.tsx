import { Link } from "react-router-dom";
import { FaGithub, FaLinkedinIn, FaTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          width: "100%",
          minHeight: "20vh",
          maxHeight: "30vh",
          marginTop: 60,
        }}
      >
        <p
          style={{
            fontSize: "30px",
            margin: "auto",
            textAlign: "center",
          }}
        >
          Built by Shreshth
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "13px",
            margin: "auto",
          }}
        >
          <Link
            style={{ color: "white" }}
            to={"https://github.com/Shreshth109"}
            target="_blank"
          >
            <FaGithub />
          </Link>
          <Link
            style={{ color: "white" }}
            to={"https://www.linkedin.com/in/kumar-shreshth-a1590625b/"}
            target="_blank"
          >
            <FaLinkedinIn />
          </Link>
          <Link
            style={{ color: "white" }}
            to={"https://x.com/Shreshth_109"}
            target="_blank"
          >
            <FaTwitter />
          </Link>
          <Link
            style={{ color: "white" }}
            target="_blank"
            to={"https://www.instagram.com/shreshth_jaiswal_011/"}
          >
            <FaInstagram />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;