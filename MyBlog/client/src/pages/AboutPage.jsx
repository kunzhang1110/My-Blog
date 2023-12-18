import React, { useEffect } from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import { AppBreadCrumb } from "../components/AppBreadCrumb";

export const AboutPage = () => {
  useEffect(() => {
    document.title = "About";
  }, []);

  return (
    <Row>
      <Col
        md={{
          offset: 1,
          size: 10,
        }}
      >
        <AppBreadCrumb />
        <Card className="m-2">
          <CardBody className="m-3">
            <Row>
              <h2>About</h2>
              <p>
                Welcome to my blog! My name is Kun Zhang and I am interested in
                coding, investment, video games, music and healthcare.
              </p>
              <p>
                This blog allows me to post and edit articles using Markdown
                format. Users can create a new article either by writing md
                format text directly on the blog or uploading an existing md
                file from a local disk. A live markdown preview is provided
                alongside with the markdown editor. Markdown image syntax is
                supported.
              </p>
              <p>
                The blog is developed with React as frontend and ASP.NET Core as
                backend.
              </p>
              <hr />
            </Row>
            <Row>
              <h2>Contact</h2>
              <p>
                Email:<span className="ms-1">kunzhang1110@gmail.com</span>
                <br />
                Github:
                <a
                  className="ms-1"
                  href="https://github.com/kunzhang1110"
                  target="_blank"
                  rel="noreferrer"
                >
                  https://github.com/kunzhang1110
                </a>
              </p>
              <hr />
            </Row>
            {/* <Row>
              <h2>Video</h2>
              <Col>
                <div className="youtube-video">
                  <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </Col>
            </Row> */}
          </CardBody>
        </Card>
      </Col>
      <Col
        md={{
          size: 1,
        }}
      ></Col>
    </Row>
  );
};
