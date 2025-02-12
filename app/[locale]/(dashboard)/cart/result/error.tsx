"use client";

export default function Error({ error }: { error: Error }) {
  return <h3>{error.message}</h3>;
}
