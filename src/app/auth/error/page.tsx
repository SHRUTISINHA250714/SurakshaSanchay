import { ErrorCard } from "@/components/auth/error-card";
import React, { Suspense } from "react";

const AuthErrorPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorCard />
    </Suspense>
  );
};

export default AuthErrorPage;
