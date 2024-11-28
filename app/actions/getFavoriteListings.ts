import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

export default async function getFavoriteListings() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return [];
    }

    const favorites = await prisma.listing.findMany({
      where: {
        id: {
          in: [...(currentUser.favoriteIds || [])],
        },
      },
    });

    const safeFavorites = favorites.map((favorite) => ({
      ...favorite,
      createdAt: favorite.createdAt.toISOString(), // Using `toISOString` for consistency
    }));

    return safeFavorites;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message); // Explicitly handle `Error` instances
    }
    throw new Error("An unexpected error occurred."); // Fallback for non-Error types
  }
}
