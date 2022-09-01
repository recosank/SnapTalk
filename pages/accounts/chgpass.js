import React, { useState } from "react";
import { useRouter } from "next/router";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client";
import Header from "../../components/header";
import Image from "next/image";
import profile from "../../images/profile.jpg";

const update_profile = gql`
  mutation update_p(
    $oldPassword: String!
    $confirmPassword: String!
    $password: String!
  ) {
    chgPass(
      confirmPassword: $confirmPassword
      oldPassword: $oldPassword
      password: $password
    ) {
      fname
      isopen
    }
  }
`;

const ChgPass = () => {
  const router = useRouter();
  const init = {
    oldPass: "",
    newPass: "",
    confirmNewPass: "",
  };
  const [uInfo, setuInfo] = useState(init);
  const chgUserData = (e) => {
    e.preventDefault();
    setuInfo({ ...uInfo, [e.target.name]: e.target.value });
  };
  const [upPro, { data: md, loading: ml, error: me }] =
    useMutation(update_profile);
  const handleUp = (e, isOpen) => {
    e.preventDefault();
    upPro({
      variables: {
        confirmPassword: uInfo.confirmNewPass,
        oldPassword: uInfo.oldPass,
        password: uInfo.newPass,
      },
    });
  };
  return (
    <div className="bg-slate-50">
      <Header />
      <div className="flex mt-16 border w-6/12 h-screen mx-auto bg-white">
        <div className="w-3/12 border">
          <button
            onClick={(e) => router.push("edit")}
            className="pl-7 py-4 font-normal text-left  w-full"
          >
            Edit Profile
          </button>
          <button className="pl-7 font-bold border-l-2 text-left border-black py-4 font-normal  w-full">
            Change Password
          </button>
          <button className="pl-7 text-left py-4 font-normal  w-full">
            Help
          </button>
        </div>
        <div className="w-4/5 border text-right">
          <div className="space-y-5 w-2/3 mt-16  ml-40">
            <div className="flex justify-center items-center gap-9">
              <Image
                src={profile}
                className="rounded-full"
                width="40"
                height="40"
                layout="fixed"
              />
              <p className="text-xl">reco_0v0</p>
            </div>
            <div className="flex justify-start space-x-20 p-2">
              <label className="font-medium mt-1">Old Password</label>
              <input
                type="password"
                placeholder="old password"
                className="border-gray-200 border rounded-sm p-1 pl-3"
                value={uInfo.oldPass}
                name="oldPass"
                onChange={(e) => chgUserData(e)}
              />
            </div>
            <div className="flex justify-start text-righ space-x-16 p-2">
              <label className="font-medium mt-1">New Password</label>
              <input
                type="password"
                placeholder="new password"
                className="border-gray-200 border rounded-sm p-1 pl-3"
                value={uInfo.newPass}
                name="newPass"
                onChange={(e) => chgUserData(e)}
              />
            </div>
            <div className="flex justify-start space-x-3.5 p-2">
              <label className="font-medium mt-1">Confirm New Password</label>
              <input
                type="password"
                placeholder="cofirm new password"
                className="border-gray-200 border rounded-sm p-1 pl-3"
                value={uInfo.confirmNewPass}
                name="confirmNewPass"
                onChange={(e) => chgUserData(e)}
              />
            </div>
            <button
              onClick={(e) => handleUp(e)}
              className="px-3 py-1.5 mt-4 font-medium rounded-md bg-sky-500 text-white text-center text-sm"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChgPass;
