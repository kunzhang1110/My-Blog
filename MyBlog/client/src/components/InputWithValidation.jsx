import React from "react";
import { FormFeedback, FormGroup, Input, Label } from "reactstrap";

const _captalize = (string) => {
  return string[0].toUpperCase() + string.substring(1);
};

const _validateEmail = (str) => {
  return String(str)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const _validatePassword = (str) => {
  return String(str).match(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/
  ); //Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
};

export const DEFAULT_INPUT = {
  text: "",
  invalidText: "",
  isInvalid: false,
};

export const validateInput = (input, inputType, setInput) => {
  if (input.text === "") {
    //check if input is blank
    setInput({
      ...input,
      isInvalid: true,
      invalidText: `${_captalize(inputType)} cannot be blank`,
    });
    return false;
  }

  if (inputType === "email" && !_validateEmail(input.text)) {
    setInput({
      ...input,
      isInvalid: true,
      invalidText: `Invalid email`,
    });
    return false;
  }

  if (inputType === "password" && !_validatePassword(input.text)) {
    setInput({
      ...input,
      isInvalid: true,
      invalidText: `Invalid password. A password must have minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character`,
    });
    return false;
  }
  return true;
};

export const InputWithValidation = ({
  input = DEFAULT_INPUT,
  inputType,
  setInput,
  hasHiddenLabel = false,
}) => {
  return (
    <FormGroup>
      <Label hidden={hasHiddenLabel} for={inputType}>
        {_captalize(inputType)}
      </Label>
      <Input
        name={inputType}
        value={input.text}
        placeholder={_captalize(inputType)}
        invalid={input.isInvalid}
        type={inputType}
        onChange={(e) => {
          setInput({
            ...input,
            text: e.target.value,
            isInvalid: false,
            invalidText: "",
          });
        }}
      />
      <FormFeedback>{input.invalidText}</FormFeedback>
    </FormGroup>
  );
};
