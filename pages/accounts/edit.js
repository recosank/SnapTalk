import React from "react";
import Header from "../../components/header";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client";
import { useState } from "react";

const update_profile = gql`
  mutation update_p($isopen: Boolean!) {
    update_fuser(isopen: $isopen) {
      fname
      isopen
    }
  }
`;

const EditProfile = () => {
  const [upPro, { data: md, loading: ml, error: me }] =
    useMutation(update_profile);
  console.log(md);
  const [isOpen, setisOpen] = useState(false);
  const handleUp = (e, isOpen) => {
    e.preventDefault();

    upPro({
      variables: {
        isopen: isOpen,
      },
    });
  };
  return (
    <>
      <Header />
      <div className="flex mt-7 border w-6/12 h-screen mx-auto ">
        <div className="w-3/12 border">
          <button className="pr-10 py-4 font-normal border-l-4 border-black w-full">
            Edit Profile
          </button>
          <button className="pr-10 py-4 font-normal  w-full">
            Change Password
          </button>{" "}
          <button className="pr-10 py-4 font-normal  w-full">
            Apps and Websites
          </button>{" "}
          <button className="pr-10 py-4 font-normal  w-full">
            Email notifications
          </button>{" "}
          <button className="pr-10 py-4 font-normal  w-full">
            Privacy and Security{" "}
          </button>{" "}
          <button className="pr-10 py-4 font-normal  w-full">Help</button>
        </div>
        <div className="w-4/5 border text-center">
          <input
            type="checkbox"
            defaultChecked={isOpen}
            onChange={(e) => setisOpen((p) => !p)}
          />
          <label>private account</label>
          <button onClick={(e) => handleUp(e, isOpen)}>submit</button>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
