import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import tw from "tailwind-styled-components";

export interface FormData {
  title: string;
  githubLink: string;
  walletAddress: string;
  description: string;
}

type UploadFileFormProps = {
  onSave: (values: any) => void;
  user?: any;
};

const schema = z.object({
  title: z.string().min(3).nonempty(),
  githubLink: z.string().url().nonempty(),
  walletAddress: z.string().nonempty(),
  description: z.string().nonempty(),
});

const UploadFileForm = ({ onSave, user = {} }: UploadFileFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: user,
    resolver: zodResolver(schema),
  });

  const handleSave = (formValues: FormData) => {
    onSave(formValues);
  };

  const errorState =
    errors.title ||
    errors.githubLink ||
    errors.walletAddress ||
    errors.description;

  return (
    <form onSubmit={handleSubmit(handleSave)}>
      <div className="text-left">
        <InputContainer>
          <InputHeader>🌟 Title</InputHeader>
          <InputBox>
            <Input
              placeholder="Write your Title here"
              {...register("title", {
                required: true,
                minLength: {
                  value: 3,
                  message: "Title must be at least 3 characters",
                },
              })}
            />
          </InputBox>
          {errors.title && (
            <ErrorMessage>
              <span className="font-semibold">Oh, snap!</span> Error Message
            </ErrorMessage>
          )}
        </InputContainer>
        <InputContainer>
          <InputHeader>📝 Description</InputHeader>
          <InputBox>
            <Input
              placeholder="Write your Description here"
              {...register("description", {
                required: true,
                minLength: {
                  value: 6,
                  message: "Description must be at least 6 characters",
                },
              })}
            />
          </InputBox>
          {errors.description && (
            <ErrorMessage>
              <span className="font-semibold">Oh, snap!</span> Error Message
            </ErrorMessage>
          )}
        </InputContainer>
        <InputContainer>
          <InputHeader>🚀 Wallet Address</InputHeader>
          <InputBox>
            <Input
              placeholder="Write your Wallet Address here"
              {...register("walletAddress", {
                required: true,
                pattern: {
                  value: /^0x[a-fA-F0-9]{40}$/,
                  message: "Wallet Address is invalid",
                },
              })}
            />
          </InputBox>
          {errors.walletAddress && (
            <ErrorMessage>
              <span className="font-semibold">Oh, snap!</span> Error Message
            </ErrorMessage>
          )}
        </InputContainer>
        <InputContainer>
          <InputHeader>😺 Github Link</InputHeader>
          <InputBox>
            <Input
              placeholder="Write your Github Link here"
              {...register("githubLink", {
                required: true,
                pattern: {
                  value: /^https?:\/\/github.com\/.+\/.+\/?$/,
                  message: "Github Link is invalid",
                },
              })}
            />
          </InputBox>
          {errors.githubLink && (
            <ErrorMessage>
              <span className="font-semibold">Oh, snap!</span> Error Message
            </ErrorMessage>
          )}
        </InputContainer>
        <div className="text-right">
          <SubmitButton
            type="submit"
            className={`${
              errorState
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
            }}`}
          >
            SUBMIT
          </SubmitButton>
        </div>
      </div>
    </form>
  );
};

export default UploadFileForm;

const SubmitButton = tw.button`
  cursor-pointer
  text-white
  font-bold
  py-2
  px-4
  rounded-[5px]
`;
const InputContainer = tw.div`
  border-b border-gray-100 mb-3
`;
const InputHeader = tw.h2`
  text-lg font-semibold leading-7 text-gray-800
`;
const InputBox = tw.div`
  my-2 flex rounded-[5px] shadow-md sm:max-w-md focus:outline-none
`;
const Input = tw.input`
rounded-[5px] ring-1 ring-inset ring-gray-200 flex-auto border-0 py-1.5 pl-2 text-gray-150 placeholder:text-gray-200 focus:ring-0 sm:text-sm sm:leading-6
`;
const ErrorMessage = tw.p`
  text-red-600
  text-sm
  mb-2
`;
