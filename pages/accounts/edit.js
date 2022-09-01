import React, { useState } from "react";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import Header from "../../components/header";
import Image from "next/image";
import profile from "../../images/profile.jpg";

const update_profile = gql`
  mutation update_p($isopen: Boolean!, $pname: String!, $fname: String!) {
    update_fuser(isopen: $isopen, pname: $pname, fname: $fname) {
      fname
      isopen
    }
  }
`;

const Get_lg = gql`
  query getfposts {
    lg {
      fname
      isopen
      pname
    }
  }
`;
const EditProfile = () => {
  const { loading: qloading, error: qerror, data: qdata } = useQuery(Get_lg);
  const router = useRouter();
  const init = {
    fname: qdata ? qdata.lg.fname : "",
    pname: qdata ? qdata.lg.pname : "",
  };
  const [uInfo, setuInfo] = useState(init);
  const [isOpen, setisOpen] = useState(false);
  const chgUserData = (e) => {
    e.preventDefault();
    setuInfo({ ...uInfo, [e.target.name]: e.target.value });
  };
  const [uppPro, { data: md, loading: ml, error: me }] =
    useMutation(update_profile);

  const handleUp = (e) => {
    e.preventDefault();
    uppPro({
      variables: {
        isopen: isOpen,
        pname: uInfo.pname === "" ? qdata.lg.pname : uInfo.pname,
        fname: uInfo.fname === "" ? qdata.lg.fname : uInfo.fname,
      },
    });
  };

  return (
    <div className="bg-slate-50">
      <Header />
      <div className="flex mt-16 border w-6/12 h-screen mx-auto bg-white">
        <div className="w-3/12 border">
          <button className="pl-7 py-4 font-normal font-bold border-l-2 text-left border-black w-full">
            Edit Profile
          </button>
          <button
            onClick={(e) => router.push("chgpass")}
            className="pl-7 text-left py-4 font-normal  w-full"
          >
            Change Password
          </button>{" "}
          <button className="pl-7 text-left py-4 font-normal  w-full">
            Help
          </button>
        </div>
        <div className="w-4/5 border text-center">
          <div className="ml-40 space-y-4 mt-16">
            <div className="flex justify-start  items-center gap-9">
              <Image
                src={profile}
                className="rounded-full"
                width="40"
                height="40"
                layout="fixed"
              />
              <div className="w-1/2 text-left">
                <p className="text-lg">{qdata && qdata.fname}</p>
                <p className="text-sm text-sky-500">change profile photo</p>
              </div>
            </div>
            <div className="flex justify-start space-x-20 p-2">
              <label className="font-medium mt-1 text-right">Name</label>
              <div className="w-1/2 text-left space-y-3">
                <input
                  type="text"
                  className="border-gray-200 border rounded-sm p-1 pl-3"
                  value={uInfo.pname}
                  onChange={chgUserData}
                  name="pname"
                />
                <p className="text-xs text-slate-400">
                  Help people discover your account by using the name you're
                  known by: either your full name, nickname, or business name.
                </p>
                <p className="text-xs text-slate-400">
                  You can only change your name twice within 14 days.
                </p>
              </div>
            </div>
            <div className="flex justify-start space-x-12 p-2">
              <label className="font-medium mt-1 text-right">Username</label>
              <div className="w-1/2 text-left space-y-3">
                <input
                  type="text"
                  className="border-gray-200 border rounded-sm p-1 pl-3"
                  value={uInfo.fname}
                  onChange={chgUserData}
                  name="fname"
                />
                <p className="text-xs text-slate-400">
                  In most cases, you'll be able to change your username back to
                  reco_0v0 for another 14 days.
                  <span className="text-blue-700"> Learn more </span>
                </p>
              </div>
            </div>
            <div className="flex justify-start space-x-16 p-2">
              <label className="font-medium mt-1">Website</label>
              <input
                type="text"
                className="border-gray-200 border rounded-sm p-1 pl-3"
                placeholder="Website"
              />
            </div>
            <div className="flex justify-start text-right space-x-24 p-2">
              <label className="font-medium mt-1">Bio</label>
              <textarea
                type="text"
                className="border-gray-200 border rounded-sm p-1 pl-3"
                style={{ resize: "none" }}
              />
            </div>
            <div className="w-1/2 ml-32 text-start">
              <p className="text-sm text-slate-400 font-medium">
                Personal information
              </p>
              <p className="text-xs text-slate-400">
                Provide your personal information, even if the account is used
                for a business, a pet or something else. This won't be a part of
                your public profile..
              </p>
            </div>
            <div className="flex justify-start space-x-20 p-2">
              <label className="font-medium mt-1">Email</label>
              <input
                type="text"
                className="border-gray-200 border rounded-sm p-1 pl-3"
                placeholder="Website"
              />
            </div>
            <div className="flex justify-start space-x-3 p-2">
              <label className="font-medium mt-1">Phone number</label>
              <input
                type="text"
                className="border-gray-200 border rounded-sm p-1 pl-3"
                placeholder="Website"
              />
            </div>
            <div className="flex justify-start space-x-16 p-2">
              <label className="font-medium mt-1">Gender</label>
              <input
                type="text"
                className="border-gray-200 border rounded-sm p-1 pl-3"
                placeholder="Gender"
              />
            </div>
            <button
              onClick={(e) => handleUp(e)}
              className="px-3 py-1.5 font-medium rounded-md bg-sky-500 text-white text-center text-sm"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
