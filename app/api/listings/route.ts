import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.error();
    }

    const body = await request.json();
    const {
      title,
      description,
      imageSrc,
      category,
      itemCount,
      location,
      price,
    } = body;

    // Validate required fields
    const missingFields = Object.keys({
      title,
      description,
      imageSrc,
      category,
      itemCount,
      location,
      price,
    }).filter((key) => !body[key]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        imageSrc,
        category,
        itemCount,
        locationValue: location?.value || null,
        price: parseInt(price, 10),
        userId: currentUser.id,
      },
    });

    return NextResponse.json(listing);
  } catch (error: unknown) {
    console.error("Error in POST /listings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
