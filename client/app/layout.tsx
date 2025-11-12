"use client";

import "../styles/globals.css";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname.startsWith("/login");

  return (
    <html lang="pt-BR">
      <body>
        {!isLoginPage && (
          <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen pt-8 pb-20 gap-16">
            <section className="flex gap-6">
              <Link href="/" id="paginaAtual">Lista Orçamentos</Link>
              <Link href="/contatos">Contatos</Link>
              <Link href="/usuarios">Usuários</Link>
              <Link href="/">Sair</Link>
            </section>
            {children}
          </div>
        )}
        {isLoginPage && <>{children}</>}
      </body>
    </html>
  );
}
