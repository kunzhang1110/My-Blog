import React, { useState } from "react";
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

export const NavMenu = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDropDownOpen, setIsDropdownOpen] = useState(false);

  const { user, logout, setMessage } = useAuth();

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
          <NavItem>
            <NavLink tag={RRNavLink} to="/about" id="About">
              About
            </NavLink>
          </NavItem>

          <NavItem>
            {user.username !== "" ? (
              <Dropdown
                isOpen={isDropDownOpen}
                toggle={() => setIsDropdownOpen((prev) => !prev)}
              >
                <DropdownToggle tag="span">
                  <div className="navbar-nav">
                    <NavLink tag={RRNavLink} to="#">
                      {user.username}
                    </NavLink>
                  </div>
                </DropdownToggle>
                <DropdownMenu>
                  {/* <DropdownItem  tag={Link} to={`users/account`}>
                      Account
                    </DropdownItem> */}
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
            {user.username === "" ? (
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
