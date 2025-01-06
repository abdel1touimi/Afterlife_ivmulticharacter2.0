import React from "react";
import { useEffect, useState } from "react";
import gif from "../../assets/loading.gif";
const Loading = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handlemessage = (event) => {
      switch (event.data.action) {
        case "loadingscreen":
          let id = document.getElementById("loading");
          id.style.opacity = 0;
          setTimeout(function () {
            setVisible(event.data.data);
          }, 5000);

          break;
      }
    };

    window.addEventListener("message", handlemessage);
    return () => window.removeEventListener("message", handlemessage);
  }, []);

  return (
    visible && (
      <>
        <div
          id="loading"
          className="flex items-center justify-center h-screen bg-black transition-opacity duration-1000"
        >
          <img
            className="absolute bottom-10 right-10 w-[150px]"
            src={gif}
            alt=""
          />
        </div>
      </>
    )
  );
};

export default Loading;
