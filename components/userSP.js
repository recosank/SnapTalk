import Image from "next/image";
import React from "react";
import profile from "../images/profile.jpg";

const UserSP = ({ data }) => {
  return (
    <div className="flex p-2 gap-2">
      <Image src={profile} width="40" height="40" className="rounded-full" />
      <div>
        <p className="text-xs">{data.fname}</p>
        <p className="text-sm text-gray-400">{data.pname}</p>
      </div>
    </div>
  );
};

export default UserSP;
