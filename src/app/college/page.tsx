import type { Metadata } from "next";
import { Page } from "@/components/ui";
import { CollegeApp } from "@/components/college/CollegeApp";

export const metadata: Metadata = { title: "For colleges", description: "An anonymous dashboard for college counsellors: how students are doing, never who." };

export default function College() {
  return (
    <Page>
      <CollegeApp />
    </Page>
  );
}
