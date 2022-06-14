import { useState } from "react";
import { useRouter } from "next/router";
import { gql, useMutation } from "@apollo/client";

const Add_FUser = gql`
  mutation addFUser(
    $fname: String!
    $confirmPassword: String!
    $password: String!
  ) {
    addfuser(
      fname: $fname
      confirmPassword: $confirmPassword
      password: $password
    ) {
      fname
    }
  }
`;

const Signup = () => {
  const init = { fname: "", password: "", confirmPassword: "" };
  const [uInfo, setuInfo] = useState(init);
  const router = useRouter();
  console.log(router);

  const chgUserData = (e) => {
    e.preventDefault();
    setuInfo({ ...uInfo, [e.target.name]: e.target.value });
  };
  const [adduser, { data, loading, error }] = useMutation(Add_FUser);
  const handleaccount = (e) => {
    e.preventDefault();
    adduser({
      variables: {
        fname: uInfo.fname,
        password: uInfo.password,
        confirmPassword: uInfo.confirmPassword,
      },
    });
  };
  console.log(uInfo);
  if (loading) {
    return <p>loading</p>;
  }
  if (data) {
    console.log(data.addfuser.fname);
    if (data.addfuser.fname === uInfo.fname) {
      localStorage.setItem("fantaUser", uInfo.fname);
      router.push("/addPost");
    }
  }
  if (error) {
    console.log(error);
  }
  return (
    <div className="flex justify-center items-center">
      <form
        action="/api/adduser"
        encType="multipart/form-data"
        className="border-4 mt-20 space-y-4 p-4"
        method="POST"
        onSubmit={handleaccount}
      >
        <div className="flex flex-col">
          <label className="text-xs ">username</label>
          <input
            type="text"
            placeholder="username"
            className="border-2 p-0.5 text-sm"
            value={uInfo.fname}
            onChange={(e) => chgUserData(e)}
            name="fname"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs ">password</label>
          <input
            type="password"
            placeholder="enter your password"
            name="password"
            className="border-2 p-0.5 text-sm"
            value={uInfo.password}
            onChange={(e) => chgUserData(e)}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs ">confirm password</label>
          <input
            type="password"
            placeholder="confirm password"
            name="confirmPassword"
            className="border-2 p-0.5 text-sm"
            value={uInfo.confirmPassword}
            onChange={(e) => chgUserData(e)}
          />
        </div>

        <button className="border-2 " type="submit">
          boooom !!!
        </button>
      </form>
    </div>
  );
};

export default Signup;
