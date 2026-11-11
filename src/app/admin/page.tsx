import type { Metadata } from "next";
import { Page } from "@/components/ui";
import { AdminApp } from "@/components/college/AdminApp";

export const metadata: Metadata = { title: "College registrations", robots: { index: false } };

export default function Admin() {
  return (
    <Page>
      <AdminApp />
    </Page>
  );
}
