import React, { useState } from "react";
import bytes from "bytes";
import useShowToast from "./useShowToast";

const usePreviewImage = () => {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const showToast = useShowToast();
  const handleImageChange = (evt: React.FormEvent<HTMLInputElement>) => {
    //@ts-expect-error files prop
    const file: File = evt.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const fileSize = bytes(file.size, {
        unit: "MB",
        decimalPlaces: 2,
        unitSeparator: " ",
      }).split(" ")[0];
      if (Number(fileSize) > 9) {
        showToast(
          "File limit exceeded",
          "Image size should be less than 9 MB.",
          "error"
        );
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setImgUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      showToast("Invalid file type", "Please select an image file", "error");
      setImgUrl(null);
    }
  };
  return { imgUrl, handleImageChange };
};

export default usePreviewImage;
