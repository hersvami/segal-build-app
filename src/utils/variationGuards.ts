import type { Variation } from "../types/domain";

export function isVariationLocked(variation: Variation): boolean {
  return variation.status === "approved" && !!variation.customerSignature;
}

export function createRevision(variation: Variation): Variation {
  const now = new Date().toISOString();
  const baseTitle = variation.title.replace(/ \(Revision.*\)$/, "");
  const revisionTitle = `${baseTitle} (Revision)`;

  return {
    ...variation,
    id: Date.now().toString(36) + Math.random().toString(36).substring(2, 8),
    title: revisionTitle,
    status: "draft",
    customerSignature: "",
    customerComment: "",
    rejectionReason: "",
    sentAt: undefined,
    approvedAt: undefined,
    rejectedAt: undefined,
    createdAt: now,
  };
}
