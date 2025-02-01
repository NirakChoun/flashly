import React from "react";

const Footer = () => {
  return (
    <footer className="flex justify-between p-5 items-center bg-white dark:bg-gray-900">
      <div className="copyright">&#169; 2025 Flashly</div>
      <div className="creator">
        Created by
        <a
          href="https://github.com/NirakChoun/flashly"
          className="text-blue-800 lg:text-xl dark:text-secondary"
        >
          {" "}
          Choun Chan Nirak
        </a>
      </div>
    </footer>
  );
};

export default Footer;
