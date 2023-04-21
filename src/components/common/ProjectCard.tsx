import Image from "next/image";
import React, { useEffect, useState } from "react";
import tw from "tailwind-styled-components";
import { sliceAddress } from "@/core/utils/numberFormatter";
import CopyIcon from "./CopyIcon";
import { useRecoilState, useRecoilValue } from "recoil";
import { useProjectQuery } from "@/core/hooks/useProjectQuery";
import { getAddressAtom, getProjectIdAtom } from "@/core/state/globalState";
import { useActionTx } from "@/core/hooks/useActionTx";
import {
  TransactionStatus,
  TransactionType,
  transactionStatusAtom,
} from "@/core/state/transactionState";
import Button from "./Button";

export type ProjectType = {
  uniqueId: number;
  description: string;
  address: string;
  githubLink: string;
};

const projectList: ProjectType[] = [
  {
    uniqueId: 1,
    description:
      "Character AI Bot is an innovative generative AI-driven solution that brings fictional characters to life.",
    address: "archway1dqqfypr9a98czeh23a64eh6a0y7cqhycrzsm6a",
    githubLink: "https://github.com/openai",
  },
  {
    uniqueId: 2,
    description:
      "Auto Drawing is a cutting-edge generative AI solution that turns your textual descriptions into captivating visual content.",
    address: "archway1cf6fpd3y2e3mv0m22zyuqm2tcqc3g498z0jw6u",
    githubLink: "https://github.com/midjourney",
  },
  {
    uniqueId: 3,
    description:
      "Adrenaline-pumping virtual reality gun shooting game that transports you to a thrilling world of action and adventure.",
    address: "archway1zk645ch525zrdgwfzmrq57x4urgmqk65n65v6q",
    githubLink: "https://github.com/facebook",
  },
];

function removeDuplicateArray(arr: ProjectType[], key: string) {
  return arr.filter(
    (item: any, index, self) =>
      index === self.findIndex((t: any) => t[key] === item[key])
  );
}

const ProjectCard = () => {
  const projectId = useRecoilValue(getProjectIdAtom);
  const userAddress = useRecoilValue(getAddressAtom);
  const [transactionStatus, setStatus] = useRecoilState(transactionStatusAtom);
  const [hasValue, setHasValue] = useState<boolean>(true);
  const { queryProject, newProjectInfo } = useProjectQuery();
  const { executeAction } = useActionTx();

  useEffect(() => {
    queryProject(projectId);
  }, [projectId]);

  if (newProjectInfo) projectList.push(newProjectInfo);

  console.log("projectList", projectList);

  const filterdProjectList = removeDuplicateArray(projectList, "uniqueId");
  const [inputValues, setInputValues] = useState([""]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = e.target.value;
    setInputValues(newInputValues);
  };

  const handleAction = async (id: number) => {
    setStatus({
      status: TransactionStatus.EXECUTING,
      type: TransactionType.ACTION,
    });

    const result = await executeAction(userAddress, id, inputValues[id]);

    if (!result) {
      setStatus({
        status: TransactionStatus.FAILED,
        type: TransactionType.ACTION,
      });
      return;
    }

    setStatus({
      status: TransactionStatus.IDLE,
      type: TransactionType.ACTION,
    });

    setInputValues([""]);
  };

  const projectNameMapping = [
    "Character AI Bot",
    "Auto Drawing",
    "VR Gun Shooting Game",
  ];

  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
    >
      {filterdProjectList.map((item) => (
        <li
          key={`${item.uniqueId}/${item.address}}`}
          className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-2xl bg-white text-center shadow"
        >
          <div className="flex flex-1 flex-col p-4">
            <Image
              className="mx-auto flex-shrink-0 rounded-full"
              src={`/image_${item.uniqueId % 4}.png`}
              width={500}
              height={500}
              alt="projects"
            />
            <InputHeader>
              #{item.uniqueId}.{" "}
              {item.uniqueId > 3
                ? "Chat GPT-4 Bot"
                : projectNameMapping[item.uniqueId - 1]}
            </InputHeader>
            <p className="text-sm text-gray-500">{item.description}</p>

            <div className="rounded-2xl bg-gray-900 text-center shadow px-6 mt-3">
              <InputHeader className="text-left text-white">
                🚀 Wallet Address
                <p className="text-xs font-normal">
                  {sliceAddress(item.address, 8)}{" "}
                  <CopyIcon text={item.address} />
                </p>
              </InputHeader>
              <InputHeader className="text-left text-white mb-6 mt-4">
                😺 Github Link
                <p className="text-xs font-normal">
                  {item.githubLink} <CopyIcon text={item.githubLink} />
                </p>
              </InputHeader>
            </div>
            <InputContainer>
              <InputHeader className="text-left">🔎 Action Input</InputHeader>
              <InputBox>
                <Input
                  onChange={(e) => handleChange(e, item.uniqueId)}
                  placeholder="Action this project!"
                  value={inputValues[item.uniqueId]}
                  type="text"
                />
              </InputBox>
              <InputHeader className="text-left">⚡️ Action Output</InputHeader>
              <div className="py-2 text-left">
                <p className="text-xs font-normal"></p>
              </div>
            </InputContainer>

            <Button
              transactionStatus={transactionStatus}
              hasValue={hasValue}
              onClick={() => handleAction(item.uniqueId)}
              buttonText="ACTION"
            />
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ProjectCard;

const InputContainer = tw.div`
  border-b border-gray-100 mb-3
`;
const InputHeader = tw.div`
  text-md font-semibold leading-7 text-gray-800 mt-3
`;
const InputBox = tw.div`
  my-2 flex rounded-[5px] shadow-md sm:max-w-md focus:outline-none
`;
const Input = tw.input`
rounded-[5px] ring-1 ring-inset ring-gray-200 flex-auto border-0 py-1.5 pl-2 text-gray-150 placeholder:text-gray-200 focus:ring-0 sm:text-sm sm:leading-6
`;
