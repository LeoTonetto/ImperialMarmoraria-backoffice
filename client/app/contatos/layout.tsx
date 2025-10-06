import React from "react";
import "../../styles/contatos.css";

export default function ContatosLayout({ children }: { children: React.ReactNode }) {
  return (
      <main>{children}</main>
  );
}