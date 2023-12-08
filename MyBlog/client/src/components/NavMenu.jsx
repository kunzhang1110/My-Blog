import React, { useEffect, useState } from "react";
import {
  Collapse,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalBody,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
} from "reactstrap";
import { Link, NavLink as RRNavLink } from "react-router-dom";
import { useAuth } from "../app/auth.jsx";
import { UserLogin } from "./UserLogin";
import { api } from "../app/api.jsx";
import { _captalize } from "../app/utils";

export const NavMenu = () => {
  const [categories, setCategories] = useState([]);
  const [collapsed, setCollapsed] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUsernameDropDownOpen, setIsUsernameDropdownOpen] = useState(false);
  const [isCategoryDropDownOpen, setIsCategoryDropDownOpen] = useState(false);

  const { user, logout, setMessage } = useAuth();

  useEffect(() => {
    api.articles.getCategories().then((tags) => {
      setCategories(tags);
    });
  }, []);

  const toggleLoginModal = () => {
    if (isLoginModalOpen) {
      setMessage("");
    }
    setIsLoginModalOpen(!isLoginModalOpen);
  };

  return (
    <Navbar
      className="navbar-expand-sm navbar-toggleable-sm  ng-white border-bottom box-shadow px-5"
      color="black"
      dark
      container="fluid"
      sticky="top"
    >
      <NavbarBrand tag={Link} to="/">
        <img
          className="d-none d-sm-inline"
          src="/favicon.ico"
          alt="favicon.ico"
        />
        <span>Kun's Blog</span>
      </NavbarBrand>

      <NavbarToggler
        onClick={() => setCollapsed(!collapsed)}
        className="mr-2"
      />
      <Collapse
        className="d-sm-inline-flex flex-sm-row"
        isOpen={!collapsed}
        navbar
      >
        <ul className="navbar-nav flex-grow ms-auto">
          <NavItem>
            <NavLink tag={RRNavLink} to="/" id="Home" end>
              Home
            </NavLink>
          </NavItem>
          {categories.slice(0, 3).map((category) => (
            <NavItem key={category.name}>
              <NavLink
                tag={RRNavLink}
                to={`articles/categories/${category.name}`}
                id={category}
                end
              >
                {category.name}
              </NavLink>
            </NavItem>
          ))}

          <NavItem>
            <Dropdown
              isOpen={isCategoryDropDownOpen}
              toggle={() => setIsCategoryDropDownOpen((prev) => !prev)}
            >
              <DropdownToggle tag="span">
                <div className="navbar-nav">
                  <NavLink style={{ cursor: "pointer" }}>More</NavLink>
                </div>
              </DropdownToggle>
              <DropdownMenu>
                {categories.slice(4).map((category) => (
                  <DropdownItem
                    tag={Link}
                    to={`articles/categories/${category.name}`}
                    key={category.name}
                  >
                    {category.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </NavItem>

          <VerticalDivider />

          <NavItem>
            <NavLink tag={RRNavLink} to="/about" id="About">
              About
            </NavLink>
          </NavItem>
          <VerticalDivider />
          <NavItem>
            {user.userName !== "" ? (
              <Dropdown
                isOpen={isUsernameDropDownOpen}
                toggle={() => setIsUsernameDropdownOpen((prev) => !prev)}
              >
                <DropdownToggle tag="span">
                  <div className="navbar-nav">
                    <NavLink style={{ cursor: "pointer" }}>
                      {_captalize(user.userName)}
                    </NavLink>
                  </div>
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem tag={Link} to={`/user/profile`}>
                    My Profile
                  </DropdownItem>
                  <DropdownItem onClick={logout}>Log Out</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ) : (
              <>
                <NavLink
                  id="loginNavLink"
                  active={isLoginModalOpen}
                  href="#"
                  onClick={toggleLoginModal}
                >
                  Login
                </NavLink>
              </>
            )}
            <Modal
              centered
              isOpen={isLoginModalOpen}
              toggle={toggleLoginModal}
              unmountOnClose={false}
            >
              <ModalBody className="m-3">
                <UserLogin toggleLoginModal={toggleLoginModal} />
              </ModalBody>
            </Modal>
          </NavItem>
          <NavItem>
            {user.userName === "" ? (
              <NavLink tag={RRNavLink} to="/register" end>
                Register
              </NavLink>
            ) : (
              ""
            )}
          </NavItem>
        </ul>
      </Collapse>
    </Navbar>
  );
};

const VerticalDivider = () => (
  <span
    style={{
      borderLeft: "1px solid grey",
      height: "25px",
      marginTop: "12px",
      marginRight: "10px",
      marginLeft: "10px",
    }}
  ></span>
);
