import React from "react";

const Destemr = () => {
  return (
    // make a div with an h1 tag inside that says "Destemr". This h1 should be massive and centered. if the user is viewing on mobile, do not view this component.
    <div>
      <img
        src="/Logo.png"
        alt="background"
        className="hidden md:block py-8 px-6 w-full "
      />
    </div>
  );
};

export default Destemr;
