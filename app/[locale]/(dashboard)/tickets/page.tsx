"use client";
// import { createClient } from "@/utils/supabase/client";
// import { useEffect } from "react";
const Tickets = () => {
  // const supabase = createClient();

  // useEffect(() => {
  //   const checkUser = async () => {
  //     const { data, error } = await supabase.auth.getUser();
  //     const userId = data.user?.id;
  //     if (error) {
  //       console.log(error);
  //     }
  //     console.log(userId);
  //     const { error: errorMessage } = await supabase
  //       .from("user_profiles")
  //       .update({ is_subscribed: false })
  //       .eq("id", userId);
  //     if (errorMessage) {
  //       console.log(errorMessage);
  //     }
  //   };

  //   checkUser();
  // }, [supabase]);

  return (
    <main className="flex flex-grow flex-col justify-center dark:bg-dark items-center bg-gray-100">
      <h1>Tickets</h1>
      <p>Buy Tickets</p>
    </main>
  );
};

export default Tickets;
