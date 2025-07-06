import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // In Cloudflare Access, if we can't get user data, it means:
  // 1. User is not authenticated (behind Cloudflare Access)
  // 2. Or there's a server error
  const isAuthenticated = !!user && !error;

  return {
    user,
    isLoading,
    isAuthenticated,
    // For Cloudflare Access, authentication is handled at the edge
    // Users can't directly login/logout through the app
    canManageAuth: false, // This indicates auth is managed externally
  };
}