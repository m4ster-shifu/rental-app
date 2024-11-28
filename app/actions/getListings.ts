import prisma from "@/app/libs/prismadb";

export interface IListingsParams {
  userId?: string;
  itemCount?: number;
  startDate?: string;
  endDate?: string;
  locationValue?: string;
  category?: string;
}

export default async function getListings(params: IListingsParams) {
  try {
    const {
      userId,
      itemCount,
      locationValue,
      startDate,
      endDate,
      category,
    } = params;

    const query: Record<string, unknown> = {};

    if (userId) {
      query.userId = userId;
    }

    if (category) {
      query.category = category;
    }

    if (itemCount) {
      query.itemCount = {
        gte: itemCount,
      };
    }

    if (locationValue) {
      query.locationValue = locationValue;
    }

    if (startDate && endDate) {
      query.NOT = {
        reservations: {
          some: {
            OR: [
              {
                endDate: { gte: startDate },
                startDate: { lte: startDate },
              },
              {
                startDate: { lte: endDate },
                endDate: { gte: endDate },
              },
            ],
          },
        },
      };
    }

    const listings = await prisma.listing.findMany({
      where: query,
      orderBy: {
        createdAt: "desc",
      },
    });

    const safeListings = listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
    }));

    return safeListings;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching listings:", error.message);
    } else {
      console.error("An unknown error occurred while fetching listings.");
    }
    return [];
  }
}
