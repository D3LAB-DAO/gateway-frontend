import { isModalOpenAtom } from "@/core/state/globalState";
import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { useRecoilState } from "recoil";

const UploadFileModal = () => {
  const [isModalOpen, setIsModalOpen] = useRecoilState(isModalOpenAtom);

  return (
    <Transition.Root show={isModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setIsModalOpen}>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-[5px] bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-4">
                <div>
                  <div className="text-center">
                    <Dialog.Title as="h2" className="text-lg font-semibold">
                      UPLOAD FILES
                    </Dialog.Title>
                    <div className="mt-5">
                      <div>
                        <p>📸 Image</p>
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/jpg"
                          onChange={(e) => {
                            console.log(e.target.files);
                          }}
                        />
                      </div>
                      <div>📸 Image</div>
                      <div>📸 Image</div>
                      <div>📸 Image</div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default UploadFileModal;
