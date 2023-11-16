import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardText,
} from "reactstrap";
import { Link } from "react-router-dom";
import { SiGithub, SiTwitter, SiZhihu } from "react-icons/si";
import { useAuth } from "../Auth";

export const SideBar = ({ setIsAlertOpen }) => {
  const { user } = useAuth();

  const clickEmail = (e) => {
    navigator.clipboard.writeText(e.target.childNodes[0].textContent);
    setIsAlertOpen(true);
  };

  return (
    <div className="Sidebar">
      <Card className="m-2">
        <CardBody className="text-center">
          <img
            className="d-none d-xl-inline"
            alt="profile-picture"
            src="./profile-picture.jpg"
            width="70%"
          />
          <CardTitle tag="h3" className="mt-3">
            Kun
          </CardTitle>
          <CardSubtitle className="my-3 text-muted" tag="h6">
            Balance and Moderation
          </CardSubtitle>
          <CardText>
            <LinkButton
              Icon={SiGithub}
              href="https://github.com/kunzhang1110"
            />
            <LinkButton
              Icon={SiTwitter}
              href="https://twitter.com/JUstZUOken"
            />
            <LinkButton
              Icon={SiZhihu}
              href="https://www.zhihu.com/people/kun-zhang-12/"
            />
          </CardText>
          <hr />
          <CardText onClick={(e) => clickEmail(e)} id="email">
            kunzhang1110@gmail.com
          </CardText>
        </CardBody>
      </Card>

      {user.isAdmin ? (
        <Card className="m-2">
          <CardBody className="text-center m-2">
            <Link to={`/create`}>
              <div>
                <Button color="primary">Create New</Button>
              </div>
            </Link>
          </CardBody>
        </Card>
      ) : (
        <></>
      )}
    </div>
  );
};

const LinkButton = ({ Icon, href }) => {
  return (
    <a
      className="btn shadow-none"
      style={{ fontSize: "1.5rem" }}
      href={href}
      target="_blank"
    >
      <Icon />
    </a>
  );
};
