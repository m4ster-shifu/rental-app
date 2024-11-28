'use client';

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useCallback } from "react";
import { TbPhotoPlus } from 'react-icons/tb'

declare global {
  let cloudinary: unknown; // Using 'unknown' for cloudinary type
}

const uploadPreset = "hz7k1sbe";

interface ImageUploadProps {
  onChange: (value: string) => void;
  value: string;
}

interface CloudinaryUploadResult {
  info: {
    secure_url: string;
  };
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  value
}) => {
  const handleUpload = useCallback((result: unknown) => {
    // Use type assertion to assert that result is of type CloudinaryUploadResult
    const uploadResult = result as CloudinaryUploadResult; 
    onChange(uploadResult.info.secure_url);
  }, [onChange]);

  return (
    <CldUploadWidget 
      onSuccess={handleUpload} 
      uploadPreset={uploadPreset}
      options={{
        maxFiles: 1
      }}
    >
      {({ open }) => {
        return (
          <div
            onClick={() => open?.()}
            className="relative cursor-pointer hover:opacity-70 transition border-dashed border-2 p-20 border-neutral-300 flex flex-col justify-center items-center gap-4 text-neutral-600"
          >
            <TbPhotoPlus size={50} />
            <div className="font-semibold text-lg">
              Click to upload
            </div>
            {value && (
              <div className="absolute inset-0 w-full h-full">
                <Image
                  fill 
                  style={{ objectFit: 'cover' }} 
                  src={value} 
                  alt="House" 
                />
              </div>
            )}
          </div>
        );
      }}
    </CldUploadWidget>
  );
}

export default ImageUpload;
