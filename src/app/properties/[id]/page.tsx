import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import { fetchPropertyById } from "@/services/property.service";
import { PropertyDetailsView } from "@/components/property-details-view";
import type { Property } from "@/types/property";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const property = await fetchPropertyById(id);
    return {
      title: `${property.title} — RentNest`,
      description: property.description.slice(0, 160),
    };
  } catch {
    return {
      title: "Property Details — RentNest",
      description: "Explore verified rental properties on RentNest.",
    };
  }
}

export default async function PropertyDetailsPage({ params }: PageProps) {
  const { id } = await params;

  let property: Property | null = null;

  try {
    property = await fetchPropertyById(id);
  } catch {
    notFound();
  }

  if (!property) {
    notFound();
  }

  return <PropertyDetailsView property={property} />;
}
