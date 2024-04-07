import React, { useState, useEffect } from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import {
  DEFAULT_INPUT,
  validateInput,
  InputWithValidation,
} from "./InputWithValidation.jsx";
import { Spinner } from "./Spinner.jsx";
import { useNavigate, useMatches } from "react-router-dom";
import { useAppContext } from "../shared/appContext.jsx";

export const NavMenuLogin = ({ toggleLoginModal }) => {
  const [userNameInput, setUserNameInput] = useState(DEFAULT_INPUT);
  const [passwordInput, setPasswordInput] = useState(DEFAULT_INPUT);
  const [isRemembered, setIsRemembered] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const pathMatches = useMatches(); //mathces portions of the paths

  const navigate = useNavigate();

  const { api, message, setUser } = useAppContext();

  useEffect(() => {
    if (userNameInput.text === "" || passwordInput.text === "") {
      setIsRemembered(false);
    } else {
      setIsRemembered(true);
    }
  }, [userNameInput, passwordInput]);

  const loginHandler = (e) => {
    e.preventDefault();
    if (
      validateInput(userNameInput, "username", setUserNameInput) &&
      validateInput(passwordInput, "password", setPasswordInput)
    ) {
      setIsLoading(true);
      api.account
        .login(
          userNameInput.text,
          passwordInput.text,
          isRemembered,
          toggleLoginModal
        )
        .then((data) => {
          if (pathMatches[1].pathname === "/register") {
            navigate("/");
          }
          setIsLoading(false);
          setUser(data);
          toggleLoginModal();
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }
  };

  return (
    <Form>
      <InputWithValidation
        input={userNameInput}
        inputType={"username"}
        setInput={setUserNameInput}
      />

      <InputWithValidation
        input={passwordInput}
        inputType={"password"}
        setInput={setPasswordInput}
      />

      <FormGroup check>
        <Input
          id="exampleCheckbox"
          name="checkbox"
          type="checkbox"
          checked={isRemembered}
          onChange={(e) => setIsRemembered(e.target.checked)}
        />
        <Label check for="exampleCheckbox">
          Remember Me
        </Label>
      </FormGroup>

      {isLoading ? (
        <Spinner size="3rem" className="mt-2 justify-content" />
      ) : (
        <>
          <Button
            onClick={(e) => {
              loginHandler(e);
            }}
          >
            Log In
          </Button>
          <Button className="m-2" onClick={toggleLoginModal}>
            Cancel
          </Button>
          <span
            onClick={() => {
              navigate("/register");
              toggleLoginModal();
            }}
            tag="a"
            className="btn btn-link m-1"
          >
            Register
          </span>
          <div className="text-danger">{message}</div>
        </>
      )}
    </Form>
  );
};
