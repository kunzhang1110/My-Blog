import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, FormGroup, Row, Col } from "reactstrap";
import {
  DEFAULT_INPUT,
  validateInput,
  InputWithValidation,
} from "../components/InputWithValidation";
import { Spinner } from "../components/Spinner";
import { api } from "../app/api";

export const RegisterPage = () => {
  const [userNameInput, setUserNameInput] = useState(DEFAULT_INPUT);
  const [emailInput, setEmailInput] = useState(DEFAULT_INPUT);
  const [passwordInput, setPasswordInput] = useState(DEFAULT_INPUT);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const registerHandler = () => {
    setIsLoading(true);
    const user = {
      userName: userNameInput.text,
      email: emailInput.text,
      password: passwordInput.text,
    };

    api.account.register(user).then((resp) => {
      if (resp.status === "Success") {
        navigate("/");
      } else {
        setMessage(resp.message);
      }
      setIsLoading(false);
    });
  };
  const validateRegisterInputs = () => {
    return (
      validateInput(userNameInput, "username", setUserNameInput) &&
      validateInput(emailInput, "email", setEmailInput) &&
      validateInput(passwordInput, "password", setPasswordInput)
    );
  };

  return (
    <Row>
      <Col md="3"></Col>
      <Col md="6">
        <Form>
          <InputWithValidation
            input={userNameInput}
            inputType={"username"}
            setInput={setUserNameInput}
          />
          <InputWithValidation
            input={emailInput}
            inputType={"email"}
            setInput={setEmailInput}
          />
          <InputWithValidation
            input={passwordInput}
            inputType={"password"}
            setInput={setPasswordInput}
          />

          <FormGroup className="d-inline-flex">
            <Button
              color="primary"
              onClick={(e) => {
                if (validateRegisterInputs()) {
                  registerHandler(e);
                }
              }}
              className="btn-loading"
            >
              {isLoading ? (
                <Spinner size="1.2rem" className="justify-content-center" />
              ) : (
                "Register"
              )}
            </Button>
            <Button className="mx-2" onClick={() => navigate("/")}>
              Cancel
            </Button>
            <div className="mt-2">{message}</div>
          </FormGroup>
        </Form>
      </Col>
    </Row>
  );
};
