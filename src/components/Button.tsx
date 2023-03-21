import React from "react";
import tw from "twin.macro";

const Button = tw.button`px-3 py-1 rounded font-semibold text-white bg-gray-600 hover:bg-gray-700 duration-200 disabled:(pointer-events-none bg-gray-200 text-gray-400)`;

export default Button;