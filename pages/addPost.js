import { useState, useRef } from "react";
import { useRouter } from "next/router";
import { gql, useMutation } from "@apollo/client";
import Header from "../components/header";

const Add_FPost = gql`
  mutation addFPost($title: String!) {
    addfpost(title: $title) {
      title
      user_name
      puid
    }
  }
`;

const Post = () => {
  const router = useRouter();
  const init = { title: "" };
  const [pInfo, setpInfo] = useState(init);
  const ref = useRef(null);
  const [fileInput, setfileInput] = useState("");
  const [source, setsource] = useState("");
  const handleRef = () => {
    ref.current.click();
  };
  const handleFile = (e) => {
    const file = e.target.files[0];
    previewFile(file);
  };
  const previewFile = (f) => {
    const reader = new FileReader();
    reader.readAsDataURL(f);
    reader.onloadend = () => {
      setsource(reader.result);
    };
  };
  const handlePData = (e) => {
    e.preventDefault();
    setpInfo({ ...pInfo, [e.target.name]: e.target.value });
  };
  const [addpost, { data: md, loading: ml, error: me }] =
    useMutation(Add_FPost);
  const handleAddPost = (e) => {
    e.preventDefault();
    addpost({
      variables: { title: pInfo.title },
    });
  };

  return (
    <div className="h-screen bg-slate-50">
      <Header />
      <div className="container flex justify-around h-4/5 mx-auto items-center">
        <div
          className="w-1/3 border-2 flex items-center rounded-xl justify-center border-dashed border-cyan-300 bg-white h-4/5"
          onClick={handleRef}
        >
          {source ? (
            <img
              src={source}
              className="w-full h-full object-center object-contain"
            />
          ) : (
            <div className="" onClick={handleRef}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </div>
          )}
        </div>
        <form
          action="/api/adduser"
          encType="multipart/form-data"
          className="flex flex-col  w-1/4  space-y-6"
          method="POST"
          onSubmit={handleAddPost}
        >
          <textarea
            type="text"
            rows={6}
            cols={20}
            placeholder="Caption"
            className="rounded-xl p-2 text-sm"
            style={{ resize: "none" }}
            value={pInfo.title}
            onChange={(e) => handlePData(e)}
            name="title"
          />
          <input
            type="file"
            placeholder="title"
            className="hidden"
            value={fileInput}
            ref={ref}
            onChange={handleFile}
            name="image"
            accept="image/*"
          />
          <input
            type="text"
            placeholder="Tags"
            className="rounded-full p-2 text-sm"
            name="tags"
          />
          <button
            className="flex-item text-lg self-end w-20 font-bold text-cyan-400"
            type="submit"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default Post;
