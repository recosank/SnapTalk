import { useState } from "react";
import { useRouter } from "next/router";
import { gql, useMutation } from "@apollo/client";

const Add_FPost = gql`
  mutation addFPost($title: String!) {
    addfpost(title: $title) {
      title
      user_name
    }
  }
`;

const Post = () => {
  const init = { title: "" };
  const [pInfo, setpInfo] = useState(init);
  const router = useRouter();

  const chgUserData = (e) => {
    e.preventDefault();
    setpInfo({ ...pInfo, [e.target.name]: e.target.value });
  };
  const [addpost, { data, loading, error }] = useMutation(Add_FPost);
  const handleaccount = (e) => {
    e.preventDefault();
    addpost({ variables: { title: pInfo.title } });
  };
  console.log(pInfo);
  if (loading) {
    return <p>loading</p>;
  }
  if (data) {
    console.log("data");
    console.log(data);
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
          <label className="text-xs ">title</label>
          <input
            type="text"
            placeholder="title"
            className="border-2 p-0.5 text-sm"
            value={pInfo.title}
            onChange={(e) => chgUserData(e)}
            name="title"
          />
        </div>

        <button className="border-2 " type="submit">
          boooom !!!
        </button>
      </form>
    </div>
  );
};

export default Post;
