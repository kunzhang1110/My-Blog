import React, { useState, useEffect } from "react";
import { Button, Form, FormGroup, Input, Label, Row, Col } from "reactstrap";
import { useAuth } from "../Auth";
import {
  DEFAULT_INPUT,
  validateInput,
  InputWithValidation,
} from "./InputWithValidation";
import { Spinner } from "./Spinner";
import { useNavigate } from "react-router-dom";

export const UserLogin = ({ toggleLoginModal }) => {
  const [usernameInput, setUsernameInput] = useState(DEFAULT_INPUT);
  const [passwordInput, setPasswordInput] = useState(DEFAULT_INPUT);
  const [isRemembered, setIsRemembered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, login, message } = useAuth();

  useEffect(() => {
    if (user.username === "") {
      setIsRemembered(false);
    }
  }, [user]);

  const loginHandler = (e) => {
    e.preventDefault();
    if (
      validateInput(usernameInput, "username", setUsernameInput) &&
      validateInput(passwordInput, "password", setPasswordInput)
    ) {
      setIsLoading(true);
      login(
        usernameInput.text,
        passwordInput.text,
        isRemembered,
        setIsLoading,
        toggleLoginModal
      );
    }
  };

  return (
    <Form>
      <InputWithValidation
        input={usernameInput}
        inputType={"username"}
        setInput={setUsernameInput}
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
