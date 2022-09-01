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
  const [addpost, { data, loading, error }] = useMutation(Add_FPost);
  const handleAddPost = (e) => {
    e.preventDefault();
    addpost({
      variables: { title: pInfo.title },
    });
  };

  if (loading) {
    return (
      <div class="flex justify-center h-screen items-center">
        <div
          class="spinner-border animate-spin border-black inline-block w-8 h-8 border-4 rounded-full"
          role="status"
        >
          <span class="visually-hidden"></span>
        </div>
      </div>
    );
  }
  if (data) {
    router.push("/");
  }
  if (error) {
    console.log(error);
  }
  return (
    <div className="h-screen bg-slate-50">
      <Header />
      <div className="flex justify-around w-2/3  h-4/5 mx-auto items-center">
        <div
          className="w-2/5 border-2 flex items-center rounded-xl justify-center border-dashed border-cyan-300 bg-white h-4/5"
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
          className="flex flex-col space-y-6"
          style={{ width: "30%" }}
          method="POST"
          onSubmit={handleAddPost}
        >
          <textarea
            type="text"
            rows={6}
            cols={25}
            placeholder="Caption"
            className="rounded-xl border-2  p-2 text-sm"
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
            className="rounded-full p-2 text-sm border-2"
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
