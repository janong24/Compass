"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import Health from "./HealthPage";

export default function HealthView() {
	const router = useRouter();
	const { user } = useAuth();

	React.useEffect(() => {
		if (!user) router.push("/login");
	}, [user]);

	// if (!user) {
	//   return <div><Custom403/></div>
	// }

	return <Health />;
}
