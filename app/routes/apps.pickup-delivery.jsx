import { prisma } from "../db.server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shopDomain = session.shop;

  const locations = await prisma.location.findMany({
    where: { shopDomain, active: true },
    orderBy: { name: "asc" },
  });

  return new Response(JSON.stringify({ locations }), {
    headers: { "Content-Type": "application/json" },
  });
};
