"use client";
import Image from "next/image";

type Props = {
  image?: string;
  variants?: any[];
};

export default function ProductGallery({ image }: Props) {
  const safeImage = image || "/placeholder.jpg";

  return (
    <div className="w-full h-[500px] relative bg-gray-50 rounded-xl border flex items-center justify-center">
      <Image
        src={safeImage}
        alt="Product Image"
        fill
        className="object-contain p-4"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
}