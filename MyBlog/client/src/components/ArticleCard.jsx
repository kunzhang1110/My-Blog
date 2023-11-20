import React, { useState } from "react";
import {
  Button,
  Row,
  Col,
  Card,
  CardBody,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalFooter,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { VscEllipsis } from "react-icons/vsc";
import { GoEye } from "react-icons/go";
import { MdDateRange } from "react-icons/md";
import { useAuth } from "../Auth";
import { Spinner } from "./Spinner";
import { Tag } from "./Tag";
import { ReactMarkdownMemo } from "./ReactMarkdownMemo";

//React Markdown common components
export const rmComponents = {};

export const ArticleCard = ({ article, id }) => {
  const imageDirectory = `UserData/${article.id}`;
  const [collapsed, setCollapsed] = useState(true);
  const [body, setBody] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const toggleArticleCard = (e) => {
    e.preventDefault();
    if (collapsed) {
      setIsLoading(true);
      fetch(`/api/articles/${article.id}`)
        .then((res) => res.json())
        .then((data) => {
          setBody(data.body);
          setCollapsed(false);
          setIsLoading(false);
        });
    } else {
      setCollapsed(true);
    }
  };

  const toggleDropDown = () => setIsDropdownOpen((prev) => !prev);
  const toggleModal = () => setIsModalOpen((prev) => !prev);

  const deleteArticle = () => {
    const headers = new Headers({
      Authorization: `Bearer ${user.token}`,
    });
    setIsDeleting(true);
    fetch(`/api/articles/${article.id}`, {
      method: "DELETE",
      headers,
    }).then(() => {
      toggleModal();
      setIsDeleting(false);
      navigate(`/`);
      navigate(0); //refresh page
    });
  };

  return (
    <Card className="m-2">
      <CardBody className="m-3">
        <Row>
          <Col xs="11">
            <h1>{article.title}</h1>
          </Col>
          {/* top right dropdown menu */}
          <Col xs="1" style={{ textAlign: "right" }}>
            <Dropdown isOpen={isDropdownOpen} toggle={toggleDropDown}>
              <DropdownToggle tag="span">
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  style={{ color: "grey" }}
                >
                  <VscEllipsis />
                </a>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem
                  disabled={!user.isAdmin}
                  tag={Link}
                  to={`/edit/${article.id}`}
                >
                  Edit
                </DropdownItem>
                <DropdownItem disabled={!user.isAdmin} onClick={toggleModal}>
                  Delete
                </DropdownItem>
                <Modal
                  isOpen={isModalOpen}
                  toggle={toggleModal}
                  centered={true}
                >
                  <ModalHeader>
                    Are your sure you want to delete this post?
                  </ModalHeader>
                  <ModalFooter>
                    <Button
                      className="btn-loading"
                      color="danger"
                      onClick={deleteArticle}
                    >
                      {isDeleting ? (
                        <Spinner
                          size="1.5rem"
                          className="justify-content-center"
                        />
                      ) : (
                        "Delete"
                      )}
                    </Button>
                    <Button color="secondary" onClick={toggleModal}>
                      Cancel
                    </Button>
                  </ModalFooter>
                </Modal>
                <DropdownItem divider />
                {id ? (
                  <DropdownItem
                    onClick={(e) => {
                      e.preventDefault();
                      navigator.clipboard.writeText(window.location.href);
                    }}
                  >
                    Copy Link
                  </DropdownItem>
                ) : (
                  <DropdownItem tag={Link} to={`/articles/${article.id}`}>
                    Article Page
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          </Col>
        </Row>
        {/* stats and tags */}
        <div className="d-inline-flex align-items-center mt-2 mb-3 flex-wrap">
          <MdDateRange className="m-1" />
          <span className="me-2">{article.date.substring(0, 10)}</span>
          <GoEye className="m-1" />
          <span className="me-2">{article.views}</span>
          <div className="d-sm-inline-flex flex-wrap m-1">
            {article.tags.map((tag) => (
              <Tag className="m-1" tag={tag} key={tag.id} />
            ))}
          </div>
        </div>
        <ReactMarkdownMemo
          children={collapsed ? article.body : body}
          imgFunc={({ node, src, ...props }) => {
            return (
              <span className="d-block text-center">
                <img
                  className="mw-100"
                  src={`${imageDirectory}/${src}`}
                  alt={src}
                  {...props}
                />
              </span>
            );
          }}
          deps={[collapsed, article, body]}
        />
        {id ? (
          <></>
        ) : (
          <Row>
            <Link to="#" onClick={(e) => toggleArticleCard(e)}>
              {isLoading ? (
                <Spinner size="2rem" className="mt-2" />
              ) : collapsed ? (
                "More..."
              ) : (
                "Less"
              )}
            </Link>
          </Row>
        )}
      </CardBody>
    </Card>
  );
};
