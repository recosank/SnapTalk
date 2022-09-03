import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { gql, useMutation, useApolloClient } from "@apollo/client";
import { initializeApollo } from "../lib/apollo";
import Userpost from "../components/userpost";
import FollowPage from "../components/followpage";
import Header from "../components/header";
import FollowingPage from "../components/followingpage";
import profile from "../images/profile.jpg";
import def from "../images/def.jpg";

const Get_FPost = gql`
  query getfposts($fname: String!) {
    posts(fname: $fname) {
      title
      user_name
      likes
      puid
    }
    user(fname: $fname) {
      fname
      isopen
      pname
      following
      follow
    }
  }
`;
const Get_FUser = `
  {
  getFo
  }`;

const Add_Fl = gql`
  mutation addFlll($fname: String!) {
    addfl(fname: $fname)
  }
`;
const Rem_Fl = gql`
  mutation remFlll($fname: String!) {
    remfl(fname: $fname)
  }
`;

export default (props) => {
  const router = useRouter();
  const client = useApolloClient();
  let profileRef = useRef(null);
  const [isLogin, setisLogin] = useState(false);
  const [isUser, setisUser] = useState(false);
  const [isAllow, setisAllow] = useState(false);
  const [isPostOpen, setisPostOpen] = useState(false);
  const [isfoOpen, setisfoOpen] = useState(false);
  const [isflOpen, setisflOpen] = useState(false);
  const [loginname, setloginname] = useState("");

  let cacheData = client.readQuery({
    query: Get_FPost,
    variables: { fname: router.asPath.slice(1) },
  });
  const [adfl, { loading: ml, error: me }] = useMutation(Add_Fl, {
    update(cache, { data }) {
      cache.writeQuery({
        query: Get_FPost,
        data: {
          posts: [...cacheData.posts],
          user: {
            ...cacheData.user,
            follow: [...JSON.parse(data.addfl)],
          },
        },
        variables: {
          fname: router.asPath.slice(1),
        },
      });
    },
  });
  const [rmfl, { data: mrd, loading: mrl, error: mre }] = useMutation(Rem_Fl, {
    update(cache, { data }) {
      cache.writeQuery({
        query: Get_FPost,
        data: {
          posts: [...cacheData.posts],
          user: {
            ...cacheData.user,
            follow: [...JSON.parse(data.remfl)],
          },
        },
        variables: {
          fname: router.asPath.slice(1),
        },
      });
    },
  });

  const aaddfl = (e, user) => {
    e.preventDefault();
    adfl({
      variables: {
        fname: user,
      },
    });
  };

  const remfl = (e, user) => {
    e.preventDefault();
    rmfl({
      variables: {
        fname: user,
      },
    });
  };

  const handleAvtarChg = (e) => {
    e.preventDefault();
    const newProfile = e.target.files[0];
  };
  const handleAvtar = () => {
    profileRef.current.click();
  };
  const closePost = () => {
    setisPostOpen(false);
  };
  const closeFo = () => {
    setisfoOpen(false);
  };
  const closeFl = () => {
    setisflOpen(false);
  };

  useEffect(() => {
    let loginUser = JSON.parse(localStorage.getItem("fantaUser")).f;
    if (loginUser) {
      setisLogin(true);
      setloginname(loginUser);
    }
    if (isLogin && loginUser == router.asPath.slice(1)) {
      setisUser(true);
    } else if (
      isLogin &&
      !isUser &&
      cacheData.user.follow.includes(loginUser)
    ) {
      setisAllow(true);
    }
  }, [isLogin, isUser, cacheData]);

  return (
    <div className="border min-h-screen bg-slate-50">
      <Header />
      <div className="container  w-1/2 mx-auto mt-8">
        <div className="flex">
          <div className="w-2/6 pl-20 pb-5">
            <Image
              src={profile}
              className="rounded-full"
              width="150"
              height="150"
              onClick={handleAvtar}
            />
            <input
              type="file"
              className="hidden"
              onChange={handleAvtarChg}
              ref={profileRef}
              name="profile"
            />
          </div>
          <div className="w-2/5">
            <div className="flex">
              <p className="text-3xl font-normal text-gray-900">
                {cacheData.user.fname}
              </p>
              {isUser ? (
                <div className="flex gap-4">
                  <button
                    className="ml-8 px-3 text-black border font-bold rounded-md"
                    onClick={(e) => {
                      router.push("/accounts/edit");
                    }}
                  >
                    Edit Profile
                  </button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1}
                    onClick={(e) => router.push("/accounts/edit")}
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              ) : isAllow ? (
                <>
                  <button
                    className="ml-10 px-3 bg-white text-black border font-bold rounded-md"
                    onClick={(e) => router.push(`direct/${router.query.fname}`)}
                  >
                    Message
                  </button>
                  <button
                    className="ml-8 px-3 bg-white text-black border font-bold rounded-md"
                    onClick={(e) => {
                      e.preventDefault();
                      remfl(e, `${cacheData.user.fname}`);
                      setisAllow(false);
                    }}
                  >
                    unfollow
                  </button>
                </>
              ) : !cacheData.user.isopen ? (
                <button
                  className="ml-8 px-3 bg-cyan-600 text-white rounded-md"
                  onClick={(e) => {
                    aaddfl(e, `${cacheData.user.fname}`);
                    setisAllow(true);
                  }}
                >
                  Follow
                </button>
              ) : (
                <>
                  <button
                    className="ml-8 px-3 bg-white text-black border font-bold rounded-md"
                    onClick={(e) => router.push(`direct/${router.query.fname}`)}
                  >
                    Message{" "}
                  </button>
                  <button
                    className="ml-8 px-3 bg-cyan-600 text-white rounded-md"
                    onClick={(e) => {
                      aaddfl(e, `${cacheData.user.fname}`);
                    }}
                  >
                    Follow
                  </button>
                </>
              )}
            </div>
            <div className="flex py-4 text-center">
              <p className="mr-9 text-sm">
                <span className="font-semibold text-md mr-1">
                  {cacheData.posts.length}
                </span>
                posts
              </p>
              <p className="mr-9 text-sm " onClick={(e) => setisfoOpen(true)}>
                <span className="font-semibold text-md mr-1">
                  {cacheData.user.follow.length}
                </span>
                followers
              </p>
              <p className="mr-9 text-sm " onClick={(e) => setisflOpen(true)}>
                <span className="font-semibold text-md mr-1">
                  {cacheData.user.following.length}
                </span>
                following
              </p>
            </div>
            <p className="text-base font-semibold">{cacheData.user.pname}</p>
            <p className="text-base">
              The Official the big bang theory insta account youngsheldon.com
            </p>
          </div>
          {(isAllow || isPostOpen) && isfoOpen && (
            <FollowPage data={cacheData.user.follow} close={closeFo} />
          )}
          {(isAllow || isPostOpen) && isflOpen && (
            <FollowingPage data={cacheData.user.following} close={closeFl} />
          )}
        </div>
        {(isAllow || cacheData.user.isopen || isUser) && (
          <div className="border-t-2 mt-14">
            <div className="flex justify-center">
              <p className="border-t-2 text-xs mr-12 border-black py-2.5">
                POSTS
              </p>
              <p className="border-t-2 text-xs mr-12 border-black py-2.5">
                VIDEOS
              </p>
              <p className="border-t-2 text-xs mr-12 border-black py-2.5">
                TAGGED
              </p>
            </div>
            <div className="grid items mt-5 grid-cols-3 gap-7">
              {cacheData &&
                cacheData.posts.map((val, key) => {
                  return (
                    <div className="border" key={key}>
                      <Image
                        src={def}
                        className=""
                        width="300"
                        height="300"
                        onClick={(e) => {
                          e.preventDefault();
                          setisPostOpen((p) => !p);
                        }}
                      />
                      {isPostOpen && (
                        <Userpost data={val} user={loginname} c={closePost} />
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const getServerSideProps = async (ctx) => {
  const { req } = ctx;
  if (req?.headers.cookie) {
    let initialState;
    const apolloClient = await initializeApollo(
      (initialState = null),
      (ctx = ctx)
    );
    try {
      await apolloClient.query({
        query: Get_FPost,
        variables: { fname: ctx.params.fname },
      });
      return {
        props: {
          initialApolloState: await apolloClient.cache.extract(),
        },
      };
    } catch (error) {
      console.log("error [fname] ssr");
      console.log(error);
      const gqlError = error.networkErrors;
      if (gqlError) {
        console.log(gqlError);
      }
    }
  }

  return {
    redirect: {
      destination: "/signup",
      permanent: false,
    },
  };
};
